import React, { useEffect, useMemo, useCallback, useRef, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import SoftwareReqFilter from "./SoftwareReqFilter";
import SoftwareReqItem from "./SoftwareReqItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";
import ViewRequestModal from "../../Modals/SoftwareReqModals/ViewRequestModal";
import AcceptRequestModal from "../../Modals/SoftwareReqModals/AcceptRequestModal";
import NextAcceptRequestModal from "../../Modals/SoftwareReqModals/NextAcceptRequestModal";
import CancelRequestModal from "../../Modals/SoftwareReqModals/CancelRequestModal";
import UserInfoModal from "../../Modals/UserInfoModal";
import HistoryRequestModal from "../../Modals/SoftwareReqModals/HistoryRequestModal";
import { faArrowsRotate, faCheck, faBan, faClockRotateLeft, faEye } from "@fortawesome/free-solid-svg-icons";
import { selectUserImage, handleUserInformation, selectUserInfoModal, handleReqsList, handleUserData, handleCurrentReqInfo, selectReqsList } from "../../Slices/mainSlices";
import { selectAcceptReqModal, selectCancelReqModal, selectViewReqModal, selectReqHistoryModal, RsetReqHistoryModal, RsetViewReqModal, selectNextAcceptReqModal } from "../../Slices/modalsSlice";
import {  selectSerialFilter, selectUserFilter, selectStatusFilter,
  selectDepFilter, selectFromDateFilter, RsetFromDateFilter, selectToDateFilter , selectStatusOptions, selectDepOptions, selectStatusFilterOption,
} from "../../Slices/filterSlices";

const SoftwareReqList = ({setPageTitle}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setPageTitle('لیست درخواست نرم افزار');
}, [setPageTitle])
  const acceptReqModal = useSelector(selectAcceptReqModal);
  const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
  const cancelReqModal = useSelector(selectCancelReqModal);
  const viewReqModal = useSelector(selectViewReqModal);
  const ReqHistoryModal = useSelector(selectReqHistoryModal);
  const userInfoModal = useSelector(selectUserInfoModal);

  const serialFilter = useSelector(selectSerialFilter);
  const userFilter = useSelector(selectUserFilter);
  const statusFilter = useSelector(selectStatusFilter);
  const fromDateFilter = useSelector(selectFromDateFilter);
  const toDateFilter = useSelector(selectToDateFilter);
  const depFilter = useSelector(selectDepFilter);
  const statusOptions = useSelector(selectStatusOptions);
  const depOptions = useSelector(selectDepOptions);

  const reqsList = useSelector(selectReqsList);

  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);

  useEffect(() => {
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
  }, []);

  const columns = useMemo(() => [
    {
      Header: "سریال درخواست",
      accessor: "reqSerial",
      sort: true,
    },
    {
      Header: "تاریخ ثبت درخواست",
      accessor: "reqDate",
      sort: true,
    },
    {
      Header: "درخواست کننده",
      accessor: "reqUser",
      sort: true,
    },
    {
      Header: "واحد درخواست کننده",
      accessor: "reqCompany",
      sort: true,
    },
    {
      Header: "وضعیت درخواست",
      accessor: "reqStatus",
      sort: true,
    },
    {
      Header: "عملیات",
      accessor: "reqOperation",
      sort: false,
    },
  ]);

  const link = (request) => {
    return (
      <a className="text-dark text-decoration-none cursorPointer serialHover"
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
          <Button
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
          </Button>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
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
          </Button>
        </div>
      );
    }
  };

  const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
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

  return (
    <Container fluid className="pb-4">
      {/* {menuPermission ? */}
      <Fragment>
        <SoftwareReqFilter />
        <section className="position-relative">
          <div>
            <Fragment>
              <Button
                size="sm"
                variant="primary"
                className="mb-2"
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
                <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
                به روزرسانی
              </Button>
              {reqsList !== undefined ? (
                <Fragment>
                  <SoftwareReqItem
                    requests={reqsList}
                    // notVisited={notVisited}
                    columns={columns}
                    data={data}
                    onSort={handleSort}
                    fetchData={fetchData}
                    loading={load}
                    pageCount={pageCount}
                    // handleNotVisited={handleNotVisited}
                  />
                  {acceptReqModal && <AcceptRequestModal />}
                  {nextAcceptReqModal && <NextAcceptRequestModal />}
                  {cancelReqModal && <CancelRequestModal />}
                  {viewReqModal && <ViewRequestModal />}
                  {ReqHistoryModal && <HistoryRequestModal />}
                  {userInfoModal && <UserInfoModal />}
                </Fragment>
              ) : null}
            </Fragment>
          </div>
        </section>
        {/* : 
          <Redirect to="/" />
        } */}
      </Fragment>
      {/* : */}
      {/* <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                            کاربر گرامی شما به این بخش دسترسی ندارید.
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2'/>
                                        صفحه اصلی
                                    </Button>
                                </Link>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            } */}
    </Container>
  );
};

export default SoftwareReqList;
