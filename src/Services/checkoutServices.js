import http from "./httpService";
import config from "./config.json";

// ip/user/search/{id}/{natCode}/{personelId} --> get if any of that was null send emty string

export const getUserBySearch = (id, natCode, personelId) => {
  return http.get(
    `${config.localapi}/user/search/${id}/${natCode}/${personelId} `
  );
};

// ip/officeSettlement/cause  --> get
export const getLeavingWorkReason = () => {
  return http.get(`${config.localapi}/officeSettlement/cause`);
};

//  دریافت کاربران (جستجو لحظه ای)
export const getUser = (values) => {
  return http.get(`${config.localapi}/user/fill/searchFields`, {
    params: values,
  });
};

// submit ip/officeSettlement , {leaverId: "", leavingWorkCause: 0, leavingWorkDate: "", description: ""} --> postexport
export const submitCheckoutReq = (checkoutReqValues) => {
  return http.post(`${config.localapi}/officeSettlement`, checkoutReqValues);
};

//sending the data confirmed by Roles
export const checkoutDataConfirmation = (reqId, values) => {
  console.log(reqId, values);
  return http.patch(`${config.localapi}/officeSettlement/${reqId}`, values);
};
