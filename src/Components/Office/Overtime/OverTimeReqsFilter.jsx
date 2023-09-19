import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  handleReqsList, selectAllDepartmentsSelect, selectRequestMemb, handleDepartments,
  selectUser, RsetRealFilter, selectRealFilter, selectActiveTab
} from "../../Slices/mainSlices";
import {
  RsetToDate,
  RsetFromDate,
  RsetUserListValue,
  selectDepartmant,
  selectEndDate,
  selectStartDate,
  selectStatus,
  selectUserRequestFilter,
  RsetDepartemant,
  RsetStatus,
  handleResetOverTimeFilter
} from "../../Slices/OverTimeSlice";
import { handlStatusesCheckout, selectAllStatus } from "../../Slices/TableCheckoutSlice";
const OverTimeReqsFilter = () => {

  const dispatch = useDispatch();

  const realFilter = useSelector(selectRealFilter);
  const allDepartmentsSelect = useSelector(selectAllDepartmentsSelect);
  const requestMembs = useSelector(selectRequestMemb);
  const allStatuses = useSelector(selectAllStatus);
  const fromDate = useSelector(selectStartDate);
  const toDate = useSelector(selectEndDate);
  const status = useSelector(selectStatus);
  const dep = useSelector(selectDepartmant);
  const reqLists = useSelector(selectUserRequestFilter);
  const user = useSelector(selectUser);
  const activeTab = useSelector(selectActiveTab);

  useEffect(() => {
    dispatch(handlStatusesCheckout());
  }, [])

  useEffect(() => {
    if (user.FirstName !== undefined) {
      dispatch(handleDepartments());
    }
  }, [user.FirstName !== undefined])

  const handleFilterGroup = () => {
    if (activeTab === 'myReqs') {
        return 2
    } else if (activeTab === 'inProcessReqs') {
        return 0
    } else if (activeTab === 'allReqs') {
        return 1
    }
}

  return (
    <section>
      <Form>
        <Row>
          <Col lg="3">
            <Form.Label> درخواست کننده: </Form.Label>
            <Select
              className="mb-3"
              value={reqLists}
              onChange={(e) => {
                dispatch(RsetUserListValue(e));
                if (realFilter) {
                  if (activeTab !== '') {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        memberId: e !== "" ? e.value : e,
                        mDep: dep !== "" ? dep.value : dep,
                        status: status !== "" ? status.value : status,
                        fromDate: fromDate !== null ? fromDate.format("YYYY/MM/DD") : 'null',
                        toDate: toDate !== null ? toDate.format("YYYY/MM/DD") : 'null',
                        type: 14,
                        group: handleFilterGroup()
                      };
                      dispatch(handleReqsList(filterValues));
                  }
                }
              }}
              options={requestMembs}
              placeholder="انتخاب"
            />
          </Col>
          <Col lg="3">
            <Form.Label> واحد: </Form.Label>
            <Select
              className="mb-3"
              value={dep}
              onChange={(e) => {
                dispatch(RsetDepartemant(e));
                if (realFilter) {
                  if (activeTab !== '') {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        memberId: reqLists !== "" ? reqLists.value : reqLists,
                        mDep: e !== "" ? e.value : e,
                        status: status !== "" ? status.value : status,
                        fromDate: fromDate !== null ? fromDate.format("YYYY/MM/DD") : 'null',
                        toDate: toDate !== null ? toDate.format("YYYY/MM/DD") : 'null',
                        type: 14,
                        group: handleFilterGroup()
                      };
                      dispatch(handleReqsList(filterValues));
                  }
                }
              }}
              options={allDepartmentsSelect}
              placeholder="جستجو . . ."
            />
          </Col>
          <Col lg="3">
            <Form.Label> وضعیت درخواست: </Form.Label>
            <Select
              className="mb-3"
              value={status}
              onChange={(e) => {
                dispatch(RsetStatus(e));
                if (realFilter) {
                  if (activeTab !== '') {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        memberId: reqLists !== "" ? reqLists.value : reqLists,
                        mDep: dep !== "" ? dep.value : dep,
                        status: e !== "" ? e.value : e,
                        fromDate: fromDate !== null ? fromDate.format("YYYY/MM/DD") : 'null',
                        toDate: toDate !== null ? toDate.format("YYYY/MM/DD") : 'null',
                        type: 14,
                        group: handleFilterGroup()
                      };
                      dispatch(handleReqsList(filterValues));
                  }
                }
              }}
              options={allStatuses}
              placeholder="انتخاب"
            />
          </Col>
          <Col lg="3">
            <Form.Label> تاریخ شروع: </Form.Label>
            <DatePicker
              persianDigits={false}
              isGregorian={false}
              timePicker={false}
              value={fromDate}
              onChange={(e) => {
                dispatch(RsetFromDate(e));
                if (realFilter) {
                  if (activeTab !== '') {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        memberId: reqLists !== "" ? reqLists.value : reqLists,
                        mDep: dep !== "" ? dep.value : dep,
                        status: status !== "" ? status.value : status,
                        fromDate: e !== null ? e.format("YYYY/MM/DD") : 'null',
                        toDate: toDate !== null ? toDate.format("YYYY/MM/DD") : 'null',
                        type: 14,
                        group: handleFilterGroup()
                      };
                      dispatch(handleReqsList(filterValues));
                  }
                }
              }}
              className="form-control mb-3"
            />
          </Col>
          <Col lg="3">
            <Form.Label> تاریخ پایان: </Form.Label>
            <DatePicker
              value={toDate}
              onChange={(e) => {
                dispatch(RsetToDate(e));
                if (realFilter) {
                  if (activeTab !== '') {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        memberId: reqLists !== "" ? reqLists.value : reqLists,
                        mDep: dep !== "" ? dep.value : dep,
                        status: status !== "" ? status.value : status,
                        fromDate: fromDate !== null ? fromDate.format("YYYY/MM/DD") : 'null',
                        toDate: e !== null ? e.format("YYYY/MM/DD") : 'null',
                        type: 14,
                        group: handleFilterGroup()
                      };
                      dispatch(handleReqsList(filterValues));
                  }
                }
              }}
              persianDigits={false}
              isGregorian={false}
              timePicker={false}
              className="form-control mb-3"
            />
          </Col>
          <Col lg="3">
            <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
              <input className="" type='checkbox' name='realFilter' value={realFilter} checked={realFilter} onChange={() => { dispatch(RsetRealFilter(!realFilter)) }} />
              <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button onClick={() => {
                if (activeTab !== '') {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      memberId: reqLists !== "" ? reqLists.value : reqLists,
                      mDep: dep !== "" ? dep.value : dep,
                      status: status !== "" ? status.value : status,
                      fromDate: fromDate !== null ? fromDate.format("YYYY/MM/DD") : 'null',
                      toDate: toDate !== null ? toDate.format("YYYY/MM/DD") : 'null',
                      type: 14,
                      group: handleFilterGroup()
                    };
                    dispatch(handleReqsList(filterValues));
                }
              }} className="me-1 font12" variant="success">
                اعمال فیلتر
              </Button>
              <Button onClick={() => {
                dispatch(handleResetOverTimeFilter())
              }} variant="secondary" className='font12'>
                لغو فیلتر
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

export default OverTimeReqsFilter;
