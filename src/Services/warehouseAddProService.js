import http from "./httpService";
import config from "./config.json";

export const getProByCodeOrName = (code, name) => {
    if(code !== undefined && code.length >= 5){
        return http.get(`${config.localapi}/inventory/material/search/`, { params: { code: code, name: name } },{timeout: 30000})
    }else{
        return http.get(`${config.localapi}/inventory/material/search/`, { params: { codePart: code, name: name } },{timeout: 30000})
    }
}

export const getgoodInfo = (values) => {
    return http.get(`${config.localapi}/work/ceramic/goods/costOfItem`, {
        params: values,
    },{timeout: 30000});
};

export const getCeramicMaterialList = (filterValues) => {
    return http.get(`${config.localapi}/work/ceramic/goods/getList`, {
        params: filterValues,
    },{timeout: 30000});
};

// let filterValues = {
//     itemCode: ceramicMaterialCode ? ceramicMaterialCode : "",
//     itemName: ceramicAddMaterialName ? ceramicAddMaterialName : "",
//     itemGroupName: "",
//     itemTechnicalInfo: "",
// };
