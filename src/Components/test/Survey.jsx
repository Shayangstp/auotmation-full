import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { selectSurveyChecked, RsetSurveyChecked } from "../Slices/surveySlices";
import { RsetFormErrors, selectFormErrors } from "../Slices/mainSlices";

const Survey = () => {
  const dispatch = useDispatch();

  const surveyChecked = useSelector(selectSurveyChecked);
  const formErrors = useSelector(selectFormErrors);

  const surveyCheckedIsValid = surveyChecked !== "";

  const validation = () => {
    let errors = {};
    if (!surveyCheckedIsValid) {
      errors.surveyChecked = "انتخاب یک گزینه اجباری است!";
    }
    return errors;
  };

  const surveyHandler = (e) => {
    e.preventDefault();
    if (surveyCheckedIsValid) {
      console.log({
        option: surveyChecked,
      });
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            surveyChecked,
          })
        )
      );
    }
  };

  return (
    <Container fluid className="mt-4 mb-5">
      <section className="lightGray2-bg p-3 shadow borderRadius border border-white border-2">
        <div className="shadow p-4 mb-5 borderRadius lightGray-bg  border border-white font16">
          نظرسنجی
        </div>
        <Form className="ms-3">
          <Row>
            <Col>
              <Form.Label>آیا در این نظر سنجی شرکت می کنید؟</Form.Label>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form.Check
                className="mt-2"
                type="radio"
                name="surveyOption"
                label="گزینه ۱"
                value={"1"}
                onChange={(e) => {
                  dispatch(RsetSurveyChecked(e.target.value));
                }}
              />
              <Form.Check
                className="mt-2"
                type="radio"
                name="surveyOption"
                label="گزینه ۲"
                value={"2"}
                onChange={(e) => {
                  dispatch(RsetSurveyChecked(e.target.value));
                }}
              />
              <Form.Check
                className="mt-2"
                type="radio"
                name="surveyOption"
                label="گزینه ۳"
                value={"3"}
                onChange={(e) => {
                  dispatch(RsetSurveyChecked(e.target.value));
                }}
              />
              <Form.Check
                className="mt-2"
                type="radio"
                name="surveyOption"
                label="گزینه ۴"
                value={"4"}
                onChange={(e) => {
                  dispatch(RsetSurveyChecked(e.target.value));
                }}
              />
              {!surveyCheckedIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.surveyChecked}
                </p>
              )}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col
              md="5"
              xl="4"
              className="mx-auto d-flex justify-content-between mt-4"
            >
              <Button
                variant="success"
                className="w-45 mb-3"
                onClick={surveyHandler}
              >
                ثبت درخواست
              </Button>
              <Button
                variant="secondary"
                type="reset"
                className="w-45 mb-3"
                onClick={(e) => {
                  dispatch(RsetSurveyChecked(""));
                  dispatch(RsetFormErrors(""));
                }}
              >
                انصراف
              </Button>
            </Col>
          </Row>
        </Form>
      </section>
    </Container>
  );
};
export default Survey;
