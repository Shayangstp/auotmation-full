import http from "./httpService";
import config from './config.json';

export const login = user => {
    return http.get(`${config.localapi}/user/login`, {params: user},{timeout: 30000});
}

export const checkForResetPass = (userValues) => {
    return http.get(`${config.localapi}/user/reset/passDemand`, {params:userValues},{timeout: 30000});
}

export const changeUserPassword = (melliCode, status) => {
    return http.get(`${config.localapi}/user/reset/pass`, {params:{ id: localStorage.getItem('id'), username: melliCode, checkUser: status}},{timeout: 30000});
}

export const registerUser = user => {
    return http.post(`${config.localapi}/user`, user,{timeout: 30000});
}
export const registerDate = registerDateValues => {
    return http.post(`${config.localapi}/action`, registerDateValues,{timeout: 30000});
}

export const userData = userId => {
    return http.get(`${config.localapi}/user/`+ userId ,{timeout: 30000});
}

export const getUsersByFilter = filter => {
    return http.get(`${config.localapi}/user/Approved/List/`+ localStorage.getItem("id"), {params:{ filter: filter}} ,{timeout: 30000});
}
export const acceptUserInfo = (userId, approved) => {
    return http.patch(`${config.localapi}/user/approved/`+ userId, approved ,{timeout: 30000});
}
export const rejectUserInfo = (userId, approved) => {
    return http.patch(`${config.localapi}/user/approved/`+ userId, approved ,{timeout: 30000});
}

export const getSupervisorsByCoDep = (coCode, depCode, location) => {
    return http.get(`${config.localapi}/dep/submit/supervisors/`+ coCode + '/' + depCode + '/' + location,{timeout: 30000})
}

export const updateProfile = (userId, label, value) => {
    return http.patch(`${config.localapi}/user/profileEdit/${userId}/${label}`, value, {params: {values: value}},{timeout: 30000})
}

export const changeSupReq = () => {
    return http.post(`${config.localapi}/global/request`,{timeout: 30000});
}

export const checkPassCompleted = (userId, allOrPass) => {
    return http.get(`${config.localapi}/user/need/edit-pass`, {params:{ id: userId, need: allOrPass}},{timeout: 30000})
}

export const getUSerInfoBeforeRegister = (melliCode, company) => {
    return http.get(`${config.localapi}/user/fill/submitFields/`+ melliCode + '/' + company,{timeout: 30000})
}

export const checkUserRegister = (userValues) => {
    return http.get(`${config.localapi}/user/submit/check`, {params:userValues},{timeout: 30000})
}

export const updateSupStatus = (userId, operation) => {
    return http.patch(`${config.localapi}/user/set/newSup/` + userId + '/' + operation,{timeout: 30000})
}


const accountService = () => {
    
}

export default accountService;


