import React, { useRef } from "react";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSearch } from "@fortawesome/free-solid-svg-icons";

import NumberFormat from "react-number-format";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import {
  selectIrantoolMaterialUnitOptions,
  RsetIrantoolModalSearch,
  handleGetProWithCode,
  RsetIrantoolMaterialList,
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
  selectIrantoolToolDescription,
  RsetIrantoolToolDescription,
  selectIrantoolToolItem,
  RsetIrantoolToolItem,
  handleDeleteToolItem,
} from "../Slices/irantoolSlices";

import { RsetFormErrors, selectFormErrors } from "../Slices/mainSlices";

const IranTolJobTool = () => {
  const dispatch = useDispatch();

  const irantoolToolCode = useSelector(selectIrantoolToolCode);
  const irantoolToolName = useSelector(selectIrantoolToolName);
  const irantoolToolCount = useSelector(selectIrantoolToolCount);
  const irantoolToolUnit = useSelector(selectIrantoolToolUnit);
  const irantoolToolUnitOptions = useSelector(selectIrantoolToolUnitOptions);
  const irantoolToolDescription = useSelector(selectIrantoolToolDescription);
  const irantoolToolItem = useSelector(selectIrantoolToolItem);
  const formErrors = useSelector(selectFormErrors);
  const irantoolMaterialUnitOptions = useSelector(
    selectIrantoolMaterialUnitOptions
  );

  const toolCodeRef = useRef(null);
  const toolNameRef = useRef(null);
  const toolCountRef = useRef(null);
  const toolUnitRef = useRef(null);
  const toolDescriptionRef = useRef(null);

  const handleNextToolInput = (e) => {
    e.preventDefault();
    if (
      e.target.id === toolCodeRef.current.id &&
      toolCodeRef.current.value !== ""
    ) {
      toolCountRef.current.focus();
    } else if (
      e.target.id === toolCountRef.current.id &&
      toolCountRef.current.value !== ""
    ) {
      toolUnitRef.current.focus();
    } else if (e.target.id === toolDescriptionRef.current.id) {
      handleIrantoolTool();
      toolCodeRef.current.focus();
    } else if (toolUnitRef.current.props.value !== "") {
      toolDescriptionRef.current.focus();
    }
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

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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
  return (
    <div className="lightGray2-bg p-4 borderRadius shadow ">
      <Row>
        <h3 className="fw-bold font16 mb-4 lightGray-bg p-4 borderRadius text-dark mb-5 shadow">
          ثبت ابزارآلات
        </h3>
        <Form.Group as={Col} md="3" lg="2" className="mb-4">
          <Form.Label className="mb-1 required-field">کد ابزار : </Form.Label>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <NumberFormat
              dir="ltr"
              id="toolCode"
              type="text"
              maxLength={10}
              className="form-control"
              getInputRef={toolCodeRef}
              value={irantoolToolCode}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  dispatch(handleGetProWithCode(e));
                  handleNextToolInput(e);
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
              title="جستوجوی ابزار"
              className="font12 ms-1"
              onClick={() => {
                dispatch(RsetIrantoolModalSearch(true));
                dispatch(RsetIrantoolMaterialList([]));
                dispatch(RsetIrantoolMaterialToolSearch(true));
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </div>
          {!irantoolToolCodeIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolToolCode}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="mb-1 required-field">نام ابزار : </Form.Label>
          <Form.Control
            readOnly
            id="toolName"
            ref={toolNameRef}
            value={irantoolToolName}
            onChange={(e) => {
              dispatch(RsetIrantoolToolName(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextToolInput(e);
              }
            }}
          />
          {!irantoolToolNameIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolToolName}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="mb-1 required-field">
            تعداد / مقدار :{" "}
          </Form.Label>
          <NumberFormat
            dir="ltr"
            id="toolCount"
            type="text"
            maxLength={10}
            className="form-control"
            getInputRef={toolCountRef}
            value={irantoolToolCount}
            onChange={(e) => {
              dispatch(RsetIrantoolToolCount(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextToolInput(e);
              }
            }}
          />
          {!irantoolToolCountIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.irantoolToolCount}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="required-field">واحد شمارش: </Form.Label>
          <Select
            value={irantoolToolUnit}
            ref={toolUnitRef}
            name="toolUnit"
            id="toolUnit"
            onChange={(e) => {
              dispatch(RsetIrantoolToolUnit(e));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextToolInput(e);
              }
            }}
            onBlur={(e) => handleNextToolInput(e)}
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
        <Form.Group as={Col} md="3" lg="2" className="mt-1 mb-2">
          <Form.Label className="mb-1">توضیحات: </Form.Label>
          <Form.Control
            as="textarea"
            id="toolDescription"
            rows={1}
            maxLength={2000}
            ref={toolDescriptionRef}
            name="softwareReqDescription"
            value={irantoolToolDescription}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextToolInput(e);
              }
            }}
            onChange={(e) => {
              dispatch(RsetIrantoolToolDescription(e.target.value));
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="2">
          <Button className="mt30 font12" onClick={handleIrantoolTool}>
            افزودن آیتم
          </Button>
        </Form.Group>
      </Row>
      <Row></Row>
      <Row>
        {irantoolToolItem.length !== 0 && (
          <Table striped bordered hover responsive className="mt-5">
            <thead className="bg-secondary text-light">
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
            <tbody style={{ backgroundColor: "#fff" }}>
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
  );
};

export default IranTolJobTool;
