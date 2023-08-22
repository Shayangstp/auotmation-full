import http from "../httpService";
import config from "../config.json";

//get usernames - mehrdad karami
export const getAllUsernames = () => {
    return http.get(`${config.localapi}/user`,{timeout: 30000})
}

//get all access - mehrdad karami
export const getAllAccess = () => {
    return http.get(`${config.localapi}/per`,{timeout: 30000})
}


//post all user permissions
export const postUserPermissions = usersPerms => {
    return http.post(`${config.localapi}/access`, {permissions: usersPerms},{timeout: 30000})
}

//get all user permissions 
export const getUserPermissions = userId => {
    return http.get(`${config.localapi}/access/present/pers/${userId}`,{timeout: 30000})
}

//delete user permissions
export const deleteUserPermissions = deletedPerms => {
    return http.get(`${config.localapi}/access/delete`, {params: {permissions: deletedPerms}},{timeout: 30000})
}