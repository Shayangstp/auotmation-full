import http from "./httpService";
import config from "./config.json";


export const getPaySlipReportFields = () => {
    return http.get(`${config.localapi}/finance/salaryReport/title`,{timeout: 30000});
}

export const getPaySlipReportCompanies = () => {
    return http.get(`${config.localapi}/finance/salaryReport/accessToCompany/`+ localStorage.getItem('id'),{timeout: 30000});
}

export const getPaySlipReport = (fields, filterString) => {
    return http.get(`${config.localapi}/finance/salaryReport`, {params:{fields: fields, filter: filterString}},{timeout: 30000});
}