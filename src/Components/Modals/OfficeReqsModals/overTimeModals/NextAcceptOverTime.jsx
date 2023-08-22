import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from "react-bootstrap";
import { selectNextAcceptReqModal, RsetNextAcceptReqModal} from './../../../Slices/modalsSlice';
import { handleSendOverTimeReqToManager, handleSendOverTimeReqToOffice } from '../../../Slices/OverTimeSlice';

const NextAcceptOverTime = () => {
    const dispatch = useDispatch();
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            backdrop="static"
            show={nextAcceptReqModal}
            onHide={() => {
                dispatch(RsetNextAcceptReqModal(false));
            }}
            scrollable={true}
        >
            <Modal.Body>
                <span>آیا نیاز به تایید بعدی هست؟</span>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="success" onClick={() => {
                    dispatch(handleSendOverTimeReqToManager());
                }}>بله</Button>
                <Button variant="danger" onClick={() => {
                    dispatch(handleSendOverTimeReqToOffice());
                }}>خیر</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NextAcceptOverTime;