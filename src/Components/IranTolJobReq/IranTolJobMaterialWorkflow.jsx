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
  faSearch,
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
  RsetIrantoolModalSearch,
  handleIrantoolMaterialUnitOptions,
  handleGetProWithCode,
  selectIrantoolModalSearch,
  RsetIrantoolMaterialList,
  selectIrantoolMaterialItem,
  RsetIrantoolMaterialItem,
  handleDeleteMaterialItem,
  selectIrantoolMaterialDescription,
  RsetIrantoolMaterialDescription,
  //tool
  RsetIrantoolMaterialToolSearch,
  selectIrantoolToolCode,
  RsetIrantoolToolCode,
  selectIrantoolToolName,
  RsetIrantoolToolName,
  selectIrantoolToolCount,
  RsetIrantoolToolCount,
  selectIrantoolToolUnit,
  RsetIrantoolToolUnit,
  selectIrantoolToolUnitOptions,
  RsetIrantoolToolUnitOptions,
  selectIrantoolToolDescription,
  RsetIrantoolToolDescription,
  selectIrantoolToolItem,
  RsetIrantoolToolItem,
  //action
  selectIrantoolActionDept,
  RsetIrantoolActionDept,
  selectIrantoolActionOprator,
  RsetIrantoolActionOprator,
  selectIrantoolActionDevice,
  RsetIrantoolActionDevice,
  selectIrantoolActionCount,
  RsetIrantoolActionCount,
  selectIrantoolActionWorkTime,
  RsetIrantoolActionWorkTime,
  selectIrantoolActionOpration,
  RsetIrantoolActionOrpration,
  RsetIrantoolActionDescription,
  selectIrantoolActionDescription,
  selectIrantoolActionDeptOptions,
  selectIrantoolActionOpratorOptions,
  selectIrantoolActionDeviceOptions,
  selectIrantoolActionOprationOptions,
  handleIrantoolActionDeptOptions,
  handleIrantoolActionOpratorOptions,
  handleIrantoolActionDeviceOptions,
  selectIrantoolActionItem,
  RsetIrantoolActionItem,
  handleDeleteActionItem,
  handleDeleteToolItem,
  RsetIrantoolActionOpration,
  handleIrantoolActionOprations,
  //test
} from "../Slices/irantoolSlices";

import IrantoolMaterialModalSearch from "../Modals/ITJReqModals/IrantoolDevicesModals/IrantoolMaterialModalSearch";
import {
  RsetFormErrors,
  selectFormErrors,
  selectUser,
} from "../Slices/mainSlices";
import { errorMessage, successMessage } from "../../utils/message";
import { useHistory } from "react-router-dom";
import {
  postWarehouseReq,
  postWarehouseReqItems,
} from "../../Services/warehouseReqService";
import { getToPersonByRole, postAction } from "../../Services/rootServices";
import { postWorkAndMaterials } from "../../Services/irantolJobReqServices";

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

  const history = useHistory();

  const dispatch = useDispatch();
  const { reqId, fileId } = useParams();

  //useSelector
  const irantoolMaterialCode = useSelector(selectIrantoolMaterialCode);
  const irantoolMaterialName = useSelector(selectIrantoolMaterialName);
  const irantoolMaterialCount = useSelector(selectIrantoolMaterialCount);
  const irantoolMaterialUnit = useSelector(selectIrantoolMaterialUnit);
  const irantoolMaterialUnitOptions = useSelector(
    selectIrantoolMaterialUnitOptions
  );
  const irantoolModalSearch = useSelector(selectIrantoolModalSearch);
  const irantoolMaterialDescription = useSelector(
    selectIrantoolMaterialDescription
  );
  const irantoolMaterialItem = useSelector(selectIrantoolMaterialItem);

  const irantoolToolCode = useSelector(selectIrantoolToolCode);
  const irantoolToolName = useSelector(selectIrantoolToolName);
  const irantoolToolCount = useSelector(selectIrantoolToolCount);
  const irantoolToolUnit = useSelector(selectIrantoolToolUnit);
  const irantoolToolUnitOptions = useSelector(selectIrantoolToolUnitOptions);
  const irantoolToolDescription = useSelector(selectIrantoolToolDescription);
  const irantoolToolItem = useSelector(selectIrantoolToolItem);

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
  const irantoolActionWorkTime = useSelector(selectIrantoolActionWorkTime);
  const irantoolActionOpration = useSelector(selectIrantoolActionOpration);
  const irantoolActionOprationOptions = useSelector(
    selectIrantoolActionOprationOptions
  );
  const irantoolActionItem = useSelector(selectIrantoolActionItem);

  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const formErrors = useSelector(selectFormErrors);
  const user = useSelector(selectUser);

  //end of useSelector

  useEffect(() => {
    if (currentReqInfo.requestId !== undefined)
      handleReqFiles(currentReqInfo.requestId, 0, 0, 1, "");
  }, [currentReqInfo]);

  useEffect(() => {
    dispatch(handleIrantoolMaterialUnitOptions());
    dispatch(handleIrantoolActionDeptOptions());
    dispatch(handleIrantoolActionDeviceOptions());
    dispatch(handleIrantoolActionOprations());
  }, []);

  useEffect(() => {
    if (user._id !== undefined) {
      dispatch(handleIrantoolActionOpratorOptions());
    }
  }, [user]);

  useEffect(() => {
    dispatch(
      handleCurrentReqInfo({
        reqId: reqId,
        reqType: 1,
      })
    );
  }, []);

  //handle file
  const file = currentReqFiles.find((file) => file.id === fileId);

  //should make this not happen when the id of the plan is same
  useEffect(() => {
    dispatch(RsetIrantoolMaterialCode(""));
    dispatch(RsetIrantoolMaterialName(""));
    dispatch(RsetIrantoolMaterialCount(""));
    dispatch(RsetIrantoolMaterialUnit(""));
    dispatch(RsetIrantoolToolCode(""));
    dispatch(RsetIrantoolToolName(""));
    dispatch(RsetIrantoolToolCount(""));
    dispatch(RsetIrantoolToolUnit(""));
    dispatch(RsetIrantoolActionDept(""));
    dispatch(RsetIrantoolActionOprator(""));
    dispatch(RsetIrantoolActionDevice(""));
    dispatch(RsetIrantoolActionCount(""));
    dispatch(RsetIrantoolMaterialItem([]));
    dispatch(RsetIrantoolToolItem([]));
    dispatch(RsetIrantoolActionItem([]));
    dispatch(RsetFormErrors(""));
  }, []);

  //validation Material

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
      errors.irantoolMaterialUnit = "واردکردن واحد شمارش کالا اجباری است!";
    }
    return errors;
  };

  //validation Tool
  const irantoolToolCodeIsValid = irantoolToolCode !== "";
  const irantoolToolNameIsValid = irantoolToolName !== "";
  const irantoolToolCountIsValid = irantoolToolCount !== "";
  const irantoolToolUnitIsValid = irantoolToolUnit.length !== 0;

  const toolAddTableIsValid =
    irantoolToolCodeIsValid &&
    irantoolToolNameIsValid &&
    irantoolToolCountIsValid &&
    irantoolToolUnitIsValid;

  const validationTool = () => {
    var errors = {};
    if (!irantoolToolCodeIsValid) {
      errors.irantoolToolCode = "واردکردن کد ابزار اجباری است!";
    }
    if (!irantoolToolNameIsValid) {
      errors.irantoolToolName = "واردکردن نام ابزار اجباری است!";
    }
    if (!irantoolToolCountIsValid) {
      errors.irantoolToolCount = "واردکردن تعداد ابزار اجباری است!";
    }
    if (!irantoolToolUnitIsValid) {
      errors.irantoolToolUnit = "واردکردن واحد شمارش ابزار اجباری است!";
    }
    return errors;
  };

  //validationAction

  const irantoolActionDeptIsValid = irantoolActionDept.length !== 0;
  const irantoolActionOpratorIsValid = irantoolActionOprator.length !== 0;
  const irantoolActionDeviceIsValid = irantoolActionDevice.length !== 0;
  const irantoolActionCountIsValid = irantoolActionCount !== "";
  const irantoolActionWorkTimeIsValid = irantoolActionWorkTime !== "";
  const irantoolActionOprationIsValid = irantoolActionOpration.length !== 0;

  const ActionAddTableIsValid =
    irantoolActionDeptIsValid &&
    irantoolActionOpratorIsValid &&
    irantoolActionDeviceIsValid &&
    irantoolActionCountIsValid &&
    irantoolActionWorkTimeIsValid &&
    irantoolActionOprationIsValid;

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
    if (!irantoolActionOprationIsValid) {
      errors.irantoolActionOpration = "واردکردن نوع عملیات اجباری است!";
    }
    if (!irantoolActionWorkTimeIsValid) {
      errors.irantoolActionWorkTime = "واردکردن زمان انجام کار اجباری است!";
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
        itemCode: irantoolMaterialCode,
        itemName: irantoolMaterialName,
        itemCount: irantoolMaterialCount,
        itemUnit: irantoolMaterialUnit,
        itemDescription: irantoolMaterialDescription,
      };

      reqItems.push(reqItem);
      dispatch(RsetIrantoolMaterialItem(reqItems));
      dispatch(RsetIrantoolMaterialCode(""));
      dispatch(RsetIrantoolMaterialName(""));
      dispatch(RsetIrantoolMaterialCount(""));
      dispatch(RsetIrantoolMaterialUnit(""));
      dispatch(RsetIrantoolMaterialDescription(""));
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

  const handleIrantoolTool = () => {
    if (toolAddTableIsValid) {
      let reqItems = [...irantoolToolItem];

      let reqItem = {
        id: generateRandomNumber(1000, 9999),
        itemCode: irantoolToolCode,
        itemName: irantoolToolName,
        itemCount: irantoolToolCount,
        itemUnit: irantoolToolUnit,
        itemDescription: irantoolToolDescription,
      };

      reqItems.push(reqItem);
      dispatch(RsetIrantoolToolItem(reqItems));
      dispatch(RsetIrantoolToolCode(""));
      dispatch(RsetIrantoolToolName(""));
      dispatch(RsetIrantoolToolCount(""));
      dispatch(RsetIrantoolToolUnit(""));
      dispatch(RsetIrantoolToolDescription(""));
      dispatch(RsetFormErrors(""));
    } else {
      dispatch(
        RsetFormErrors(
          validationTool({
            irantoolToolCode,
            irantoolToolName,
            irantoolToolCount,
            irantoolToolUnit,
          })
        )
      );
    }
  };

  //handle the deviceOptions
  const deviceOptions = irantoolActionDeviceOptions.map((item) => ({
    label: item.categoryName + "-" + item.machineCode,
    value: item.machineCode,
  }));

  //handle worktime
  let workTime;

  if (irantoolActionItem) {
    const workTimeSum = irantoolActionItem.reduce(
      (sum, item) => sum + item.actionCount * item.actionWorkTime,
      0
    );
    const workTimeSumMinuts = Math.floor(workTimeSum);
    const workTimeSumHours = Math.floor(workTimeSumMinuts / 60);
    const remainingMinutes = workTimeSumMinuts % 60;
    const formattedWorkTime = `${workTimeSumHours}:${
      remainingMinutes < 10 ? "0" : ""
    }${remainingMinutes}`;

    if (workTimeSumHours < 1) {
      workTime = workTimeSumMinuts + " دقیقه";
    } else if (workTimeSumHours < 8) {
      workTime = formattedWorkTime + " ساعت";
    } else {
      const days = Math.floor(workTimeSumHours / 8);
      const remainingHours = workTimeSumHours % 8;
      const formattedRemainingTime = `${remainingHours}:${
        remainingMinutes < 10 ? "0" : ""
      }${remainingMinutes}`;
      let timeString = "";

      if (days > 0) {
        timeString += `${days} روز${days > 1 ? "" : ""}`;
      }

      if (remainingHours > 0 || remainingMinutes > 0) {
        timeString += ` ${formattedRemainingTime}`;
      }

      workTime = timeString.trim();
    }
  }

  //action

  const handleIrantoolActionItem = () => {
    if (ActionAddTableIsValid) {
      let reqItems = [...irantoolActionItem];

      let reqItem = {
        id: generateRandomNumber(1000, 9999),
        actionDept: irantoolActionDept,
        actionOpration: irantoolActionOpration,
        actionOprator: irantoolActionOprator,
        actionDevice: irantoolActionDevice,
        actionWorkTime: irantoolActionWorkTime,
        actionCount: irantoolActionCount,
        actionDescription: irantoolActionDescription,
      };

      reqItems.push(reqItem);
      dispatch(RsetIrantoolActionItem(reqItems));
      dispatch(RsetIrantoolActionDept(""));
      dispatch(RsetIrantoolActionOpration(""));
      dispatch(RsetIrantoolActionOprator(""));
      dispatch(RsetIrantoolActionDevice(""));
      dispatch(RsetIrantoolActionWorkTime(""));
      dispatch(RsetIrantoolActionCount(""));
      dispatch(RsetIrantoolActionDescription(""));
      dispatch(RsetFormErrors(""));
    } else {
      dispatch(
        RsetFormErrors(
          validationWork(
            irantoolActionDept,
            irantoolActionOprator,
            irantoolActionDevice,
            irantoolActionCount,
            irantoolActionWorkTime,
            irantoolActionOpration
          )
        )
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (mtrWrkflwIsValid) {
      const reqValues = {
        forProject: 2,
        planId: fileId,
      };

      const postWarehouseReqRes = await postWarehouseReq(reqValues);
      console.log(postWarehouseReqRes);

      if (postWarehouseReqRes.data.code === 415) {
        const sendAction = async () => {
          const toPersons = await getToPersonByRole(
            "3,36",
            user.Location,
            user.CompanyCode,
            1,
            null,
            "0"
          );
          const actionValuesFirst = {
            actionCode: 0,
            actionId: postWarehouseReqRes.data.id,
            userId: localStorage.getItem("id"),
            typeId: 2,
            toPersons: localStorage.getItem("id"),
            comment: null,
          };
          const actionValuesSecond = {
            actionCode: 6,
            actionId: postWarehouseReqRes.data.id,
            userId: localStorage.getItem("id"),
            typeId: 2,
            // toPersons: toPersons.data.list.map((item) => item.value).join(","),
            toPersons: "6434f84d89828a92a92181c4",
            comment: null,
          };
          const postActionFirstRes = await postAction(actionValuesFirst);
          console.log(postActionFirstRes);
          if (postActionFirstRes.data.code === 415) {
            const postActionSecondRes = await postAction(actionValuesSecond);
            console.log(postActionSecondRes);
            if (postActionSecondRes.data.code === 415) {
              successMessage("درخواست مورد نظر با موفقیت ثبت شد!");
              dispatch(RsetFormErrors(""));
              dispatch(RsetIrantoolToolItem(""));
              dispatch(RsetIrantoolMaterialItem(""));
            } else {
              errorMessage("خطا");
            }
          } else {
            errorMessage("!خطا");
          }
        };
        const items = [...irantoolMaterialItem, ...irantoolToolItem];
        let count = 0;
        items.map(async (item, idx) => {
          const reqItemValues = {
            userId: user._id,
            requestId: postWarehouseReqRes.data.id,
            itemName: item.itemName + "-" + item.itemCode,
            itemAmount: item.itemCount,
            itemUnit: item.itemUnit.value,
            mainPlace: "-",
            subPlace: "-",
            comment: item.itemDescription,
            row: idx,
          };
          const postWarehouseReqItemsRes = await postWarehouseReqItems(
            reqItemValues
          );
          console.log(postWarehouseReqItemsRes);
          if (postWarehouseReqItemsRes.data.code === 415) {
            count = count + 1;
            if (count === items.length) {
              sendAction();
            }
          }
        });
      }

      const actionItems = [...irantoolActionItem];
      actionItems.map(async (item, idx) => {
        const actionValues = {
          userId: localStorage.getItem("id"),
          operatingDepId: item.actionDept.value,
          operationId: item.actionOpration.value,
          operatorId: item.actionOprator.value,
          machineId: item.actionDevice.value,
          requiredTime: item.actionWorkTime,
          amount: item.actionCount,
          planId: fileId,
          comment: item.actionDescription,
          row: String(idx),
        };
        console.log(actionValues);
        const postWorkAndMaterialsRes = await postWorkAndMaterials(
          reqId,
          actionValues
        );
        console.log(postWorkAndMaterialsRes);
        if (postWorkAndMaterialsRes.data.code === 415) {
          dispatch(RsetIrantoolActionItem(""));
          console.log("success");
        }
      });
    } else {
      errorMessage(
        "اضافه کردن جدول مواد اولیه، ابزارآلات و برنامه عملیاتی اجباری است!"
      );
    }
  };

  return (
    <Container fluid>
      <div className="position-relative">
        {currentReqInfo.requestId === undefined ? (
          <div className="vh-100 mb-3">
            <Loading />
          </div>
        ) : (
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
                    <th>پیوست</th>
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
                    <td>
                      {xssFilters.inHTMLData(currentReqInfo.toolTypeName)}
                    </td>
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
                    <td>
                      {currentReqFiles.length !== 0 ? (
                        <Fragment>
                          <ul className="d-flex list-unstyled">
                            <li
                              key={file.path}
                              className="mx-2"
                              onClick={() => {
                                handleReqFiles(
                                  currentReqInfo.requestId,
                                  file.row,
                                  0,
                                  0,
                                  file.id
                                );
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faFile}
                                className="font24 cursorPointer"
                              />
                            </li>
                          </ul>
                        </Fragment>
                      ) : (
                        <p>فایلی آپلود نشده است!</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <hr className="mt-5 mb-4" />
            <div className="lightGray-bg p-4 rounded shadow">
              <Row>
                <h3 className="fw-bold font16 mb-4 lightBlue-bg p-4 rounded text-dark mb-4 shadow ">
                  ثبت مواد اولیه
                </h3>
                <Form.Group as={Col} md="2" className="mb-4">
                  <Form.Label className="required-field">
                    کد متریال :{" "}
                  </Form.Label>
                  <div className="d-flex flex-row justify-content-center align-items-center">
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
                        }
                      }}
                      onChange={(e) => {
                        dispatch(RsetIrantoolMaterialCode(e.target.value));
                      }}
                      onBlur={(e) => {
                        dispatch(handleGetProWithCode(e));
                      }}
                    />
                    {/* validation */}

                    <Button
                      title="جستوجوی متریال"
                      className="font12 ms-1"
                      onClick={() => {
                        dispatch(RsetIrantoolModalSearch(true));
                        dispatch(RsetIrantoolMaterialList([]));
                        dispatch(RsetIrantoolMaterialToolSearch(false));
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </div>
                  {!irantoolMaterialCodeIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolMaterialCode}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2" className="mb-3">
                  <Form.Label className="required-field">
                    نام متریال :{" "}
                  </Form.Label>
                  <Form.Control
                    readOnly
                    value={irantoolMaterialName}
                    onChange={(e) => {
                      dispatch(RsetIrantoolMaterialName(e.target.value));
                    }}
                  />
                  {!irantoolMaterialNameIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolMaterialName}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2" className="mb-3">
                  <Form.Label className="required-field">
                    تعداد / مقدار :{" "}
                  </Form.Label>
                  <NumberFormat
                    dir="ltr"
                    id="materialCode"
                    type="text"
                    maxLength={10}
                    // ref={materialCode}
                    className="form-control"
                    value={irantoolMaterialCount}
                    onChange={(e) => {
                      dispatch(RsetIrantoolMaterialCount(e.target.value));
                    }}
                  />
                  {!irantoolMaterialCountIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolMaterialCount}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label className="required-field">
                    واحد شمارش:{" "}
                  </Form.Label>
                  <Select
                    value={irantoolMaterialUnit}
                    name="units"
                    id="units"
                    onChange={(e) => {
                      dispatch(RsetIrantoolMaterialUnit(e));
                    }}
                    placeholder=" انتخاب..."
                    options={irantoolMaterialUnitOptions}
                    isSearchable={true}
                  />
                  {!irantoolMaterialUnitIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolMaterialUnit}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2" className="mb-2">
                  <Form.Label className="">توضیحات: </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    maxLength={2000}
                    name="softwareReqDescription"
                    value={irantoolMaterialDescription}
                    onChange={(e) => {
                      dispatch(RsetIrantoolMaterialDescription(e.target.value));
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Button
                    className="mt30 font12"
                    onClick={handleIrantoolMaterial}
                  >
                    افزودن آیتم
                  </Button>
                </Form.Group>
              </Row>
              <Row></Row>
              <Row>
                {irantoolMaterialItem.length !== 0 && (
                  <Table striped bordered hover responsive className="mt-5">
                    <thead className="lightBlue-bg light-dark">
                      <tr>
                        <th>ردیف</th>
                        <th>کد متریال</th>
                        <th>نام متریال</th>
                        <th>تعداد / مقدار</th>
                        <th>واحد شمارش</th>
                        <th>توضیحات</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#f0f8ff" }}>
                      {irantoolMaterialItem.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td className="font12">{idx + 1}</td>
                            <td className="font12">{item.itemCode}</td>
                            <td className="font12">{item.itemName}</td>
                            <td className="font12">{item.itemCount}</td>
                            <td className="font12">{item.itemUnit.label}</td>
                            <td className="font12">{item.itemDescription}</td>
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
            </div>
            <hr className="mt-5 mb-4" />
            <div className="lightGray-bg p-4 rounded shadow">
              <Row>
                <h3 className="fw-bold font16 mb-4 lightYellow  p-4 rounded text-black mb-2 shadow">
                  ثبت ابزارآلات
                </h3>
                <Form.Group as={Col} md="2" className="mb-4">
                  <Form.Label className="mb-1 required-field">
                    کد ابزار :{" "}
                  </Form.Label>
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    <NumberFormat
                      dir="ltr"
                      id="materialCode"
                      type="text"
                      maxLength={10}
                      className="form-control"
                      value={irantoolToolCode}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          dispatch(handleGetProWithCode(e));
                          // handleNextInput(e);
                        }
                      }}
                      onChange={(e) => {
                        dispatch(RsetIrantoolToolCode(e.target.value));
                      }}
                      onBlur={(e) => {
                        dispatch(handleGetProWithCode(e));
                      }}
                    />
                    {/* validation */}
                    <Button
                      title="جستوجوی متریال"
                      className="font12 ms-1 bg-warning border border-warning"
                      onClick={() => {
                        dispatch(RsetIrantoolModalSearch(true));
                        dispatch(RsetIrantoolMaterialList([]));
                        dispatch(RsetIrantoolMaterialToolSearch(true));
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} className="text-dark" />
                    </Button>
                  </div>
                  {!irantoolToolCodeIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolToolCode}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3" className="mb-3">
                  <Form.Label className="mb-1 required-field">
                    نام ابزار :{" "}
                  </Form.Label>
                  <Form.Control
                    readOnly
                    value={irantoolToolName}
                    onChange={(e) => {
                      dispatch(RsetIrantoolToolName(e.target.value));
                    }}
                  />
                  {!irantoolToolNameIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolToolName}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2" className="mb-3">
                  <Form.Label className="mb-1 required-field">
                    تعداد / مقدار :{" "}
                  </Form.Label>
                  <NumberFormat
                    dir="ltr"
                    id="materialCode"
                    type="text"
                    maxLength={10}
                    // ref={materialCode}
                    className="form-control"
                    value={irantoolToolCount}
                    onChange={(e) => {
                      dispatch(RsetIrantoolToolCount(e.target.value));
                    }}
                  />
                  {!irantoolToolCountIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolToolCount}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label className="mb-1 required-field">
                    واحد شمارش:{" "}
                  </Form.Label>
                  <Select
                    value={irantoolToolUnit}
                    name="units"
                    id="units"
                    onChange={(e) => {
                      dispatch(RsetIrantoolToolUnit(e));
                    }}
                    placeholder=" انتخاب..."
                    options={irantoolMaterialUnitOptions}
                    isSearchable={true}
                  />
                  {!irantoolToolUnitIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolToolUnit}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Button className="mt30 font12" onClick={handleIrantoolTool}>
                    افزودن آیتم
                  </Button>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="12" className="mt-1 mb-2">
                  <Form.Label className="mb-1">توضیحات: </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    maxLength={2000}
                    name="softwareReqDescription"
                    value={irantoolToolDescription}
                    onChange={(e) => {
                      dispatch(RsetIrantoolToolDescription(e.target.value));
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                {irantoolToolItem.length !== 0 && (
                  <Table striped bordered hover responsive className="mt-5">
                    <thead className="bg-warning light-black">
                      <tr>
                        <th>ردیف</th>
                        <th>کد متریال</th>
                        <th>نام متریال</th>
                        <th>تعداد / مقدار</th>
                        <th>واحد شمارش</th>
                        <th>توضیحات</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#e3d598" }}>
                      {irantoolToolItem.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td className="font12">{idx + 1}</td>
                            <td className="font12">{item.itemCode}</td>
                            <td className="font12">{item.itemName}</td>
                            <td className="font12">{item.itemCount}</td>
                            <td className="font12">{item.itemUnit.label}</td>
                            <td className="font12">{item.itemDescription}</td>
                            <td className="font12 text-center">
                              <FontAwesomeIcon
                                onClick={() => {
                                  dispatch(handleDeleteToolItem(item.id));
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
            </div>
            <hr className="mt-4 mb-4" />
            <div className="lightGray-bg p-4 rounded">
              <h3 className="fw-bold font16 mb-4 bg-success p-4 rounded text-white">
                ثبت برنامه های عملیاتی
              </h3>
              <Row>
                <Form.Group as={Col} md="3">
                  <Form.Label className="mb-1 required-field">
                    واحد :{" "}
                  </Form.Label>
                  <Select
                    value={irantoolActionDept}
                    name="units"
                    id="units"
                    onChange={(e) => {
                      dispatch(RsetIrantoolActionDept(e));
                    }}
                    placeholder=" انتخاب..."
                    options={irantoolActionDeptOptions}
                    isSearchable={true}
                  />
                  {!irantoolActionDeptIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolActionDept}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label className="mb-1 required-field">
                    نوع عملیات:{" "}
                  </Form.Label>
                  <Select
                    value={irantoolActionOpration}
                    name="units"
                    id="units"
                    onChange={(e) => {
                      dispatch(RsetIrantoolActionOpration(e));
                    }}
                    placeholder=" انتخاب..."
                    options={irantoolActionOprationOptions}
                    isSearchable={true}
                  />
                  {!irantoolActionOpration && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolActionOpration}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label className="mb-1 required-field">
                    اپراتور:{" "}
                  </Form.Label>
                  <Select
                    value={irantoolActionOprator}
                    name="oprator"
                    id="oprator"
                    onChange={(e) => {
                      dispatch(RsetIrantoolActionOprator(e));
                    }}
                    placeholder=" انتخاب..."
                    options={irantoolActionOpratorOptions}
                    isSearchable={true}
                  />
                  {!irantoolActionOpratorIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolActionOprator}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label className="mb-1 required-field">
                    دستگاه:{" "}
                  </Form.Label>
                  <Select
                    value={irantoolActionDevice}
                    name="units"
                    id="units"
                    onChange={(e) => {
                      dispatch(RsetIrantoolActionDevice(e));
                    }}
                    placeholder=" انتخاب..."
                    options={deviceOptions}
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
                    زمان انجام کار(دقیقه) :{" "}
                  </Form.Label>
                  <NumberFormat
                    dir="ltr"
                    id="workTime"
                    className="form-control"
                    value={irantoolActionWorkTime}
                    onChange={(e) => {
                      dispatch(
                        RsetIrantoolActionWorkTime(
                          e.target.value
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      );
                    }}
                  />
                  {!irantoolActionWorkTimeIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolActionWorkTime}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3" className="mb-4 mt-3">
                  <Form.Label className="mb-1 required-field">
                    تعداد :{" "}
                  </Form.Label>
                  <NumberFormat
                    dir="ltr"
                    id="materialCode"
                    type="text"
                    maxLength={10}
                    className="form-control"
                    value={irantoolActionCount}
                    onChange={(e) => {
                      dispatch(RsetIrantoolActionCount(e.target.value));
                    }}
                  />

                  {/* validation */}
                  {!irantoolActionCountIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.irantoolActionCount}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="2" className="mt-3">
                  <Button
                    className="mt-4 ms-2 font12 bg-success border border-success text-white"
                    onClick={() => {
                      handleIrantoolActionItem();
                    }}
                  >
                    افزودن آیتم
                  </Button>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="12" className="mt-1 mb-2">
                  <Form.Label className="mb-1">توضیحات: </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    maxLength={2000}
                    name="softwareReqDescription"
                    value={irantoolActionDescription}
                    onChange={(e) => {
                      dispatch(RsetIrantoolActionDescription(e.target.value));
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                {irantoolActionItem.length !== 0 && (
                  <Table striped bordered hover responsive className="mt-5">
                    <thead className="bg-secondary light-text">
                      <tr>
                        <th>ردیف</th>
                        <th>واحد</th>
                        <th>نوع عملیات</th>
                        <th>اپراتور</th>
                        <th>دستگاه</th>
                        <th>زمان انجام کار</th>
                        <th>تعداد</th>
                        <th>توضیحات</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody
                      style={{ backgroundColor: "#acd49b", color: "black" }}
                    >
                      {irantoolActionItem.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td className="font12  text-black">{idx + 1}</td>
                            <td className="font12 text-black">
                              {item.actionDept.label}
                            </td>
                            <td className="font12 text-black">
                              {item.actionOpration.label}
                            </td>
                            <td className="font12 text-black">
                              {item.actionOprator.label}
                            </td>
                            <td className="font12 text-black">
                              {item.actionDevice.label}
                            </td>
                            <td className="font12 text-black">
                              {item.actionWorkTime}
                            </td>
                            <td className="font12 text-black">
                              {item.actionCount}
                            </td>
                            <td className="font12 text-black">
                              {item.actionDescription}
                            </td>
                            <td className="font12 text-white text-center">
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
                      <tr>
                        <td colSpan="6" className="text-right font12">
                          کل زمان انجام کار:
                        </td>
                        <td className="font12">{workTime}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </Row>
            </div>

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
                    dispatch(RsetIrantoolToolCode(""));
                    dispatch(RsetIrantoolToolName(""));
                    dispatch(RsetIrantoolToolCount(""));
                    dispatch(RsetIrantoolToolUnit(""));
                    dispatch(RsetIrantoolActionDept(""));
                    dispatch(RsetIrantoolActionOprator(""));
                    dispatch(RsetIrantoolActionDevice(""));
                    dispatch(RsetIrantoolActionCount(""));
                    dispatch(RsetIrantoolMaterialItem([]));
                    dispatch(RsetIrantoolToolItem([]));
                    dispatch(RsetIrantoolActionItem([]));
                    dispatch(RsetFormErrors(""));
                    history.push("/IrtReqList");
                  }}
                >
                  انصراف
                </Button>
              </Col>
            </Row>
          </Fragment>
        )}
      </div>
      {irantoolModalSearch && <IrantoolMaterialModalSearch />}
    </Container>
  );
};

export default IranTolJobMaterialWorkflow;
