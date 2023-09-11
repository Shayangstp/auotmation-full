import React, { useContext, useEffect } from "react";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { reqContext } from "../context/warehouseReqsContext/reqContext";
import { rootContext } from "../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUnitsOption,
  handleUnits,
  selectFormErrors,
  RsetFormErrors,
} from "../Slices/mainSlices";
import {
  selectWarehouseReqItemName,
  RsetWarehouseReqItemName,
  selectWarehouseReqItemAmount,
  RsetWarehouseReqItemAmount,
  selectWarehouseReqItemUnit,
  RsetWarehouseReqItemUnit,
  selectWarehouseReqItemMainPlace,
  RsetWarehouseReqItemMainPlace,
  selectWarehouseReqItemSubPlace,
  RsetWarehouseReqItemSubPlace,
  selectWarehouseReqItemDescription,
  RsetWarehouseReqItemDescription,
  handleAddNewWarehouseReqItem,
} from "../Slices/warehouseSlice";

const WarehouseReqNewItem = () => {
  const dispatch = useDispatch();
  const warehouseReqItemName = useSelector(selectWarehouseReqItemName);
  const warehouseReqItemAmount = useSelector(selectWarehouseReqItemAmount);
  const warehouseReqItemUnit = useSelector(selectWarehouseReqItemUnit);
  const warehouseReqItemMainPlace = useSelector(
    selectWarehouseReqItemMainPlace
  );
  const warehouseReqItemSubPlace = useSelector(selectWarehouseReqItemSubPlace);
  const warehouseReqItemDescription = useSelector(
    selectWarehouseReqItemDescription
  );

  const unitsOption = useSelector(selectUnitsOption);
  useEffect(() => {
    dispatch(handleUnits());
  }, []);

  const formErrors = useSelector(selectFormErrors);
  const warehouseReqItemValidation = () => {
    var errors = {};
    if (!warehouseReqItemName) {
      errors.warehouseReqItemName = "انتخاب نام کالا اجباری است!";
    }
    if (!warehouseReqItemAmount) {
      errors.warehouseReqItemAmount = "انتخاب تعداد کالا اجباری است!";
    } else if (warehouseReqItemAmount <= 0) {
      errors.warehouseReqItemAmount =
        "تعداد کالا نمی تواند کوچک تر یا مساوی صفر باشد!";
    }
    if (!warehouseReqItemUnit) {
      errors.warehouseReqItemUnit = "انتخاب واحد کالا اجباری است!";
    }
    if (!warehouseReqItemMainPlace) {
      errors.warehouseReqItemMainPlace = "انتخاب محل مصرف اصلی اجباری است!";
    }
    return errors;
  };
  const addWarehouseNewReqItem = (e) => {
    e.preventDefault();
    if (
      warehouseReqItemName !== "" &&
      warehouseReqItemAmount !== "" &&
      warehouseReqItemAmount > 0 &&
      warehouseReqItemUnit !== "" &&
      warehouseReqItemMainPlace !== ""
    ) {
      dispatch(handleAddNewWarehouseReqItem());
    } else {
      dispatch(
        RsetFormErrors(
          warehouseReqItemValidation({
            warehouseReqItemName: warehouseReqItemName,
            warehouseReqItemAmount: warehouseReqItemAmount,
            warehouseReqItemUnit: warehouseReqItemUnit,
            warehouseReqItemMainPlace: warehouseReqItemMainPlace,
          })
        )
      );
    }
  };

  const requestContext = useContext(reqContext);
  const {
    handleEnter,
    reqItemNameRef,
    reqItemAmountRef,
    reqItemUnitRef,
    reqItemPlaceOfUseRef,
    reqItemSubPlaceOfUseRef,
    reqItemDescriptionRef,

    addNewItemRef,
  } = requestContext;
  return (
    <Col md="12">
      <Row>
        <Col>
          <h3 className="fw-bold mb-4">مشخصات آیتم درخواست:</h3>
        </Col>
      </Row>
      <Row>
        <Form.Group as={Col} md="4" lg="4" xxl="2" className="mb-4">
          <Form.Label className="mb-1 required-field">
            {" "}
            نام کالا/آیتم درخواستی:{" "}
          </Form.Label>
          <Form.Control
            type="text"
            value={warehouseReqItemName}
            name="reqItemName"
            id="reqItemName"
            onChange={(e) => {
              dispatch(RsetWarehouseReqItemName(e.target.value));
            }}
            onKeyUp={handleEnter}
            ref={reqItemNameRef}
          />
          {!warehouseReqItemName && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.warehouseReqItemName}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="4" lg="4" xl="3" xxl="2" className="mb-4">
          <Form.Label className="mb-1 required-field">
            {" "}
            مقدار/تعداد درخواستی:{" "}
          </Form.Label>
          <NumberFormat
            type="text"
            value={warehouseReqItemAmount}
            name="reqItemAmount"
            id="reqItemAmount"
            onChange={(e) => {
              dispatch(RsetWarehouseReqItemAmount(e.target.value));
            }}
            onKeyUp={handleEnter}
            getInputRef={reqItemAmountRef}
            dir="ltr"
            className="form-control"
          />
          {!warehouseReqItemAmount || warehouseReqItemAmount <= 0 ? (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.warehouseReqItemAmount}
            </p>
          ) : null}
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="4"
          xl="2"
          xxl="2"
          className="mb-4"
          onKeyUp={handleEnter}
        >
          <Form.Label className="mb-1 required-field">واحد شمارش :</Form.Label>
          <Select
            ref={reqItemUnitRef}
            id="reqItemUnit"
            placeholder="انتخاب..."
            isSearchable
            name="reqItemUnit"
            value={warehouseReqItemUnit}
            options={unitsOption}
            onChange={(option) => {
              dispatch(RsetWarehouseReqItemUnit(option));
            }}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          {!warehouseReqItemUnit && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.warehouseReqItemUnit}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="6" lg="4" xl="3" xxl="3" className="mb-4">
          <Form.Label className="mb-1 required-field">
            {" "}
            محل مصرف اصلی:{" "}
          </Form.Label>
          <Form.Control
            type="text"
            value={warehouseReqItemMainPlace}
            name="reqItemPlaceOfUse"
            id="reqItemPlaceOfUse"
            onChange={(e) => {
              dispatch(RsetWarehouseReqItemMainPlace(e.target.value));
            }}
            onKeyUp={handleEnter}
            ref={reqItemPlaceOfUseRef}
            placeholder="میتوانید واحد سازمانی خود را وارد کنید"
          />
          {!warehouseReqItemMainPlace && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.warehouseReqItemMainPlace}
            </p>
          )}
        </Form.Group>
        <Form.Group as={Col} md="6" lg="4" xl="4" xxl="3" className="mb-4">
          <Form.Label className="mb-1">
            {" "}
            محل مصرف فرعی <span className="font12">(واحد درخواست کننده)</span>:{" "}
          </Form.Label>
          <Form.Control
            type="text"
            value={warehouseReqItemSubPlace}
            name="reqItemSubPlaceOfUse"
            id="reqItemSubPlaceOfUse"
            onChange={(e) => {
              dispatch(RsetWarehouseReqItemSubPlace(e.target.value));
            }}
            onKeyUp={handleEnter}
            ref={reqItemSubPlaceOfUseRef}
          />
        </Form.Group>
        <Form.Group as={Col} md="8" lg="6" xxl="6" className="mb-4">
          <Form.Label className="mb-1"> اطلاعات تکمیلی آیتم :</Form.Label>
          <Form.Control
            type="text"
            value={warehouseReqItemDescription}
            name="reqItemDescription"
            id="reqItemDescription"
            onChange={(e) => {
              dispatch(RsetWarehouseReqItemDescription(e.target.value));
            }}
            onKeyUp={handleEnter}
            ref={reqItemDescriptionRef}
            placeholder="هرگونه مشخصات تکمیلی آیتم را می توانید در این قسمت وارد نمایید."
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xxl="2"
          className="mb-4 d-flex align-items-center"
        >
          <Button
            variant="info"
            type="button"
            className="text-white w-100 mt-md-4 py-1"
            id="addNewItem"
            onClick={(e) => {
              if (e.detail === 1) {
                addWarehouseNewReqItem(e);
              }
            }}
            ref={addNewItemRef}
            onKeyUp={(e) => {
              handleEnter(e);
            }}
            preventdefault="true"
          >
            افزودن آیتم به لیست
          </Button>
        </Form.Group>
      </Row>
    </Col>
  );
};

export default WarehouseReqNewItem;
