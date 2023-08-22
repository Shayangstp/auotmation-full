import React from "react";
import { Modal, Button } from "react-bootstrap";

const AcceptOrCancleUserInfoModal = ({acceptOrCancleUserInfoModal, setAcceptOrCancleUserInfoModal}) => {
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={acceptOrCancleUserInfoModal}
            onHide={() => {
                setAcceptOrCancleUserInfoModal(false);
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-primary text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer className="justify-content-between">
               
            </Modal.Footer>
        </Modal>
    )
}

export default AcceptOrCancleUserInfoModal;