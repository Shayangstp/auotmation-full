import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Loading from "../Common/Loading";
import { iranTolJobCntxt } from "../context/iranTolJobContext/IranTolJobCntxt";
import { rootContext } from "../context/rootContext";
import AddFileInput from './../Common/File/AddFileInput';
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons';


const IranTolJobRegistration = ({ setPageTitle }) => {

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        loading
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    const jobContext = useContext(iranTolJobCntxt);
    const {
        handleITJProjectTools,
        handleITJProjectTypes,
        iTJProjectName,
        setITJProjectName,
        iTJProjectNameRef,
        iTJProjectType,
        setITJProjectType,
        iTJProjectTypeRef,
        iTJProjectTypeSelect,
        iTJProjectTool,
        setITJProjectTool,
        iTJProjectToolRef,
        iTJProjectToolSelect,
        iTJProjectAmount,
        setITJProjectAmount,
        iTJProjectAmountRef,
        iTJProjectDeadline,
        setITJProjectDeadline,
        iTJProjectDesc,
        setITJProjectDesc,
        handleConfirmITJReq,
        handleResetITJReq,
        setActionToPersonsModal
    } = jobContext;

    useEffect(() => {
        setPageTitle('ثبت درخواست کار');
        handleITJProjectTools();
        handleITJProjectTypes();
    }, [setPageTitle])
    return (
        <Container fluid className="pb-4">
            {/* {menuPermission ? */}
            <section className="lightGray2-bg p-3 shadow mt-5 borderRadius border border-white border-2">
                <div className="shadow p-4 mb-5 borderRadius lightGray-bg  border border-white font16">
                    فرم ثبت درخواست کار
                </div>
                <Form className="position-relative">
                    {loading && <Loading />}
                    <Row>
                        <Form.Group as={Col} md='12' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>نام پروژه: </Form.Label>
                            <Form.Control name='iTJProjectName' value={iTJProjectName} onChange={e => setITJProjectName(e.target.value)} ref={iTJProjectNameRef} />
                            <div id='iTJProjectName-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن نام پروژه اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>نوع فرایند: </Form.Label>
                            <Select value={iTJProjectType} name="iTJProjectType" onChange={(e) => { setITJProjectType(e); }} placeholder='انتخاب...' options={iTJProjectTypeSelect} ref={iTJProjectTypeRef} />
                            <div id='iTJProjectType-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب نوع فرایند اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>نوع پروژه: </Form.Label>
                            <Select value={iTJProjectTool} name="iTJProjectTool" onChange={(e) => { setITJProjectTool(e); }} placeholder='انتخاب...' options={iTJProjectToolSelect} ref={iTJProjectToolRef} />
                            <div id='iTJProjectTool-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب نوع پروژه اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>تعداد: </Form.Label>
                            <NumberFormat type="text" value={iTJProjectAmount} thousandSeparator="," name="iTJProjectAmount" id='reqItemAmount'
                                onChange={(e) => { setITJProjectAmount(e.target.value) }} dir='ltr' className='form-control'
                                getInputRef={iTJProjectAmountRef}
                            />
                            <div id='iTJProjectAmount-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب تعداد اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>تاریخ مدنظر مشتری: </Form.Label>
                            <DatePicker
                                setTodayOnBlur={true}
                                timePicker={false}
                                inputReadOnly
                                name="iTJProjectDeadline"
                                isGregorian={false}
                                inputFormat="YYYY-MM-DD"
                                inputJalaaliFormat="jYYYY/jMM/jDD"
                                value={iTJProjectDeadline}
                                className="form-control"
                                onChange={e => { setITJProjectDeadline(e) }}
                            />
                        </Form.Group>
                        <AddFileInput />
                        <Form.Group as={Col} md='12'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control as="textarea" rows={10} maxLength={2000} name='iTJProjectDesc' value={iTJProjectDesc} onChange={e => setITJProjectDesc(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between flex-wrap mt-4'>
                            <Button variant='success' id='confirmITJReq' onClick={(e) => handleConfirmITJReq()}>
                                ثبت درخواست
                            </Button>
                            <Button variant='primary' id='sendToPersons' className='mx-3 disabled' onClick={(e) => setActionToPersonsModal(true)}>
                                ارسال
                            </Button>
                            <Button variant='secondary' type='reset' onClick={handleResetITJReq}>
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {/* :
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24' />
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                                کاربر گرامی شما به این بخش دسترسی ندارید.
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2' />
                                        صفحه اصلی
                                    </Button>
                                </Link>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            } */}
            </section>
        </Container>
    )
}
export default IranTolJobRegistration;