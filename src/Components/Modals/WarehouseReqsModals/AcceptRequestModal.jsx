import React, { useContext, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import WarehouseReqItems from '../../WarehouseReq/WarehouseReqItems';
import xssFilters from "xss-filters";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import { rootContext } from "../../context/rootContext";
import { selectUser, handleUserInformation, handleUserImage } from '../../Slices/mainSlices';
import { selectCurrentReqComments, selectCurrentReqItems, selectCurrentReqInfo } from '../../Slices/currentReqSlice';
import { selectAcceptReqModal, RsetAcceptReqModal, selectAcceptReqComment, RsetAcceptReqComment, RsetNextAcceptReqModal } from "../../Slices/modalsSlice";
import PurchaseReqItems from "../../WarehouseReq/ProductPurchase/PurchaseReqItems";

const AcceptRequestModal = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const acceptReqComment = useSelector(selectAcceptReqComment);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const currentReqComments = useSelector(selectCurrentReqComments);
    const currentReqItems = useSelector(selectCurrentReqItems);

    const mainContext = useContext(rootContext);
    const {
        setReqPriority,
        reqCompletionDeadline,
        setReqCompletionDeadline,
        handleAcceptReq,
    } = mainContext;

    const acceptBTN = () => {
        if (currentReqInfo.typeId === 2) {
            return (
                <Fragment>
                    <input className="form-control me-3 w-50" placeholder="توضیحات تایید کننده درخواست" value={acceptReqComment} name="acceptReqComment" onChange={(e) => dispatch(RsetAcceptReqComment(e.target.value))} />
                    <Button
                        variant="success"
                        onClick={() => {
                            if (currentReqInfo.typeId === 9) {
                                // dispatch(handleAcceptPurchaseReq());
                            } else if (currentReqInfo.typeId === 2) {
                                if (currentReqInfo.lastActionCode === 6) {
                                    dispatch(RsetAcceptReqModal(false));
                                    dispatch(RsetNextAcceptReqModal(true));
                                } else if (currentReqInfo.lastActionCode === 29) {
                                    handleAcceptReq('warehouseLastAccept');
                                } else if (currentReqInfo.lastActionCode === 24) {
                                    handleAcceptReq('lastAccept');
                                } else if (currentReqInfo.lastActionCode === 31) {
                                    handleAcceptReq('managerAccept');
                                } else {
                                    dispatch(RsetAcceptReqModal(false));
                                    dispatch(RsetNextAcceptReqModal(true));
                                }
                            }
                        }}
                    >
                        {currentReqInfo.lastActionCode === 29 ? 'مختومه' : 'تایید درخواست'}
                    </Button>
                </Fragment>
            )
        } else if (currentReqInfo.typeId === 9 && currentReqInfo.lastActionCode === 0) {
            return (
                <Fragment>
                    <input className="form-control me-3 w-50" placeholder="توضیحات تایید کننده درخواست" value={acceptReqComment} name="acceptReqComment" onChange={(e) => dispatch(RsetAcceptReqComment(e.target.value))} />
                    <Button
                        variant="success"
                        onClick={() => {
                            if (currentReqInfo.typeId === 9) {
                                // dispatch(handleAcceptPurchaseReq());
                            } else if (currentReqInfo.typeId === 2) {
                                if (currentReqInfo.lastActionCode === 6) {
                                    dispatch(RsetAcceptReqModal(false));
                                    dispatch(RsetNextAcceptReqModal(true));
                                } else if (currentReqInfo.lastActionCode === 29) {
                                    handleAcceptReq('warehouseLastAccept');
                                } else if (currentReqInfo.lastActionCode === 24) {
                                    handleAcceptReq('lastAccept');
                                } else if (currentReqInfo.lastActionCode === 31) {
                                    handleAcceptReq('managerAccept');
                                } else {
                                    dispatch(RsetAcceptReqModal(false));
                                    dispatch(RsetNextAcceptReqModal(true));
                                }
                            }
                        }}
                    >
                        {currentReqInfo.lastActionCode === 29 ? 'مختومه' : 'تایید درخواست'}
                    </Button>
                </Fragment>
            )
        } else {
            return null
        }
    }

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
            scrollable={true}
            id='modalBlur'
        >
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
                <ul className='list-unstyled'>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>نام و نام خانوادگی ثبت کننده:</span>
                        <span className="cursorPointer" onClick={() => {
                            dispatch(handleUserInformation(currentReqInfo.userId));
                            dispatch(handleUserImage({ userId: currentReqInfo.userId, status: 1 }));
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
            <Modal.Footer className="d-block">
                {/* {currentReqInfo.typeId === 2 ?
                    <Fragment>
                        <div className="d-flex">
                            {currentReqInfo.deadline !== null ?
                                <div>
                                    <span>آخرین مهلت تحویل : </span>
                                    <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.deadline), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                </div>
                                : null}
                            {currentReqInfo.priority === true ?
                                <div className="ms-4">
                                    <span>اولویت : </span>
                                    <span>فوری</span>
                                </div>
                                : null}
                        </div>
                        {user.Roles.some(role => role === '36') ?
                            user.Roles.some(role => role === '3') ?
                                currentReqInfo.process[currentReqInfo.process.length - 1].action_code !== 30 &&
                                    currentReqInfo.process.some(process => process.action_code === 6) === false ?
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="d-flex align-items-center me-5">
                                            <Form.Label className='mb-1 me-3'>{currentReqInfo.deadline !== null ? 'تغییر مهلت تحویل :' : 'آخرین مهلت تحویل :'}</Form.Label>
                                            <DatePicker
                                                inputReadOnly
                                                name='reqCompletionDeadline'
                                                isGregorian={false}
                                                timePicker={false}
                                                showTodayButton={false}
                                                min={new Date()}
                                                inputFormat="YYYY-MM-DD"
                                                inputJalaaliFormat="jYYYY/jMM/jDD"
                                                value={reqCompletionDeadline}
                                                onChange={e => { setReqCompletionDeadline(e) }}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Form.Label className='mb-1 me-3'>اولویت :</Form.Label>
                                            <div className="d-flex align-items-center me-4">
                                                <input type='radio' name='reqPriority' value={false} defaultChecked={xssFilters.inHTMLData(!currentReqInfo.reqInfo.priority)} onChange={(e) => { setReqPriority(e.currentTarget.value) }} />
                                                <Form.Label className='ms-2 font12 mb-0'> عادی </Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <input type='radio' name='reqPriority' value={true} defaultChecked={xssFilters.inHTMLData(currentReqInfo.reqInfo.priority)} onChange={(e) => { setReqPriority(e.currentTarget.value) }} />
                                                <Form.Label className='ms-2 font12 mb-0'> فوری </Form.Label>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                : null
                            : null}
                    </Fragment>
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
                        {acceptBTN()}
                    </div>
                    <Button
                        onClick={() => {
                            dispatch(RsetAcceptReqComment(''));
                            dispatch(RsetAcceptReqModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AcceptRequestModal;