import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container } from "react-bootstrap";
import {
  faArrowsRotate,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-jalaali";
import Loading from "../Common/Loading";
import FilesClodItem from "./UploadedFile";
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
import { RsetUserInfoModals } from "../Slices/OverTimeSlice";
// import { handleAccMode, handleAppName, handleCloudListFile, handleDownloadFile, selectAllCloudList, selectAppNameFilterFC, selectFileNameFilterFC, selectFromDateFilterFC, selectSerialFilterFC, selectToDateFilterFC, selectUserNameReqFilterFC } from "../Slices/filesCloudSlice";
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
  const activeTab = useSelector(selectActiveTab);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    if (activeTab !== "") {
      dispatch(RsetRealFilter(false));
      dispatch(RsetSerialFilter(""));
      dispatch(RsetUserFilter(""));
      dispatch(RsetStatusFilter(""));
      dispatch(RsetFromDateFilter(null));
      dispatch(RsetToDateFilter(null));
      dispatch(RsetShowFilter(false));
      if (activeTab === "myReqs") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          mDep: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          type: 6,
          group: 2,
        };
        dispatch(handleReqsList(filterValues));
      } else if (activeTab === "inProcessReqs") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          mDep: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          type: 6,
          group: 0,
        };
        dispatch(handleReqsList(filterValues));
      } else if (activeTab === "allReqs") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          mDep: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          type: 6,
          group: 1,
        };
        dispatch(handleReqsList(filterValues));
      }
    }
  }, [activeTab]);
  const columns = useMemo(() => [
    {
      Header: "سریال",
      accessor: "col1",
      sortType: "basic",
    },
    {
      Header: "تاریخ",
      accessor: "col2",
      sortType: "basic",
    },
    {
      Header: "ارسال کننده",
      accessor: "col3",
      sortType: "basic",
    },
    {
      Header: "فایل",
      accessor: "col4",
      sortType: "basic",
    },
    {
      Header: "نام فایل",
      accessor: "fileName",
      sortType: "basic",
    },
    {
      Header: "ورژن",
      accessor: "col5",
      sortType: "basic",
    },
    {
      Header: "نام نرم افزار",
      accessor: "col6",
      sortType: "basic",
    },
    {
      Header: "توضیحات",
      accessor: "col7",
      sortType: "basic",
    },
  ]);

  const userName = (request) => {
    return (
      <span
        className="cursorPointer"
        onClick={() => {
          dispatch(RsetUserInfoModals(true));
        }}
      >
        {`${request.userInfo.first_name} ${request.userInfo.last_name}`}
      </span>
    );
  };

  const userSeries = (request) => {
    return <span onClick={() => {}}>{request.serial_number}</span>;
  };

  const file = (reqId, fileName) => {
    return (
      <FontAwesomeIcon
        onClick={() => {
          // dispatch(handleDownloadFile({ reqId: reqId, fileName: fileName }))
        }}
        className="font20 text-primary cursorPointer align-items-center"
        icon={faCloudArrowDown}
      />
    );
  };

  const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
    var tableItems = [];
    console.log(requests);
    if (requests.length !== 0) {
      for (var i = 0; i < requests.length; i++) {
        var tableItem = {
          col1: userSeries(requests[i]),
          col2: new Date(requests[i].date).toLocaleString("fa-IR", {
            numberingSystem: "latn",
          }),
          col3: userName(requests[i]),
          col4: file(requests[i]._id, requests[i].file.filename),
          col5: requests[i].version,
          col6: requests[i].application.name,
          col7: requests[i].description,
          fileName: requests[i].file.originalname.split(".")[0],
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
            col1: userSeries(requests[i]),
            col2: new Date(requests[i].date).toLocaleString("fa-IR", {
              numberingSystem: "latn",
            }),
            col3: userName(requests[i]),
            col4: file(requests[i]._id, requests[i].file.filename),
            col5: requests[i].version,
            col6: requests[i].application.name,
            col7: requests[i].description,
            fileName: requests[i].file.originalname.split(".")[0],
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
    <Container fluid>
      <div className="d-flex justify-content-end">
        <Link to="/FileUploadForm">
          <Button size="sm" className="font12" variant="link">
            آپلود فایل جدید
          </Button>
        </Link>
      </div>
      <FileClodFilter />
      {/* {userInfo && <UserInfoModal />} */}
      <div className="my-4">
        <section className="position-relative">
          {/* {isLoading && <Loading />} */}
          <div>
            <Button
              size="sm"
              className="my-2"
              onClick={() => {
                // const filterValues = {
                //     serial: serialNumber !== "" ? serialNumber : "",
                //     filename: fileNameFilterFC !== "" ? fileNameFilterFC : "",
                //     application: appNameFilter !== "" ? appNameFilter.value : appNameFilter,
                //     fromDate: fromDateFilterFC !== null ? fromDateFilterFC.format("YYYY/MM/DD") : "null",
                //     toDate: toDateFilterFC !== null ? toDateFilterFC.format("YYYY/MM/DD") : "null",
                //     memberId: userNameFilter !== "" ? userNameFilter.value : "",
                // }
                // dispatch(handleCloudListFile(filterValues))
                dispatch(RsetLoading(true));
              }}
            >
              <span>
                <FontAwesomeIcon
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  className="ml-2 me-1"
                  icon={faArrowsRotate}
                />
                به روز رسانی
              </span>
            </Button>
            <FilesClodItem
              requests={cloudList}
              columns={columns}
              data={data}
              onSort={handleSort}
              fetchData={fetchData}
              loading={load}
              pageCount={pageCount}
            />
          </div>
        </section>
      </div>
    </Container>
  );
};

export default UploadedFilesList;
