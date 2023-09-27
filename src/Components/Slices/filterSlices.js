import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStatuses } from '../../Services/rootServices';
import { handleReqsList, handleAllItems, RsetActiveTab } from '../Slices/mainSlices';

const initialState = {
  serialFilter: "",
  userFilter: "",
  statusFilter: "",
  fromDateFilter: null,
  toDateFilter: null,
  realFilter: false,
  statusOptions: [],
  filterData: [],
  membersOption: [],
  yearFilter: '',
  depFilter: '',
  depOptions: [],
  showFilter: false,
  typeFilter: '',

  //irantoolMachine
  irantoolRealFilter: false,
  machineCategory: "",
  machineCode: "",
  machineNumOfShift: "",

  //checkout
  checkoutFilterSerial: "",
  checkoutFilterUser: "",
  checkoutFilterLeavingReason: "",
  checkoutFilterDepartment: "",
  checkoutFilterCompany: "",
  checkoutFilterStatus: "",
  checkoutFilterFromDate: null,
  checkoutFilterToDate: null,
};

export const handleAllStatuses = createAsyncThunk(
  "filter/handleAllStatuses",
  async (type, { dispatch, getState }) => {
    try {
      const statusesRes = await getAllStatuses(type);
      if (statusesRes.data.code === 415) {
        dispatch(RsetStatusOptions(statusesRes.data.list));
      } else {
        dispatch(RsetStatusOptions(''));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleCancelFilter = createAsyncThunk(
  "filter/handleCancelFilter",
  async (type, { dispatch, getState }) => {
    dispatch(RsetRealFilter(false));
    dispatch(RsetSerialFilter(''));
    dispatch(RsetUserFilter(''));
    dispatch(RsetStatusFilter(''));
    dispatch(RsetFromDateFilter(null));
    dispatch(RsetToDateFilter(null));
    dispatch(RsetShowFilter(false));
    dispatch(RsetActiveTab(''));
    if (type === 'leave') {
      dispatch(RsetYearFilter(''));
      const filterParams = {
        applicantId: localStorage.getItem('id'),
        serial: '',
        memberId: '',
        status: '',
        fromDate: 'null',
        toDate: 'null',
        year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
        type: 4,
        all: 0
      }
      dispatch(handleReqsList(filterParams));
    } else if (type === 'warehouse') {
      dispatch(RsetDepFilter(''));
      const filterValues = {
        applicantId: localStorage.getItem('id'),
        memberId: '',
        mDep: '',
        status: '',
        fromDate: 'null',
        toDate: 'null',
        type: 2,
        all: 0
      }
      dispatch(handleReqsList(filterValues));
    } else if (type === 'purchase') {
      const filterValues = {
        applicantId: localStorage.getItem('id'),
        memberId: '',
        serial: '',
        status: '',
        fromDate: 'null',
        toDate: 'null',
        type: 9,
        all: 0
      }
      dispatch(handleReqsList(filterValues));
    } else if (type === 'purchaseItems') {
      const filterValues = {
        memberId: '',
        serial: '',
        invCode: '',
        status: '',
        fromDate: 'null',
        toDate: 'null',
      }
      dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
    }
  }
);


export const handleTabs = createAsyncThunk(
  "filter/handleTabs",
  async (type, { dispatch, getState }) => {
    const { activeTab } = getState().mainHome;
    if (activeTab === "myReqs") {
      return 2;
    } else if (activeTab === "inProcessReqs") {
      return 0;
    } else if (activeTab === "allReqs") {
      return 1;
    }
  }
);


const filterSlices = createSlice({
  name: "filter",
  initialState,
  reducers: {
    RsetSerialFilter: (state, { payload }) => {
      return { ...state, serialFilter: payload };
    },
    RsetUserFilter: (state, { payload }) => {
      return { ...state, userFilter: payload };
    },
    RsetStatusFilter: (state, { payload }) => {
      return { ...state, statusFilter: payload };
    },
    RsetFromDateFilter: (state, { payload }) => {
      return { ...state, fromDateFilter: payload };
    },
    RsetToDateFilter: (state, { payload }) => {
      return { ...state, toDateFilter: payload };
    },
    RsetRealFilter: (state, { payload }) => {
      return { ...state, realFilter: payload };
    },
    RsetStatusOptions: (state, { payload }) => {
      return { ...state, statusOptions: payload };
    },
    RsetFilterData: (state, { payload }) => {
      return { ...state, filterData: payload };
    },
    RsetYearFilter: (state, { payload }) => {
      return { ...state, yearFilter: payload };
    },
    RsetMachineCategory: (state, { payload }) => {
      return { ...state, machineCategory: payload };
    },
    RsetMachineCode: (state, { payload }) => {
      return { ...state, machineCode: payload };
    },
    RsetMachineNumOfShift: (state, { payload }) => {
      return { ...state, machineNumOfShift: payload };
    },
    RsetIrantoolRealFilter: (state, { payload }) => {
      return { ...state, irantoolRealFilter: payload };
    },
    RsetDepFilter: (state, { payload }) => {
      return { ...state, depFilter: payload };
    },
    RsetDepOptions: (state, { payload }) => {
      return { ...state, depOptions: payload };
    },
    RsetShowFilter: (state, { payload }) => {
      return { ...state, showFilter: payload };
    },
    RsetTypeFilter: (state, { payload }) => {
      return { ...state, typeFilter: payload };
    },
    //checkout
    RsetCheckoutFilterSerial: (state, { payload }) => {
      return { ...state, checkoutFilterSerial: payload };
    },
    RsetCheckoutFilterUser: (state, { payload }) => {
      return { ...state, checkoutFilterUser: payload };
    },
    RsetCheckoutFilterLeavingReason: (state, { payload }) => {
      return { ...state, checkoutFilterLeavingReason: payload };
    },
    RsetCheckoutFilterDepartment: (state, { payload }) => {
      return { ...state, checkoutFilterDepartment: payload };
    },
    RsetCheckoutFilterCompany: (state, { payload }) => {
      return { ...state, checkoutFilterCompany: payload };
    },
    RsetCheckoutFilterStatus: (state, { payload }) => {
      return { ...state, checkoutFilterStatus: payload };
    },
    RsetCheckoutFilterFromDate: (state, { payload }) => {
      return { ...state, checkoutFilterFromDate: payload };
    },
    RsetCheckoutFilterToDate: (state, { payload }) => {
      return { ...state, checkoutFilterToDate: payload };
    },
  },
});

export const {
  RsetSerialFilter,
  RsetUserFilter,
  RsetStatusFilter,
  RsetFromDateFilter,
  RsetToDateFilter,
  RsetRealFilter,
  RsetStatusOptions,
  RsetFilterData,
  RsetMembersOption,
  RsetYearFilter,
  RsetMachineCategory,
  RsetMachineCode,
  RsetMachineNumOfShift,
  RsetIrantoolRealFilter,
  RsetDepFilter,
  RsetDepOptions,
  RsetShowFilter,
  RsetTypeFilter,
  //checkout
  RsetCheckoutFilterSerial,
  RsetCheckoutFilterUser,
  RsetCheckoutFilterLeavingReason,
  RsetCheckoutFilterDepartment,
  RsetCheckoutFilterCompany,
  RsetCheckoutFilterStatus,
  RsetCheckoutFilterFromDate,
  RsetCheckoutFilterToDate,
} = filterSlices.actions;

export const selectSerialFilter = (state) => state.filter.serialFilter;
export const selectUserFilter = (state) => state.filter.userFilter;
export const selectStatusFilter = (state) => state.filter.statusFilter;
export const selectFromDateFilter = (state) => state.filter.fromDateFilter;
export const selectToDateFilter = (state) => state.filter.toDateFilter;
export const selectRealFilter = (state) => state.filter.realFilter;
export const selectStatusOptions = (state) => state.filter.statusOptions;
export const selectFilterData = (state) => state.filter.filterData;
export const selectMembersOption = (state) => state.filter.membersOption;
export const selectYearFilter = (state) => state.filter.yearFilter;
export const selectMachineCategory = (state) => state.filter.machineCategory;
export const selectMachineCode = (state) => state.filter.machineCode;
export const selectMachineNumOfShift = (state) => state.filter.machineNumOfShift;
export const selectIrantoolRealFilter = (state) => state.filter.irantoolRealFilter;
export const selectDepFilter = (state) => state.filter.depFilter;
export const selectDepOptions = (state) => state.filter.depOptions;
export const selectShowFilter = (state) => state.filter.showFilter;
export const selectTypeFilter = (state) => state.filter.typeFilter;

//checkout

export const selectCheckoutFilterSerial = (state) =>
  state.filterList.checkoutFilterSerial;
export const selectCheckoutFilterUser = (state) =>
  state.filterList.checkoutFilterUser;
export const selectCheckoutFilterLeavingReason = (state) =>
  state.filterList.checkoutFilterLeavingReason;
export const selectCheckoutFilterDepartment = (state) =>
  state.filterList.checkoutFilterDepartment;
export const selectCheckoutFilterCompany = (state) =>
  state.filterList.checkoutFilterCompany;
export const selectCheckoutFilterStatus = (state) =>
  state.filterList.checkoutFilterStatus;
export const selectCheckoutFilterFromDate = (state) =>
  state.filterList.checkoutFilterFromDate;
export const selectCheckoutFilterToDate = (state) =>
  state.filterList.checkoutFilterToDate;

export default filterSlices.reducer;
