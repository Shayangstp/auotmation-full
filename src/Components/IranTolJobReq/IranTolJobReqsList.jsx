import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
  useContext,
  Fragment,
} from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import IranTolJobReqsFilter from "./IranTolJobReqsFilter";
import { rootContext } from "../context/rootContext";
import { iranTolJobCntxt } from "../context/iranTolJobContext/IranTolJobCntxt";
import IranTolJobReqItem from "./IranTolJobReqItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faEye,
  faArrowsRotate,
  faFilter,
  faHome,
  faWarning,
  faPaperPlane,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";
import Loading from "../Common/Loading";
import {
  handleCurrentReqInfo,
  handleUserInformation,
  handleUserImage,
  selectUser,
  handleUserData,
} from "../Slices/mainSlices";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  RsetIrantoolAddMaterialWorkFlowModal,
  selectIrantoolMaterialWorkFlowModal,
} from "../Slices/irantoolSlices";
import AddMaterialWorkFlowModal from "../Modals/ITJReqModals/AddMaterialWorkflowModal";
import { selectShowFilter, RsetShowFilter } from "../Slices/filterSlices";

const IranTolJobReqsList = ({ setPageTitle }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const mainContext = useContext(rootContext);
  const {
    // handleCheckPermission,
    // menuPermission,
    loading,
    handleGetRequestList,
    requestList,
  } = mainContext;
  useEffect(() => {
    // handleCheckPermission(localStorage.getItem('lastLocation'));
  }, []);

  const jobContext = useContext(iranTolJobCntxt);
  const { setActionReqId, setActionToPersonsModal } = jobContext;

  useEffect(() => {
    setPageTitle("لیست درخواست کار ایرانتول");
  }, [setPageTitle]);

  const irantoolAddMaterialWorkFlowModal = useSelector(
    selectIrantoolMaterialWorkFlowModal
  );
  const user = useSelector(selectUser);
  const showFilter = useSelector(selectShowFilter);

  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);
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
      Header: "شرکت درخواست کننده",
      accessor: "reqCo",
      sort: true,
    },
    {
      Header: "نوع فرایند",
      accessor: "projectType",
      sort: true,
    },
    {
      Header: "نوع پروژه",
      accessor: "toolType",
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

  const [seenSerial, setSeenSerial] = useState("");
  const [notVisited, setNotVisited] = useState([]);
  const handleNotVisited = (requests) => {
    const notVisitedArr = [];
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].seen === false) {
        notVisitedArr.push(requests[i].serial);
      } else {
      }
    }
    setNotVisited(notVisitedArr);
  };

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

  const link = (reqItem, serialNumber) => {
    return (
      <a
        className="text-dark text-decoration-none cursorPointer serialHover"
        title={"مشاهده درخواست " + xssFilters.inHTMLData(serialNumber)}
        onClick={() => {
          dispatch(
            handleCurrentReqInfo({
              reqId: reqItem.requestId,
              reqType: reqItem.typeId,
              reqSeen: reqItem.seen,
              company: reqItem.companyName,
              dep: "",
              oprationType: "view",
            })
          );
          setSeenSerial(serialNumber);
        }}
      >
        {xssFilters.inHTMLData(serialNumber)}
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
          dispatch(handleUserImage({ userId: request.userId, status: 1 }));
        }}
      >
        {xssFilters.inHTMLData(request.fullName)}
      </div>
    );
  };

  const operation = (request, serialNumber) => {
    if (request.lastToPersons === null && request.lastActionCode !== 2) {
      return (
        <section className="d-flex justify-content-between flex-wrap">
          <Button
            title="ارسال"
            className="d-flex align-items-center"
            size="sm"
            active
            onClick={() => {
              setActionToPersonsModal(true);
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "ارسال",
                })
              );
              setActionReqId(request.requestId);
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </section>
      );
    } else if (
      request.lastToPersons !== null &&
      request.lastToPersons
        .split(",")
        .some((elem) => elem === localStorage.getItem("id")) === true &&
      request.lastActionCode === 0
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            variant="success"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "accept",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            title="ابطال"
            variant="danger"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "cancel",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        </div>
      );
      // plannig manager
    } else if (
      request.lastToPersons !== undefined &&
      request.lastActionCode === 37 &&
      user.Roles !== undefined &&
      user.Roles.some((role) => role === "4")
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            variant="success"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "accept",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            title="ابطال"
            variant="danger"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "cancel",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        </div>
      );
      //product manager
    } else if (
      request.lastToPersons !== undefined &&
      request.lastActionCode === 39 &&
      user.Roles !== undefined &&
      user.Roles.some((role) => role === "6")
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            variant="success"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "accept",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            title="ابطال"
            variant="danger"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "cancel",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        </div>
      );
      //product manager
    } else if (
      request.lastToPersons !== undefined &&
      request.lastActionCode === 38 &&
      user.Roles !== undefined &&
      user.Roles.some((role) => role === "5")
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            variant="success"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "accept",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            title="ابطال"
            variant="danger"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "cancel",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        </div>
      );
      // product Manager for second time accept the maps
    } else if (
      request.lastToPersons !== undefined &&
      request.lastActionCode === 40 &&
      user.Roles !== undefined &&
      user.Roles.some((role) => role === "5")
    ) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="تایید"
            variant="success"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "accept",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            title="ابطال"
            variant="danger"
            className="d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "cancel",
                })
              );
              setSeenSerial(serialNumber);
              dispatch(RsetIrantoolAddMaterialWorkFlowModal(true));
              // history.push(`/MtrWrkflw/${request.requestId}`);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
        </div>
      );
      // this is for when tolid seen second time
    } else if (
      request.lastToPersons !== null &&
      request.lastToPersons
        .split(",")
        .some((elem) => elem === localStorage.getItem("id")) === true &&
      request.lastActionCode === 41
    ) {
      return (
        <section className="d-flex justify-content-between flex-wrap">
          <Button
            title="مشاهده"
            variant="warning"
            className="d-flex align-items-center"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "view",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            title="ثبت متریال و مراحل کار"
            className="btn btn-primary d-flex align-items-center"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "plus",
                })
              );
              setSeenSerial(serialNumber);
              // history.push(`/MtrWrkflw/${request.requestId}`);
              dispatch(RsetIrantoolAddMaterialWorkFlowModal(true));
              console.log(request);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </section>
      );
    } else {
      return (
        <section className="d-flex justify-content-between flex-wrap">
          <Button
            title="مشاهده"
            variant="warning"
            className="d-flex align-items-center"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "view",
                })
              );
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          {/* <Button
            title="ثبت متریال و مراحل کار"
            className="d-flex align-items-center"
            size="sm"
            active
            onClick={() => {
              dispatch(
                handleCurrentReqInfo({
                  reqId: request.requestId,
                  reqType: request.typeId,
                  reqSeen: request.seen,
                  company: request.companyName,
                  dep: "",
                  oprationType: "plus",
                })
              );
              setSeenSerial(serialNumber);
              // history.push(`/MtrWrkflw/${request.requestId}`);
              history.push(`/MtrWrkflw`);
              // dispatch(RsetIrantoolAddMaterialWorkFlowModal(true));
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button> */}
        </section>
      );
    }
  };

  const fetchData = useCallback(
    ({ pageSize, pageIndex, requests }) => {
      var tableItems = [];
      if (requests.length !== 0) {
        for (var i = 0; i < requests.length; i++) {
          var tableItem = {
            reqSerial: link(requests[i], requests[i].serial),
            reqDate: moment
              .utc(requests[i].createdDate, "YYYY/MM/DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD"),
            reqUser: userInfo(requests[i]),
            reqCo: xssFilters.inHTMLData(requests[i].companyName),
            projectType: xssFilters.inHTMLData(requests[i].requestTypeName),
            toolType: xssFilters.inHTMLData(requests[i].toolTypeName),
            reqStatus: xssFilters.inHTMLData(requests[i].statusName),
            reqOperation:
              user === undefined
                ? undefined
                : operation(requests[i], requests[i].serial),
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
            reqSerial: link(requests[i], requests[i].serial),
            reqDate: moment
              .utc(requests[i].createdDate, "YYYY/MM/DD")
              .locale("fa")
              .format("jYYYY/jMM/jDD"),
            reqUser: userInfo(requests[i]),
            reqCo: xssFilters.inHTMLData(requests[i].companyName),
            projectType: xssFilters.inHTMLData(requests[i].requestTypeName),
            toolType: xssFilters.inHTMLData(requests[i].toolTypeName),
            reqStatus: xssFilters.inHTMLData(requests[i].statusName),
            reqOperation:
              user === undefined
                ? undefined
                : operation(requests[i], requests[i].serial),
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

  useEffect(() => {
    const filterParams = {
      applicantId: localStorage.getItem("id"),
      serial: "",
      memberId: "",
      company: "",
      requestType: "",
      toolType: "",
      status: "",
      fromDate: "null",
      toDate: "null",
      type: 1,
    };
    handleGetRequestList(filterParams);
  }, []);

  useEffect(() => {
    dispatch(RsetShowFilter(false));
  }, []);

  return (
    <Container fluid className="py-4">
      <Fragment>
        {showFilter ? (
          <Row>
            <Col md="12">
              <IranTolJobReqsFilter />
            </Col>
          </Row>
        ) : null}
        <div className="lightGray2-bg p-4 borderRadius border border-white border-2 shadow ">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Link to="/IrtReqRegistration">
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
              className="mb-2"
              onClick={() => {
                const filterParams = {
                  applicantId: localStorage.getItem("id"),
                  serial: "",
                  memberId: "",
                  company: "",
                  requestType: "",
                  toolType: "",
                  status: "",
                  fromDate: "null",
                  toDate: "null",
                  type: 1,
                };
                handleGetRequestList(filterParams);
              }}
            >
              <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
              به روزرسانی
            </Button>
          </div>
          <section className="position-relative">
            {loading ? <Loading /> : null}

            <div>
              <IranTolJobReqItem
                requests={requestList}
                notVisited={notVisited}
                columns={columns}
                data={data}
                onSort={handleSort}
                fetchData={fetchData}
                loading={load}
                pageCount={pageCount}
                handleNotVisited={handleNotVisited}
              />
            </div>
          </section>
        </div>
      </Fragment>
      {irantoolAddMaterialWorkFlowModal && <AddMaterialWorkFlowModal />}
    </Container>
  );
};

export default IranTolJobReqsList;
