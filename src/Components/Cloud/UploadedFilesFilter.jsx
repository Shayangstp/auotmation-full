import React, { Fragment } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
    // handleCloudListFile,
    // handleResetListFile,
    // RsetAppNameFilterFC, RsetFileNameFilterFC, RsetFromDateFilterFC, RsetSerialFilterFC,
    // RsetToDateFilterFC,
    // RsetUserNameReqFilterFC, selectAllAppName, selectAllCloudList, selectAllMemberCloudList, selectAppNameFilterFC,
    // selectFileNameFilterFC,
    // selectFromDateFilterFC, selectSerialFilterFC, selectToDateFilterFC,
    // selectUserNameReqFilterFC
} from "../Slices/filesCloudSlice";
import { RsetIsLoadingCheckout, RsetRealFilter, selectRealFilter } from "../Slices/mainSlices";

const UploadedFilesFilter = () => {
    const dispatch = useDispatch()
    // const serialNumber = useSelector(selectSerialFilterFC)
    // const userName = useSelector(selectUserNameReqFilterFC)
    // const appNameFilter = useSelector(selectAppNameFilterFC);
    // const fromDateFilterFC = useSelector(selectFromDateFilterFC);
    // const toDateFilterFC = useSelector(selectToDateFilterFC);
    // const fileNameFilterFC = useSelector(selectFileNameFilterFC)
    // const allAppName = useSelector(selectAllAppName)
    // const allMemberList = useSelector(selectAllMemberCloudList)
    // const realFilter = useSelector(selectRealFilter)

    // let addAllApplications = []
    // const objectAll = addAllApplications.push({ label: "همه", value: "" })
    // const mapDeps = allAppName.map((dep) => addAllApplications.push({ label: dep.label, value: dep.value }))

    return (
        <Fragment>
            <Form>
                <Row>
                    <Col xl="3">
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
                            }
                            }
                        />
                    </Col>
                    <Col xl="3">
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
                            }
                            }
                            // options={allMemberList}
                            placeholder="انتخاب"
                        />
                    </Col>
                    <Col xl="3">
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
                            }
                            }
                            placeholder="" />
                    </Col>
                    <Col xl="3">
                        <label className="mb-1 mt-4">نام نرم افزار:</label>
                        <Select
                            // value={appNameFilter}
                            // options={addAllApplications}
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
                            }
                            }
                            placeholder="انتخاب" />
                    </Col>
                    <Col xl="3">
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
                            }
                            }
                            className="form-control" />
                    </Col>
                    <Col xl="3">
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
                            }
                            }
                            type="date"
                            inputFormat="YYYY-MM-DD"
                            pick12HourFormat={false}
                            isGregorian={false}
                            timePicker={false}

                            className="form-control" />
                    </Col>
                    <Col xl="3" className="mt-4 justify-content-center">
                        <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                            <input className="" type='checkbox' name='realFilter'
                                // value={realFilter}
                                // checked={realFilter}
                                onChange={() => {
                                    // dispatch(RsetRealFilter(!realFilter))
                                }} />
                            <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                        </Form.Group>
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
                                }} className="me-2 mt-2 font12 " variant="success">
                                اعمال فیلتر
                            </Button>
                            <Button onClick={() => {
                                // const filterValues = {
                                //     serial: serialNumber !== "" ? serialNumber : "",
                                //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                                //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                                //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                                //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                                //     memberId: userName !== "" ? userName.value : userName,
                                // }
                                // dispatch(handleResetListFile(filterValues))
                            }} className="font12  mt-2" variant="secondary">
                                لغو فیلتر
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    );
};

export default UploadedFilesFilter;