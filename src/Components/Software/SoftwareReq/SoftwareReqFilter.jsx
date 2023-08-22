import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import Select from "react-select";
import {
  selectSerialFilter,
  RsetSerialFilter,
  selectUserFilter,
  RsetUserFilter,
  RsetStatusFilter,
  selectStatusFilter,
  selectDepFilter,
  RsetDepFilter,
  selectFromDateFilter,
  RsetFromDateFilter,
  selectToDateFilter,
  RsetToDateFilter,
  selectRealFilter,
  RsetRealFilter,
  selectFilterData,
  RsetFilterData,
  RsetFilter,
  selectDepOptions,
  selectStatusOptions,
  handleAllStatuses,
} from "../../Slices/filterSlices";
import NumberFormat from "react-number-format";
import {
  handleReqsList,
  handleDepartments,
  handleUserData,
  selectUser,
  selectRequestMemb,
} from "../../Slices/mainSlices";
import { handleSoftwareFilterReset } from "../../Slices/softwareSlice";

const SoftwareReqFilter = () => {
  const dispatch = useDispatch();
  const serialFilter = useSelector(selectSerialFilter);
  const userFilter = useSelector(selectUserFilter);
  const statusFilter = useSelector(selectStatusFilter);
  const fromDateFilter = useSelector(selectFromDateFilter);
  const toDateFilter = useSelector(selectToDateFilter);
  const realFilter = useSelector(selectRealFilter);
  const filterData = useSelector(selectFilterData);
  const requestMembs = useSelector(selectRequestMemb);
  const depFilter = useSelector(selectDepFilter);
  const statusOptions = useSelector(selectStatusOptions);
  const depOptions = useSelector(selectDepOptions);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(handleAllStatuses(6));
  }, []);

  useEffect(() => {
    if (user.Location !== undefined) {
      dispatch(handleDepartments());
    }
  }, [user]);

  return (
    <Row className='align-items-center mb-5'>
      <Form.Group as={Col} md="4" xxl='2' className="mb-4 mb-xxl-0">
        <Form.Label htmlFor="serial">سریال</Form.Label>
        <NumberFormat
          dir="ltr"
          id="serial"
          type="text"
          maxLength={6}
          className="form-control"
          value={serialFilter}
          onChange={(e) => {
            dispatch(RsetSerialFilter(e.target.value));
            if (realFilter === true) {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: e.target.value.length === 6 ? e.target.value : "",
                memberId: userFilter.value,
                status: statusFilter.value,
                fromDate:
                  fromDateFilter !== null
                    ? fromDateFilter.format("YYYY/MM/DD")
                    : "null",
                toDate:
                  toDateFilter !== null
                    ? toDateFilter.format("YYYY/MM/DD")
                    : "null",
                type: 6,
                mDep: depFilter.value,
              };
              dispatch(handleReqsList(filterValues));
            }
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md="4" xxl='2' className="mb-4 mb-xxl-0">
        <Form.Label htmlFor="reqPer">درخواست کننده</Form.Label>
        <Select
          type="text"
          name="softwareReqRequireParts"
          value={userFilter}
          onChange={(e) => {
            dispatch(RsetUserFilter(e));
            if (realFilter === true) {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: serialFilter,
                memberId: e.value,
                status: statusFilter.value,
                fromDate:
                  fromDateFilter !== null
                    ? fromDateFilter.format("YYYY/MM/DD")
                    : "null",
                toDate:
                  toDateFilter !== null
                    ? toDateFilter.format("YYYY/MM/DD")
                    : "null",
                type: 6,
                mDep: depFilter.value,
              };
              dispatch(handleReqsList(filterValues));
            }
          }}
          options={requestMembs}
          placeholder="انتخاب کنید..."
        />
      </Form.Group>
      <Form.Group as={Col} md="4" xxl='2' className="mb-4 mb-xxl-0">
        <Form.Label htmlFor="reqCon">وضعیت درخواست</Form.Label>
        <Select
          type="text"
          name="softwareReqRequireParts"
          value={statusFilter}
          onChange={(e) => {
            dispatch(RsetStatusFilter(e));
            if (realFilter === true) {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: serialFilter,
                memberId: userFilter.value,
                status: e.value,
                fromDate:
                  fromDateFilter !== null
                    ? fromDateFilter.format("YYYY/MM/DD")
                    : "null",
                toDate:
                  toDateFilter !== null
                    ? toDateFilter.format("YYYY/MM/DD")
                    : "null",
                type: 6,
                mDep: depFilter.value,
              };
              dispatch(handleReqsList(filterValues));
            }
          }}
          options={statusOptions}
          placeholder="انتخاب کنید..."
        />
      </Form.Group>
      {/* <Form.Group as={Col} md="4" xxl='2' className="m-3 mb-xxl-0">
          <Form.Label htmlFor="reqCon"> واحد درخواست کننده</Form.Label>
          <Select
            type="text"
            name="softwareReqRequireParts"
            options={depOptions}
            value={depFilter}
            onChange={(e) => {
              dispatch(RsetDepFilter(e));
              if (realFilter === true) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: serialFilter,
                  memberId: userFilter.value,
                  status: statusFilter.value,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 6,
                  mDep: e.value,
                };
                dispatch(handleReqsList(filterValues));
              }
            }}
            placeholder="انتخاب کنید..."
          />
        </Form.Group> */}
      <Form.Group as={Col} md="4" xxl='2' className="mb-4 mb-xl-0">
        <Form.Label>از تاریخ درخواست</Form.Label>
        <DatePicker
          timePicker={false}
          showTodayButton={false}
          isGregorian={false}
          value={fromDateFilter}
          onChange={(value) => {
            dispatch(RsetFromDateFilter(value));
            if (realFilter === true) {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: serialFilter,
                memberId: userFilter.value,
                status: statusFilter.value,
                fromDate:
                  value !== null ? value.format("YYYY/MM/DD") : "null",
                toDate:
                  toDateFilter !== null
                    ? toDateFilter.format("YYYY/MM/DD")
                    : "null",
                type: 6,
                mDep: depFilter.value,
              };
              dispatch(handleReqsList(filterValues));
            }
          }}
          className="form-control"
          inputReadOnly
        />
      </Form.Group>
      <Form.Group as={Col} md="4" xxl='2' className="mb-4 mb-xl-0">
        <Form.Label>تا تاریخ درخواست</Form.Label>
        <DatePicker
          timePicker={false}
          showTodayButton={false}
          isGregorian={false}
          value={toDateFilter}
          onChange={(value) => {
            dispatch(RsetToDateFilter(value));
            if (realFilter === true) {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: serialFilter,
                memberId: userFilter.value,
                status: statusFilter.value,
                fromDate:
                  fromDateFilter !== null
                    ? fromDateFilter.format("YYYY/MM/DD")
                    : "null",
                toDate: value !== null ? value.format("YYYY/MM/DD") : "null",
                type: 6,
                mDep: depFilter.value,
              };
              dispatch(handleReqsList(filterValues));
            }
          }}
          className="form-control overflow-auto"
          inputReadOnly
        />
      </Form.Group>
      <Col md='4' xxl='2' className='mt-3 mt-xxl-0'>
        <Form.Group className="d-flex justify-content-end mb-3 align-items-center">
          <Form.Check
            type="checkbox"
            id="filter"
            value={realFilter}
            checked={realFilter}
            onChange={() => {
              dispatch(RsetRealFilter(!realFilter));
            }}
          />
          <Form.Label className="font12 ms-2 ">فیلترلحظه ای</Form.Label>
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button
            variant="success"
            className="mb-1  font10"
            size="lg"
            onClick={() => {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: serialFilter,
                memberId: userFilter.value,
                status: statusFilter.value,
                fromDate:
                  fromDateFilter !== null
                    ? fromDateFilter.format("YYYY/MM/DD")
                    : "null",
                toDate:
                  toDateFilter !== null
                    ? toDateFilter.format("YYYY/MM/DD")
                    : "null",
                type: 6,
                mDep: depFilter.value,
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
              dispatch(handleSoftwareFilterReset());
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                serial: "",
                memberId: "",
                status: "",
                fromDate: "null",
                toDate: "null",
                type: 6,
                mDep: "",
              };
              dispatch(handleReqsList(filterValues));
            }}
          >
            لغو فیلتر
            </Button>
        </div></Col>
    </Row>
  );
};

export default SoftwareReqFilter;
