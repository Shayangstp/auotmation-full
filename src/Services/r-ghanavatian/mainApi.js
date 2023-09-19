import http from "../httpService";
import config from "../config.json";

export const checkPassCompleted = (userId, allOrPass) => {
  return http.get(`${config.localapi}/user/need/edit-pass`, {params:{ id: userId, need: allOrPass}},{timeout: 30000})
}

// ارسال اکشن
export const postAction = (ActionValues) => {
  return http.post(`${config.localapi}/action`, ActionValues,{timeout: 30000});
};

// Permision changed
export const permisionChanged = () => {
  return http.patch(
    `${config.localapi}/access/changedPer/` + localStorage.getItem("id")
    ,{timeout: 30000});
};

// Permision present
export const permisionPresent = () => {
  return http.get(
    `${config.localapi}/access/present/pers/` + localStorage.getItem("id")
    ,{timeout: 30000});
};

// اکشن ارسال به سرپرست
export const actionAddPerson = (reqId, type, toPersons) => {
  return http.get(`${config.localapi}/action/addToPerson/` + reqId + "/" + type, {params: {toPersons: toPersons}},{timeout: 30000});
};

//  دریافت شرکت
export const getAllCompany = () => {
  return http.get(`${config.localapi}/cmp`,{timeout: 30000});
};

//  دریافت واحد
export const getAllDepartment = (companyCode, location) => {
  return http.get(
    `${config.localapi}/dep/findDeps/${companyCode}/${location}`
    ,{timeout: 30000});
};
