import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons';

const JobChangeReqRegistration = ({setPageTitle}) => {
    const mainContext = useContext(rootContext);
    const {
        handleCheckPermission,
        menuPermission,
    } = mainContext;
    useEffect(()=>{
        handleCheckPermission(localStorage.getItem('lastLocation'));
    },[])
    const officeContext = useContext(officeReqContext);
    const {
        changeJob,
        setChangeJob,
        changeJobFrom,
        setJobChangeFrom,
        changeJobTo,
        setJobChangeTo,
        changeJobDesc,
        setChangeJobDesc,
        handleJobChanged,
        handleResetJobChange
    } = officeContext;

    useEffect(()=>{
        setPageTitle('ثبت درخواست تغییر شیفت/شغل');
    }, [setPageTitle])

    return(
        <Container>
            {menuPermission ?
                <Form>
                    <Row>
                        <Col md='6' lg='5' xxl='4' className='text-center text-md-start d-block d-md-flex align-items-center'>
                            <h1 className='font16 mb-0'>اینجانب درخواست تغییر </h1>
                            <div className="d-flex justify-content-center">
                                <div className='ms-md-4'>
                                    <label className="me-2">شیفت</label>
                                    <Form.Check
                                        className='d-inline-block'
                                        type="switch"
                                        id="custom-switch"
                                        label="شغل"
                                        checked={changeJob}
                                        onChange={() => { setChangeJob(!changeJob) }}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Form.Group as={Col} md='4' lg='3' xxl='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'> از شیفت/شغل </Form.Label>
                            <Form.Control type="text" value={changeJobFrom} name="changeJobFrom" onChange={(e) => { setJobChangeFrom(e.target.value) }}/>
                        </Form.Group>
                        <Form.Group as={Col} md='4' lg='3' xxl='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'> به شیفت/شغل </Form.Label>
                            <Form.Control type="text" value={changeJobTo} name="changeJobTo" onChange={(e) => { setJobChangeTo(e.target.value) }}/>
                        </Form.Group>
                        <Col md='4' lg='1' xxl='1' className="d-flex align-items-center">
                            <p>را دارم.</p>
                        </Col>
                        <Form.Group as={Col} md='12'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control as="textarea" rows={10} maxLength={2000} name='changeJobDesc' value={changeJobDesc} onChange={e => setChangeJobDesc(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                            <Button variant='success' className='w-45' onClick={() => {handleJobChanged()}}>
                                ثبت درخواست
                            </Button>
                            <Button variant='secondary' type='reset' className='w-45' onClick={() => {handleResetJobChange()}}>
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </Form>
            :
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
            }
        </Container>
    )
}
export default JobChangeReqRegistration;