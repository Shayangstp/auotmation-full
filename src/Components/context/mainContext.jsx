import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { rootContext } from "./rootContext";
import {
  checkPermission,
  gotPermissions,
  getCompanies,
  getCoDepartments,
  getAllUsersWithOffice,
  getAllUsers,
  getAllStatuses,
  getProvinces,
  getCities,
  getTodayDate,
  getDaysFood,
  getDepartmentUsers,
  getToPersonByRole,
  getCurrentReqInfo,
  getCurrentReqHistory,
  getNotSeenReqs,
  getCoUsers,
  checkReqUpdateDate,
  getCitiesByType,
  getProInfo,
  getRequestsList,
} from "../../Services/rootServices";
import {
  successMessage,
  errorMessage,
  warningMessage,
} from "../../utils/message";
import xssFilters from "xss-filters";
import { cookiesContext } from "./Cookies/cookiesContext";
// import { io } from "socket.io-client";

import { updateSupStatus } from "../../Services/accountService";

import { getAllNewReqsList } from "../../Services/allNewReqsServices";
import {
  postAction,
  getPurchaseList,
  updateDeadLinePriority,
  deletedReqItem,
  editWarehouseItem,
  updateRequest,
} from "../../Services/warehouseReqService";

import { addTripOptions } from "../../Services/officeServices";

import {
  selectUser,
  handleLastNewReqs,
  selectLastNewReqs,
  selectUserNotFoundModal,
} from "../Slices/mainSlices";
import { useDispatch } from "react-redux";

import UserInfoM from "../Modals/UserModals/UserInfoModal";
import { handleReqsList } from "../Slices/mainSlices";
import {
  RsetAcceptReqModal,
  selectNextAcceptReqModal,
  RsetNextAcceptReqModal,
  RsetCancelReqModal,
  RsetEditReqModal,
  RsetViewReqModal,
  RsetReqHistoryModal,
  selectAcceptReqComment,
  RsetAcceptReqComment,
  selectCancelReqComment,
  RsetCancelReqComment,
} from "../Slices/modalsSlice";
import {
  selectCurrentReqInfo,
  selectCurrentReqItems,
} from "../Slices/currentReqSlice";

const MainContext = ({ children }) => {
  const dispatch = useDispatch();
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const lastNewReqs = useSelector(selectLastNewReqs);
  const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
  const acceptReqComment = useSelector(selectAcceptReqComment);
  const cancelReqComment = useSelector(selectCancelReqComment);
  const currentReqItems = useSelector(selectCurrentReqItems);

  const cookieContext = useContext(cookiesContext);
  const { setCookie, getCookie } = cookieContext;

  // const socket = io("http://s-mirzaei:3006");
  // const socket = io("http://172.30.1.212:3006");
  // const socket = io("http://185.134.96.77:9081");
  // receive a message from the server
  // socket.on("changePermission", (...args) => {
  //     if (getCookie(localStorage.getItem('personalCode')) !== null) {
  //         setCookie(localStorage.getItem('personalCode'), 'expired', 0);
  //     }
  // });

  const generateRanHex = (size) => {
    let result = [];
    let hexRef = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
    ];
    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join("");
  };

  const [menuPermission, setMenuPermission] = useState(false);
  const handleCheckPermission = async (menuId) => {
    try {
      const permissions = getCookie(localStorage.getItem("id"));
      if (permissions === null || permissions === "expired") {
        const { data } = await checkPermission();
        var pers = [];
        data.map((per) => {
          pers.push(per.perId);
        });
        setCookie(localStorage.getItem("id"), pers, 365);
        const check = () => {
          const filteredItems = pers.filter((item) => item === menuId);
          return filteredItems;
        };
        handleGotPermissions();
        const per = check();
        if (per.length !== 0) {
          setMenuPermission(true);
        } else {
          setMenuPermission(false);
        }
      } else {
        const oldPermissions = permissions.split(",");
        const check = () => {
          const filteredItems = oldPermissions.filter(
            (item) => item === menuId
          );
          return filteredItems;
        };
        const per = check();
        if (per.length !== 0) {
          setMenuPermission(true);
        } else {
          setMenuPermission(false);
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  const handleGotPermissions = async () => {
    try {
      const { data } = await gotPermissions();
    } catch (ex) {
      console.log(ex);
    }
  };
  // menu END

  const handleUpdateSupStatus = async (operation, userId, reqId) => {
    try {
      const actionValues = {
        actionCode: 15,
        actionId: reqId,
        userId: localStorage.getItem("id"),
        typeId: 5,
      };
      const actionRes = await postAction(actionValues);
      if (actionRes.data.code === 415) {
        const { data } = await updateSupStatus(userId, operation);
        if (data.code === 415) {
          if (operation === "accept") {
            successMessage("تغییر سرپرست با موفقیت انجام شد!");
          } else if (operation === "reject") {
            successMessage("درخواست تغییر سرپرست رد شد!");
          }
        } else {
          errorMessage("خطا!");
        }
        dispatch(handleLastNewReqs());
        const filterParams = {
          applicantId: localStorage.getItem("id"),
          memberId: "",
          type: "",
          status: "",
          fromDate: "null",
          toDate: "null",
        };
        handleGetAllNewReqsList(filterParams);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  // get all companies
  const [companies, setCompanies] = useState([]);
  const [campaniesWithAll, setCompaniesWithAll] = useState([]);
  const handleGetCompanies = async () => {
    try {
      const { data } = await getCompanies();
      if (data.length !== 0) {
        var co = [];
        setCompanies(data);
        co = [...data];
        co.unshift({ value: "", label: "همه" });
        setCompaniesWithAll(co);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  // get company departments
  const [coDepartments, setCoDepartments] = useState([]);
  const [coDepartmentsWithAll, setCoDepartmentsWithAll] = useState([]);
  const handleGetCoDepartments = async (companyCode, location) => {
    try {
      const { data } = await getCoDepartments(companyCode, location);
      if (data.code === 403) {
        errorMessage("واحدی در این شرکت یافت نشد");
      } else if (data.code === 413) {
        errorMessage("خطا برقراری ارتباط!");
      } else if (data.code === 415) {
        var deps = [];
        setCoDepartments(data.deps);
        deps = [...data.deps];
        deps.unshift({ value: "", label: "همه" });
        setCoDepartmentsWithAll(deps);
      } else {
        setCoDepartments([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  // get all users with office
  const user = useSelector(selectUser);
  const [allUsersWithOffice, setAllUsersWithOffice] = useState([]);
  const handleAllUsersWithOffice = async () => {
    try {
      if (user.CompanyCode !== null) {
        const { data } = await getAllUsersWithOffice(
          user.CompanyCode,
          user.Location
        );
        if (data.code === 412) {
          setAllUsersWithOffice([]);
          errorMessage("کد شرکت اشتباه می باشد!");
        } else if (data.length !== undefined && data.length !== 0) {
          setAllUsersWithOffice(data);
        } else {
          setAllUsersWithOffice([]);
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  var allUsersWithOfficeSelect;
  if (allUsersWithOffice.length !== 0) {
    allUsersWithOfficeSelect = allUsersWithOffice.map((user) => {
      return {
        value: user._id,
        label:
          user.FirstName + " " + user.LastName + " (" + user.CompanyName + ")",
      };
    });
  } else {
    allUsersWithOfficeSelect = [];
  }

  // all users
  const [allUsers, setAllUsers] = useState([]);
  const handleAllUsers = async (value) => {
    const { data } = await getAllUsers(value);
    if (data.length !== 0) {
      setAllUsers(data);
    }
  };
  var usersSelect = [];
  if (allUsers.length !== 0) {
    allUsers.map((data) => {
      usersSelect.push({
        value: data._id,
        label: data.first_name + " " + data.last_name,
      });
    });
  }

  const handleDepartmentUsers = async (depName, company, location) => {
    try {
      const { data } = await getDepartmentUsers(depName, company, location);
      return data;
    } catch (ex) {
      console.log(ex);
    }
  };

  const [allProvincesSelect, setAllProvincesSelect] = useState([]);
  const handleAllProvinces = async () => {
    try {
      const provincesRes = await getProvinces();
      if (provincesRes.data) {
        setAllProvincesSelect(provincesRes.data);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const [allCitiesSelect, setAllCitiesSelect] = useState([]);
  const handleAllCities = async (province) => {
    try {
      const citiesRes = await getCities(province);
      if (citiesRes.data) {
        setAllCitiesSelect(citiesRes.data);
      } else {
        setAllCitiesSelect([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  const [allCitiesByType, setAllCitiesByType] = useState([]);
  const handleCitiesByType = async (type) => {
    try {
      const citiesByTypeRes = await getCitiesByType(type);
      if (
        citiesByTypeRes.data.length !== undefined &&
        citiesByTypeRes.data.length !== 0
      ) {
        setAllCitiesByType(citiesByTypeRes.data);
      } else {
        setAllCitiesByType([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleTodayDate = async () => {
    try {
      const { data } = await getTodayDate();
      return data;
    } catch (ex) {
      console.log(ex);
    }
  };

  const [foods, setFoods] = useState([]);
  const handleGetDaysFood = async () => {
    try {
      const { data } = await getDaysFood();
      if (
        data.message === undefined &&
        data.length !== 0 &&
        Array.isArray(data)
      ) {
        setFoods(data);
      } else {
        setFoods([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  //new context
  const [loading, setLoading] = useState(false);
  const [accountMode, setAccountMode] = useState("login");
  const [itemDeletePerModal, setItemDeletePerModal] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState("");

  const [userInfoModal, setUserInfoModal] = useState(false);

  const [proInfo, setProInfo] = useState("");
  const handleGetProInfo = async (storeAsCode) => {
    try {
      const proInfoRes = await getProInfo(storeAsCode, user.CompanyCode);
      if (proInfoRes.data.ItemName !== undefined) {
        setProInfo(proInfoRes.data);
        setProDetailsModal(true);
      } else {
        setProInfo("");
        setProDetailsModal(false);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const [coUsers, setCoUsers] = useState([]);
  const handleCompanyUsers = async (info) => {
    try {
      const coUsersRes = await getCoUsers(
        info,
        user.CompanyCode,
        user.Location
      );
      if (coUsersRes.data.code === 415) {
        setCoUsers(coUsersRes.data.list);
      } else {
        setCoUsers([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleReqVisited = async (reqId, update, type) => {
    try {
      const visitedReqValues = {
        actionCode: 15,
        actionId: reqId,
        userId: localStorage.getItem("id"),
        typeId: type,
      };
      const { data } = await postAction(visitedReqValues);
      if (data) {
        //handleGetWarehouseNSeenCounter();
        // to do
        // var list = [];
        // if(type === 1){
        //     //کار ایرانتول
        // }else if(type === 2){
        //     list = [...allWarehouseReqs];
        //     const reqIndex = list.findIndex(req=>req._id === reqId);
        //     list[reqIndex].seen = true;
        //     setAllWarehouseReqs(list);
        // }else if(type === 3){
        //     // نامه اداری
        // }else if(type === 4){
        //     list = [...officeLeaveReqs];
        //     const reqIndex = list.findIndex(req=>req._id === reqId)
        //     list[reqIndex].seen = true;
        //     setOfficeLeaveReqs(list);
        // }else if(type === 8){
        //     // خرید
        // }else if (type === 9){
        //     // ماموریت
        // }else if(type === 10){
        //     // تسویه
        // }else if(type === 13){
        //     // کار سرامیک
        // }else if(type === 14){
        //     // اضافه کار
        // }
        // to do end
        // این شرط پایین یادم نمیاد واسه چی بوده
        // if (update === true) {
        //     handleAllNewWarehouseRequests();
        // }
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const [reqItemDeliveryModal, setReqItemDeliveryModal] = useState(false);
  const [reqItemDetailsModal, setReqItemDetailsModal] = useState(false);
  const [reqItemReceivedDetailsModal, setReqItemReceivedDetailsModal] =
    useState(false);
  const [proDetailsModal, setProDetailsModal] = useState(false);

  const [currentReqId, setCurrentReqId] = useState("");
  const [currentReqItem, setCurrentReqItem] = useState("");
  const [currentReqType, setCurrentReqType] = useState("");
  const [currentReqDep, setCurrentReqDep] = useState("");
  const [currentReqCo, setCurrentReqCo] = useState("");
  const [currentReqToPerson, setCurrentReqToPerson] = useState("");
  const [currentReqToPersonsSelect, setCurrentReqToPersonsSelect] = useState(
    []
  );
  const [currentReqComments, setCurrentReqComments] = useState([]);
  const handleGetCurrentReqComments = async (commentStatus, reqId, type) => {
    setLoading(true);
    try {
      const commentsRes = await getCurrentReqHistory(
        commentStatus,
        reqId,
        type
      );
      if (commentsRes.data.code === 415) {
        setCurrentReqComments(commentsRes.data.list);
        setLoading(false);
      }
    } catch (ex) {
      console.log(ex);
      setLoading(false);
    }
  };
  const [requestList, setRequestList] = useState([]);
  const handleGetRequestList = async (filterValues, type) => {
    setLoading(true);
    try {
      const reqListRes = await getRequestsList(filterValues);
      if (reqListRes.data.code === 415) {
        setRequestList(reqListRes.data.list);
        setUsersFilterSelect(reqListRes.data.members);
        setLoading(false);
      } else {
        setRequestList([]);
        setUsersFilterSelect([]);
        setLoading(false);
      }
    } catch (ex) {
      setLoading(false);
      console.log(ex);
    }
  };

  const [companyCar, setCompanyCar] = useState(true);
  const [officeMissionToDate, setOfficeMissionToDate] = useState(null);
  const [driver, setDriver] = useState("");
  const handleOfficeLeaveAccept = async (actionType) => {
    const { data } = await checkReqUpdateDate(
      currentReqInfo.requestId,
      currentReqInfo.lastActionId,
      currentReqInfo.typeId
    );
    if (data.type === "accepted") {
      const sendAcceptOfficeAction = async () => {
        if (window.location.pathname === "/AllNewRequests") {
          const filterParams = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            type: "",
            status: "",
            fromDate: "null",
            toDate: "null",
          };
          handleGetAllNewReqsList(filterParams);
        } else if (window.location.pathname === "/LeaveReqsList") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            serial: "",
            memberId: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            year: new Date()
              .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
              .slice(0, 4),
            type: 4,
          };
          handleGetRequestList(filterValues);
        } else if (window.location.pathname === "/MissionReqsList") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            serial: "",
            memberId: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            year: new Date()
              .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
              .slice(0, 4),
            city: "",
            type: 9,
          };
          handleGetRequestList(filterValues);
        }
        successMessage("درخواست موردنظر با موفقیت تایید شد!");
        dispatch(RsetAcceptReqComment(""));
        dispatch(RsetNextAcceptReqModal(false));
        dispatch(RsetAcceptReqModal(false));
      };
      if (currentReqInfo.typeId === 4) {
        var acceptReqValues;
        if (actionType === true) {
          if (
            currentReqInfo.lastActionCode === 0 ||
            currentReqInfo.lastActionCode === 20 ||
            currentReqInfo.lastActionCode === 13
          ) {
            // go to edari
            var toPersons = [];
            var actionCode = 0;
            if (
              currentReqInfo.leaveKindName === "ساعتي" &&
              (currentReqInfo.lastActionCode === 0 ||
                currentReqInfo.lastActionCode === 20)
            ) {
              toPersons = await getToPersonByRole(
                "21",
                user.Location,
                user.CompanyCode,
                1,
                null,
                "0"
              );
              actionCode = 13;
            } else {
              toPersons = await getToPersonByRole(
                "19, 20",
                user.Location,
                user.CompanyCode,
                1,
                null,
                "0"
              );
              actionCode = 21;
            }
            if (toPersons.data.code === 415) {
              var toPersonsArr = [];
              toPersons.data.list.map(async (person) => {
                toPersonsArr.push(person.value);
              });
              acceptReqValues = {
                actionCode: actionCode,
                actionId: currentReqInfo.requestId,
                userId: localStorage.getItem("id"),
                toPersons: String(toPersonsArr),
                comment: acceptReqComment !== "" ? acceptReqComment : null,
                typeId: 4,
              };
              const actionRes = await postAction(acceptReqValues);
              if (actionRes.data.code === 415) {
                sendAcceptOfficeAction();
              }
            } else {
              errorMessage("شخص دریافت کننده ای یافت نشد!");
            }
          } else if (currentReqInfo.lastActionCode === 21) {
            acceptReqValues = {
              actionCode: 1,
              actionId: currentReqInfo.requestId,
              userId: localStorage.getItem("id"),
              comment: acceptReqComment !== "" ? acceptReqComment : null,
              typeId: 4,
            };
            const actionRes = await postAction(acceptReqValues);
            if (actionRes.data.code === 415) {
              sendAcceptOfficeAction();
            }
          }
        } else if (actionType === false) {
          // go to modir
          acceptReqValues = {
            actionCode: 20,
            actionId: currentReqInfo.requestId,
            userId: localStorage.getItem("id"),
            toPersons: user.Supervisor._id,
            comment: acceptReqComment !== "" ? acceptReqComment : null,
            typeId: 4,
          };
          const actionRes = await postAction(acceptReqValues);
          if (actionRes.data.code === 415) {
            sendAcceptOfficeAction();
          }
        }
      } else if (currentReqInfo.typeId === 9) {
        if (actionType === "sendToUpSup") {
          acceptReqValues = {
            actionCode: 20,
            actionId: currentReqInfo.requestId,
            userId: localStorage.getItem("id"),
            toPersons: user.Supervisor._id,
            comment: acceptReqComment !== "" ? acceptReqComment : null,
            typeId: 9,
          };
          const actionRes = await postAction(acceptReqValues);
          if (actionRes.data.code === 415) {
            sendAcceptOfficeAction();
          }
        } else if (actionType === "sendToCoordinator") {
          var toPersons = [];
          if (currentReqInfo.tripType.code === 1) {
            // روشن دل
            toPersons = await getToPersonByRole(
              "44",
              user.Location,
              user.CompanyCode,
              1,
              null,
              "0"
            );
          } else {
            //لیاقت
            toPersons = await getToPersonByRole(
              "45",
              user.Location,
              user.CompanyCode,
              1,
              null,
              "0"
            );
          }
          if (toPersons.data.code === 415) {
            var toPersonsArr = [];
            toPersons.data.list.map(async (person) => {
              toPersonsArr.push(person.value);
            });
            acceptReqValues = {
              actionCode: 33,
              actionId: currentReqInfo.requestId,
              userId: localStorage.getItem("id"),
              toPersons: toPersonsArr,
              comment: acceptReqComment !== "" ? acceptReqComment : null,
              typeId: 9,
            };
            const actionRes = await postAction(acceptReqValues);
            if (actionRes.data.code === 415) {
              sendAcceptOfficeAction();
            }
          } else {
            errorMessage("شخص دریافت کننده ای یافت نشد!");
          }
        } else if (actionType === "acceptByCarCoordinator") {
          const sendAction = async () => {
            if (currentReqToPerson !== "" && currentReqToPerson.length !== 0) {
              var toPersons = [];
              currentReqToPerson.map((person) => {
                toPersons.push(person.value);
              });
              const actionValues = {
                actionCode: 36,
                actionId: currentReqInfo.requestId,
                userId: localStorage.getItem("id"),
                toPersons: toPersons,
                typeId: 9,
                comment: acceptReqComment !== "" ? acceptReqComment : null,
              };
              const postActionRes = await postAction(actionValues);
              if (postActionRes.data.code === 415) {
                successMessage("درخواست با موفقیت تایید شد!");
                dispatch(RsetAcceptReqComment(""));
                setCompanyCar(true);
                setDriver("");
                //setDriverInfo('');
                setOfficeMissionToDate(null);
                setCurrentReqToPerson("");
                dispatch(RsetAcceptReqModal(false));
                if (window.location.pathname === "/AllNewRequests") {
                  const filterParams = {
                    applicantId: localStorage.getItem("id"),
                    memberId: "",
                    type: "",
                    status: "",
                    fromDate: "null",
                    toDate: "null",
                  };
                  handleGetAllNewReqsList(filterParams);
                } else if (window.location.pathname === "/MissionReqsList") {
                  const filterValues = {
                    applicantId: localStorage.getItem("id"),
                    serial: "",
                    memberId: "",
                    status: "",
                    fromDate: "null",
                    toDate: "null",
                    year: new Date()
                      .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
                      .slice(0, 4),
                    city: "",
                    type: 9,
                  };
                  handleGetRequestList(filterValues);
                }
              }
            } else {
              errorMessage("شخص دریافت کننده درخواست وارد نشده!");
            }
          };
          var tripOptions = {};
          if (companyCar === true) {
            if (driver !== "") {
              tripOptions = {
                driver: driver.value,
                startDate:
                  officeMissionToDate !== null
                    ? officeMissionToDate.format("YYYY/MM/DD")
                    : null,
              };
              const addTripOptionsRes = await addTripOptions(
                currentReqInfo.requestId,
                tripOptions
              );
              if (addTripOptionsRes.data.code === 415) {
                sendAction();
              } else {
                errorMessage("خطا در ثبت اطلاعات!");
              }
            } else {
              errorMessage("راننده مورد نظر را انتخاب کنید!");
            }
          } else {
            sendAction();
          }
        }
      }
    } else {
      errorMessage("این درخواست توسط شخص دیگری تایید شده!");
      dispatch(RsetAcceptReqComment(""));
      dispatch(RsetNextAcceptReqModal(false));
      dispatch(RsetAcceptReqModal(false));
      if (window.location.pathname === "/AllNewRequests") {
        const filterParams = {
          applicantId: localStorage.getItem("id"),
          memberId: "",
          type: "",
          status: "",
          fromDate: "null",
          toDate: "null",
        };
        handleGetAllNewReqsList(filterParams);
      } else if (window.location.pathname === "/LeaveReqsList") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          year: new Date()
            .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
            .slice(0, 4),
          type: 4,
        };
        handleGetRequestList(filterValues);
      } else if (window.location.pathname === "/MissionReqsList") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          year: new Date()
            .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
            .slice(0, 4),
          city: "",
          type: 9,
        };
        handleGetRequestList(filterValues);
      }
    }
  };
  const handleOfficeLeaveCancel = async () => {
    const { data } = await checkReqUpdateDate(
      currentReqInfo.requestId,
      currentReqInfo.lastActionId,
      currentReqInfo.typeId
    );
    if (data.type === "accepted") {
      const cancelReqValues = {
        actionCode: 2,
        actionId: currentReqInfo.requestId,
        userId: localStorage.getItem("id"),
        comment: cancelReqComment !== "" ? cancelReqComment : null,
        typeId: currentReqInfo.typeId,
      };
      const actionRes = await postAction(cancelReqValues);
      if (actionRes.data.code === 415) {
        if (window.location.pathname === "/AllNewRequests") {
          const filterParams = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            type: "",
            status: "",
            fromDate: "null",
            toDate: "null",
          };
          handleGetAllNewReqsList(filterParams);
        } else if (window.location.pathname === "/LeaveReqsList") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            serial: "",
            memberId: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            year: new Date()
              .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
              .slice(0, 4),
            type: 4,
          };
          handleGetRequestList(filterValues);
        } else if (window.location.pathname === "/MissionReqsList") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            serial: "",
            memberId: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            year: new Date()
              .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
              .slice(0, 4),
            city: "",
            type: 9,
          };
          handleGetRequestList(filterValues);
        }
        successMessage("درخواست موردنظر با موفقیت کنسل شد!");
        dispatch(RsetCancelReqComment(""));
        dispatch(RsetCancelReqModal(false));
      }
    } else {
      errorMessage("این درخواست توسط شخص دیگری تایید شده!");
      dispatch(RsetCancelReqComment(""));
      dispatch(RsetCancelReqModal(false));
      if (window.location.pathname === "/AllNewRequests") {
        const filterParams = {
          applicantId: localStorage.getItem("id"),
          memberId: "",
          type: "",
          status: "",
          fromDate: "null",
          toDate: "null",
        };
        handleGetAllNewReqsList(filterParams);
      } else if (window.location.pathname === "/LeaveReqsList") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          year: new Date()
            .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
            .slice(0, 4),
          type: 4,
        };
        handleGetRequestList(filterValues);
      } else if (window.location.pathname === "/MissionReqsList") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: "",
          memberId: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          year: new Date()
            .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
            .slice(0, 4),
          city: "",
          type: 9,
        };
        handleGetRequestList(filterValues);
      }
    }
  };

  // new reqs number
  const [jobNSeenCounter, setJobNSeenCounter] = useState(0);
  const handleGetJobNSeenCounter = async () => {
    try {
      const { data } = await getNotSeenReqs(1);
      setJobNSeenCounter(xssFilters.inHTMLData(data));
    } catch (ex) {
      console.log(ex);
    }
  };
  const [warehouseNSeenCounter, setWarehouseNSeenCounter] = useState(0);
  const handleGetWarehouseNSeenCounter = async () => {
    try {
      const { data } = await getNotSeenReqs(2);
      setWarehouseNSeenCounter(xssFilters.inHTMLData(data));
    } catch (ex) {
      console.log(ex);
    }
  };
  const [purchaseNSeenCounter, setPurchaseNSeenCounter] = useState(0);
  const handleGetPurchaseNSeenCounter = async () => {
    try {
      const { data } = await getNotSeenReqs(8);
      setPurchaseNSeenCounter(xssFilters.inHTMLData(data));
    } catch (ex) {
      console.log(ex);
    }
  };
  const handleGetNSeenCounters = () => {
    //handleGetJobNSeenCounter();
    //handleGetWarehouseNSeenCounter();
    //handleGetPurchaseNSeenCounter();
  };
  useEffect(() => {
    handleGetNSeenCounters();
  }, []);
  // new reqs number END

  //context that may change

  const [allNewReqsList, setAllNewReqsList] = useState([]);
  const handleGetAllNewReqsList = async (filterParams) => {
    try {
      const allReqsRes = await getAllNewReqsList(filterParams);
      if (allReqsRes.data.code === 415) {
        setAllNewReqsList(allReqsRes.data.list);
      } else {
        setAllNewReqsList([]);
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  const updateAllNewReqsList = () => {
    const filterParams = {
      applicantId: localStorage.getItem("id"),
      memberId: "",
      type: "",
      status: "",
      fromDate: "null",
      toDate: "null",
    };
    handleGetAllNewReqsList(filterParams);
  };
  const [purchaseReqs, setPurchaseReqs] = useState([]);
  const handlePurchaseList = async (filterParams) => {
    try {
      const { data } = await getPurchaseList(filterParams);
      if (data.code === 403) {
        setPurchaseReqs([]);
        setUsersFilterSelect([]);
        setCoManagerUsersFilterSelect([]);
        setSupportManagerUsersFilterSelect([]);
        setPurchasingOfficerUsersFilterSelect([]);
      } else {
        setPurchaseReqs(data.list);
        setUsersFilterSelect(data.members);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const [reqPriority, setReqPriority] = useState(false);
  const [reqCompletionDeadline, setReqCompletionDeadline] = useState(null);
  const [purchaseItemsByWarehouseReq, setPurchaseItemsByWarehouseReq] =
    useState([]);
  const handleAcceptReq = async (acceptType) => {
    const { data } = await checkReqUpdateDate(
      currentReqInfo.requestId,
      currentReqInfo.lastActionId,
      2
    );
    if (data.type === "accepted") {
      if (acceptType === "lastAccept") {
        const toPersons = await getToPersonByRole(
          "36, 3",
          user.Location,
          user.CompanyCode,
          1,
          null,
          "0"
        );
        if (toPersons.data.code === 415) {
          var toPersonsArr = [];
          toPersons.data.list.map(async (person) => {
            toPersonsArr.push(person.value);
          });
          const acceptActionValues = {
            actionCode: 6,
            actionId: currentReqInfo.requestId,
            userId: localStorage.getItem("id"),
            typeId: 2,
            toPersons: String(toPersonsArr),
            comment: acceptReqComment !== "" ? acceptReqComment : null,
          };
          const actionRes = await postAction(acceptActionValues);
          if (actionRes.data.code === 415) {
            // const accepted = () => {
            dispatch(RsetAcceptReqComment(""));
            dispatch(RsetNextAcceptReqModal(false));
            dispatch(RsetAcceptReqModal(false));
            successMessage("درخواست با موفقیت تایید شد!");
            if (window.location.pathname === "/AllNewRequests") {
              const filterParams = {
                applicantId: localStorage.getItem("id"),
                memberId: "",
                type: "",
                status: "",
                fromDate: "null",
                toDate: "null",
              };
              handleGetAllNewReqsList(filterParams);
            } else if (window.location.pathname === "/WarehouseReqPage") {
              const filterValues = {
                applicantId: localStorage.getItem("id"),
                memberId: "",
                mDep: "",
                status: "",
                fromDate: "null",
                toDate: "null",
                type: 2,
              };
              dispatch(handleReqsList(filterValues));
            }
            // }
            // if (currentReqInfo.priority !== reqPriority || currentReqInfo.deadline !== reqCompletionDeadline) {
            //     var editDP = {
            //         deadline: reqCompletionDeadline,
            //         priority: reqPriority
            //     }
            //     const dpEditRes = await updateDeadLinePriority(currentReqInfo.requestId, editDP);
            //     if (dpEditRes.data.code === 415) {
            //         setReqPriority(false);
            //         setReqCompletionDeadline(null);
            //         accepted();
            //     } else {
            //         errorMessage('خطا در آپدیت تغییرات درخواست!')
            //     }
            // } else {
            //     accepted();
            // }
          }
        } else {
          errorMessage("شخص دریافت کننده ای یافت نشد!");
        }
      } else if (acceptType === "warehouseAccept") {
        const rattletrapTypeNull = currentReqItems.filter(
          (item) => item.invCode === null
        );
        if (rattletrapTypeNull.length === 0) {
          const toPersons = await getToPersonByRole(
            "36, 3",
            user.Location,
            user.CompanyCode,
            1,
            null,
            "0"
          );
          if (toPersons.data.code === 415) {
            var toPersonsArr = [];
            toPersons.data.list.map(async (person) => {
              toPersonsArr.push(person.value);
            });
            const acceptActionValues = {
              actionCode: 29,
              actionId: currentReqInfo.requestId,
              userId: localStorage.getItem("id"),
              typeId: 2,
              toPersons: String(toPersonsArr),
              comment: acceptReqComment !== "" ? acceptReqComment : null,
            };
            const actionRes = await postAction(acceptActionValues);
            if (actionRes.data.code === 415) {
              var updatedItems = 0;
              currentReqItems.map(async (item) => {
                const itemValues = {
                  invCode: item.invCode !== null ? item.invCode : undefined,
                  rattletrap:
                    item.rattletrap !== null ? item.rattletrap.value : 0,
                  consumable:
                    item.consumable !== null ? item.consumable.value : 0,
                  borrowed: item.borrowed !== null ? item.borrowed.value : 1,
                  invKeeperComment:
                    item.invKeeperComment !== null
                      ? item.invKeeperComment
                      : undefined,
                  action: 3,
                  userId: localStorage.getItem("id"),
                };
                const patchItemValuesRes = await editWarehouseItem(
                  item.itemId,
                  itemValues
                );
                if (patchItemValuesRes.data.code === 415) {
                  updatedItems = updatedItems + 1;
                  if (updatedItems === currentReqItems.length) {
                    successMessage("درخواست با موفقیت تایید شد!");
                    dispatch(RsetAcceptReqComment(""));
                    dispatch(RsetAcceptReqModal(false));
                    dispatch(RsetNextAcceptReqModal(false));
                    if (window.location.pathname === "/AllNewRequests") {
                      const filterParams = {
                        applicantId: localStorage.getItem("id"),
                        memberId: "",
                        type: "",
                        status: "",
                        fromDate: "null",
                        toDate: "null",
                      };
                      handleGetAllNewReqsList(filterParams);
                    } else if (
                      window.location.pathname === "/WarehouseReqPage"
                    ) {
                      const filterValues = {
                        applicantId: localStorage.getItem("id"),
                        memberId: "",
                        mDep: "",
                        status: "",
                        fromDate: "null",
                        toDate: "null",
                        type: 2,
                      };
                      dispatch(handleReqsList(filterValues));
                    }
                  }
                } else {
                  errorMessage("خطا در ذخیره اطلاعات!");
                  dispatch(RsetNextAcceptReqModal(false));
                }
              });
            } else {
              errorMessage("خطا در ذخیره اطلاعات!");
              dispatch(RsetNextAcceptReqModal(false));
            }
          } else {
            errorMessage("شخص دریافت کننده ای یافت نشد!");
          }
        } else {
          errorMessage("اطلاعات تکمیلی را وارد کنید!");
          if (nextAcceptReqModal === true) {
            dispatch(RsetNextAcceptReqModal(false));
            dispatch(RsetAcceptReqModal(true));
          }
        }
      } else if (acceptType === "warehouseToPersonAccept") {
        const rattletrapTypeNull = currentReqItems.filter(
          (item) => item.invCode === null
        );
        if (rattletrapTypeNull.length === 0) {
          const acceptActionValues = {
            actionCode: 31,
            actionId: currentReqInfo.requestId,
            userId: localStorage.getItem("id"),
            typeId: 2,
            toPersons: currentReqToPerson.value,
            comment: acceptReqComment !== "" ? acceptReqComment : null,
          };
          const actionRes = await postAction(acceptActionValues);
          if (actionRes.data.code === 415) {
            var updatedItems = 0;
            currentReqItems.map(async (item) => {
              const itemValues = {
                invCode: item.invCode !== null ? item.invCode : undefined,
                rattletrap:
                  item.rattletrap !== null ? item.rattletrap.value : 0,
                consumable:
                  item.consumable !== null ? item.consumable.value : 0,
                borrowed: item.borrowed !== null ? item.borrowed.value : 1,
                invKeeperComment:
                  item.invKeeperComment !== null
                    ? item.invKeeperComment
                    : undefined,
                action: 3,
                userId: localStorage.getItem("id"),
              };
              const patchItemValuesRes = await editWarehouseItem(
                item.itemId,
                itemValues
              );
              if (patchItemValuesRes.data.code === 415) {
                updatedItems = updatedItems + 1;
                if (updatedItems === currentReqItems.length) {
                  successMessage("درخواست با موفقیت تایید شد!");
                  dispatch(RsetAcceptReqComment(""));
                  dispatch(RsetAcceptReqModal(false));
                  dispatch(RsetNextAcceptReqModal(false));
                  if (window.location.pathname === "/AllNewRequests") {
                    const filterParams = {
                      applicantId: localStorage.getItem("id"),
                      memberId: "",
                      type: "",
                      status: "",
                      fromDate: "null",
                      toDate: "null",
                    };
                    handleGetAllNewReqsList(filterParams);
                  } else if (window.location.pathname === "/WarehouseReqPage") {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      memberId: "",
                      mDep: "",
                      status: "",
                      fromDate: "null",
                      toDate: "null",
                      type: 2,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }
              }
            });
          }
        } else {
          errorMessage("اطلاعات تکمیلی را وارد کنید!");
          if (nextAcceptReqModal === true) {
            dispatch(RsetNextAcceptReqModal(false));
            dispatch(RsetAcceptReqModal(true));
          }
        }
      } else if (acceptType === "managerAccept") {
        const toPersons = await getToPersonByRole(
          "36, 3",
          user.Location,
          user.CompanyCode,
          1,
          null,
          "0"
        );
        if (toPersons.data.code === 415) {
          var toPersonsArr = [];
          toPersons.data.list.map(async (person) => {
            toPersonsArr.push(person.value);
          });
          const acceptActionValues = {
            actionCode: 29,
            actionId: currentReqInfo.requestId,
            userId: localStorage.getItem("id"),
            typeId: 2,
            toPersons: String(toPersonsArr),
            comment: acceptReqComment !== "" ? acceptReqComment : null,
          };
          const actionRes = await postAction(acceptActionValues);
          if (actionRes.data.code === 415) {
            var updatedItems = 0;
            currentReqItems.map(async (item) => {
              const itemValues = {
                managerComment: item.managerComment,
                action: 3,
                userId: localStorage.getItem("id"),
              };
              const patchItemValuesRes = await editWarehouseItem(
                item.itemId,
                itemValues
              );
              if (patchItemValuesRes.data.code === 415) {
                updatedItems = updatedItems + 1;
                if (updatedItems === currentReqItems.length) {
                  successMessage("درخواست با موفقیت تایید شد!");
                  dispatch(RsetAcceptReqComment(""));
                  dispatch(RsetAcceptReqModal(false));
                  if (window.location.pathname === "/AllNewRequests") {
                    const filterParams = {
                      applicantId: localStorage.getItem("id"),
                      memberId: "",
                      type: "",
                      status: "",
                      fromDate: "null",
                      toDate: "null",
                    };
                    handleGetAllNewReqsList(filterParams);
                  } else if (window.location.pathname === "/WarehouseReqPage") {
                    const filterValues = {
                      applicantId: localStorage.getItem("id"),
                      memberId: "",
                      mDep: "",
                      status: "",
                      fromDate: "null",
                      toDate: "null",
                      type: 2,
                    };
                    dispatch(handleReqsList(filterValues));
                  }
                }
              }
            });
          }
        }
      } else if (acceptType === "warehouseLastAccept") {
        const acceptActionValues = {
          actionCode: 1,
          actionId: currentReqInfo.requestId,
          userId: localStorage.getItem("id"),
          typeId: 2,
          comment: acceptReqComment !== "" ? acceptReqComment : null,
        };
        const ActionRes = await postAction(acceptActionValues);
        if (ActionRes.data.code === 415) {
          dispatch(RsetAcceptReqComment(""));
          dispatch(RsetAcceptReqModal(false));
          successMessage("درخواست با موفقیت مختومه شد!");
          if (window.location.pathname === "/AllNewRequests") {
            const filterParams = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              type: "",
              status: "",
              fromDate: "null",
              toDate: "null",
            };
            handleGetAllNewReqsList(filterParams);
          } else if (window.location.pathname === "/WarehouseReqPage") {
            const filterValues = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              mDep: "",
              status: "",
              fromDate: "null",
              toDate: "null",
              type: 2,
            };
            dispatch(handleReqsList(filterValues));
          }
        }
      } else if (acceptType === "toPersonAccept") {
        var actionCode = "";
        if (currentReqInfo.lastActionCode === 0) {
          actionCode = 22;
        } else if (currentReqInfo.lastActionCode === 22) {
          actionCode = 23;
        } else if (currentReqInfo.lastActionCode === 23) {
          actionCode = 24;
        }
        const acceptActionValues = {
          actionCode: actionCode,
          actionId: currentReqInfo.requestId,
          userId: localStorage.getItem("id"),
          typeId: 2,
          toPersons: currentReqToPerson.value,
          comment: acceptReqComment !== "" ? acceptReqComment : null,
        };
        const actionRes = await postAction(acceptActionValues);
        if (actionRes.data.code === 415) {
          // const accepted = () => {
          dispatch(RsetAcceptReqComment(""));
          dispatch(RsetNextAcceptReqModal(false));
          dispatch(RsetAcceptReqModal(false));
          successMessage("درخواست با موفقیت تایید شد!");
          if (window.location.pathname === "/AllNewRequests") {
            const filterParams = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              type: "",
              status: "",
              fromDate: "null",
              toDate: "null",
            };
            handleGetAllNewReqsList(filterParams);
          } else if (window.location.pathname === "/WarehouseReqPage") {
            const filterValues = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              mDep: "",
              status: "",
              fromDate: "null",
              toDate: "null",
              type: 2,
            };
            dispatch(handleReqsList(filterValues));
          }
          // }
          // if (currentReqInfo.priority !== reqPriority || currentReqInfo.deadline !== reqCompletionDeadline) {
          //     var editDP = {
          //         deadline: reqCompletionDeadline,
          //         priority: reqPriority
          //     }
          //     const dpEditRes = await updateDeadLinePriority(currentReqInfo.reqInfo._id, editDP);
          //     if (dpEditRes.data.code === 415) {
          //         setReqPriority(false);
          //         setReqCompletionDeadline(null);
          //         accepted();
          //     } else {
          //         errorMessage('خطا در آپدیت تغییرات درخواست!')
          //     }
          // } else {
          //     accepted();
          // }
        }
      }
    } else {
      dispatch(RsetAcceptReqComment(""));
      setReqPriority(false);
      setReqCompletionDeadline(null);
      dispatch(RsetNextAcceptReqModal(false));
      dispatch(RsetAcceptReqModal(false));
      errorMessage("این درخواست توسط شخص دیگری تایید شده!");
      if (window.location.pathname === "/AllNewRequests") {
        const filterParams = {
          applicantId: localStorage.getItem("id"),
          memberId: "",
          type: "",
          status: "",
          fromDate: "null",
          toDate: "null",
        };
        handleGetAllNewReqsList(filterParams);
      } else if (window.location.pathname === "/WarehouseReqPage") {
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          memberId: "",
          mDep: "",
          status: "",
          fromDate: "null",
          toDate: "null",
          type: 2,
        };
        dispatch(handleReqsList(filterValues));
      }
    }
  };

  const handleAcceptPurchaseReq = async () => {
    if (currentReqInfo.lastActionCode === 0) {
      const toPersons = await getToPersonByRole(
        "38",
        1,
        user.CompanyCode,
        1,
        null,
        1
      );
      if (toPersons.data.code === 415) {
        var toPersonsArr = [];
        toPersons.data.list.map(async (person) => {
          toPersonsArr.push(person.value);
        });
      }
      if (currentReqToPerson !== "") {
        const purchaseProActionValues = {
          actionCode: 28,
          actionId: currentReqId,
          userId: localStorage.getItem("id"),
          typeId: 8,
          toPersons: currentReqToPerson.value,
          comment: acceptReqComment !== "" ? acceptReqComment : null,
        };
        const actionRes = await postAction(purchaseProActionValues);
        if (actionRes.data.code === 415) {
          dispatch(RsetAcceptReqModal(false));
          dispatch(RsetAcceptReqComment(""));
          setCurrentReqToPerson("");
          if (window.location.pathname === "/AllNewRequests") {
            const filterParams = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              type: "",
              status: "",
              fromDate: "null",
              toDate: "null",
            };
            handleGetAllNewReqsList(filterParams);
          } else if (window.location.pathname === "/PurchaseReqsList") {
            const filterParams = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              managerId: "",
              supplierId: "",
              buyerId: "",
              serial: "",
              status: "",
              fromDate: "null",
              toDate: "null",
            };
            handlePurchaseList(filterParams);
          }
        }
      } else {
        errorMessage("شخص دریافت کننده مشخص نشده است!");
      }
    }
  };
  const handleCancelReq = async (cancelType) => {
    const canceled = async () => {
      const cancelActionValues = {
        actionCode: 2,
        actionId: currentReqInfo.requestId,
        userId: localStorage.getItem("id"),
        typeId: actionType,
        comment: cancelReqComment !== "" ? cancelReqComment : null,
      };
      const actionRes = await postAction(cancelActionValues);
      if (actionRes.data.code === 415) {
        dispatch(RsetCancelReqModal(false));
        dispatch(RsetCancelReqComment(""));
        successMessage("درخواست با موفقیت رد شد!");
        if (window.location.pathname === "/AllNewRequests") {
          const filterParams = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            type: "",
            status: "",
            fromDate: "null",
            toDate: "null",
          };
          handleGetAllNewReqsList(filterParams);
        } else if (window.location.pathname === "/WarehouseReqPage") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            mDep: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            type: 2,
          };
          dispatch(handleReqsList(filterValues));
        } else if (window.location.pathname === "/PurchaseReqsList") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            serial: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            type: 9,
          };
          dispatch(handleReqsList(filterValues));
        }
      }
    };
    var actionType = "";
    if (cancelType === "warehouse") {
      actionType = 2;
      const { data } = await checkReqUpdateDate(
        currentReqInfo.requestId,
        currentReqInfo.lastActionId,
        2
      );
      if (data.type === "accepted") {
        canceled();
      } else {
        dispatch(RsetCancelReqModal(false));
        dispatch(RsetCancelReqComment(""));
        if (window.location.pathname === "/AllNewRequests") {
          const filterParams = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            type: "",
            status: "",
            fromDate: "null",
            toDate: "null",
          };
          handleGetAllNewReqsList(filterParams);
        } else if (window.location.pathname === "/WarehouseReqPage") {
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            memberId: "",
            mDep: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            type: 2,
          };
          dispatch(handleReqsList(filterValues));
        }
      }
    } else if (cancelType === "purchase") {
      actionType = 9;
      canceled();
    }
  };

  //////// filterrrrrr ///////////
  const [allStatuses, setAllStatuses] = useState([]);
  const handleAllStatuses = async (type) => {
    const { data } = await getAllStatuses(type);
    if (data.code === 415) {
      setAllStatuses(data.list);
    } else {
      setAllStatuses([]);
    }
  };
  const [serialFilter, setSerialFilter] = useState("");
  const serialFilterRef = useRef();
  const [typeFilterSelect, setTypeFilterSelect] = useState("");
  const [userIdFilterSelect, setUserIdFilterSelect] = useState("");
  const [companyManagerIdFilterSelect, setCompanyManagerIdFilterSelect] =
    useState("");
  const [supportManagerIdFilterSelect, setSupportManagerIdFilterSelect] =
    useState("");
  const [purchasingOfficerIdFilterSelect, setPurchasingOfficerIdFilterSelect] =
    useState("");
  const [departmentIdFilterSelect, setDepartmentIdFilterSelect] = useState("");
  const [statusIdFilterSelect, setStatusIdFilterSelect] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState(null);
  const [toDateFilter, setToDateFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [realFilter, setRealFilter] = useState(false);
  const [usersFilterSelect, setUsersFilterSelect] = useState([]);
  const [coManagerUsersFilterSelect, setCoManagerUsersFilterSelect] = useState(
    []
  );
  const [supportManagerUsersFilterSelect, setSupportManagerUsersFilterSelect] =
    useState([]);
  const [
    purchasingOfficerUsersFilterSelect,
    setPurchasingOfficerUsersFilterSelect,
  ] = useState([]);
  const [companyFilterSelect, setCompanyFilterSelect] = useState("");
  const [projectTypeFilterSelect, setProjectTypeFilterSelect] = useState("");
  const [toolTypeFilterSelect, setToolFilterSelect] = useState("");
  const handleCancelFilter = (filter) => {
    setRealFilter(false);
    setSerialFilter("");
    setUserIdFilterSelect("");
    setStatusIdFilterSelect("");
    setFromDateFilter(null);
    setToDateFilter(null);
    if (filter === "warehouse") {
      setDepartmentIdFilterSelect("");
      const filterValues = {
        applicantId: localStorage.getItem("id"),
        memberId: "",
        mDep: "",
        status: "",
        fromDate: "null",
        toDate: "null",
        type: 2,
      };
      dispatch(handleReqsList(filterValues));
    } else if (filter === "purchase") {
      setCompanyManagerIdFilterSelect("");
      setSupportManagerIdFilterSelect("");
      setPurchasingOfficerIdFilterSelect("");
      const filterParams = {
        applicantId: localStorage.getItem("id"),
        memberId: "",
        managerId: "",
        supplierId: "",
        buyerId: "",
        serial: "",
        status: "",
        fromDate: "null",
        toDate: "null",
      };
      handlePurchaseList(filterParams);
    } else if (filter === "mission") {
      setYearFilter("");
      setCityFilter("");
      const filterValues = {
        applicantId: localStorage.getItem("id"),
        serial: "",
        memberId: "",
        status: "",
        fromDate: "null",
        toDate: "null",
        year: new Date()
          .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
          .slice(0, 4),
        city: "",
        type: 9,
      };
      handleGetRequestList(filterValues);
    } else if (filter === "leave") {
      setYearFilter("");
      const filterValues = {
        applicantId: localStorage.getItem("id"),
        serial: "",
        memberId: "",
        status: "",
        fromDate: "null",
        toDate: "null",
        year: new Date()
          .toLocaleDateString("fa-IR", { numberingSystem: "latn" })
          .slice(0, 4),
        type: 4,
      };
      handleGetRequestList(filterValues);
    } else if (filter === "ITJReq") {
      setCompanyFilterSelect("");
      setProjectTypeFilterSelect("");
      setToolFilterSelect("");
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
    } else if (filter === "allNewReqs") {
      setTypeFilterSelect("");
      const filterParams = {
        applicantId: localStorage.getItem("id"),
        memberId: "",
        type: "",
        status: "",
        fromDate: "null",
        toDate: "null",
      };
      handleGetAllNewReqsList(filterParams);
    }
  };
  //////// filterrrrrr END ///////////

  return (
    <rootContext.Provider
      value={{
        generateRanHex,
        handleCheckPermission,
        menuPermission,
        handleGetCompanies,
        handleLastNewReqs,
        lastNewReqs,
        handleUpdateSupStatus,
        companies,
        campaniesWithAll,
        handleGetCoDepartments,
        coDepartments,
        coDepartmentsWithAll,
        handleAllUsersWithOffice,
        allUsersWithOfficeSelect,
        handleAllUsers,
        usersSelect,
        handleDepartmentUsers,
        handleAllProvinces,
        allProvincesSelect,
        handleAllCities,
        allCitiesSelect,
        handleCitiesByType,
        allCitiesByType,
        handleTodayDate,
        handleGetDaysFood,
        foods,

        handleCompanyUsers,
        coUsers,

        loading,
        setLoading,
        accountMode,
        setAccountMode,
        itemDeletePerModal,
        setItemDeletePerModal,
        deletedItemId,
        setDeletedItemId,
        userInfoModal,
        setUserInfoModal,
        handleGetProInfo,
        proInfo,

        currentReqId,
        currentReqInfo,
        currentReqItems,
        currentReqItem,
        setCurrentReqItem,
        currentReqType,
        currentReqDep,
        currentReqCo,
        reqItemDeliveryModal,
        setReqItemDeliveryModal,
        reqItemDetailsModal,
        setReqItemDetailsModal,
        reqItemReceivedDetailsModal,
        setReqItemReceivedDetailsModal,
        proDetailsModal,
        setProDetailsModal,
        handleGetCurrentReqComments,
        currentReqComments,
        handleGetRequestList,
        companyCar,
        setCompanyCar,
        officeMissionToDate,
        setOfficeMissionToDate,
        driver,
        setDriver,
        handleOfficeLeaveAccept,
        handleOfficeLeaveCancel,
        requestList,
        currentReqToPerson,
        setCurrentReqToPerson,
        currentReqToPersonsSelect,
        handleAcceptPurchaseReq,
        reqPriority,
        setReqPriority,
        reqCompletionDeadline,
        setReqCompletionDeadline,
        handleAcceptReq,
        purchaseItemsByWarehouseReq,
        setPurchaseItemsByWarehouseReq,
        handleCancelReq,
        handleGetAllNewReqsList,
        updateAllNewReqsList,
        handlePurchaseList,
        allNewReqsList,
        purchaseReqs,

        usersFilterSelect,
        setUsersFilterSelect,
        coManagerUsersFilterSelect,
        supportManagerUsersFilterSelect,
        purchasingOfficerUsersFilterSelect,
        companyFilterSelect,
        setCompanyFilterSelect,
        projectTypeFilterSelect,
        setProjectTypeFilterSelect,
        toolTypeFilterSelect,
        setToolFilterSelect,
        handleAllStatuses,
        allStatuses,
        serialFilter,
        setSerialFilter,
        serialFilterRef,
        typeFilterSelect,
        setTypeFilterSelect,
        userIdFilterSelect,
        setUserIdFilterSelect,
        companyManagerIdFilterSelect,
        setCompanyManagerIdFilterSelect,
        supportManagerIdFilterSelect,
        setSupportManagerIdFilterSelect,
        purchasingOfficerIdFilterSelect,
        setPurchasingOfficerIdFilterSelect,
        departmentIdFilterSelect,
        setDepartmentIdFilterSelect,
        statusIdFilterSelect,
        setStatusIdFilterSelect,
        fromDateFilter,
        setFromDateFilter,
        toDateFilter,
        setToDateFilter,
        yearFilter,
        setYearFilter,
        cityFilter,
        setCityFilter,
        realFilter,
        setRealFilter,
        handleCancelFilter,

        handleGetNSeenCounters,
        jobNSeenCounter,
        handleGetWarehouseNSeenCounter,
        warehouseNSeenCounter,
        purchaseNSeenCounter,

        handleReqVisited,
      }}
    >
      {children}
      {userInfoModal ? <UserInfoM /> : null}
    </rootContext.Provider>
  );
};

export default MainContext;
