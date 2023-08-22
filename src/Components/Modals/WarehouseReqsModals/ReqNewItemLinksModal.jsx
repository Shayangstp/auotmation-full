import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";

import { addLinkCntxt } from "../../context/AddLinkContext/addLinkCntxt";

const ReqNewItemLinksModal = ({reqItemLinks}) => {
    
    const addLinkContext = useContext(addLinkCntxt);
    const {
        reqNewItemLinksModal,
        setReqNewItemLinksModal
    } = addLinkContext;

    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqNewItemLinksModal}
            onHide={() => {
                setReqNewItemLinksModal(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>لینک های پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                <ul dir="ltr">
                    {reqItemLinks.map(url=> (
                        <li key={url.id} className="mx-2 mb-3"><a href={url.url} target='_blank' rel="noreferrer">{url.url}</a></li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setReqNewItemLinksModal(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqNewItemLinksModal;