import React, { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AddFileInput from "../Common/File/AddFileInput";
import { handleSoftwareNameOption } from "../Slices/filesCloudSlice";
import {
  RsetUploadSoftwareName,
  selectUploadSoftwareName,
  RsetUploadSoftwareNameOption,
  selectUploadSoftwareNameOption,
  RsetUploadAccessLevel,
  selectUploadAccessLevel,
  RsetUploadAccessLevelOption,
  selectUploadAccessLevelOption,
  RsetUploadVersion,
  selectUploadVersion,
  RsetUploadDescription,
  selectUploadDescription,
  handleResetUpload,
  selectUploadFile,
  RsetUploadFile,
} from "../Slices/filesCloudSlice";
import { RsetFormErrors, selectFormErrors } from "../Slices/mainSlices";
import { handleAccessLevelOption } from "../Slices/filesCloudSlice";
import NewFile from "./NewFile";
import { submitCloud } from "../../Services/cloudFileService";

const FileUploadForm = ({ setPageTitle }) => {
  useEffect(() => {
    setPageTitle("آپلود فایل");
  }, []);

  const dispatch = useDispatch();
  const uploadSoftwareName = useSelector(selectUploadSoftwareName);
  const uploadSoftwareNameOption = useSelector(selectUploadSoftwareNameOption);
  const uploadAccessLevel = useSelector(selectUploadAccessLevel);
  const uploadAccessLevelOption = useSelector(selectUploadAccessLevelOption);
  const uploadVersion = useSelector(selectUploadVersion);
  const uploadDescription = useSelector(selectUploadDescription);
  const formErrors = useSelector(selectFormErrors);
  const uploadFile = useSelector(selectUploadFile);

  useEffect(() => {
    dispatch(handleSoftwareNameOption());
    dispatch(handleAccessLevelOption());
  }, []);

  const uploadSoftwareNameIsValid = uploadSoftwareName !== "";
  // const uploadFile = uploadFile !== "";
  const uploadAccessLevelIsValid = uploadAccessLevel !== "";
  const uploadVersionIsValid = uploadVersion !== "";

  const FormIsValid =
    uploadSoftwareNameIsValid &&
    uploadAccessLevelIsValid &&
    uploadVersionIsValid;

  const validation = () => {
    var errors = {};
    if (!uploadSoftwareNameIsValid) {
      errors.uploadSoftwareName = "انتخاب  نرم افزار اجباری است!";
    }
    // if (!companyNamesIsValid) {
    //   errors.companyNames = "وارد کردن شرکت عامل اجباری است!";
    // }
    if (!uploadAccessLevelIsValid) {
      errors.uploadAccessLevel = "انتخاب  سطح دسترسی اجباری است!";
    }
    // if (!uploadVersionIsValid) {
    //   errors.uploadVersion = "واردکردن نام نرم افزار اجباری است!";
    // }
    return errors;
  };

  console.log(uploadFile);

  const handleFileUpload = async () => {
    if (FormIsValid) {
      let files = [];
      const data = new FormData();
      for (var x = 0; x < uploadFile.length; x++) {
        data.append("reqFiles", uploadFile[x]);
      }
      files = data;

      console.log(files);

      const values = {
        softwareName: uploadSoftwareName.value,
        softwareAccessId: uploadAccessLevel.value,
        softwareVersion: uploadVersion,
        description: uploadDescription,
      };
      console.log(values);

      const submitCloudRes = await submitCloud(files, values);
      console.log(submitCloudRes);
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            uploadSoftwareName,
            // uploadFile ,
            uploadAccessLevel,
          })
        )
      );
    }
  };

  return (
    <Container fluid className="mt-5">
      <section className="lightGray2-bg p-3 shadow borderRadius border border-white border-2">
        <div className="shadow p-4 mb-5 borderRadius lightGray-bg  border border-white font16">
          فرم آپلود فایل
        </div>
        <div className="d-flex justify-content-end">
          <Link to="/UploadedFilesList">
            <Button
              size="sm"
              className="font12 black-gradient border border-2 border-black px-3 py-2 borderRadius"
            >
              لیست فایل ها
            </Button>
          </Link>
        </div>
        <Form>
          <div className="d-flex flex-column flex-md-row justify-content-center">
            <div className="d-flex flex-col">
              <Row className="justify-content-center">
                <Col xl="4" className="mt-4">
                  <label className="form-label required-field">
                    نام نرم افزار:{" "}
                  </label>
                  <Select
                    placeholder="انتخاب..."
                    options={uploadSoftwareNameOption}
                    value={uploadSoftwareName}
                    onChange={(e) => {
                      dispatch(RsetUploadSoftwareName(e));
                    }}
                  />
                  {!uploadSoftwareNameIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.uploadSoftwareName}
                    </p>
                  )}
                </Col>
                {/* <Col xl="3" className="mt-4">
              <div className="d-flex flex-column">
                <label className="required-field form-label">فایل: </label>
                <div className="file-input position-relative">
                  <label
                    htmlFor="uploadedFile"
                    className="custom-button position-absolute top-0"
                  >
                    انتخاب فایل
                  </label>
                  <Form.Control
                    type="file"
                    multiple
                    name="reqFiles"
                    id="uploadedFile"
                    // onChange={e =>{ handleUploadReqFiles(e) }} 
                    onChange={(e) => {
                      console.log(e.target.files);
                    }}
                  />
                </div>
              </div>
            </Col> */}
                <Col xl="4" className="mt-4">
                  <label className="required-field form-label">
                    سطح دسترسی:{" "}
                  </label>
                  <Select
                    placeholder="انتخاب..."
                    options={uploadAccessLevelOption}
                    value={uploadAccessLevel}
                    onChange={(e) => {
                      dispatch(RsetUploadAccessLevel(e));
                    }}
                  />
                  {!uploadAccessLevelIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.uploadAccessLevel}
                    </p>
                  )}
                </Col>
                <Col xl="4" className="mt-4">
                  <label className="form-label">ورژن:</label>
                  <Form.Control
                    value={uploadVersion}
                    onChange={(e) => {
                      dispatch(RsetUploadVersion(e.target.value));
                    }}
                  />
                </Col>
                <Col className="mt-4 mb-3" xl="12">
                  <label className="form-label">توضیحات:</label>
                  <Form.Control
                    value={uploadDescription}
                    onChange={(e) =>
                      dispatch(RsetUploadDescription(e.target.value))
                    }
                    as="textarea"
                    rows={6}
                  />
                </Col>
              </Row>
            </div>
            <Col className="mb-3" xl="6">
              <div className="">
                <NewFile />
              </div>
            </Col>
          </div>

          <div className="mt-5 justify-content-center text-center mb-3">
            <Button
              variant="dark"
              onClick={(e) => {
                e.preventDefault();
                handleFileUpload(e);
              }}
              className="py-2 px-5 uploadBtn"
            >
              آپلود فایل
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                dispatch(handleResetUpload());
              }}
              variant="secondary"
              className="py-2 px-4 ms-4"
            >
              انصراف
            </Button>
          </div>
        </Form>
      </section>
    </Container>
  );
};

export default FileUploadForm;
