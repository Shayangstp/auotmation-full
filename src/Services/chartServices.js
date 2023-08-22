import http from "./httpService";
import config from "./config.json";

export const getSalesChart = (financeYear, chartType, numberOfRows) => {
    return http.get(`${config.localapi}/sales/managementDash/GlasswareReport`, {params:{financeYear: financeYear, reportType: chartType, numberOfRows: numberOfRows}},{timeout: 30000})
}

export const getTenChart = (chartType) => {
    return http.get(`${config.localapi}/sales/managementDash/SalesPerSth`, {params:{title: chartType}},{timeout: 30000})
}
