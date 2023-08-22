import React, { useContext, useState, useEffect } from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import ReqItems from '../../JobReq/ReqItems';
import InterCompanyJobReqNewItem from '../../JobReq/JobReqNewItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectEditReqModal, RsetEditReqModal } from "../../Slices/modalsSlice";

const EditRequestModal = ({ setEditReqItem, handleReqEdit,
    handleReqNewItemReset }) => {
    const dispatch = useDispatch();
    const editReqModal = useSelector(selectEditReqModal);

    const mainContext = useContext(rootContext);
    const {
        currentReqInfo
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
            show={editReqModal}
            onHide={() => {
                dispatch(RsetEditReqModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-primary text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>ویرایش درخواست شماره </span>
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
                        <span>{"شرکت "+xssFilters.inHTMLData(currentReqInfo.reqInfo.reqToCompanyName)}</span>
                    </li> */}
                    <li className='mb-3'>
                        <span>درخواست کار همراه با مواد اولیه {currentReqInfo.byInitialMaterial === true ? 'می باشد' : 'نمی باشد'} .</span>
                    </li>
                </ul>
                <ReqItems reqItems={items} edit={true} reqItemsOperation={false} />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <div className="w-75 d-flex align-items-center">
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleReqEdit();
                        }}
                    >ویرایش درخواست</Button>
                </div>
                <Button
                    onClick={() => {
                        setEditReqItem(false);
                        dispatch(RsetEditReqModal(false));
                        handleReqNewItemReset();
                    }}
                    variant="secondary"
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRequestModal;