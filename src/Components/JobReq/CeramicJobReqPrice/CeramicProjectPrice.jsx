import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import momentJalaali from "moment-jalaali";
import Select from "react-select";
import {
  selectCeramicProjectCode,
  RsetCeramicProjectCode,
  selectCeramicProjectName,
  RsetCeramicProjectName,
  selectCeramicProjectDescription,
  RsetCeramicProjectDescription,
  selectCeramicProjectMaterialCode,
  RsetCeramicProjectMaterialCode,
  selectCeramicProjectMaterialName,
  RsetCeramicProjectMaterialName,
  selectCeramicProjectMaterialCount,
  RsetCeramicProjectMaterialCount,
  selectCeramicProjectMaterialPrice,
  RsetCeramicProjectMaterialPrice,
  selectCeramicProjectMaterialDate,
  RsetCeramicProjectMaterialDate,
  RsetCeramicProjectMaterilaUnit,
  selectCeramicProjectMaterialUnit,
  selectCeramicItems,
  RsetCeramicItems,
  handleCeramicProjectItem,
  RsetCeramicProjectMaterialUnit,
  handleCeramicProCalculateCost,
  handleResetSubmit,
  handleResetItem,
  RsetCeramicMaterialModalSearch,
  selectCeramicMaterialModalSearch,
  handleGetProWithCode,
  selectCeramicMaterialCode,
  RsetCeramicMaterialCode,
  selectCeramicMaterialName,
  RsetCeramicMaterialName,
} from "../../Slices/ceramicPriceSlices";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import CeramicMaterialModalSearch from "../../Modals/JobReqsModals/CeraPriceModals/CeramicMaterialModalSearch";
import {
  RsetFormErrors,
  selectFormErrors,
  handleUnits,
  selectUnitsOption,
} from "../../Slices/mainSlices";

const CeramicProjectPrice = () => {
  const dispatch = useDispatch();
  const ceramicMaterialCode = useSelector(selectCeramicMaterialCode);
  const ceramicMaterialName = useSelector(selectCeramicMaterialName);

  const ceramicProjectCode = useSelector(selectCeramicProjectCode);
  const ceramicProjectName = useSelector(selectCeramicProjectName);
  const ceramicProjectMaterialCode = useSelector(
    selectCeramicProjectMaterialCode
  );
  const ceramicProjectMaterialName = useSelector(
    selectCeramicProjectMaterialName
  );
  const ceramicProjectMaterialCount = useSelector(
    selectCeramicProjectMaterialCount
  );
  const ceramicProjectMaterialPrice = useSelector(
    selectCeramicProjectMaterialPrice
  );

  const ceramicProjectDescription = useSelector(
    selectCeramicProjectDescription
  );

  const ceramicProjectMaterialDate = useSelector(
    selectCeramicProjectMaterialDate
  );

  const ceramicMaterialModalSearch = useSelector(
    selectCeramicMaterialModalSearch
  );

  const unitsOption = useSelector(selectUnitsOption);

  const ceramicProjectMaterialUnit = useSelector(
    selectCeramicProjectMaterialUnit
  );

  const formErrors = useSelector(selectFormErrors);

  const ceramicItems = useSelector(selectCeramicItems);

  useEffect(() => {
    if (ceramicProjectMaterialCode.length === 10) {
      dispatch(handleCeramicProjectItem());
    }
  }, [ceramicProjectMaterialCode, ceramicProjectMaterialDate]);

  useEffect(() => {
    dispatch(handleUnits());
  }, []);


  //validation
  const ceramicProjectNameIsValid = ceramicProjectName !== "";
  const ceramicProjectMaterialCodeIsValid = ceramicMaterialCode !== "";
  const ceramicProjectMaterialNameIsValid = ceramicMaterialName !== "";
  const ceramicProjectMaterialCountIsValid = ceramicProjectMaterialCount !== "";
  const ceramicProjectMaterialUnitIsValid =
    ceramicProjectMaterialUnit.length !== 0;

  const addTableIsValid =
    ceramicProjectMaterialCodeIsValid &&
    ceramicProjectMaterialNameIsValid &&
    ceramicProjectMaterialCountIsValid &&
    ceramicProjectMaterialUnitIsValid;

  const itemValidation = () => {
    var errors = {};
    if (!ceramicProjectMaterialCodeIsValid) {
      errors.ceramicProjectMaterialCode = "واردکردن کد متریال اجباری است!";
    }
    if (!ceramicProjectMaterialNameIsValid) {
      errors.ceramicProjectMaterialName = "وارد کردن نام متریال اجباری است!";
    }
    if (!ceramicProjectMaterialCountIsValid) {
      errors.ceramicProjectMaterialCount = "وارد کردن تعداد متریال اجباری است!";
    }
    if (!ceramicProjectMaterialUnitIsValid) {
      errors.ceramicProjectMaterialUnit = "وارد کردن واحد متریال اجباری است!";
    }
    return errors;
  };
  const validation = () => {
    var errors = {};
    if (!ceramicProjectNameIsValid) {
      errors.ceramicProjectName = "وارد کردن نام پروژه اجباری است!";
    }
    return errors;
  };

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleDeleteItem = (itemId) => {
    const items = [...ceramicItems];
    const filteredItems = items.filter((tr) => tr.id !== itemId);
    dispatch(RsetCeramicItems(filteredItems));
  };

  const handelMaterialTable = () => {
    if (addTableIsValid) {
      const items = [...ceramicItems];
      let totalPrice =
        parseInt(ceramicProjectMaterialPrice.replaceAll(',','')) * parseInt(ceramicProjectMaterialCount);
      let item = {
        materialCode: ceramicMaterialCode,
        materialName: ceramicMaterialName,
        materialUnit: ceramicProjectMaterialUnit,
        materialCount: ceramicProjectMaterialCount,
        materialPrice: ceramicProjectMaterialPrice,
        materialTotalPrice: totalPrice ? totalPrice : 0,
        materialDate: moment(ceramicProjectMaterialDate).format(
          "jYYYY/jMM/jDD"
        ),
        id: generateRandomNumber(1000, 9999),
      };

      items.push(item);
      dispatch(RsetCeramicItems(items));
      dispatch(handleResetItem());
    } else {
      dispatch(
        RsetFormErrors(
          itemValidation({
            ceramicProjectMaterialCode,
            ceramicProjectMaterialName,
            ceramicProjectMaterialUnit,
            ceramicProjectMaterialCount,
          })
        )
      );
    }
  };

  return (
    <Container className="mt-5">
      <Form>
        <Row>
          <Form.Group as={Col} md="4" className="mb-md-3">
            <Form.Label>کد پروژه: </Form.Label>
            <NumberFormat
              dir="ltr"
              id="materialCode"
              type="number"
              className="form-control"
              value={ceramicProjectCode}
              onChange={(e) => {
                dispatch(RsetCeramicProjectCode(e.target.value));
              }}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label className="required-field">عنوان: </Form.Label>
            <Form.Control
              type="text"
              value={ceramicProjectName}
              onChange={(e) => {
                dispatch(RsetCeramicProjectName(e.target.value));
              }}
            />
            {ceramicProjectName === "" && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.ceramicProjectName}
              </p>
            )}
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group as={Col} md="3" className="mb-md-3">
            <Form.Label className="required-field">
              کد متریال / قطعه / ...{" "}
            </Form.Label>
            <NumberFormat
              dir="ltr"
              id="materialCode"
              type="text"
              maxLength={10}
              className="form-control"
              onKeyDown={(e) => {
                if(e.keyCode === 13){
                  dispatch(handleGetProWithCode(e));
                }
              }}
              value={ceramicMaterialCode}
              onChange={(e) => {
                dispatch(RsetCeramicMaterialCode(e.target.value));
              }}
              onBlur={(e) => {
                dispatch(handleGetProWithCode(e));
              }}
            />
            {!ceramicProjectMaterialCodeIsValid && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.ceramicProjectMaterialCode}
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-3">
            <Form.Label className="required-field">
              شرح / نام متریال :{" "}
            </Form.Label>
            <Form.Control
              value={ceramicMaterialName}
              onChange={(e) => {
                dispatch(RsetCeramicMaterialName(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  dispatch(RsetCeramicMaterialModalSearch(true));
                }
              }}
            />
            {!ceramicProjectMaterialNameIsValid && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.ceramicProjectMaterialName}
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="3" className="mb-4 mb-xl-0 mb-lg-2">
            <Form.Label> تاریخ: </Form.Label>
            <DatePicker
              timePicker={false}
              showTodayButton={false}
              isGregorian={false}
              value={ceramicProjectMaterialDate}
              onChange={(value) => {
                dispatch(RsetCeramicProjectMaterialDate(value));
              }}
              className="form-control"
              inputReadOnly
            />
          </Form.Group>

          <Form.Group as={Col} md="3">
            <Form.Label className="required-field">واحد شمارش: </Form.Label>
            <Select
              value={ceramicProjectMaterialUnit}
              name="softwareReqCompanyNames"
              onChange={(e) => {
                dispatch(RsetCeramicProjectMaterialUnit(e));
              }}
              placeholder="انتخاب واحد..."
              options={unitsOption}
              isSearchable={true}
            />
            {!ceramicProjectMaterialUnitIsValid && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.ceramicProjectMaterialUnit}
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="2" className="mb-3">
            <Form.Label className="required-field">تعداد: </Form.Label>
            <NumberFormat
              dir="ltr"
              id="price"
              type="text"
              className="form-control"
              value={ceramicProjectMaterialCount}
              onChange={(e) => {
                dispatch(RsetCeramicProjectMaterialCount(e.target.value));
              }}
            />
            {!ceramicProjectMaterialCountIsValid && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.ceramicProjectMaterialCount}
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} md="4" className="mb-3">
            <Form.Label className="required-field">قیمت هر واحد : </Form.Label>
            <div className="d-flex justify-content-center align-items-center">
              <NumberFormat
                dir="ltr"
                id="price"
                type="text"
                className="form-control"
                thousandSeparator=","
                value={ceramicProjectMaterialPrice}
                onChange={(e) => {
                  dispatch(RsetCeramicProjectMaterialPrice(e.target.value));
                }}
              />
              <Button className="ms-1"onClick={handelMaterialTable}>+</Button>
            </div>
          </Form.Group>
        </Row>
        {ceramicItems.length !== 0 && (
          <Table striped bordered hover responsive className="mt-5">
            <thead className="bg-secondary light-text">
              <tr>
                <th>ردیف</th>
                <th>کد کالا</th>
                <th>اسم کالا</th>
                <th>واحد</th>
                <th>تعداد</th>
                <th>قیمت هر واحد</th>
                <th>قیمت کل</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {ceramicItems.length !== 0 &&
                ceramicItems.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td className="font12">{idx + 1}</td>
                      <td className="font12">{item.materialCode}</td>
                      <td className="font12">{item.materialName}</td>
                      <td className="font12">{item.materialUnit.label}</td>
                      <td className="font12">{item.materialCount}</td>
                      <td className="font12">
                        {item.materialPrice.toLocaleString()}
                      </td>
                      <td className="font12">
                        {item.materialTotalPrice.toLocaleString()}
                      </td>
                      <td className="font12 text-center">
                        <FontAwesomeIcon
                          onClick={() => {
                            handleDeleteItem(item.id);
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
                  جمع قیمت:
                </td>
                <td className="font12">
                  {ceramicItems
                    .reduce((sum, item) => sum + item.materialTotalPrice, 0)
                    .toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        )}

        <Row>
          <Form.Group as={Col} md="12" className="mt-2 mb-4">
            <Form.Label className="mb-1">توضیحات: </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              maxLength={2000}
              name="softwareReqDescription"
              value={ceramicProjectDescription}
              onChange={(e) => {
                dispatch(RsetCeramicProjectDescription(e.target.value));
              }}
            />
          </Form.Group>
        </Row>
        <Row>
          <Col
            md="5"
            xl="4"
            className="mx-auto d-flex justify-content-between mt-4 w-50"
          >
            <Button
              variant="success"
              className="w-45 mb-3 me-1"
              onClick={(e) => {
                if (ceramicProjectNameIsValid) {
                  dispatch(handleCeramicProCalculateCost(e));
                } else {
                  dispatch(
                    RsetFormErrors(
                      validation({
                        ceramicProjectName,
                      })
                    )
                  );
                }
              }}
            >
              ثبت
            </Button>
            <Button
              variant="secondary"
              type="reset"
              className="w-45 mb-3"
              onClick={() => {
                dispatch(handleResetSubmit());
              }}
            >
              انصراف
            </Button>
          </Col>
        </Row>
      </Form>
      {ceramicMaterialModalSearch && <CeramicMaterialModalSearch />}
    </Container>
  );
};

export default CeramicProjectPrice;
