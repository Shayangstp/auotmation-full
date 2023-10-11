import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Table,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import Select from "react-select";
import {
  selectCheckoutReqPersonNameOption,
  selectCheckoutReqLeavingWorkReasonOption,
  selectCheckoutReqDepartmentOption,
  handleLeavingWorkReason,
  handleFilterReset,
} from "../Slices/checkoutReqSlices";
import {
  handleCompaniesList,
  handleUserData,
  selectUser,
  selectCompaniesOption,
  handleAllStatuses,
  handleDepartments,
  handleAllUsers,
} from "../Slices/mainSlices";
import {
  selectCheckoutFilterSerial,
  RsetCheckoutFilterSerial,
  selectCheckoutFilterUser,
  RsetCheckoutFilterUser,
  selectCheckoutFilterLeavingReason,
  RsetCheckoutFilterLeavingReason,
  selectCheckoutFilterDepartment,
  RsetCheckoutFilterDepartment,
  selectCheckoutFilterStatus,
  RsetCheckoutFilterStatus,
  selectCheckoutFilterFromDate,
  RsetCheckoutFilterFromDate,
  selectCheckoutFilterToDate,
  RsetCheckoutFilterToDate,
  selectStatusOptions,
  selectDepOptions,
  selectRealFilter,
  RsetRealFilter,
} from "../Slices/filterSlices";

import { handleReqsList } from "../Slices/mainSlices";

const CheckoutReqFilter = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(handleAllUsers());
  }, [user]);

  useEffect(() => {
    dispatch(handleLeavingWorkReason());
    dispatch(handleAllStatuses(10));
    dispatch(handleCompaniesList());
  }, []);

  useEffect(() => {
    if (user.Location !== undefined) {
      dispatch(handleDepartments());
    }
  }, [user]);

  const checkoutReqPersonNameOption = useSelector(
    selectCheckoutReqPersonNameOption
  );
  const checkoutReqLeavingWorkReasonOption = useSelector(
    selectCheckoutReqLeavingWorkReasonOption
  );
  const checkoutReqDepartmentOption = useSelector(
    selectCheckoutReqDepartmentOption
  );
  const statusFilterOption = useSelector(selectStatusOptions);
  const deptFilterOption = useSelector(selectDepOptions);
  const checkoutFilterUser = useSelector(selectCheckoutFilterUser);
  const checkoutFilterDepartment = useSelector(selectCheckoutFilterDepartment);
  const checkoutFilterLeavingReason = useSelector(
    selectCheckoutFilterLeavingReason
  );
  const checkoutFilterSerial = useSelector(selectCheckoutFilterSerial);
  const checkoutFilterStatus = useSelector(selectCheckoutFilterStatus);
  const checkoutFilterFromDate = useSelector(selectCheckoutFilterFromDate);
  const checkoutFilterToDate = useSelector(selectCheckoutFilterToDate);

  const realFilter = useSelector(selectRealFilter);

  return (
    <Container fluid className="py-4">
      <Row className="mb-2 mt-4">
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-0 mb-md-4">
          <Form.Label htmlFor="serial">سریال</Form.Label>
          <NumberFormat
            dir="ltr"
            id="serial"
            type="text"
            maxLength={6}
            className="form-control"
            value={checkoutFilterSerial}
            onChange={(e) => {
              dispatch(RsetCheckoutFilterSerial(e.target.value));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: e.target.value.length === 6 ? e.target.value : "",
                  leaverId: checkoutFilterUser.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-0 mb-md-4">
          <Form.Label htmlFor="materialCode">پرسنل:</Form.Label>
          <Select
            value={checkoutFilterUser}
            onChange={(e) => {
              dispatch(RsetCheckoutFilterUser(e));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: e.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            placeholder="انتخاب..."
            options={checkoutReqPersonNameOption}
            isSearchable={true}
          />
        </Form.Group>
        <Form.Group as={Col} md="5" xl="4" className="mb-4 mb-xl-0 mb-md-4">
          <Form.Label htmlFor="materialName">علت ترک کار:</Form.Label>
          <Select
            value={checkoutFilterLeavingReason}
            onChange={(e) => {
              dispatch(RsetCheckoutFilterLeavingReason(e));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: checkoutFilterUser.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: e.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            placeholder="انتخاب..."
            options={checkoutReqLeavingWorkReasonOption}
            isSearchable={true}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xl="2" className="mb-4 mb-xl-0 mb-lg-2">
          <Form.Label htmlFor="materialCode"> واحد:</Form.Label>
          <Select
            value={checkoutFilterDepartment}
            onChange={(e) => {
              dispatch(RsetCheckoutFilterDepartment(e));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: checkoutFilterUser.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: e.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            placeholder="انتخاب..."
            options={deptFilterOption}
            isSearchable={true}
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-4 mb-lg-2">
          <Form.Label>وضعیت درخواست:</Form.Label>
          <Select
            value={checkoutFilterStatus}
            onChange={(e) => {
              dispatch(RsetCheckoutFilterStatus(e));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: checkoutFilterUser.value,
                  status: e.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            placeholder="انتخاب..."
            options={statusFilterOption}
            isSearchable={true}
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-4 mb-lg-2">
          <Form.Label>ازتاریخ:</Form.Label>
          <DatePicker
            className="form-control"
            timePicker={false}
            id="date"
            name="fromDate"
            showTodayButton={false}
            isGregorian={false}
            value={checkoutFilterFromDate}
            onChange={(value) => {
              dispatch(RsetCheckoutFilterFromDate(value));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: checkoutFilterUser.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    value !== null ? value.format("YYYY/MM/DD") : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            inputReadOnly
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-4 mb-lg-2">
          <Form.Label>تا تاریخ:</Form.Label>
          <DatePicker
            className="form-control"
            timePicker={false}
            id="date"
            name="toDate"
            showTodayButton={false}
            isGregorian={false}
            value={checkoutFilterToDate}
            onChange={(value) => {
              dispatch(RsetCheckoutFilterToDate(value));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: checkoutFilterUser.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate: value !== null ? value.format("YYYY/MM/DD") : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            inputReadOnly
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="3"
          xl="2"
          className="d-flex flex-column justify-xl-end"
        >
          <div className="d-flex">
            <Form.Check
              type="checkbox"
              id="filter"
              value={realFilter}
              checked={realFilter}
              onChange={() => {
                dispatch(RsetRealFilter(!realFilter));
              }}
            />
            <Form.Label className="font12 ms-2">فیلترلحظه ای</Form.Label>
          </div>
          <div className="align-items-end">
            <Button
              variant="success"
              className="mb-1 ms-2 font10"
              size="lg"
              onClick={() => {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: checkoutFilterSerial,
                  leaverId: checkoutFilterUser.value,
                  status: checkoutFilterStatus.value,
                  fromDate:
                    checkoutFilterFromDate !== null
                      ? checkoutFilterFromDate.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    checkoutFilterToDate !== null
                      ? checkoutFilterToDate.format("YYYY/MM/DD")
                      : "null",
                  type: 10,
                  mDep: checkoutFilterDepartment.value,
                  leavingWorkCause: checkoutFilterLeavingReason.value,
                };
                dispatch(handleReqsList(filterValues));
              }}
            >
              اعمال فیلتر
            </Button>
            <Button
              variant="secondary"
              type="reset"
              className="mb-1 ms-2 font10 "
              size="lg"
              onClick={() => {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: "",
                  memberId: "",
                  status: "",
                  fromDate: "null",
                  toDate: "null",
                  type: 10,
                  mDep: "",
                };
                dispatch(handleReqsList(filterValues));
                dispatch(handleFilterReset());
              }}
            >
              لغو فیلتر
            </Button>
          </div>
        </Form.Group>
      </Row>
    </Container>
  );
};

export default CheckoutReqFilter;
