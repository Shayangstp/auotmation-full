import React, { useContext } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ReqNewItemImagesM from "../../Modals/WarehouseReqsModals/ReqNewItemImagesModal";
import { addImageCntxt } from './../../context/AddImageContext/addImageCntxt';

const AddImageInput = () => {

    const addImageContext = useContext(addImageCntxt);
    const {
        handleUploadItemImage,
        reqItemImageRef,
        handleAddItemImage,
        reqItemImagesFile,
        reqNewItemImagesModal,
        setReqNewItemImagesModal
    } = addImageContext;

    return (
        <Form.Group as={Col} md='6' lg='6' xxl='3' className='mb-4'>
            <Form.Label className='mb-1'> تصاویر پیشنهادی : </Form.Label>
            <div className="input-group">
                <Form.Control type="file" name="reqItemImage" id='reqItemImage' onChange={e => handleUploadItemImage(e)}
                //  onKeyUp={handleEnter}
                 ref={reqItemImageRef} accept=".jpeg,.jpg,.png,.gif" />
                <div className="input-group-prepend">
                    <Button variant="primary" onClick={handleAddItemImage}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </div>
            {reqItemImagesFile.length !== 0 ? <span className="font12 cursorPointer" onClick={() => setReqNewItemImagesModal(true)}>نمایش تصاویر <span>({reqItemImagesFile.length})</span></span> : null}
            {reqNewItemImagesModal ? <ReqNewItemImagesM reqItemImagesFile={reqItemImagesFile} reqNewItemImagesModal={reqNewItemImagesModal} setReqNewItemImagesModal={setReqNewItemImagesModal} /> : null}
        </Form.Group>
    )
}
export default AddImageInput;


