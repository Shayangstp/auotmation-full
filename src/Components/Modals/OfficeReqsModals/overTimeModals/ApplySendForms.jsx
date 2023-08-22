import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { handlePostManagerForms, RsetActionToPersonsModal, selectActionToPersonsModal } from "../../../Slices/mainSlices";

const ApplySendForms = () => {
    const dispatch = useDispatch();
    const actionToPersonsModal = useSelector(selectActionToPersonsModal);
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            backdrop="static"
            show={actionToPersonsModal}
            onHide={() => dispatch(RsetActionToPersonsModal(false))}
            scrollable={true}
        >
            <Modal.Body>
                <span>درخواست ارسال شود؟</span>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="success" onClick={() => {
                    dispatch(handlePostManagerForms())
                }}>بله</Button>
                <Button variant="danger" onClick={() => {
                    dispatch(RsetActionToPersonsModal(false));
                    const sendToPersons = document.getElementById('sendToPersons');
                    const confirmReq = document.getElementById('confirmReq');
                    if (sendToPersons !== null) {
                        sendToPersons.classList.remove('disabled');
                    }
                    if(confirmReq !== null){
                        confirmReq.classList.add('disabled');
                    }
                }}>خیر</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ApplySendForms;
