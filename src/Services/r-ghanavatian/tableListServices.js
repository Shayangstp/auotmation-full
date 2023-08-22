import http from "../httpService";
import config from "../config.json";


//  دریافت کاربران لیست تسویه
export const getUserListTable = (values) => {
  return http.get(
    `${config.localapi}/settlement/list/${localStorage.getItem("id")}`, {params: values}
    ,{timeout: 30000});
};

//  دریافت وضعیت لیست تسویه
export const getAllStatuses = () => {
  return http.get(`${config.localapi}/actionCode/10`,{timeout: 30000});
};

// ردیف درخواست کاربران
export const getCurrentReqInfo = (reqId, type) => {
  return http.get(`${config.localapi}/action/reqDetail/${reqId}/${type}`,{timeout: 30000});
};

// check_Date
export const checkDate = (getLastActionId, getReqId, type) => {
  return http.get(
    `${config.localapi}/action/checkDate/${getReqId}/${getLastActionId}/${type}`
    ,{timeout: 30000});
};

// تایید درخواست لیست
export const findToPerson = (actionValues) => {
  return http.get(`${config.localapi}/user/findPerson/inGroup`, {params: actionValues},{timeout: 30000});
};

// تاریخچه دریافت کامنت های کاربران لیست
export const getCurrentReqHistory = (serial, reqType) => {
  return http.get(`${config.localapi}/action/findComments/${serial}`, {
    params: { id: localStorage.getItem("id"), type: reqType }
  },{timeout: 30000});
};
