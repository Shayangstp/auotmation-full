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
} from "../Slices/mainSlices";
import {
  selectSerialFilter,
  selectFromDateFilter,
  selectToDateFilter,
} from "../Slices/filterSlices";
import {
  selectUploadSoftwareNameFilter,
  RsetUploadSoftwareNameFilter,
  selectUploadSoftwareNameOption,
  handleSoftwareNameOption,
} from "../Slices/filesCloudSlice";
import { useEffect } from "react";

const UploadedFilesFilter = () => {
  const dispatch = useDispatch();
  const serialFilter = useSelector(selectSerialFilter);
  const fromDateFilter = useSelector(selectFromDateFilter);
  const toDateFilter = useSelector(selectToDateFilter);
  const softwareNameFilter = useSelector(selectUploadSoftwareNameFilter);
  const softwareNameOption = useSelector(selectUploadSoftwareNameOption);

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
                // value={serialNumber}
                onChange={(e) => {
                  // if (realFilter) {
                  // const filterValues = {
                  //     serial: e !== "" ? e.target.value : e,
                  //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                  //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                  //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     memberId: userName !== "" ? userName.value : userName,
                  // }
                  // dispatch(handleCloudListFile(filterValues))
                  // }
                  // dispatch(RsetSerialFilterFC(e.target.value))
                }}
              />
            </Col>
            <Col xl="2">
              <label className="mb-1  mt-4">ارسال کننده:</label>
              <Select
                // value={userName}
                onChange={(e) => {
                  // if (realFilter) {
                  // const filterValues = {
                  //     serial: serialNumber !== "" ? serialNumber : "",
                  //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                  //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                  //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     memberId: e !== "" ? e.value : e,
                  // }
                  // dispatch(handleCloudListFile(filterValues))
                  // }
                  // dispatch(RsetUserNameReqFilterFC(e))
                }}
                // options={allMemberList}
                placeholder="انتخاب"
              />
            </Col>
            <Col xl="2">
              <label className="mb-1 mt-4">نام فایل:</label>
              <Form.Control
                // value={fileNameFilterFC}
                onChange={(e) => {
                  // if (realFilter) {
                  // const filterValues = {
                  //     serial: serialNumber !== undefined ? serialNumber : "",
                  //     filename: e !== "" ? e.target.value : "",
                  //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                  //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     memberId: userName !== "" ? userName.value : userName,
                  // }
                  // dispatch(handleCloudListFile(filterValues))
                  // }
                  // dispatch(RsetFileNameFilterFC(e.target.value))
                }}
                placeholder=""
              />
            </Col>
            <Col xl="2">
              <label className="mb-1 mt-4">نام نرم افزار:</label>
              <Select
                value={softwareNameFilter}
                options={softwareNameOption}
                onChange={(e) => {
                  // if (realFilter) {
                  // const filterValues = {
                  //     serial: serialNumber !== undefined ? serialNumber : "",
                  //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                  //     application: e !== "" ? e.value : e,
                  //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     memberId: userName !== "" ? userName.value : userName,
                  // }
                  // dispatch(handleCloudListFile(filterValues))
                  // }
                  // dispatch(RsetAppNameFilterFC(e))
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
                // value={fromDateFilterFC}
                onChange={(e) => {
                  // if (realFilter) {
                  // const filterValues = {
                  //     serial: serialNumber !== undefined ? serialNumber : "",
                  //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                  //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                  //     fromDate: e !== null ? e.format("YYYY/MM/DD") : "null",
                  //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     memberId: userName !== "" ? userName.value : userName,
                  // }
                  // dispatch(handleCloudListFile(filterValues))
                  // }
                  // dispatch(RsetFromDateFilterFC(e))
                }}
                className="form-control"
              />
            </Col>
            <Col xl="2">
              <label className="mb-1 mt-4">تا تاریخ:</label>
              <DatePicker
                // value={toDateFilterFC}
                onChange={(e) => {
                  // if (realFilter) {
                  // const filterValues = {
                  //     serial: serialNumber !== undefined ? serialNumber : "",
                  //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                  //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                  //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                  //     toDate: e !== null ? e.format("YYYY/MM/DD") : "null",
                  //     memberId: userName !== "" ? userName.value : userName,
                  // }
                  // dispatch(handleCloudListFile(filterValues))
                  // }
                  // dispatch(RsetToDateFilterFC(e))
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
                    // const filterValues = {
                    //     serial: serialNumber !== "" ? serialNumber : "",
                    //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                    //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                    //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                    //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                    //     memberId: userName !== "" ? userName.value : userName,
                    // }
                    // dispatch(RsetIsLoadingCheckout(true))
                    // dispatch(handleCloudListFile(filterValues))
                  }}
                  className="me-2 mt-2 font12 "
                  variant="success"
                >
                  اعمال فیلتر
                </Button>
                <Button
                  onClick={() => {
                    // const filterValues = {
                    //     serial: serialNumber !== "" ? serialNumber : "",
                    //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                    //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                    //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                    //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                    //     memberId: userName !== "" ? userName.value : userName,
                    // }
                    // dispatch(handleResetListFile(filterValues))
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
