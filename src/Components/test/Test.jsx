import React, { useContext, useState, useEffect, Fragment } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import momentJalali from "moment-jalaali";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSpinner,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { rootContext } from "../context/rootContext";
import { context } from "../context/context";
import { useDispatch, useSelector } from "react-redux";
import { Sugar } from "react-preloaders";
import {
  selectFormErrors,
  RsetFormErrors,
  selectUserName,
  selectPassword,
  RsetUserName,
  RsetPassword,
  handleLogin,
  selectLoggedIn,
  RsetUser,
  RsetLoggedIn,
  selectLoading,
} from "./../Slices/mainSlices";

import { useHistory } from "react-router-dom";
import Particles from "react-tsparticles";

import {
  selectShowChangePassCom,
  RsetShowChangePassCom,
} from "../Slices/changePassSlice";
import ResetPassword from "../Account/ResetPassword";

const Test = () => {
  const loading = useSelector(selectLoading);
  const history = useHistory();
  const userName = useSelector(selectUserName);
  const password = useSelector(selectPassword);
  const loggedIn = useSelector(selectLoggedIn);
  const formErrors = useSelector(selectFormErrors);

  const showChangePassCom = useSelector(selectShowChangePassCom);

  useEffect(() => {
    if (loggedIn === true) {
      history.replace("/Home");
    }
  }, [loggedIn]);
  const dispatch = useDispatch();
  const mainContext = useContext(rootContext);
  const {
    accountMode,
    setAccountMode,
    handleGetCompanies,
    companies,
    handleGetCoDepartments,
    coDepartments,
    setLoading,
  } = mainContext;
  const accountContext = useContext(context);
  const {
    position,
    setPosition,
    positionRef,
    positionDisabled,
    personalCode,
    setPersonalCode,
    personalCodeRef,
    personalCodeDisabled,
    personalCodeValidationClass,
    //userName,
    //setUserName,
    userNameRef,
    //password,
    //setPassword,
    passwordRef,
    passwordDisabled,
    gender,
    setGender,
    genderRef,
    genderDisabled,
    fName,
    setFName,
    firstNameRef,
    fNameDisabled,
    lName,
    setLName,
    lastNameRef,
    lNameDisabled,
    userNameDisabled,
    userNameValidationClass,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordRef,
    confirmPasswordDisabled,
    birthday,
    setBirthday,
    birthdayRef,
    birthdayDisabled,
    email,
    setEmail,
    emailRef,
    emailDisabled,
    phoneNumber,
    setPhoneNumber,
    phoneNumberRef,
    phoneNumberDisabled,
    phoneNumberValidationClass,
    localPhoneNumber,
    setLocalPhoneNumber,
    localPhoneRef,
    localPhoneNumberDisabled,
    localPhoneValidationClass,
    location,
    setLocation,
    locationRef,
    locationDisabled,
    company,
    setCompany,
    companyRef,
    companyDisabled,
    deps,
    department,
    setDepartment,
    departmentRef,
    departmentDisabled,
    supervisor,
    setSupervisor,
    supervisorRef,
    supervisorDisabled,
    handleProfileUpload,
    avatarDisabled,
    registerDisabled,
    handleRegister,
    verifyInfo,
    setVerifyInfo,
    verifyInfoDisabled,
    handleCheckUserRegister,

    handleSupervisorsByCoDep,
    supervisorsByCoDepSelect,

    birthCertificateNumber,
    setBirthCertificateNumber,
    birthCertificateNumberRef,
    birthCertificateNumberDisabled,
    birthCertificateNumberValidationClass,
    insuranceNumber,
    setInsuranceNumber,
    insuranceNumberRef,
    insuranceNumberDisabled,
    insuranceNumberValidationClass,
    bankAccountNumber,
    setBankAccountNumber,
    bankAccountNumberRef,
    bankAccountNumberDisabled,
    bankAccountNumberValidationClass,
  } = accountContext;
  useEffect(() => {
    localStorage.clear();
    dispatch(RsetUser({}));
    dispatch(RsetLoggedIn(false));
  }, []);
  useEffect(() => {
    if (accountMode !== "login") {
      handleGetCompanies();
    }
  }, [accountMode]);
  const toggleAccountMode = () => {
    var newAccountMode = accountMode === "login" ? "signup" : "login";
    setAccountMode(newAccountMode);
    dispatch(RsetUserName(""));
    dispatch(RsetPassword(""));
  };
  const [passType, setPassType] = useState("password");
  const handlePassType = () => {
    setPassType((passType) => (passType === "password" ? "text" : "password"));
  };
  const genders = [
    { value: 0, label: "آقا" },
    { value: 1, label: "خانم" },
  ];
  const positions = [
    { value: 1, label: "پرسنل" },
    { value: 2, label: "سرپرست" },
    { value: 3, label: "مدیر" },
  ];
  const locationsSelect = [
    { value: 1, label: "دفترمرکزی" },
    { value: 2, label: "کارخانه" },
  ];

  const validation = () => {
    var errors = {};
    if (!userName) {
      errors.userName = "واردکردن کد ملی اجباری است!";
    }
    if (!password) {
      errors.password = "واردکردن رمز عبور اجباری است!";
    }
    return errors;
  };
  const submitFormBtn = (e) => {
    e.preventDefault();
    if (userName !== "" && password !== "") {
      dispatch(handleLogin(e));
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            userName: userName,
            password: password,
          })
        )
      );
    }
  };

  const registerValidation = () => {
    var errors = {};
    var email =
      /^([a-zA-Z0-9_\.\-\+]{3,})+\@(([a-zA-Z0-9\-]{3,})+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!email) {
      errors.email = "واردکردن ایمیل اجباری است!";
    } else if (!email.test(email)) {
      errors.email = "فرمت ایمیل معتبر نمی باشد!";
    }
    return errors;
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    var email =
      /^([a-zA-Z0-9_\.\-\+]{3,})+\@(([a-zA-Z0-9\-]{3,})+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email !== "" && !email.test(email)) {
      dispatch(handleRegister(e));
    } else {
      dispatch(
        RsetFormErrors(
          registerValidation({
            email: email,
          })
        )
      );
    }
  };

  return (
    <section className="min-vh-100 vw-100 vh-100 position-absolute left-0 right-0 top-0 inputDesignPrimary ">
      <Container
        fluid
        className="d-flex min-vh-100 justify-content-center align-items-center login-main-img"
      >
        <section className="d-flex border border-1 border-secondary login-size p-2 borderRadius bg-dark shadow-lg">
          <div className="w-100 d-flex login-bg borderRadius">
            <div className="d-flex justify-content-end me-5 align-items-start mt-3 text-white w-100 borderRadius">
              <Form>
                <Row className="d-flex flex-column">
                  <Col md="12" className="px-0 mb-4">
                    <div className="text-center text-white">
                      <img
                        className="d-none d-md-inline font12"
                        src="../../images/kavehLogo4.png"
                        style={{
                          width: "200px",
                          height: "200px",
                          filter: "invert(100%)",
                        }}
                      />
                      <h1 className="font25 fw-bold headersPhoneFontSize lh-base">
                        سامانه اتوماسیون گروه صنعتی شیشه کاوه
                      </h1>
                    </div>
                  </Col>
                  <Col className="mt-4">
                    <Form.Group className="mb-4">
                      <Form.Control
                        placeholder="نام کاربری / کدملی"
                        type="text"
                        dir="ltr"
                        value={userName}
                        name="userName"
                        className="text-white"
                        onChange={(e) => {
                          dispatch(RsetUserName(e.target.value));
                        }}
                        ref={userNameRef}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <div className="position-relative">
                        <Form.Control
                          // className="p-5"
                          autocomplete="off"
                          dir="ltr"
                          id="passInput"
                          placeholder="رمزعبور"
                          type={passType}
                          value={password}
                          name="password"
                          onChange={(e) => {
                            dispatch(RsetPassword(e.target.value));
                          }}
                          ref={passwordRef}
                        />
                        {password ? (
                          <FontAwesomeIcon
                            icon={passType === "text" ? faEye : faEyeSlash}
                            className={`position-absolute cursorPointer start-0 top-0 eyeInputPass`}
                            onClick={handlePassType}
                          />
                        ) : null}
                      </div>
                    </Form.Group>
                    <div
                      className="cursorPointer mb-3 forgetPass"
                      // onClick={() => {
                      //   dispatch(RsetShowChangePassCom(true));
                      // }}
                    >
                      فراموشی رمز عبور
                    </div>
                    <button
                      type="button"
                      className="btn w-100 text-white border-0 buttonDesignPrimary"
                      onClick={(e) => {
                        submitFormBtn(e);
                      }}
                    >
                      ورود
                    </button>
                  </Col>
                  <a
                    href={window.location.origin + "/files/Automation.pdf"}
                    download
                    className="text-white font12 mt-3 text-decoration"
                  >
                    دانلود فایل راهنمای استفاده از اتوماسیون
                  </a>
                </Row>
              </Form>
            </div>
            <div className="d-flex justify-content-end align-items-center  text-white w-100 borderRadius p-4 h-100">
              <div className="h-100 w-75 login-main-img-sub borderRadius shadow"></div>
            </div>
          </div>
        </section>
      </Container>
    </section>
  );
};

export default Test;
