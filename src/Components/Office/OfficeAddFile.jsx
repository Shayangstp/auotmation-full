import React, { useContext } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import ReqFilesModal from "../Modals/OfficeReqsModals/ReqFilesModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const OfficeAddFile = () => {
    const officeContext = useContext(officeReqContext);
    const {
        handleUploadReqFile,
        handleAddReqFile,
        reqFiles,
        reqFilesModalShow,
        setReqFilesModalShow
    } = officeContext;
    return (
        <Form.Group as={Col} md='6' lg='6' xxl='3' className='mb-4'>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <Form.Label className='mb-1'> فایل: </Form.Label>
                {reqFiles.length !== 0 ? <span className='font12 cursorPointer' onClick={() => setReqFilesModalShow(true)}>نمایش فایل ها<span>({reqFiles.length})</span></span> : null}
            </div>
            <div className="input-group">
                <Form.Control type="file" name="reqFile" id='reqFile' onChange={(e) => { handleUploadReqFile(e) }} />
                <div className="input-group-prepend">
                    <Button variant="primary" onClick={handleAddReqFile}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>
            </div>
            {reqFilesModalShow ? <ReqFilesModal /> : null}
        </Form.Group>
    )
}

export default OfficeAddFile;