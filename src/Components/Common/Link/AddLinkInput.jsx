import React, { useContext } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ReqNewItemLinksM from "../../Modals/WarehouseReqsModals/ReqNewItemLinksModal";
import { addLinkCntxt } from "../../context/AddLinkContext/addLinkCntxt";

const AddLinkInput = () => {

    const addLinkContext = useContext(addLinkCntxt);
    const {
        reqItemLink,
        setReqItemLink,
        reqItemLinks,
        reqItemLinkRef,
        handleAddItemLink,
        reqNewItemLinksModal,
        setReqNewItemLinksModal
    } = addLinkContext;

    return (
        <Form.Group as={Col} md='6' lg='6' xxl='3' className='mb-4'>
            <Form.Label className='mb-1'> آدرس اینترنتی پیشنهادی: </Form.Label>
            <div className="input-group">
                <Form.Control type="text" value={reqItemLink} name="reqItemLink" id='reqItemLink' onChange={(e) => { setReqItemLink(e.target.value) }} 
                // onKeyUp={handleEnter} 
                ref={reqItemLinkRef} dir='ltr' />
                <div className="input-group-prepend">
                    <Button variant="primary" onClick={handleAddItemLink}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </div>
            {reqItemLinks.length !== 0 ? <span className='font12 cursorPointer' onClick={() => setReqNewItemLinksModal(true)}>نمایش لینک ها<span>({reqItemLinks.length})</span></span> : null}
            {reqNewItemLinksModal ? <ReqNewItemLinksM reqItemLinks={reqItemLinks} /> : null}
        </Form.Group>
    )
}
export default AddLinkInput;


