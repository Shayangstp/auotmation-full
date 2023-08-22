import React, { useState, useRef } from "react";
import { addFileCntxt } from "./addFileCntxt";
import { warningMessage } from "../../../utils/message";
const AddFileContext = ({ children }) => {
    const [reqFile, setReqFile] = useState('');
    const [reqFiles, setReqFiles] = useState([]);
    const reqFileRef = useRef();
    const handleUploadReqFiles = e => {
        e.persist();
        setReqFile(e.target.files)
    }
    const handleAddFile = () => {
        if (reqFile !== '') {
            reqFiles.push.apply(reqFiles, reqFile);
            setReqFile('');
            document.getElementById('reqFile').value = '';
        } else {
            warningMessage('هیچ فایلی انتخاب نشده است.');
        }
    }
    return (
        <addFileCntxt.Provider
            value={{
                reqFileRef,
                reqFile,
                setReqFile,
                reqFiles,
                setReqFiles,
                handleUploadReqFiles,
                handleAddFile
            }}
        >
            {children}
        </addFileCntxt.Provider>
    )
}

export default AddFileContext;