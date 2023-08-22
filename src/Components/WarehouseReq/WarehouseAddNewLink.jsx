import React from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const WarehouseAddNewLink = ({editReqItemLink, setEditReqItemLink, handleAddEditItemLink}) => {
    return(
        <div className="input-group">
            <Form.Control type="text" value={editReqItemLink} name="reqItemLink" id='reqItemLink' onChange={(e) => { setEditReqItemLink(e.target.value) }} dir='ltr'/>
            <div className="input-group-prepend">
                <Button variant="primary" onClick={handleAddEditItemLink}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </div>
        </div>
    )
}

export default WarehouseAddNewLink;