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

import {
  selectShowChangePassCom,
  RsetShowChangePassCom,
} from "../Slices/changePassSlice";
import ResetPassword from "./ResetPassword";

const Test2 = () => {
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

    handleCheckForResetPass,
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
      errors.userName = "border border-danger";
    }
    if (!password) {
      errors.password = "border border-danger";
    }
    return errors;
  };
  const forgetPasswordvalidation = () => {
    var errors = {};
    if (!userName) {
      errors.userName = "border border-danger";
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
    <div>
      {loading ? (
        <Sugar />
      ) : (
        <section className="min-vh-100 vw-100 d-flex justify-content-center align-items-center  login-back-img inputDesignPrimary">
          <div className="res-main mt-5">
            <div className="row">
              <div className="col-12 mb-5">
                <div className="d-flex login-main-img img-fluid shadow-lg borderRadius border border-secondary h-100">
                  <div className="w-100">
                    <Form
                      onKeyDown={(e) => {
                        console.log(e.keyCode === 13);
                        if (e.keyCode === 13 || e.which === 13) {
                          submitFormBtn(e);
                        }
                      }}
                    >
                      <Row className="mt-5">
                        {!showChangePassCom ? (
                          <Col
                            md="12"
                            className="mb-5 ms-5 d-flex flex-column w-75 justify-content-center align-items-center"
                          >
                            {/* title */}
                            <div className="text-center text-white">
                              <h1 className="font15 fw-bold headersPhoneFontSize lh-base mb-5">
                                سامانه اتوماسیون گروه صنعتی شیشه کاوه
                              </h1>
                            </div>
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4"
                            >
                              <button
                                type="button"
                                className="btn w-100 text-white border border-secondary borderRadius py-3 sso font12"
                              >
                                <span>
                                  <img
                                    src="../../svg/google.svg"
                                    alt=""
                                    className="me-2"
                                  />
                                </span>
                                ورود با اکانت گوگل{" "}
                              </button>
                            </Form.Group>
                            {/*  or  */}
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4 d-flex align-items-center justify-content-center"
                            >
                              <div className="orBorder mb-4 "></div>
                              <p className="text-white mx-4">یا</p>
                              <div className="orBorder mb-4"></div>
                            </Form.Group>
                            {/* userName */}
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4"
                            >
                              <Form.Control
                                placeholder="نام کاربری / کدملی"
                                type="text"
                                dir="ltr"
                                value={userName}
                                name="userName"
                                className={`text-white ${
                                  !userName ? formErrors.userName : ""
                                }`}
                                onChange={(e) => {
                                  dispatch(RsetUserName(e.target.value));
                                }}
                                ref={userNameRef}
                              />
                            </Form.Group>
                            {/* pass */}
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4"
                            >
                              <div className="position-relative">
                                <Form.Control
                                  className={`${
                                    !password ? formErrors.password : ""
                                  } `}
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
                                    icon={
                                      passType === "text" ? faEye : faEyeSlash
                                    }
                                    className={`position-absolute cursorPointer start-0 top-0 eyeInputPass text-white`}
                                    onClick={handlePassType}
                                  />
                                ) : null}
                              </div>
                            </Form.Group>
                            {/* forgetPass */}
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4 forgetPass cursorPointer"
                            >
                              <div
                                className="font12"
                                onClick={() => {
                                  dispatch(RsetShowChangePassCom(true));
                                  dispatch(RsetUserName(""));
                                  dispatch(RsetPassword(""));
                                  dispatch(RsetFormErrors(""));
                                }}
                              >
                                فراموشی رمز عبور
                              </div>
                            </Form.Group>
                            {/* button */}
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4"
                            >
                              <button
                                type="button"
                                className="btn w-100 text-white border-0 buttonDesignPrimary focus-ring"
                                onClick={(e) => {
                                  submitFormBtn(e);
                                }}
                              >
                                ورود
                              </button>
                            </Form.Group>
                            {/* pdf */}
                            <Form.Group
                              as={Col}
                              xs="12"
                              md="12"
                              lg="10"
                              xl="8"
                              className="mb-4"
                            >
                              <a
                                href={
                                  window.location.origin +
                                  "/files/Automation.pdf"
                                }
                                download
                                className="text-white font12 mt-3 text-decoration mb-5 text-start"
                              >
                                دانلود فایل راهنمای استفاده از اتوماسیون
                              </a>
                            </Form.Group>
                          </Col>
                        ) : (
                          <div className="mb-5 mt-5 d-flex flex-column align-items-center justify-content-center">
                            <div className="text-white text-center mb-4">
                              برای بازیابی رمز عبور لطفا اطلاعات زیر را تکمیل
                              کنید
                            </div>
                            <Row className="d-flex justify-content-center w-100">
                              <ResetPassword />
                            </Row>
                          </div>
                        )}
                      </Row>
                    </Form>
                  </div>
                  <div className="ms-0 mt-5 w-25 d-none d-lg-flex align-items-end justify-content-end">
                    <img
                      className="img-fluid align-items-end justify-content-end w-75"
                      src="../../images/logo.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Test2;
