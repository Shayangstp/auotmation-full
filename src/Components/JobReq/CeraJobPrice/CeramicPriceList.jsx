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
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";
import CeramicPriceFilter from "./CeramicPriceFilter";
import CeramicPriceItem from "./CeramicPriceItem";
import {
  selectCeramicMaterialFilterData,
  RsetCeramicMaterialFilterData,
  selectCeramicMaterialCode,
  selectCeramicMaterialName,
  selectCeramicMaterialModalHistory,
  RsetCeramicMaterialModalHistory,
} from "../Slices/ceramicPriceSlices";
import { handleCurrentReqInfo } from "../Slices/currentReqSlice";
import { handleUserInformation, handleUserImage } from "../Slices/mainSlices";
import CeramicMaterialModalHistory from "../Modals/CeramicPriceModal/CeramicMaterialModalHistory";

const SoftwareSupportList = () => {
  const dispatch = useDispatch();
  const ceramicMaterialFilterData = useSelector(
    selectCeramicMaterialFilterData
  );
  const ceramicMaterialCode = useSelector(selectCeramicMaterialCode);
  const ceramicMaterialName = useSelector(selectCeramicMaterialName);
  const ceramicMaterialModalHistory = useSelector(
    selectCeramicMaterialModalHistory
  );

  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);

  const columns = useMemo(() => [
    {
      Header: "کد قطعه",
      accessor: "materialCode",
      sort: true,
    },
    {
      Header: "نام قطعه",
      accessor: "materialName",
      sort: true,
    },
    {
      Header: "از تاریخ",
      accessor: "fromDate",
      sort: true,
    },
    {
      Header: "تا تاریخ",
      accessor: "toDate",
      sort: true,
    },
    {
      Header: "قیمت",
      accessor: "price",
      sort: true,
    },
    {
      Header: "اپراتور",
      accessor: "oprator",
      sort: false,
    },
    {
      Header: "تاریخ ثبت",
      accessor: "registeredDate",
      sort: false,
    },
    // {
    //   Header: "تعیین قیمت جدید",
    //   accessor: "newPrice",
    //   sort: false,
    // },
  ]);

  const link = (request) => {
    return (
      <a
        className="text-dark text-decoration-none cursorPointer serialHover"
        // title={"مشاهده درخواست " + request.materialCode}
        onClick={() => {
          dispatch(
            // handleCurrentReqInfo({
            //   company: "",
            //   reqId: request.requestId,
            //   reqType: request.typeId,
            //   reqSeen: request.seen,
            //   oprationType: "view",
            //   dep: "",
            // })
            dispatch(RsetCeramicMaterialModalHistory(true))
          );
          // setSeenSerial(request.serial);
        }}
      >
        {xssFilters.inHTMLData(request)}
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
  const operation = (request) => {
    const lastToPersons = Array.isArray(request.lastToPersons)
      ? request.lastToPersons.split(",")
      : null;
    if (
      Array.isArray(lastToPersons) &&
      lastToPersons.some((person) => person === localStorage.getItem("id"))
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
            className="btn btn-info d-flex align-items-center ms-2 mb-2 mb-md-0"
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
            className="btn btn-warning d-flex me-2 align-items-center"
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
              // dispatch(RsetViewReqModal(true));
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
              // dispatch(RsetReqHistoryModal(true));
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
          materialCode: link(requests[i].ItemCode),
          materialName: link(requests[i].ItemName),
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
            materialCode: link(requests[i].ItemCode),
            materialName: link(requests[i].ItemName),
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
      <Fragment>
        <Row>
          <CeramicPriceFilter />
        </Row>
        <section className="position-relative">
          <div>
            <Fragment>
              <Button
                size="sm"
                variant="primary"
                className="mb-2"
                onClick={() => {}}
              >
                <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
                به روزرسانی جدول
              </Button>
              {ceramicMaterialFilterData !== undefined ? (
                <Fragment>
                  <CeramicPriceItem
                    requests={ceramicMaterialFilterData}
                    // notVisited={notVisited}
                    columns={columns}
                    data={data}
                    onSort={handleSort}
                    fetchData={fetchData}
                    loading={load}
                    pageCount={pageCount}
                    // handleNotVisited={handleNotVisited}
                  />
                  {/* {acceptReqModal && <AcceptRequestModal />}
                  {cancelReqModal && <CancelRequestModal />}
                  {viewReqModal && <ViewRequestModal />}
                  {ReqHistoryModal && <HistoryRequestModal />}
                  */}

                  {ceramicMaterialModalHistory && (
                    <CeramicMaterialModalHistory />
                  )}
                  {}
                </Fragment>
              ) : null}
            </Fragment>
          </div>
        </section>
      </Fragment>
    </Container>
  );
};

export default SoftwareSupportList;
