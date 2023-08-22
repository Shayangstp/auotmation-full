import http from "./httpService";
import config from "./config.json";

// get all new reqs
export const getAllNewReqsList = (filterParams) => {
    return http.get(`${config.localapi}/action/allReqs/`, {params:filterParams},{timeout: 30000})
}

// get req categories
export const getReqCategories = () => {
    return http.get(`${config.localapi}/actionType`,{timeout: 30000})
}