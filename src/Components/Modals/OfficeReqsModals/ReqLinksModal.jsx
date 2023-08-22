import React, { useContext } from "react";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { Modal, Button } from "react-bootstrap";

const ReqLinksModal = () => {
    const officeContext = useContext(officeReqContext);
    const {
        reqLinks,
        reqLinksModalShow,
        setReqLinksModalShow
    } = officeContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqLinksModalShow}
            onHide={() => {
                setReqLinksModalShow(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>لینک های پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                <ul dir="ltr">
                    {reqLinks.map(url=> (
                        <li key={url.id} className="mx-2 mb-3"><a href={url.url} target='_blank' rel="noreferrer">{url.url}</a></li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setReqLinksModalShow(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqLinksModal;