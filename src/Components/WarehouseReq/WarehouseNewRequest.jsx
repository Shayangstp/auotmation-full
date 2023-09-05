import React, { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rootContext } from "../context/rootContext";
import { reqContext } from "../context/warehouseReqsContext/reqContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import WarehouseReqNewItem from "./WarehouseReqNewItem";
import WarehouseReqItems from "./WarehouseReqItems";
import xssFilters from "xss-filters";
import {
  selectUser,
  selectFormErrors,
  RsetFormErrors,
  handleUsersByRoles,
  selectUsersByRole,
  RsetUsersByRole,
  selectUsersByRoleOptions,
  RsetSendOptions,
  selectSendOptions,
  selectLoading,
} from "../Slices/mainSlices";
import {
  selectWarehouseReqMyRequest,
  RsetWarehouseReqMyRequest,
  selectWarehouseReqApplicantFName,
  RsetWarehouseReqApplicantFName,
  selectWarehouseReqApplicantLName,
  RsetWarehouseReqApplicantLName,
  selectWarehouseReqSupervisor,
  RsetWarehouseReqSupervisor,
  selectWarehouseReqIsProject,
  RsetWarehouseReqIsProject,
  selectWarehouseReqProjectCode,
  RsetWarehouseReqProjectCode,
  selectWarehouseReqDescription,
  RsetWarehouseReqDescription,
  handleResetWarehouseReq,
  handleSubmitNewWarehouseReq,
  handleSendToWarehousePermission,
  selectSendDirectlyToWarehouse,
} from "../Slices/warehouseSlice";
import {
  RsetCurrentReqItems,
  selectCurrentReqItems,
} from "../Slices/currentReqSlice";
import {
  selectResetFormModal,
  RsetResetFormModal,
  selectSetSupervisorModal,
  RsetSetSupervisorModal,
} from "../Slices/modalsSlice";
import ResetFormModal from "../Modals/ResetFormModal";
import SetSupervisorModal from "../Modals/SetSupervisorModal";
import Loading from "../Common/Loading";

const WarehouseNewRequest = ({ setPageTitle, setLocklinks }) => {
  const dispatch = useDispatch();

  const warehouseReqMyRequest = useSelector(selectWarehouseReqMyRequest);
  const warehouseReqApplicantFName = useSelector(
    selectWarehouseReqApplicantFName
  );
  const warehouseReqApplicantLName = useSelector(
    selectWarehouseReqApplicantLName
  );
  const warehouseReqSupervisor = useSelector(selectWarehouseReqSupervisor);
  const warehouseReqIsProject = useSelector(selectWarehouseReqIsProject);
  const warehouseReqProjectCode = useSelector(selectWarehouseReqProjectCode);
  const warehouseReqDescription = useSelector(selectWarehouseReqDescription);
  const user = useSelector(selectUser);
  const usersByRole = useSelector(selectUsersByRole);
  const usersByRoleOptions = useSelector(selectUsersByRoleOptions);
  const currentReqItems = useSelector(selectCurrentReqItems);
  const sendOptions = useSelector(selectSendOptions);
  const sendDirectlyToWarehouse = useSelector(selectSendDirectlyToWarehouse);
  const loading = useSelector(selectLoading);

  const resetFormModal = useSelector(selectResetFormModal);
  const setSupervisorModal = useSelector(selectSetSupervisorModal);

  useEffect(() => {
    setPageTitle("برگه درخواست انبار");
    dispatch(RsetCurrentReqItems([]));
    dispatch(handleSendToWarehousePermission());
  }, []);

  // useEffect(() => {
  //     dispatch(RsetFormErrors(
  //         warehouseReqValidation({
  //             warehouseReqApplicantFName: '',
  //             warehouseReqApplicantLName: '',
  //         })
  //     ));
  // }, [warehouseReqMyRequest])
  // useEffect(() => {
  //     dispatch(RsetFormErrors(
  //         warehouseReqIsProjectValidation({
  //             warehouseReqIsProject: '',
  //         })
  //     ));
  // }, [warehouseReqIsProject])

  const formErrors = useSelector(selectFormErrors);
  const warehouseReqValidation = () => {
    var errors = {};
    if (!warehouseReqApplicantFName) {
      errors.warehouseReqApplicantFName = "وارد کردن نام اجباری است!";
    }
    if (!warehouseReqApplicantLName) {
      errors.warehouseReqApplicantLName = "وارد کردن نام خانوادگی اجباری است!";
    }
    return errors;
  };
  const warehouseReqIsProjectValidation = () => {
    var errors = {};
    if (warehouseReqIsProject) {
      if (!warehouseReqProjectCode) {
        errors.warehouseReqProjectCode = "وارد کردن سریال پروژه اجباری است!";
      }
    }
    return errors;
  };
  const addWarehouseNewReqItem = (e) => {
    e.preventDefault();
    if (warehouseReqMyRequest) {
      if (!warehouseReqIsProject) {
        dispatch(handleSubmitNewWarehouseReq());
      } else {
        if (warehouseReqProjectCode !== "") {
          dispatch(handleSubmitNewWarehouseReq(e));
        } else {
          dispatch(
            RsetFormErrors(
              warehouseReqIsProjectValidation({
                warehouseReqProjectCode: warehouseReqProjectCode,
              })
            )
          );
        }
      }
    } else {
      if (
        warehouseReqApplicantFName !== "" &&
        warehouseReqApplicantLName !== ""
      ) {
        if (!warehouseReqIsProject) {
          dispatch(handleSubmitNewWarehouseReq());
        } else {
          if (warehouseReqProjectCode !== "") {
            dispatch(handleSubmitNewWarehouseReq(e));
          } else {
            dispatch(
              RsetFormErrors(
                warehouseReqIsProjectValidation({
                  warehouseReqProjectCode: warehouseReqProjectCode,
                })
              )
            );
          }
        }
      } else {
        dispatch(
          RsetFormErrors(
            warehouseReqValidation({
              warehouseReqApplicantFName: warehouseReqApplicantFName,
              warehouseReqApplicantLName: warehouseReqApplicantLName,
            })
          )
        );
      }
    }
  };

  const mainContext = useContext(rootContext);
  const {
    // handleCheckPermission,
    // menuPermission,
  } = mainContext;

  useEffect(() => {
    //handleCheckPermission(localStorage.getItem('lastLocation'));
  }, []);

  useEffect(() => {
    setPageTitle("برگه درخواست انبار");
    if (currentReqItems.length !== 0) {
      setLocklinks(true);
    } else {
      setLocklinks(false);
    }
  }, [currentReqItems]);

  useEffect(() => {
    dispatch(
      handleUsersByRoles({
        roles: undefined,
        location: user.Location,
        company: user.CompanyCode,
        exist: 1,
        dep: undefined,
        task: 0,
      })
    );
    if (user.Supervisor !== undefined) {
      if (user.Supervisor._id !== "6301bfc820ef705fdc27039e") {
        // if (user.Supervisor.Approved === true) {
        dispatch(
          RsetWarehouseReqSupervisor(
            user.Supervisor.FirstName + " " + user.Supervisor.LastName
          )
        );
        // dispatch(RsetUsersByRole({ label: user.Supervisor.FirstName + " " + user.Supervisor.LastName, value: user.Supervisor._id }))
        // }
      } else {
        dispatch(RsetSetSupervisorModal(true));
      }
    }
  }, [user]);
  return (
    <Container fluid className="pb-4">
      {/* {menuPermission ? */}
      <div className="position-relative">
        {loading ? <Loading /> : null}
        <Fragment>
          <Row className="mb-5">
            <Col className="text-center text-md-start d-block d-md-flex align-items-center">
              <h1 className="font16 mb-0">برگه درخواست از انبار برای:</h1>
              <div className="d-flex justify-content-center">
                <div className="ms-md-4">
                  <label className="me-2">دیگری</label>
                  <Form.Check
                    className="d-inline-block"
                    type="switch"
                    id="custom-switch"
                    label="خودم"
                    checked={warehouseReqMyRequest}
                    onChange={() => {
                      dispatch(
                        RsetWarehouseReqMyRequest(!warehouseReqMyRequest)
                      );
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Row>
                  <Form.Group as={Col} md="4" xl="3" className="mb-4">
                    <Form.Label className="mb-1 required-field">
                      نام :
                    </Form.Label>
                    {warehouseReqMyRequest === true ? (
                      <Form.Control
                        type="text"
                        value={xssFilters.inHTMLData(user.FirstName)}
                        name="fName"
                        disabled
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={warehouseReqApplicantFName}
                        name="applicantFName"
                        onChange={(e) => {
                          dispatch(
                            RsetWarehouseReqApplicantFName(e.target.value)
                          );
                        }}
                        id="applicantFName"
                      />
                    )}
                    {!warehouseReqApplicantFName && (
                      <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.warehouseReqApplicantFName}
                      </p>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="4" xl="3" className="mb-4">
                    <Form.Label className="mb-1 required-field">
                      نام خانوادگی :
                    </Form.Label>
                    {warehouseReqMyRequest === true ? (
                      <Form.Control
                        type="text"
                        value={xssFilters.inHTMLData(user.LastName)}
                        name="lName"
                        disabled
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={warehouseReqApplicantLName}
                        name="applicantLName"
                        onChange={(e) => {
                          dispatch(
                            RsetWarehouseReqApplicantLName(e.target.value)
                          );
                        }}
                        id="applicantLName"
                      />
                    )}
                    {!warehouseReqApplicantLName && (
                      <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.warehouseReqApplicantLName}
                      </p>
                    )}
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    lg="4"
                    xl="6"
                    className="mb-4 d-flex align-items-center pt-4"
                  >
                    <Form.Label className="mb-1 ms-2">
                      درخواست پروژه ای:
                    </Form.Label>
                    <div className="d-flex align-items-center mx-4">
                      <input
                        type="radio"
                        name="warehouseReqIsProject"
                        value={warehouseReqIsProject}
                        defaultChecked={warehouseReqIsProject}
                        onChange={(e) => {
                          dispatch(
                            RsetWarehouseReqIsProject(!warehouseReqIsProject)
                          );
                        }}
                      />
                      <Form.Label className="ms-2 font12 mb-0">
                        {" "}
                        هست{" "}
                      </Form.Label>
                    </div>
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        name="warehouseReqIsProject"
                        value={!warehouseReqIsProject}
                        defaultChecked={!warehouseReqIsProject}
                        onChange={(e) => {
                          dispatch(
                            RsetWarehouseReqIsProject(!warehouseReqIsProject)
                          );
                        }}
                      />
                      <Form.Label className="ms-2 font12 mb-0">
                        {" "}
                        نیست{" "}
                      </Form.Label>
                    </div>
                  </Form.Group>
                  {warehouseReqIsProject ? (
                    <Form.Group as={Col} md="3" xl="3" className="mb-4">
                      <Form.Label className="mb-1">سریال پروژه :</Form.Label>
                      <Form.Control
                        type="text"
                        value={warehouseReqProjectCode}
                        name="projectCode"
                        onChange={(e) => {
                          dispatch(RsetWarehouseReqProjectCode(e.target.value));
                        }}
                        id="projectCode"
                      />
                      {!warehouseReqProjectCode && (
                        <p className="font12 text-danger mb-0 mt-1">
                          {formErrors.warehouseReqProjectCode}
                        </p>
                      )}
                    </Form.Group>
                  ) : null}
                  <hr className="mb-5" />
                  <WarehouseReqNewItem />
                  {currentReqItems.length !== 0 ? (
                    <WarehouseReqItems reqItemsOperation={true} />
                  ) : null}
                  <hr className="mt-5" />
                  <Form.Group as={Col} md="12" className="mb-4">
                    <Form.Label className="mb-1">توضیحات :</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      maxLength={50}
                      name="requestDescription"
                      value={warehouseReqDescription}
                      onChange={(e) =>
                        dispatch(RsetWarehouseReqDescription(e.target.value))
                      }
                    />
                  </Form.Group>
                  <Col md="12" className="py-5">
                    <Row className="rounded lightGray2-bg border p-3 shadow">
                      <Col md="12">
                        <h3 className="fw-bold mb-4">ارسال درخواست به:</h3>
                      </Col>
                      <Form.Group as={Col} md="4" xl="3" className="mb-4">
                        <Form.Label className="mb-1 required-field">
                          سرپرست/مدیر :
                        </Form.Label>
                        {user.Supervisor === undefined ? null : (
                          <InputGroup>
                            <InputGroup.Radio
                              name="sendOptions"
                              value="1"
                              checked
                              onChange={(e) => {
                                dispatch(RsetSendOptions(e.target.value));
                              }}
                              aria-label="جهت انتخاب کلیک کنید."
                            />
                            <Form.Control
                              aria-describedby="basic-addon2"
                              type="text"
                              disabled
                              value={warehouseReqSupervisor}
                              id="reqSupervisor"
                              name="supervisor"
                              onChange={(e) => {
                                dispatch(RsetWarehouseReqSupervisor(e));
                              }}
                            />
                          </InputGroup>
                        )}
                      </Form.Group>
                      <Form.Group as={Col} md="4" xl="3" className="mb-4">
                        <Form.Label className="mb-1 required-field">
                          شخص دیگر :
                        </Form.Label>
                        <InputGroup className="radioInputGroup flex-nowrap">
                          <InputGroup.Radio
                            name="sendOptions"
                            value="2"
                            onChange={(e) => {
                              dispatch(RsetSendOptions(e.target.value));
                            }}
                            aria-label="جهت انتخاب کلیک کنید."
                          />
                          <Select
                            isSearchable
                            value={usersByRole}
                            name="usersByRole"
                            options={usersByRoleOptions}
                            onChange={(option) => {
                              dispatch(RsetUsersByRole(option));
                            }}
                            placeholder="ارسال به ..."
                            className="w-100"
                          />
                        </InputGroup>
                      </Form.Group>
                      {sendDirectlyToWarehouse === true ? (
                        <Form.Group as={Col} md="4" xl="3" className="mb-4">
                          <Form.Label className="mb-1 required-field">
                            انبار :
                          </Form.Label>
                          <InputGroup className="radioInputGroup">
                            <InputGroup.Radio
                              name="sendOptions"
                              value="3"
                              onChange={(e) => {
                                dispatch(RsetSendOptions(e.target.value));
                              }}
                              aria-label="جهت انتخاب کلیک کنید."
                            />
                            <Form.Control
                              type="text"
                              disabled
                              value="مستقیم به انبار بدون نیاز به تایید"
                            />
                          </InputGroup>
                          <span className="font10 mt-1 text-danger">
                            تنها درصورتی که امضا شما مورد تایید واحد انبار باشد
                            میتوانید از این آیتم استفاده کنید!
                          </span>
                        </Form.Group>
                      ) : null}
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-4 justify-content-center">
                  <Col md="4" xxl="2">
                    <Button
                      variant="success"
                      className="me-md-3 mb-3 mb-md-0 w-100"
                      onClick={(event) => addWarehouseNewReqItem(event)}
                      preventdefault="true"
                    >
                      ثبت درخواست
                    </Button>
                  </Col>
                  <Col md="4" xxl="2">
                    <Button
                      variant="secondary"
                      type="reset"
                      className="w-100"
                      onClick={() => {
                        dispatch(RsetResetFormModal(true));
                      }}
                    >
                      انصراف
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {resetFormModal ? (
            <ResetFormModal resetFunc={handleResetWarehouseReq} />
          ) : null}
          {setSupervisorModal ? <SetSupervisorModal /> : null}
        </Fragment>
      </div>

      {/*:
                 <Row>
            //         <Col>
            //             <Alert variant="warning">
            //                 <Alert.Heading>
            //                     <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
            //                     <span className="font24">عدم دسترسی!</span>
            //                 </Alert.Heading>
            //                 <p>
            //                 کاربر گرامی شما به این بخش دسترسی ندارید. 
            //                 </p>
            //                 <hr />
            //                 <div className="d-flex justify-content-end">   
            //                     <Link to='/Home'>
            //                         <Button variant="outline-success">
            //                             <FontAwesomeIcon icon={faHome} className='me-2'/>
            //                             صفحه اصلی
            //                         </Button>
            //                     </Link>
            //                 </div>
            //             </Alert>
            //         </Col>
                 </Row>
            }*/}
    </Container>
  );
};

export default WarehouseNewRequest;
