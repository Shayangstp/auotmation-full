import React, { Fragment, useContext } from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';

import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectCancelReqModal, RsetCancelReqModal, selectCancelReqComment, RsetCancelReqComment } from "../../Slices/modalsSlice";
import { selectCurrentReqInfo, selectCurrentReqComments } from "../../Slices/currentReqSlice";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";

const CancelRequestModal = () => {
    const dispatch = useDispatch();
    const cancelReqModal = useSelector(selectCancelReqModal);
    const cancelReqComment = useSelector(selectCancelReqComment);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const currentReqComments = useSelector(selectCurrentReqComments);

    const mainContext = useContext(rootContext);
    const {
        handleOfficeLeaveCancel,
    } = mainContext;

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={cancelReqModal}
            onHide={() => {
                dispatch(RsetCancelReqModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-danger text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>ابطال درخواست شماره </span>
                        <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                    </div>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className='list-unstyled'>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>نام و نام خانوادگی: </span>
                        <span>{xssFilters.inHTMLData(currentReqInfo.fullName)}</span>
                    </li>
                    {currentReqInfo.typeId === 4 ?
                        <Fragment>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>نوع درخواست: </span>
                                <span>{currentReqInfo.leaveKindName}</span>
                            </li>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>نوع مرخصی: </span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.leaveTypeName)}</span>
                            </li>
                            {currentReqInfo.leaveKindName === 'روزانه' ?
                                <li className='mb-3 d-flex'>
                                    <div className="me-3">
                                        <span className='fw-bold me-2'>از تاریخ: </span>
                                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.startDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                    </div>
                                    <div>
                                        <span className='fw-bold me-2'>تا تاریخ: </span>
                                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.endDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                    </div>
                                </li>
                                :
                                <li className='mb-3 d-flex'>
                                    <div className="me-3">
                                        <span className='fw-bold me-2'>از ساعت: </span>
                                        <span>{new Date(currentReqInfo.startDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div>
                                        <span className='fw-bold me-2'>تا ساعت: </span>
                                        <span>{new Date(currentReqInfo.endDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </li>
                            }
                        </Fragment>
                        : null}
                    {currentReqInfo.typeId === 9 ?
                        <Fragment>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>موضوع ماموریت: </span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.subject)}</span>
                            </li>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>شهر مقصد: </span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.city)}</span>
                            </li>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>کارخانه: </span>
                                <span>{currentReqInfo.toCompany !== undefined ? xssFilters.inHTMLData(currentReqInfo.toCompany) : ''}</span>
                            </li>
                            <li className='mb-3 d-flex'>
                                <div className="me-3">
                                    <span className='fw-bold me-2'>از تاریخ: </span>
                                    <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.startDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                </div>
                                <div>
                                    <span className='fw-bold me-2'>تا تاریخ: </span>
                                    <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.endDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                </div>
                            </li>
                            <li className="mb-3">
                                <span className='fw-bold me-2'>نوع سفر: </span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.tripType.name)}</span>
                            </li>
                        </Fragment>
                        : null}
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>توضیحات: </span>
                        <span>{currentReqInfo.description !== null ? xssFilters.inHTMLData(currentReqInfo.description) : ''}</span>
                    </li>
                </ul>
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
                        <input className="form-control me-3 w-75" placeholder="توضیحات کنسل کننده درخواست" defaultValue={cancelReqComment} name="setComment" onChange={(e) => dispatch(RsetCancelReqComment(e.target.value))} />
                        <Button
                            variant="danger"
                            onClick={() => {
                                handleOfficeLeaveCancel();
                            }}
                        >ابطال درخواست</Button>
                    </div>
                    <Button
                        onClick={() => {
                            dispatch(RsetCancelReqComment(''));
                            dispatch(RsetCancelReqModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default CancelRequestModal;