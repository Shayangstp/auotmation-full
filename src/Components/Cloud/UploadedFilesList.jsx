import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container } from "react-bootstrap";
import xssFilters from "xss-filters";
import {
  faArrowsRotate,
  faCheck,
  faBan,
  faClockRotateLeft,
  faEye,
  faFilter,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-jalaali";
import Loading from "../Common/Loading";
import UploadedFilesItem from "./UploadedFilesItem";
import {
  selectUserImage,
  handleUserInformation,
  selectUserInfoModal,
  handleReqsList,
  handleUserData,
  handleCurrentReqInfo,
  selectReqsList,
  RsetActiveTab,
  selectActiveTab,
  selectLoading,
  RsetLoading,
} from "../Slices/mainSlices";
import {
  selectSerialFilter,
  selectUserFilter,
  selectStatusFilter,
  selectDepFilter,
  selectFromDateFilter,
  RsetFromDateFilter,
  selectToDateFilter,
  selectStatusOptions,
  selectDepOptions,
  selectStatusFilterOption,
  RsetShowFilter,
  selectShowFilter,
  RsetRealFilter,
  RsetUserFilter,
  RsetStatusFilter,
  RsetToDateFilter,
  RsetSerialFilter,
  handleTabs,
} from "../Slices/filterSlices";

import FileClodFilter from "./UploadedFilesFilter";
import UserInfoModal from "../Modals/UserInfoModal";
import { Link } from "react-router-dom";

const UploadedFilesList = ({ setPageTitle }) => {
  useEffect(() => {
    setPageTitle("لیست فایل های آپلود شده");
  }, []);

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);

  const serialFilter = useSelector(selectSerialFilter);
  const userFilter = useSelector(selectUserFilter);
  const statusFilter = useSelector(selectStatusFilter);
  const fromDateFilter = useSelector(selectFromDateFilter);
  const toDateFilter = useSelector(selectToDateFilter);
  const depFilter = useSelector(selectDepFilter);
  const statusOptions = useSelector(selectStatusOptions);
  const depOptions = useSelector(selectDepOptions);

  const cloudList = useSelector(selectReqsList);
  const showFilter = useSelector(selectShowFilter);
  const reqsList = useSelector(selectReqsList);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    const filterValues = {
      applicantId: localStorage.getItem("id"),
      serial: "",
      memberId: "",
      mDep: "",
      status: "",
      fromDate: "null",
      toDate: "null",
      type: 11,
      // group: undefined,
    };
    dispatch(handleReqsList(filterValues));
  }, []);

  const columns = useMemo(() => [
    {
      Header: "سریال",
      accessor: "reqSerial",
      sortType: "basic",
    },
    {
      Header: "تاریخ",
      accessor: "reqDate",
      sortType: "basic",
    },
    {
      Header: "ارسال کننده",
      accessor: "reqUser",
      sortType: "basic",
    },
    {
      Header: "فایل",
      accessor: "reqFile",
      sortType: "basic",
    },
    {
      Header: "نام فایل",
      accessor: "reqFileName",
      sortType: "basic",
    },
    {
      Header: "ورژن",
      accessor: "reqVersion",
      sortType: "basic",
    },
    {
      Header: "نام نرم افزار",
      accessor: "reqSoftwareName",
      sortType: "basic",
    },
  ]);

  const link = (request) => {
    return (
      <a
        className="text-dark text-decoration-none cursorPointer serialHover"
        title={"مشاهده درخواست " + request.serial}
        onClick={() => {
          dispatch(
            handleCurrentReqInfo({
              company: "",
              reqId: request.requestId,
              reqType: request.typeId,
              reqSeen: request.seen,
              oprationType: "view",
              dep: "",
            })
          );
          // setSeenSerial(request.serial);
        }}
      >
        {xssFilters.inHTMLData(request.serial)}
      </a>
    );
  };
  const userInfo = (request) => {
    return (
      <div
        className="text-dark cursorPointer"
        title="مشاهده اطلاعات کاربر "
        onClick={() => {
          dispatch(handleUserInformation(request.userId));
          dispatch(selectUserImage({ userId: request.userId, status: 1 }));
        }}
      >
        {xssFilters.inHTMLData(request.fullName)}
      </div>
    );
  };

  const operation = (request) => {
    if (
      request.lastToPersons !== null &&
      request.lastToPersons
        .split(",")
        .some((person) => person === localStorage.getItem("id"))
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          {/* <Button
            title="تایید"
            className="btn btn-success d-flex align-items-center me-2 mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  oprationType: "accept",
                  dep: "",
                })
              );
              // setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            title="ابطال"
            className="btn btn-danger d-flex align-items-center me-2 mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  oprationType: "cancel",
                  dep: "",
                })
              );
              // setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
          <Button
            title="تاریخچه"
            className="btn btn-info d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  oprationType: "history",
                  dep: "",
                })
              );
              // handleGetCurrentReqComments(
              //   actionCode.reqInfo.serial_number,
              //   actionCode.type
              // );
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button> */}
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          {/* <Button
            title="مشاهده"
            className="btn btn-warning d-flex me-2 align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  oprationType: "view",
                  dep: "",
                })
              );
              // setSeenSerial(serialNumber);
              dispatch(RsetViewReqModal(true));
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            title="تاریخچه"
            className="btn btn-info d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  oprationType: "history",
                  dep: "",
                })
              );
              // handleGetCurrentReqComments(
              //   actionCode.reqInfo.serial_number,
              //   actionCode.type
              // );
              dispatch(RsetReqHistoryModal(true));
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button> */}
        </div>
      );
    }
  };

  const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
    var tableItems = [];
    console.log(requests);
    if (requests.length !== 0) {
      for (var i = 0; i < requests.length; i++) {
        var tableItem = {
          reqSerial: link(requests[i]),
          reqDate: moment
            .utc(requests[i].createdDate, "YYYY/MM/DD")
            .locale("fa")
            .format("jYYYY/jMM/jDD"),
          reqUser: userInfo(requests[i]),
          reqCompany: requests[i].deptName,
          reqStatus: requests[i].statusName,
          reqOperation: operation(requests[i]),
        };
        tableItems.push(tableItem);
      }
    }
    const fetchId = ++fetchIdRef.current;
    setload(true);
    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex;
      const endRow = startRow + pageSize;
      setData(tableItems.slice(startRow, endRow));
      setPageCount(Math.ceil(tableItems.length / pageSize));
      setload(false);
    }
  }, []);
  const handleSort = useCallback(
    ({ sortBy, pageIndex, pageSize, requests }) => {
      var tableItems = [];
      if (requests.length !== 0) {
        for (var i = 0; i < requests.length; i++) {
          var tableItem = {
            reqSerial: link(requests[i]),
            reqDate: moment
              .utc(requests[i].createdDate, "YYYY/MM/DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD"),
            reqUser: userInfo(requests[i]),
            reqCompany: requests[i].deptName,
            reqStatus: requests[i].statusName,
            reqOperation: operation(requests[i]),
          };
          tableItems.push(tableItem);
        }
      }
      const sortId = ++sortIdRef.current;
      setload(true);
      if (sortId === sortIdRef.current) {
        let sorted = tableItems.slice();
        sorted.sort((a, b) => {
          for (let i = 0; i < sortBy.length; ++i) {
            if (a[sortBy[i].id] > b[sortBy[i].id])
              return sortBy[i].desc ? -1 : 1;
            if (a[sortBy[i].id] < b[sortBy[i].id])
              return sortBy[i].desc ? 1 : -1;
          }
          return 0;
        });
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        setData(sorted.slice(startRow, endRow));
        setload(false);
      }
    },
    []
  );

  console.log(reqsList);

  return (
    <Container fluid>
      {showFilter ? <FileClodFilter /> : null}
      <div className="my-4">
        <section className="position-relative">
          <div className="lightGray2-bg p-4 borderRadius border border-white border-2 shadow ">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <Link to="/FileUploadForm">
                  <Button size="sm" variant="success" className="mb-2 font12">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    افزودن درخواست جدید
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="warning"
                  className="mb-2 ms-2 font12"
                  onClick={() => {
                    dispatch(RsetShowFilter(!showFilter));
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  فیلتر
                </Button>
              </div>
              <Button
                size="sm"
                variant="primary"
                className="mb-2 font12"
                onClick={() => {
                  console.log("hi");
                  const filterValues = {
                    applicantId: localStorage.getItem("id"),
                    serial: "",
                    memberId: "",
                    mDep: "",
                    status: "",
                    fromDate: "null",
                    toDate: "null",
                    type: 11,
                    // group: undefined,
                  };
                  dispatch(handleReqsList(filterValues));
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
                به روزرسانی
              </Button>
            </div>
            <div>
              <UploadedFilesItem
                requests={reqsList}
                columns={columns}
                data={data}
                onSort={handleSort}
                fetchData={fetchData}
                loading={load}
                pageCount={pageCount}
              />
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default UploadedFilesList;
