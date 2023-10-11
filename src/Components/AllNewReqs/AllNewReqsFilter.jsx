import React, { useContext, useEffect } from "react";
import { rootContext } from "../context/rootContext";
import { Row, Col, Form, Button } from "react-bootstrap";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import Select from "react-select";
import { allNewReqsContext } from "../context/allNewReqsContext/allNewReqsContext";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStatusOptions,
  selectSerialFilter,
  RsetSerialFilter,
  selectStatusFilter,
  RsetStatusFilter,
  selectFromDateFilter,
  RsetFromDateFilter,
  selectToDateFilter,
  RsetToDateFilter,
  selectRealFilter,
  RsetRealFilter,
  handleCancelFilter,
  selectTypeFilter,
  RsetTypeFilter,
  RsetUserFilter,
  selectUserFilter,
  handleAllStatuses,
} from "../Slices/filterSlices";
import {
  handleAllNewReqs,
  handleMyReqsList,
  handleTypes,
  selectTypesOption,
  selectRequestMemb,
  handleAllItems,
} from "../Slices/mainSlices";

const AllNewReqsFilter = () => {
  const dispatch = useDispatch();
  const serialFilter = useSelector(selectSerialFilter);
  const statusFilter = useSelector(selectStatusFilter);
  const fromDateFilter = useSelector(selectFromDateFilter);
  const toDateFilter = useSelector(selectToDateFilter);
  const typeFilter = useSelector(selectTypeFilter);
  const realFilter = useSelector(selectRealFilter);
  const statusOptions = useSelector(selectStatusOptions);
  const typesOption = useSelector(selectTypesOption);
  const userFilter = useSelector(selectUserFilter);
  const requestMembs = useSelector(selectRequestMemb);

  const allNewRequestContext = useContext(allNewReqsContext);
  const { reqCategoriesList } = allNewRequestContext;

  useEffect(() => {
    dispatch(handleAllStatuses(0));
    dispatch(handleTypes());
  }, []);

  return (
    <div className="d-flex flex-column  mb-5 lightGray2-bg p-4 borderRadius m-auto shadow border border-white border-2">
      <Row className="align-items-center mb-4">
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

        <Form.Group as={Col} md="4" lg="3" xl="2" className="mb-4 mb-xl-0">
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
              dispatch(RsetSerialFilter(option.target.value));
              if (
                realFilter &&
                option.target.value.replaceAll("-", "").length === 6
              ) {
                const filterValues = {
                  applicantId: localStorage.getItem("id"),
                  serial: option.target.value,
                  type: typeFilter !== "" ? typeFilter.value : typeFilter,
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
                };
                dispatch(handleAllNewReqs(filterValues));
              }
            }}
            // onKeyUp={(option) => {
            //   option.which = option.which || option.keyCode;
            //   if (option.which === 13) {
            //     const filterValues = {
            //       applicantId: localStorage.getItem("id"),
            //       serial: option.target.value,
            //       type: typeFilter !== "" ? typeFilter.value : typeFilter,
            //       status:
            //         statusFilter !== "" ? statusFilter.value : statusFilter,
            //       fromDate:
            //         fromDateFilter !== null
            //           ? fromDateFilter.format("YYYY/MM/DD")
            //           : "null",
            //       toDate:
            //         toDateFilter !== null
            //           ? toDateFilter.format("YYYY/MM/DD")
            //           : "null",
            //     };
            //     dispatch(handleMyReqsList(filterValues));
            //   }
            // }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="3"
          className="mb-4 mb-xl-0"
          onKeyUp={(option) => {
            option.which = option.which || option.keyCode;
            if (option.which === 13) {
              // const filterParams = {
              //     applicantId: localStorage.getItem('id'),
              //     memberId: userFilter.value !== '' ? userFilter.value : "",
              //     type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
              //     status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
              //     fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
              //     toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
              // }
              // handleGetAllNewReqsList(filterParams);
            }
          }}
        >
          <Form.Label id="firstname" className="mb-1">
            درخواست کننده:
          </Form.Label>
          <Select
            id="members"
            placeholder="همه"
            isSearchable
            // value={userIdFilterSelect}
            options={requestMembs}
            // onChange={(e) => {
            //     dispatch(RsetStatusFilter(e));
            //     if (realFilter) {
            //         const filterParams = {
            //             applicantId: localStorage.getItem('id'),
            //             memberId: e !== '' ? e.value : e,
            //             type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
            //             status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
            //             fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
            //             toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
            //         }
            //         dispatch(handleAllNewReqs(filterParams));
            //     }
            // }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="3"
          className="mb-4 mb-xl-0"
          // onKeyUp={(option) => {
          //     option.which = option.which || option.keyCode;
          //     if (option.which === 13) {
          //         const filterParams = {
          //             applicantId: localStorage.getItem('id'),
          //             memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
          //             type : option !== '' ? option.value : option,
          //             status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
          //             fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
          //             toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
          //         }
          //         handleGetAllNewReqsList(filterParams);
          //     }
          // }}
        >
          <Form.Label id="firstname" className="mb-1">
            دسته بندی:
          </Form.Label>
          <Select
            id="supMembers"
            placeholder="همه"
            isSearchable
            value={typeFilter}
            options={typesOption}
            onChange={(e) => {
              dispatch(RsetTypeFilter(e));
              if (realFilter) {
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: serialFilter !== "" ? serialFilter : serialFilter,
                  memberId: userFilter !== "" ? userFilter.value : userFilter,
                  type: e !== "" ? e.value : e,
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
                };
                console.log(filterParams);
                dispatch(handleAllNewReqs(filterParams));
              }
            }}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          lg="3"
          xl="2"
          className="mb-4 mb-md-0 mb-lg-4 mb-xl-0"
        >
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
              dispatch(RsetFromDateFilter(value));
              if (realFilter) {
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  memberId: userFilter !== "" ? userFilter.value : userFilter,
                  type: typeFilter !== "" ? typeFilter.value : typeFilter,
                  status: statusFilter !== "" ? statusFilter.value : "",
                  fromDate:
                    value !== null ? value.format("YYYY/MM/DD") : "null",
                  toDate:
                    toDateFilter !== null
                      ? toDateFilter.format("YYYY/MM/DD")
                      : "null",
                };
                dispatch(handleAllNewReqs(filterParams));
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" lg="3" xl="2" className="mb-4 mb-md-0">
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
              dispatch(RsetToDateFilter(value));
              if (realFilter) {
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  memberId: userFilter !== "" ? userFilter.value : userFilter,
                  type: typeFilter !== "" ? typeFilter.value : typeFilter,
                  status:
                    statusFilter !== "" ? statusFilter.value : statusFilter,
                  fromDate:
                    fromDateFilter !== null
                      ? fromDateFilter.format("YYYY/MM/DD")
                      : "null",
                  toDate: value !== null ? value.format("YYYY/MM/DD") : "null",
                };
                dispatch(handleAllNewReqs(filterParams));
              }
            }}
          />
        </Form.Group>
      </Row>
      <Row>
        <Col md="4" lg="3" xl="12" className="">
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              className="font12"
              onClick={() => {
                console.log(serialFilter);
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: serialFilter !== "" ? serialFilter : serialFilter,
                  memberId: userFilter !== "" ? userFilter.value : userFilter,
                  type: typeFilter !== "" ? typeFilter.value : typeFilter,
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
                };
                dispatch(handleAllNewReqs(filterParams));
              }}
            >
              اعمال فیلتر
            </Button>
            <Button
              variant="secondary"
              className="font12 ms-1"
              onClick={() => {
                dispatch(RsetSerialFilter(""))
                dispatch(RsetUserFilter(""))
                dispatch(RsetTypeFilter(""))
                dispatch(RsetFromDateFilter(null))
                dispatch(RsetToDateFilter(null))
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

export default AllNewReqsFilter;
