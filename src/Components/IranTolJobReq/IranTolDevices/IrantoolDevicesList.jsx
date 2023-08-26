import React, { useEffect, useMemo, useCallback, useRef, useState, Fragment } from "react";
import { faArrowsRotate, faBan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xssFilters from "xss-filters";
import IrantoolReqItem from "./IrantoolDeviceItem";
import IrantoolDevicesFilter from "./IrantoolDevicesFilter";
import UserInfoModal from "../../Modals/UserInfoModal";
import InActiveRequestModal from "../../Modals/ITJReqModals/IrantoolDevicesModals/IrantoolInActiveDeviceModal";
import {
  selectUserInfoModal,
  handleCurrentReqInfo,
} from "../../Slices/mainSlices";
import {
  selectIrantoolFilterData,
  handleIrantoolList,
  selectIrantoolDeviceModal,
  RsetIrantoolDeviceModal,
  selectIrantoolInActiveDeviceModal,
  RsetIrantoolInActiveDeviceModal,
  handleResetITFilter
} from "../../Slices/irantoolSlices";
import { RsetCurrentReqInfo } from "../../Slices/currentReqSlice";

import IrantoolReqRegistrationModal from "../../Modals/ITJReqModals/IrantoolDevicesModals/IrantoolDeviceRegistrationModal";

const IrantoolDevicesList = () => {
  const [data, setData] = useState([]);
  const [load, setload] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const sortIdRef = useRef(0);

  const dispatch = useDispatch();
  const userInfoModal = useSelector(selectUserInfoModal);
  const irantoolDeviceModal = useSelector(selectIrantoolDeviceModal);
  const irantoolFilterData = useSelector(selectIrantoolFilterData);
  const irantoolInActiveDeviceModal = useSelector(selectIrantoolInActiveDeviceModal);

  const columns = useMemo(() => [
    {
      Header: "دسته بندی",
      accessor: "categoryName",
      sort: true,
    },
    {
      Header: "کد دستگاه",
      accessor: "machineCode",
      sort: true,
    },
    {
      Header: "ساعت کارکرد",
      accessor: "useabilityHour",
      sort: true,
    },
    {
      Header: "شیفت",
      accessor: "numberOfShift",
      sort: true,
    },
    {
      Header: "عملیات",
      accessor: "irantoolOpration",
      sort: true,
    },
  ]);

  const operation = (request) => {
    if(request.enable === true){
      return (
        <div className="d-flex justify-content-between flex-wrap">
          <Button
            title="ویرایش"
            className="btn btn-info d-flex align-items-center mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(RsetCurrentReqInfo(request));
              dispatch(RsetIrantoolDeviceModal(true));
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button
            title="غیرفعال کردن"
            className="btn btn-danger d-flex align-items-center me-2 mb-2 mb-md-0"
            size="sm"
            active
            onClick={() => {
              dispatch(RsetCurrentReqInfo(request));
              dispatch(RsetIrantoolInActiveDeviceModal(true));
            }}
          >
            <FontAwesomeIcon icon={faBan} />
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
          categoryName: requests[i].categoryName,
          machineCode: requests[i].machineCode.split('').every(char => char === requests[i].machineCode[0])? '' : requests[i].machineCode,
          useabilityHour: requests[i].useabilityHour,
          numberOfShift: requests[i].numberOfShift,
          irantoolOpration: operation(requests[i]),
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
            categoryName: requests[i].categoryName,
            machineCode: requests[i].machineCode.split('').every(char => char === requests[i].machineCode[0])? '' : requests[i].machineCode,
            useabilityHour: requests[i].useabilityHour,
            numberOfShift: requests[i].numberOfShift,
            irantoolOpration: operation(requests[i]),
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

  useEffect(() => {
    dispatch(handleIrantoolList());
  }, []);

  return (
    <Container fluid className="pb-4 mt-4">
      <Fragment>
        <IrantoolDevicesFilter />
        <section className="position-relative">
          <div>
            <Fragment>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  size="sm"
                  variant="primary"
                  className="mb-2"
                  onClick={() => {
                    dispatch(RsetIrantoolDeviceModal(true));
                  }}
                >
                  + افزودن ایتم
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="mb-2"
                  onClick={() => {
                    dispatch(handleResetITFilter());
                    dispatch(handleIrantoolList());
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsRotate} className="me-2" />
                  به روزرسانی
                </Button>
              </div>
              {irantoolFilterData !== undefined ? (
                <Fragment>
                  <IrantoolReqItem
                    requests={irantoolFilterData}
                    columns={columns}
                    data={data}
                    onSort={handleSort}
                    fetchData={fetchData}
                    loading={load}
                    pageCount={pageCount}
                  />
                  {userInfoModal && <UserInfoModal />}
                  {/* {editReqModal && <EditRequestModal />} */}
                  {irantoolInActiveDeviceModal && <InActiveRequestModal />}
                </Fragment>
              ) : null}
            </Fragment>
          </div>
        </section>
      </Fragment>
      {irantoolDeviceModal && <IrantoolReqRegistrationModal />}
    </Container>
  );
};

export default IrantoolDevicesList;
