import React, {useContext} from "react";
import { reqContext } from "../../context/warehouseReqsContext/reqContext";
import { Modal, Button } from "react-bootstrap";

const ChangedReqValuesModal = () => {
    const requestContext = useContext(reqContext);
    const {
        updateReqValuesModal,
        setUpdateReqValuesModal,
        handleUpdateReqValues
    } = requestContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            backdrop="static"
            show={updateReqValuesModal}
            onHide={() => {
                setUpdateReqValuesModal(false);
            }}
            scrollable={true}
        >
            <Modal.Body>
                <span>داده های این درخواست تغییر کرده اند. بروزرسانی داده ها انجام شود؟</span>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="success" onClick={()=>{
                    handleUpdateReqValues();
                }}>بله</Button>
                <Button variant="danger" onClick={()=>{
                    setUpdateReqValuesModal(false);
                }}>خیر</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ChangedReqValuesModal;