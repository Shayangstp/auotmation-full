import React, { useContext } from "react";
import { Col, Button, Form } from "react-bootstrap";
import { reqContext } from '../context/jobReqsContext/reqContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const JobReqItemFile = () => {
    const requestContext = useContext(reqContext);
    const {
        handleUploadReqItemFile,
        handleAddReqItemFile,
        reqItemFileRef,
        reqItemFiles
    } = requestContext;

    return (
        <Form.Group as={Col} md='4' lg='4' xxl='4' className='mb-4 mb-md-0'>
            <div className="d-flex align-items-center justify-content-between">
                <Form.Label className='mb-1'> افزودن فایل پروژه :</Form.Label>
                {reqItemFiles.length !== 0 ?
                    <div>({reqItemFiles.length})</div>
                    : null}
            </div>
            <div className="d-flex">
                <Form.Control type="file" name='reqItemFile' onChange={(e) => { handleUploadReqItemFile(e) }} placeholder='افزودن فایل' id='reqItemFile'
                 ref={reqItemFileRef}></Form.Control>
                <div className="">
                    <Button variant="primary" onClick={() => {
                        handleAddReqItemFile();
                    }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </div>
        </Form.Group>
    )
}

export default JobReqItemFile;