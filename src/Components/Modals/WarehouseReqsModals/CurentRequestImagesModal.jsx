import React, {useContext} from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import WarehouseAddNewImage from "../../WarehouseReq/WarehouseAddNewImage";

import {reqContext} from "../../context/warehouseReqsContext/reqContext";

const CurentRequestImagesModal = ({itemId}) => {

    const requestContext = useContext(reqContext);
    const {
        curentRequestImagesModal,
        setCurentRequestImagesModal,
        curentRequestImages,
        handleUploadEditItemImage,
        handleAddEditItemImage,
        editReqItemImagesFile,
        handleReqItemImageDelete,
        handleEditReqItemImages,
        setEditReqItemImagesFile,
    } = requestContext;

    const images = [...curentRequestImages, ...editReqItemImagesFile];
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={curentRequestImagesModal}
            onHide={() => {
                setCurentRequestImagesModal(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>تصاویر پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                <WarehouseAddNewImage handleUploadEditItemImage={handleUploadEditItemImage} handleAddEditItemImage={handleAddEditItemImage}/>
                <div className="mt-4">
                    {images.map(src=>(
                        <div>
                            <img className="mx-2 mb-3" width='100px' height='100px' src={src.image ? src.src : "data:"+xssFilters.inHTMLData(src.type)+";base64,"+xssFilters.inHTMLData(src.src)} alt='تصویر پیشنهادی'/>
                            <FontAwesomeIcon icon={faTrashAlt} className="text-danger cursorPointer me-2 cursorPointer" onClick={()=>{handleReqItemImageDelete(src)}}/>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer className='justify-content-between'>
                <Button variant="success" onClick={()=>{handleEditReqItemImages(itemId)}}>ذخیره</Button>
                <Button variant="secondary" onClick={()=>{
                    setCurentRequestImagesModal(false);
                    setEditReqItemImagesFile([]);
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CurentRequestImagesModal;