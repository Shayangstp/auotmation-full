import React, { useContext, useState, useEffect } from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import ReqItems from '../../JobReq/ReqItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectCancelReqModal, RsetCancelReqModal, selectCancelReqComment, RsetCancelReqComment } from "../../Slices/modalsSlice";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";

const CancelRequestModal = ({ handleReqCancel }) => {
    const dispatch = useDispatch();
    const cancelReqModal = useSelector(selectCancelReqModal);
    const cancelReqComment = useSelector(selectCancelReqComment);

    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        currentReqComments,
    } = mainContext;

    const [items, setItems] = useState([]);
    useEffect(() => {
        if (currentReqInfo.reqItemSubject !== undefined) {
            const reqItems = []
            const item = {
                reqItemSubject: currentReqInfo.reqItemSubject,
                reqItemAmount: currentReqInfo.reqItemAmount,
                reqItemTechSpecifications: currentReqInfo.reqItemTechInfo,
                reqItemDeadline: currentReqInfo.reqItemDeadline,
                _id: currentReqInfo.reqItemId,
                pattern: currentReqInfo.reqItemPattern,
                description: currentReqInfo.reqItemDescription
            }
            reqItems.push(item)
            setItems(reqItems)
        }
    }, [currentReqInfo])

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
                        <span>{momentJalaali.utc(currentReqInfo.createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className='list-unstyled'>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>شرح درخواست:</span>
                        <span>{currentReqInfo.description !== null ? xssFilters.inHTMLData(currentReqInfo.description) : ''}</span>
                    </li>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>نام و نام خانوادگی درخواست کننده:</span>
                        <span>{xssFilters.inHTMLData(currentReqInfo.fullName)}</span>
                    </li>
                    <li className='mb-3'>
                        <span className='fw-bold me-2'>محل ارسال درخواست:</span>
                        <span>{"شرکت " + xssFilters.inHTMLData(currentReqInfo.companyName) + " واحد " + xssFilters.inHTMLData(currentReqInfo.deptName)}</span>
                    </li>
                    {/* <li className='mb-3'>
                        <span className='fw-bold me-2'>محل دریافت درخواست:</span>
                        <span>{"شرکت "+xssFilters.inHTMLData(currentReqInfo.companyName)}</span>
                    </li> */}
                    <li className='mb-3'>
                        <span>درخواست کار همراه با مواد اولیه {currentReqInfo.byInitialMaterial === true ? 'می باشد' : 'نمی باشد'} .</span>
                    </li>
                </ul>
                <ReqItems reqItems={items} edit={false} reqItemsOperation={false} />
            </Modal.Body>
            <Modal.Footer className="d-block">
                {currentReqComments.map((action, index) => {
                    if (action.comment !== null && action.comment !== undefined && action.comment !== '') {
                        return (
                            <div className="d-block" key={index}>
                                <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                                    dispatch(handleUserInformation(action.userId));
                                    dispatch(handleUserImage({ userId: action.userId, status: 1 }));
                                }}>{action.fullName}: </span>
                                <span className="font12">{xssFilters.inHTMLData(action.comment)}</span>
                            </div>
                        )
                    }
                })}
                <div className="d-flex justify-content-between">
                    <div className="w-75 d-flex align-items-center">
                        <input className="form-control me-3 w-75" placeholder="توضیحات کنسل کننده درخواست" value={cancelReqComment} name="setComment" onChange={(e) => dispatch(RsetCancelReqComment(e.target.value))} />
                        <Button
                            variant="danger"
                            onClick={() => {
                                handleReqCancel();
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