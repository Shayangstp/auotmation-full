import http from "./httpService";
import config from "./config.json";

export const getSelectOptions = (selectType) => {
    return http.get(`${config.localapi}/sales/goalSetting/filterValue/`+ selectType,{timeout: 30000})
}

export const getTargetingList = (filterValues) => {
    return http.get(`${config.localapi}/sales/goalSetting/filter`, {params: filterValues},{timeout: 30000})
}
