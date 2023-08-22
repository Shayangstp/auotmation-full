import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteWarehouseReqItem } from '../../Slices/warehouseSlice';
import { handleDeletePurchaseReqItem } from '../../Slices/purchaseSlice';
import { selectDeleteReqItemModal, RsetDeleteReqItemModal } from '../../Slices/modalsSlice';
import { selectCurrentDep } from './../../Slices/TableCheckoutSlice';
import { selectCurrentReqInfo } from './../../Slices/currentReqSlice';

const DeleteRequestItemModal = ({reqItemId, type}) => {
    const dispatch = useDispatch();
    const deleteReqItemModal = useSelector(selectDeleteReqItemModal);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    
    return(
        <Modal
            size="sm"
            centered
            backdrop='static'
            show={deleteReqItemModal}
            onHide={() => {
                dispatch(RsetDeleteReqItemModal(false));
            }}
            className="modal"
        >
            <Modal.Body>
                <p className=''>از حذف این کالا اطمینان دارید؟</p>
                <div className="d-flex justify-content-between">
                    <Button variant="danger" onClick={()=> {
                        if(type === 'purchase'){
                            dispatch(handleDeletePurchaseReqItem(reqItemId))
                        }else if(type ==='warehouse'){
                            dispatch(handleDeleteWarehouseReqItem(reqItemId))
                        }}
                    }>بله</Button>
                    <Button variant="secondary" onClick={() => dispatch(RsetDeleteReqItemModal(false))}>خير</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteRequestItemModal;