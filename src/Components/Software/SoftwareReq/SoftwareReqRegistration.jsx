import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";

import {
  selectFormErrors,
  RsetFormErrors,
  handleCompaniesList,
  selectCompanyNames,
  RsetCompanyNames,
  selectUser,
  selectCompaniesOption,
} from "../../Slices/mainSlices";

import {
  selectSoftwareReqDescription,
  RsetSoftwareReqDescription,
  selectSoftwareReqItemName,
  RsetSoftwareReqItemName,
  selectSoftwareNamesOption,
  selectSoftwareReqRequireParts,
  RsetSoftwareReqRequireParts,
  selectSoftwareReqCoUsers,
  RsetSoftwareReqCoUsers,
  selectSoftwareReqToPersonByRoles,
  RsetSoftwareReqToPersonByRoles,
  selectSoftwareCoUsersOption,
  selectSoftwareToPersonByRolesOption,
  selectSoftwareToggleHandler,
  RsetSoftwareToggleHandler,
  selectSoftwareReqItems,
  RsetSoftwareReqItems,
  handleSoftwareReqSubmit,
  handleSoftwareLists,
  handleDeleteItem,
  handleSoftwareReset,
  handleSoftwareCoUsersLists,
  handleSoftwareToPersonByRolesLists,
  selectRadioCheck,
  RsetRadioCheck,
} from "../../Slices/softwareSlice";
import { errorMessage } from "../../../utils/message";

const SoftwareReqRegistration = ({ setPageTitle }) => {
  useEffect(() => {
    dispatch(handleSoftwareLists());
    dispatch(handleCompaniesList());
  }, []);

  useEffect(() => {
    setPageTitle("ثبت درخواست نرم افزار");
  }, [setPageTitle]);

  const dispatch = useDispatch();
  const softwareReqDescription = useSelector(selectSoftwareReqDescription);
  const softwareReqItemName = useSelector(selectSoftwareReqItemName);
  const companyNames = useSelector(selectCompanyNames);
  const softwareReqRequireParts = useSelector(selectSoftwareReqRequireParts);
  const softwareReqCoUsers = useSelector(selectSoftwareReqCoUsers);
  const softwareReqToPersonByRoles = useSelector(
    selectSoftwareReqToPersonByRoles
  );
  const softwareToggleHandler = useSelector(selectSoftwareToggleHandler);
  const softwareReqItems = useSelector(selectSoftwareReqItems);
  const formErrors = useSelector(selectFormErrors);
  const companiesOption = useSelector(selectCompaniesOption);
  const softwareNamesOption = useSelector(selectSoftwareNamesOption);
  const softwareCoUsersOption = useSelector(selectSoftwareCoUsersOption);
  const softwareToPersonByRolesOption = useSelector(
    selectSoftwareToPersonByRolesOption
  );
  const user = useSelector(selectUser);
  const radioCheck = useSelector(selectRadioCheck);

  useEffect(() => {
    if (softwareToggleHandler === true) {
      dispatch(handleSoftwareCoUsersLists());
      dispatch(handleSoftwareToPersonByRolesLists());
    }
  }, [softwareToggleHandler]);

  const softwareNameIsValid = softwareReqItemName !== "";
  const companyNamesIsValid = companyNames !== "";
  const requirePartsIsValid = softwareReqRequireParts !== "";

  const coUsersIsValid = softwareReqCoUsers !== "";
  const toPersonByRolesIsValid = softwareReqToPersonByRoles !== "";

  const formIsValid =
    softwareNameIsValid && companyNamesIsValid && requirePartsIsValid;

  const validation = () => {
    var errors = {};
    if (!softwareNameIsValid) {
      errors.softwareReqItemName = "واردکردن نام نرم افزار اجباری است!";
    }
    if (!companyNamesIsValid) {
      errors.companyNames = "وارد کردن شرکت عامل اجباری است!";
    }
    if (!requirePartsIsValid) {
      errors.softwareReqRequireParts = "بخش های مورد نیاز را ذکر فرمایید";
    }

    return errors;
  };

  const validationCo = () => {
    var errors = {};
    if (!coUsersIsValid) {
      errors.softwareReqCoUsers = "واردکردن نام و نام خانوادگی اجباری است!";
    }
    if (!toPersonByRolesIsValid) {
      errors.softwareReqToPersonByRoles =
        "واردکردن نام و نام خانوادگی اجباری است!";
    }
    return errors;
  };

  const addTableHandler = () => {
    if (!softwareToggleHandler) {
      if (formIsValid) {
        dispatch(RsetFormErrors(""));
      } else {
        dispatch(
          RsetFormErrors(
            validation({
              softwareReqItemName,
              companyNames,
              softwareReqRequireParts,
            })
          )
        );

        return;
      }
    }

    let reqItems = [...softwareReqItems];

    let reqItem = {
      name: softwareReqItemName,
      companies: companyNames,
      require: softwareReqRequireParts,
      id: generateRandomNumber(1000, 9999),
    };

    reqItems.push(reqItem);
    dispatch(RsetSoftwareReqItems(reqItems));
    dispatch(handleSoftwareReset());
  };

  const submitHandler = (e) => {
    if (softwareToggleHandler === false) {
      if (softwareReqItems.length !== 0) {
        dispatch(handleSoftwareReqSubmit(e));
      }
    } else {
      if (radioCheck) {
        if (coUsersIsValid) {
          dispatch(handleSoftwareReqSubmit(e));
        } else {
          dispatch(
            RsetFormErrors(
              validationCo({
                softwareReqCoUsers,
              })
            )
          );
        }
      } else {
        if (toPersonByRolesIsValid) {
          dispatch(handleSoftwareReqSubmit(e));
        } else {
          dispatch(
            RsetFormErrors(
              validationCo({
                softwareReqToPersonByRoles,
              })
            )
          );
        }
      }
    }
  };

  //id generator
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // console.log(softwareCoUsersOption);
  // console.log(softwareToPersonByRolesOption);

  // const testHandler = async (e) => {
  //   e.preventDefault();
  //   const result = await dispatch(handleTest());

  //   const newObj = {
  //     name: "shayan",
  //     fun: result.payload,
  //   };

  //   console.log(newObj);
  // };

  return (
    <Container fluid className="mt-4 mb-5">
      <section className="lightGray2-bg p-3 shadow borderRadius border border-white border-2">
        <div className="shadow p-4 mb-5 borderRadius lightGray-bg  border border-white font16">
          فرم ثبت درخواست نرم افزار
        </div>
        <Form>
          <Row className="mb-5">
            <div className="d-flex justify-content-center">
              <Form.Label id="toggle" className="me-2">
                انتخاب دسترسی
              </Form.Label>
              <Form.Check
                type="switch"
                onClick={() => {
                  dispatch(RsetSoftwareToggleHandler(!softwareToggleHandler));
                  dispatch(RsetFormErrors(""));
                }}
                label="مانند سایر همکاران "
                id="toggle"
              />
            </div>
          </Row>

          {!softwareToggleHandler ? (
            <div>
              <Row>
                <Form.Group as={Col} md="4">
                  <Form.Label className="required-field">
                    نام نرم افزار:{" "}
                  </Form.Label>
                  <Select
                    value={softwareReqItemName}
                    name="softwareReqItemName"
                    onChange={(e) => {
                      dispatch(RsetSoftwareReqItemName(e));
                    }}
                    placeholder="انتخاب..."
                    options={softwareNamesOption}
                    isSearchable={true}
                    isMulti
                  />
                  {!softwareNameIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.softwareReqItemName}
                    </p>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="4">
                  <Form.Label className="required-field">
                    شرکت عامل:{" "}
                  </Form.Label>
                  <Select
                    value={companyNames}
                    name="softwareReqCompanyNames"
                    onChange={(e) => {
                      dispatch(RsetCompanyNames(e));
                    }}
                    placeholder="انتخاب..."
                    options={companiesOption}
                    isSearchable={true}
                    isMulti
                  />
                  {!companyNamesIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.companyNames}
                    </p>
                  )}
                </Form.Group>

                <Form.Group as={Col} md="3">
                  <Form.Label className="required-field">
                    بخش های مورد نیاز:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="softwareReqRequireParts"
                    value={softwareReqRequireParts}
                    onChange={(e) => {
                      dispatch(RsetSoftwareReqRequireParts(e.target.value));
                    }}
                  />
                  {!requirePartsIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.softwareReqRequireParts}
                    </p>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="1">
                  <Button
                    onClick={addTableHandler}
                    size="md"
                    className="mt4 font18 btn-primary light-text mt-4 ps-3 pe-3"
                  >
                    +
                  </Button>
                </Form.Group>
              </Row>
            </div>
          ) : (
            <Row>
              <Form.Group as={Col} md="2" className="mb-4 mt-4">
                <Form.Check
                  label="همکاران من"
                  name="group1"
                  type="radio"
                  onClick={() => {
                    dispatch(handleSoftwareCoUsersLists());
                    dispatch(RsetRadioCheck(true));
                    dispatch(RsetSoftwareReqToPersonByRoles(""));
                    dispatch(RsetFormErrors(""));
                  }}
                  defaultChecked
                />
                <Form.Check
                  label="همکاران شرکت من"
                  name="group1"
                  type="radio"
                  onClick={() => {
                    dispatch(handleSoftwareToPersonByRolesLists());
                    dispatch(RsetRadioCheck(false));
                    dispatch(RsetSoftwareReqCoUsers(""));
                    dispatch(RsetFormErrors(""));
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} md="" className="mb-4 mt-2">
                <Form.Label className="required-field">
                  نام و نام خانوادگی:{" "}
                </Form.Label>
                <Select
                  value={
                    radioCheck ? softwareReqCoUsers : softwareReqToPersonByRoles
                  }
                  name="users"
                  onChange={(e) => {
                    radioCheck
                      ? dispatch(RsetSoftwareReqCoUsers(e))
                      : dispatch(RsetSoftwareReqToPersonByRoles(e));
                  }}
                  placeholder="انتخاب..."
                  softwareToPersonByRolesOption
                  options={
                    radioCheck
                      ? softwareCoUsersOption
                      : softwareToPersonByRolesOption
                  }
                />
                {radioCheck
                  ? !coUsersIsValid && (
                      <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.softwareReqCoUsers}
                      </p>
                    )
                  : !toPersonByRolesIsValid && (
                      <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.softwareReqToPersonByRoles}
                      </p>
                    )}
              </Form.Group>
            </Row>
          )}

          {!softwareToggleHandler && softwareReqItems.length !== 0 && (
            <Table striped bordered hover responsive className="mt-5">
              <thead className="bg-secondary light-text">
                <tr>
                  <th>ردیف</th>
                  <th>نام نرم افزار</th>
                  <th>شرکت عامل</th>
                  <th>موارد مورد نیاز</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {softwareReqItems.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td className="font12">{idx + 1}</td>
                      <td className="font12">
                        {item.name
                          .map((i) => {
                            return i.label;
                          })
                          .join("، ")}
                      </td>
                      <td className="font12">
                        {item.companies
                          .map((i) => {
                            return i.label;
                          })
                          .join("، ")}
                      </td>
                      <td className="font12">{item.require}</td>
                      <td className="font12 text-center">
                        <FontAwesomeIcon
                          onClick={() => {
                            dispatch(handleDeleteItem(item.id));
                          }}
                          className="text-danger cursorPointer"
                          icon={faTrashCan}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <Row>
            <Form.Group as={Col} md="12" className="mt-5 mb-4">
              <Form.Label className="mb-1">توضیحات: </Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                maxLength={2000}
                name="softwareReqDescription"
                value={softwareReqDescription}
                onChange={(e) => {
                  dispatch(RsetSoftwareReqDescription(e.target.value));
                }}
              />
            </Form.Group>
          </Row>
          <Row>
            <Col
              md="5"
              xl="4"
              className="mx-auto d-flex justify-content-between mt-4"
            >
              <Button
                variant="success"
                className="w-45 mb-3"
                disabled={
                  softwareToggleHandler === false &&
                  softwareReqItems.length === 0
                    ? true
                    : false
                }
                onClick={(e) => {
                  if (user.Supervisor.FirstName !== "نامشخص") {
                    submitHandler(e);
                    dispatch(RsetSoftwareReqItems(""));
                  } else {
                    errorMessage("سرپرست انتخاب نشده!");
                  }
                }}
              >
                ثبت درخواست
              </Button>
              <Button
                variant="secondary"
                type="reset"
                className="w-45 mb-3"
                onClick={() => {
                  dispatch(handleSoftwareReset());
                  dispatch(RsetSoftwareReqItems(""));
                  if (softwareToggleHandler) {
                    dispatch(RsetSoftwareToggleHandler(false));
                  }
                  dispatch(RsetRadioCheck(true));
                  dispatch(RsetSoftwareReqDescription(""));
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
export default SoftwareReqRegistration;
