import React, { useContext, useEffect, useState } from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import ReqItems from '../../JobReq/ReqItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectViewReqModal, RsetViewReqModal, selectViewReqComment, RsetViewReqComment } from "../../Slices/modalsSlice";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";

const ViewRequestModal = ({ handleReqComment }) => {
    const dispatch = useDispatch();
    const viewReqModal = useSelector(selectViewReqModal);
    const viewReqComment = useSelector(selectViewReqComment);

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
                        <span>{"شرکت "+xssFilters.inHTMLData(currentReqInfo.reqInfo.reqToCompanyName.co_name)}</span>
                    </li> */}
                    <li className='mb-3'>
                        <span>درخواست کار همراه با مواد اولیه {currentReqInfo.byInitialMaterial === true ? 'می باشد' : 'نمی باشد'} .</span>
                    </li>
                </ul>
                <ReqItems reqItems={items} edit={false} reqItemsOperation={false} />
            </Modal.Body>
            <Modal.Footer className='d-block'>
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
                <div className="d-flex justify-content-end">
                    {/* <div className="w-75 d-flex align-items-center">
                        <input className="form-control me-3 w-75" value={viewReqComment} name="viewReqComment" onChange={(e)=>dispatch(RsetViewReqComment(e.target.value))}/>
                        <Button
                            variant="warning"
                            onClick={() => {
                                handleReqComment();
                            }}
                        >ارسال نظر</Button>
                    </div> */}
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