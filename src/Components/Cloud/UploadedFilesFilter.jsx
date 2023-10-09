import React, { Fragment } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
  RsetIsLoadingCheckout,
  RsetRealFilter,
  selectRealFilter,
  selectRequestMemb,
} from "../Slices/mainSlices";
import {
  selectSerialFilter,
  selectFromDateFilter,
  selectToDateFilter,
  RsetSerialFilter,
  selectUserFilter,
  RsetUserFilter,
  RsetFromDateFilter,
  RsetToDateFilter,
} from "../Slices/filterSlices";
import {
  selectUploadSoftwareNameFilter,
  RsetUploadSoftwareNameFilter,
  handleSoftwareNameOption,
  RsetUploadSoftwareNameOption,
  selectUploadSoftwareNameOption,
  handleResetUploadFilters,
} from "../Slices/filesCloudSlice";
import { handleReqsList } from "../Slices/mainSlices";
import { useEffect } from "react";

const UploadedFilesFilter = () => {
  const dispatch = useDispatch();
  const serialFilter = useSelector(selectSerialFilter);
  const fromDateFilter = useSelector(selectFromDateFilter);
  const toDateFilter = useSelector(selectToDateFilter);
  const softwareNameFilter = useSelector(selectUploadSoftwareNameFilter);
  const userFilter = useSelector(selectUserFilter);
  const requestMembs = useSelector(selectRequestMemb);
  const uploadSoftwareNameFilterOption = useSelector(
    selectUploadSoftwareNameOption
  );
  const uploadSoftwareNameFilter = useSelector(selectUploadSoftwareNameFilter);

  const realFilter = useSelector(selectRealFilter);

  useEffect(() => {
    dispatch(handleSoftwareNameOption());
  }, []);

  return (
    <Fragment>
      <Form>
        <div className="d-flex flex-column  mb-5 lightGray2-bg p-3 borderRadius m-auto shadow border border-white border-2">
          <Row>
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
            <Col xl="2">
              <label className="mb-1  mt-4">سریال:</label>
              <NumberFormat
                className="form-control"
                format="######"
                dir="ltr"
                value={serialFilter}
                onChange={(e) => {
                  dispatch(RsetSerialFilter(e.target.value));
                  if (realFilter === true) {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: e.target.value.length === 6 ? e.target.value : "",
                      memberId: userFilter.value,
                      fromDate:
                        fromDateFilter !== null
                          ? fromDateFilter.format("YYYY/MM/DD")
                          : "null",
                      toDate:
                        toDateFilter !== null
                          ? toDateFilter.format("YYYY/MM/DD")
                          : "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }}
              />
            </Col>
            <Col xl="3">
              <label className="mb-1  mt-4">ارسال کننده:</label>
              <Select
                value={userFilter}
                options={requestMembs}
                onChange={(e) => {
                  dispatch(RsetUserFilter(e));
                  if (realFilter === true) {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: serialFilter,
                      memberId: e.value,
                      fromDate:
                        fromDateFilter !== null
                          ? fromDateFilter.format("YYYY/MM/DD")
                          : "null",
                      toDate:
                        toDateFilter !== null
                          ? toDateFilter.format("YYYY/MM/DD")
                          : "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }}
                placeholder="انتخاب"
              />
            </Col>
            <Col xl="3">
              <label className="mb-1 mt-4">نام نرم افزار:</label>
              <Select
                value={uploadSoftwareNameFilter}
                options={uploadSoftwareNameFilterOption}
                onChange={(e) => {
                  dispatch(RsetUploadSoftwareNameFilter(e));
                  if (realFilter === true) {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: serialFilter,
                      memberId: userFilter.value,
                      softwareId: e.value,
                      fromDate:
                        fromDateFilter !== null
                          ? fromDateFilter.format("YYYY/MM/DD")
                          : "null",
                      toDate:
                        toDateFilter !== null
                          ? toDateFilter.format("YYYY/MM/DD")
                          : "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }}
                placeholder="انتخاب"
              />
            </Col>
            <Col xl="2">
              <label className="mb-1 mt-4">از تاریخ:</label>
              <DatePicker
                type="date"
                inputFormat="YYYY-MM-DD"
                pick12HourFormat={false}
                isGregorian={false}
                timePicker={false}
                value={fromDateFilter}
                onChange={(value) => {
                  dispatch(RsetFromDateFilter(value));
                  if (realFilter === true) {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: serialFilter,
                      memberId: userFilter.value,
                      // filename: filename,
                      // softwareNameFilter: e.value,
                      fromDate:
                        value !== null ? value.format("YYYY/MM/DD") : "null",
                      toDate:
                        toDateFilter !== null
                          ? toDateFilter.format("YYYY/MM/DD")
                          : "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }}
                className="form-control"
              />
            </Col>
            <Col xl="2">
              <label className="mb-1 mt-4">تا تاریخ:</label>
              <DatePicker
                value={toDateFilter}
                onChange={(value) => {
                  dispatch(RsetToDateFilter(value));
                  if (realFilter === true) {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: serialFilter,
                      memberId: userFilter.value,
                      // filename: filename,
                      // softwareNameFilter: e.value,
                      fromDate:
                        fromDateFilter !== null
                          ? fromDateFilter.format("YYYY/MM/DD")
                          : "null",
                      toDate:
                        value !== null ? value.format("YYYY/MM/DD") : "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }}
                type="date"
                inputFormat="YYYY-MM-DD"
                pick12HourFormat={false}
                isGregorian={false}
                timePicker={false}
                className="form-control"
              />
            </Col>
            <Col xl="12" className="mt-4">
              <div className=" d-flex justify-content-end">
                <Button
                  onClick={() => {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: serialFilter !== "" ? serialFilter : serialFilter,
                      memberId:
                        userFilter !== "" ? userFilter.value : userFilter,
                      softwareId: uploadSoftwareNameFilter.value,
                      fromDate:
                        fromDateFilter !== null
                          ? fromDateFilter.format("YYYY/MM/DD")
                          : "null",
                      toDate:
                        toDateFilter !== null
                          ? toDateFilter.format("YYYY/MM/DD")
                          : "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                  }}
                  className="me-2 mt-2 font12 "
                  variant="success"
                >
                  اعمال فیلتر
                </Button>
                <Button
                  onClick={() => {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      serial: "",
                      memberId: "",
                      // filename: filename,
                      softwareId: "",
                      fromDate: "null",
                      toDate: "null",
                      type: 11,
                    };
                    dispatch(handleReqsList(filterValues));
                    dispatch(handleResetUploadFilters());
                  }}
                  className="font12  mt-2"
                  variant="secondary"
                >
                  لغو فیلتر
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </Fragment>
  );
};

export default UploadedFilesFilter;
