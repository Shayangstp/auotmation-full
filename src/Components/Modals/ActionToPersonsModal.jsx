import React, {useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { selectActionToPersonsModal, RsetActionToPersonsModal } from '../Slices/mainSlices';
import { officeReqContext } from './../context/officeContext/officeReqContext';

const ActionToPersonsModal = () => {
    const dispatch = useDispatch();
    const actionToPersonsModal = useSelector(selectActionToPersonsModal);
    const officeContext = useContext(officeReqContext);
    const {
        handleSendReqToPersons
    } = officeContext;
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            backdrop="static"
            show={actionToPersonsModal}
            onHide={() => {
                dispatch(RsetActionToPersonsModal(false));
            }}
            scrollable={true}
        >
            <Modal.Body>
                <span>درخواست ارسال شود؟</span>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="success" onClick={() => {
                    handleSendReqToPersons();
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
    )
}

export default ActionToPersonsModal;