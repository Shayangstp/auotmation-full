import React, { Fragment, useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning } from "@fortawesome/free-solid-svg-icons";
import xssFilters from "xss-filters";
import { rootContext } from "../../../context/rootContext";
import { RsetActionToPersonsModal, selectUser, selectFormErrors, RsetFormErrors } from "../../../Slices/mainSlices";
import {
    selectInDecLeaveUser, RsetInDecLeaveUser, selectInDecLeaveType, RsetInDecLeaveType, selectInDecLeaveReason,
    RsetInDecLeaveReason, selectInDecLeaveMinutes, RsetInDecLeaveMinutes, selectLeaveDescription, RsetLeaveDescription,
    handleResetInDecLeaveForm
} from "../../../Slices/leaveSlice";
import NumberFormat from 'react-number-format';
import { errorMessage } from './../../../../utils/message';


const InDecLeaveRegistration = ({ setPageTitle }) => {
    // const mainContext = useContext(rootContext);
    // const {
    //     handleCheckPermission,
    //     menuPermission,
    // } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])
    useEffect(() => {
        setPageTitle('ثبت افزایش/کاهش مرخصی');
    }, [setPageTitle])

    const dispatch = useDispatch();
    const inDecLeaveUser = useSelector(selectInDecLeaveUser);
    const inDecLeaveType = useSelector(selectInDecLeaveType);
    const inDecLeaveReason = useSelector(selectInDecLeaveReason);
    const inDecLeaveMinutes = useSelector(selectInDecLeaveMinutes);
    const leaveDescription = useSelector(selectLeaveDescription);

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!inDecLeaveUser.value) {
            errors.inDecLeaveUser = "انتخاب پرسنل اجباری است!";
        }
        if (!inDecLeaveReason) {
            errors.inDecLeaveReason = "انتخاب علت اجباری است!";
        }
        if (!inDecLeaveMinutes) {
            errors.inDecLeaveMinutes = "واردکردن دقیقه مرخصی اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (inDecLeaveUser.value !== undefined && inDecLeaveReason.value !== undefined && inDecLeaveMinutes !== '') {
            console.log('55')
        } else {
            dispatch(RsetFormErrors(
                validation({
                    inDecLeaveUser: inDecLeaveUser,
                    inDecLeaveReason: inDecLeaveReason,
                    inDecLeaveMinutes: inDecLeaveMinutes
                })
            ));
        }
    }

    return (
        <Container>
            {/* {menuPermission ? */}
            <Fragment>
                <Form>
                    <Row>
                        <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>پرسنل: </Form.Label>
                            <Select value={inDecLeaveUser} name="inDecLeaveUser" onChange={(e) => { dispatch(RsetInDecLeaveUser(e)) }} placeholder='انتخاب...' options={[{ label: 'همه', value: 1 }]}
                                className={formErrors.overTimeReasonValue && !inDecLeaveUser.value ? 'border border-danger' : ''} />
                            {!inDecLeaveUser.value && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.inDecLeaveUser}
                                </p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4 d-flex align-items-center justify-content-center'>
                            <div className="d-flex align-items-center me-4">
                                <input type='radio' name='inDecLeaveType' value={inDecLeaveType} defaultChecked={inDecLeaveType} onChange={(e) => { dispatch(RsetInDecLeaveType(!inDecLeaveType)) }} />
                                <Form.Label className='ms-2 font12 mb-0'> افزایش </Form.Label>
                            </div>
                            <div className="d-flex align-items-center">
                                <input type='radio' name='inDecLeaveType' value={!inDecLeaveType} defaultChecked={!inDecLeaveType} onChange={(e) => { dispatch(RsetInDecLeaveType(!inDecLeaveType)) }} />
                                <Form.Label className='ms-2 font12 mb-0'> کاهش </Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>به علت: </Form.Label>
                            <Select value={inDecLeaveReason} name="inDecLeaveReason" onChange={(e) => { dispatch(RsetInDecLeaveReason(e)) }} placeholder='انتخاب...' options={[{ label: 'تغییر شیفت', value: 1 }]} />
                            {!inDecLeaveReason.value && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.inDecLeaveReason}
                                </p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>دقیقه: </Form.Label>
                            <NumberFormat className={formErrors.inDecLeaveMinutes && !inDecLeaveMinutes ? 'form-control border border-danger' : 'form-control'} name='inDecLeaveMinutes' maxLength='3' value={inDecLeaveMinutes} onChange={e => {
                                if (e.target.value <= 480) {
                                    dispatch(RsetInDecLeaveMinutes(e.target.value))
                                } else {
                                    dispatch(RsetInDecLeaveMinutes(''))
                                    errorMessage('دقیقه باید کمتر از 480 باشه!')
                                }
                            }} />
                            {!inDecLeaveMinutes && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.inDecLeaveMinutes}
                                </p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md='12'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control as="textarea" rows={10} maxLength={2000} name='leaveDescription' value={leaveDescription} onChange={e => dispatch(RsetLeaveDescription(e.target.value))} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                            <Button variant='success' id='confirmReq' onClick={(e) => {
                                submitFormBtn(e)
                            }}>
                                ثبت درخواست
                            </Button>
                            <Button variant='primary' id='sendToPersons' className='mx-3 disabled d-none' onClick={(e) => {
                                //dispatch(RsetActionToPersonsModal(true))
                            }}>
                                ارسال
                            </Button>
                            <Button variant='secondary' type='reset' onClick={() => {
                                dispatch(handleResetInDecLeaveForm());
                            }}>
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
            {/* :
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                            کاربر گرامی شما به این بخش دسترسی ندارید. 
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">   
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2'/>
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
export default InDecLeaveRegistration;