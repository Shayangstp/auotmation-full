import React, { useContext, useEffect } from "react";
import { rootContext } from "../../context/rootContext";
import { reqContext } from "../../context/warehouseReqsContext/reqContext";
import { Modal, Button } from "react-bootstrap";
import xssFilters from "xss-filters";
import { useSelector } from "react-redux";
import { selectCurrentReqItem } from './../../Slices/currentReqSlice';

const ReqItemDetailsModal = () => {
    const currentReqItem = useSelector(selectCurrentReqItem);

    const mainContext = useContext(rootContext);
    const {
        reqItemDetailsModal,
        setReqItemDetailsModal,
    } = mainContext;    

    const requestContext = useContext(reqContext);
    const {
        handleItemReceivedDetails
    } = requestContext;

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqItemDetailsModal}
            onHide={() => {
                setReqItemDetailsModal(false);
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-warning text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-center">
                    اطلاعات آیتم
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-unstyled p-0 row">
                    <li className="mb-3 col-12">
                        <span className="fw-bold">نام کالا: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">کد معادل انبار: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.invCode)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">تعداد/مقدار درخواستی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemAmount)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">داغی: </span>
                        <span>{currentReqItem.rattletrap === true ? 'دارد' : 'ندارد'}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">امانی: </span>
                        <span>{currentReqItem.consumable === true ? 'هست' : 'نیست'}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">مصرفی: </span>
                        <span>{currentReqItem.borrowed === true ? 'هست' : 'نیست'}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">واحد شمارش درخواستی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemUnit)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">توضیحات درخواست کننده: </span>
                        <span>{currentReqItem.itemDescription !== null ? xssFilters.inHTMLData(currentReqItem.itemDescription) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">توضیحات انباردار: </span>
                        <span>{currentReqItem.invKeeperComment !== null ? xssFilters.inHTMLData(currentReqItem.invKeeperComment) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">توضیحات مدیر: </span>
                        <span>{currentReqItem.managerComment !== null ? xssFilters.inHTMLData(currentReqItem.managerComment) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">جمع تعداد/مقدار تحویلی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.receivedAmount)}</span>
                    </li>
                    <li className="mb-5 col-12">
                        <span className="fw-bold">مانده: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.remainder)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <Button variant="info" onClick={()=>{
                            handleItemReceivedDetails(currentReqItem.itemId)
                        }}>جزئیات تحویل</Button>
                    </li>
                </ul>
            </Modal.Body>
            <Modal.Footer className='d-block'>
                <div className="d-flex justify-content-end">                    
                    <Button
                        onClick={() => {
                            setReqItemDetailsModal(false);
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqItemDetailsModal;