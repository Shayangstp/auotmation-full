import React, { Fragment, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import Select from "react-select";
import xssFilters from "xss-filters";

import { rootContext } from "../context/rootContext";
import {
  selectUser,
  handleReqsList,
  selectRequestMemb,
} from "../Slices/mainSlices";
import { checkAccOrRejRequest } from "../../Services/warehouseReqService";
import { RsetActionsFilter, selectActionsFilter } from "../Slices/filterSlices";

const ReqItem = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const requestMemb = useSelector(selectRequestMemb);
  const mainContext = useContext(rootContext);

  const actionsFilter = useSelector(selectActionsFilter);

  const {
    handleAllStatuses,
    allStatuses,
    handleGetCoDepartments,
    coDepartmentsWithAll,
    userIdFilterSelect,
    setUserIdFilterSelect,
    departmentIdFilterSelect,
    setDepartmentIdFilterSelect,
    statusIdFilterSelect,
    setStatusIdFilterSelect,
    fromDateFilter,
    setFromDateFilter,
    toDateFilter,
    setToDateFilter,
    realFilter,
    setRealFilter,
    handleCancelFilter,
    usersFilterSelect,
  } = mainContext;

  useEffect(() => {
    handleAllStatuses(2);
  }, []);

  useEffect(() => {
    if (user.Location !== undefined && user.Location !== null) {
      handleGetCoDepartments(user.CompanyCode, user.Location);
    }
  }, [user]);

  return (
    <div className="d-flex flex-column  mb-5 lightGray2-bg p-3 borderRadius m-auto shadow borderWhite">
      <Row className="justify-content-start py-2">
        <div className="d-flex">
          <Form.Group className="d-flex align-items-center mb-4 justify-content-end">
            <Form.Switch
              type="checkbox"
              name="realFilterReq"
              value={realFilter}
              checked={realFilter}
              onChange={() => {
                setRealFilter(!realFilter);
              }}
            />
            <Form.Label className="ms-1 font12 mb-0">
              {" "}
              فیلتر لحظه ای{" "}
            </Form.Label>
          </Form.Group>
          {/* <Form.Group className="d-flex align-items-center mb-3 justify-content-end ms-2">
            <input
              className=""
              type="checkbox"
              name="realFilterReq"
              value={actionsFilter}
              checked={actionsFilter ? true : false}
              onChange={() => {
                dispatch(RsetActionsFilter(!actionsFilter));
              }}
            />

            <Form.Label className="ms-2 font12 mb-0">کارتابل وظایف </Form.Label>
          </Form.Group> */}
        </div>
        <Form.Group as={Col} md="4" xl="2" className="mb-4 mb-xl-0">
          <Form.Label id="firstname" className="mb-1">
            درخواست کننده :
          </Form.Label>
          <Select
            id="members"
            placeholder="همه"
            isSearchable
            value={userIdFilterSelect}
            options={requestMemb}
            onChange={(option) => {
              setUserIdFilterSelect(option);
              if (realFilter) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  memberId: option !== "" ? option.value : option,
                  mDep:
                    departmentIdFilterSelect !== ""
                      ? departmentIdFilterSelect.value
                      : departmentIdFilterSelect,
                  status:
                    statusIdFilterSelect !== ""
                      ? statusIdFilterSelect.value
                      : statusIdFilterSelect,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 2,
                  all: actionsFilter ? 0 : 1,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xl="2" className="mb-4 mb-xl-0">
          <Form.Label id="firstname" className="mb-1">
            واحد سازمانی :
          </Form.Label>
          <Select
            id="deps"
            placeholder="همه"
            isSearchable
            value={departmentIdFilterSelect}
            options={coDepartmentsWithAll}
            onChange={(option) => {
              setDepartmentIdFilterSelect(option);
              if (realFilter) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  mDep: option !== "" ? option.value : option,
                  status:
                    statusIdFilterSelect !== ""
                      ? statusIdFilterSelect.value
                      : statusIdFilterSelect,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 2,
                  all: actionsFilter ? 0 : 1,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xl="2" className="mb-4 mb-xl-0">
          <Form.Label id="firstname" className="mb-1">
            وضعیت درخواست:
          </Form.Label>
          <Select
            id="stauses"
            placeholder="همه"
            isSearchable
            value={statusIdFilterSelect}
            options={allStatuses}
            onChange={(option) => {
              setStatusIdFilterSelect(option);
              if (realFilter) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  mDep:
                    departmentIdFilterSelect !== ""
                      ? departmentIdFilterSelect.value
                      : departmentIdFilterSelect,
                  status: option !== "" ? option.value : option,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 2,
                  all: actionsFilter ? 0 : 1,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xl="3" className="mb-4 mb-md-0">
          <Form.Label id="fromDate" className="mb-1">
            از تاریخ درخواست :
          </Form.Label>
          <DatePicker
            inputReadOnly
            name="from_date"
            isGregorian={false}
            timePicker={false}
            inputFormat="YYYY-MM-DD"
            value={fromDateFilter}
            className="form-control"
            onChange={(value) => {
              setFromDateFilter(value);
              if (realFilter) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  mDep:
                    departmentIdFilterSelect !== ""
                      ? departmentIdFilterSelect.value
                      : departmentIdFilterSelect,
                  status:
                    statusIdFilterSelect !== ""
                      ? statusIdFilterSelect.value
                      : statusIdFilterSelect,
                  fromDate:
                    value !== null ? value.format("YYYY/MM/DD") : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 2,
                  all: actionsFilter ? 0 : 1,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xl="3" className="mb-4 mb-md-0">
          <Form.Label id="toDate" className="mb-1">
            تا تاریخ درخواست :
          </Form.Label>
          <DatePicker
            inputReadOnly
            name="from_date"
            isGregorian={false}
            timePicker={false}
            inputFormat="YYYY-MM-DD"
            value={toDateFilter}
            className="form-control"
            onChange={(value) => {
              setToDateFilter(value);
              if (realFilter) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  mDep:
                    departmentIdFilterSelect !== ""
                      ? departmentIdFilterSelect.value
                      : departmentIdFilterSelect,
                  status:
                    statusIdFilterSelect !== ""
                      ? statusIdFilterSelect.value
                      : statusIdFilterSelect,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate: value !== null ? value.format("YYYY/MM/DD") : "null",
                  type: 2,
                  all: actionsFilter ? 0 : 1,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
          />
        </Form.Group>
      </Row>
      <Row className="justify-content-end mt-4">
        <Col md="4" xl="3">
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              className="font12"
              onClick={() => {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  mDep:
                    departmentIdFilterSelect !== ""
                      ? departmentIdFilterSelect.value
                      : departmentIdFilterSelect,
                  status:
                    statusIdFilterSelect !== ""
                      ? statusIdFilterSelect.value
                      : statusIdFilterSelect,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 2,
                  all: actionsFilter ? 0 : 1,
                };
                dispatch(handleReqsList(filterValues));
              }}
            >
              اعمال فیلتر
            </Button>
            <Button
              variant="secondary"
              className="font12 ms-1"
              onClick={() => handleCancelFilter("warehouse")}
            >
              لغو فیلتر
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReqItem;
