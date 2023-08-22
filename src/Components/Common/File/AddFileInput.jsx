import React, { useContext } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { addFileCntxt } from './../../context/AddFileContext/addFileCntxt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddFileInput = () => {

    const addFileContext = useContext(addFileCntxt);
    const {
        handleUploadReqFiles,
        reqFileRef,
        reqFiles,
        handleAddFile
    } = addFileContext;

    return (
        <Form.Group as={Col} md='6' lg='6' xxl='3' className='mb-4'>
            <div className=" d-flex justify-content-between align-items-center">
                <Form.Label className='mb-1' placeholder="انتخاب">فایل: </Form.Label>
                {reqFiles.length !== 0 ? <span className="font12">({reqFiles.length})</span> : null}
            </div>
            <div className="input-group">
                <Form.Control type="file" multiple name="reqFiles" id='reqFile' onChange={e =>{handleUploadReqFiles(e)}}
                    ref={reqFileRef} />
                <div className="input-group-prepend">
                    <Button className="zIndex-0" variant="primary" onClick={handleAddFile}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </div>
        </Form.Group>
    )
}
export default AddFileInput;


