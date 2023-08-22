import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { rootContext } from "../context/rootContext";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import { getReqTitles } from "../../Services/officeServices";
import OfficeAddLink from "./OfficeAddLink";
import OfficeAddFile from "./OfficeAddFile";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning, faHome } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import {selectUser} from '../Slices/mainSlices';

const OfficeNewReq = ({setPageTitle}) => {
    const user = useSelector(selectUser);

    useEffect(() => {
        setPageTitle('ثبت نامه داخلی');
    }, [setPageTitle])

    const mainContext = useContext(rootContext);
    const {
        
        handleCheckPermission,
        menuPermission,
        handleGetCompanies,
        companies,
        handleGetCoDepartments,
        coDepartments,
        handleAllUsers,
        allUsersWithOfficeSelect
    } = mainContext;
    
    const officeContext = useContext(officeReqContext);
    const {
        reqFromCompanyName,
        setReqFromCompanyName,
        reqFromCompanyDepartment,
        setReqFromCompanyDepartment,
        reqToCompanyName,
        setReqToCompanyName,
        reqToCompanyDepartment,
        setReqToCompanyDepartment,
        reqSendTo,
        setReqSendTo,
        reqSendCopyTo,
        setReqSendCopyTo,
        reqTitle,
        setReqTitle,
        reqDescription,
        setReqDescription,
        reqEnableComment,
        setReqEnableComment,
        handleSubmitNewReqValidation,
        handleRequestReset
    } = officeContext;

    //req titles
    const [reqTitles, setReqTitles] = useState([]);
    const handleGetReqTitles = async () => {
        try{
            const { data } = await getReqTitles();
            if(data){
                setReqTitles(data);
            }
        }catch(ex){
            console.log(ex);
        }
    }
    var reqTitlesSelect = [];
    if(reqTitles.length !== 0){
        reqTitlesSelect = reqTitles.map(data => {
            return { value: data.code, label: data.name };
        })
    }else{
        reqTitlesSelect = [];
    }

    useEffect(()=>{
        // handleCheckPermission(localStorage.getItem('lastLocation'));
        handleGetCompanies();
        handleAllUsers();
        handleGetReqTitles();
    },[])

    return (
        <Container fluid className='pb-5'>
            {/* {menuPermission ? */}
                <Row>
                    <Col>
                        <Form className="enter-in-form">
                            <Row>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>از شرکت :</Form.Label>
                                    <Select value={reqFromCompanyName} name="reqFromCompanyName" onChange={(e) => { setReqFromCompanyName(e);setReqFromCompanyDepartment('');handleGetCoDepartments(e.value, user.Location); }} placeholder='انتخاب...' options={companies} id='reqFromCompanyName' />
                                </Form.Group>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>از قسمت :</Form.Label>
                                    <Select className="w-100" value={reqFromCompanyDepartment} name="reqFromCompanyDepartment" onChange={(e) => { setReqFromCompanyDepartment(e) }} placeholder='انتخاب...' options={coDepartments} id='reqFromCompanyDepartment' />
                                </Form.Group>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>به شرکت :</Form.Label>
                                    <Select value={reqToCompanyName} name="reqToCompanyName" onChange={(e) => { setReqToCompanyName(e);handleGetCoDepartments(e.value, user.Location); }} placeholder='انتخاب...' options={companies} id='reqToCompanyName' />
                                </Form.Group>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>به قسمت :</Form.Label>
                                    <Select className="w-100" value={reqToCompanyDepartment} name="reqToCompanyDepartment" onChange={(e) => { setReqToCompanyDepartment(e) }} placeholder='انتخاب...' options={coDepartments} id='reqToCompanyDepartment' />
                                </Form.Group>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>ارسال به :</Form.Label>
                                    <Select className="w-100 basic-multi-select" name="reqSendTo" value={reqSendTo} onChange={(e) => { setReqSendTo(state => { return e }) }}
                                        placeholder='انتخاب...' options={allUsersWithOfficeSelect} id='reqSendTo' isMulti />
                                </Form.Group>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1'>ارسال رونوشت به :</Form.Label>
                                    <Select className="w-100 basic-multi-select" name="reqSendCopyTo" value={reqSendCopyTo} onChange={(e) => { setReqSendCopyTo(state => { return e }) }}
                                        placeholder='انتخاب...' options={allUsersWithOfficeSelect} id='reqSendCopyTo' isMulti />
                                </Form.Group>
                                <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>عنوان درخواست :</Form.Label>
                                    <Select className="w-100" name="reqTitle" value={reqTitle} onChange={(e) => { setReqTitle(e) }}
                                        placeholder='انتخاب...' options={reqTitlesSelect} id='reqTitle' />
                                </Form.Group>
                                <Col md='12'>
                                    <Row>
                                        <OfficeAddLink />
                                        <OfficeAddFile />
                                        <Form.Group as={Col} md='6' className="mb-4 px-0 px-md-3 d-flex align-items-end">
                                            <Form.Check type='checkbox' label='قابلیت ارسال نظر' name='reqEnableComment' value={reqEnableComment} checked={reqEnableComment} onChange={()=>{setReqEnableComment(!reqEnableComment)}}/>
                                        </Form.Group>
                                    </Row>
                                </Col>
                                <Form.Group as={Col} md='12'>
                                    <Form.Label className='mb-1 required-field'>متن درخواست :</Form.Label>
                                    <Form.Control as="textarea" rows={10} maxLength={2000} name='reqDescription' value={reqDescription} onChange={e => setReqDescription(e.target.value)} />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                                    <Button variant='success' className='w-45' onClick={(e) => handleSubmitNewReqValidation()}>
                                        ثبت درخواست
                                    </Button>
                                    <Button variant='secondary' type='reset' className='w-45' onClick={handleRequestReset}>
                                        انصراف
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
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

export default OfficeNewReq;