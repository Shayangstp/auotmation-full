import React, { useContext } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { addFileCntxt } from './../../context/AddFileContext/addFileCntxt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddFileInput = () => {

    const addFileContext = useContext(addFileCntxt);
    const { handleUploadReqFiles, reqFileRef, reqFiles, handleAddFile } = addFileContext;

    return (
        <Form.Group as={Col} md='6' lg='6' xxl='3' className='mb-4'>
            <div className="d-flex justify-content-between align-items-center">
                <Form.Label className='mb-1' placeholder="انتخاب">فایل: </Form.Label>
                {reqFiles && reqFiles.length !== 0 ? <span className="font12">({reqFiles.length})</span> : null}
            </div>
            <div className="d-flex flex-row">
                <div className="file-input position-relative">
                    <label for="reqFile" className="file-button position-absolute top-0">انتخاب فایل</label>
                    <Form.Control type="file" multiple name="reqFiles" id='reqFile' onChange={e => { handleUploadReqFiles(e) }} ref={reqFileRef} />
                </div>
                <Button className="zIndex-0 ms-1" variant="primary" onClick={handleAddFile}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
            </div>
        </Form.Group>
    );
};
export default AddFileInput;
