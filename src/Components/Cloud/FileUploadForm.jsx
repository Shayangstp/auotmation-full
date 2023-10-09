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
  handleUploadSubmit,
} from "../Slices/filesCloudSlice";
import {
  RsetFormErrors,
  selectFormErrors,
  selectLoading,
} from "../Slices/mainSlices";
import { handleAccessLevelOption } from "../Slices/filesCloudSlice";
import FileUploader from "./FileUploader";
import { submitCloud } from "../../Services/cloudFileService";
import { errorMessage, successMessage } from "../../utils/message";
import Loading from "../Common/Loading";

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
  const loading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(handleSoftwareNameOption());
    dispatch(handleAccessLevelOption());
  }, []);

  const uploadSoftwareNameIsValid = uploadSoftwareName !== "";
  // const uploadFile = uploadFile !== "";
  const uploadAccessLevelIsValid = uploadAccessLevel !== "";
  const uploadVersionIsValid = uploadVersion !== "";
  const uploadFileIsValid = uploadFile.length !== 0;

  const FormIsValid =
    uploadSoftwareNameIsValid &&
    uploadAccessLevelIsValid &&
    uploadVersionIsValid;

  const validation = () => {
    var errors = {};
    if (!uploadSoftwareNameIsValid) {
      errors.uploadSoftwareName = "انتخاب  نرم افزار اجباری است!";
    }
    if (!uploadAccessLevelIsValid) {
      errors.uploadAccessLevel = "انتخاب  سطح دسترسی اجباری است!";
    }
    return errors;
  };

  const handleFileUpload = async () => {
    if (FormIsValid) {
      if (uploadFile.length !== 0) {
        dispatch(handleUploadSubmit());
      } else {
        errorMessage("فایل برای آپلود انتخاب نشده است!");
      }
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
    <Container fluid className="mt-5 position-relative">
      {loading ? <Loading /> : null}
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
                <FileUploader />
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
