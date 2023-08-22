import React, { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import {
  handleUploder, RsetAppName, selectFileData
  , RsetFileData, handleAccMode, handleAppName, RsetDescriptionCloudFile,
  selectDescriptionCloudFile, selectAccessMode, selectAllAppName,
  selectAppName, selectAllAccessMode, RsetAccessMode, selectVersion, RsetVersion, selectFormErrorsFileCloud, RsetErrorFormsFilesCloud, handleResetFileCloud
} from "../Slices/filesCloudSlice";
import { Link } from "react-router-dom";

const FileUploadForm = ({setPageTitle}) => {

  useEffect(()=>{
    setPageTitle('آپلود فایل');
  },[])

  const dispatch = useDispatch()
  const allAppName = useSelector(selectAllAppName)
  const allAccessMode = useSelector(selectAllAccessMode)
  const fileData = useSelector(selectFileData)
  const description = useSelector(selectDescriptionCloudFile)
  const accessMode = useSelector(selectAccessMode)
  const appName = useSelector(selectAppName)
  const version = useSelector(selectVersion)
  const formErrors = useSelector(selectFormErrorsFileCloud)

  const exeCondition = () => {
    if (fileData.length !== 0) {
      const exeCond = fileData[0].name
      return exeCond.includes('.exe')
    }
  }


  useEffect(() => {
    dispatch(handleAccMode())
    dispatch(handleAppName())
  }, [])

  const handlePostCloudFile = (e) => {
    e.preventDefault()

    if (fileData && accessMode && (exeCondition() === false || (appName && version))) {
      dispatch(handleUploder())
    } else {
      dispatch(RsetErrorFormsFilesCloud(validation({ fileData: fileData, accessMode: accessMode })))
    }
  }

  const validation = ({ fileData, accessMode, version, appName }) => {
    const errors = {}
    if (!fileData) {
      errors.fileData = "لطفا فایل را انتخاب نمایید!"
    }
    if (!accessMode) {
      errors.accessMode = "لطفا سطح دسترسی را انتخاب نمایید!"
    }
    if (exeCondition()) {
      errors.appName = "لطفا نام نرم افزار را انتخاب نمایید!"
      errors.version = "لطفا ورژن را انتخاب نمایید!"
    }
    return errors;
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-end">
        <Link to='/UploadedFilesList'>
          <Button size="sm" className="font12" variant="link">لیست فایل ها</Button>
        </Link>
      </div>
      <Form>
        <Row className="">
          <Col xl="3" className="mt-4">
            <label className="form-label" >
              نام نرم افزار:
            </label>
            <Select
              className={`${!appName && exeCondition()
                ? "rounded col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                : "rounded mb-4 col-12 col-sm-12 col-md-12 col-md-4"
                }`}
              options={allAppName} value={appName} onChange={(e) => dispatch(RsetAppName(e))} placeholder="انتخاب" />
            {(exeCondition() && !appName) && (
              <p className="font12 text-danger mb-4 mt-1">
                {formErrors.appName}
              </p>
            )}
          </Col>
          <Col xl="3" className="mt-4">
            <label className="required-field form-label">
              فایل:{" "}
            </label>
            <Form.Control
              id="cloudFile"
              type="file"
              className={`${formErrors.fileData && !fileData
                ? "form-control col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                : "form-control mb-4 col-12 col-sm-12 col-md-12 col-md-4"
                }`}
              onChange={(e) => {
                dispatch(RsetFileData(e.target.files))
              }} />
            {!fileData && (
              <p className="font12 text-danger mb-4 mt-1">
                {formErrors.fileData}
              </p>
            )}
          </Col>
          <Col xl="3" className="mt-4">
            <label className="required-field form-label">
              سطح دسترسی:{" "}
            </label>
            <Select options={allAccessMode}
              className={`${formErrors.accessMode && !accessMode
                ? "rounded col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                : " mb-4 col-12 col-sm-12 col-md-12 col-md-4"
                }`}
              value={accessMode} onChange={(e) => dispatch(RsetAccessMode(e))} placeholder="انتخاب" />
            {!accessMode && (
              <p className="font12 text-danger mb-4 mt-1">
                {formErrors.accessMode}
              </p>
            )}
          </Col>
          <Col xl="2" className="mt-4" >
            <label className="form-label" >
              ورژن:
            </label>
            <Form.Control
              className={`${!version && exeCondition()
                ? "rounded col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                : "rounded mb-4 col-12 col-sm-12 col-md-12 col-md-4"
                }`}
              type="text"
              value={version}
              onChange={(e) => dispatch(RsetVersion(e.target.value))}
            />
            {(exeCondition() && !version) && (
              <p className="font12 text-danger mb-4 mt-1">
                {formErrors.version}
              </p>
            )}
          </Col>
          <Col className="mt-4" xl="12">
            <label className="form-label" >
              توضیحات:
            </label>
            <Form.Control
              value={description}
              onChange={(e) => dispatch(RsetDescriptionCloudFile(e.target.value))}
              as="textarea"
              rows={6}
            />
          </Col>
        </Row>
        <div className="mt-4 justify-content-center text-center ">
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(handleResetFileCloud())
            }}
            className="col-sm-12 col-md-3 col-xl-2 me-4 my-1"
          >
            ایجاد مورد جدید
          </Button>
          <Button
            onClick={handlePostCloudFile}
            variant="success"
            className="col-sm-12 col-md-3 col-xl-1 text-center me-1 ms-xl-4 justify-content-center my-1"
          >
            آپلود
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FileUploadForm;
