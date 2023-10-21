import React, { Fragment, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import {
  selectFormErrors,
  RsetFormErrors,
  selectUserName,
  RsetUserName,
  selectPassword,
  RsetPassword,
} from "../Slices/mainSlices";
import { context } from "../context/context";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  selectChangePassLevel,
  selectChangePassUserId,
} from "../Slices/changePassSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  selectShowChangePassCom,
  RsetShowChangePassCom,
} from "../Slices/changePassSlice";

const Test3 = () => {
  const dispatch = useDispatch();
  const formErrors = useSelector(selectFormErrors);
  const userName = useSelector(selectUserName);
  const password = useSelector(selectPassword);
  const changePassLevel = useSelector(selectChangePassLevel);
  const changePassUserId = useSelector(selectChangePassUserId);

  const accountContext = useContext(context);
  const {
    personalCode,
    setPersonalCode,
    birthCertificateNumber,
    setBirthCertificateNumber,
    insuranceNumber,
    setInsuranceNumber,
    birthday,
    setBirthday,
    phoneNumber,
    setPhoneNumber,
    confirmPassword,
    setConfirmPassword,

    smsCode,
    setSmsCode,
    formatDisplayTime,
    timerMinutes,
    timerSeconds,
    toggleCountDown,
    handleSendSmsCode,

    handleCheckForResetPass,
  } = accountContext;

  const [passType, setPassType] = useState("password");
  const handlePassType = () => {
    setPassType((passType) => (passType === "password" ? "text" : "password"));
  };

  var pass = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;

  const validation = () => {
    var errors = {};
    const userNameValue = userName.replaceAll("-", "").replaceAll(" ", "");
    const personalCodeValue = personalCode
      .replaceAll("-", "")
      .replaceAll(" ", "");
    const phoneNumberValue = phoneNumber
      .replaceAll("-", "")
      .replaceAll(" ", "");
    if (!userName) {
      errors.userName = "border border-danger";
    } else if (userNameValue.length < 10) {
      errors.userNameChar = "کد ملی باید 10 کاراکتر باشد!";
    }
    if (!personalCode) {
      errors.personalCode = "border border-danger";
    } else if (personalCodeValue.length < 10) {
      errors.personalCodeChar = "کد پرسنلی باید 7 کاراکتر باشد!";
    }
    if (!birthCertificateNumber) {
      errors.birthCertificateNumber = "border border-danger";
    }
    if (!insuranceNumber) {
      errors.insuranceNumber = "border border-danger";
    }
    if (!birthday) {
      errors.birthday = "border border-danger";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "border border-danger";
    } else if (phoneNumberValue.length < 10) {
      errors.phoneNumber = "شماره موبایل باید 11 کاراکتر باشد!";
    }
    if (!password) {
      errors.password = "border border-danger";
    } else if (!pass.test(password)) {
      errors.passwordChar =
        "رمز عبور باید شامل حروف و عدد و حداقل 6 کاراکتر باشد!";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "border border-danger";
    } else if (password !== confirmPassword) {
      errors.confirmPasswordChar = "رمزهای وارد شده یکسان نیستند!";
    }
    return errors;
  };
  const handleUserValuesForResetPass = (e) => {
    e.preventDefault();
    const userNameValue = userName.replaceAll("-", "").replaceAll(" ", "");
    const personalCodeValue = personalCode
      .replaceAll("-", "")
      .replaceAll(" ", "");
    const phoneNumberValue = phoneNumber
      .replaceAll("-", "")
      .replaceAll(" ", "");
    if (
      userNameValue !== "" &&
      userNameValue.length === 10 &&
      personalCodeValue !== "" &&
      personalCodeValue.length === 7 &&
      birthCertificateNumber !== "" &&
      insuranceNumber !== "" &&
      birthday !== null &&
      phoneNumberValue.length === 11 &&
      phoneNumber !== "" &&
      password !== "" &&
      pass.test(password) &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      const userValues = {
        natcode: userNameValue,
        personelcode: personalCodeValue,
        sejeld: birthCertificateNumber,
        bimeh: insuranceNumber,
        birthdate: birthday,
        phone: phoneNumberValue,
        password: password,
      };
      handleCheckForResetPass(userValues);
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            userName: userName,
            personalCode: personalCode,
            birthCertificateNumber: birthCertificateNumber,
            insuranceNumber: insuranceNumber,
            birthday: birthday,
            phoneNumber: phoneNumber,
            password: password,
            confirmPassword: confirmPassword,
          })
        )
      );
    }
  };

  const timerColor = () => {
    if (timerMinutes === 1 && timerSeconds >= 0) {
      return "text-success";
    } else if (timerMinutes === 0 && timerSeconds >= 30) {
      return "text-warning";
    } else if (timerMinutes === 0 && timerSeconds < 30) {
      return "text-danger";
    }
  };

  const codeValidation = () => {
    var errors = {};
    if (!smsCode) {
      errors.smsCode = "واردکردن کد اجباری است!";
    }
    return errors;
  };

  const sendCode = (e) => {
    e.preventDefault();
    if (smsCode !== "") {
      handleSendSmsCode(smsCode, 1, "resetPass");
    } else {
      dispatch(
        RsetFormErrors(
          codeValidation({
            smsCode: smsCode,
          })
        )
      );
    }
  };

  useEffect(() => {
    if (changePassLevel === 2) {
      toggleCountDown(2);
    }
  }, [changePassLevel]);

  return (
    <div>
      <Row className="d-flex justify-content-center w-100">
        <Form.Group as={Col} md="5" className="mb-4">
          <NumberFormat
            type="text"
            value={userName}
            name="userName"
            id="registerUserName"
            onChange={(e) => {
              dispatch(RsetUserName(e.target.value));
            }}
            format="# # # # # # # # # #"
            mask="-"
            dir="ltr"
            placeholder="کدملی"
            className={`text-white ${!userName ? formErrors.userName : ""}`}
          />
          {!userName ||
          personalCode.replaceAll("-", "").replaceAll(" ", "").length < 7 ? (
            <p className="font10 text-danger mb-0 mt-1">
              {formErrors.userNameChar}
            </p>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} md="5" className="mb-4">
          <NumberFormat
            type="text"
            value={personalCode}
            name="personalCode"
            id="registerPersonalCode"
            onChange={(e) => {
              setPersonalCode(e.target.value);
            }}
            format="# # # # # # #"
            mask="-"
            dir="ltr"
            placeholder="کدپرسنلی"
            className={`${!personalCode ? formErrors.personalCode : ""}`}
          />
          {!personalCode ||
          personalCode.replaceAll("-", "").replaceAll(" ", "").length < 7 ? (
            <p className="font10 text-danger mb-0 mt-1">
              {formErrors.personalCodeChar}
            </p>
          ) : null}
        </Form.Group>
      </Row>
      <Row className="d-flex justify-content-center w-100">
        <Form.Group as={Col} md="5" className="mb-4">
          <NumberFormat
            type="text"
            value={birthCertificateNumber}
            name="birthCertificateNumber"
            id="registerBirthCertificateNumber"
            onChange={(e) => {
              setBirthCertificateNumber(e.target.value);
            }}
            maxLength="10"
            dir="ltr"
            placeholder="شماره شناسنامه"
            className={`${
              !birthCertificateNumber ? formErrors.birthCertificateNumber : ""
            }`}
          />
        </Form.Group>
        <Form.Group as={Col} md="5" className="mb-4">
          <NumberFormat
            type="text"
            value={insuranceNumber}
            name="insuranceNumber"
            id=""
            onChange={(e) => {
              setInsuranceNumber(e.target.value);
            }}
            dir="ltr"
            placeholder="شماره بیمه"
            className={`${!insuranceNumber ? formErrors.insuranceNumber : ""}`}
          />
        </Form.Group>
      </Row>
      <Row className="d-flex justify-content-center w-100">
        <Form.Group as={Col} md="5" className="mb-4">
          <DatePicker
            inputReadOnly
            name="birthday"
            isGregorian={false}
            timePicker={false}
            showTodayButton={false}
            inputFormat="YYYY-MM-DD"
            inputJalaaliFormat="jYYYY/jMM/jDD"
            value={birthday}
            className={`form-control ${!birthday ? formErrors.birthday : ""}`}
            onChange={(e) => {
              setBirthday(e);
            }}
            placeholder="تاریخ تولد"
          />
        </Form.Group>
        <Form.Group as={Col} md="5" className="mb-4">
          <NumberFormat
            type="text"
            value={phoneNumber}
            name="phoneNumber"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            format="# # # # # # # # # # #"
            mask="-"
            dir="ltr"
            placeholder="شماره موبایل"
            className={`${!phoneNumber ? formErrors.phoneNumber : ""}`}
          />
          {!phoneNumber ||
          phoneNumber.replaceAll("-", "").replaceAll(" ", "").length < 11 ? (
            <p className="font10 text-danger mb-0 mt-1">
              {formErrors.phoneNumberChar}
            </p>
          ) : null}
        </Form.Group>
      </Row>
      <Row className="d-flex justify-content-center w-100">
        <Form.Group as={Col} md="5" className="mb-4 position-relative">
          <Form.Control
            type={passType}
            dir="ltr"
            id="passInput"
            autoComplete="new-password"
            value={password}
            name="password"
            onChange={(e) => {
              dispatch(RsetPassword(e.target.value));
            }}
            placeholder="رمز عبور جدید"
            className={`${!password ? formErrors.password : ""}`}
          />
          {password ? (
            <FontAwesomeIcon
              icon={passType === "text" ? faEye : faEyeSlash}
              className={`position-absolute cursorPointer start-0 top-0 eyeInputPass text-white ms-4`}
              onClick={handlePassType}
            />
          ) : null}
          {!password || !pass.test(password) ? (
            <p className="font10 text-danger mb-0 mt-1">
              {formErrors.passwordChar}
            </p>
          ) : null}
        </Form.Group>
        <Form.Group as={Col} md="5" className="mb-4">
          <Form.Control
            type={passType}
            dir="ltr"
            value={confirmPassword}
            name="confirmPassword"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="تکرار رمز عبور جدید"
            className={`${!confirmPassword ? formErrors.confirmPassword : ""}`}
          />
          {!confirmPassword || confirmPassword !== password ? (
            <p className="font10 text-danger mb-0 mt-1">
              {formErrors.confirmPasswordChar}
            </p>
          ) : null}
        </Form.Group>
        <Row className="d-flex justify-content-center w-100">
          <Form.Group
            as={Col}
            md="10"
            className="mb-4 forgetPass cursorPointer"
          >
            <div
              className="font12"
              onClick={() => {
                dispatch(RsetShowChangePassCom(false));
                dispatch(RsetUserName(""));
                dispatch(RsetPassword(""));
                dispatch(RsetFormErrors(""));
              }}
            >
              ورود به سامانه
            </div>
          </Form.Group>
        </Row>
        <Row className="d-flex justify-content-center w-100">
          <Form.Group
            as={Col}
            xs="12"
            md="10"
            lg="10"
            className="mb-4 forgetPass cursorPointer"
          >
            <button
              type="button"
              className="btn w-100 font12 text-white border-0 buttonDesignPrimary focus-ring"
              onClick={(e) => {
                handleUserValuesForResetPass(e);
              }}
            >
              بازیابی رمز عبور
            </button>
          </Form.Group>
        </Row>
        <Row className="d-flex justify-content-center w-100">
          <Form.Group
            as={Col}
            xs="10"
            md="10"
            className="mb-4 forgetPass cursorPointer"
          >
            <a
              href={window.location.origin + "/files/Automation.pdf"}
              download
              className="text-white font12 mt-3 text-decoration mb-5 text-start"
            >
              دانلود فایل راهنمای استفاده از اتوماسیون
            </a>
          </Form.Group>
        </Row>
      </Row>
    </div>
  );
};
export default Test3;

//0022549013   asd123
