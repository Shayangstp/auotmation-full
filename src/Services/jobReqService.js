import http from "./httpService";
import config from "./config.json";

// get all statuses

// get company acts
export const getCompanyActs = (companyCode) => {
    return http.get(`${config.localapi}/work/process/` + companyCode,{timeout: 30000})
}

// get to person id
export const getToPersonId = (companyCode, roleCode) => {
    return http.get(`${config.localapi}/roles/find/` + companyCode  + '/' + roleCode,{timeout: 30000})
}

// get co dep users
export const getDepartmentUSers = (department,company) => {
    return http.get(`${config.localapi}/user/toList/` + department  + '/' + company,{timeout: 30000})
}
// submit new request
export const postRequest = ReqValues => {
    return http.post(`${config.localapi}/work/ceramic`, ReqValues,{timeout: 30000})
}
// request item files
export const postReqItemFiles = reqItemFileValues => {
    return http.post(`${config.localapi}/file`, reqItemFileValues,{timeout: 30000})
}
// add new Department
export const addNewDepartment = depName => {
    return http.post(`${config.localapi}/dep`, depName,{timeout: 30000})
}
// get all info about one request
// export const getRequestInfo = requestId => {
//     return http.get(`${config.localapi}/req/detail/` + requestId,{timeout: 30000});
// };


// newRequest
export const upSupervisors = () => {
    return http.get(`${config.localapi}/dep/upSupers/`+ localStorage.getItem('id') + `/` + localStorage.getItem('dep'),{timeout: 30000})
}
export const getReqId = reqId => {
    return http.get(`${config.localapi}/request/` + reqId,{timeout: 30000})
}
export const postAction = ActionValues => {
    return http.post(`${config.localapi}/action`, ActionValues,{timeout: 30000})
}
export const postReqItems = (ItemsValue , files) => {
    return http.post(`${config.localapi}/work/ceramic/item`, files ,{params:ItemsValue},{timeout: 30000})
}
export const getReqItemId = reqItemId => {
    return http.get(`${config.localapi}/item/` + reqItemId,{timeout: 30000})
}
export const setUserSupervisor = (userId, supervisorId) => {
    return http.patch(`${config.localapi}/user/supervisor/` + userId, {supervisor_id: supervisorId},{timeout: 30000})
}

export const getNewRequests = () => {
    return http.get(`${config.localapi}/req/ntseen/`+localStorage.getItem('id'),{timeout: 30000})
}

// export const getReqItems = (requestId) => {
//     return http.get(`${config.localapi}/reqItem/` + requestId,{timeout: 30000})
// }
export const reqVisitedAction = (visitedReqValues) => {
    return http.post(`${config.localapi}/action`, visitedReqValues,{timeout: 30000})
}
export const acceptRequest = (acceptReqValues) => {
    return http.post(`${config.localapi}/action`, acceptReqValues,{timeout: 30000})
}
export const getExecuterGrp = toCompanyCode => {
    return http.get(`${config.localapi}/dep/ctrl/prj/`+ toCompanyCode,{timeout: 30000})
}
export const getExecuterPrsns = (userCompany, selectedDepId) => {
    return http.get(`${config.localapi}/dep/ctrlprj/findMembers/`+ userCompany + '/' + selectedDepId,{timeout: 30000})
}
export const getWarehouseCodes = () => {
    return http.get(`${config.localapi}/material`,{timeout: 30000})
}
export const postProjectControlValues = (reqId, ProjectControlValues) => {
    return http.patch(`${config.localapi}/req/setProjectNumber/`+ reqId , ProjectControlValues,{timeout: 30000})
}
export const postReqMaterialsValues = (reqId, MaterialsValues) => {
    return http.patch(`${config.localapi}/req/material/`+ reqId , MaterialsValues,{timeout: 30000})
}
export const updateReqItemFile = (itemId, UpdateFileValues) => {
    return http.patch(`${config.localapi}/file/`+ itemId , UpdateFileValues,{timeout: 30000})
}
//update action code to send req for axecuterGroups
export const sendReqToExecuters = reqId => {
    return http.patch(`${config.localapi}/action/editCode/`+reqId,{timeout: 30000})
}

export const cancelRequest = (cancelReqValues) => {
    return http.post(`${config.localapi}/action`, cancelReqValues,{timeout: 30000})
}
export const updateRequest = (itemId, updateReqValues) => {
    return http.patch(`${config.localapi}/reqItem/`+ itemId, updateReqValues,{timeout: 30000})
}
export const deletedReqItem = (itemId) => {
    return http.delete(`${config.localapi}/reqItem/`+ itemId,{timeout: 30000})
}
export const postNumberOfDeliveries = (itemId, number) => {
    return http.patch(`${config.localapi}/item/received/` + itemId, {received: number},{timeout: 30000})
}


export const getReqHistory = serial => {
    return http.get(`${config.localapi}/action/findComments/`+ serial, {params:{id:localStorage.getItem('id')}},{timeout: 30000})
}


// requests name list
export const getCeramicReqNames= () => {
    return http.get(`${config.localapi}/work/ceramic/projectNames`,{timeout: 30000})
}

// pro list
export const getProList= filterValues => {
    return http.get(`${config.localapi}/work/ceramic/goods/getList`, {params: filterValues},{timeout: 30000})
}
