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
    <div>
      {loading ? (
        <Sugar />
      ) : (
        <section className="min-vh-100 vw-100 vh-100 position-absolute left-0 right-0 top-0 inputDesignPrimary">
          <Container
            fluid
            className="d-flex min-vh-100 justify-content-center align-items-center login-main-img"
          >
            <section className="d-flex border border-1 border-secondary borderRadius bg-dark  mt-5 mb-5 p-2">
              <div
                className={`w-100 h-100 d-flex login-bg borderRadius login-padding `}
              >
                <div className="d-flex justify-content-center align-items-center text-white w-100 borderRadius ">
                  <Form>
                    <Row className="d-flex flex-column mb-4 ms-0 md-ms-5">
                      <Col md="12" className="px-0 mb-4">
                        <div className="text-center text-white">
                          <img
                            className="font12 img-fluid"
                            src="../../images/kaveh_Logo.png"
                            style={{
                              filter: "invert(100%)",
                            }}
                          />
                          <h1 className="font25 fw-bold headersPhoneFontSize lh-base ">
                            سامانه اتوماسیون گروه صنعتی شیشه کاوه
                          </h1>
                        </div>
                      </Col>
                      <Col className="mt-4">
                        {!showChangePassCom ? (
                          <div>
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
                              {!userName && (
                                <p className="font12 text-warning  mb-0 mt-1">
                                  {formErrors.userName}
                                </p>
                              )}
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
                                    icon={
                                      passType === "text" ? faEye : faEyeSlash
                                    }
                                    className={`position-absolute cursorPointer start-0 top-0 eyeInputPass`}
                                    onClick={handlePassType}
                                  />
                                ) : null}
                              </div>
                            </Form.Group>
                          </div>
                        ) : (
                          <div>
                            <Row>
                              <h1 className="text-center mb-5">
                                برای بازیابی رمز عبور لطفا اطلاعات زیر را تکمیل
                                کنید
                              </h1>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <NumberFormat
                                  type="text"
                                  value={userName}
                                  name="userName"
                                  id="registerUserName"
                                  disabled={userNameDisabled}
                                  onChange={(e) => {
                                    dispatch(RsetUserName(e.target.value));
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value !== "") {
                                      handleCheckUserRegister();
                                    }
                                    function isValidIranianNationalCode(
                                      meli_code
                                    ) {
                                      if (meli_code.length == 10) {
                                        if (
                                          meli_code == "1111111111" ||
                                          meli_code == "0000000000" ||
                                          meli_code == "2222222222" ||
                                          meli_code == "3333333333" ||
                                          meli_code == "4444444444" ||
                                          meli_code == "5555555555" ||
                                          meli_code == "6666666666" ||
                                          meli_code == "7777777777" ||
                                          meli_code == "8888888888" ||
                                          meli_code == "9999999999"
                                        ) {
                                          return false;
                                        }
                                        var c = parseInt(meli_code.charAt(9));
                                        var n =
                                          parseInt(meli_code.charAt(0)) * 10 +
                                          parseInt(meli_code.charAt(1)) * 9 +
                                          parseInt(meli_code.charAt(2)) * 8 +
                                          parseInt(meli_code.charAt(3)) * 7 +
                                          parseInt(meli_code.charAt(4)) * 6 +
                                          parseInt(meli_code.charAt(5)) * 5 +
                                          parseInt(meli_code.charAt(6)) * 4 +
                                          parseInt(meli_code.charAt(7)) * 3 +
                                          parseInt(meli_code.charAt(8)) * 2;
                                        var r = n - parseInt(n / 11) * 11;
                                        if (
                                          (r == 0 && r == c) ||
                                          (r == 1 && c == 1) ||
                                          (r > 1 && c == 11 - r)
                                        ) {
                                          return true;
                                        } else {
                                          return false;
                                        }
                                      } else {
                                        return false;
                                      }
                                    }
                                    // const test = isValidIranianNationalCode(
                                    //   userNameRef.current.state.numAsString
                                    // );
                                  }}
                                  ref={userNameRef}
                                  format="# # # # # # # # # #"
                                  mask="-"
                                  dir="ltr"
                                  placeholder="کدملی"
                                  className={userNameValidationClass}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="userName-required"
                                    className="d-none"
                                  >
                                    <span className="font12 mb-1">
                                      واردکردن کد ملی اجباری است!
                                    </span>
                                  </div>
                                  <div
                                    id="userName-validation"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      کد ملی حداقل باید 10 کاراکتر باشد!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <NumberFormat
                                  type="text"
                                  value={personalCode}
                                  name="personalCode"
                                  id="registerPersonalCode"
                                  onBlur={(e) => {
                                    if (e.target.value !== "") {
                                      handleCheckUserRegister();
                                    }
                                  }}
                                  onChange={(e) => {
                                    setPersonalCode(e.target.value);
                                  }}
                                  ref={personalCodeRef}
                                  format="# # # # # # #"
                                  mask="-"
                                  dir="ltr"
                                  placeholder="کدپرسنلی"
                                  className={personalCodeValidationClass}
                                  disabled={personalCodeDisabled}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="personalCode-validation"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      کدپرسنلی باید 7 کاراکتر باشد!
                                    </span>
                                  </div>
                                  <div
                                    id="personalCode-validation2"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      کدپرسنلی باید با 6 شروع شود!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <NumberFormat
                                  type="text"
                                  value={birthCertificateNumber}
                                  name="birthCertificateNumber"
                                  id="registerBirthCertificateNumber"
                                  onChange={(e) => {
                                    setBirthCertificateNumber(e.target.value);
                                  }}
                                  ref={birthCertificateNumberRef}
                                  maxLength="10"
                                  dir="ltr"
                                  placeholder="شماره شناسنامه"
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="birthCertificateNumber-required"
                                    className="d-none"
                                  >
                                    <span className="font12 mb-1">
                                      واردکردن شماره شناسنامه اجباری است!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <NumberFormat
                                  type="text"
                                  value={insuranceNumber}
                                  name="insuranceNumber"
                                  id=""
                                  onChange={(e) => {
                                    setInsuranceNumber(e.target.value);
                                  }}
                                  ref={insuranceNumberRef}
                                  dir="ltr"
                                  placeholder="شماره بیمه"
                                  className={insuranceNumberValidationClass}
                                  // disabled={insuranceNumberDisabled}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="insuranceNumber-required"
                                    className="d-none"
                                  >
                                    <span className="font12 mb-1">
                                      واردکردن شماره بیمه اجباری است!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <DatePicker
                                  inputReadOnly
                                  name="birthday"
                                  isGregorian={false}
                                  timePicker={false}
                                  showTodayButton={false}
                                  placeholder="تاریخ تولد"
                                  ref={birthdayRef}
                                  inputFormat="YYYY-MM-DD"
                                  inputJalaaliFormat="jYYYY/jMM/jDD"
                                  value={birthday}
                                  className="form-control"
                                  // disabled={birthdayDisabled}
                                  onChange={(e) => {
                                    setBirthday(e);
                                  }}
                                />
                                <div
                                  id="birthday-validation"
                                  className="d-none mt-1"
                                >
                                  <span className="text-danger font12">
                                    تاریخ تولد معتبر نمی باشد!
                                  </span>
                                </div>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <NumberFormat
                                  type="text"
                                  value={phoneNumber}
                                  name="phoneNumber"
                                  onChange={(e) => {
                                    setPhoneNumber(e.target.value);
                                  }}
                                  ref={phoneNumberRef}
                                  format="# # # # # # # # # # #"
                                  mask="-"
                                  dir="ltr"
                                  placeholder="شماره موبایل"
                                  className={phoneNumberValidationClass}
                                  // disabled={phoneNumberDisabled}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="phoneNumber-required"
                                    className="d-none"
                                  >
                                    <span className="font12 mb-1">
                                      واردکردن شماره موبایل اجباری است!
                                    </span>
                                  </div>
                                  <div
                                    id="phoneNumber-validation"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      شماره موبایل حداقل باید 11 کاراکتر باشد!
                                    </span>
                                  </div>
                                  <div
                                    id="phoneNumber-validation2"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      شماره موبایل باید با 09 شروع شود!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <Form.Control
                                  type="password"
                                  autoComplete="new-password"
                                  value={password}
                                  name="password"
                                  onChange={(e) => {
                                    dispatch(RsetPassword(e.target.value));
                                  }}
                                  ref={passwordRef}
                                  placeholder="رمز عبور"
                                  // disabled={passwordDisabled}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="password-required"
                                    className="d-none"
                                  >
                                    <span className="font12 mb-1">
                                      واردکردن رمز عبور اجباری است!
                                    </span>
                                  </div>
                                  <div
                                    id="password-validation"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      رمز عبور باید شامل حروف و عدد و حداقل 6
                                      کاراکتر باشد!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="6"
                                className="mb-4 px-0 px-md-3"
                              >
                                <Form.Control
                                  type="password"
                                  value={confirmPassword}
                                  name="confirmPassword"
                                  onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                  }}
                                  ref={confirmPasswordRef}
                                  placeholder="تکرار رمز عبور"
                                  // disabled={confirmPasswordDisabled}
                                />
                                <Form.Control.Feedback type="invalid">
                                  <div
                                    id="passwordConfirm-required"
                                    className="d-none"
                                  >
                                    <span className="font12 mb-1">
                                      واردکردن تکرار رمز عبور اجباری است!
                                    </span>
                                  </div>
                                  <div
                                    id="passwordConfirm-validation"
                                    className="d-none"
                                  >
                                    <span className="font12">
                                      رمزهای وارد شده یکسان نیستند!
                                    </span>
                                  </div>
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                          </div>
                        )}

                        <div className="cursorPointer mb-3 forgetPass">
                          {!showChangePassCom ? (
                            <div
                              className="font12"
                              onClick={() => {
                                dispatch(RsetShowChangePassCom(true));
                              }}
                            >
                              فراموشی رمز عبور
                            </div>
                          ) : (
                            <div
                              className="font12"
                              onClick={() => {
                                dispatch(RsetShowChangePassCom(false));
                              }}
                            >
                              ورود به سامانه
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn w-100 text-white border-0 buttonDesignPrimary"
                          onClick={(e) => {
                            submitFormBtn(e);
                          }}
                        >
                          {!showChangePassCom ? "ورود" : "بازیابی رمز عبور"}
                        </button>
                      </Col>
                      <a
                        href={window.location.origin + "/files/Automation.pdf"}
                        download
                        className="text-white font12 mt-3 text-decoration mb-5"
                      >
                        دانلود فایل راهنمای استفاده از اتوماسیون
                      </a>
                    </Row>
                  </Form>
                </div>
                {!showChangePassCom ? (
                  <div className="d-none d-xxl-flex justify-content-end align-items-center text-white borderRadius">
                    <div className="borderRadius login-main-img-sub img-fluid" />
                  </div>
                ) : null}
              </div>
            </section>
          </Container>
        </section>
      )}
    </div>
  );
};

export default Test;
