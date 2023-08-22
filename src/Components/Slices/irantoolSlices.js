import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  irantoolCategoryList,
  submitIrantoolReq,
  getIrantoolList,
  editIrantoolMachine,
  irantoolPostAction,
  irantoolChangeOperationUnit,
  irantoolOperationUnitList,
  irantoolOperationList,
  irantoolChangeOperations,
  irantoolReasonOfDelayList,
  irantoolChangeReasonOfDelay
} from "../../Services/irantolJobReqServices";
import { RsetLoading, RsetAddRole } from "./mainSlices";
import { getToPersonByRole } from '../../Services/rootServices';
import { errorMessage, successMessage } from "../../utils/message";
import { RsetCurrentReqInfo } from "../Slices/currentReqSlice";
import { RsetRealFilter } from "./filterSlices";
import { RsetMachineCategory, RsetMachineCode, RsetMachineNumOfShift } from "./filterSlices";

const initialState = {
  irantoolCategory: "",
  irantoolCategoryOptions: [],
  irantoolDeviceCode: "",
  irantoolShift: "",
  irantoolWorkHours: "",
  irantoolFilterData: [],
  irantoolDeviceModal : false,
  irantoolInActiveDeviceModal: false,
  irantoolAddOperatingUnitName: '',
  irantoolOperationUnitList : [],
  irantoolUsersByRoleList : [],
  irantoolOperatorsSelect: [],
  irantoolOperatorList: [],
  irantoolOperatorOption: [],
  irantoolOperationName:'',
  irantoolOperationList: [],
  irantoolReasonOfDelayList: [],
  irantoolReasonOfDelayName: ''
};

export const handleIrantoolCategoryList = createAsyncThunk(
  "irantool/handleIrantoolCategoryList",
  async (obj, { dispatch, getState }) => {
    try {
      const irantoolCategoryListRes = await irantoolCategoryList();

      if (irantoolCategoryListRes.data.code === 415) {
        dispatch(
          RsetIrantoolCategoryOptions(irantoolCategoryListRes.data.list)
        );
      } else {
        dispatch(RsetIrantoolCategoryOptions([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleIrantoolList = createAsyncThunk(
  "irantool/handleIrantoolList",
  async (obj, { dispatch, getState }) => {
    try {
      const {
        machineCategory,
        machineCode,
        machineNumOfShift,
        irantoolRealFilter,
      } = getState().filter;
      const filterValues = {
        machineCategoryId: machineCategory.value,
        machineCode: machineCode,
        machineNumOfShift: machineNumOfShift,
      };
      const irantoolListRes = await getIrantoolList(filterValues);
      if (irantoolListRes.data.code === 415) {
        dispatch(RsetIrantoolFilterData(irantoolListRes.data.list));
      } else {
        dispatch(RsetIrantoolFilterData([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleIrantoolReqSubmit = createAsyncThunk(
  "irantool/handleIrantoolReqSubmit",
  async (e, { dispatch, getState }) => {
    e.preventDefault();
    try {
      const {
        irantoolCategory,
        irantoolDeviceCode,
        irantoolShift,
        irantoolWorkHours,
      } = getState().irantool;
      const { user } = getState().mainHome;
      const irantoolReqValues = {
        machineCode: irantoolDeviceCode,
        categoryId: irantoolCategory.value,
        numberOfShift: parseInt(irantoolShift),
        useabilityHour: parseInt(irantoolWorkHours),
      };
      const submitIrantoolReqRes = await submitIrantoolReq(irantoolReqValues);
      if (submitIrantoolReqRes.data.code === 415) {
        const logValues = {
          machineId: submitIrantoolReqRes.data.id,
          userId: localStorage.getItem("id"),
          logType: 1,
        };
        const irantoolPostActionRes = await irantoolPostAction(logValues);
        if (irantoolPostActionRes.data.code === 415) {
          successMessage("دستگاه مورد نظر با موفقیت ثبت شد!");
          dispatch(RsetIrantoolDeviceModal(false));
          dispatch(handleResetITRegister());
          dispatch(handleIrantoolList());
        } else {
          errorMessage("خطا!");
        }
      } else if (submitIrantoolReqRes.data.code === 420) {
        errorMessage("درخواست تکراری است!");
      } else {
        errorMessage("خطا!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleEditIrantoolMachine = createAsyncThunk(
  "irantool/editIrantoolMachine",
  async (obj, { dispatch, getState }) => {
    try {
      const { currentReqInfo } = getState().currentReq;
      const {
        irantoolCategory,
        irantoolDeviceCode,
        irantoolShift,
        irantoolWorkHours,
      } = getState().irantool;
      const editValue = {
        machineCode:
          currentReqInfo.machineCode !== irantoolDeviceCode
            ? irantoolDeviceCode
            : undefined,
        useabilityHour:
          currentReqInfo.useabilityHour !== irantoolWorkHours
            ? irantoolWorkHours
            : undefined,
        numberOfShift:
          currentReqInfo.numberOfShift !== irantoolShift
            ? irantoolShift
            : undefined,
        categoryId:
          currentReqInfo.categoryId !== irantoolCategory.value
            ? irantoolCategory.value
            : undefined,
      };
      const editIrantoolMachineRes = await editIrantoolMachine(
        currentReqInfo.machineId,
        editValue
      );
      if (editIrantoolMachineRes.data.code === 415) {
        var editedValue = [];
        var editedValueName = [];
        if(editValue.machineCode !== undefined){
          editedValue.push(editValue.machineCode)
          editedValueName.push('machineCode')
        }
        if(editValue.useabilityHour !== undefined){
          editedValue.push(editValue.useabilityHour)
          editedValueName.push('useabilityHour')
        }
        if(editValue.numberOfShift !== undefined){
          editedValue.push(editValue.machineCode)
          editedValueName.push('machineCode')
        }
        if(editValue.categoryId !== undefined){
          editedValue.push(editValue.categoryId)
          editedValueName.push('categoryId')
        }
        const logValue = {
          machineId: currentReqInfo.machineId,
          userId: localStorage.getItem("id"),
          logType: 3,
          editedValue: String(editedValue),
          editedValueName: String(editedValueName),
        };
        const irantoolPostActionRes = await irantoolPostAction(logValue);
        if (irantoolPostActionRes.data.code === 415) {
          successMessage("ویرایش با موفقیت انجام شد!");
          dispatch(RsetCurrentReqInfo(""));
          dispatch(RsetIrantoolDeviceModal(false));
          dispatch(handleIrantoolList());
          dispatch(handleResetITRegister());
        } else {
          errorMessage("خطا!");
        }
      } else if(editIrantoolMachineRes.data.code === 420){
        errorMessage('کد دستگاه تکراری است!')
      }else {
        errorMessage("خطا!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleInActiveIrantoolMachine = createAsyncThunk(
  "irantool/handleInActiveIrantoolMachine",
  async (obj, { dispatch, getState }) => {
    try {
      const { currentReqInfo } = getState().currentReq;
      const enableValue = {
        enable: currentReqInfo.enable !== "1" ? "0" : undefined,
      };
      const editIrantoolMachineRes = await editIrantoolMachine(
        currentReqInfo.machineId,
        enableValue
      );
      if (editIrantoolMachineRes.data.code === 415) {
        const logValue = {
          machineId: currentReqInfo.machineId,
          userId: localStorage.getItem("id"),
          logType: 2,
        };
        const irantoolPostActionRes = await irantoolPostAction(logValue);

        dispatch(RsetIrantoolInActiveDeviceModal(false));
        dispatch(RsetCurrentReqInfo(""));
        dispatch(handleIrantoolList());
      } else {
        errorMessage("خطا!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleResetITRegister = createAsyncThunk(
  "irantool/handleResetITRegister",
  (obj, { dispatch, getState }) => {
    dispatch(RsetIrantoolCategory(""));
    dispatch(RsetIrantoolDeviceCode(""));
    dispatch(RsetIrantoolShift(""));
    dispatch(RsetIrantoolWorkHours(""));
  }
);
export const handleResetITFilter = createAsyncThunk(
  "irantool/handleResetITFilter",
  (obj, { dispatch, getState }) => {
    dispatch(RsetRealFilter(false));
    dispatch(RsetMachineCategory(""));
    dispatch(RsetMachineCode(""));
    dispatch(RsetMachineNumOfShift(""));
    dispatch(handleIrantoolList());
  }
);

// base info
export const handleChangeOperationUnit = createAsyncThunk(
  "irantool/handleChangeOperationUnit",
  async (changedValues, { dispatch }) => {
    dispatch(RsetLoading(true));
    try {
      const changeOperationUnitRes = await irantoolChangeOperationUnit(changedValues);
      if (changeOperationUnitRes.data.code === 415) {
        dispatch(RsetLoading(false));
        successMessage('واحد مورد نظر با موفقیت ثبت شد!');
        dispatch(RsetIrantoolAddOperatingUnitName(''));
        dispatch(RsetAddRole(null));
        dispatch(handleOperationUnitList());
      } else if(changeOperationUnitRes.data.code === 420){
        errorMessage("واحد تکراری است!");
        dispatch(RsetLoading(false));
      }else {
        errorMessage("خطا!");
        dispatch(RsetLoading(false));
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);
export const handleOperationUnitList = createAsyncThunk(
  "irantool/handleOperationUnitList",
  async (obj, { dispatch, getState }) => {
    try {
      const operationUnitListRes = await irantoolOperationUnitList();
      if (operationUnitListRes.data.code === 415) {
        dispatch(RsetIrantoolOperationUnitList(operationUnitListRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetIrantoolOperationUnitList([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleOperatorOptions = createAsyncThunk(
  "irantool/handleOperatorOptions",
  async (exist, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;
      const operatorRes = await getToPersonByRole('2', user.Location, user.CompanyCode, exist, null, '0');
      if (operatorRes.data.code === 415) {
        dispatch(RsetIrantoolOperatorOption(operatorRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetIrantoolOperatorOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleOperatorList = createAsyncThunk(
  "irantool/handleOperatorList",
  async (obj, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;
      const operatorRes = await getToPersonByRole('2', user.Location, user.CompanyCode, 1, null, '0');
      if (operatorRes.data.code === 415) {
        dispatch(RsetIrantoolOperatorList(operatorRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetIrantoolOperatorList([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleOperationList = createAsyncThunk(
  "irantool/handleOperationList",
  async (obj, { dispatch, getState }) => {
    try {
      const operationRes = await irantoolOperationList();
      if (operationRes.data.code === 415) {
        dispatch(RsetIrantoolOperationList(operationRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetIrantoolOperationList([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleChangeOperation = createAsyncThunk(
  "irantool/handleChangeOperation",
  async (changedValues, { dispatch }) => {
    dispatch(RsetLoading(true));
    try {
      const changeOperationRes = await irantoolChangeOperations(changedValues);
      if (changeOperationRes.data.code === 415) {
        dispatch(RsetLoading(false));
        successMessage('عملیات مورد نظر با موفقیت ثبت شد!');
        dispatch(RsetIrantoolOperationName(''));
        dispatch(RsetAddRole(null));
        dispatch(handleOperationList());
      } else if(changeOperationRes.data.code === 420){
        errorMessage("عملیات تکراری است!");
        dispatch(RsetLoading(false));
      }else {
        errorMessage("خطا!");
        dispatch(RsetLoading(false));
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);
export const handleIrtUsersByRole = createAsyncThunk(
  "irantool/handleIrtUsersByRole",
  async (obj, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;
      const usersByRoleRes = await getToPersonByRole('26', user.Location, user.CompanyCode, 1, null, '0');
      if (usersByRoleRes.data.code === 415) {
        dispatch(RsetIrantoolUsersByRoleList(usersByRoleRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetIrantoolUsersByRoleList([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleReasonOfDelayList = createAsyncThunk(
  "irantool/handleReasonOfDelayList",
  async (obj, { dispatch, getState }) => {
    try {
      const reasonOfDelayRes = await irantoolReasonOfDelayList();
      if (reasonOfDelayRes.data.code === 415) {
        dispatch(RsetIrantoolReasonOfDelayList(reasonOfDelayRes.data.list));
      } else {
        errorMessage("اطلاعات یافت نشد!");
        dispatch(RsetIrantoolReasonOfDelayList([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleChangeReasonOfDelay = createAsyncThunk(
  "irantool/handleChangeReasonOfDelay",
  async (changedValues, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    try {
      const changeReasonOfDelayRes = await irantoolChangeReasonOfDelay(changedValues);
      if (changeReasonOfDelayRes.data.code === 415) {
        dispatch(RsetLoading(false));
        successMessage('عملیات مورد نظر با موفقیت ثبت شد!');
        dispatch(RsetIrantoolReasonOfDelayName(''));
        dispatch(RsetAddRole(null));
        dispatch(handleReasonOfDelayList());
      } else {
        errorMessage("خطا!");
        dispatch(RsetLoading(false));
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);

const irantoolSlice = createSlice({
  name: "irantool",
  initialState,
  reducers: {
    RsetIrantoolCategory: (state, { payload }) => {
      return { ...state, irantoolCategory: payload };
    },
    RsetIrantoolCategoryOptions: (state, { payload }) => {
      return { ...state, irantoolCategoryOptions: payload };
    },
    RsetIrantoolDeviceCode: (state, { payload }) => {
      return { ...state, irantoolDeviceCode: payload };
    },
    RsetIrantoolShift: (state, { payload }) => {
      return { ...state, irantoolShift: payload };
    },
    RsetIrantoolWorkHours: (state, { payload }) => {
      return { ...state, irantoolWorkHours: payload };
    },
    RsetIrantoolFilterData: (state, { payload }) => {
      return { ...state, irantoolFilterData: payload };
    },
    RsetIrantoolDeviceModal: (state, action) => {
      return { ...state, irantoolDeviceModal: action.payload };
    },
    RsetIrantoolInActiveDeviceModal: (state, action) => {
      return { ...state, irantoolInAvtiveDeviceModal: action.payload };
    },
    RsetIrantoolAddOperatingUnitName: (state, action) => {
      return { ...state, irantoolAddOperatingUnitName: action.payload };
    },
    RsetIrantoolOperationUnitList: (state, action) => {
      return { ...state, irantoolOperationUnitList: action.payload };
    },
    RsetIrantoolUsersByRoleList: (state, action) => {
      return { ...state, irantoolUsersByRoleList: action.payload };
    },
    RsetIrantoolOperatorList: (state, action) => {
      return { ...state, irantoolOperatorList: action.payload };
    },
    RsetIrantoolOperatorOption: (state, action) => {
      return { ...state, irantoolOperatorOption: action.payload };
    },
    RsetIrantoolOperationName: (state, action) => {
      return { ...state, irantoolOperationName: action.payload };
    },
    RsetIrantoolOperationList: (state, action) => {
      return { ...state, irantoolOperationList: action.payload };
    },
    RsetIrantoolReasonOfDelayList: (state, action) => {
      return { ...state, irantoolReasonOfDelayList: action.payload };
    },
    RsetIrantoolReasonOfDelayName: (state, action) => {
      return { ...state, irantoolReasonOfDelayName: action.payload };
    },
  },
});

export const {
  RsetIrantoolCategory,
  RsetIrantoolCategoryOptions,
  RsetIrantoolDeviceCode,
  RsetIrantoolShift,
  RsetIrantoolWorkHours,
  RsetIrantoolFilterData,
  RsetIrantoolDeviceModal,
  RsetIrantoolInActiveDeviceModal,
  RsetIrantoolAddOperatingUnitName,
  RsetIrantoolOperationUnitList,
  RsetIrantoolUsersByRoleList,
  RsetIrantoolOperatorList,
  RsetIrantoolOperatorOption,
  RsetIrantoolOperationName,
  RsetIrantoolOperationList,
  RsetIrantoolReasonOfDelayList,
  RsetIrantoolReasonOfDelayName
} = irantoolSlice.actions;

export const selectIrantoolCategory = (state) => state.irantool.irantoolCategory;
export const selectIrantoolCategoryOptions = (state) => state.irantool.irantoolCategoryOptions;
export const selectIrantoolDeviceCode = (state) => state.irantool.irantoolDeviceCode;
export const selectIrantoolShift = (state) => state.irantool.irantoolShift;
export const selectIrantoolWorkHours = (state) => state.irantool.irantoolWorkHours;
export const selectIrantoolFilterData = (state) => state.irantool.irantoolFilterData;
export const selectIrantoolDeviceModal = (state) => state.irantool.irantoolDeviceModal;
export const selectIrantoolInActiveDeviceModal = (state) => state.irantool.irantoolInAvtiveDeviceModal;
export const selectIrantoolAddOperatingUnitName = (state) => state.irantool.irantoolAddOperatingUnitName;
export const selectIrantoolOperationUnitList = (state) => state.irantool.irantoolOperationUnitList;
export const selectIrantoolUsersByRoleList = (state) => state.irantool.irantoolUsersByRoleList;
export const selectIrantoolOperatorList = (state) => state.irantool.irantoolOperatorList;
export const selectIrantoolOperatorOption = (state) => state.irantool.irantoolOperatorOption;
export const selectIrantoolOperationName = (state) => state.irantool.irantoolOperationName;
export const selectIrantoolOperationList = (state) => state.irantool.irantoolOperationList;
export const selectIrantoolReasonOfDelayList = (state) => state.irantool.irantoolReasonOfDelayList;
export const selectIrantoolReasonOfDelayName = (state) => state.irantool.irantoolReasonOfDelayName;

export default irantoolSlice.reducer;
