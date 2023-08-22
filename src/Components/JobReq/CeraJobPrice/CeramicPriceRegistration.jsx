import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import {
  selectCeramicMaterialCode,
  RsetCeramicMaterialCode,
  selectCeramicMaterialName,
  RsetCeramicMaterialName,
  selectCeramicMaterialFromDate,
  RsetCeramicMaterialFromDate,
  selectCeramicMaterialToDate,
  RsetCeramicMaterialToDate,
  selectCeramicMaterialPrice,
  RsetCeramicMaterialPrice,
  selectCeramicMaterialDescription,
  RsetCeramicMaterialDescription,
  selectCeramicMaterialModalSearch,
  RsetCeramicMaterialModalSearch,
  selectCeramicMaterialModalHistory,
  RsetCeramicMaterialModalHistory,
  selectCeramicSelectedMatrial,
  selectCeramicAddMaterialList,
  handleCostSubmit,
  handleReset,
  handleGetProWithCode,
  selectCeramicAddMaterialName,
  RsetCeramicAddMaterialName
} from "../../Slices/ceramicPriceSlices";
import CeramicMaterialModalSearch from "../../Modals/JobReqsModals/CeraPriceModals/CeramicMaterialModalSearch";
import CeramicMaterialModalHistory from "../../Modals/JobReqsModals/CeraPriceModals/CeramicMaterialModalHistory";
import { RsetFormErrors, selectFormErrors } from "../../Slices/mainSlices";

const CeramicPriceRegistration = () => {

  const dispatch = useDispatch();
  const ceramicMaterialCode = useSelector(selectCeramicMaterialCode);
  const ceramicMaterialName = useSelector(selectCeramicMaterialName);
  const ceramicMaterialFromDate = useSelector(selectCeramicMaterialFromDate);
  const ceramicMaterialToDate = useSelector(selectCeramicMaterialToDate);
  const ceramicMaterialPrice = useSelector(selectCeramicMaterialPrice);
  const ceramicMaterialDescription = useSelector(selectCeramicMaterialDescription);
  const ceramicMaterialModalSearch = useSelector(selectCeramicMaterialModalSearch);
  const ceramicMaterialModalHistory = useSelector(selectCeramicMaterialModalHistory);
  const ceramicSelectedMatrial = useSelector(selectCeramicSelectedMatrial);
  const ceramicAddMaterialList = useSelector(selectCeramicAddMaterialList);
  const  ceramicAddMaterialName = useSelector(selectCeramicAddMaterialName);
  const formErrors = useSelector(selectFormErrors);

  useEffect(() => {
    handleAddMaterialName();
  }, [ceramicMaterialCode]);

  const materialCode = useRef(null);
  const materialName = useRef(null);
  const materialFromDate = useRef(null);
  const materialToDate = useRef(null);
  const materialPrice = useRef(null);
  const materialDescription = useRef(null);

  const dayLimitation = moment(ceramicMaterialFromDate).subtract(1, "Day");

  const ceramicMaterialCodeIsValid = ceramicMaterialCode !== "";

  const ceramicMaterialToDateIsValid =
    ceramicMaterialToDate !== undefined && ceramicMaterialToDate !== null;
  const ceramicMaterialPriceIsValid = ceramicMaterialPrice !== "";

  const codeNotFound =
    ceramicMaterialCode !== "" &&
    ceramicMaterialName === "" &&
    ceramicMaterialCode.length === 10;

  const formIsValid =
    ceramicMaterialCodeIsValid &&
    ceramicMaterialToDateIsValid &&
    ceramicMaterialPriceIsValid;

  const validation = () => {
    var errors = {};
    if (!ceramicMaterialCodeIsValid) {
      errors.ceramicMaterialCode =
        "واردکردن کد قطعه / متریال / ... اجباری است!";
    }
    if (!ceramicMaterialToDateIsValid) {
      errors.ceramicMaterialToDate = "وارد کردن تاریخ اجباری است!";
    }
    if (!ceramicMaterialPriceIsValid) {
      errors.ceramicMaterialPrice = "وارد کردن قیمت اجباری است!";
    }

    return errors;
  };

  //next input handle
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.id === materialCode.current.props.id) {
        materialFromDate.current.input.focus();
      }
      if (e.target.id === materialPrice.current.id) {
        materialDescription.current.focus();
      }
    }
  };

  const handleFocusToDate = () => {
    if (materialToDate.current && materialToDate.current.input.value !== "") {
      materialPrice.current.focus();
    }
  };

  const handleAddMaterialName = () => {
    if (ceramicMaterialCode !== "" && ceramicMaterialCode.length === 10) {
      let filterCode = ceramicAddMaterialList.filter(
        (item) => item.ItemCode === ceramicMaterialCode
      );
      if (filterCode.length !== 0) {
        let materialName = filterCode[0].ItemName;
        if (materialName) {
          dispatch(RsetCeramicMaterialName(materialName));
        }
      } else {
        dispatch(RsetCeramicMaterialName(""));
      }
    }
  };

  const handleSubmit = (e) => {
    if (formIsValid) {
      dispatch(handleCostSubmit(e));
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            ceramicMaterialCodeIsValid,
            ceramicMaterialToDateIsValid,
            ceramicMaterialPriceIsValid,
          })
        )
      );
    }
  };

  return (
    <Container className="mt-5">
      <Form>
        <div>
          <Row>
            <Form.Group as={Col} md="4" className="mb-md-3">
              <Form.Label className="required-field">
                کد متریال / قطعه / ...{" "}
              </Form.Label>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <NumberFormat
                  dir="ltr"
                  id="materialCode"
                  type="text"
                  maxLength={10}
                  ref={materialCode}
                  className="form-control"
                  value={ceramicMaterialCode}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      dispatch(handleGetProWithCode(e));
                    }
                  }}
                  onChange={(e) => {
                    dispatch(RsetCeramicMaterialCode(e.target.value));
                  }}
                  onBlur={(e) => {
                    dispatch(handleGetProWithCode(e));
                  }}
                />
                <Button
                  title="جست و جوی قطعه"
                  className="ms-1"
                  onClick={() => {
                    dispatch(RsetCeramicMaterialModalSearch(true));
                  }}
                >
                  ...
                </Button>
              </div>
              {!ceramicMaterialCodeIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.ceramicMaterialCode}
                </p>
              )}
              {ceramicMaterialCode !== "" &&
                document.activeElement !== materialCode.current &&
                ceramicMaterialCode.length < 5 && (
                  <p className="font12 text-danger mb-0 mt-1">
                    وارد کردن حداقل پنج کارکتر اجباری است!
                  </p>
                )}
              {codeNotFound && (
                <p className="font12 text-danger mb-0 mt-1">
                  کد مورد نظر یافت نشد!
                </p>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              md="1"
              sm="2"
              className="mt-4 mt6"
            ></Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="3" className="mb-3">
              <Form.Label>شرح / نام متریال : </Form.Label>
              <Form.Control
                readOnly
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
            </Form.Group>
            <Form.Group as={Col} md="3" className="mb-3">
              <Form.Label className="required-field">از تاریخ: </Form.Label>
              <DatePicker
                timePicker={false}
                id="fromDate"
                showTodayButton={false}
                isGregorian={false}
                ref={materialFromDate}
                // onKeyDown={handleKeyDown}
                value={
                  ceramicMaterialFromDate ? ceramicMaterialFromDate : moment()
                }
                onChange={(value) => {
                  dispatch(RsetCeramicMaterialFromDate(value));
                }}
                className="form-control"
                inputReadOnly
              />
            </Form.Group>
            <Form.Group as={Col} md="3" className="mb-3">
              <Form.Label className="required-field">تا تاریخ: </Form.Label>
              <DatePicker
                timePicker={false}
                showTodayButton={false}
                id="toDate"
                isGregorian={false}
                ref={materialToDate}
                min={dayLimitation}
                // onKeyDown={handleKeyDown}
                //hamon roz ok nist
                value={ceramicMaterialToDate}
                onChange={(value) => {
                  dispatch(RsetCeramicMaterialToDate(value));
                  handleFocusToDate();
                }}
                className="form-control"
                inputReadOnly
              />
              {!ceramicMaterialToDateIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.ceramicMaterialToDate}
                </p>
              )}
            </Form.Group>

            <Form.Group as={Col} md="3" className="mb-3">
              <Form.Label className="required-field">قیمت: </Form.Label>
              <NumberFormat
                dir="ltr"
                id="price"
                type="text"
                className="form-control"
                // ref={materialPrice}
                getInputRef={materialPrice}
                onKeyDown={(e) => handleKeyDown(e)}
                thousandSeparator=","
                value={ceramicMaterialPrice}
                onChange={(e) => {
                  dispatch(RsetCeramicMaterialPrice(e.target.value));
                }}
              />
              {!ceramicMaterialPriceIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.ceramicMaterialPrice}
                </p>
              )}
            </Form.Group>
          </Row>
        </div>
        <Row className="mt-5">
          <Form.Group as={Col}></Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md="12" className="mt-2 mb-4">
            <Form.Label className="mb-1">توضیحات: </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              maxLength={2000}
              name="softwareReqDescription"
              value={ceramicMaterialDescription}
              ref={materialDescription}
              onChange={(e) => {
                dispatch(RsetCeramicMaterialDescription(e.target.value));
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
                handleSubmit(e);
              }}
            >
              ثبت قیمت
            </Button>
            <Button
              variant="primary"
              type="reset"
              size="small"
              className="w-45 mb-3  me-1 text-white"
              disabled={ceramicMaterialCode.length !== 10 ? true : false}
              onClick={() => {
                dispatch(RsetCeramicMaterialModalHistory(true));
              }}
            >
              سوابق قبلی
            </Button>
            <Button
              variant="secondary"
              type="reset"
              className="w-45 mb-3"
              onClick={() => {
                dispatch(handleReset());
              }}
            >
              انصراف
            </Button>
          </Col>
        </Row>
      </Form>
      {ceramicMaterialModalSearch && <CeramicMaterialModalSearch />}
      {ceramicMaterialModalHistory && <CeramicMaterialModalHistory />}
    </Container>
  );
};

export default CeramicPriceRegistration;
