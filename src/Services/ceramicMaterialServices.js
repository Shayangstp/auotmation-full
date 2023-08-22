import http from "./httpService";
import config from "./config.json";

//getList
export const getCeramicMaterialList = (filterValues) => {
  return http.get(`${config.localapi}/work/ceramic/goods/getList`, {
    params: filterValues,
  },{timeout: 30000});
};


export const getCeramicMaterialFilterList = () => {
  return http.get(`${config.localapi}/work/ceramic/goods/cost/list`,{timeout: 30000});
};

//history item
export const getCeramicCostList = (itemCode) => {
  return http.get(`${config.localapi}/work/ceramic/goods/previousCosts/${itemCode}`,{timeout: 30000});
};


export const submitCeramicCost = (material) => {
  return http.patch(`${config.localapi}/work/ceramic/goods/setCost`, material,{timeout: 30000});
};

// search api for the price
export const getCeramicProjectItem = (values) => {
  return http.get(`${config.localapi}/work/ceramic/goods/costOfItem`, {
    params: values,
  },{timeout: 30000});
};

export const submitCeramicProCalculateCost = (values) => {
  return http.post(
    `${config.localapi}/work/ceramic/goods/calculateCost`,
    values
    ,{timeout: 30000});
};

export const submitCeramicProItemCalculateCost = (values) => {
  return http.post(
    `${config.localapi}/work/ceramic/goods/calculateCostHistory`,
    values
    ,{timeout: 30000});
};