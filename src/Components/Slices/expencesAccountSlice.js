import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
  name: "",
  lastName: "",
  isDisabled: false,
  switchExAc: true,
  desExAc: "",
  desExAcTable: "",
  dateExAc: null,
  dateExAcTable: null,
  fileManager: "",
  expensesNumb: '',
  listItems: [],
  filterItems: false,
  itemId: "",
  reqFiles: [],
  formErrors: {},
  expensesTable: null,
  fromPlace: "",
};

const expensesAccountSlice = createSlice({
  name: "expenseAccount",
  initialState,
  reducers: {
    RsetNameExAc: (state, { payload }) => {
      return { ...state, name: payload };
    },
    RsetFilterItems: (state, { payload }) => {
      return { ...state, filterItems: payload };
    },
    RsetLastNameExAc: (state, { payload }) => {
      return { ...state, lastName: payload };
    },
    RsetIsDisabled: (state, { payload }) => {
      return { ...state, isDisabled: payload };
    },
    RsetSwitchExAc: (state, { payload }) => {
      return { ...state, switchExAc: payload };
    },
    RsetDesExAc: (state, { payload }) => {
      return { ...state, desExAc: payload };
    },
    RsetDateExAc: (state, { payload }) => {
      return { ...state, dateExAc: payload };
    },
    RsetFileManager: (state, { payload }) => {
      return { ...state, fileManager: payload };
    },
    RsetExpensesNumb: (state, { payload }) => {
      return { ...state, expensesNumb: payload };
    },
    RsetListItems: (state, { payload }) => {
      return { ...state, listItems: payload };
    },
    RsetDesExAcTable: (state, { payload }) => {
      return { ...state, desExAcTable: payload };
    },
    RsetDateExAcTable: (state, { payload }) => {
      return { ...state, dateExAcTable: payload };
    },
    RsetItemId: (state, { payload }) => {
      return { ...state, itemId: payload };
    },
    RsetReqFiles: (state, { payload }) => {
      return { ...state, reqFiles: payload };
    },
    RsetErrorForms: (state, { payload }) => {
      return { ...state, formErrors: payload };
    },
    RsetExpensesTable: (state, { payload }) => {
      return { ...state, expensesTable: payload };
    },
    RsetFromPlace: (state, { payload }) => {
      return { ...state, fromPlace: payload };
    },
  },
  extraReducers: {},
});

export const {
  RsetNameExAc,
  RsetLastNameExAc,
  RsetSwitchExAc,
  RsetDesExAc,
  RsetDateExAc,
  RsetFileManager,
  RsetExpensesNumb,
  RsetListItems,
  RsetDesExAcTable,
  RsetDateExAcTable,
  RsetFilterItems,
  RsetItemId,
  RsetReqFiles,
  RsetErrorForms,
  RsetExpensesTable,
  RsetFromPlace,
} = expensesAccountSlice.actions;
export const SelectName = (state) => state.expenseAccount.name;
export const SelectLastName = (state) => state.expenseAccount.lastName;
export const selectIsDisabled = (state) => state.expenseAccount.isDisabled;
export const selectSwitchExAc = (state) => state.expenseAccount.switchExAc;
export const selectDesExAc = (state) => state.expenseAccount.desExAc;
export const selectDateExAc = (state) => state.expenseAccount.dateExAc;
export const selectFileManager = (state) => state.expenseAccount.fileManager;
export const selectExpensesNumb = (state) => state.expenseAccount.expensesNumb;
export const selectListItems = (state) => state.expenseAccount.listItems;
export const selectDesExAcTable = (state) => state.expenseAccount.desExAcTable;
export const selectFilterItems = (state) => state.expenseAccount.filterItems;
export const selectItemId = (state) => state.expenseAccount.itemId;
export const selectReqFiles = (state) => state.expenseAccount.reqFiles;
export const selectFormErrors = (state) => state.expenseAccount.formErrors;
export const selectFromPlace = (state) => state.expenseAccount.fromPlace;
export const selectExpensesTable = (state) =>
  state.expenseAccount.expensesTable;

export const selectDateExAcTable = (state) =>
  state.expenseAccount.dateExAcTable;

export default expensesAccountSlice.reducer;
