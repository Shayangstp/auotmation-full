import http from "../httpService";
import config from "../config.json";

//  -> Post clod with file
export const getUploudFile = (uploudFile, values) => {
    return http.post(`${config.localapi}/cloud/file/`, uploudFile, { params: values },{timeout: 30000})
}

//  -> Post clod without app
export const cloudAccMode = () => {
    return http.get(`${config.localapi}/cloud/accessMode`,{timeout: 30000})
}

//  -> Post clod with app
export const cloudAppName = () => {
    return http.get(`${config.localapi}/cloud/appName`,{timeout: 30000})
}

//  -> Reqs list file
export const cloudFileList = (filterValues) => {
    return http.get(`${config.localapi}/cloud/file`, { params: filterValues },{timeout: 30000})
}

//  -> Download file cloud
export const downloadFileCloud = (reqId) => {
    return http.get(`${config.localapi}/cloud/file/download/${reqId}`, { responseType: 'blob' },{timeout: 30000})
}
//ip/cloud/file/download/{ request id }  --> get

