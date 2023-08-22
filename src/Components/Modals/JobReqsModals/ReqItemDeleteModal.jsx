import React from "react";
import { Modal, Button } from "react-bootstrap";
const ReqItemDeleteModal = ({reqItemDeleteModal, setReqItemDeleteModal, handleReqItemDelete, reqItemId, newReq}) => {
    return(
        <Modal
            size="sm"
            centered
            backdrop='static'
            show={reqItemDeleteModal}
            onHide={() => {
                setReqItemDeleteModal(false)
            }}
            className="modal"
        >
            <Modal.Body>
                <p className=''>از حذف این کالا اطمینان دارید؟</p>
                <div className="d-flex justify-content-between">
                    <Button variant="danger" onClick={()=>handleReqItemDelete(reqItemId, newReq)}>بله</Button>
                    <Button variant="secondary" onClick={() => setReqItemDeleteModal(false)}>خير</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ReqItemDeleteModal;