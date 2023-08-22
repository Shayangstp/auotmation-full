import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCompany } from "../../Services/r-ghanavatian/mainApi";
import {
  getAllStatuses,
  getCurrentReqInfo,
  getUserListTable,
} from "../../Services/r-ghanavatian/tableListServices";
import { RsetIsLoadingCheckout } from "./mainSlices";

const initialState = {
  userMembers: [],
  memberId: "",
  status: "",
  leaver: "",
  userMemb: "",
  fromDate: null,
  toDate: null,

  userCheckoutTableList: [],
  filterUsers: [],
  acceptCheckoutModal: false,
  editCheckoutModal: false,
  viewCheckoutModal: false,
  cancelCheckoutModal: false,
  historiesCheckoutModal: false,
  allStatus: [],
  allCompany: [],
  company: "",
  location: "",
  department: "",
  detailes: "",
  currentReqCompany: "",
  currentReqDep: "",
  currentReqCompanyCancel: "",
  currentReqDepCancel: "",
  currentReqCompanyView: "",
  currentReqDepView: "",
  currentReqCompanyEdit: "",
  currentReqDepEdit: "",
  complateDescription: "",
  series: "",
  type: "",
  historyData: [],
  leavingWorkCause: "",
};

// Companies
export const handleCompaniesCheckout = createAsyncThunk(
  "tableCheckoutList/fetchGetAllCompany",
  async () => {
    try {
      const resCompanyName = await getAllCompany();
      return resCompanyName.data;
    } catch (ex) {
      console.log(ex);
    }
  }
);

//  Statuses
export const handlStatusesCheckout = createAsyncThunk(
  "tableCheckoutList/handlStatusesCheckout",
  async () => {
    const statusRes = await getAllStatuses();
    return statusRes.data;
  }
);

// User table
// export const handleReqsList = createAsyncThunk(
//   "tableCheckoutList/handleReqsList",
//   async (obj, { dispatch, getState }) => {
//     const {
//       department,
//       company,
//       leaver,
//       status,
//       leavingWorkCause,
//       fromDate,
//       toDate,
//     } = getState().tableCheckoutList;
//     try {
//       const values = {
//         leaver: leaver !== "" ? leaver.value : leaver,
//         status: status !== "" ? status.value : status,
//         fromDate: fromDate !== null ? fromDate.format("YYYY/MM/DD") : "null",
//         toDate: toDate !== null ? toDate.format("YYYY/MM/DD") : "null",
//         leavingWorkCause:
//           leavingWorkCause !== "" ? leavingWorkCause.value : leavingWorkCause,
//         company: company !== "" ? company.value : "",
//         department: department !== "" ? department.value : "",
//         role: "",
//       };
//       const checkoutListRes = await getUserListTable(values);
//       if (checkoutListRes.data) {
//       }
//       return checkoutListRes.data;
//     } catch (ex) {
//       console.log(ex);
//     }
//   }
// );

const CheckoutList = createSlice({
  name: "tableCheckoutList",
  initialState,
  reducers: {
    RsetUserCheckoutTable: (state, { payload }) => {
      return { ...state, leaver: payload };
    },
    RsetEditCheckoutModal: (state, { payload }) => {
      return { ...state, editCheckoutModal: payload };
    },
    RsetViewCheckoutModal: (state, { payload }) => {
      return { ...state, viewCheckoutModal: payload };
    },
    RsetCancelCheckoutModal: (state, { payload }) => {
      return { ...state, cancelCheckoutModal: payload };
    },
    RsetAcceptCheckoutModal: (state, { payload }) => {
      return { ...state, acceptCheckoutModal: payload };
    },
    RsetHistoresCheckoutModal: (state, { payload }) => {
      return { ...state, historiesCheckoutModal: payload };
    },
    RsetStatusTable: (state, { payload }) => {
      return { ...state, status: payload };
    },
    RsetFromDateTable: (state, { payload }) => {
      return { ...state, fromDate: payload };
    },
    RsetToDateTable: (state, { payload }) => {
      return { ...state, toDate: payload };
    },
    RsetDepartmantCheckoutTable: (state, { payload }) => {
      return { ...state, department: payload };
    },
    RsetCompanyCheckout: (state, { payload }) => {
      return { ...state, company: payload };
    },
    RsetCurrentReqCompany: (state, { payload }) => {
      return { ...state, currentReqCompany: payload };
    },
    RsetCurrentReqDepCheckout: (state, { payload }) => {
      return { ...state, currentReqDep: payload };
    },
    RsetLocationCheckout: (state, { payload }) => {
      return { ...state, location: payload };
    },
    addComplateDescription: (state, { payload }) => {
      return { ...state, complateDescription: payload };
    },
    RsetSeries: (state, { payload }) => {
      return { ...state, series: payload };
    },
    RsetCurrentReqType: (state, action) => {
      return { ...state, type: action.payload };
    },
    RsetLeavingWork: (state, { payload }) => {
      return { ...state, leavingWorkCause: payload };
    },
  },
  extraReducers: {
    [handlStatusesCheckout.fulfilled]: (state, { payload }) => {
      return { ...state, allStatus: payload };
    },
    [handleCompaniesCheckout.fulfilled]: (state, { payload }) => {
      return { ...state, allCompany: payload };
    },
  },
});

export const {
  RsetLeavingWork,
  RsetFromDateTable,
  RsetUserCheckoutTable,
  RsetStatusTable,
  RsetAcceptCheckoutModal,
  RsetCancelCheckoutModal,
  RsetViewCheckoutModal,
  RsetEditCheckoutModal,
  RsetToDateTable,
  RsetDepartmantCheckoutTable,
  RsetCompanyCheckout,
  RsetCurrentReqCompany,
  RsetCurrentReqDepCheckout,
  addComplateDescription,
  RsetLocationCheckout,
  RsetHistoresCheckoutModal,
  RsetSeries,
  RsetCurrentReqType,
} = CheckoutList.actions;

export const selectUserMemb = (state) => state.tableCheckoutList.leaver;
export const selectStatus = (state) => state.tableCheckoutList.status;
export const selectFromDate = (state) => state.tableCheckoutList.fromDate;
export const selectToDate = (state) => state.tableCheckoutList.toDate;

export const selectAllStatus = (state) => state.tableCheckoutList.allStatus;
export const selectValueStatus = (state) => state.tableCheckoutList.status;
export const selectAllCompany = (state) => state.tableCheckoutList.allCompany;
export const selectCompany = (state) => state.tableCheckoutList.company;
export const selectDep = (state) => state.tableCheckoutList.department;
export const selectCurrentComp = (state) =>
  state.tableCheckoutList.currentReqCompany;
export const selectCurrentDep = (state) =>
  state.tableCheckoutList.currentReqDep;
export const selectAcceptCheckoutModal = (state) =>
  state.tableCheckoutList.acceptCheckoutModal;
export const selectEditCheckoutModal = (state) =>
  state.tableCheckoutList.editCheckoutModal;
export const selectCancelCheckoutModal = (state) =>
  state.tableCheckoutList.cancelCheckoutModal;
export const selectViewCheckoutModal = (state) =>
  state.tableCheckoutList.viewCheckoutModal;
export const selectHistoriesCheckoutModal = (state) =>
  state.tableCheckoutList.historiesCheckoutModal;
export const selectComplateDescription = (state) =>
  state.tableCheckoutList.complateDescription;
export const selectHistoryData = (state) => state.tableCheckoutList.historyData;
export const selectLeavingWorkCause = (state) =>
  state.tableCheckoutList.leavingWorkCause;
export default CheckoutList.reducer;
