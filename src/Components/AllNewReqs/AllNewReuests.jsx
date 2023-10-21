import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Link, Redirect } from "react-router-dom";
import { rootContext } from "../context/rootContext";
import { allNewReqsContext } from "../context/allNewReqsContext/allNewReqsContext";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faHome,
  faWarning,
  faEye,
  faBan,
  faPenToSquare,
  faCheck,
  faPlus,
  faFilter,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-jalaali";
import AllNewReqsList from "./AllNewReqsList";
import AllNewReqsFilter from "./AllNewReqsFilter";

import { useDispatch, useSelector } from "react-redux";
import {
  selectAcceptReqModal,
  RsetAcceptReqModal,
  selectCancelReqModal,
  RsetCancelReqModal,
  selectNextAcceptReqModal,
} from "../Slices/modalsSlice";
import {
  handleCurrentReqInfo,
  selectActiveTab,
  handleReqsList,
  selectAllNewReqsList,
} from "../Slices/mainSlices";
import { selectCurrentReqInfo } from "../Slices/currentReqSlice";
import {
  selectShowFilter,
  RsetShowFilter,
  RsetSerialFilter,
  RsetTypeFilter,
  RsetUserFilter,
  RsetFromDateFilter,
  RsetToDateFilter,
} from "../Slices/filterSlices";
import AcceptRequestModal from "../Modals/WarehouseReqsModals/AcceptRequestModal";
import NextAcceptRequestModal from "../Modals/WarehouseReqsModals/NextAcceptRequestModal";
import CancelRequestModal from "../Modals/WarehouseReqsModals/CancelRequestModal";
import {
  selectReqsList,
  handleAllNewReqs,
  selectLoading,
} from "../Slices/mainSlices";
import Loading from "../Common/Loading";

const AllNewRequests = ({ setPageTitle }) => {
  const dispatch = useDispatch();
  const acceptReqModal = useSelector(selectAcceptReqModal);
  const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
  const cancelReqModal = useSelector(selectCancelReqModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const showFilter = useSelector(selectShowFilter);
  const allNewReqs = useSelector(selectAllNewReqsList);
  const loading = useSelector(selectLoading);

  const mainContext = useContext(rootContext);
  const {
    // handleCheckPermission,
    // menuPermission,
    handleGetAllNewReqsList,
    allNewReqsList,
    handleUpdateSupStatus,
  } = mainContext;

  useEffect(() => {
    setPageTitle("درخواست های جدید");
  }, [setPageTitle]);

  const allNewRequestsContext = useContext(allNewReqsContext);
  const {} = allNewRequestsContext;

  //handleReset
  useEffect(() => {
    dispatch(RsetSerialFilter(""));
    dispatch(RsetUserFilter(""));
    dispatch(RsetTypeFilter(""));
    dispatch(RsetFromDateFilter(null));
    dispatch(RsetToDateFilter(null));
    const filterValues = {
      applicantId: localStorage.getItem("id"),
      serial: "",
      memberId: "",
      type: "",
      fromDate: "null",
      toDate: "null",
    };
    dispatch(handleAllNewReqs(filterValues));
  }, []);

  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);
  const columns = useMemo(() => [
    {
      Header: "سریال",
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
      Header: "دسته بندی",
      accessor: "reqCategory",
      sort: true,
    },
    {
      Header: "عملیات",
      accessor: "reqOperation",
      sort: false,
    },
  ]);

  const [seenSerial, setSeenSerial] = useState("");
  const [notVisited, setNotVisited] = useState([]);
  const handleUpdateNSeen = (serialNumber) => {
    var notVisitedArr = [];
    for (var i = 0; i < notVisited.length; i++) {
      if (notVisited[i] !== serialNumber) {
        notVisitedArr.push(notVisited[i]);
      } else {
      }
    }
    setNotVisited(notVisitedArr);
  };

  useEffect(() => {
    handleUpdateNSeen(seenSerial);
  }, [seenSerial]);

  const operation = (request, serialNumber) => {
    return (
      <div className="d-flex justify-content-between flex-wrap">
        {request.typeId !== 3 ? (
          <Button
            title="تایید"
            className="btn btn-success d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              if (request.typeId === 5) {
                handleUpdateSupStatus(
                  "accept",
                  request.userId,
                  request.requestId
                );
              } else {
                dispatch(
                  handleCurrentReqInfo({
                    reqId: request.requestId,
                    reqType: request.typeId,
                    reqSeen: request.seen,
                    company: "",
                    dep: request.deptName,
                    oprationType: "accept",
                  })
                );
                setSeenSerial(serialNumber);
              }
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
        ) : null}
        {/* {request.typeId === 2 ?
                    <Button
                        title='ویرایش'
                        className='btn btn-primary d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            // setEditRequestModal(true);
                            // handleGetCurrentRequest(actionCode)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    : null} */}
        {request.typeId !== 3 ? (
          <Button
            title="ابطال"
            className="btn btn-danger d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              if (request.typeId === 5) {
                handleUpdateSupStatus(
                  "reject",
                  request.userId,
                  request.requestId
                );
              } else {
                dispatch(
                  handleCurrentReqInfo({
                    reqId: request.requestId,
                    reqType: request.typeId,
                    reqSeen: request.seen,
                    company: "",
                    dep: request.deptName,
                    oprationType: "cancel",
                  })
                );
                setSeenSerial(serialNumber);
              }
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        ) : null}
        {request.typeId === 3 ? (
          <Button
            title="مشاهده"
            className="btn btn-warning d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(RsetAcceptReqModal(false));
              dispatch(RsetCancelReqModal(false));
              localStorage.setItem("currentReqId", request.req_id);
              localStorage.setItem("currentReqType", request.typeId);
              //setViewRequestModal(true);
            }}
          >
            <Link
              to={`/OfficeRequest/${request.req_id}`}
              target="blank"
              className="text-dark"
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
          </Button>
        ) : null}
      </div>
    );
  };
  const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
    var tableItems = [];
    if (requests.length !== 0) {
      for (var i = 0; i < requests.length; i++) {
        var tableItem = {
          reqSerial: requests[i].serial,
          reqDate: moment
            .utc(requests[i].createdDate, "YYYY/MM/DD")
            .locale("fa")
            .format("jYYYY/jMM/jDD"),
          reqUser: requests[i].fullName,
          reqCategory: requests[i].title,
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
            reqSerial: requests[i].serial,
            reqDate: moment
              .utc(requests[i].createdDate, "YYYY/MM/DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD"),
            reqUser: requests[i].fullName,
            reqCategory: requests[i].title,
            reqOperation: operation(
              requests[i],
              requests[i].serial !== null ? requests[i].serial : ""
            ),
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
    <Container fluid className="py-4">
      <Row>
        <Col>
          {/* {menuPermission ? */}
          <Fragment>
            {showFilter ? <AllNewReqsFilter /> : null}
            <section className="position-relative">
              <div className="lightGray2-bg p-4 borderRadius border border-white border-2 shadow ">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
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
                    onClick={async () => {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        serial: "",
                        memberId: "",
                        fromDate: "null",
                        toDate: "null",
                        type: "",
                      };
                      dispatch(handleAllNewReqs(filterValues));
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
                    به روزرسانی
                  </Button>
                </div>
                <section className="position-relative">
                  {loading ? <Loading /> : null}
                  <Fragment>
                    {/* <AllNewReqsFilter /> */}
                    <AllNewReqsList
                      requests={allNewReqs}
                      columns={columns}
                      data={data}
                      onSort={handleSort}
                      fetchData={fetchData}
                      loading={load}
                      pageCount={pageCount}
                    />
                    {acceptReqModal && currentReqInfo.typeId === 2 ? (
                      <AcceptRequestModal />
                    ) : null}
                    {nextAcceptReqModal && currentReqInfo.typeId === 2 ? (
                      <NextAcceptRequestModal />
                    ) : null}
                    {cancelReqModal && currentReqInfo.typeId === 2 ? (
                      <CancelRequestModal />
                    ) : null}
                  </Fragment>
                </section>
              </div>
            </section>
          </Fragment>
        </Col>
      </Row>
    </Container>
  );
};

export default AllNewRequests;
