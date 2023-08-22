import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Table, Modal } from "react-bootstrap";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { RsetFormErrors, selectFormErrors } from "../../../Slices/mainSlices";
import {
  selectIrantoolCategory,
  RsetIrantoolCategory,
  selectIrantoolCategoryOptions,
  selectIrantoolDeviceCode,
  RsetIrantoolDeviceCode,
  selectIrantoolShift,
  RsetIrantoolShift,
  selectIrantoolWorkHours,
  RsetIrantoolWorkHours,
  handleIrantoolCategoryList,
  handleIrantoolReqSubmit,
  selectIrantoolDeviceModal,
  RsetIrantoolDeviceModal,
  handleResetITRegister,
  handleEditIrantoolMachine
} from "../../../Slices/irantoolSlices";
import { RsetCurrentReqInfo, selectCurrentReqInfo } from './../../../Slices/currentReqSlice';

const IrantoolDeviceRegistrationModal = () => {
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  useEffect(()=>{
    if(currentReqInfo !== ''){
      dispatch(RsetIrantoolCategory({label: currentReqInfo.categoryName, value:currentReqInfo.categoryId}));
      dispatch(RsetIrantoolDeviceCode(currentReqInfo.machineCode));
      dispatch(RsetIrantoolShift(currentReqInfo.numberOfShift));
      dispatch(RsetIrantoolWorkHours(currentReqInfo.useabilityHour));
    }
  },[currentReqInfo])

  useEffect(() => {
    dispatch(handleIrantoolCategoryList());
  }, []);

  //select
  const dispatch = useDispatch();
  const category = useSelector(selectIrantoolCategory);
  const categoryOptions = useSelector(selectIrantoolCategoryOptions);
  const deviceCode = useSelector(selectIrantoolDeviceCode);
  const deviceShift = useSelector(selectIrantoolShift);
  const workHours = useSelector(selectIrantoolWorkHours);
  const irantoolDeviceModal = useSelector(selectIrantoolDeviceModal);

  const formErrors = useSelector(selectFormErrors);

  //limited the number of characters in the input
  const shiftLimit = 3;
  const workHoursLimit = 24;

  // validation
  const categoryIsValid = category.length !== 0;
  const deviceCodeIsValid = deviceCode !== "";
  const shiftIsValid = deviceShift !== "";
  const workHoursIsValid = workHours !== "";

  const formIsValid =
    categoryIsValid && deviceCodeIsValid && shiftIsValid && workHoursIsValid;

  const validation = () => {
    var errors = {};
    if (!categoryIsValid) {
      errors.category = "واردکردن دسته بندی اجباری است!";
    }
    if (!deviceCodeIsValid) {
      errors.deviceCode = "واردکردن  کد دستگاه اجباری است!";
    }
    if (!shiftIsValid) {
      errors.deviceShift = "واردکردن شیفت اجباری است!";
    }
    if (!workHoursIsValid) {
      errors.workHours = "واردکردن ساعت کار کرد اجباری است!";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formIsValid) {
      dispatch(handleIrantoolReqSubmit(e));
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            category,
            deviceCode,
            deviceShift,
            workHours,
          })
        )
      );
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={irantoolDeviceModal}
      onHide={() => {
        dispatch(RsetIrantoolDeviceModal(false));
      }}
      dialogClassName="modal-96w overflow-visible-modal"
    >
      <Modal.Body>
        <Container fluid className="mt-5">
          <Form>
            <Row className="mb-5">
              <Form.Group as={Col} md="3">
                <Form.Label className="required-field">دسته بندی: </Form.Label>
                <Select
                  value={category}
                  name="category"
                  onChange={(e) => {
                    dispatch(RsetIrantoolCategory(e));
                  }}
                  placeholder="انتخاب..."
                  options={categoryOptions}
                  isSearchable={true}
                />
                {!categoryIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.category}
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label className="required-field">کد دستگاه: </Form.Label>
                <Form.Control
                  type="text"
                  name="irantoolDeviceCode"
                  value={deviceCode}
                  onChange={(e) => {
                    dispatch(RsetIrantoolDeviceCode(e.target.value));
                  }}
                />
                {!deviceCodeIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.deviceCode}
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label className="required-field">شیفت: </Form.Label>
                <NumberFormat
                  dir="ltr"
                  id="shift"
                  type="text"
                  maxLength={1}
                  className="form-control"
                  value={deviceShift}
                  onChange={(e) => {
                    dispatch(RsetIrantoolShift(e.target.value));
                  }}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    if (floatValue === undefined) {
                      return true;
                    }
                    return floatValue <= shiftLimit;
                  }}
                />
                {!shiftIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.deviceShift}
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label className="required-field">
                  ساعت کارکرد:{" "}
                </Form.Label>
                <NumberFormat
                  dir="ltr"
                  id="workHours"
                  type="text"
                  maxLength={5}
                  className="form-control"
                  value={workHours}
                  onChange={(e) => {
                    dispatch(RsetIrantoolWorkHours(e.target.value));
                  }}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    if (floatValue === undefined) {
                      return true;
                    }
                    return floatValue <= workHoursLimit;
                  }}
                />
                {!workHoursIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.workHours}
                  </p>
                )}
              </Form.Group>
            </Row>
            <Row>
              <Modal.Footer className="d-block">
                <div className="d-flex justify-content-between">
                  <div className="me-2 d-flex align-items-center">
                    <Button
                      variant="success"
                      onClick={(e) => {
                        if(currentReqInfo === ''){
                          handleSubmit(e);
                        }else{
                          dispatch(handleEditIrantoolMachine());
                        }
                      }}
                    >
                      ثبت دستگاه
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    type="reset"
                    onClick={() => {
                      dispatch(RsetIrantoolDeviceModal(false));
                      dispatch(handleResetITRegister());
                      dispatch(RsetFormErrors([]));
                      dispatch(RsetCurrentReqInfo(''));
                    }}
                  >
                    انصراف
                  </Button>
                </div>
              </Modal.Footer>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default IrantoolDeviceRegistrationModal;
