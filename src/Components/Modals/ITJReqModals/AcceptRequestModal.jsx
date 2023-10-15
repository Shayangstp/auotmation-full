import React, { useContext, useEffect, Fragment, useState } from "react";
import { rootContext } from "../../context/rootContext";
import { iranTolJobCntxt } from '../../context/iranTolJobContext/IranTolJobCntxt';
import AddFileInput from "../../Common/File/AddFileInput";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileWord, faFilePdf, faFileImage, faFileExcel, faFilePowerpoint, faFileZipper, faTrash } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";
import DatePicker from "react-datepicker2";
import NumberFormat from 'react-number-format';
import ItemDeletePermissionModal from '../ItemDeletePermissionModal';
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";

import { useDispatch, useSelector } from "react-redux";
import { selectAcceptReqModal, RsetAcceptReqModal, selectAcceptReqComment, RsetAcceptReqComment } from '../../Slices/modalsSlice';
import { handleUnits, selectUnitsOption, selectUser, handleUserInformation, handleUserImage } from "../../Slices/mainSlices";
import { handleReqFiles, selectCurrentReqFiles } from '../../Slices/currentReqSlice';
import AddMaterialWorkFlowModal from "../../Modals/ITJReqModals/AddMaterialWorkflowModal";
import {
    RsetIrantoolAddMaterialWorkFlowModal,
    selectIrantoolMaterialWorkFlowModal,
  } from "../../Slices/irantoolSlices";


const AcceptRequestModal = () => {
    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const acceptReqComment = useSelector(selectAcceptReqComment);
    const unitsOption = useSelector(selectUnitsOption);
    const user = useSelector(selectUser);
    const currentReqFiles = useSelector(selectCurrentReqFiles);
    const irantoolAddMaterialWorkFlowModal = useSelector(
        selectIrantoolMaterialWorkFlowModal
      );

    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        currentReqCo,
        setItemDeletePerModal,
        itemDeletePerModal,
        setDeletedItemId,
        deletedItemId,
        currentReqComments,
    } = mainContext;

    const jobContext = useContext(iranTolJobCntxt);
    const {
        handleDownloadReqPlans,
        handleAcceptITJobReq,

        workDep,
        setWorkDep,
        workDepRef,
        workType,
        setWorkType,
        workTypeRef,
        workDevice,
        setWorkDevice,
        workOperator,
        setWorkOperator,
        workFromDate,
        setWorkFromDate,
        workFromDateRef,
        workToDate,
        setWorkToDate,
        workToDateRef,
        workPriority,
        setWorkPriority,
        workPriorityRef,
        workDesc,
        setWorkDesc,
        handleAddWorkItem,
        workItems,
        handleWorkDeps,
        workDeps,
        handleWorkTypes,
        workTypes,
        handleWorkDevices,
        workDevices,
        handleWorkOperators,
        workOperators,

        iTJProjectMaterialsName,
        setITJProjectMaterialsName,
        iTJProjectMaterialsNameRef,
        iTJProjectMaterialsUnit,
        setITJProjectMaterialsUnit,
        iTJProjectMaterialsUnitRef,
        iTJProjectMaterialsAmount,
        setITJProjectMaterialsAmount,
        iTJProjectMaterialsAmountRef,
        iTJProjectMaterialsDesc,
        setITJProjectMaterialsDesc,
        handleAddITJProjectMaterials,
        iTJProjectMaterials,
        setITJProjectMaterials,
        handleResetWorkItem,
        handleResetMaterialItem,
        setWorkItems,
        deleteItemFromWorks,
        deleteItemFromMaterials,
        setActionToPersonsModal
    } = jobContext;

    const [clickedPlusBtn, setClickedPlusBtn] = useState('');

    const withValueLimit = ({ floatValue }) => floatValue !== 0;
    useEffect(() => {
        dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: 0, multi: 0, justShow: 1, fileName: ''}));
        if (currentReqInfo.lastActionCode === 41) {
            handleWorkDeps();
            handleWorkTypes();
            handleWorkDevices();
            handleWorkOperators();
            handleUnits();
        }
    }, [])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={acceptReqModal}
            onHide={() => {
                dispatch(RsetAcceptReqModal(false));
            }}
            dialogClassName="modal-96w overflow-visible-modal"
        >
            <Fragment>
                <Modal.Header className='d-block bg-success text-white'>
                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                        <div>
                            <span className='me-2'>تایید درخواست شماره </span>
                            <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                        </div>
                        <div>
                            <span className='fw-bold me-2'>تاریخ درخواست:</span>
                            <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>نام و نام خانوادگی</th>
                                <th>شرکت</th>
                                <th>نام پروژه</th>
                                <th>نوع فرایند</th>
                                <th>نوع پروژه</th>
                                <th>تعداد</th>
                                <th>تاریخ مدنظر مشتری</th>
                                <th>توضیحات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{xssFilters.inHTMLData(currentReqInfo.fullName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqCo)}</td>
                                <td>{xssFilters.inHTMLData(currentReqInfo.projectName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqInfo.requestTypeName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqInfo.toolTypeName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqInfo.amount)}</td>
                                <td>{currentReqInfo.deadline !== null ? momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.deadline), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD') : ''}</td>
                                <td>{xssFilters.inHTMLData(currentReqInfo.description)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {currentReqFiles.length !== 0
                        ? <Fragment>
                            <ul className="d-flex mt-4 list-unstyled">
                                {currentReqFiles.map((file, index) => {
                                    switch (file.name.split('.').pop()) {
                                        case "docx":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFileWord} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "xlsx":
                                        case "xltx":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFileExcel} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "pptx":
                                        case "ppt":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFilePowerpoint} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "pdf":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFilePdf} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "jpeg":
                                        case "jpg":
                                        case "png":
                                        case "gif":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFileImage} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "zip":
                                        case "rar":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFileZipper} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        default:
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: file.row, multi: 0, justShow: 0, fileName: file.name}));
                                                }}>
                                                    <FontAwesomeIcon icon={faFile} className='font24 cursorPointer' />
                                                </li>
                                            )
                                    }
                                })}
                            </ul>
                            <div className="my-4 cursorPointer" onClick={() => {
                                dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: 0, multi: 1, justShow: 0, fileName: 'allFiles'}));
                            }}>
                                <span>دانلود همه فایل های درخواست</span>
                            </div>
                        </Fragment>
                        : <p>فایلی آپلود نشده است!</p>
                    }

                    {currentReqInfo.lastActionCode === 39
                        ? <AddFileInput />
                        : null
                    }

                    {/* {currentReqInfo.plans !== undefined && currentReqInfo.plans.length !== 0 && (user.Roles.some(role=> role === '56' || role === '57'))
                        ? <Fragment>
                            <ul className="d-flex mt-5 list-unstyled">
                                {currentReqInfo.plans.map((file, index) => {
                                    switch (file.filename.split('.').pop()) {
                                        case "docx":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFileWord} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "xlsx":
                                        case "xltx":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFileExcel} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "pptx":
                                        case "ppt":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFilePowerpoint} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "pdf":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFilePdf} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "jpeg":
                                        case "jpg":
                                        case "png":
                                        case "gif":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFileImage} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        case "zip":
                                        case "rar":
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFileZipper} className='font24 cursorPointer' />
                                                </li>
                                            )
                                        default:
                                            return (
                                                <li key={file.path} className="mx-2" onClick={() => {
                                                    handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                                }}>
                                                    <FontAwesomeIcon icon={faFile} className='font24 cursorPointer' />
                                                </li>
                                            )
                                    }
                                })}
                            </ul>
                            <div className="my-4 cursorPointer" onClick={() => {
                                handleDownloadReqPlans(currentReqInfo.reqInfo.serial_number + '_files', currentReqInfo._id, '*', true)
                            }}>
                                <span>دانلود همه فایل های نقشه</span>
                            </div>
                        </Fragment>
                        : null
                    } */}

                    {/* {currentReqInfo.lastActionCode === 41
                        ? <Row>
                            <hr className="mt-4 mb-5" />
                            <h3 className="fw-bold font16 mb-4">ثبت برنامه های عملیاتی</h3>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>واحد : </Form.Label>
                                <Select placeholder='انتخاب...' name='workDep' value={workDep} onChange={(e) => {
                                    setWorkDep(e)
                                }} options={workDeps} ref={workDepRef} />
                                <div id='workDep-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن واحد اجرایی اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>نوع عملیات : </Form.Label>
                                <Select placeholder='انتخاب...' name='workType' value={workType} onChange={(e) => {
                                    setWorkType(e)
                                }} options={workTypes} ref={workTypeRef} />
                                <div id='workType-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن نوع عملیات اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1'>دستگاه : </Form.Label>
                                <Select placeholder='انتخاب...' name='workDevice' value={workDevice} onChange={(e) => {
                                    setWorkDevice(e)
                                }} options={workDevices} />
                            </Form.Group>
                            //<Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                //<Form.Label className='mb-1 required-field'>اپراتور : </Form.Label>
                                //<Select placeholder='انتخاب...' name='workOperator' value={workOperator} onChange={(e) => {
                                //    setWorkOperator(e)
                                //}} options={workOperators}/>
                            //</Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>از تاریخ/ساعت : </Form.Label>
                                <DatePicker inputReadOnly className="form-control" placeholder='1400/01/01' name='workFromDate' value={workFromDate} onChange={(e) => {
                                    setWorkFromDate(e)
                                }} inputFormat="YYYY-MM-DD hh:mm A" inputJalaaliFormat="jYYYY/jMM/jDD hh:mm A" isGregorian={false} showTodayButton={false} ref={workFromDateRef} />
                                <div id='workFromDate-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن تاریخ شروع عملیات اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>تا تاریخ/ساعت : </Form.Label>
                                <DatePicker inputReadOnly className="form-control" placeholder='1400/01/01' name='workToDate' value={workToDate} onChange={(e) => {
                                    setWorkToDate(e)
                                }} inputFormat="YYYY-MM-DD hh:mm A" inputJalaaliFormat="jYYYY/jMM/jDD hh:mm A" isGregorian={false} showTodayButton={false} ref={workToDateRef} />
                                <div id='workToDate-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن تاریخ پایان عملیات اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>اولویت: </Form.Label>
                                <NumberFormat type='text' className='form-control' name='workPriority' value={workPriority} onChange={(e) => {
                                    setWorkPriority(e.target.value)
                                }} dir='ltr' getInputRef={workPriorityRef} />
                                <div id='workPriority-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن اولویت عملیات اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' className="mb-4">
                                <Form.Control as="textarea" placeholder='توضیحات' name='workDesc' value={workDesc} onChange={(e) => {
                                    setWorkDesc(e.target.value)
                                }} />
                            </Form.Group>
                            <Form.Group as={Col} className="mb-4 d-flex align-items-center">
                                <Button variant="info" className="text-white" onClick={() => {
                                    handleAddWorkItem()
                                }}>افزودن</Button>
                            </Form.Group>
                            {workItems.length !== 0
                                ? <Table bordered striped hover responsive size="sm" className="mt-4">
                                    <thead>
                                        <tr>
                                            <th className='bg-secondary text-white fw-normal'>ردیف</th>
                                            <th className='bg-secondary text-white fw-normal'>واحد</th>
                                            <th className='bg-secondary text-white fw-normal'>نوع عملیات</th>
                                            <th className='bg-secondary text-white fw-normal'>دستگاه</th>
                                            //<th className='bg-secondary text-white fw-normal'>اپراتور</th>
                                            <th className='bg-secondary text-white fw-normal'>از تاریخ</th>
                                            <th className='bg-secondary text-white fw-normal'>تا تاریخ</th>
                                            <th className='bg-secondary text-white fw-normal'>اولویت</th>
                                            <th className='bg-secondary text-white fw-normal'>توضیحات</th>
                                            <th className='bg-secondary text-white fw-normal'>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workItems.map((item, index) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td>{index+1}</td>
                                                    <td>{item.workDep.label}</td>
                                                    <td>{item.workType.label}</td>
                                                    <td>{item.workDevice.label !== undefined ? item.workDevice.label : ''}</td>
                                                    //<td>{item.workOperator.label!== undefined ? item.workOperator.label : ''}</td>
                                                    <td>{item.workFromDate.format('jYYYY/jMM/jDD hh:mm A')}</td>
                                                    <td>{item.workToDate.format('jYYYY/jMM/jDD hh:mm A')}</td>
                                                    <td>{item.workPriority}</td>
                                                    <td>{item.workDesc}</td>
                                                    <td className="text-center">
                                                        <FontAwesomeIcon className="text-danger cursorPointer" icon={faTrash} onClick={() => {
                                                            setItemDeletePerModal(true);
                                                            setDeletedItemId(item.id);
                                                            setClickedPlusBtn('work');
                                                        }} />
                                                        {itemDeletePerModal === true && clickedPlusBtn === 'work'
                                                            ? <ItemDeletePermissionModal deleteItemFromList={deleteItemFromWorks} itemId={deletedItemId}/>
                                                            : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                : null
                            }
                            <hr className="mt-5 mb-4" />
                            <h3 className="fw-bold font16 mb-4">ثبت مواد اولیه</h3>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>نام کالا : </Form.Label>
                                <Form.Control name='iTJProjectMaterialsName' value={iTJProjectMaterialsName} onChange={(e) => {
                                    setITJProjectMaterialsName(e.target.value)
                                }} ref={iTJProjectMaterialsNameRef}/>
                                <div id='iTJProjectMaterialsName-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن نام اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>واحد شمارش : </Form.Label>
                                <Select name='iTJProjectMaterialsUnit' value={iTJProjectMaterialsUnit} onChange={(e) => {
                                    setITJProjectMaterialsUnit(e)
                                    }} ref={iTJProjectMaterialsUnitRef} placeholder='انتخاب...' isSearchable
                                    options={unitsOption}
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                />
                                <div id='iTJProjectMaterialsUnit-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن واحد شمارش اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='6' lg='4' xl='3' xxl='2' className="mb-4">
                                <Form.Label className='mb-1 required-field'>تعداد/مقدار: </Form.Label>
                                <NumberFormat type='text' className='form-control' name='iTJProjectMaterialsAmount' value={iTJProjectMaterialsAmount} onChange={(e) => {
                                    setITJProjectMaterialsAmount(e.target.value)
                                }} dir='ltr'
                                getInputRef={iTJProjectMaterialsAmountRef}
                                />
                                <div id='iTJProjectMaterialsAmount-required' className='d-none'>
                                    <span className='font12 text-danger mb-1'>واردکردن تعداد/مقدار اجباری است!</span>
                                </div>
                            </Form.Group>
                            <Form.Group as={Col} md='10' xl='5' className="mb-4">
                                <Form.Label className='mb-1'>توضیحات : </Form.Label>
                                <Form.Control name='iTJProjectMaterialsDesc' value={iTJProjectMaterialsDesc} onChange={(e) => {
                                    setITJProjectMaterialsDesc(e.target.value)
                                }}/>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-4 d-flex align-items-end">
                                <Button variant="info" className="text-white" onClick={() => {
                                    handleAddITJProjectMaterials()
                                }}>افزودن</Button>
                            </Form.Group>
                            {iTJProjectMaterials.length !== 0
                                ? <Table bordered striped hover responsive size="sm" className="mt-4">
                                    <thead>
                                        <tr>
                                            <th className='bg-secondary text-white fw-normal'>ردیف</th>
                                            <th className='bg-secondary text-white fw-normal'>نام</th>
                                            <th className='bg-secondary text-white fw-normal'>واحد شمارش</th>
                                            <th className='bg-secondary text-white fw-normal'>تعداد/مقدار</th>
                                            <th className='bg-secondary text-white fw-normal'>توضیحات</th>
                                            <th className='bg-secondary text-white fw-normal'>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {iTJProjectMaterials.map((item, index) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.unit.label}</td>
                                                    <td>{item.amount}</td>
                                                    <td>{item.desc}</td>
                                                    <td className="text-center">
                                                        <FontAwesomeIcon className="text-danger cursorPointer" icon={faTrash} onClick={() => {
                                                            setItemDeletePerModal(true);
                                                            setDeletedItemId(item.id);
                                                            setClickedPlusBtn('material');
                                                        }} />
                                                        {itemDeletePerModal === true && clickedPlusBtn === 'material'
                                                            ? <ItemDeletePermissionModal deleteItemFromList={deleteItemFromMaterials} itemId={deletedItemId}/>
                                                            : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                : null
                            }
                        </Row>
                        : null
                    } */}

                    {/* {currentReqInfo.process[currentReqInfo.process.length - 1].action_code === 42
                        ?<Row>
                            
                        </Row>
                        : null
                    } */}

                </Modal.Body>
                <Modal.Footer className="d-block">
                    {currentReqComments.map((comment, index) => {
                        if (comment.comment !== null && comment.comment !== undefined && comment.comment !== '') {
                            return (
                                <div className="d-block" key={index}>
                                    <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                                        dispatch(handleUserInformation(comment.userId));
                                        dispatch(handleUserImage({ userId: comment.userId, status: 1 }));
                                    }}>{comment.fullName}: </span>
                                    <span className="font12">{xssFilters.inHTMLData(comment.comment)}</span>
                                </div>
                            )
                        }
                    })}
                    <div className="d-flex justify-content-between">
                        <div className="w-75 d-flex align-items-center">
                            <input className="form-control me-3 w-75" placeholder="توضیحات تایید کننده درخواست" defaultValue={acceptReqComment} name="acceptReqComment" onChange={(e) => dispatch(RsetAcceptReqComment(e.target.value))} />
                            <Button
                                variant="success"
                                onClick={() => {
                                    console.log(currentReqInfo);
                                    if (currentReqInfo.acceptedByHajAlireza === 0 && user.Roles.some(role => role === '14')) {
                                        //open modal
                                        setActionToPersonsModal(true);
                                    } else {
                                        handleAcceptITJobReq();
                                    }
                                }}
                            >تایید درخواست</Button>
                        </div>
                        <Button
                            onClick={() => {
                                handleResetWorkItem();
                                setWorkItems([]);
                                handleResetMaterialItem();
                                setITJProjectMaterials([]);
                                dispatch(RsetAcceptReqComment(''));
                                dispatch(RsetAcceptReqModal(false));
                            }}
                            variant="secondary"
                        >بستن</Button>
                    </div>
                </Modal.Footer>
                {irantoolAddMaterialWorkFlowModal && <AddMaterialWorkFlowModal />}
            </Fragment>
        </Modal>
    )
}

export default AcceptRequestModal;