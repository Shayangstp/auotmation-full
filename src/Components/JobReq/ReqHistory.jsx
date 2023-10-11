import React, { useEffect, useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { rootContext } from "../context/rootContext";
import { reqContext } from '../context/jobReqsContext/reqContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSearch, faCircleUser, faHome, faWarning } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import NumberFormat from "react-number-format";
import xssFilters from 'xss-filters';


const RequestHistory = ({setPageTitle, loading, setLoading}) => {
    const mainContext = useContext(rootContext);
    const {
        handleCheckPermission,
        menuPermission,
    } = mainContext;
    useEffect(()=>{
        handleCheckPermission(localStorage.getItem('lastLocation'));
    },[])
    useEffect(()=>{
        setPageTitle('تاریخچه درخواست');
    }, [setPageTitle])
    
    const context = useContext(reqContext);

    const {
        reqSerialNumber,
        setReqSerialNumber,
        handleReqHistory,
        reqComments,
    } = context;

    return(
        <Container fluid className='py-4'>
            {menuPermission ?
                <Fragment>
                    <Form onSubmit={(e)=>{e.preventDefault();}}>
                        <Row>
                            <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                                <Form.Label className='mb-1'> سریال درخواست :</Form.Label>
                                <NumberFormat dir='ltr' className='form-control' type="text" maxLength={6} value={reqSerialNumber} name="reqSerialNumber" id='reqSerialNumber' onChange={e => { setReqSerialNumber(e.target.value) }} />
                            </Form.Group>
                            <Form.Group as={Col} md='3' lg='2' xxl='2' className='mb-4 d-flex align-items-end'>
                                <Button type='submit' variant="info" className="text-white w-100 p-1 d-flex align-items-center justify-content-center" id='' onClick={(e) => handleReqHistory(reqSerialNumber)} >
                                    <FontAwesomeIcon icon={faSearch} className='me-2'/>
                                    <span>جستجو</span>
                                </Button>
                            </Form.Group>
                        </Row>
                    </Form>
                    <section>
                        {loading ?
                            <div className="d-flex justify-content-center mt-5 pt-5"><FontAwesomeIcon icon={faSpinner} className='spinner font60'/></div>
                        : 
                            <div>
                                {reqComments.map(comment=>{
                                    return(
                                        <Row className='mb-5'>
                                            <Col md='2' lg='3' xl='2' xxl='1' className='d-flex'>
                                                {comment.photo === '' || comment.photo_type === ''?
                                                    <FontAwesomeIcon icon={faCircleUser} className="font95 text-secondary mb-1 mb-md-0"/>
                                                :
                                                    <img width='95px' height='95px' className='rounded-circle mb-1 mb-md-0' alt='userAvatar' src={'data:'+xssFilters.inHTMLData(comment.photo_type)+';base64,'+ xssFilters.inHTMLData(comment.photo)} />
                                                }
                                            </Col>
                                            <Col md='10' lg='9' xl='10' xxl='11'>
                                                <div className='border p-4 rounded bg-white w-100 position-relative'>
                                                    <div className="triangleBorder position-absolute w-0 h-0">
                                                        <div className="triangle position-absolute w-0 h-0"></div>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between flex-wrap fw-bold mb-4'>
                                                        <div>{xssFilters.inHTMLData(comment.first_name)+ ' '+xssFilters.inHTMLData(comment.last_name)}</div>
                                                        <div>( {moment.utc(xssFilters.inHTMLData(comment.date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')} )</div>
                                                    </div>
                                                    <div>
                                                        {xssFilters.inHTMLData(comment.comment)}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        }
                    </section>
                </Fragment>
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

export default RequestHistory;