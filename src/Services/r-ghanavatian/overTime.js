import http from "../httpService";
import config from "../config.json";

//  علت اضافه کار
export const getOverTimeReason = () => {
  return http.get(`${config.localapi}/officeOverTimeReason`,{timeout: 30000});
};

// ارسال فرم اضافه کار به لیست
export const postOverTime = async (values) => {
  return http.post(`${config.localapi}/officeOverTime`, values,{timeout: 30000});
};

// کاربران درخواست اضافه کار
export const officeOverTimeList = (values) => {
  return http.get(`${config.localapi}/officeOverTime/list`, {params: values},{timeout: 30000});
};

// ویرایش درخواست اضافه کار
export const editOverTimeReq = async (reqId, values) => {
  return http.patch(`${config.localapi}/officeOverTime/${reqId}`, values,{timeout: 30000});
};
