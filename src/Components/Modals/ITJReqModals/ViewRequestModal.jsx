import React, { Fragment, useContext, useEffect } from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Table } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileWord, faFilePdf, faFileImage, faFileExcel, faFilePowerpoint, faFileZipper } from '@fortawesome/free-solid-svg-icons';
import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectViewReqModal, RsetViewReqModal } from "../../Slices/modalsSlice";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";
import { handleReqFiles, selectCurrentReqFiles } from '../../Slices/currentReqSlice';

const ViewRequestModal = () => {
    const dispatch = useDispatch();
    const viewReqModal = useSelector(selectViewReqModal);
    const currentReqFiles = useSelector(selectCurrentReqFiles);
    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        currentReqCo,
        currentReqComments,
    } = mainContext;

    // const jobContext = useContext(iranTolJobCntxt);
    // const {
    //     handleDownloadReqPlans,
    // } = jobContext;

    useEffect(() => {
        dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: 0, multi: 0, justShow: 1, fileName: ''}));
    }, [])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={viewReqModal}
            onHide={() => {
                dispatch(RsetViewReqModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-warning text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>جزئیات درخواست شماره </span>
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
                        <ul className="d-flex mt-5 list-unstyled">
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
                            dispatch(handleReqFiles({reqId: currentReqInfo.requestId, index: 0, justShow: 1, multi: 0, fileName: 'allFiles'}));
                        }}>
                            <span>دانلود همه فایل های درخواست</span>
                        </div>
                    </Fragment>
                    : <p>فایلی آپلود نشده است!</p>
                }
                {/* {currentReqInfo.plans !== undefined && currentReqInfo.plans.length !== 0 && (user.Roles.some(role=> role === '56' || role === '57')
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
            </Modal.Body>
            <Modal.Footer className='d-block'>
                {currentReqComments.map((action, index) => {
                    if (action.comment !== null && action.comment !== undefined && action.comment !== '') {
                        return (
                            <div className="d-block" key={index}>
                                <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                                    dispatch(handleUserInformation(action.userId));
                                    dispatch(handleUserImage({userId: action.userId, status: 1}));
                                }}>{action.fullName}: </span>
                                <span className="font12">{xssFilters.inHTMLData(action.comment)}</span>
                            </div>
                        )
                    }
                })}
                <div className="d-flex justify-content-end">
                    <Button
                        onClick={() => {
                            dispatch(RsetViewReqModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewRequestModal;