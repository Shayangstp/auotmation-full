import React, { Fragment, useContext, useEffect, useCallback } from "react";
import xssFilters from "xss-filters";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  Modal,
  Button,
  Table,
} from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFileWord,
  faFilePdf,
  faFileImage,
  faFileExcel,
  faFilePowerpoint,
  faFileZipper,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { iranTolJobCntxt } from "../context/iranTolJobContext/IranTolJobCntxt";
import Loading from "../Common/Loading";
import { useParams } from "react-router-dom";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { rootContext } from "../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import {
  handleReqsList,
  handleCurrentReqInfo,
  selectReqsList,
} from "../Slices/mainSlices";
import { selectCurrentReqInfo } from "../Slices/currentReqSlice";
import {
  RsetIrantoolMaterialCode,
  selectIrantoolMaterialCode,
  RsetIrantoolMaterialName,
  selectIrantoolMaterialName,
  RsetIrantoolMaterialCount,
  selectIrantoolMaterialCount,
  RsetIrantoolMaterialUnit,
  selectIrantoolMaterialUnit,
  RsetIrantoolMaterialUnitOptions,
  selectIrantoolMaterialUnitOptions,
  RsetIrantoolMaterialModalSearch,
  handleIrantoolMaterialUnitOptions,
  handleGetProWithCode,
  selectIrantoolMaterialModalSearch,
  RsetIrantoolMaterialList,
  selectIrantoolMaterialItem,
  RsetIrantoolMaterialItem,
  handleDeleteMaterialItem,
  selectIrantoolMaterialDescription,
  RsetIrantoolMaterialDescription,
  //action
  selectIrantoolActionDept,
  RsetIrantoolActionDept,
  selectIrantoolActionOprator,
  RsetIrantoolActionOprator,
  selectIrantoolActionDevice,
  RsetIrantoolActionDevice,
  selectIrantoolActionCount,
  RsetIrantoolActionCount,
  RsetIrantoolActionDescription,
  selectIrantoolActionDescription,
  selectIrantoolActionDeptOptions,
  selectIrantoolActionOpratorOptions,
  selectIrantoolActionDeviceOptions,
  handleIrantoolActionDeptOptions,
  handleIrantoolActionOpratorOptions,
  handleIrantoolActionDeviceOptions,
  selectIrantoolActionItem,
  RsetIrantoolActionItem,
  handleDeleteActionItem,
  //test
} from "../Slices/irantoolSlices";

import IrantoolMaterialModalSearch from "../Modals/ITJReqModals/IrantoolDevicesModals/IrantoolMaterialModalSearch";
import {
  RsetFormErrors,
  selectFormErrors,
  selectUser,
} from "../Slices/mainSlices";
import { errorMessage } from "../../utils/message";

const IranTolJobMaterialWorkflow = () => {
  const mainContext = useContext(rootContext);
  const {
    // currentReqInfo
    currentReqCo,
    currentReqComments,
  } = mainContext;

  const jobContext = useContext(iranTolJobCntxt);
  const { handleDownloadReqPlans, handleReqFiles, currentReqFiles } =
    jobContext;

  const dispatch = useDispatch();
  const { id } = useParams();

  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const irantoolMaterialCode = useSelector(selectIrantoolMaterialCode);
  const irantoolMaterialName = useSelector(selectIrantoolMaterialName);
  const irantoolMaterialCount = useSelector(selectIrantoolMaterialCount);
  const irantoolMaterialUnit = useSelector(selectIrantoolMaterialUnit);
  const irantoolMaterialUnitOptions = useSelector(
    selectIrantoolMaterialUnitOptions
  );
  const irantoolMaterialModalSearch = useSelector(
    selectIrantoolMaterialModalSearch
  );
  const irantoolMaterialItem = useSelector(selectIrantoolMaterialItem);
  const irantoolMaterialDescription = useSelector(
    selectIrantoolMaterialDescription
  );
  const formErrors = useSelector(selectFormErrors);

  const irantoolActionDept = useSelector(selectIrantoolActionDept);
  const irantoolActionOprator = useSelector(selectIrantoolActionOprator);
  const irantoolActionDevice = useSelector(selectIrantoolActionDevice);
  const irantoolActionCount = useSelector(selectIrantoolActionCount);
  const irantoolActionDescription = useSelector(
    selectIrantoolActionDescription
  );
  const irantoolActionDeptOptions = useSelector(
    selectIrantoolActionDeptOptions
  );
  const irantoolActionOpratorOptions = useSelector(
    selectIrantoolActionOpratorOptions
  );
  const irantoolActionDeviceOptions = useSelector(
    selectIrantoolActionDeviceOptions
  );
  const irantoolActionItem = useSelector(selectIrantoolActionItem);
  const user = useSelector(selectUser);

  useEffect(() => {
    handleReqFiles(currentReqInfo.requestId, 0, 0, 1, "");
  }, []);

  useEffect(() => {
    dispatch(handleIrantoolMaterialUnitOptions());
    dispatch(handleIrantoolActionDeptOptions());
    dispatch(handleIrantoolActionDeviceOptions());
  }, []);

  useEffect(() => {
    if (user._id === undefined) {
      dispatch(handleIrantoolActionOpratorOptions());
    }
  }, [user]);

  useEffect(() => {
    dispatch(
      handleCurrentReqInfo({
        reqId: id,
        reqType: 1,
      })
    );
  }, []);

  const irantoolMaterialCodeIsValid = irantoolMaterialCode !== "";
  const irantoolMaterialNameIsValid = irantoolMaterialName !== "";
  const irantoolMaterialCountIsValid = irantoolMaterialCount !== "";
  const irantoolMaterialUnitIsValid = irantoolMaterialUnit.length !== 0;

  const materialAddTableIsValid =
    irantoolMaterialCodeIsValid &&
    irantoolMaterialNameIsValid &&
    irantoolMaterialCountIsValid &&
    irantoolMaterialUnitIsValid;

  const validationMaterial = () => {
    var errors = {};
    if (!irantoolMaterialCodeIsValid) {
      errors.irantoolMaterialCode = "واردکردن کد کالا اجباری است!";
    }
    if (!irantoolMaterialNameIsValid) {
      errors.irantoolMaterialName = "واردکردن نام کالا اجباری است!";
    }
    if (!irantoolMaterialCountIsValid) {
      errors.irantoolMaterialCount = "واردکردن تعداد کالا اجباری است!";
    }
    if (!irantoolMaterialUnitIsValid) {
      errors.irantoolMaterialUnit = "واردکردن واحد شمارش اجباری است!";
    }
    return errors;
  };

  const irantoolActionDeptIsValid = irantoolActionDept.length !== 0;
  const irantoolActionOpratorIsValid = irantoolActionOprator.length !== 0;
  const irantoolActionDeviceIsValid = irantoolActionDevice.length !== 0;
  const irantoolActionCountIsValid = irantoolActionCount !== "";

  const ActionAddTableIsValid =
    irantoolActionDeptIsValid &&
    irantoolActionOpratorIsValid &&
    irantoolActionDeviceIsValid &&
    irantoolActionCountIsValid;

  const validationWork = () => {
    var errors = {};
    if (!irantoolActionDeptIsValid) {
      errors.irantoolActionDept = "واردکردن واحد ساخت اجباری است!";
    }
    if (!irantoolActionOpratorIsValid) {
      errors.irantoolActionOprator = "واردکردن اپراتور اجباری است!";
    }
    if (!irantoolActionDeviceIsValid) {
      errors.irantoolActionDevice = "واردکردن دستگاه اجباری است!";
    }
    if (!irantoolActionCountIsValid) {
      errors.irantoolActionCount = "واردکردن تعداد اجباری است!";
    }
    return errors;
  };

  //validation of whole Page
  const materialTableIsValid = irantoolMaterialItem.length !== 0;
  const ActionTableIsValid = irantoolActionItem.length !== 0;

  const mtrWrkflwIsValid = materialTableIsValid && ActionTableIsValid;

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleIrantoolMaterial = () => {
    if (materialAddTableIsValid) {
      let reqItems = [...irantoolMaterialItem];

      let reqItem = {
        id: generateRandomNumber(1000, 9999),
        materialCode: irantoolMaterialCode,
        materialName: irantoolMaterialName,
        materialCount: irantoolMaterialCount,
        materialUnit: irantoolMaterialUnit.label,
      };

      reqItems.push(reqItem);
      dispatch(RsetIrantoolMaterialItem(reqItems));
      dispatch(RsetIrantoolMaterialCode(""));
      dispatch(RsetIrantoolMaterialName(""));
      dispatch(RsetIrantoolMaterialCount(""));
      dispatch(RsetIrantoolMaterialUnit(""));
      dispatch(RsetFormErrors(""));
    } else {
      dispatch(
        RsetFormErrors(
          validationMaterial({
            irantoolMaterialCode,
            irantoolMaterialName,
            irantoolMaterialCount,
            irantoolMaterialUnit,
          })
        )
      );
    }
  };

  //handle the deviceOptions
  let deviceValue = 1;
  const deviceOptions = irantoolActionDeviceOptions.map((item) => ({
    label: item.categoryName,
    value: deviceValue++,
  }));

  //action

  const handleIrantoolActionItem = () => {
    if (ActionAddTableIsValid) {
      let reqItems = [...irantoolActionItem];

      let reqItem = {
        id: generateRandomNumber(1000, 9999),
        actionDept: irantoolActionDept.label,
        actionOprator: irantoolActionOprator.label,
        actionDevice: irantoolActionDevice.label,
        actionCount: irantoolActionCount,
      };

      reqItems.push(reqItem);
      dispatch(RsetIrantoolActionItem(reqItems));
      dispatch(RsetIrantoolActionDept(""));
      dispatch(RsetIrantoolActionOprator(""));
      dispatch(RsetIrantoolActionDevice(""));
      dispatch(RsetIrantoolActionCount(""));
      dispatch(RsetFormErrors(""));
    } else {
      dispatch(
        RsetFormErrors(
          validationWork(
            irantoolActionDept,
            irantoolActionOprator,
            irantoolActionDevice,
            irantoolActionCount
          )
        )
      );
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (mtrWrkflwIsValid) {
      console.log({
        irantoolMaterialItem,
        irantoolMaterialDescription,
        irantoolActionItem,
        irantoolActionDescription,
      });
      dispatch(RsetIrantoolMaterialItem(""));
      dispatch(RsetIrantoolActionItem(""));
      dispatch(RsetIrantoolMaterialDescription(""));
      dispatch(RsetIrantoolActionDescription(""));
    } else {
      errorMessage("اضافه کردن جدول مواد اولیه و برنامه عملیاتی اجباری است!");
    }
  };

  return (
    <Container>
      {currentReqInfo.requestId !== undefined ? (
        <Fragment>
          <Row>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>نام و نام خانوادگی</th>
                  <th>شرکت</th>
                  <th>نام پروژه</th>
                  <th>نوع فرایند</th>
                  <th>نوع پروژه</th>
                  <th>تعداد</th>
                  <th>تاریخ مدنظر مشتری</th>
                  <th>توضیحات</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{xssFilters.inHTMLData(currentReqInfo.fullName)}</td>
                  <td>{xssFilters.inHTMLData(currentReqCo)}</td>
                  <td>{xssFilters.inHTMLData(currentReqInfo.projectName)}</td>
                  <td>
                    {xssFilters.inHTMLData(currentReqInfo.requestTypeName)}
                  </td>
                  <td>{xssFilters.inHTMLData(currentReqInfo.toolTypeName)}</td>
                  <td>{xssFilters.inHTMLData(currentReqInfo.amount)}</td>
                  <td>
                    {currentReqInfo.deadline !== null
                      ? momentJalaali
                          .utc(
                            xssFilters.inHTMLData(currentReqInfo.deadline),
                            "YYYY/MM/DD"
                          )
                          .locale("fa")
                          .format("jYYYY/jMM/jDD")
                      : ""}
                  </td>
                  <td>{xssFilters.inHTMLData(currentReqInfo.description)}</td>
                </tr>
              </tbody>
            </Table>
            {currentReqFiles.length !== 0 ? (
              <Fragment>
                <ul className="d-flex mt-5 list-unstyled">
                  {currentReqFiles.map((file, index) => {
                    switch (file.name.split(".").pop()) {
                      case "docx":
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFileWord}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                      case "xlsx":
                      case "xltx":
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFileExcel}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                      case "pptx":
                      case "ppt":
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFilePowerpoint}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                      case "pdf":
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFilePdf}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                      case "jpeg":
                      case "jpg":
                      case "png":
                      case "gif":
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFileImage}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                      case "zip":
                      case "rar":
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFileZipper}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                      default:
                        return (
                          <li
                            key={file.path}
                            className="mx-2"
                            onClick={() => {
                              handleReqFiles(
                                currentReqInfo.requestId,
                                file.row,
                                0,
                                0,
                                file.name
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFile}
                              className="font24 cursorPointer"
                            />
                          </li>
                        );
                    }
                  })}
                </ul>
                <div
                  className="my-4 cursorPointer"
                  onClick={() => {
                    handleReqFiles(
                      currentReqInfo.requestId,
                      0,
                      1,
                      0,
                      "allFiles"
                    );
                  }}
                >
                  <span>دانلود همه فایل های درخواست</span>
                </div>
              </Fragment>
            ) : (
              <p>فایلی آپلود نشده است!</p>
            )}
          </Row>
          <hr className="mt-5 mb-4" />
          <Row>
            <h3 className="fw-bold font16 mb-4">ثبت مواد اولیه</h3>
            <Form.Group as={Col} md="5" className="mb-4">
              <Form.Label className="mb-1 required-field">
                کد کالا :{" "}
              </Form.Label>
              {/* <div className="d-flex flex-row justify-content-center align-items-center"> */}
              <NumberFormat
                dir="ltr"
                id="materialCode"
                type="text"
                maxLength={10}
                className="form-control"
                value={irantoolMaterialCode}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    dispatch(handleGetProWithCode(e));
                    // handleNextInput(e);
                  }
                }}
                onChange={(e) => {
                  dispatch(RsetIrantoolMaterialCode(e.target.value));
                }}
                onBlur={(e) => {
                  dispatch(handleGetProWithCode(e));
                  // handleNextInput(e);
                  // dispatch(RsetCeramicMaterialModalSearch(true));
                }}
              />
              {/* validation */}
              {!irantoolMaterialCodeIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolMaterialCode}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="6" className="mt-4">
              <Button
                title="جست و جوی قطعه"
                className="ms-1 font12"
                onClick={() => {
                  dispatch(RsetIrantoolMaterialModalSearch(true));
                  dispatch(RsetIrantoolMaterialList([]));
                }}
              >
                جست و جو
              </Button>
            </Form.Group>
            {/* </div> */}
          </Row>
          <Row>
            <Form.Group as={Col} md="4" className="mb-3">
              <Form.Label className="mb-1 required-field">
                نام کالا :{" "}
              </Form.Label>
              <Form.Control
                readOnly
                value={irantoolMaterialName}
                onChange={(e) => {
                  dispatch(RsetIrantoolMaterialName(e.target.value));
                }}
                // onKeyDown={(e) => {
                //   if (e.keyCode === 13) {
                //     dispatch(RsetCeramicAddMaterialList([]));
                //     // dispatch(RsetCeramicMaterialModalSearch(true));
                //     dispatch(RsetCeramicMaterialCode(""));
                //   }
                // }}
              />
              {!irantoolMaterialNameIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolMaterialName}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3" className="mb-3">
              <Form.Label className="mb-1 required-field">تعداد: </Form.Label>
              <NumberFormat
                dir="ltr"
                id="materialCode"
                type="text"
                maxLength={10}
                // ref={materialCode}
                className="form-control"
                value={irantoolMaterialCount}
                // onKeyDown={(e) => {
                //   if (e.keyCode === 13) {
                //     dispatch(handleGetProWithCode(e));
                //     handleNextInput(e);
                //   }
                // }}
                onChange={(e) => {
                  dispatch(RsetIrantoolMaterialCount(e.target.value));
                }}
                // onBlur={(e) => {
                //   dispatch(handleGetProWithCode(e));
                //   handleNextInput(e);
                //   // dispatch(RsetCeramicMaterialModalSearch(true));
                // }}
              />
              {!irantoolMaterialCountIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolMaterialCount}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label className="mb-1 required-field">
                واحد شمارش:{" "}
              </Form.Label>
              <Select
                value={irantoolMaterialUnit}
                name="units"
                id="units"
                // ref={ceramicProjectMaterialUnitRef}
                onChange={(e) => {
                  dispatch(RsetIrantoolMaterialUnit(e));
                  // handleNextInput2();
                }}
                placeholder=" انتخاب..."
                options={irantoolMaterialUnitOptions}
                // isDisabled={ceramicMaterialCode !== "" ? false : true}
                isSearchable={true}
              />
              {!irantoolMaterialUnitIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolMaterialUnit}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="2">
              <Button
                className="mt-4 font12"
                onClick={handleIrantoolMaterial}
                // ref={addBtn}
                // onKeyDown={(e) => {
                //   handleNextInput(e);
                // }}
              >
                افزودن آیتم
              </Button>
            </Form.Group>
          </Row>
          <Row>
            {irantoolMaterialItem.length !== 0 && (
              <Table striped bordered hover responsive className="mt-5">
                <thead className="bg-secondary light-text">
                  <tr>
                    <th>ردیف</th>
                    <th>نام نرم افزار</th>
                    <th>شرکت عامل</th>
                    <th>موارد مورد نیاز</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {irantoolMaterialItem.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="font12">{idx + 1}</td>
                        <td className="font12">{item.materialCode}</td>
                        <td className="font12">{item.materialName}</td>
                        <td className="font12">{item.materialCount}</td>
                        <td className="font12">{item.materialUnit}</td>
                        <td className="font12 text-center">
                          <FontAwesomeIcon
                            onClick={() => {
                              dispatch(handleDeleteMaterialItem(item.id));
                            }}
                            className="text-danger cursorPointer"
                            icon={faTrashCan}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Row>
          <Row>
            <Form.Group as={Col} md="12" className="mt-5 mb-4">
              <Form.Label className="mb-1">توضیحات: </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={2000}
                name="softwareReqDescription"
                value={irantoolMaterialDescription}
                onChange={(e) => {
                  dispatch(RsetIrantoolMaterialDescription(e.target.value));
                }}
              />
            </Form.Group>
          </Row>

          <hr className="mt-4 mb-5" />
          <h3 className="fw-bold font16 mb-4">ثبت برنامه های عملیاتی</h3>
          <Row>
            <Form.Group as={Col} md="3">
              <Form.Label className="mb-1 required-field">واحد : </Form.Label>
              <Select
                value={irantoolActionDept}
                name="units"
                id="units"
                // ref={ceramicProjectMaterialUnitRef}
                onChange={(e) => {
                  dispatch(RsetIrantoolActionDept(e));
                  // handleNextInput2();
                }}
                placeholder=" انتخاب..."
                options={irantoolActionDeptOptions}
                // isDisabled={ceramicMaterialCode !== "" ? false : true}
                isSearchable={true}
              />
              {!irantoolActionDeptIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolActionDept}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label className="mb-1 required-field">اپراتور: </Form.Label>
              <Select
                value={irantoolActionOprator}
                name="units"
                id="units"
                // ref={ceramicProjectMaterialUnitRef}
                onChange={(e) => {
                  dispatch(RsetIrantoolActionOprator(e));
                  // handleNextInput2();
                }}
                placeholder=" انتخاب..."
                options={irantoolActionOpratorOptions}
                // isDisabled={ceramicMaterialCode !== "" ? false : true}
                isSearchable={true}
              />
              {!irantoolActionOpratorIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolActionOprator}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label className="mb-1 required-field">دستگاه: </Form.Label>
              <Select
                value={irantoolActionDevice}
                name="units"
                id="units"
                // ref={ceramicProjectMaterialUnitRef}
                onChange={(e) => {
                  dispatch(RsetIrantoolActionDevice(e));
                  // handleNextInput2();
                }}
                placeholder=" انتخاب..."
                options={deviceOptions}
                // isDisabled={ceramicMaterialCode !== "" ? false : true}
                isSearchable={true}
              />
              {!irantoolActionDeviceIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolActionDevice}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label className="mb-1 required-field">
                نوع عملیات:{" "}
              </Form.Label>
              <Select
                value={irantoolActionDevice}
                name="units"
                id="units"
                // ref={ceramicProjectMaterialUnitRef}
                onChange={(e) => {
                  dispatch(RsetIrantoolActionDevice(e));
                  // handleNextInput2();
                }}
                placeholder=" انتخاب..."
                options={deviceOptions}
                // isDisabled={ceramicMaterialCode !== "" ? false : true}
                isSearchable={true}
              />
              {!irantoolActionDeviceIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolActionDevice}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3" className="mt-3">
              <Form.Label className="mb-1 required-field">
                تاریخ اتمام :{" "}
              </Form.Label>
              {/* <DatePicker
                id="date"
                name="date"
                timePicker={false}
                // disabled={ceramicMaterialCode !== "" ? false : true}
                showTodayButton={false}
                isGregorian={false}
                // value={ceramicProjectMaterialDate}
                // ref={ceramicProjectMaterialDateRef}
                // onChange={(value) => {
                //   dispatch(RsetCeramicProjectMaterialDate(value));
                // }}
                className="form-control"
                // inputReadOnly
              /> */}
              {!irantoolActionDeviceIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolActionDevice}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3" className="mb-4 mt-3">
              <Form.Label className="mb-1 required-field">تعداد : </Form.Label>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <NumberFormat
                  dir="ltr"
                  id="materialCode"
                  type="text"
                  maxLength={10}
                  className="form-control"
                  value={irantoolActionCount}
                  // onKeyDown={(e) => {
                  //   if (e.keyCode === 13) {
                  //     dispatch(handleGetProWithCode(e));
                  //     // handleNextInput(e);
                  //   }
                  // }}
                  onChange={(e) => {
                    dispatch(RsetIrantoolActionCount(e.target.value));
                  }}
                  // onBlur={(e) => {
                  //   dispatch(handleGetProWithCode(e));
                  //   // handleNextInput(e);
                  //   // dispatch(RsetCeramicMaterialModalSearch(true));
                  // }}
                />

                <Button
                  title="افزودن آیتم"
                  className="ms-2 font12"
                  onClick={() => {
                    handleIrantoolActionItem();
                  }}
                >
                  +
                </Button>
              </div>
              {/* validation */}
              {!irantoolActionCountIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.irantoolActionCount}
                </p>
              )}
            </Form.Group>
          </Row>
          <Row>
            {irantoolActionItem.length !== 0 && (
              <Table striped bordered hover responsive className="mt-5">
                <thead className="bg-secondary light-text">
                  <tr>
                    <th>ردیف</th>
                    <th>واحد</th>
                    <th>اپراتور</th>
                    <th>دستگاه</th>
                    <th>تعداد</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {irantoolActionItem.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="font12">{idx + 1}</td>
                        <td className="font12">{item.actionDept}</td>
                        <td className="font12">{item.actionOprator}</td>
                        <td className="font12">{item.actionDevice}</td>
                        <td className="font12">{item.actionCount}</td>
                        <td className="font12 text-center">
                          <FontAwesomeIcon
                            onClick={() => {
                              dispatch(handleDeleteActionItem(item.id));
                            }}
                            className="text-danger cursorPointer"
                            icon={faTrashCan}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Row>
          <Row>
            <Form.Group as={Col} md="12" className="mt-5 mb-4">
              <Form.Label className="mb-1">توضیحات: </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={2000}
                name="softwareReqDescription"
                value={irantoolActionDescription}
                onChange={(e) => {
                  dispatch(RsetIrantoolActionDescription(e.target.value));
                }}
              />
            </Form.Group>
          </Row>
          <hr className="mt-4 mb-5" />
          <Row>
            <Col
              md="5"
              xl="4"
              className="mx-auto d-flex justify-content-between"
            >
              <Button
                variant="success"
                className="w-45 mb-3"
                // disabled={
                //   softwareToggleHandler === false &&
                //   softwareReqItems.length === 0
                //     ? true
                //     : false
                // }
                onClick={(e) => {
                  handleFormSubmit(e);
                }}
              >
                ثبت درخواست
              </Button>
              <Button
                variant="secondary"
                type="reset"
                className="w-45 mb-3"
                onClick={() => {
                  dispatch(RsetIrantoolMaterialCode(""));
                  dispatch(RsetIrantoolMaterialName(""));
                  dispatch(RsetIrantoolMaterialCount(""));
                  dispatch(RsetIrantoolMaterialUnit(""));
                  dispatch(RsetIrantoolActionDept(""));
                  dispatch(RsetIrantoolActionOprator(""));
                  dispatch(RsetIrantoolActionDevice(""));
                  dispatch(RsetIrantoolActionCount(""));
                  dispatch(RsetIrantoolMaterialItem([]));
                  dispatch(RsetIrantoolActionItem([]));
                  dispatch(RsetFormErrors(""));
                }}
              >
                انصراف
              </Button>
            </Col>
          </Row>
        </Fragment>
      ) : (
        <Loading />
      )}
      {irantoolMaterialModalSearch && <IrantoolMaterialModalSearch />}
    </Container>
  );
};

export default IranTolJobMaterialWorkflow;
