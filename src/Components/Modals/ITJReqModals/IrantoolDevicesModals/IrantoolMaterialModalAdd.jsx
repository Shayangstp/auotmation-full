import react, { Fragment } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  RsetIrantoolMaterialName,
  RsetIrantoolMaterialNameAdd,
  selectIrantoolMaterialNameAdd,
  selectIrantoolMaterialName,
  selectIrantoolMaterialList,
  handleGetProWithName,
} from "../../../Slices/irantoolSlices";
import { selectLoading } from "../../../Slices/mainSlices";
import IrantoolMaterialModalList from "./IrantoolMaterialModalList";

const CeramicMaterialModalAdd = () => {
  const dispatch = useDispatch();
  const irantoolMaterialList = useSelector(selectIrantoolMaterialList);
  const irantoolMaterialName = useSelector(selectIrantoolMaterialName);
  const irantoolMaterialNameAdd = useSelector(selectIrantoolMaterialNameAdd);
  const loading = useSelector(selectLoading);

  // const formErrors = useSelector(selectFormErrors);

  // const addMaterialNameIsValid = ceramicMaterialName !== "";

  // const validation = () => {
  //   var errors = {};
  //   if (!addMaterialNameIsValid) {
  //     errors.ceramicMaterialName = "واردکردن شرح / نام متریال ... اجباری است!";
  //   }
  //   return errors;
  // };

  return (
    <Fragment>
      <Row className="mb-3">
        <Form.Group as={Col} md="5">
          <Form.Label className="mb-1 required-field">
            شرح / نام متریال:{" "}
          </Form.Label>
          <Form.Control
            type="text"
            value={irantoolMaterialNameAdd}
            name="ceramicAdd"
            onChange={(e) => {
              dispatch(RsetIrantoolMaterialNameAdd(e.target.value));
              dispatch(RsetIrantoolMaterialName(e.target.value));
            }}
          />
          {/* {!addMaterialNameIsValid && (
            <p className="font12 text-danger mb-0 mt-1">
              {formErrors.ceramicMaterialName}
            </p>
          )} */}
        </Form.Group>
        <Form.Group as={Col} md="2" className="mt-4 mt4">
          <Button
            size="sm"
            onClick={(e) => {
              // if (irantoolMaterialName !== "") {
              dispatch(handleGetProWithName(e));
              dispatch(RsetIrantoolMaterialNameAdd(""));
              // } else {
              //   dispatch(
              //     RsetFormErrors(
              //       validation({
              //         ceramicMaterialName,
              //       })
              //     )
              //   );
              // }
            }}
          >
            جست و جو
          </Button>
        </Form.Group>
      </Row>
      <Row>
        <Col md="12">
          {loading ? (
            <div className="d-flex justify-content-center">
              <FontAwesomeIcon icon={faSpinner} className="spinner font60" />
            </div>
          ) : irantoolMaterialList.length !== undefined &&
            irantoolMaterialList.length !== 0 ? (
            <IrantoolMaterialModalList />
          ) : null}
        </Col>
      </Row>
    </Fragment>
  );
};

export default CeramicMaterialModalAdd;
