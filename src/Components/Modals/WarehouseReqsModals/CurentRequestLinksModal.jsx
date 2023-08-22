import React, {useContext} from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import WarehouseAddNewLink from "../../WarehouseReq/WarehouseAddNewLink";

import {reqContext} from "../../context/warehouseReqsContext/reqContext";

const CurentRequestLinksModal = () => {
    
    const requestContext = useContext(reqContext);
    const {
        curentRequestLinksModal,
        setCurentRequestLinksModal,
        curentRequestLinks,
        handleReqItemLinkDelete,
        handleEditReqItemLinks,
        handleEditReqItemLink,
        editReqItemLink,
        setEditReqItemLink,
        handleAddEditItemLink
    } = requestContext;

    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={curentRequestLinksModal}
            onHide={() => {
                setCurentRequestLinksModal(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>لینک های پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                <WarehouseAddNewLink editReqItemLink={editReqItemLink} setEditReqItemLink={setEditReqItemLink} handleAddEditItemLink={handleAddEditItemLink}/>
                <ul dir="ltr" className="mt-4">
                    {curentRequestLinks.list !== [] ? curentRequestLinks.list.map((url, i)=>(
                        <li key={url.id} className="mx-2 mb-3">
                            <a href={url.url} target='_blank' rel="noreferrer">{xssFilters.inHTMLData(url.url)}</a>
                            {/* <input type='text' defaultValue={url.url} className='form-control' onChange={e=>{handleEditReqItemLink(e.target.value,url, curentRequestLinks.item_id)}}/> */}
                            <FontAwesomeIcon icon={faTrashAlt} className="text-danger cursorPointer me-2 cursorPointer" onClick={()=>{handleReqItemLinkDelete(url)}}/>
                        </li>
                    )) : null}
                </ul>
            </Modal.Body>
            <Modal.Footer className='justify-content-between'>
                <Button variant="success" onClick={()=>{handleEditReqItemLinks(curentRequestLinks.item_id)}}>ذخیره</Button>
                <Button variant="secondary" onClick={()=>{setCurentRequestLinksModal(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CurentRequestLinksModal;