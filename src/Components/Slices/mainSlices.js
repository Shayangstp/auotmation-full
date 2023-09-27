import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getLastNewReqs, getMyReqsList, getRequestsList, getUnits, companiesList, getToPersonByRole, changeUserRole,
  getUserInfo, getUserImage, getAllItems, getAllStatuses, getMenu
} from "../../Services/rootServices";
import { login, userData } from "../../Services/accountService";
import {
  getAllDepartment, permisionChanged,
  permisionPresent, postAction, checkPassCompleted, actionAddPerson
} from "../../Services/r-ghanavatian/mainApi";
import { checkDate, findToPerson, getCurrentReqHistory, getCurrentReqInfo } from "../../Services/r-ghanavatian/tableListServices";
import { errorMessage, successMessage, warningMessage } from "../../utils/message";
import { handleResetOvertimeForm } from "./OverTimeSlice";

import { RsetAcceptReqModal, RsetCancelReqModal, RsetEditReqModal, RsetViewReqModal, RsetDeleteReqModal, RsetReqHistoryModal, RsetViewReqComment, RsetAcceptReqComment, RsetCancelReqComment } from "./modalsSlice";
import { RsetCurrentReqInfo, RsetCurrentReqId, RsetCurrentReqType, RsetCurrentReqCo, RsetCurrentReqDep, handleCurrentReqComments, RsetCurrentReqItems, handleCurrentReqItems } from "./currentReqSlice";
import { RsetDepOptions , RsetStatusOptions } from '../Slices/filterSlices';

import { handleSoftwareReqItem, handlesoftwareReqProcess } from '../Slices/softwareSlice';
import { handleIrtUsersByRole, handleOperatorList } from '../Slices/irantoolSlices';

import { handleGetWarehouseReqItems } from "../Slices/warehouseSlice";
import { RsetCheckoutReqPersonNameOption } from "../Slices/checkoutReqSlices"

const initialState = {
  unit: '',
  unitsOption: [],
  typesOption: [],

  activeTab: '',

  userName: '',
  password: '',
  loading: false,
  menu: [],
  loggedIn: false,
  lastNewReqs: '',
  userInfoChanged: false,
  userNotFoundModal: false,
  allDepartmentsSelect: [{ value: '', label: 'همه' }],
  userInfoModal: false,
  realFilter: false,
  actionToPersonsModal: false,
  formErrors: {},
  leaveTypeFilterSelect: '',
  leaveTypeeFilterSelect: '',
  leaveAddOrSubFilterSelect: '',

  userInformation: {},
  userImage: "",
  loggedInUserImage: "",
  isLoading: false,
  histories: [],
  user: {},
  descriptionModals: "",
  allDepartment: [],
  reqsList: [],
  requestMembs: [],
  disableField: false,
  companyNames: '',
  companiesOption: [],

  sendOptions: '1',

  usersByRole: '',
  usersByRoleOptions: [],
  roles: [],
  rolesOptions: [{ value: 26, label: 'تاییدکننده QC' }],
  addRole: null
};

export const handleUnits = createAsyncThunk(
  "mainHome/handleUnits",
  async (obj, { dispatch, getState }) => {
    try {
      const unitsRes = await getUnits();
      if (unitsRes.data.code === 415) {
        dispatch(RsetUnitsOption(unitsRes.data.list));
      } else {
        dispatch(RsetUnitsOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleTypes = createAsyncThunk(
  "mainHome/handleTypes",
  async (obj, { dispatch, getState }) => {
    try {
      const typesRes = await getAllStatuses(0);
      if (typesRes.data.code === 415) {
        dispatch(RsetTypesOption(typesRes.data.list))
      } else {
        dispatch(RsetTypesOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleAllStatuses = createAsyncThunk(
  "mainHome/handleAllStatuses",
  async (type, { dispatch, getState }) => {
    try {
      const getAllStatusesRes = await getAllStatuses(type);
      if (getAllStatusesRes.data.code === 415) {
        dispatch(RsetStatusOptions(getAllStatusesRes.data.list));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleCompaniesList = createAsyncThunk(
  "mainHome/handleCompaniesList",
  async (obj, { dispatch, getState }) => {
    try {
      const companiesListRes = await companiesList();
      if (companiesListRes.data.code === 415) {
        dispatch(RsetCompaniesOption(companiesListRes.data.companies));
      } else {
        dispatch(RsetCompaniesOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//  Department
export const handleDepartments = createAsyncThunk(
  "mainHome/handleDepartments",
  async (obj, { dispatch, getState }) => {
    const { user, allDepartmentsSelect } = await getState().mainHome;
    try {
      const allDep = await getAllDepartment(user.CompanyCode, user.Location);
      if (allDep.data.code === 415) {
        dispatch(RsetDepOptions([...allDepartmentsSelect, ...allDep.data.deps]))
        return allDep.data;
      } else {
        dispatch(RsetDepOptions([]));
        return [];
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);


export const handleMenu = createAsyncThunk(
  "mainHome/handleMenu",
  async (event, { dispatch, getState }) => {
    try {
      const menuRes = await getMenu();
      if(menuRes.data.code === 415){
        dispatch(RsetMenu(menuRes.data.list));
      }else{
        dispatch(RsetMenu([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleLastNewReqs = createAsyncThunk(
  "mainHome/handleLastNewReqs",
  async (event, { dispatch, getState }) => {
    try {
      const { data } = await getLastNewReqs();
      if (data.code === 415) {
        dispatch(RsetLastNewReqs(data));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};
// Login info
export const handleLogin = createAsyncThunk(
  "mainHome/handleLogin",
  async (event, { dispatch, getState }) => {
    const { userName } = getState().mainHome;
    const { password } = getState().mainHome;
    event.preventDefault();
    dispatch(RsetLoading(true));
    try {
      const loginRes = await login({ username: userName.replace(/ /g, ''), password });
      if (loginRes.data.code === 415) {
        const userInfo = parseJwt(loginRes.data.token);
        if (userInfo.Approved === true) {
          const checkUserInfoCompletedRes = await checkPassCompleted(userInfo._id, 'all');
          const loginProcess = async () => {
            localStorage.setItem("token", loginRes.data.token);
            localStorage.setItem("id", userInfo._id);
            dispatch(RsetLoggedIn(true));
            if (userInfo.Roles !== null) {
              userInfo.Roles = userInfo.Roles.split(',');
            }
            dispatch(RsetUser(userInfo));
            dispatch(RsetLoading(false));
            dispatch(handleMenu());
            dispatch(handleLastNewReqs());
            if (userData.changedPer === true) {
              if (getCookie(localStorage.getItem('id')) !== null) {
                setCookie(localStorage.getItem('id'), 'expired', 0);
              }
            }
            successMessage("ورود موفقیت آمیز بود.");
          }
          dispatch(RsetUserInfoChanged(checkUserInfoCompletedRes.data));
          if (checkUserInfoCompletedRes.data === true) {
            loginProcess();
            //handleGetNSeenCounters();
          } else if (checkUserInfoCompletedRes.data === false) {
            loginProcess();
            errorMessage('اطلاعات کاربری خود را تغییر دهید!');
          }
        } else if (userInfo.Approved === false) {
          dispatch(RsetLoading(false));
          errorMessage('حساب کاربری شما تایید نشده است!');
        } else if (loginRes.data.code === 408) {
          dispatch(RsetLoading(false));
          errorMessage('شرکت یا واحد کاربر یافت نشد!');
        } else if (loginRes.data.code === 409) {
          dispatch(RsetLoading(false));
          errorMessage('رمز عبور نادرست است!');
        } else if (loginRes.data.code === 410) {
          dispatch(RsetLoading(false));
          errorMessage('کدملی مورد نظر یافت نشد!');
        } else {
          dispatch(RsetLoading(false));
          errorMessage('خطایی رخ داده است!');
        }
      } else {
        dispatch(RsetLoading(false));
        errorMessage("نام کاربری یا رمزعبور صحیح نمی باشد!");
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
      errorMessage("ورود به حساب کاربری با خطا مواجه شد!");
    }
  }
);

// Patch permission
export const patchPermisionChanged = createAsyncThunk(
  "mainHome/patchPermisionChanged",
  async () => {
    try {
      const permisionChangedRes = await permisionChanged();
      return permisionChangedRes.data;
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleUserData = createAsyncThunk(
  "mainHome/handleUserData",
  async (event, { dispatch, getState }) => {
    try {
      const userDataRes = await userData(localStorage.getItem('id'));
      if (userDataRes.data.code === 415) {
        if (userDataRes.data.user.Roles !== null) {
          userDataRes.data.user.Roles = userDataRes.data.user.Roles.split(',');
        }
        dispatch(RsetUser(userDataRes.data.user));
        dispatch(handleMenu());
        const checkPassCompletedRes = await checkPassCompleted(localStorage.getItem('id'), 'all');
        if (checkPassCompletedRes.data === true) {
          //handleGetNSeenCounters();
        }
        dispatch(RsetUserInfoChanged(checkPassCompletedRes.data));
        dispatch(handleLastNewReqs());
      } else {
        dispatch(RsetUserNotFoundModal(true));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

const setCookie = (name, value, days) => {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Permision present
export const handlePermisionPresent = createAsyncThunk(
  "mainHome/handlePermisionPresent",
  async () => {
    try {
      const perUser = getCookie(localStorage.getItem("personalCode"));

      if (perUser === null || perUser === "expired") {
        const handlePermisionPresentRes = await permisionPresent();
        let permissions = [];
        handlePermisionPresentRes.data.map((item) => {
          permissions.push(item.perId);
        });

        setCookie(localStorage.getItem("personalCode"), permissions, 365);
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// Info user
export const handleUserInformation = createAsyncThunk(
  "mainHome/handleUserInformation",
  async (userId, { dispatch }) => {
    try {
      const userInfoRes = await getUserInfo(userId);
      if (userInfoRes.data.code === 415) {
        dispatch(RsetUserInfoModal(true));
        dispatch(RsetUserInformation(userInfoRes.data.info));
      } else {
        errorMessage('اطلاعات کاربر یافت نشد!');
        dispatch(RsetUserInformation(''));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// Picture user
export const handleUserImage = createAsyncThunk(
  "mainHome/handleUserImage", async ({ userId, status }, { dispatch }) => {
    dispatch(RsetUserImage(''));
    try {
      const userImageRes = await getUserImage(userId, status);
      if (userImageRes.data.code === 415) {
        if (userId !== localStorage.getItem('id')) {
          dispatch(RsetUserImage(userImageRes.data.photo));
        } else {
          dispatch(RsetLoggedInUserImage(userImageRes.data.photo));
          dispatch(RsetUserImage(userImageRes.data.photo));
        }
      } else {
        errorMessage('تصویر کاربر یافت نشد!');
        dispatch(RsetUserImage(''));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleReqVisited = createAsyncThunk(
  "mainHome/handleReqVisited",
  async ({ reqId, reqType }) => {
    try {
      const visitedReqValues = {
        actionCode: 15,
        actionId: reqId,
        userId: localStorage.getItem('id'),
        typeId: reqType
      };
      const sendActionRes = await postAction(visitedReqValues);
      if (sendActionRes.data.code === 415) {
        //handleGetWarehouseNSeenCounter();
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//  Request details
export const handleCurrentReqInfo = createAsyncThunk(
  "mainHome/handleCurrentReqInfo",
  async ({ reqId, reqType, reqSeen, company, dep, oprationType }, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    dispatch(RsetCurrentReqInfo({}));
    dispatch(RsetCurrentReqItems([]));
    try {
      const reqInfoRes = await getCurrentReqInfo(reqId, reqType);
      if (reqInfoRes.data.code === 415) {
        if (reqInfoRes.data.code === 403) {
          dispatch(RsetLoading(false));
          errorMessage('اطلاعات درخواست موردنظر یافت نشد!')
        } else {
          dispatch(RsetCurrentReqInfo(reqInfoRes.data.reqInfo));
          dispatch(RsetCurrentReqType(reqType));
          dispatch(RsetCurrentReqCo(dep));
          dispatch(RsetCurrentReqDep(company));
          dispatch(RsetCurrentReqId(reqId));
          if (reqSeen === false) {
            dispatch(handleReqVisited({ reqId: reqId, reqType: reqType }));
          }
          dispatch(handleLastNewReqs());
          if (reqInfoRes.data.reqInfo.typeId === 9) {
            dispatch(handleCurrentReqItems({ reqId: reqId, reqType: reqType }));
          }
          dispatch(
            handlesoftwareReqProcess({
              reqId: reqInfoRes.data.reqInfo.requestId,
              typeId: reqInfoRes.data.reqInfo.typeId,
            })
          );
          if (
            reqInfoRes.data.reqInfo.sameAccess === null &&
            reqInfoRes.data.reqInfo.typeId === 6
          ) {
            dispatch(handleSoftwareReqItem(reqId));
          }
          if (oprationType === 'accept') {
            dispatch(RsetAcceptReqModal(true));
            dispatch(handleCurrentReqComments({ commentStatus: 'detail', reqId: reqId, reqType: reqType }));
            if (reqType === 2) {
              dispatch(handleGetWarehouseReqItems(reqId));
            }
            // if (reqInfoRes.data.lastActionCode === 0) {
            //   نقش شماره 8 مربوط میشه به تدارکات
            //   const toPersons = await getToPersonByRole('8', user.Location, user.CompanyCode, 1, null, '0');
            //   setCurrentReqToPersonsSelect(toPersons.data.list);
            // }
          } else if (oprationType === 'cancel') {
            dispatch(handleCurrentReqComments({ commentStatus: 'detail', reqId: reqId, reqType: reqType }));
            dispatch(RsetCancelReqModal(true));
            if (reqType === 2) {
              dispatch(handleGetWarehouseReqItems(reqId));
            }
          } else if (oprationType === 'edit') {
            dispatch(RsetEditReqModal(true));
            if (reqType === 2) {
              dispatch(handleGetWarehouseReqItems(reqId));
            }
          } else if (oprationType === 'view') {
            dispatch(handleCurrentReqComments({ commentStatus: 'detail', reqId: reqId, reqType: reqType }));
            dispatch(RsetViewReqModal(true));
            if (reqType === 2) {
              dispatch(handleGetWarehouseReqItems(reqId));
            }
          } else if (oprationType === 'delete') {
            dispatch(RsetDeleteReqModal(true));
          } else if (oprationType === 'history') {
            dispatch(handleCurrentReqComments({ commentStatus: 'history', reqId: reqId, reqType: reqType }));
            dispatch(RsetReqHistoryModal(true));
          } else {

          }
          dispatch(RsetLoading(false));
        }
      } else {
        dispatch(RsetLoading(false));
        errorMessage('خطا در دریافت اطلاعات درخواست!')
      }
    } catch (ex) {
      dispatch(RsetLoading(false));
      console.log(ex);
    }
  }
);

//  --> View post //
export const handlePostComment = createAsyncThunk(
  "mainHome/handlePostComment",
  async (type, { dispatch, getState }) => {
    const { currentReqInfo } = getState().currentReq;
    const { descriptionModals } = getState().mainHome;

    const actionValue = {
      actionId: currentReqInfo.requestId,
      actionCode: 8,
      userId: localStorage.getItem("id"),
      typeId: type,
      comment: descriptionModals,
    };
    const postActionRes = await postAction(actionValue);
    if (postActionRes.data.code === 415) {
      dispatch(RsetDescriptionModals(""));
      successMessage("نظر شما با موفقیت ارسال شد.");
    } else {
      warningMessage("خطا! لطفا دوباره امتحان کنید");
    }
  }
);

//  All history info
export const handleHistories = createAsyncThunk(
  "mainHome/handleHistories",
  async ({ serial, type }) => {
    const historeRes = await getCurrentReqHistory(serial, type);
    return historeRes.data;
  }
);

export const handleAllItems = createAsyncThunk(
  "mainHome/handleAllItems", async ({ typeId, filterValues }, { dispatch }) => {
    dispatch(RsetLoading(true));
    try {
      const allItemsRes = await getAllItems(typeId, filterValues);
      if (allItemsRes.data.code === 415) {
        dispatch(RsetCurrentReqItems(allItemsRes.data.list));
        dispatch(RsetRequestMembs(allItemsRes.data.members));
        dispatch(RsetLoading(false));
      } else {
        errorMessage('تصویر کاربر یافت نشد!');
        dispatch(RsetLoading(false));
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);

// apply post forms
export const handlePostManagerForms = createAsyncThunk(
  "mainHome/handlePostManagerForms",
  async (obj, { dispatch, getState }) => {
    const { user } = getState().mainHome;
    const { currentReqInfo } = getState().currentReq;
    if (user.Supervisor.fullName !== 'نامشخص') {
      const postOverTimeActionRes = await actionAddPerson(currentReqInfo.requestId, 14, user.Supervisor._id);
      if (postOverTimeActionRes.data.code === 415) {
        dispatch(RsetActionToPersonsModal(false));
        successMessage("درخواست شما با موفقیت ارسال شد.")
        if (window.location.pathname === '/OverTimeReqRegistration') {
          dispatch(handleResetOvertimeForm());
        } else if (window.location.pathname === '/OverTimeReqsList') {
          const filterParams = {
            applicantId: localStorage.getItem("id"),
            memberId: '',
            mDep: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            type: 14,
            group: 0
          }
          dispatch(handleReqsList(filterParams));
        }
      } else {
        errorMessage("ارسال به سرپرست ناموفق بود!")
      }
    }
  }
);

export const handleSendViewComment = createAsyncThunk(
  "mainHome/handleSendViewComment",
  async (obj, { dispatch, getState }) => {
    try {
      const { viewReqComment } = getState().modals;
      const { currentReqInfo } = getState().currentReq;
      const actionValues = {
        actionCode: 8,
        actionId: currentReqInfo.requestId,
        userId: localStorage.getItem('id'),
        comment: viewReqComment !== '' ? viewReqComment : null,
        typeId: currentReqInfo.typeId
      }
      const postActionRes = await postAction(actionValues);
      if (postActionRes.data.code === 415) {
        dispatch(RsetViewReqComment(''));
        dispatch(RsetViewReqModal(false));
        successMessage('نظر با موفقیت ثبت شد!');
      } else {
        errorMessage('خطا در ثبت نظر!');
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// --> Accept post
export const handlePostAccept = createAsyncThunk(
  "mainHome/handlePostAccept",
  async (type, { dispatch, getState }) => {
    const { user, descriptionModals } = getState().mainHome;
    const { currentReqInfo } = getState().currentReq;
    const getLastActionId =
      currentReqInfo.process[currentReqInfo.process.length - 1]._id;
    const getReqId = currentReqInfo.reqInfo._id;
    try {
      const postCheckDateRes = await checkDate(getLastActionId, getReqId, type);
      if (postCheckDateRes.data.type === "accepted") {
        const valuesAcceptBtn = {
          role: '49, 50, 51, 52, 53',
          location: user.Location,
          company: user.CompanyCode,
          exist: 1,
          department: null,
          task: '0'
        };
        const postHandlerRes = await findToPerson(valuesAcceptBtn);
        if (postHandlerRes.data.length !== 0) {
          let getId = [];
          postHandlerRes.data.map((item) => {
            return getId.push(item._id);
          });
          const actionValue = {
            actionId: currentReqInfo.reqInfo._id,
            actionCode: 0,
            userId: localStorage.getItem("id"),
            toPersons: getId,
            typeId: type,
            comment: descriptionModals,
          };
          const postActionRes = await postAction(actionValue);
          if (postActionRes.data.type === 415) {
          } else {
            errorMessage("دریافت کننده مورد نظر یافت نشد!");
          }
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//  Cancel post
export const handlePostCancelModal = createAsyncThunk(
  "mainHome/handlePostCancelModal",
  async (type, { dispatch, getState }) => {
    const { user } = getState().mainHome;
    const { currentReqInfo } = getState().currentReq;
    const { descriptionModals } = getState().mainHome;
    const postCheckDateRes = await checkDate(currentReqInfo.process[currentReqInfo.process.length - 1]._id, currentReqInfo.reqInfo._id, type);
    if (postCheckDateRes.data.type === "accepted") {
      const actionValue = {
        actionId: currentReqInfo.reqInfo._id,
        actionCode: 2,
        userId: localStorage.getItem("id"),
        toPerson: user._id,
        typeId: type,
        comment: descriptionModals,
      };
      const postActionRes = await postAction(actionValue);
      if (postActionRes.data.code === 415) {
        dispatch(RsetDescriptionModals(""));
        dispatch(RsetCancelReqModal(false));
        successMessage("درخواست شما با موفقیت کنسل شد.");
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          memberId: '',
          mDep: '',
          status: '',
          fromDate: 'null',
          toDate: 'null',
          type: 14,
          group: 0
        };
        dispatch(handleReqsList(filterValues));
      } else {
        errorMessage('خطا در ابطال درخواست!')
      }
    } else {
      errorMessage('وضعیت درخواست تغییر کرده است!')
    }
  }
);

export const generateRanHex = createAsyncThunk(
  "mainHome/generateRanHex",
  async (size) => {
    let result = [];
    let hexRef = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join("");
  }
);

// Requests List
export const handleReqsList = createAsyncThunk(
  "mainHome/handleReqsList",
  async (filterValues, { dispatch }) => {
    dispatch(RsetLoading(true));
    try {
      const reqsListRes = await getRequestsList(filterValues);
      if (reqsListRes.data.code === 415) {
        dispatch(RsetLoading(false));
        return reqsListRes.data;
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetLoading(false));
        return { list: [], members: [] };
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);

// Requests List
export const handleMyReqsList = createAsyncThunk(
  "mainHome/handleMyReqsList",
  async (filterValues, { dispatch }) => {
    dispatch(RsetLoading(true));
    try {
      const reqsListRes = await getMyReqsList(filterValues);
      if (reqsListRes.data.code === 415) {
        dispatch(RsetLoading(false));
        dispatch(RsetRequestsList(reqsListRes.data.list));
        dispatch(RsetRequestMembs(reqsListRes.data.members));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetLoading(false));
        dispatch(RsetRequestsList([]));
        dispatch(RsetRequestMembs([]));
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);

export const handleCancelReq = createAsyncThunk(
  "mainHome/handleCancelReq",
  async (e, { dispatch, getState }) => {
    e.preventDefault();
    try {
      const { cancelReqComment } = getState().modals;
      const { currentReqInfo } = getState().currentReq;
      const actionValues = {
        actionCode: 2,
        actionId: currentReqInfo.requestId,
        userId: localStorage.getItem("id"),
        typeId: 6,
        comment: cancelReqComment !== '' ? cancelReqComment : null,
      };
      const postActionRes = await postAction(actionValues);
      if (postActionRes.data.code === 415) {
        successMessage("درخواست با موفقیت کنسل شد!");
        dispatch(RsetCancelReqModal(false));
        dispatch(RsetCurrentReqInfo(""));
        dispatch(RsetCancelReqComment(""));
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          serial: '',
          memberId: '',
          status: '',
          fromDate: "null",
          toDate: "null",
          type: 6,
          mDep: '',
          group: 0
        };
        dispatch(handleReqsList(filterValues));
      } else {
        errorMessage("خطا در انجام عملیات!");
        dispatch(RsetCancelReqModal(false));
        dispatch(RsetCurrentReqInfo(""));
        dispatch(RsetCancelReqComment(""));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// export const handleAcceptReq = createAsyncThunk(
//   "mainHome/handleAcceptReq",
//   async (e, { dispatch, getState }) => {
//     e.preventDefault();
//     try {
//       const { currentReqInfo } = getState().currentReq;
//       const { acceptReqComment, sendTo } = getState().modals;
//       const { user } = getState().mainHome;
//       const sendToIsValid = sendTo !== "";
//       const validation = () => {
//         var errors = {};
//         if (!sendToIsValid) {
//           errors.sendTo = "واردکردن کارشناس اجباری است!";
//         }
//         return errors;
//       };
//       var actionCode = "";
//       var toPersons = "";
//       if (currentReqInfo.lastActionCode === 10) {
//         const getToPersonByRoleRes = await getToPersonByRole(
//           //17 role supervisor
//           //18 role manager
//           17,
//           user.Location,
//           user.CompanyCode,
//           1,
//           null,
//           0
//         );
//         const toPersonList = [];
//         if ( getToPersonByRoleRes.data.code === 415 ) {
//           getToPersonByRoleRes.data.list.map((item) => {
//             toPersonList.push(item.value);
//           });
//         }
//         actionCode = 11;
//         toPersons = String(toPersonList);
//       } else if (currentReqInfo.lastActionCode === 11) {
//         actionCode = 12;
//         if (sendTo !== "") {
//           toPersons = sendTo.value;
//         } else {
//           toPersons = "";
//           validation(
//             dispatch(
//               RsetFormErrors(
//                 validation({
//                   sendTo,
//                 })
//               )
//             )
//           );
//         }
//       } else if (currentReqInfo.lastActionCode === 12) {
//         actionCode = 1;
//         toPersons = null;
//       }
//       if (actionCode !== "" && toPersons !== "") {
//         const actionValues = {
//           actionCode: actionCode,
//           actionId: currentReqInfo.requestId,
//           userId: localStorage.getItem("id"),
//           toPersons: toPersons,
//           typeId: 6,
//           comment: acceptReqComment,
//         };
//         const postActionRes = await postAction(actionValues);
//         if (postActionRes.data.code === 415) {
//           successMessage("درخواست با موفقبت تایید شد!");
//           dispatch(RsetAcceptReqModal(false));
//           dispatch(RsetCurrentReqInfo(""));
//           dispatch(RsetAcceptReqComment(""));
//           //type id must change
//           const filterValues = {
//             applicantId: localStorage.getItem("id"),
//             serial: '',
//             memberId: '',
//             status: '',
//             fromDate: "null",
//             toDate: "null",
//             type: 6,
//             mDep: '',
//             group: 0
//           };
//           dispatch(handleReqsList(filterValues));
//         } else {
//           errorMessage("خطا در انجام عملیات!");
//           dispatch(RsetAcceptReqModal(false));
//           dispatch(RsetCurrentReqInfo(""));
//           dispatch(RsetAcceptReqComment(""));
//         }
//       } else {
//         // console.log('');
//       }
//     } catch (ex) {
//       console.log(ex);
//     }
//   }
// );

export const handleUsersByRoles = createAsyncThunk(
  "mainHome/handleUsersByRoles",
  async ({ roles, location, company, exist, dep, task }, { dispatch, getState }) => {
    try {
      const usersByRoleRes = await getToPersonByRole(roles, location, company, exist, dep, task);
      if (usersByRoleRes.data.code === 415) {
        dispatch(RsetUsersByRoleOptions(usersByRoleRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetUsersByRoleOptions([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// delete or add to user roles

export const handleUsersByRole = createAsyncThunk(
  "mainHome/handleUsersByRole",
  async (exist, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;
      const usersByRoleRes = await getToPersonByRole('26', user.Location, user.CompanyCode, exist, null, '0');
      if (usersByRoleRes.data.code === 415) {
        dispatch(RsetUsersByRoleOptions(usersByRoleRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetUsersByRoleOptions([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleChangeUserRole = createAsyncThunk(
  "mainHome/handleChangeUserRole",
  async (changedValues, { dispatch }) => {
    dispatch(RsetLoading(true));
    try {
      const changeUserRoleRes = await changeUserRole(changedValues);
      if (changeUserRoleRes.data.code === 415) {
        dispatch(RsetLoading(false));
        successMessage('نقش کاربر مورد نظر با موفقیت ثبت شد!');
        dispatch(RsetAddRole(null));
        dispatch(RsetUsersByRole(''));
        dispatch(RsetRoles([]));
        if (changedValues.roles === '2') {
          dispatch(handleOperatorList(1));
        } else {
          dispatch(handleIrtUsersByRole(1));
        }
      } else {
        errorMessage("خطا در ثبت نقش کاربر!");
        dispatch(RsetLoading(false));
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);

export const handleInputsEnter = createAsyncThunk(
  "mainHome/handleChangeUserRole",
  () => {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 13 && event.target.nodeName === 'INPUT' && event.target.form.className === 'enter-in-form') {
        var form = event.target.form;
        var index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 1].focus();
        event.preventDefault();
        // document.dispatchEvent(new KeyboardEvent('keypress', {'keyCode': '9'}));
        // event.keyCode = 9;
      }
    });
  }
);

export const handleAllUsers = createAsyncThunk(
  "mainHome/handleAllUsers",
  async (obj, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;

      const getToPersonByRoleRes = await getToPersonByRole(
        undefined,
        user.Location,
        user.CompanyCode,
        1,
        undefined
      );
      console.log(getToPersonByRoleRes);
      if (getToPersonByRoleRes.data.code === 415) {
        dispatch(
          RsetCheckoutReqPersonNameOption(getToPersonByRoleRes.data.list)
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);


const mainSlices = createSlice({
  name: "mainHome",
  initialState,
  reducers: {
    RsetUnit: (state, action) => {
      return { ...state, unit: action.payload };
    },
    RsetUnitsOption: (state, action) => {
      return { ...state, unitsOption: action.payload };
    },
    RsetTypesOption: (state, action) => {
      return { ...state, typesOption: action.payload };
    },

    RsetActiveTab: (state, action) => {
      return { ...state, activeTab: action.payload };
    },

    RsetUserName: (state, action) => {
      return { ...state, userName: action.payload };
    },
    RsetPassword: (state, action) => {
      return { ...state, password: action.payload };
    },
    RsetLoading: (state, action) => {
      return { ...state, loading: action.payload };
    },
    RsetUser: (state, action) => {
      return { ...state, user: action.payload };
    },
    RsetMenu: (state, action) => {
      return { ...state, menu: action.payload };
    },
    RsetLoggedIn: (state, action) => {
      return { ...state, loggedIn: action.payload };
    },
    RsetLastNewReqs: (state, action) => {
      return { ...state, lastNewReqs: action.payload };
    },
    RsetUserInfoChanged: (state, action) => {
      return { ...state, userInfoChanged: action.payload };
    },
    RsetUserNotFoundModal: (state, action) => {
      return { ...state, userNotFoundModal: action.payload };
    },
    RsetAllDepartmentsSelect: (state, action) => {
      return { ...state, allDepartmentsSelect: action.payload };
    },
    RsetUserInfoModal: (state, { payload }) => {
      return { ...state, userInfoModal: payload };
    },
    RsetRealFilter: (state, { payload }) => {
      return { ...state, realFilter: payload };
    },
    RsetActionToPersonsModal: (state, { payload }) => {
      return { ...state, actionToPersonsModal: payload };
    },
    RsetFormErrors: (state, { payload }) => {
      return { ...state, formErrors: payload };
    },
    RsetLeaveTypeFilterSelect: (state, { payload }) => {
      return { ...state, leaveTypeFilterSelect: payload };
    },
    RsetLeaveTypeeFilterSelect: (state, { payload }) => {
      return { ...state, leaveTypeeFilterSelect: payload };
    },
    RsetLeaveAddOrSubFilterSelect: (state, { payload }) => {
      return { ...state, leaveAddOrSubFilterSelect: payload };
    },


    RsetIsLoadingCheckout: (state, action) => {
      return { ...state, isLoading: action.payload };
    },
    RsetDescriptionModals: (state, action) => {
      return { ...state, descriptionModals: action.payload };
    },
    RsetRequestsList: (state, { payload }) => {
      return { ...state, reqsList: payload };
    },
    RsetCompanyNames: (state, { payload }) => {
      return { ...state, companyNames: payload };
    },
    RsetCompaniesOption: (state, { payload }) => {
      return { ...state, companiesOption: payload };
    },
    RsetSendOptions: (state, { payload }) => {
      return { ...state, sendOptions: payload };
    },

    RsetUsersByRole: (state, { payload }) => {
      return { ...state, usersByRole: payload };
    },
    RsetUsersByRoleOptions: (state, { payload }) => {
      return { ...state, usersByRoleOptions: payload };
    },
    RsetRoles: (state, { payload }) => {
      return { ...state, roles: payload };
    },
    RsetRolesOptions: (state, { payload }) => {
      return { ...state, rolesOptions: payload };
    },
    RsetAddRole: (state, { payload }) => {
      return { ...state, addRole: payload };
    },

    RsetUserInformation: (state, { payload }) => {
      return { ...state, userInformation: payload };
    },
    RsetUserImage: (state, { payload }) => {
      return { ...state, userImage: payload };
    },
    RsetLoggedInUserImage: (state, { payload }) => {
      return { ...state, loggedInUserImage: payload };
    },
    RsetRequestMembs: (state, { payload }) => {
      return { ...state, requestMembs: payload };
    },
  },
  extraReducers: {
    [handleHistories.fulfilled]: (state, { payload }) => {
      return { ...state, histories: payload };
    },
    [handleDepartments.fulfilled]: (state, { payload }) => {
      return { ...state, allDepartment: payload };
    },
    [handleReqsList.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        requestMembs: payload.members,
        reqsList: payload.list,
      };
    },
  },
});

export const {
  RsetUnit,
  RsetUnitsOption,
  RsetTypesOption,

  RsetActiveTab,

  RsetUserName,
  RsetPassword,
  RsetLoading,
  RsetUser,
  RsetMenu,
  RsetLoggedIn,
  RsetLastNewReqs,
  RsetUserInfoChanged,
  RsetUserNotFoundModal,
  RsetAllDepartmentsSelect,
  RsetUserInfoModal,
  RsetRealFilter,
  RsetActionToPersonsModal,
  RsetFormErrors,
  RsetLeaveTypeFilterSelect,
  RsetLeaveTypeeFilterSelect,
  RsetLeaveAddOrSubFilterSelect,

  RsetIsLoadingCheckout,
  RsetDescriptionModals,
  RsetRequestsList,
  RsetCompanyNames,
  RsetCompaniesOption,
  RsetSendOptions,

  RsetUsersByRole,
  RsetUsersByRoleOptions,
  RsetRoles,
  RsetRolesOptions,
  RsetAddRole,

  RsetUserInformation,
  RsetUserImage,
  RsetLoggedInUserImage,

  RsetRequestMembs
} = mainSlices.actions;

export const selectUnit = (state) => state.mainHome.unit;
export const selectUnitsOption = (state) => state.mainHome.unitsOption;
export const selectTypesOption = (state) => state.mainHome.typesOption;

export const selectActiveTab = (state) => state.mainHome.activeTab;

export const selectUserName = (state) => state.mainHome.userName;
export const selectPassword = (state) => state.mainHome.password;
export const selectLoading = (state) => state.mainHome.loading;
export const selectLoggedIn = (state) => state.mainHome.loggedIn;
export const selectLastNewReqs = (state) => state.mainHome.lastNewReqs;
export const selectUserInfoChanged = (state) => state.mainHome.userInfoChanged;
export const selectUserNotFoundModal = (state) => state.mainHome.userNotFoundModal;
export const selectMenu = (state) => state.mainHome.menu;
export const selectAllDepartmentsSelect = (state) => state.mainHome.allDepartmentsSelect;
export const selectUserInfoModal = (state) => state.mainHome.userInfoModal;
export const selectRealFilter = (state) => state.mainHome.realFilter;
export const selectActionToPersonsModal = (state) => state.mainHome.actionToPersonsModal;
export const selectFormErrors = (state) => state.mainHome.formErrors;
export const selectLeaveTypeFilterSelect = (state) => state.mainHome.leaveTypeFilterSelect;
export const selectLeaveTypeeFilterSelect = (state) => state.mainHome.leaveeTypeFilterSelect;
export const selectLeaveAddOrSubFilterSelect = (state) => state.mainHome.leaveAddOrSubFilterSelect;

export const selectUserInformations = (state) => state.mainHome.userInformation;
export const selectUserImage = (state) => state.mainHome.userImage;
export const selectLoggedInUserImage = (state) => state.mainHome.loggedInUserImage;
export const selectIsLoadingCheckout = (state) => state.mainHome.isLoading;
export const selectUser = (state) => state.mainHome.user;
export const selectHistories = (state) => state.mainHome.histories;
export const selectAllDeps = (state) => state.mainHome.allDepartment;
export const selectReqsList = (state) => state.mainHome.reqsList;
export const selectRequestMemb = (state) => state.mainHome.requestMembs;
export const selectSendOptions = (state) => state.mainHome.sendOptions;
// -> select disable fields
export const selectDisableFields = (state) => state.mainHome.disableField;

export const selectDescriptionModals = (state) => state.mainHome.descriptionModals;

export const selectCompanyNames = (state) => state.mainHome.companyNames;
export const selectCompaniesOption = (state) => state.mainHome.companiesOption;

export const selectUsersByRole = (state) => state.mainHome.usersByRole;
export const selectUsersByRoleOptions = (state) => state.mainHome.usersByRoleOptions;
export const selectRoles = (state) => state.mainHome.roles;
export const selectRolesOptions = (state) => state.mainHome.rolesOptions;
export const selectAddRole = (state) => state.mainHome.addRole;

export default mainSlices.reducer;
