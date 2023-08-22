import http from "./httpService";
import config from "./config.json";

// softwareNames
export const softwareLists = () => {
  return http.get(`${config.localapi}/software/list`,{timeout: 30000});
};

// add new software request
export const submitSoftwareReq = (softwareReqValues) => {
  return http.post(`${config.localapi}/software`, softwareReqValues,{timeout: 30000});
};

// add new software request item
export const softwareReq = (softwareReqItemValues) => {
  return http.post(`${config.localapi}/software/item`, softwareReqItemValues,{timeout: 30000});
};


// ip/software/item, {params: {requestId: ''}}  -> get
export const softwareReqItem = (requestId) => {
  return http.get(`${config.localapi}/software/item`, {
    params: { requestId: requestId },
  },{timeout: 30000});
};

// ip/global/requestProcess/{requestId}/{type : 6}  --> get
export const softwareReqProcess = (requestId, type) => {
  return http.get(
    `${config.localapi}/global/requestProcess/${requestId}/${type}`
    ,{timeout: 30000});
};
