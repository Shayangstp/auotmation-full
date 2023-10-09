import http from "./httpService";
import config from "./config.json";

//  -> Post clod with file
export const getCloudAccessList = () => {
    return http.get(`${config.localapi}/cloud/accessMode`,{timeout: 30000})
}
export const submitCloud = (files , values) => {
  return http.post(`${config.localapi}/cloud/`,files, {params : values} , { timeout: 30000 })
}

export const getFileCloudDownload = (reqId) => {
    return http.get(
      `${config.localapi}/cloud/download/` + reqId,
      {
        responseType: "blob",
      },
      { timeout: 30000 }
    );
};