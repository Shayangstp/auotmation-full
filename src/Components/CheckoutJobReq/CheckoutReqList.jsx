import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
  Fragment,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCheck,
  faBan,
  faClockRotateLeft,
  faEye,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";

import { handleCurrentReqInfo } from "../Slices/currentReqSlice";
import {
  handleUserImage,
  handleUserInformation,
  handleReqsList,
  selectUserInfoModal,
  selectUser,
  handleLogin,
} from "../Slices/mainSlices";
import {
  selectCheckoutFilterData,
  RsetCheckoutFilterData,
  handleCheckoutReqAction,
  RsetCheckoutSendToModal,
  selectChcekoutSendToModal,
  RsetCheckoutReqSupervisorId,
  RsetCheckoutProcessModal,
  selectCheckoutProcessModal,
  RsetCheckoutConAmval,
} from "../Slices/checkoutReqSlices";

import {
  selectAcceptReqModal,
  selectCancelReqModal,
  selectViewReqModal,
  selectReqHistoryModal,
  RsetAcceptReqModal,
  RsetViewReqModal,
  RsetCancelReqModal,
  RsetReqHistoryModal,
} from "../Slices/modalsSlice";
import {
  RsetCurrentReqId,
  RsetCurrentReqType,
} from "../Slices/currentReqSlice";
import CheckoutReqFilter from "./CheckoutReqFilter";
import CheckoutReqItem from "./CheckoutReqItem";
import CheckoutReqAcceptModal from "../Modals/CheckoutReqModals/CheckoutReqAcceptModal";
import CheckoutReqCancelModal from "../Modals/CheckoutReqModals/CheckoutReqCancelModal";
import CheckoutReqViewModal from "../Modals/CheckoutReqModals/CheckoutReqViewModal";
import CheckoutReqHistoryModal from "../Modals/CheckoutReqModals/CheckoutReqHistoryModal";
import CheckoutReqUserInfoModal from "../Modals/CheckoutReqModals/CheckoutReqUserInfoModal";
import CheckoutSendToModal from "../Modals/CheckoutReqModals/CheckoutSendToModal";
import CheckoutProcessModal from "../Modals/CheckoutReqModals/CheckoutProcessModal";

const CheckoutReqList = () => {
  const dispatch = useDispatch();
  const checkoutFilterData = useSelector(selectCheckoutFilterData);
  const acceptReqModal = useSelector(selectAcceptReqModal);
  const cancelReqModal = useSelector(selectCancelReqModal);
  const ReqHistoryModal = useSelector(selectReqHistoryModal);
  const viewReqModal = useSelector(selectViewReqModal);
  const userInfoModal = useSelector(selectUserInfoModal);
  const checkoutSendToModal = useSelector(selectChcekoutSendToModal);
  const checkoutProcessModal = useSelector(selectCheckoutProcessModal);
  const user = useSelector(selectUser);

  useEffect(() => {
    const filterValues = {
      applicantId: localStorage.getItem("id"),
      serial: "",
      memberId: "",
      status: "",
      fromDate: "null",
      toDate: "null",
      type: 10,
      mDep: "",
    };
    dispatch(handleReqsList(filterValues));
  }, []);

  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);

  const columns = useMemo(() => [
    {
      Header: " سریال درخواست",
      accessor: "checkoutSerial",
      sortType: true,
    },
    {
      Header: "تاریخ ثبت درخواست",
      accessor: "checkoutCreatedDate",
      sortType: true,
    },
    {
      Header: "پرسنل مستعفی",
      accessor: "checkoutUser",
      sortType: true,
    },

    {
      Header: "واحد",
      accessor: "checkoutDept",
      sortType: true,
    },
    {
      Header: "علت ترک خدمت",
      accessor: "checkoutLeavingReason",
      sortType: true,
    },
    {
      Header: "وضعیت درخواست",
      accessor: "checkoutStatus",
      sortType: true,
    },
    {
      Header: "عملیات",
      accessor: "checkoutOpration",
      sortType: true,
    },
  ]);

  const link = (request) => {
    return (
      <a
        className="text-dark text-decoration-none cursorPointer serialHover"
        // title={"مشاهده درخواست " + } serial
        onClick={() => {
          dispatch(
            handleCurrentReqInfo({
              company: "",
              reqId: request.requestId,
              reqType: request.typeId,
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
          dispatch(handleUserInformation(request.leaverId));
          dispatch(handleUserImage({ userId: request.leaverId, status: 1 }));
        }}
      >
        {xssFilters.inHTMLData(request.leaverFullName)}
      </div>
    );
  };
  const checkoutProcess = (request) => {
    return (
      <div
        className="text-dark cursorPointer"
        title="مشاهده روند درخواست "
        onClick={() => {
          dispatch(
            handleCurrentReqInfo({
              company: "",
              reqId: request.requestId,
              reqType: request.typeId,
              reqSeen: "",
              oprationType: "",
              dep: "",
            })
          );
          dispatch(RsetCheckoutProcessModal(true));
        }}
      >
        {xssFilters.inHTMLData(request.statusName)}
      </div>
    );
  };

  const operation = (request) => {
    if (request.lastToPersons === null && request.lastActionCode === 0) {
      return (
        <div>
          <Button
            title="ارسال"
            className="btn btn-primary d-flex align-items-center me-2 mb-2 mb-md-0"
            size="sm"
            active
            onClick={(e) => {
              dispatch(RsetCheckoutSendToModal(true));
              dispatch(RsetCheckoutReqSupervisorId(request.supervisorId));
              dispatch(RsetCurrentReqId(request.requestId));
              dispatch(RsetCurrentReqType(request.typeId));
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </div>
      );
    } else if (
      request.lastToPersons !== null &&
      request.lastToPersons
        .split(",")
        .some((person) => person === localStorage.getItem("id"))
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            className="btn btn-success d-flex align-items-center me-2 mb-2 mb-md-2"
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
            className="btn btn-danger d-flex align-items-center me-2 mb-2 mb-md-2"
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
            className="btn btn-info d-flex align-items-center mb-2 mb-md-2"
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
              // dispatch(RsetViewReqModal(true));
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
        </div>
      );
    } else if (
      request.lastToPersons !== null &&
      request.lastActionCode === 43
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="مشاهده"
            className="btn btn-warning d-flex me-2 align-items-center mb-2 mb-md-2"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: "",
                  oprationType: "view",
                  dep: "",
                })
              );
              // setSeenSerial(serialNumber);
              // dispatch(RsetViewReqModal(true));
              // dispatch(handleCheckoutReqAction());
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            title="تاریخچه"
            className="btn btn-info d-flex align-items-center mb-2 mb-md-2"
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
              // dispatch(RsetCheckoutReqHistoryModal(true));
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
        </div>
      );
    } else if (
      request.lastToPersons === null &&
      request.lastActionCode === 43 &&
      request.acceptedRoles.split(",").some((item) => user.Roles.includes(item))
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="مشاهده"
            className="btn btn-warning d-flex me-2 align-items-center mb-2 mb-md-2"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: "",
                  oprationType: "view",
                  dep: "",
                })
              );
              // setSeenSerial(serialNumber);
              // dispatch(RsetViewReqModal(true));
              // dispatch(handleCheckoutReqAction());
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            title="تاریخچه"
            className="btn btn-info d-flex align-items-center mb-2 mb-md-2"
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
              // dispatch(RsetCheckoutReqHistoryModal(true));
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
        </div>
      );
    } else if (
      request.lastToPersons === null &&
      request.lastActionCode === 43
      // &&
      // request.leaverId
      //   .split(",")
      //   .some((person) => person !== localStorage.getItem("id"))
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            className="btn btn-success d-flex align-items-center me-2 mb-2 mb-md-2"
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
            className="btn btn-danger d-flex align-items-center me-2 mb-2 mb-md-2"
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
            className="btn btn-info d-flex align-items-center mb-2 mb-md-2"
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
              // dispatch(RsetViewReqModal(true));
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
            className="btn btn-warning d-flex me-2 align-items-center mb-2 mb-md-2"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  company: "",
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: "",
                  oprationType: "view",
                  dep: "",
                })
              );
              // setSeenSerial(serialNumber);
              // dispatch(RsetViewReqModal(true));
              // dispatch(handleCheckoutReqAction());
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            title="تاریخچه"
            className="btn btn-info d-flex align-items-center mb-2 mb-md-2"
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
              // dispatch(RsetCheckoutReqHistoryModal(true));
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
        </div>
      );
    }
  };

  const fetchData = useCallback(
    ({ pageSize, pageIndex, requests }) => {
      var tableItems = [];
      if (requests.length !== 0) {
        for (var i = 0; i < requests.length; i++) {
          var tableItem = {
            checkoutSerial: link(requests[i]),
            checkoutCreatedDate: moment
              .utc(requests[i].createdDate, "YYYY/MM/DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD"),
            checkoutUser: userInfo(requests[i]),
            checkoutDept: requests[i].deptName,
            checkoutLeavingReason: requests[i].leavingWorkCauseName,
            checkoutStatus: checkoutProcess(requests[i]),
            checkoutOpration: operation(requests[i]),
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
    },
    [user]
  );
  const handleSort = useCallback(
    ({ sortBy, pageIndex, pageSize, requests }) => {
      var tableItems = [];
      if (requests.length !== 0) {
        for (var i = 0; i < requests.length; i++) {
          var tableItem = {
            checkoutSerial: link(requests[i]),
            checkoutCreatedDate: moment
              .utc(requests[i].createdDate, "YYYY/MM/DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD"),
            checkoutUser: userInfo(requests[i]),
            checkoutDept: requests[i].deptName,
            checkoutLeavingReason: requests[i].leavingWorkCauseName,
            checkoutStatus: checkoutProcess(requests[i]),
            checkoutOpration: operation(requests[i]),
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
    [user]
  );

  return (
    <Container fluid className="py-4">
      <Fragment>
        <Row>
          <CheckoutReqFilter />
        </Row>
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
                    serial: "",
                    memberId: "",
                    status: "",
                    fromDate: "null",
                    toDate: "null",
                    type: 10,
                    mDep: "",
                  };
                  dispatch(handleReqsList(filterValues));
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
                به روزرسانی جدول
              </Button>
              {checkoutFilterData !== undefined ? (
                <Fragment>
                  <CheckoutReqItem
                    requests={checkoutFilterData}
                    // notVisited={notVisited}
                    columns={columns}
                    data={data}
                    onSort={handleSort}
                    fetchData={fetchData}
                    loading={load}
                    pageCount={pageCount}
                    // handleNotVisited={handleNotVisited}
                  />
                  {acceptReqModal && <CheckoutReqAcceptModal />}
                  {cancelReqModal && <CheckoutReqCancelModal />}
                  {viewReqModal && <CheckoutReqViewModal />}
                  {ReqHistoryModal && <CheckoutReqHistoryModal />}
                  {userInfoModal && <CheckoutReqUserInfoModal />}
                  {checkoutSendToModal && <CheckoutSendToModal />}
                  {checkoutProcessModal && <CheckoutProcessModal />}
                </Fragment>
              ) : null}
            </Fragment>
          </div>
        </section>
      </Fragment>
    </Container>
  );
};

export default CheckoutReqList;
