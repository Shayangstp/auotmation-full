import React, { Fragment } from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import WarehouseReqItems from '../../WarehouseReq/WarehouseReqItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import PurchaseReqItems from "../../WarehouseReq/ProductPurchase/PurchaseReqItems";
import { useDispatch, useSelector } from "react-redux";
import { handleSendViewComment, handleUserInformation, handleUserImage } from "../../Slices/mainSlices";
import { selectViewReqModal, RsetViewReqModal, selectViewReqComment, RsetViewReqComment } from "../../Slices/modalsSlice";
import { selectCurrentReqComments, selectCurrentReqItems, selectCurrentReqInfo } from '../../Slices/currentReqSlice';

const ViewRequestModal = () => {
    const dispatch = useDispatch();
    const viewReqModal = useSelector(selectViewReqModal);
    const viewReqComment = useSelector(selectViewReqComment);
    const currentReqComments = useSelector(selectCurrentReqComments);
    const currentReqItems = useSelector(selectCurrentReqItems);
    const currentReqInfo = useSelector(selectCurrentReqInfo);

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
            id='viewModalBlur'
        >
            <Modal.Header className='d-block bg-warning text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>جزئیات درخواست شماره </span>
                        <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                    </div>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>
                            {momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}
                        </span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className='list-unstyled'>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>نام و نام خانوادگی ثبت کننده:</span>
                        <span className="cursorPointer" onClick={() => {
                            dispatch(handleUserInformation(currentReqInfo.userId));
                            dispatch(handleUserImage(currentReqInfo.userId));
                        }}>{xssFilters.inHTMLData(currentReqInfo.fullName)}</span>
                    </li>
                    {currentReqInfo.typeId === 2 ?
                        <Fragment>
                            {currentReqInfo.applicantFullName !== undefined && currentReqInfo.applicantFullName !== " "
                                ? <li className='mb-3'>
                                    <span className='fw-bold me-2'>نام و نام خانوادگی درخواست کننده:</span>
                                    <span className="cursorPointer">{xssFilters.inHTMLData(currentReqInfo.applicantFullName)}</span>
                                </li>
                                : null
                            }
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>واحد سازمانی:</span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.deptName)}</span>
                            </li>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>توضیحات:</span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.description !== null ? currentReqInfo.description : '')}</span>
                            </li>
                        </Fragment>
                        : null}
                    {currentReqInfo.typeId === 9 ?
                        <Fragment>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>محل خرید:</span>
                                <span>{xssFilters.inHTMLData(currentReqInfo.companyName)}</span>
                            </li>
                            <li className='mb-3'>
                                <span className='fw-bold me-2'>توضیحات:</span>
                                <span>{currentReqInfo.description !== null ? xssFilters.inHTMLData(currentReqInfo.description) : ''}</span>
                            </li>
                        </Fragment>
                        : null}
                </ul>
                {currentReqInfo.typeId === 2 ?
                    currentReqItems.length !== 0 ?
                        <Fragment>
                            <WarehouseReqItems reqItemsOperation={false} edit={false} />
                            <span className="mt-3 font12">
                                تعداد کل آیتم ها: {currentReqItems.length}
                            </span>
                        </Fragment>
                        : null
                    : null}
                {currentReqInfo.typeId === 9 ?
                    currentReqItems.length !== 0 ?
                        <PurchaseReqItems reqItemsOperation={false} edit={false} />
                        : null
                    : null}
            </Modal.Body>
            <Modal.Footer className='d-block'>
                {/* {currentReqType === 2 ?
                    <div className="d-flex">
                        {currentReqInfo.deadline !== null ?
                            <div className="me-4">
                                <span>آخرین مهلت تحویل : </span>
                                <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.deadline), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                            </div>
                            : null}
                        {currentReqInfo.priority === true ?
                            <div>
                                <span>اولویت : </span>
                                <span>فوری</span>
                            </div>
                            : null}
                    </div>
                    : null} */}
                <div>
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
                </div>
                <div className="d-flex justify-content-between">
                    <div className="w-75 d-flex align-items-center">
                        <input className="form-control me-3 w-75" value={viewReqComment} name="viewReqComment" onChange={(e) => dispatch(RsetViewReqComment(e.target.value))} />
                        <Button
                            variant="warning"
                            onClick={() => {
                                dispatch(handleSendViewComment());
                            }}
                        >ارسال نظر</Button>
                    </div>
                    <Button
                        onClick={() => {
                            dispatch(RsetViewReqComment(''));
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