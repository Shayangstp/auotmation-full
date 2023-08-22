import React from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const WarehouseAddNewImage = ({handleUploadEditItemImage, handleAddEditItemImage}) => {
    return(
        <div className="input-group">
            <Form.Control type="file" name="editReqItemImage" className='editReqItemImage' onChange={e => handleUploadEditItemImage(e)} accept=".jpeg,.jpg,.png,.gif"/>
            <div className="input-group-prepend">
                <Button variant="primary" onClick={handleAddEditItemImage}>
                    <i className="fa fa-plus"></i>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </div>
        </div>
    )
}

export default WarehouseAddNewImage;