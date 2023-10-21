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
  handleTabs,
} from "../../Slices/filterSlices";
import NumberFormat from "react-number-format";
import {
  handleReqsList,
  handleDepartments,
  handleUserData,
  selectUser,
  selectRequestMemb,
  selectActiveTab,
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
  const activeTab = useSelector(selectActiveTab);

  useEffect(() => {
    dispatch(handleAllStatuses(6));
  }, []);

  useEffect(() => {
    if (user.Location !== undefined) {
      dispatch(handleDepartments());
    }
  }, [user]);


  return (
    <div className="d-flex flex-column  mb-5 lightGray2-bg p-3 borderRadius m-auto shadow border border-white border-2">
      <Row className="align-items-center py-2">
        <Form.Group className="d-flex align-items-center mb-3">
          <Form.Switch
            type="checkbox"
            name="realFilter"
            value={realFilter}
            checked={realFilter}
            onChange={() => {
              dispatch(RsetRealFilter(!realFilter));
            }}
          />
          <Form.Label className="font12 mb-0"> فیلتر لحظه ای </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="3" xxl="2" className="mb-4 mb-xxl-0">
          <Form.Label htmlFor="serial">سریال</Form.Label>
          <NumberFormat
            dir="ltr"
            id="serial"
            type="text"
            maxLength={6}
            className="form-control"
            value={serialFilter}
            onChange={async (e) => {
              dispatch(RsetSerialFilter(e.target.value));
              const handleFilterGroup = await dispatch(handleTabs());
              if (realFilter === true) {
                if (activeTab !== "") {
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
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                }
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xxl="3" className="mb-4 mb-xxl-0">
          <Form.Label htmlFor="reqPer">درخواست کننده</Form.Label>
          <Select
            type="text"
            name="softwareReqRequireParts"
            value={userFilter}
            onChange={async (e) => {
              const handleFilterGroup = await dispatch(handleTabs());

              dispatch(RsetUserFilter(e));
              if (realFilter === true) {
                if (activeTab !== "") {
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
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                }
              }
            }}
            options={requestMembs}
            placeholder="انتخاب کنید..."
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xxl="3" className="mb-4 mb-xxl-0">
          <Form.Label htmlFor="reqCon">وضعیت درخواست</Form.Label>
          <Select
            type="text"
            name="softwareReqRequireParts"
            value={statusFilter}
            onChange={async (e) => {
              const handleFilterGroup = await dispatch(handleTabs());

              dispatch(RsetStatusFilter(e));
              if (realFilter === true) {
                if (activeTab !== "") {
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
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                }
              }
            }}
            options={statusOptions}
            placeholder="انتخاب کنید..."
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xxl="2" className="mb-4 mb-xl-0">
          <Form.Label>از تاریخ درخواست</Form.Label>
          <DatePicker
            timePicker={false}
            showTodayButton={false}
            isGregorian={false}
            value={fromDateFilter}
            onChange={async (value) => {
              const handleFilterGroup = await dispatch(handleTabs());

              dispatch(RsetFromDateFilter(value));
              if (realFilter === true) {
                if (activeTab !== "") {
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
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                }
              }
            }}
            className="form-control"
            inputReadOnly
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xxl="2" className="mb-4 mb-xl-0">
          <Form.Label>تا تاریخ درخواست</Form.Label>
          <DatePicker
            timePicker={false}
            showTodayButton={false}
            isGregorian={false}
            value={toDateFilter}
            onChange={async (value) => {
              const handleFilterGroup = await dispatch(handleTabs());

              dispatch(RsetToDateFilter(value));
              if (realFilter === true) {
                if (activeTab !== "") {
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
                      value !== null ? value.format("YYYY/MM/DD") : "null",
                    type: 6,
                    mDep: depFilter.value,
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                }
              }
            }}
            className="form-control overflow-auto"
            inputReadOnly
          />
        </Form.Group>
      </Row>
      <Row>
        <Col md="4" lg="3" xl="3" className="mt-4 ms-auto">
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              className="mb-1  font10"
              size="lg"
              onClick={async () => {
                const handleFilterGroup = await dispatch(handleTabs());
                console.log(handleFilterGroup);
                if (activeTab !== "") {
                  const filterValues = {
                    applicantId: localStorage.getItem("id"),
                    serial: serialFilter !== "" ? serialFilter : serialFilter,
                    memberId: userFilter !== "" ? userFilter.value : userFilter,
                    status:
                      statusFilter !== "" ? statusFilter.value : statusFilter,
                    fromDate:
                      fromDateFilter !== null
                        ? fromDateFilter.format("YYYY/MM/DD")
                        : "null",
                    toDate:
                      toDateFilter !== null
                        ? toDateFilter.format("YYYY/MM/DD")
                        : "null",
                    type: 6,
                    mDep: depFilter ? depFilter.value : "",
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                  console.log(filterValues);
                }
              }}
            >
              اعمال فیلتر
            </Button>
            <Button
              variant="secondary"
              type="reset"
              className="mb-1 ms-2 font10"
              size="lg"
              onClick={async () => {
                dispatch(handleSoftwareFilterReset());
                const handleFilterGroup = await dispatch(handleTabs());
                if (activeTab !== "") {
                  const filterValues = {
                    applicantId: localStorage.getItem("id"),
                    serial: "",
                    memberId: "",
                    status: "",
                    fromDate: "null",
                    toDate: "null",
                    type: 6,
                    mDep: "",
                    group: handleFilterGroup.payload,
                  };
                  dispatch(handleReqsList(filterValues));
                }
              }}
            >
              لغو فیلتر
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SoftwareReqFilter;
