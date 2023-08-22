import React, {useContext} from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import WarehouseAddNewLink from "../../WarehouseReq/WarehouseAddNewLink";

import {reqContext} from "../../context/warehouseReqsContext/reqContext";

const CurentRequestLinksEditModal = ({edit}) => {
    
    const requestContext = useContext(reqContext);
    const {
        curentRequestLinksEditModal,
        setCurentRequestLinksEditModal,
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
            show={curentRequestLinksEditModal}
            onHide={() => {
                setCurentRequestLinksEditModal(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>لینک های پیشنهادی شما</h3>
            </Modal.Header>
            <Modal.Body>
                {edit === true ? <WarehouseAddNewLink editReqItemLink={editReqItemLink} setEditReqItemLink={setEditReqItemLink} handleAddEditItemLink={handleAddEditItemLink}/> : null}
                <ul dir="ltr" className="mt-4">
                    {curentRequestLinks.list !== [] ? curentRequestLinks.list.map((url, i)=>(
                        <li key={url.id} className="mx-2 mb-3">
                            <div className="d-flex align-items-center">
                                {edit === true ? <input type='text' defaultValue={xssFilters.inHTMLData(url.url)} className='form-control' onChange={e=>{handleEditReqItemLink(e.target.value,url)}}/> : <a href={url.url}>{url.url}</a>}
                                {edit === true ? <i className="fa fa-trash text-danger cursorPointer me-2" onClick={()=>{handleReqItemLinkDelete(url)}}></i> : null}
                            </div>
                        </li>
                    )) : null}
                </ul>
            </Modal.Body>
            <Modal.Footer className={edit===true? 'justify-content-between' : 'justify-content-end'}>
                {edit === true ? <Button variant="success" onClick={()=>handleEditReqItemLinks(curentRequestLinks.item_id)}>ذخیره</Button> : null}
                <Button variant="secondary" onClick={()=>{setCurentRequestLinksEditModal(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CurentRequestLinksEditModal;