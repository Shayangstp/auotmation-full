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
} from "../Slices/filesCloudSlice";
import { RsetFormErrors, selectFormErrors } from "../Slices/mainSlices";

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

  useEffect(() => {
    dispatch(handleSoftwareNameOption());
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

  const handleFileUpload = () => {
    if (FormIsValid) {
      console.log({
        softwareName: uploadSoftwareName.value,
        file: "hi",
        accessLevel: uploadAccessLevel.value,
        version: uploadVersion,
      });
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
          <Row className="justify-content-center">
            <Col xl="3" className="mt-4">
              <label className="form-label">نام نرم افزار:</label>
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
            <Col xl="3" className="mt-4">
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
            </Col>
            <Col xl="3" className="mt-4">
              <label className="required-field form-label">سطح دسترسی: </label>
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
            <Col xl="2" className="mt-4">
              <label className="form-label">ورژن:</label>
              <Form.Control
                value={uploadVersion}
                onChange={(e) => {
                  dispatch(RsetUploadVersion(e.target.value));
                }}
              />
            </Col>
            <Col className="mt-4 mb-3" xl="11">
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
          <div className="mt-4 justify-content-center text-center ">
            <Button
              variant="success"
              onClick={(e) => {
                e.preventDefault();
                handleFileUpload(e);
              }}
              className="py-2 px-5"
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
