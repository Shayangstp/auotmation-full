import React, { useRef } from "react";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSearch } from "@fortawesome/free-solid-svg-icons";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import {
  RsetIrantoolMaterialCode,
  selectIrantoolMaterialCode,
  RsetIrantoolMaterialName,
  selectIrantoolMaterialName,
  RsetIrantoolMaterialCount,
  selectIrantoolMaterialCount,
  RsetIrantoolMaterialUnit,
  selectIrantoolMaterialUnit,
  selectIrantoolMaterialUnitOptions,
  RsetIrantoolModalSearch,
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
} from "../Slices/irantoolSlices";
import { RsetFormErrors, selectFormErrors } from "../Slices/mainSlices";

const IranTolJobMaterial = () => {
  const dispatch = useDispatch();
  const irantoolMaterialCode = useSelector(selectIrantoolMaterialCode);
  const irantoolMaterialName = useSelector(selectIrantoolMaterialName);
  const irantoolMaterialCount = useSelector(selectIrantoolMaterialCount);
  const irantoolMaterialUnit = useSelector(selectIrantoolMaterialUnit);
  const irantoolMaterialUnitOptions = useSelector(
    selectIrantoolMaterialUnitOptions
  );
  const irantoolMaterialDescription = useSelector(
    selectIrantoolMaterialDescription
  );
  const irantoolMaterialItem = useSelector(selectIrantoolMaterialItem);
  const formErrors = useSelector(selectFormErrors);

  const materialCodeRef = useRef(null);
  const materialNameRef = useRef(null);
  const materialCountRef = useRef(null);
  const materialUnitRef = useRef(null);
  const materialDescriptionRef = useRef(null);

  const handleNextMaterialInput = (e) => {
    e.preventDefault();
    if (
      e.target.id === materialCodeRef.current.id &&
      materialCodeRef.current.value !== ""
    ) {
      materialCountRef.current.focus();
    } else if (
      e.target.id === materialCountRef.current.id &&
      materialCountRef.current.value !== ""
    ) {
      materialUnitRef.current.focus();
    } else if (
      e.target.id.trim() === materialDescriptionRef.current.id.trim()
    ) {
      handleIrantoolMaterial();
      materialCodeRef.current.focus();
    } else if (materialUnitRef.current.props.value !== "") {
      materialDescriptionRef.current.focus();
    }
  };

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

  return (
    <div className="lightGray2-bg p-4 borderRadius shadow ">
      <Row>
        <h3 className="fw-bold font16 mb-4 lightGray-bg p-4 borderRadius text-dark mb-5 shadow ">
          ثبت مواد اولیه
        </h3>
        <Form.Group as={Col} md="3" lg="2" className="mb-4">
          <Form.Label className="required-field">کد متریال : </Form.Label>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <NumberFormat
              dir="ltr"
              id="materialCode"
              type="text"
              maxLength={10}
              getInputRef={materialCodeRef}
              className="form-control"
              value={irantoolMaterialCode}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  dispatch(handleGetProWithCode(e));
                  handleNextMaterialInput(e);
                }
              }}
              onChange={(e) => {
                dispatch(RsetIrantoolMaterialCode(e.target.value));
              }}
              onBlur={(e) => {
                dispatch(handleGetProWithCode(e));
                handleNextMaterialInput(e);
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
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="required-field">نام متریال : </Form.Label>
          <Form.Control
            readOnly
            ref={materialNameRef}
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
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="required-field">تعداد / مقدار : </Form.Label>
          <NumberFormat
            dir="ltr"
            id="materialCount"
            getInputRef={materialCountRef}
            type="text"
            maxLength={10}
            className="form-control"
            value={irantoolMaterialCount}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextMaterialInput(e);
              }
            }}
            onBlur={(e) => handleNextMaterialInput(e)}
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
        <Form.Group as={Col} md="3" lg="2" className="mb-3">
          <Form.Label className="required-field">واحد شمارش: </Form.Label>
          <Select
            value={irantoolMaterialUnit}
            ref={materialUnitRef}
            name="materialUnits"
            id="materialUnit"
            onChange={(e) => {
              dispatch(RsetIrantoolMaterialUnit(e));
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextMaterialInput(e);
              }
            }}
            onBlur={(e) => handleNextMaterialInput(e)}
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
        <Form.Group as={Col} md="3" lg="2" className="mb-2">
          <Form.Label className="">توضیحات: </Form.Label>
          <Form.Control
            as="textarea"
            id="materialDescription"
            rows={1}
            ref={materialDescriptionRef}
            name="softwareReqDescription"
            value={irantoolMaterialDescription}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextMaterialInput(e);
              }
            }}
            onChange={(e) => {
              dispatch(RsetIrantoolMaterialDescription(e.target.value));
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="2">
          <Button
            className="mt30 font12"
            onClick={handleIrantoolMaterial}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleNextMaterialInput(e);
              }
            }}
          >
            افزودن آیتم
          </Button>
        </Form.Group>
      </Row>
      <Row>
        {irantoolMaterialItem.length !== 0 && (
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
            <tbody>
              {irantoolMaterialItem.map((item, idx) => {
                return (
                  <tr key={idx} style={{ background: "#fff" }}>
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
  );
};

export default IranTolJobMaterial;
