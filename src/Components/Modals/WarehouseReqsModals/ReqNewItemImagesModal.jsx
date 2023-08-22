import React, {useContext} from "react";
import { Modal, Button } from "react-bootstrap";

import { addImageCntxt } from "../../context/AddImageContext/addImageCntxt";

const ReqNewItemImagesModal = ({reqItemImagesFile}) => {
    const addImageContext = useContext(addImageCntxt);
    const {
        reqNewItemImagesModal,
        setReqNewItemImagesModal
    } = addImageContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqNewItemImagesModal}
            onHide={() => {
                setReqNewItemImagesModal(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>تصاویر پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                {reqItemImagesFile.map(src=> (
                    <img key={Math.floor(Math.random()*1000)} className="mx-2 mb-3" width='100px' height='100px' src={src.src} alt='تصویر پیشنهادی'/>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setReqNewItemImagesModal(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqNewItemImagesModal;