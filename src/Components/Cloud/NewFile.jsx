import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { selectUploadFile, RsetUploadFile } from "../Slices/filesCloudSlice";
import { useSelector, useDispatch } from "react-redux";

const NewFile = () => {
  const dispatch = useDispatch();
  const uploadFile = useSelector(selectUploadFile);

  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    // const updatedFiles = [...selectedFiles, ...files];
    dispatch(RsetUploadFile(files));
  };
  const handleDeleteFile = (index) => {
    const updatedFiles = [...uploadFile];
    updatedFiles.splice(index, 1);
    dispatch(RsetUploadFile(updatedFiles));
  };

  return (
    <div
      className="text-center d-flex flex-column lightGray-bg shadow mt-5 border border-white borderRadius p-3 w-75 mh-100 mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="mb-3 mt-2 text-right font-weight-bold">
        فایل مورد نظر خود را اضافه کنید
      </p>
      <div
        onClick={handleFileClick}
        className="file-border-container shadow p-3"
      >
        <FontAwesomeIcon icon={faUpload} className="font24 me-1 mt-2 mb-2" />
      </div>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          id="file-upload"
          className="opacity-0"
          onChange={handleFileChange}
          multiple
        />
        {uploadFile.length > 0 && (
          <ul className="list-unstyled">
            {uploadFile.map((file, index) => (
              <div key={index} className="m-auto p-2">
                <li className="m-auto shadow p-2 borderRadius lightGray2-bg d-flex align-items-center justify-content-center">
                  <span>{file.name}</span>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="ms-3 text-danger cursorPointer"
                    onClick={() => handleDeleteFile(index)}
                  />
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewFile;
