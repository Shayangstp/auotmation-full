import React, { useContext } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import ReqLinksModal from "../Modals/OfficeReqsModals/ReqLinksModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const OfficeAddLink = () => {
    const officeContext = useContext(officeReqContext);
    const {
        reqLink,
        setReqLink,
        handleAddLink,
        reqLinks,
        reqLinksModalShow,
        setReqLinksModalShow
    } = officeContext;
    return (
        <Form.Group as={Col} md='6' lg='6' xxl='3' className='mb-4'>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <Form.Label className='mb-1'> آدرس اینترنتی: </Form.Label>
                {reqLinks.length !== 0 ? <span className='font12 cursorPointer' onClick={() => setReqLinksModalShow(true)}>نمایش لینک ها<span>({reqLinks.length})</span></span> : null}
            </div>
            <div className="input-group">
                <Form.Control type="text" value={reqLink} name="reqLink" id='reqLink' onChange={(e) => { setReqLink(e.target.value) }} dir='ltr' />
                <div className="input-group-prepend">
                    <Button variant="primary" onClick={handleAddLink}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </div>
            {reqLinksModalShow ? <ReqLinksModal /> : null}
        </Form.Group>
    )
}

export default OfficeAddLink;