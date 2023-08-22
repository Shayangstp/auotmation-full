import React, { useEffect, useContext }  from "react";
import { Link } from "react-router-dom";
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning } from "@fortawesome/free-solid-svg-icons";

const NoticeRegistration = ({setPageTitle}) => {

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
        officeNoticeDescription,
        setOfficeNoticeDescription,
        handleOfficeNoticeSubmit,
    } = officeContext;

    useEffect(()=>{
        setPageTitle('ثبت اطلاعیه');
    }, [setPageTitle])

    return(
        <Container>
            {menuPermission ?
                <Form>
                    <Row>
                        <Form.Group as={Col} md='12'>
                            <Form.Label className='mb-1'>متن اطلاعیه: </Form.Label>
                            <Form.Control as="textarea" rows={10} maxLength={2000} name='officeNoticeDescription' value={officeNoticeDescription} onChange={e => setOfficeNoticeDescription(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                            <Button variant='success' className='w-45' onClick={(e) => handleOfficeNoticeSubmit()}>
                                ثبت اطلاعیه
                            </Button>
                            <Button variant='secondary' type='reset' className='w-45' onClick={()=>{setOfficeNoticeDescription('')}}>
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

export default NoticeRegistration;