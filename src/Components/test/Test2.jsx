import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Test2 = () => {
  return (
    <section className="min-vh-100 vw-100 d-flex align-items-center justify-content-center login-back-img inputDesignPrimary">
      <div className="res mb-5 mt-5">
        <div className="row">
          <div className="col-12 text-center">
            <div className="login-final-img img-fluid shadow-lg borderRadius border border-secondary d-flex  overflow-hidden">
              <Row className="ms-md-5 ms-0 align-items-center justify-content-center border mt-5">
                <Col
                  md="12"
                  className="px-0 mb-4 ms-xl-5 ms-3 d-flex flex-column mt-5"
                >
                  {/* title */}
                  <div className="text-center text-white">
                    <h1 className="font15 fw-bold headersPhoneFontSize lh-base ms-md-5 mb-5">
                      سامانه اتوماسیون گروه صنعتی شیشه کاوه
                    </h1>
                  </div>
                  <Form.Group
                    as={Col}
                    xs="10"
                    sm="12"
                    className="mb-4 ms-3 ms-sm-0"
                  >
                    <Form.Control
                      placeholder="نام کاربری / کدملی"
                      type="text"
                      // dir="ltr"
                      // value={userName}
                      // name="userName"
                      className="text-white ms-0 ms-md-4"
                      // onChange={(e) => {
                      //   dispatch(RsetUserName(e.target.value));
                      // }}
                      // ref={userNameRef}
                    />
                    {/* {!userName && (
                      <p className="font12 text-warning  mb-0 mt-1">
                        {formErrors.userName}
                      </p>
                    )} */}
                  </Form.Group>
                  {/*  or  */}
                  <Form.Group className="d-flex align-items-center ms-md-5 ms-0  mb-3 ">
                    <div className="orBorder mb-4"></div>
                    <p className="text-white mx-4">یا</p>
                    <div className="orBorder mb-4"></div>
                  </Form.Group>
                  {/* userName */}
                  <Form.Group
                    as={Col}
                    xs="10"
                    sm="12"
                    className="mb-4 ms-3 ms-sm-0"
                  >
                    <Form.Control
                      placeholder="نام کاربری / کدملی"
                      type="text"
                      // dir="ltr"
                      // value={userName}
                      // name="userName"
                      className="text-white ms-0 ms-md-4"
                      // onChange={(e) => {
                      //   dispatch(RsetUserName(e.target.value));
                      // }}
                      // ref={userNameRef}
                    />
                    {/* {!userName && (
                      <p className="font12 text-warning  mb-0 mt-1">
                        {formErrors.userName}
                      </p>
                    )} */}
                  </Form.Group>
                  {/* pass */}
                  <Form.Group
                    as={Col}
                    xs="10"
                    sm="12"
                    className="mb-4 ms-3 ms-sm-0"
                  >
                    <div className="position-relative">
                      <Form.Control
                        className="p-5 ms-0 ms-md-4"
                        autocomplete="off"
                        dir="ltr"
                        id="passInput"
                        placeholder="رمزعبور"
                        type="text"
                        // value={password}
                        name="password"
                        // onChange={(e) => {
                        //   dispatch(RsetPassword(e.target.value));
                        // }}
                        // ref={passwordRef}
                      />
                      {/* {password ? (
                        <FontAwesomeIcon
                          icon={passType === "text" ? faEye : faEyeSlash}
                          className={`position-absolute cursorPointer start-0 top-0 eyeInputPass`}
                          onClick={handlePassType}
                        />
                      ) : null} */}
                    </div>
                  </Form.Group>
                  {/* forgetPass */}
                  <Form.Group
                    as={Col}
                    xs="8"
                    sm="4"
                    className="cursorPointer mb-3 forgetPass ms-md-4 ms-0  text-start"
                  >
                    {/* {!showChangePassCom ? ( */}
                    <div
                      className="font12"
                      // onClick={() => {
                      //   dispatch(RsetShowChangePassCom(true));
                      // }}
                    >
                      فراموشی رمز عبور
                    </div>
                    {/* ) : (
                      <div
                        className="font12"
                        // onClick={() => {
                        //   dispatch(RsetShowChangePassCom(false));
                        // }}
                      >
                        ورود به سامانه
                      </div>
                    )} */}
                  </Form.Group>
                  {/* button */}
                  <Form.Group
                    as={Col}
                    xs="10"
                    sm="12"
                    className="mb-3 ms-3 ms-sm-0"
                  >
                    <button
                      type="button"
                      className="btn w-100 text-white border-0 buttonDesignPrimary ms-md-4 ms-0"
                      // onClick={(e) => {
                      //   submitFormBtn(e);
                      // }}
                    >
                      {/* {!showChangePassCom ? "ورود" : "بازیابی رمز عبور"} */}
                      ورود
                    </button>
                  </Form.Group>
                  {/* pdf */}
                  <Form.Group
                    as={Col}
                    xs="10"
                    sm="12"
                    className="text-start ms-md-4 ms-0"
                  >
                    <a
                      href={window.location.origin + "/files/Automation.pdf"}
                      download
                      className="text-white font12 mt-3 text-decoration mb-5 text-start"
                    >
                      دانلود فایل راهنمای استفاده از اتوماسیون
                    </a>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Test2;

{
  /* <img
  className="font12 img-fluid"
  src="../../images/kaveh_Logo.png"
  style={{
    filter: "invert(100%)",
  }}
/> */
}
