import React, { Fragment, useContext, useEffect, useRef } from "react";
import xssFilters from "xss-filters";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
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
import IranTolJobMaterial from "./IranTolJobMaterial";
import IranTolJobTool from "./IranTolJobTool";

const IranTolJobAction = () => {
  const dispatch = useDispatch();
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
  const formErrors = useSelector(selectFormErrors);

  const actionDeptRef = useRef(null);
  const actionOprationRef = useRef(null);
  const actionOpratorRef = useRef(null);
  const actionDeviceRef = useRef(null);
  const actionWorkTimeRef = useRef(null);
  const actionCountRef = useRef(null);
  const actionDescriptionRef = useRef(null);

  const handleNextActionInput = (e) => {
    e.preventDefault();
    console.log(actionOpratorRef.current.props.id);
    if (
      e.target.id === actionWorkTimeRef.current.id &&
      actionWorkTimeRef.current.value !== ""
    ) {
      actionCountRef.current.focus();
    } else if (
      e.target.id === actionCountRef.current.id &&
      actionCountRef.current.value !== ""
    ) {
      actionDescriptionRef.current.focus();
    } else if (e.target.id === actionDescriptionRef.current.id) {
      handleIrantoolActionItem();
      actionDeptRef.current.focus();
    } else if (actionDeviceRef.current.props.value !== "") {
      actionWorkTimeRef.current.focus();
    }
  };

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

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const deviceOptions = irantoolActionDeviceOptions.map((item) => ({
    label: item.categoryName + "-" + item.machineCode,
    value: item.machineCode,
  }));

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

  return (
    <div className="lightGray2-bg p-4 borderRadius shadow ">
      <h3 className="fw-bold font16 mb-4 lightGray-bg p-4 borderRadius text-dark mb-5 shadow">
        ثبت برنامه های عملیاتی
      </h3>
      <Row>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="required-field">واحد : </Form.Label>
          <Select
            value={irantoolActionDept}
            ref={actionDeptRef}
            name="actionDept"
            id="actionDept"
            onChange={(e) => {
              dispatch(RsetIrantoolActionDept(e));
            }}
            placeholder=" انتخاب..."
            options={irantoolActionDeptOptions}
            isSearchable={true}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
            onBlur={(e) => {
              handleNextActionInput(e);
            }}
          />
          {!irantoolActionDeptIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolActionDept}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="mb-1 required-field">نوع عملیات: </Form.Label>
          <Select
            value={irantoolActionOpration}
            name="actionOpration"
            ref={actionOprationRef}
            id="actionOpration"
            onChange={(e) => {
              dispatch(RsetIrantoolActionOpration(e));
            }}
            placeholder=" انتخاب..."
            options={irantoolActionOprationOptions}
            isSearchable={true}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
            onBlur={(e) => {
              handleNextActionInput(e);
            }}
          />
          {!irantoolActionOpration && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolActionOpration}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="mb-1 required-field">اپراتور: </Form.Label>
          <Select
            value={irantoolActionOprator}
            name="actionoprator"
            id="actionoprator"
            placeholder=" انتخاب..."
            options={irantoolActionOpratorOptions}
            isSearchable={true}
            ref={actionOpratorRef}
            onChange={(e) => {
              dispatch(RsetIrantoolActionOprator(e));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
            onBlur={(e) => {
              handleNextActionInput(e);
            }}
          />
          {!irantoolActionOpratorIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolActionOprator}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="mb-1 required-field">دستگاه: </Form.Label>
          <Select
            value={irantoolActionDevice}
            name="actionDevice"
            id="actionDevice"
            onChange={(e) => {
              dispatch(RsetIrantoolActionDevice(e));
            }}
            ref={actionDeviceRef}
            placeholder=" انتخاب..."
            options={deviceOptions}
            isSearchable={true}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
            onBlur={(e) => {
              handleNextActionInput(e);
            }}
          />
          {!irantoolActionDeviceIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolActionDevice}
            </p>
          )}
        </Form.Group>

        <Form.Group as={Col} md="4" lg="3" xl="3" xxl="2" className="mb-3">
          <Form.Label className="mb-1 required-field">
            زمان انجام کار(دقیقه) :{" "}
          </Form.Label>
          <NumberFormat
            dir="ltr"
            id="actionworkTime"
            getInputRef={actionWorkTimeRef}
            className="form-control"
            value={irantoolActionWorkTime}
            onChange={(e) => {
              dispatch(
                RsetIrantoolActionWorkTime(
                  e.target.value ? Number(e.target.value) : e.target.value
                )
              );
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                console.log("hiu");
                handleNextActionInput(e);
              }
            }}
          />
          {!irantoolActionWorkTimeIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolActionWorkTime}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" xl="2" className="mb-3">
          <Form.Label className="mb-1 required-field">تعداد : </Form.Label>
          <NumberFormat
            dir="ltr"
            id="actionsCount"
            type="text"
            getInputRef={actionCountRef}
            maxLength={10}
            className="form-control"
            value={irantoolActionCount}
            onChange={(e) => {
              dispatch(RsetIrantoolActionCount(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
          />

          {/* validation */}
          {!irantoolActionCountIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolActionCount}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="mb-1">توضیحات: </Form.Label>
          <Form.Control
            as="textarea"
            rows={1}
            maxLength={2000}
            ref={actionDescriptionRef}
            name="actionsDescription"
            value={irantoolActionDescription}
            onChange={(e) => {
              dispatch(RsetIrantoolActionDescription(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="">
          <Button
            className="font12 mt30"
            onClick={() => {
              handleIrantoolActionItem();
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextActionInput(e);
              }
            }}
          >
            افزودن آیتم
          </Button>
        </Form.Group>
      </Row>
      <Row className="mt-2"></Row>
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
            <tbody style={{ backgroundColor: "#fff" }}>
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
                    <td className="font12 text-black">{item.actionWorkTime}</td>
                    <td className="font12 text-black">{item.actionCount}</td>
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
  );
};

export default IranTolJobAction;
