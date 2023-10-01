import react from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Form } from "react-bootstrap";
import NumberFormat from "react-number-format";
import { useSelector, useDispatch } from "react-redux";
import GoodSearchBtn from "./../Common/GoodSearch/GoodSearchBtn";
import GoodSearchModal from "../Modals/Warehouse/GoodSearchModal";
import {
  selectGoodsModal,
  selectGoodCode,
  selectGoodName,
  RsetGoodCode,
  RsetGoodName,
  handleGetGoodInfoWithCode,
  handleGetGoodInfoWithName,
} from "../Slices/goodSearchSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSpinner,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const Test = () => {
  return (
    <section className="min-vh-100 vw-100 vh-100 position-absolute left-0 right-0 top-0 inputDesignPrimary ">
      <Container
        fluid
        className="d-flex min-vh-100 justify-content-center align-items-center login-main-img"
      >
        <section className="d-flex border border-1 border-secondary login-size p-2 borderRadius bg-dark shadow-lg">
          <div className="w-100 d-flex login-bg borderRadius">
            <div className="d-flex justify-content-end me-5 align-items-center  text-white w-100 borderRadius">
              <Form>
                <Row className="d-flex flex-column justify-content-center">
                  <Col md="12" className="px-0 mb-4 pt-3">
                    <div className="text-center text-white">
                      <img
                        className="img-fluid mb-3 d-none d-md-inline"
                        src="../../images/kaveh.png"
                      />
                      <h1 className="font25 fw-bold headersPhoneFontSize lh-base">
                        سامانه اتوماسیون گروه صنعتی شیشه کاوه
                      </h1>
                    </div>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Control
                        placeholder="نام کاربری / کدملی"
                        type="text"
                        dir="ltr"
                        value={""}
                        name="userName"
                        className="text-white"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <div className="position-relative">
                        <Form.Control
                          className="p-5"
                          autocomplete="off"
                          dir="ltr"
                          id="passInput"
                          placeholder="رمزعبور"
                          //   type="passType"
                          value={""}
                          name="password"
                        />
                        <FontAwesomeIcon
                          //   icon={passType === "text" ? faEye : faEyeSlash}
                          className="position-absolute cursorPointer end-0 top-0 eyeInputPass"
                          //   onClick={handlePassType}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="d-flex justify-content-end align-items-center  text-white w-100 borderRadius p-4">
              <div className="h-100 w-75 login-main-img-sub borderRadius shadow"></div>
            </div>
          </div>
        </section>
      </Container>
    </section>
  );
};

export default Test;
