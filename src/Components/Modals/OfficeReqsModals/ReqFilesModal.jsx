import React, { useContext } from "react";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { Modal, Button } from "react-bootstrap";

const ReqFilesModal = () => {
    const officeContext = useContext(officeReqContext);
    const {
        reqFilesModalShow,
        setReqFilesModalShow,
    } = officeContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqFilesModalShow}
            onHide={() => {
                setReqFilesModalShow(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>فایل های پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setReqFilesModalShow(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqFilesModal;