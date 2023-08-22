import http from "./httpService";
import config from "./config.json";

//get office req titles
export const getReqTitles = () => {
    return http.get(`${config.localapi}/officeReqTitle`,{timeout: 30000});
}
// post office action
export const postOfficeAction = actionValues => {
    return http.post(`${config.localapi}/officeAction`, actionValues,{timeout: 30000});
}
// new req
export const postOfficeNewReq = officeNewReqValues => {
    return http.post(`${config.localapi}/officeReq`, officeNewReqValues,{timeout: 30000});
}
export const postOfficeNewReqFile = officeNewReqFileValues => {
    return http.post(`${config.localapi}/officeReqFile`, officeNewReqFileValues,{timeout: 30000});
}
export const postOfficeNewReqLinks = officeNewReqLinksValues => {
    return http.post(`${config.localapi}/officeReqLink`, officeNewReqLinksValues,{timeout: 30000});
}
// requests list
export const getOfficeReqsList = () => {
    return http.get(`${config.localapi}/officeReq/letterList`, {params:{ user_id: localStorage.getItem('id') }},{timeout: 30000});
}
// request like
export const postOfficeReqLikeAndDis = officeLikeAndDisValues => {
    return http.post(`${config.localapi}/officeEvent`, officeLikeAndDisValues,{timeout: 30000})
}
// request details
export const getOfficeReqDetails = reqId => {
    return http.get(`${config.localapi}/officeReq/detail/`+ reqId,{timeout: 30000});
}
// request expired
export const patchOfficeReqExpired = reqId => {
    return http.patch(`${config.localapi}/officeReq/expireDate/`+ reqId,{timeout: 30000});
}

// request details
export const getLeaveTypes = reqType => {
    return http.get(`${config.localapi}/leaveType/`+ reqType,{timeout: 30000});
}

// edit leave request
export const editLeaveReq = (reqId, editedLeaveValues) => {
    return http.patch(`${config.localapi}/officeLeave/${reqId}`, editedLeaveValues,{timeout: 30000});
}

// new leave request
export const postOfficeLeaveReq = officeLeaveReqValues => {
    return http.post(`${config.localapi}/officeLeave`, officeLeaveReqValues,{timeout: 30000})
}
// leave days info
export const getOfficeLeaveDays = () => {
    return http.get(`${config.localapi}/officeLeave/remainderLeave/`+ localStorage.getItem('id'),{timeout: 30000});
}

// دریافت کلیه کاربران بر اساس لوکیشن و شرکت
export const getUsersByCo = (companyCode, location) => {
    return http.get(`${config.localapi}/user/findInCompany/department/${companyCode}/${location}`,{timeout: 30000});
}

// leave office to person
export const getOfficeToPerson= (coCode, location) => {
    return http.get(`${config.localapi}/user/office/`+ coCode + '/' + location,{timeout: 30000});
}

// get all trip types
export const getAllTripTypes = () => {
    return http.get(`${config.localapi}/tripType/`,{timeout: 30000})
}

// new mission request
export const postOfficeMissionReq = officeMissionReqValues => {
    return http.post(`${config.localapi}/officeMission`, officeMissionReqValues,{timeout: 30000})
}

export const getDrivers = () => {
    return http.get(`${config.localapi}/driver`,{timeout: 30000})
}
export const getDriverInfo = (driverId) => {
    return http.get(`${config.localapi}/driver/` + driverId,{timeout: 30000})
}
export const getUserInfoToCoordinateMission = (userId) => {
    return http.get(`${config.localapi}/officeMission/info-for-ticket/` + userId,{timeout: 30000})
}

export const addTripOptions = (reqId, tripValues) => {
    return http.get(`${config.localapi}/officeMission/travelManager/` + reqId, {params: tripValues},{timeout: 30000})
    //ip/officeMission/travelManager/638c376a38d6c7f9537f21e2?driver=638c830e791a192cd225ae6b
}

// get user pay slip
export const getUserPaySlip = (personalCode, userName, password, month, paySlipStatus) => {
    if(paySlipStatus === 'currentPaySlip'){
        return http.get(`${config.localapi}/fish/`+ personalCode, {params:{ user: userName, pass: password }},{timeout: 30000})
    }else if(paySlipStatus === 'monthPaySlip'){
        return http.get(`${config.localapi}/fish/`+ personalCode, {params:{ month: month }},{timeout: 30000})
    }
    
}

// change job request
export const postJobChange = changeJobValues => {
    return http.post(`${config.localapi}/changeShift`, changeJobValues,{timeout: 30000})
}


// post news 
export const postOfficeNews = OfficeAddNewsValues => {
    return http.post(`${config.localapi}/news`, OfficeAddNewsValues,{timeout: 30000})
}
// get news 
export const getOfficeNews = () => {
    return http.get(`${config.localapi}/news/last`,{timeout: 30000})
}


// post notice
export const postOfficeNotice = OfficeAddNoticeValues => {
    return http.post(`${config.localapi}/notice`, OfficeAddNoticeValues,{timeout: 30000})
}
// get notices 
export const getOfficeNotices = () => {
    return http.get(`${config.localapi}/notice/last`,{timeout: 30000})
}



// post days and foods
export const postDaysFood = daysFoodValues => {
    return http.post(`${config.localapi}/food`, daysFoodValues,{timeout: 30000})
}
// patch days and foods
export const patchDaysFood = daysFoodValues => {
    return http.patch(`${config.localapi}/food`, daysFoodValues,{timeout: 30000})
}




