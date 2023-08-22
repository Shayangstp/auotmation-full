import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { rootContext } from "../../context/rootContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons';

const MissionReqRegistration = ({ setPageTitle }) => {

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        handleAllProvinces,
        allProvincesSelect,
        handleAllCities,
        allCitiesSelect,
        handleGetCompanies,
        companies,
        officeMissionToDate,
        setOfficeMissionToDate,
    } = mainContext;
    // useEffect(() => {
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // }, [])

    const officeContext = useContext(officeReqContext);
    const {
        officeMissionInCity,
        setOfficeMissionInCity,
        officeMissionSubject,
        setOfficeMissionSubject,
        officeMissionSubjectRef,
        officeMissionCity,
        setOfficeMissionCity,
        officeMissionCityRef,
        officeMissionProvince,
        setOfficeMissionProvince,
        officeMissionProvinceRef,
        officeMissionFactory,
        setOfficeMissionFactory,
        officeMissionFromDate,
        setOfficeMissionFromDate,
        officeMissionFromDateRef,
        officeMissionToDateRef,
        handleGetAllTripTypes,
        allTripTypesSelect,
        officeMissionType,
        setOfficeMissionType,
        officeMissionTypeRef,
        officeMissionDescription,
        setOfficeMissionDescription,
        officeMissionOverTimeFromDate,
        setOfficeMissionOverTimeFromDate,
        officeMissionOverTimeToDate,
        setOfficeMissionOverTimeToDate,
        officeMissionMealExpense,
        setOfficeMissionMealExpense,
        officeMissionTransportation,
        setOfficeMissionTransportation,
        officeOtherExpenses,
        setOfficeOtherExpenses,
        handleOfficeNewMissionReq,
        handleOfficeNewMissionReset
    } = officeContext;

    useEffect(() => {
        setPageTitle('ثبت درخواست ماموریت');
        handleAllProvinces();
        handleGetAllTripTypes();
        handleGetCompanies();
    }, [setPageTitle])
    return (
        <Container>
            {/* {menuPermission ? */}
                <Form>
                    <Row className='mb-5'>
                        <Col className='text-center text-md-start d-block d-md-flex align-items-center'>
                            <h1 className='font16 mb-0'>ماموریت </h1>
                            <div className="d-flex justify-content-center">
                                <div className='ms-md-4'>
                                    <label className="me-2">برون شهری</label>
                                    <Form.Check
                                        className='d-inline-block'
                                        type="switch"
                                        id="custom-switch"
                                        label="درون شهری"
                                        checked={officeMissionInCity}
                                        onChange={() => { setOfficeMissionInCity(!officeMissionInCity) }}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md='12' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>موضوع: </Form.Label>
                            <Form.Control name='officeMissionSubject' value={officeMissionSubject} onChange={e => setOfficeMissionSubject(e.target.value)} ref={officeMissionSubjectRef}/>
                            <div id='officeMissionSubject-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن موضوع ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>استان: </Form.Label>
                            <Select ref={officeMissionProvinceRef} value={officeMissionProvince} name="officeMissionProvince" onChange={(e) => { setOfficeMissionProvince(e);handleAllCities(e.value); }} placeholder='انتخاب...' options={allProvincesSelect}/>
                            <div id='officeMissionProvince-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب استان ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>شهر: </Form.Label>
                            <Select ref={officeMissionCityRef} value={officeMissionCity} name="officeMissionCity" onChange={(e) => { setOfficeMissionCity(e) }} placeholder='انتخاب...' options={allCitiesSelect}/>
                            <div id='officeMissionCity-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب شهر ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>کارخانه: </Form.Label>
                            <Select value={officeMissionFactory} name="officeMissionFactory" onChange={(e) => { setOfficeMissionFactory(e) }} placeholder='انتخاب...' options={companies}/>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>تاریخ شروع: </Form.Label>
                            <DatePicker
                                ref={officeMissionFromDateRef}
                                setTodayOnBlur={true}
                                timePicker={false}
                                inputReadOnly
                                name="officeMissionFromDate"
                                isGregorian={false}
                                inputFormat="YYYY-MM-DD"
                                inputJalaaliFormat="jYYYY/jMM/jDD"
                                value={officeMissionFromDate}
                                className="form-control"
                                onChange={e => { setOfficeMissionFromDate(e) }}
                            />
                            <div id='officeMissionFromDate-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب مقصد ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>تاریخ اتمام: </Form.Label>
                            <DatePicker
                                ref={officeMissionToDateRef}
                                setTodayOnBlur={true}
                                timePicker={false}
                                inputReadOnly
                                name="officeMissionToDate"
                                isGregorian={false}
                                inputFormat="YYYY-MM-DD"
                                inputJalaaliFormat="jYYYY/jMM/jDD"
                                value={officeMissionToDate}
                                className="form-control"
                                onChange={e => { setOfficeMissionToDate(e) }}
                            />
                            <div id='officeMissionToDate-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب مقصد ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>نوع سفر: </Form.Label>
                            <Select ref={officeMissionTypeRef} value={officeMissionType} name="officeMissionType" onChange={(e) => { setOfficeMissionType(e) }} placeholder='انتخاب...' options={allTripTypesSelect}/>
                            <div id='officeMissionType-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب نوع سفر اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='12'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control as="textarea" rows={10} maxLength={2000} name='officeMissionDescription' value={officeMissionDescription} onChange={e => setOfficeMissionDescription(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                            <Button variant='success' className='w-45' onClick={(e) => handleOfficeNewMissionReq()}>
                                ثبت درخواست
                            </Button>
                            <Button variant='secondary' type='reset' className='w-45' onClick={handleOfficeNewMissionReset}>
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
        </Container>
    )
}
export default MissionReqRegistration;