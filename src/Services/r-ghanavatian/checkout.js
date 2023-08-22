import http from "../httpService";
import config from "../config.json";

// checkout registration users select
export const getAllUsersByPersonalCode = (companyCode, location) => {
  return http.get(
    `${config.localapi}/user/findInCompany/personelCode/${companyCode}/${location}`
    ,{timeout: 30000});
};

// ارسال اطلاعات پرسنل مستعفی
export const postUserDataCheckout = (values) => {
  return http.post(`${config.localapi}/settlement`, values,{timeout: 30000});
};

//  دریافت علت ترک خدمت
export const getReasonLeavingWork = () => {
  return http.get(`${config.localapi}/leavingWorkCause`,{timeout: 30000});
};

//  دریافت کاربران مستعفی
export const getUser = (values) => {
  return http.get(`${config.localapi}/user/fill/searchFields`, {params: values},{timeout: 30000});
};

export const patchEditCheckout = (reqId, values) => {
  return http.patch(`${config.localapi}/settlement/${reqId}`, values,{timeout: 30000});
};
