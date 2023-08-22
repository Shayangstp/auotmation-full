import React, { Fragment, useContext } from "react";
import { Modal, Button } from "react-bootstrap";

import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectNextAcceptReqModal, RsetNextAcceptReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";

const NextAcceptRequestModal = () => {
    const dispatch = useDispatch();
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
    const currentReqInfo = useSelector(selectCurrentReqInfo);

    const mainContext = useContext(rootContext);
    const {
        handleOfficeLeaveAccept,
    } = mainContext;

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
                    if(currentReqInfo.typeId === 4){
                        handleOfficeLeaveAccept(false);
                    }else{
                        handleOfficeLeaveAccept('sendToUpSup');
                    }
                }}>بله</Button>
                <Button variant="danger" onClick={() => {
                    if(currentReqInfo.typeId === 4){
                        handleOfficeLeaveAccept(true);
                    }else{
                        handleOfficeLeaveAccept('sendToCoordinator');
                    }
                }}>خیر</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NextAcceptRequestModal;