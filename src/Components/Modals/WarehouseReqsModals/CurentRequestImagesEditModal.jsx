import React from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import WarehouseAddNewImage from './../../WarehouseReq/WarehouseAddNewImage';

import {reqContext} from "../../context/warehouseReqsContext/reqContext";

const CurentRequestImagesEditModal = ({itemId, edit}) => {
    
    const requestContext = useContext(reqContext);
    const {
        curentRequestImagesEditModal,
        setCurentRequestImagesEditModal,
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
            show={curentRequestImagesEditModal}
            onHide={() => {
                setCurentRequestImagesEditModal(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>ادیت تصاویر پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                {edit === true ? <WarehouseAddNewImage handleUploadEditItemImage={handleUploadEditItemImage} handleAddEditItemImage={handleAddEditItemImage}/> : null}
                <div className="mt-4">
                    {images.map(src=>(
                        <div>
                            <img className="mx-2 mb-3" width='100px' height='100px' src={src.image ? src.src : "data:"+xssFilters.inHTMLData(src.type)+";base64,"+xssFilters.inHTMLData(src.src)} alt='تصویر پیشنهادی'/>
                            {edit === true ? <i className="fa fa-trash text-danger cursorPointer" onClick={()=>{handleReqItemImageDelete(src)}}></i> : null}
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer className={edit === true ? 'justify-content-between' : 'justify-content-end'}>
                {edit === true ? <Button variant="success" onClick={()=>{curentRequestImages[0].item_id ? handleEditReqItemImages(curentRequestImages[0].item_id) : handleEditReqItemImages(itemId) }}>ذخیره</Button> : null}
                <Button variant="secondary" onClick={()=>{
                    setCurentRequestImagesEditModal(false);
                    setEditReqItemImagesFile([]);
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CurentRequestImagesEditModal;