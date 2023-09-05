import http from "./httpService";
import config from "./config.json";

// get user Info
export const getUserInfo = (userId) => {
  return http.get(`${config.localapi}/user/info/` + userId, { timeout: 30000 });
};
// get user Image  // 1 approved 0 not approved image
export const getUserImage = (userId, status) => {
  return http.get(`${config.localapi}/user/photo/` + userId + "/" + status);
};
// get warehouse product Info
export const getProInfo = (storeAsCode, coCode) => {
  return http.get(
    `${config.localapi}/material/selectedGood/` + storeAsCode + "/" + coCode,
    { timeout: 30000 }
  );
};

export const companiesList = () => {
  return http.get(`${config.localapi}/global/companies`, { timeout: 30000 });
};
export const getReqProcess = (processValues) => {
  return http.get(
    `${config.localapi}/global/process`,
    { params: processValues },
    { timeout: 30000 }
  );
};
export const getAllItems = (typeId, filterValues) => {
  return http.get(
    `${config.localapi}/global/getItemsList/${localStorage.getItem(
      "id"
    )}/${typeId}`,
    { params: filterValues },
    { timeout: 30000 }
  );
};
// get companies
export const getCompanies = () => {
  return http.get(`${config.localapi}/cmp`, { timeout: 30000 });
};
// get company departments
export const getCoDepartments = (companyCode, location) => {
  return http.get(
    `${config.localapi}/dep/findDeps/` + companyCode + "/" + location,
    { timeout: 30000 }
  );
};
// get company users with office
export const getAllUsersWithOffice = (companyCode, location) => {
  return http.get(
    `${config.localapi}/user/wrote/` +
      companyCode +
      "/" +
      location +
      "/" +
      localStorage.getItem("id"),
    { timeout: 30000 }
  );
};
// get all users
export const getAllUsers = () => {
  return http.get(`${config.localapi}/user`, { timeout: 30000 });
};
// get all users in company
export const getCoUsers = (info, companyCode, location) => {
  return http.get(
    `${config.localapi}/user/findInCompany/` +
      info +
      "/" +
      companyCode +
      "/" +
      location,
    { params: { id: localStorage.getItem("id") } },
    { timeout: 30000 }
  );
};
// get all users in dep
export const getDepartmentUsers = (depName, company, location) => {
  let dep = { code: "", name: depName };
  return http.get(
    `${config.localapi}/user/toList/` + company + "/" + location,
    { params: dep },
    { timeout: 30000 }
  );
};

// post action
export const postAction = (ActionValues) => {
  return http.post(`${config.localapi}/action`, ActionValues, {
    timeout: 30000,
  });
};

// get menu
export const getMenu = (pMenuId) => {
  return http.get(`${config.localapi}/menu/title/` + pMenuId, {
    timeout: 30000,
  });
};

// check permission
export const checkPermission = () => {
  return http.get(
    `${config.localapi}/access/present/pers/` + localStorage.getItem("id"),
    { timeout: 30000 }
  );
};

// permissions updated
export const gotPermissions = () => {
  return http.patch(
    `${config.localapi}/access/changedPer/` + localStorage.getItem("id"),
    { timeout: 30000 }
  );
};

// get not seen reqs
export const getNotSeenReqs = (type) => {
  return http.get(
    `${config.localapi}/action/seen/` + localStorage.getItem("id") + "/" + type,
    { timeout: 30000 }
  );
};

// get users login
export const getUsersLogin = () => {
  return http.get(`${config.localapi}/action/log/Time`, { timeout: 30000 });
};

// get last new Requests
export const getLastNewReqs = () => {
  return http.get(
    `${config.localapi}/action/bell/`,
    { params: { id: localStorage.getItem("id") } },
    { timeout: 30000 }
  );
};

//get units
export const getUnits = () => {
  return http.get(`${config.localapi}/inventory/material/units`, {
    timeout: 30000,
  });
};

// get provinces
export const getProvinces = () => {
  return http.get(`${config.localapi}/province`, { timeout: 30000 });
};

// get cities by req type
export const getCitiesByType = (type) => {
  return http.get(
    `${config.localapi}/city/accordigToList`,
    { params: { type: type } },
    { timeout: 30000 }
  );
};

// get cities by province
export const getCities = (province) => {
  return http.get(`${config.localapi}/city/` + province, { timeout: 30000 });
};

// get today
export const getTodayDate = () => {
  return http.get(`${config.localapi}/days/today`, { timeout: 30000 });
};
// post days and foods
export const getDaysFood = () => {
  return http.get(`${config.localapi}/food`, { timeout: 30000 });
};

//global function for all req types

// Get Current Req Details
export const getCurrentReqInfo = (reqId, type) => {
  return http.get(`${config.localapi}/action/reqDetail/` + reqId + "/" + type, {
    timeout: 30000,
  });
};
// Get Current Req items
export const getCurrentReqItems = (reqId, reqType) => {
  return http.get(`${config.localapi}/global/items/` + reqId + "/" + reqType, {
    timeout: 30000,
  });
};
// Get Current Req History
export const getCurrentReqHistory = (commentsStatus, reqId, type) => {
  return http.get(
    `${config.localapi}/action/findComments/` +
      commentsStatus +
      "/" +
      reqId +
      "/" +
      type,
    { timeout: 30000 }
  );
};

export const getRequestsList = (filterValues) => {
  return http.get(
    `${config.localapi}/action/reqList2`,
    { params: filterValues },
    { timeout: 30000 }
  );
};
//let res = JSON.stringify(query)

export const checkReqUpdateDate = (requestId, actionId, type) => {
  return http.get(
    `${config.localapi}/action/checkDate/` +
      requestId +
      `/` +
      actionId +
      "/" +
      type,
    { timeout: 30000 }
  );
};

export const checkItemUpdateDate = (itemId, actionId) => {
  return http.get(
    `${config.localapi}/checkEditionOfItem/` + itemId + `/` + actionId,
    { timout: 30000 }
  );
};

// Get to persons
export const getToPersonByRole = (
  role,
  location,
  company,
  existRole,
  dep,
  task
) => {
  return http.get(
    `${config.localapi}/user/findPerson/inGroup`,
    {
      params: {
        roles: role,
        location: location,
        company: company,
        exist: existRole,
        department: dep,
        task: task,
      },
    },
    { timeout: 30000 }
  );
};

export const getAllStatuses = (type) => {
  return http.get(`${config.localapi}/actionCode/` + type, { timeout: 30000 });
};

export const postActionToPersons = (reqId, type, toPersons) => {
  return http.get(
    `${config.localapi}/action/addToPerson/` + reqId + "/" + type,
    { params: { toPersons: toPersons } },
    { timeout: 30000 }
  );
};

//status = profile edit 1 - reset pass 2
export const sendSmsCode = (code, value, status, userId) => {
  const id =
    localStorage.getItem("id") !== null ? localStorage.getItem("id") : userId;
  return http.get(
    `${config.localapi}/user/confirmSMS/` + id + "/" + code,
    { params: { justdelete: value, valueCode: status } },
    { timeout: 30000 }
  );
};

export const getMyReqsList = () => {
  return http.get(
    `${config.localapi}/action/myRequests/` + localStorage.getItem("id"),
    { timeout: 30000 }
  );
};

export const getNumberOfStaff = (minmaxValues) => {
  return http.get(
    `${config.localapi}/chart/numberOfPersonel`,
    { params: minmaxValues },
    { timeout: 30000 }
  );
};

export const changeUserRole = (changedValues) => {
  return http.patch(`${config.localapi}/user/setRole`, changedValues, {
    timeout: 30000,
  });
};
