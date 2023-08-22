import React, { useContext, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { reqContext } from '../context/jobReqsContext/reqContext';
import { rootContext } from "../context/rootContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import InterCompanyJobReqNewItem from "./JobReqNewItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";
import { addFileCntxt } from "../context/AddFileContext/addFileCntxt";

import { selectUser, selectFormErrors, RsetFormErrors, selectUnit, selectLoading } from "../Slices/mainSlices";
import { selectNewCeramicReq, RsetNewCeramicReq, selectCeramicReqName, RsetCeramicReqName, selectCeramicReqItems, RsetCeramicReqItems, handleCeramicReqNames, selectCeramicReqNamesOption } from '../Slices/ceramicSlices';
import CeraJobReqItemsTable from "./CeraJobReqItemsTable";
import Loading from '../Common/Loading';

const InterCompanyJobRequest = ({ setPageTitle, setLocklinks }) => {

    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const user = useSelector(selectUser);
    const newCeramicReq = useSelector(selectNewCeramicReq);
    const ceramicReqName = useSelector(selectCeramicReqName);
    const ceramicReqNamesOption = useSelector(selectCeramicReqNamesOption);
    const ceramicReqItems = useSelector(selectCeramicReqItems);
    const unit = useSelector(selectUnit);
    const requestContext = useContext(reqContext);
    const mainContext = useContext(rootContext);
    const addFileContext = useContext(addFileCntxt);
    const {
        reqFiles
    } = addFileContext;
    const {
        // handleCheckPermission,
        // menuPermission,
        handleCompanyUsers,
        coUsers
    } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])
    const {
        handleCompanyActs,
        companyActs,
        reqActs,
        setReqActs,
        companyActsArray,
        reqDescription,
        setReqDescription,
        reqSendCopyTo,
        setReqSendCopyTo,
        reqWithFirstMaterial,
        setReqWithFirstMaterial,
        userCompany,
        handleInputsEnter,

        handleSubmitNewRequest,
        handleReqNewItemReset,
        handleRequestReset,

        reqItemSubject,
        reqItemSubjectRef,
        reqItemAmount,
        reqItemTechSpecifications,
        reqItemTechSpecificationsRef,
        reqItemDeadline,
        reqItemDeadlineRef,
        reqPattern,
        description
    } = requestContext;

    useEffect(() => {
        dispatch(handleCeramicReqNames());
        // handleInputsEnter();
        handleCompanyActs();
    }, [])

    useEffect(() => {
        handleCompanyUsers(0);
    }, [user])

    useEffect(() => {
        setPageTitle('درخواست کار');
        if (ceramicReqItems.length !== 0) {
            setLocklinks(true)
        } else {
            setLocklinks(false)
        }
    }, [setPageTitle, ceramicReqItems, user])

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!ceramicReqName) {
            errors.ceramicReqName = "انتخاب اسم پروژه اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (ceramicReqName !== '') {
            handleSubmitNewRequest(e)
        } else {
            dispatch(RsetFormErrors(
                validation({
                    ceramicReqName: ceramicReqName,
                })
            ));
        }
    }
    const itemValidation = () => {
        var errors = {};
        if (!reqItemSubject) {
            errors.reqItemSubject = "واردکردن موضوع اجباری است!";
        }
        if (!reqItemAmount) {
            errors.reqItemAmount = "واردکردن تعداد اجباری است!";
        }
        if (!unit) {
            errors.unit = "واردکردن واحد اجباری است!";
        }
        if (!reqItemTechSpecifications) {
            errors.reqItemTechSpecifications = "واردکردن مشخصات فنی اجباری است!";
        }
        if (!reqItemDeadline) {
            errors.reqItemDeadline = "واردکردن تاریخ مورد نیاز اجباری است!";
        }
        return errors;
    }
    const handleAddItemToCeramicReq = (e) => {
        e.preventDefault();
        if (reqItemSubject !== '' && reqItemAmount !== '' && unit !== '' && reqItemTechSpecifications !== '' && reqItemDeadline !== null) {
            const items = [...ceramicReqItems];
            const item = {
                reqItemSubject: reqItemSubject,
                reqItemAmount: reqItemAmount,
                unit: unit,
                reqItemTechSpecifications: reqItemTechSpecifications,
                reqItemDeadline: reqItemDeadline,
                reqPattern: reqPattern,
                reqFiles: reqFiles,
                description: description
            }
            items.push(item);
            dispatch(RsetCeramicReqItems(items));
            handleReqNewItemReset();
        } else {
            dispatch(RsetFormErrors(
                itemValidation({
                    reqItemSubject: reqItemSubject,
                    reqItemAmount: reqItemAmount,
                    unit: unit,
                    reqItemTechSpecifications: reqItemTechSpecifications,
                    reqItemDeadline: reqItemDeadline
                })
            ));
        }
    }

    return (
        <Container fluid className='pb-5'>
            {/* {menuPermission ? */}
            <section className="position-relative">
            {loading ? <Loading /> : null}
                <Fragment>
                    <Row className='mb-4'>
                        <Col className='text-center text-md-start d-block d-md-flex align-items-center'>
                            <div className="d-flex justify-content-center">
                                <div className='ms-md-4'>
                                    <label className="me-2">تکمیل درخواست قبلی</label>
                                    <Form.Check
                                        className='d-inline-block'
                                        type="switch"
                                        id="custom-switch"
                                        label="درخواست جدید"
                                        checked={newCeramicReq}
                                        onChange={() => { dispatch(RsetNewCeramicReq(!newCeramicReq)) }}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Form.Group as={Col} md='6' className="mt-3 mt-md-0">
                            {newCeramicReq === false
                                ? <Fragment>
                                    <Form.Label className='mb-1 required-field'> نام پروژه: </Form.Label>
                                    <Select name="ceramicReqName" value={ceramicReqName} onChange={(e) => {
                                        dispatch(RsetCeramicReqName(e))
                                    }} options={ceramicReqNamesOption} placeholder='انتخاب...' />
                                </Fragment>
                                : <Fragment>
                                    <Form.Label className='mb-1 required-field'> نام پروژه: </Form.Label>
                                    <Form.Control name='ceramicReqName' value={ceramicReqName} onChange={(e) => {
                                        dispatch(RsetCeramicReqName(e.target.value))
                                    }} />
                                </Fragment>
                            }
                            {!ceramicReqName && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.ceramicReqName}
                                </p>
                            )}
                        </Form.Group>
                    </Row>
                    <Form className="enter-in-form">
                        <Row>
                            <hr className='mb-3' />
                            <Col md='12'>
                                {/* <div>
                                <p className="fw-bold mb-4">مرجع ساخت : (فقط شامل پروژه های ساخت می باشد)</p>
                            </div> */}
                                <Row>
                                    {/* <Col md='12' className="mb-5">
                                    <div className="p-4 bg-white border rounded">
                                        <Form.Label className='mb-1 required-field'>کارهای مورد نیاز :</Form.Label>
                                        {companyActs.length !== 0 ? companyActs.map((act, index) => {
                                            return (
                                                <Form.Group key={index} className="d-flex align-items-center">
                                                    <input type='checkbox' className='actInput' name={xssFilters.inHTMLData(act.name)} onChange={(e) => {
                                                        companyActsArray[index].value = !companyActsArray[index].value;
                                                        e.target.value = companyActsArray[index].value;
                                                        e.target.checked = companyActsArray[index].value;
                                                        if (reqActs.length !== 0) {
                                                            const acts = [...reqActs];
                                                            if (acts.includes(companyActsArray[index].code)) {
                                                                const filteredActs = acts.filter(act => act !== companyActsArray[index].code);
                                                                setReqActs(filteredActs);
                                                            } else {
                                                                reqActs.push(companyActsArray[index].code)
                                                            }
                                                        } else {
                                                            reqActs.push(companyActsArray[index].code)
                                                        }
                                                    }} />
                                                    <Form.Label className='mb-0 ms-2'>{xssFilters.inHTMLData(act.name)}</Form.Label>
                                                </Form.Group>
                                            )
                                        }) : null}
                                    </div>
                                    {reqActs.length === 0 && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.reqActs}
                                        </p>
                                    )}
                                </Col> */}
                                    <Col md='12'>
                                        <InterCompanyJobReqNewItem handleAddItemToCeramicReq={handleAddItemToCeramicReq} />
                                    </Col>
                                    {ceramicReqItems.length !== 0
                                        ? <CeraJobReqItemsTable />
                                        : null
                                    }
                                </Row>
                            </Col>
                            {/* {reqItems.length !== 0 ? <ReqItems reqItems={reqItems} reqItemsOperation={true} newReq={true} /> : null} */}
                            <hr className='my-5' />
                            <Form.Group as={Col} md='12' className='d-flex align-items-center flex-wrap mb-5'>
                                <Form.Label className='me-3 mb-0'>درخواست کار همراه با مواد اولیه:</Form.Label>
                                <div className="d-flex align-items-center me-3">
                                    <input type='checkbox' name='reqWithFirstMaterial' value={reqWithFirstMaterial} checked={reqWithFirstMaterial} onChange={(e) => { setReqWithFirstMaterial(!reqWithFirstMaterial) }} />
                                    <Form.Label className='ms-2 font12 mb-0'> می باشد </Form.Label>
                                </div>
                                <div className="d-flex align-items-center">
                                    <input type='checkbox' name='reqWithFirstMaterial' value={!reqWithFirstMaterial} checked={!reqWithFirstMaterial} onChange={(e) => { setReqWithFirstMaterial(!reqWithFirstMaterial) }} />
                                    <Form.Label className='ms-2 font12 mb-0'> نمی باشد </Form.Label>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='4' xl='3' className='mb-4'>
                                <Form.Label className='mb-1'>ارسال رونوشت به :</Form.Label>
                                <Select className="w-100 basic-multi-select" name="reqSendCopyTo" value={reqSendCopyTo} onChange={(e) => { setReqSendCopyTo(state => { return e }); }}
                                    placeholder='انتخاب...' options={coUsers} id='reqSendCopyTo' isMulti />
                            </Form.Group>
                            <Form.Group as={Col} md='12'>
                                <Form.Label className='mb-1'>شرح درخواست :</Form.Label>
                                <Form.Control as="textarea" rows={4} maxLength={50} name='reqDescription' value={reqDescription} onChange={e => setReqDescription(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                                <Button variant='success' className='w-45' onClick={(e) => {
                                    submitFormBtn(e);
                                }}>
                                    ثبت درخواست
                                </Button>
                                <Button variant='secondary' type='reset' className='w-45' onClick={handleRequestReset}>
                                    انصراف
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Fragment>
            </section>
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

export default InterCompanyJobRequest;