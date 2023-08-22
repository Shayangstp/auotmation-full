import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import CheckoutOfficialSlice from "../Components/Slices/CheckoutOfficialSlice";
import OverTimeSlice from "../Components/Slices/OverTimeSlice";
import TableCheckoutListReducer from "../Components/Slices/TableCheckoutSlice";
import mainSlices from "../Components/Slices/mainSlices";
import expencesAccountSlice from "../Components/Slices/expencesAccountSlice";
import filesCloudSlice from "../Components/Slices/filesCloudSlice";
import softwareSlice from "../Components/Slices/softwareSlice";
import modalsSlice from '../Components/Slices/modalsSlice';
import currentReqSlice from "../Components/Slices/currentReqSlice";
import chartsSlice from "../Components/Slices/chartsSlice";
import leaveSlice from "../Components/Slices/leaveSlice";
import loanSlice from "../Components/Slices/loanSlice";
import changePassSlice from "../Components/Slices/changePassSlice";
import irantoolSlices from "../Components/Slices/irantoolSlices";
import ceramicSlices from "../Components/Slices/ceramicSlices";
import filterSlices from "../Components/Slices/filterSlices";
import ceramicPriceSlices from "../Components/Slices/ceramicPriceSlices";
import goodSearchSlice from "../Components/Slices/goodSearchSlice";
import chartSlice from "../Components/Slices/chart/chartSlices";
import saleSlices from "../Components/Slices/saleSlices";
import warehouseSlice from "../Components/Slices/warehouseSlice";
import financialSlices from "../Components/Slices/financialSlices";
import purchaseSlice from "../Components/Slices/purchaseSlice";

const rootReducer = {
  checkout: CheckoutOfficialSlice,
  tableCheckoutList: TableCheckoutListReducer,
  overTime: OverTimeSlice,
  mainHome: mainSlices,
  expenseAccount: expencesAccountSlice,
  filesCloud: filesCloudSlice,
  software: softwareSlice,
  modals: modalsSlice,
  currentReq: currentReqSlice,
  charts: chartsSlice,
  leave: leaveSlice,
  loan: loanSlice,
  changePass: changePassSlice,
  irantool: irantoolSlices,
  ceramic: ceramicSlices,
  filter: filterSlices,
  ceramicPrice: ceramicPriceSlices,
  goodSearch: goodSearchSlice,
  chart: chartSlice,
  sale: saleSlices,
  warehouse: warehouseSlice,
  financial: financialSlices,
  purchase: purchaseSlice
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
