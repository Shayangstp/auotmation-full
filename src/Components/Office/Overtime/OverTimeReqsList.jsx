import React, { useContext, useCallback, useMemo, useState, useRef, useEffect } from "react";
import OverTimeReqItem from "./OverTimeReqItem";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-jalaali";
import { handleReasonOvertime, handleResetOverTimeFilter } from "../../Slices/OverTimeSlice";
import { faArrowsRotate, faPenToSquare, faCheck, faBan, faEye, faClockRotateLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import CancelOverTime from "../../Modals/OfficeReqsModals/overTimeModals/CancelOverTime";
import EditOverTime from "../../Modals/OfficeReqsModals/overTimeModals/EditOverTime";
import AcceptOverTime from "../../Modals/OfficeReqsModals/overTimeModals/AcceptOverTime";
import ViewOverTime from "../../Modals/OfficeReqsModals/overTimeModals/ViewOverTime";
import UserInfoModal from "../../Modals/UserInfoModal";
import HistoryOverTime from "../../Modals/OfficeReqsModals/overTimeModals/HistoryOverTime";
import { handleCurrentReqInfo, handleUserInformation, handleUserImage, handleHistories, RsetIsLoadingCheckout, handleReqsList,
   selectReqsList, selectLoading, selectUserInfoModal, RsetActionToPersonsModal, selectActionToPersonsModal
} from "../../Slices/mainSlices";
import Loading from "../../Common/Loading";
import { errorMessage } from "../../../utils/message";
import OverTimeReqsFilter from "./OverTimeReqsFilter";
import xssFilters from "xss-filters";
import ApplySendForms from "../../Modals/OfficeReqsModals/overTimeModals/ApplySendForms";
import NextAcceptOverTime from "../../Modals/OfficeReqsModals/overTimeModals/NextAcceptOverTime";

import { RsetCurrentReqInfo } from "../../Slices/currentReqSlice";
import { selectAcceptReqModal, selectCancelReqModal, selectEditReqModal, selectReqHistoryModal, selectViewReqModal, selectNextAcceptReqModal, RsetReqHistoryModal } from "../../Slices/modalsSlice";


const OverTimeReqsList = ({setPageTitle}) => {

  useEffect(()=>{
    setPageTitle('لیست درخواست های اضافه کار');
  },[])



  const dispatch = useDispatch();
  const acceptReqModal = useSelector(selectAcceptReqModal);
  const cancelReqModal = useSelector(selectCancelReqModal);
  const editReqModal = useSelector(selectEditReqModal);
  const viewReqModal = useSelector(selectViewReqModal);
  const reqHistoryModal = useSelector(selectReqHistoryModal);

  const userInfoModal = useSelector(selectUserInfoModal);
  const actionToPersonsModal = useSelector(selectActionToPersonsModal);
  const usersList = useSelector(selectReqsList);
  const loading = useSelector(selectLoading);
  const nextAcceptReqModal = useSelector(selectNextAcceptReqModal)

  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);
  const columns = useMemo(() => [
    {
      Header: "سریال درخواست",
      accessor: "reqSerial",
      sortType: "basic",
    },
    {
      Header: "تاریخ",
      accessor: "reqDate",
      sortType: "basic",
    },
    {
      Header: "درخواست کننده",
      accessor: "reqUser",
      sortType: "basic",
    },
    {
      Header: "واحد",
      accessor: "reqDep",
      sortType: "basic",
    },
    {
      Header: "وضعیت",
      accessor: "reqStatus",
      sortType: "basic",
    },
    {
      Header: "عملیات",
      accessor: "reqOperation",
      sortType: "basic",
    },
  ]);

  const [seenSerial, setSeenSerial] = useState('');
  const [notVisited, setNotVisited] = useState([]);
  const handleNotVisited = (requests) => {
      const notVisitedArr = []
      for (var i = 0; i < requests.length; i++) {
          if (requests[i].seen === false) {
              notVisitedArr.push(requests[i].reqInfo.serial_number);
          } else {

          }
      }
      setNotVisited(notVisitedArr);
  }

  const handleUpdateNSeen = (serialNumber) => {
      var notVisitedArr = []
      for (var i = 0; i < notVisited.length; i++) {
          if (notVisited[i] !== serialNumber) {
              notVisitedArr.push(notVisited[i])
          } else {

          }
      }
      setNotVisited(notVisitedArr)
  }

  useEffect(() => {
      handleUpdateNSeen(seenSerial);
  }, [seenSerial])

  const link = (request, serialNumber) => {
    return (
      <span
        onClick={() => {
          dispatch(handleCurrentReqInfo({reqId: request.reqInfo._id, reqType: request.type, reqSeen: request.seen, company: '', dep: request.department, oprationType: 'view'}));
          
          setSeenSerial(serialNumber);
        }}
        className="cursorPointer"
      >
        {request.reqInfo.serial_number}
      </span>
    );
  };
  const userInfo = (request) => {
    return (
      <div className='text-dark cursorPointer' title='مشاهده اطلاعات کاربر '
        onClick={() => {
          // dispatch(handleUserInformation(request.process[0].userInfo._id));
          // dispatch(handleUserImage(request.process[0].userInfo._id));
        }}
      >
        {request.process[0] !== undefined ? (xssFilters.inHTMLData(request.process[0].userInfo.first_name) + " " + xssFilters.inHTMLData(request.process[0].userInfo.last_name)) : ''}
      </div>
    );
  };
  const operation = (request, serialNumber) => {
    var index = request.process.length - 1;
    if (request.process[0].toPersons === undefined) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            variant="primary"
            className="d-flex me-1 align-items-center btn-sm"
            onClick={() => {
              dispatch(handleReasonOvertime());
              dispatch(handleCurrentReqInfo({reqId: request.reqInfo._id, reqType: request.type, reqSeen: request.seen, company: '', dep: request.department, oprationType: 'edit'}));
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button className="d-flex me-1 align-items-center text-dark btn-sm"
            variant="info"
            onClick={async () => {
              // const data = await dispatch(
              //   handleHistories({
              //     serial: request.reqInfo.serial_number,
              //     type: 14,
              //   })
              // );
              // if (data.payload.length !== 0) {
              //   dispatch(handleUserInformation(request.process[0]._id));
              //   dispatch(handleUserImage(request.process[0]._id));
              //   dispatch(RsetReqHistoryModal(true));
              // } else {
              //   errorMessage("اطلاعات یافت نشد");
              // }
            }}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </Button>
          <Button className="d-flex me-1 align-items-center cursorPointer btn-sm"
            onClick={() => {
              dispatch(RsetCurrentReqInfo(request));
              dispatch(RsetActionToPersonsModal(true));
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </div>
      );
    } else if (request.process[index].toPersons !== undefined && request.process[index].toPersons.some( elm => elm === localStorage.getItem("id") )) {
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            variant="success"
            className="d-flex me-1 align-items-center btn-sm"
            onClick={async () => {
              dispatch(handleCurrentReqInfo({reqId: request.reqInfo._id, reqType: request.type, reqSeen: request.seen, company: '', dep: request.department, oprationType: 'accept'}));
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            className="d-flex me-1 align-items-center btn-sm"
            variant="danger"
            onClick={() => {
              dispatch(handleCurrentReqInfo({reqId: request.reqInfo._id, reqType: request.type, reqSeen: request.seen, company: '', dep: request.department, oprationType: 'cancel'}));
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </Button>
          <Button
            className="d-flex me-1 align-items-center text-dark btn-sm"
            variant="info"
            onClick={async () => {
              // const data = await dispatch(
              //   handleHistories({
              //     serial: request.reqInfo.serial_number,
              //     type: 14,
              //   })
              // );
              // if (data.payload.length !== 0) {
              //   dispatch(handleUserInformation(request.process[0]._id));
              //   dispatch(handleUserImage(request.process[0]._id));
              // } else {
              //   errorMessage("اطلاعات یافت نشد");
              // }
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
            variant="warning"
            className="d-flex me-1 align-items-center btn-sm"
            onClick={() => {
              dispatch(handleCurrentReqInfo({reqId: request.reqInfo._id, reqType: request.type, reqSeen: request.seen, company: '', dep: request.department, oprationType: 'view'}));
              setSeenSerial(serialNumber);
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            className="d-flex me-1 align-items-center text-dark btn-sm"
            variant="info"
            onClick={async () => {
              // const data = await dispatch(
              //   handleHistories({
              //     serial: request.reqInfo.serial_number,
              //     type: 14,
              //   })
              // );
              // if (data.payload.length !== 0) {
              //   dispatch(handleUserInformation(request.process[0]._id));
              //   dispatch(handleUserImage(request.process[0]._id));
              //   dispatch(RsetReqHistoryModal(true));
              // } else {
              //   errorMessage("اطلاعات یافت نشد");
              // }
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
          reqSerial: link(requests[i], requests[i].reqInfo.serial_number),
          reqDate: moment(requests[i].process[0].date, "YYYY/MM/DD ").locale("fa").format("jYYYY/jMM/jDD"),
          reqUser: userInfo(requests[i]),
          reqDep: requests[i].department.name,
          reqStatus: requests[i].status.name,
          reqOperation: operation(requests[i], requests[i].reqInfo.serial_number),
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
            reqSerial: link(requests[i], requests[i].reqInfo.serial_number),
            reqDate: moment(requests[i].process[0].date, "YYYY/MM/DD ").locale("fa").format("jYYYY/jMM/jDD"),
            reqUser: userInfo(requests[i]),
            reqDep: requests[i].department.name,
            reqStatus: requests[i].status.name,
            reqOperation: operation(requests[i], requests[i].reqInfo.serial_number),
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
    },[]
  );

  useEffect(()=>{
    const filterValues = {
      applicantId: localStorage.getItem("id"),
      memberId: '',
      mDep: '',
      status: '',
      fromDate: 'null',
      toDate: 'null',
      type: 14,
    };
    dispatch(handleReqsList(filterValues));
  },[])

  return (
    <Container fluid className="my-4">
      <div>
        <OverTimeReqsFilter/>
      </div>
      <section className="position-relative">
        {loading ? <Loading /> : null}
        <div>
          <Button
            size='sm'
            onClick={() => {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                memberId: '',
                mDep: '',
                status: '',
                fromDate: 'null',
                toDate: 'null',
                type: 14,
              };
              dispatch(handleReqsList(filterValues));
              dispatch(handleResetOverTimeFilter())
            }}
            className="my-2"
          >
            <span>
              <FontAwesomeIcon
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                className="ml-2 me-1"
                icon={faArrowsRotate}
              />
              به روز رسانی جدول
            </span>
          </Button>
          <OverTimeReqItem
            requests={usersList}
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
      {acceptReqModal ? <AcceptOverTime /> : null}
      {cancelReqModal ? <CancelOverTime /> : null}
      {editReqModal ? <EditOverTime /> : null}
      {viewReqModal ? <ViewOverTime /> : null}
      {reqHistoryModal ? <HistoryOverTime /> : null}
      {userInfoModal ? <UserInfoModal/> : null}
      {actionToPersonsModal ? <ApplySendForms/> : null}
      {nextAcceptReqModal ? <NextAcceptOverTime/> : null}
    </Container>
  );
};

export default OverTimeReqsList;
