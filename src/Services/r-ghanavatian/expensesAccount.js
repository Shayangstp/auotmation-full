import http from "../httpService";
import { config } from "../config.json";

export const expansesAcc = (values) => {
  return http.post(`${config.localApi}/finance/expenseAcc`, values,{timeout: 30000});
};

export const expansesAccItem = (values) => {
  return http.post(`${config.localApi}/finance/expenseAccItem`, values,{timeout: 30000});
};
