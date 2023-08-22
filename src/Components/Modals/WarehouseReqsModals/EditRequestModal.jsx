import React, { useContext, Fragment } from "react";
import xssFilters from "xss-filters";
import { reqContext } from "../../context/warehouseReqsContext/reqContext";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import WarehouseReqItems from '../../WarehouseReq/WarehouseReqItems';
import WarehouseReqNewItem from '../../WarehouseReq/WarehouseReqNewItem';

import { useDispatch, useSelector } from "react-redux";
import { handleUserInformation, handleUserImage } from '../../Slices/mainSlices';
import { selectEditReqModal, RsetEditReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqItems, selectCurrentReqInfo, RsetCurrentReqInfo } from '../../Slices/currentReqSlice';
import { handleResetWarehouseReqItem, handleEditWarehouseReqItems } from "../../Slices/warehouseSlice";
import PurchaseReqItems from "../../WarehouseReq/ProductPurchase/PurchaseReqItems";
import { handleEditPurchaseReqItems } from '../../Slices/purchaseSlice';
import PurchaseReqNewItem from "../../WarehouseReq/ProductPurchase/PurchaseReqNewItem";

const EditRequestModal = () => {

    const dispatch = useDispatch();
    const editReqModal = useSelector(selectEditReqModal);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const currentReqItems = useSelector(selectCurrentReqItems);

    const requestContext = useContext(reqContext);
    const {
        setEditReqItem,
    } = requestContext;

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
                    currentReqItems !== 0 ?
                        <Fragment>
                            <div className="border border-dark p-3 mb-3">
                                <WarehouseReqNewItem />
                            </div>
                            <WarehouseReqItems reqItemsOperation={true} edit={true} />
                            <span className="mt-3 font12">
                                تعداد کل آیتم ها: {currentReqItems.length}
                            </span>
                        </Fragment>
                        : null
                    : null}
                {currentReqInfo.typeId === 9 ?
                    currentReqItems.length !== 0 ?
                        <Fragment>
                            <PurchaseReqNewItem/>
                            <PurchaseReqItems reqItemsOperation={true} edit={true}/>
                        </Fragment>
                        : null
                    : null}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <div className="w-75 d-flex align-items-center">
                    <Button
                        // disabled
                        variant="primary"
                        onClick={() => {
                            if(currentReqInfo.typeId === 2){
                                dispatch(handleEditWarehouseReqItems());
                            }else if(currentReqInfo.typeId === 9){
                                dispatch(handleEditPurchaseReqItems());
                            }
                        }}
                    >ویرایش درخواست</Button>
                </div>
                <Button
                    onClick={() => {
                        dispatch(RsetCurrentReqInfo([]));
                        setEditReqItem(false);
                        dispatch(RsetEditReqModal(false));
                        dispatch(handleResetWarehouseReqItem());
                    }}
                    variant="secondary"
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRequestModal;