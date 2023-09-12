import React, { useContext, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { rootContext } from "../context/rootContext";
import { iranTolJobCntxt } from "../context/iranTolJobContext/IranTolJobCntxt";

const IranTolJobReqsFilter = () => {
  const mainContext = useContext(rootContext);
  const {
    handleAllStatuses,
    allStatuses,
    serialFilter,
    setSerialFilter,
    userIdFilterSelect,
    setUserIdFilterSelect,
    companyFilterSelect,
    setCompanyFilterSelect,
    projectTypeFilterSelect,
    setProjectTypeFilterSelect,
    toolTypeFilterSelect,
    setToolFilterSelect,
    statusIdFilterSelect,
    setStatusIdFilterSelect,
    fromDateFilter,
    setFromDateFilter,
    toDateFilter,
    setToDateFilter,
    realFilter,
    setRealFilter,
    usersFilterSelect,
    handleCancelFilter,
    handleGetRequestList,
  } = mainContext;

  useEffect(() => {
    handleAllStatuses(1);
    handleITJProjectTools();
    handleITJProjectTypes();
  }, []);

  const jobContext = useContext(iranTolJobCntxt);
  const {
    handleITJProjectTools,
    handleITJProjectTypes,
    iTJProjectTypeWithAllSelect,
    iTJProjectToolWithAllSelect,
  } = jobContext;

  return (
    <div className="d-flex flex-column  mb-5 lightGray2-bg p-3 borderRadius m-auto shadow border border-white border-2">
      <Row className="justify-content-start py-2">
        <Form.Group className="d-flex align-items-center mb-3">
          <Form.Switch
            type="checkbox"
            name="realFilter"
            value={realFilter}
            checked={realFilter}
            onChange={() => {
              setRealFilter(!realFilter);
            }}
          />
          <Form.Label className="font12 mb-0"> فیلتر لحظه ای </Form.Label>
        </Form.Group>
        <Form.Group as={Col} md="4" lg="3" xl="2" className="mb-4">
          <Form.Label id="serial" className="mb-1">
            سریال:
          </Form.Label>
          <NumberFormat
            type="text"
            value={serialFilter}
            format="######"
            mask="-"
            dir="ltr"
            className="form-control"
            onChange={(option) => {
              setSerialFilter(option.target.value);
              const valueLength = option.target.value.replace(/-/g, "").length;
              if (realFilter && valueLength === 6) {
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? option.target.value : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
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
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
            onKeyUp={(option) => {
              option.which = option.which || option.keyCode;
              if (option.which === 13) {
                const valueLength = option.target.value.replace(
                  /-/g,
                  ""
                ).length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? option.target.value : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
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
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        {/* <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const valueLength = serialFilter.replace(/-/g, '').length;
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            serial: valueLength === 6 ? serialFilter : '',
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                            requestType: projectTypeFilterSelect !== '' ? projectTypeFilterSelect.value : projectTypeFilterSelect,
                            toolType: toolTypeFilterSelect !== '' ? toolTypeFilterSelect.value : toolTypeFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            type: 1
                        }
                        handleGetRequestList(filterParams);
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'>درخواست کننده:</Form.Label>
                <Select
                    id='members'
                    placeholder='همه'
                    isSearchable
                    value={userIdFilterSelect}
                    options={usersFilterSelect}
                    onChange={(option) => {
                        setUserIdFilterSelect(option);
                        const valueLength = serialFilter.replace(/-/g, '').length;
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? serialFilter : '',
                                memberId: option !== '' ? option.value : option,
                                company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                                requestType: projectTypeFilterSelect !== '' ? projectTypeFilterSelect.value : projectTypeFilterSelect,
                                toolType: toolTypeFilterSelect !== '' ? toolTypeFilterSelect.value : toolTypeFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                type: 1
                            }
                            handleGetRequestList(filterParams);
                        }
                    }}
                />
            </Form.Group> */}
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="2"
          className="mb-4"
          onKeyUp={(option) => {
            option.which = option.which || option.keyCode;
            if (option.which === 13) {
              const valueLength = serialFilter.replace(/-/g, "").length;
              const filterParams = {
                applicantId: localStorage.getItem("id"),
                serial: valueLength === 6 ? serialFilter : "",
                memberId:
                  userIdFilterSelect !== ""
                    ? userIdFilterSelect.value
                    : userIdFilterSelect,
                company:
                  companyFilterSelect !== ""
                    ? companyFilterSelect.value
                    : companyFilterSelect,
                requestType:
                  projectTypeFilterSelect !== ""
                    ? projectTypeFilterSelect.value
                    : projectTypeFilterSelect,
                toolType:
                  toolTypeFilterSelect !== ""
                    ? toolTypeFilterSelect.value
                    : toolTypeFilterSelect,
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
                type: 1,
              };
              handleGetRequestList(filterParams);
            }
          }}
        >
          <Form.Label id="firstname" className="mb-1">
            شرکت:
          </Form.Label>
          <Select
            id="companyFilterSelect"
            placeholder="همه"
            isSearchable
            value={companyFilterSelect}
            options={usersFilterSelect}
            onChange={(option) => {
              setCompanyFilterSelect(option);
              if (realFilter) {
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
                  status: option !== "" ? option.value : option,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="2"
          className="mb-4"
          onKeyUp={(option) => {
            option.which = option.which || option.keyCode;
            if (option.which === 13) {
              const valueLength = serialFilter.replace(/-/g, "").length;
              const filterParams = {
                applicantId: localStorage.getItem("id"),
                serial: valueLength === 6 ? serialFilter : "",
                memberId:
                  userIdFilterSelect !== ""
                    ? userIdFilterSelect.value
                    : userIdFilterSelect,
                company:
                  companyFilterSelect !== ""
                    ? companyFilterSelect.value
                    : companyFilterSelect,
                requestType:
                  projectTypeFilterSelect !== ""
                    ? projectTypeFilterSelect.value
                    : projectTypeFilterSelect,
                toolType:
                  toolTypeFilterSelect !== ""
                    ? toolTypeFilterSelect.value
                    : toolTypeFilterSelect,
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
                type: 1,
              };
              handleGetRequestList(filterParams);
            }
          }}
        >
          <Form.Label id="firstname" className="mb-1">
            نوع فرآیند:
          </Form.Label>
          <Select
            id="projectTypeFilterSelect"
            placeholder="همه"
            isSearchable
            value={projectTypeFilterSelect}
            options={iTJProjectTypeWithAllSelect}
            onChange={(option) => {
              setProjectTypeFilterSelect(option);
              if (realFilter) {
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType: option !== "" ? option.value : option,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
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
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="2"
          className="mb-4"
          onKeyUp={(option) => {
            option.which = option.which || option.keyCode;
            if (option.which === 13) {
              const valueLength = serialFilter.replace(/-/g, "").length;
              const filterParams = {
                applicantId: localStorage.getItem("id"),
                serial: valueLength === 6 ? serialFilter : "",
                memberId:
                  userIdFilterSelect !== ""
                    ? userIdFilterSelect.value
                    : userIdFilterSelect,
                company:
                  companyFilterSelect !== ""
                    ? companyFilterSelect.value
                    : companyFilterSelect,
                requestType:
                  projectTypeFilterSelect !== ""
                    ? projectTypeFilterSelect.value
                    : projectTypeFilterSelect,
                toolType:
                  toolTypeFilterSelect !== ""
                    ? toolTypeFilterSelect.value
                    : toolTypeFilterSelect,
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
                type: 1,
              };
              handleGetRequestList(filterParams);
            }
          }}
        >
          <Form.Label id="firstname" className="mb-1">
            نوع پروژه:
          </Form.Label>
          <Select
            id="toolTypeFilterSelect"
            placeholder="همه"
            isSearchable
            value={toolTypeFilterSelect}
            options={iTJProjectToolWithAllSelect}
            onChange={(option) => {
              setToolFilterSelect(option);
              if (realFilter) {
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType: option !== "" ? option.value : option,
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
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="2"
          className="mb-4 mb-lg-0 mb-xl-4"
          onKeyUp={(option) => {
            option.which = option.which || option.keyCode;
            if (option.which === 13) {
              const valueLength = serialFilter.replace(/-/g, "").length;
              const filterParams = {
                applicantId: localStorage.getItem("id"),
                serial: valueLength === 6 ? serialFilter : "",
                memberId:
                  userIdFilterSelect !== ""
                    ? userIdFilterSelect.value
                    : userIdFilterSelect,
                company:
                  companyFilterSelect !== ""
                    ? companyFilterSelect.value
                    : companyFilterSelect,
                requestType:
                  projectTypeFilterSelect !== ""
                    ? projectTypeFilterSelect.value
                    : projectTypeFilterSelect,
                toolType:
                  toolTypeFilterSelect !== ""
                    ? toolTypeFilterSelect.value
                    : toolTypeFilterSelect,
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
                type: 1,
              };
              handleGetRequestList(filterParams);
            }
          }}
        >
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
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
                  status: option !== "" ? option.value : option,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" lg="2" className="mb-4 mb-lg-0 mb-xl-0">
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
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
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
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="2"
          className="mb-4 mb-md-0  mb-lg-0 mb-xl-0"
        >
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
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
                  status:
                    statusIdFilterSelect !== ""
                      ? statusIdFilterSelect.value
                      : statusIdFilterSelect,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate: value !== null ? value.format("YYYY/MM/DD") : "null",
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }
            }}
          />
        </Form.Group>
        <Col md="4" lg="3" xl="3" className="mt-4 ms-auto">
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              className="font12"
              onClick={() => {
                const valueLength = serialFilter.replace(/-/g, "").length;
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: valueLength === 6 ? serialFilter : "",
                  memberId:
                    userIdFilterSelect !== ""
                      ? userIdFilterSelect.value
                      : userIdFilterSelect,
                  company:
                    companyFilterSelect !== ""
                      ? companyFilterSelect.value
                      : companyFilterSelect,
                  requestType:
                    projectTypeFilterSelect !== ""
                      ? projectTypeFilterSelect.value
                      : projectTypeFilterSelect,
                  toolType:
                    toolTypeFilterSelect !== ""
                      ? toolTypeFilterSelect.value
                      : toolTypeFilterSelect,
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
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }}
            >
              اعمال فیلتر
            </Button>
            <Button
              variant="secondary"
              className="font12 ms-1"
              onClick={() => handleCancelFilter("ITJReq")}
            >
              لغو فیلتر
            </Button>
          </div>
        </Col>
      </Row>
      <Row></Row>
    </div>
  );
};

export default IranTolJobReqsFilter;
