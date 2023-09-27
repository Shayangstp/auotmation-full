import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import Select from "react-select";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  RsetCheckoutReqPersonName,
  selectCheckoutReqPersonName,
  selectCheckoutReqPersonNameOption,
  RsetCheckoutReqMeliCode,
  selectCheckoutReqMeliCode,
  RsetCheckoutReqPersonalCode,
  selectCheckoutReqPersonalCode,
  RsetCheckoutReqSupervisor,
  selectCheckoutReqSupervisor,
  RsetCheckoutReqLeavingWorkDate,
  selectCheckoutReqLeavingWorkDate,
  RsetCheckoutReqLeavingWorkReason,
  selectCheckoutReqLeavingWorkReason,
  selectCheckoutReqLeavingWorkReasonOption,
  RsetCheckoutReqDepartment,
  selectCheckoutReqDepartment,
  RsetCheckoutReqCompanyName,
  selectCheckoutReqCompanyName,
  RsetCheckoutReqDescription,
  selectCheckoutReqDescription,
  handleLeavingWorkReason,
  handleUserBySearch,
  handleSubmitCheckoutReq,
  selectChcekoutSendToModal,
  RsetCheckoutSendToModal,
  selectCheckoutReqIsSubmitted,
  handleCheckoutReqAction,
  RsetCheckoutReqIsSubmitted,
  handleFormReset,

  //
  selectCheckoutReqSupervisorId,
} from "../Slices/checkoutReqSlices";

import {
  RsetFormErrors,
  selectFormErrors,
  selectUser,
  handleAllUsers,
} from "../Slices/mainSlices";

import CheckoutSendToModal from "../Modals/CheckoutReqModals/CheckoutSendToModal";

const CheckoutReqRegistration = () => {
  const dispatch = useDispatch();

  const checkoutReqPersonName = useSelector(selectCheckoutReqPersonName);
  const checkoutReqPersonNameOption = useSelector(
    selectCheckoutReqPersonNameOption
  );
  const checkoutReqMeliCode = useSelector(selectCheckoutReqMeliCode);
  const checkoutReqPersonalCode = useSelector(selectCheckoutReqPersonalCode);
  const checkoutReqSupervisor = useSelector(selectCheckoutReqSupervisor);
  const checkoutReqLeavingWorkDate = useSelector(
    selectCheckoutReqLeavingWorkDate
  );
  const checkoutReqLeavingWorkReason = useSelector(
    selectCheckoutReqLeavingWorkReason
  );
  const checkoutReqLeavingWorkReasonOption = useSelector(
    selectCheckoutReqLeavingWorkReasonOption
  );
  const checkoutReqDepartment = useSelector(selectCheckoutReqDepartment);
  const checkoutReqCompanyName = useSelector(selectCheckoutReqCompanyName);
  const checkoutReqDescription = useSelector(selectCheckoutReqDescription);
  const formErrors = useSelector(selectFormErrors);
  const checkoutSendToModal = useSelector(selectChcekoutSendToModal);
  const checkoutReqIsSubmitted = useSelector(selectCheckoutReqIsSubmitted);
  const user = useSelector(selectUser);

  //Refs
  const checkoutPersonNameRef = useRef();
  const checkoutMeliCodeRef = useRef();
  const checkoutPersonalCodeRef = useRef();
  const checkoutLeavingWorkDateRef = useRef();

  useEffect(() => {
    dispatch(handleAllUsers());
  }, [user]);

  useEffect(() => {
    dispatch(handleLeavingWorkReason());
    dispatch(handleUserBySearch());
  }, []);

  //validation
  const checkoutReqPersonNameIsValid = checkoutReqPersonName !== "";
  const checkoutReqMeliCodeIsValid = checkoutReqMeliCode !== "";
  const checkoutReqPersonalCodeIsValid = checkoutReqPersonalCode !== "";
  const checkoutReqLeavingWorkDateIsValid = checkoutReqLeavingWorkDate !== null;
  const checkoutReqLeavingWorkReasonIsValid =
    checkoutReqLeavingWorkReason !== "";

  const formIsValid =
    checkoutReqPersonNameIsValid &&
    checkoutReqMeliCodeIsValid &&
    checkoutReqPersonalCodeIsValid &&
    checkoutReqLeavingWorkDateIsValid &&
    checkoutReqLeavingWorkReasonIsValid;

  const validation = () => {
    var errors = {};
    if (!checkoutReqPersonNameIsValid) {
      errors.checkoutReqPersonName =
        "لطفا نام و نام خانوادگی را انتخاب نمایید!";
    }
    if (!checkoutReqMeliCodeIsValid) {
      errors.checkoutReqMeliCode = "لطفا کد ملی را مشخص کنید!";
    }
    if (!checkoutReqPersonalCodeIsValid) {
      errors.checkoutReqPersonalCode = "لطفا کد پرسنلی را مشخص کنید!";
    }
    if (!checkoutReqLeavingWorkDateIsValid) {
      errors.checkoutReqLeavingWorkDate = "لطفا تاریخ ترک خدمت را مشخص کنید!";
    }
    if (!checkoutReqLeavingWorkReasonIsValid) {
      errors.checkoutReqLeavingWorkReason = "بخش های مورد نیاز را ذکر فرمایید";
    }

    return errors;
  };

  const handleNextInput = (e) => {
    if (
      e.target.id === checkoutPersonNameRef.current.inputRef.id &&
      checkoutPersonNameRef.current.props.value !== ""
    ) {
      checkoutLeavingWorkDateRef.current.handleFocus();
    }

    if (e.key === "Enter") {
      if (
        e.target.id === checkoutMeliCodeRef.current.props.id &&
        checkoutMeliCodeRef.current.props.value !== ""
      ) {
        checkoutLeavingWorkDateRef.current.handleFocus();
      }
      if (
        e.target.id === checkoutPersonalCodeRef.current.props.id &&
        checkoutPersonalCodeRef.current.props.value !== ""
      ) {
        checkoutLeavingWorkDateRef.current.handleFocus();
      }
    }
  };

  return (
    <Container fluid className="mt-5">
      <section className="lightGray2-bg p-3 shadow borderRadius border border-white border-2">
        <div className="shadow p-4 mb-5 borderRadius lightGray-bg  border border-white font16">
          فرم ثبت درخواست نرم افزار
        </div>
        <Form>
          <Row>
            <Form.Group as={Col} md="3" className="mb-md-3 mb-sm-2">
              <Form.Label className="required-field">
                نام و نام خانوادگی:{" "}
              </Form.Label>
              <Select
                value={checkoutReqPersonName}
                name="checkoutReqPersonName"
                id="checkoutReqPersonName"
                ref={checkoutPersonNameRef}
                onChange={(e) => {
                  dispatch(RsetCheckoutReqPersonName(e));
                  dispatch(RsetCheckoutReqMeliCode(""));
                  dispatch(RsetCheckoutReqPersonalCode(""));
                  dispatch(RsetCheckoutReqSupervisor(""));
                  dispatch(RsetCheckoutReqDepartment(""));
                  dispatch(RsetCheckoutReqCompanyName(""));
                  dispatch(RsetCheckoutReqIsSubmitted(false));
                }}
                onBlur={(e) => {
                  dispatch(
                    handleUserBySearch({
                      id: checkoutReqPersonName.value
                        ? checkoutReqPersonName.value
                        : "null",
                      natCode: checkoutReqMeliCode
                        ? checkoutReqMeliCode
                        : "null",
                      personelId: checkoutReqPersonalCode
                        ? checkoutReqPersonalCode
                        : "null",
                    })
                  );
                  handleNextInput(e);
                }}
                placeholder="انتخاب..."
                options={checkoutReqPersonNameOption}
                isSearchable={true}
              />
              {!checkoutReqPersonNameIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.checkoutReqPersonName}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3" className="mb-md-3 mb-sm-2">
              <Form.Label className="required-field">کدملی: </Form.Label>
              <NumberFormat
                className="form-control"
                dir="ltr"
                id="meliCode"
                type="text"
                maxLength={10}
                ref={checkoutMeliCodeRef}
                value={checkoutReqMeliCode}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    dispatch(
                      handleUserBySearch({
                        id: checkoutReqPersonName.value
                          ? checkoutReqPersonName.value
                          : "null",
                        natCode: checkoutReqMeliCode
                          ? checkoutReqMeliCode
                          : "null",
                        personelId: checkoutReqPersonalCode
                          ? checkoutReqPersonalCode
                          : "null",
                      })
                    );
                  }
                  handleNextInput(e);
                }}
                onChange={(e) => {
                  dispatch(RsetCheckoutReqMeliCode(e.target.value));
                  dispatch(RsetCheckoutReqPersonName(""));
                  dispatch(RsetCheckoutReqPersonalCode(""));
                  dispatch(RsetCheckoutReqSupervisor(""));
                  dispatch(RsetCheckoutReqDepartment(""));
                  dispatch(RsetCheckoutReqCompanyName(""));
                  dispatch(RsetCheckoutReqIsSubmitted(false));
                }}
              />
              {!checkoutReqMeliCodeIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.checkoutReqMeliCode}
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} md="3" className="mb-md-3 mb-sm-2">
              <Form.Label className="required-field">کدپرسنلی: </Form.Label>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <NumberFormat
                  className="form-control"
                  dir="ltr"
                  id="personalCode"
                  type="text"
                  ref={checkoutPersonalCodeRef}
                  value={checkoutReqPersonalCode}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      dispatch(
                        handleUserBySearch({
                          id: checkoutReqPersonName.value
                            ? checkoutReqPersonName.value
                            : "null",
                          natCode: checkoutReqMeliCode
                            ? checkoutReqMeliCode
                            : "null",
                          personelId: checkoutReqPersonalCode
                            ? checkoutReqPersonalCode
                            : "null",
                        })
                      );
                    }
                    handleNextInput(e);
                  }}
                  onChange={(e) => {
                    dispatch(RsetCheckoutReqPersonalCode(e.target.value));
                    dispatch(RsetCheckoutReqMeliCode(""));
                    dispatch(RsetCheckoutReqPersonName(""));
                    dispatch(RsetCheckoutReqSupervisor(""));
                    dispatch(RsetCheckoutReqDepartment(""));
                    dispatch(RsetCheckoutReqCompanyName(""));
                    dispatch(RsetCheckoutReqIsSubmitted(false));
                  }}
                />
                <Button
                  className="ms-3"
                  onClick={(e) => {
                    dispatch(
                      handleUserBySearch({
                        id: checkoutReqPersonName.value
                          ? checkoutReqPersonName.value
                          : "null",
                        natCode: checkoutReqMeliCode
                          ? checkoutReqMeliCode
                          : "null",
                        personelId: checkoutReqPersonalCode
                          ? checkoutReqPersonalCode
                          : "null",
                      })
                    ); //handleFocus
                    if (
                      checkoutReqPersonName !== "" ||
                      checkoutReqMeliCode !== "" ||
                      checkoutReqPersonalCode !== ""
                    ) {
                      checkoutLeavingWorkDateRef.current.handleFocus();
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </div>
              {!checkoutReqPersonalCodeIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.checkoutReqPersonalCode}
                </p>
              )}
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="2" className="mb-md-3 mb-sm-2">
              <Form.Label>مدیر / سرپرست:</Form.Label>
              <Form.Control
                type="text"
                name="checkoutReqSupervisor"
                value={checkoutReqSupervisor}
                onChange={(e) => {
                  dispatch(RsetCheckoutReqSupervisor(e.target.value));
                }}
                readOnly
              />
            </Form.Group>

            <Form.Group as={Col} md="2" className="mb-md-3 mb-sm-2">
              <Form.Label className="required-field">
                تاریخ ترک خدمت:{" "}
              </Form.Label>
              <DatePicker
                className="form-control"
                timePicker={false}
                id="date"
                name="checkoutReqLeavingWorkDate"
                showTodayButton={false}
                isGregorian={false}
                ref={checkoutLeavingWorkDateRef}
                value={checkoutReqLeavingWorkDate}
                onChange={(value) => {
                  dispatch(RsetCheckoutReqLeavingWorkDate(value));
                }}
                inputReadOnly
              />
              {!checkoutReqLeavingWorkDateIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.checkoutReqLeavingWorkDate}
                </p>
              )}
            </Form.Group>

            <Form.Group as={Col} md="3" className="mb-md-3 mb-sm-2">
              <Form.Label className="required-field">علت ترک خدمت: </Form.Label>
              <Select
                value={checkoutReqLeavingWorkReason}
                name="checkoutReqLeavingWorkReason"
                onChange={(e) => {
                  dispatch(RsetCheckoutReqLeavingWorkReason(e));
                }}
                placeholder="انتخاب..."
                options={checkoutReqLeavingWorkReasonOption}
                isSearchable={true}
              />
              {!checkoutReqLeavingWorkReasonIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.checkoutReqLeavingWorkReason}
                </p>
              )}
            </Form.Group>

            <Form.Group as={Col} md="2" className="mb-md-3 mb-sm-2">
              <Form.Label>واحد:</Form.Label>
              <Form.Control
                type="text"
                name="checkoutReqDepartment"
                value={checkoutReqDepartment}
                onChange={(e) => {
                  dispatch(RsetCheckoutReqDepartment(e.target.value));
                }}
                readOnly
              />
            </Form.Group>

            <Form.Group as={Col} md="2" className="mb-md-3 mb-sm-2">
              <Form.Label>شرکت:</Form.Label>
              <Form.Control
                type="text"
                name="checkoutReqCompanyName"
                value={checkoutReqCompanyName}
                onChange={(e) => {
                  dispatch(RsetCheckoutReqCompanyName(e.target.value));
                }}
                readOnly
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="12" className="mt-5 mb-4 mb-md-3">
              <Form.Label className="mb-1">توضیحات: </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                maxLength={2000}
                name="checkoutReqDescription"
                value={checkoutReqDescription}
                // ref={materialDescription}
                onChange={(e) => {
                  dispatch(RsetCheckoutReqDescription(e.target.value));
                }}
              />
            </Form.Group>
          </Row>
          <Row>
            <Col
              md="12"
              xl="4"
              className="mx-auto d-flex justify-content-center mt-4 w-100"
            >
              <Button
                variant="success"
                className="mb-3 ms-2"
                disabled={checkoutReqIsSubmitted ? true : false}
                onClick={(e) => {
                  if (formIsValid) {
                    dispatch(handleSubmitCheckoutReq(e));
                    dispatch(RsetCheckoutSendToModal(true));
                  } else {
                    dispatch(
                      RsetFormErrors(
                        validation({
                          checkoutReqPersonName,
                          checkoutReqMeliCode,
                          checkoutReqPersonalCode,
                          checkoutReqLeavingWorkDate,
                          checkoutReqLeavingWorkReason,
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
                className=" mb-3 ms-2"
                onClick={() => {
                  dispatch(handleFormReset());
                  dispatch(RsetCheckoutReqIsSubmitted(false));
                  dispatch(RsetFormErrors(""));
                }}
              >
                ایجاد مورد جدید
              </Button>
              <Button
                variant="primary"
                type="reset"
                className=" mb-3 ms-2"
                disabled={checkoutReqIsSubmitted ? false : true}
                onClick={(e) => {
                  dispatch(handleCheckoutReqAction(e));
                  // dispatch(RsetCheckoutReqIsSubmitted(false));
                  // dispatch(handleFormReset());
                }}
              >
                ارسال به مدیران جهت بررسی
              </Button>
            </Col>
          </Row>
        </Form>
        {checkoutSendToModal && <CheckoutSendToModal />}
      </section>
    </Container>
  );
};

export default CheckoutReqRegistration;
