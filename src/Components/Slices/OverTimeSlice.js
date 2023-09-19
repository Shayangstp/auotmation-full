import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOverTimeReason, postOverTime, editOverTimeReq } from "../../Services/r-ghanavatian/overTime";
import { postAction } from "../../Services/r-ghanavatian/mainApi";
import { errorMessage, successMessage } from "../../utils/message";
import { RsetActionToPersonsModal, handleReqsList, RsetDescriptionModals, RsetRealFilter } from '../Slices/mainSlices'
import { checkDate } from "../../Services/r-ghanavatian/tableListServices";
import { getToPersonByRole } from '../../Services/rootServices';
import { RsetCurrentReqInfo } from "./currentReqSlice";
import { RsetAcceptReqModal, RsetNextAcceptReqModal, RsetEditReqModal } from "./modalsSlice";
const initialState = {
  des: "",
  formErrors: {},
  overTimeReason: [],
  overTimeReasonValue: '',
  showFields: false,
  requestLists: [],
  userInfoModal: false,
  fromDate: null,
  toDate: null,
  status: [],
  dep: [],
  userRequestFilter: [],

  showFieldsExAc: false,
  showFieldsOvTi: false,
  fromDateEditModal: null,
  toDateEditModal: null,
  descriptionEditModal: "",
  overTimeReasonEditModal: {},
};

// لیست  نوع اضافه کار
export const handleReasonOvertime = createAsyncThunk(
  "overTime/handleReasonOvertime",
  async () => {
    try {
      const overTimeRes = await getOverTimeReason();
      if (overTimeRes.data.length !== undefined && overTimeRes.data.length !== 0) {
        return overTimeRes.data;
      } else {
        errorMessage("لیست  نوع اضافه کار یافت نشد.");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// ثبت درخواست اضافه کار
export const handleApplyUserOverTime = createAsyncThunk(
  "overTime/handleApplyUserOverTime",
  async (obj, { dispatch, getState }) => {
    try {
      const { overTimeReasonValue, fromDate, toDate, des } = getState().overTime;
      const values = {
        reason: overTimeReasonValue.value,
        fromDate: fromDate,
        toDate: toDate,
        description: des,
      };
      const applyRes = await postOverTime(values);
      if (applyRes.data.code === 415) {
        const id = {
          reqInfo: {
            _id: applyRes.data.id
          }
        }
        dispatch(RsetCurrentReqInfo(id));
        const actions = {
          actionId: applyRes.data.id,
          actionCode: 0,
          userId: localStorage.getItem("id"),
          typeId: 14,
        };
        const applyActionsRes = await postAction(actions);
        if (applyActionsRes.data.code === 415) {
          dispatch(RsetActionToPersonsModal(true));
          successMessage('درخواست با موفقیت ثبت شد!');
        } else {
          errorMessage('خطا!');
        }
      } else {
        errorMessage('خطا در ثبت اطلاعات درخواست!')
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleResetOvertimeForm = createAsyncThunk(
  "overTime/handleResetOvertimeForm",
  (obj, { dispatch }) => {
    dispatch(RsetOverTimeReasonValue(''));
    dispatch(RsetFromDate(null));
    dispatch(RsetToDate(null));
    dispatch(RsetDescriptions(''));
    dispatch(RsetFormErrors({}));
    const sendToPersons = document.getElementById('sendToPersons');
    const confirmReq = document.getElementById('confirmReq');
    if (sendToPersons !== null) {
      sendToPersons.classList.add('disabled');
    }
    if (confirmReq !== null) {
      confirmReq.classList.remove('disabled');
    }
  }
);

// Reset overtime filter
export const handleResetOverTimeFilter = createAsyncThunk(
  "overTime/handleResetOverTimeFilter",
  (obj, { dispatch }) => {
    dispatch(RsetUserListValue(""));
    dispatch(RsetDepartemant(""));
    dispatch(RsetStatus(""));
    dispatch(RsetFromDate(null));
    dispatch(RsetToDate(null));
    dispatch(RsetRealFilter(false));
    const filterValues = {
      applicantId: localStorage.getItem("id"),
      memberId: '',
      mDep: '',
      status: '',
      fromDate: 'null',
      toDate: 'null',
      type: 14,
      group: 0
    };
    dispatch(handleReqsList(filterValues));
  }
);

// -> send overtime req to manager
export const handleSendOverTimeReqToManager = createAsyncThunk(
  "overTime/handleSendOverTimeReqToManager",
  async (obj, { dispatch, getState }) => {
    try {
      const { userLogin } = getState().mainHome;
      const { currentReqInfo } = getState().currentReq;
      const postCheckDateRes = await checkDate(currentReqInfo.process[currentReqInfo.process.length - 1]._id, currentReqInfo.reqInfo._id, 14);
      const desModals = getState().mainHome.descriptionModals;
      if (postCheckDateRes.data.type === "accepted") {
        const actions = {
          actionId: currentReqInfo.reqInfo._id,
          actionCode: 20,
          userId: localStorage.getItem("id"),
          toPersons: [userLogin.supervisor._id],
          typeId: 14,
          comment: desModals
        };
        const applyActionsRes = await postAction(actions);
        if (applyActionsRes.data.code === 415) {
          dispatch(RsetNextAcceptReqModal(false));
          successMessage('درخواست با موفقیت تایید شد!');
          dispatch(RsetDescriptionModals(""));
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            memberId: '',
            mDep: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            type: 14,
            group: 0
          };
          dispatch(handleReqsList(filterValues));
        } else {
          dispatch(RsetNextAcceptReqModal(false));
          errorMessage('خطا!');
          dispatch(RsetDescriptionModals(""));
        }
      } else {
        dispatch(RsetNextAcceptReqModal(false));
        errorMessage('وضعیت درخواست تغییر کرده است!');
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          memberId: '',
          mDep: '',
          status: '',
          fromDate: 'null',
          toDate: 'null',
          type: 14,
          group: 0
        };
        dispatch(handleReqsList(filterValues));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// -> send overtime req to office
export const handleSendOverTimeReqToOffice = createAsyncThunk(
  "overTime/handleSendOverTimeReqToOffice",
  async (obj, { dispatch, getState }) => {
    try {
      const { userLogin } = getState().mainHome;
      const { currentReqInfo } = getState().currentReq;
      const desModals = getState().mainHome.descriptionModals;
      const postCheckDateRes = await checkDate(currentReqInfo.process[currentReqInfo.process.length - 1]._id, currentReqInfo.reqInfo._id, 14);
      if (postCheckDateRes.data.type === "accepted") {
        const toPersonsRes = await getToPersonByRole('66, 19', userLogin.location, userLogin.company.CompanyCode, 1, null, '0');
        const desModals = getState().mainHome.descriptionModals;
        if (toPersonsRes.data.code === 415) {
          var toPersonsArr = [];
          toPersonsRes.data.list.map(async (person) => {
            toPersonsArr.push(person.value)
          })
          const actions = {
            actionId: currentReqInfo.reqInfo._id,
            actionCode: 21,
            userId: localStorage.getItem("id"),
            toPersons: toPersonsArr,
            typeId: 14,
            comment: desModals
          };
          const applyActionsRes = await postAction(actions);
          if (applyActionsRes.data.code === 415) {
            dispatch(RsetNextAcceptReqModal(false));
            dispatch(RsetAcceptReqModal(false));
            dispatch(RsetDescriptionModals(""));
            successMessage('درخواست با موفقیت تایید شد!');
            const filterValues = {
              applicantId: localStorage.getItem("id"),
              memberId: '',
              mDep: '',
              status: '',
              fromDate: 'null',
              toDate: 'null',
              type: 14,
              group: 0
            };
            dispatch(handleReqsList(filterValues));
          } else {
            dispatch(RsetNextAcceptReqModal(false));
            errorMessage('خطا!');
            dispatch(RsetDescriptionModals(""));
          }
        } else {
          dispatch(RsetNextAcceptReqModal(false));
          errorMessage('شخص دریافت کننده ای یافت نشد!')
        }
      } else {
        dispatch(RsetNextAcceptReqModal(false));
        errorMessage('وضعیت درخواست تغییر کرده است!');
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          memberId: '',
          mDep: '',
          status: '',
          fromDate: 'null',
          toDate: 'null',
          type: 14,
          comment: desModals,
          group: 0
        };
        dispatch(handleReqsList(filterValues));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
// -> overtime req last accept
export const handleOverTimeLastAccept = createAsyncThunk(
  "overTime/handleOverTimeLastAccept",
  async (obj, { dispatch, getState }) => {
    try {
      const { currentReqInfo } = getState().currentReq;
      const postCheckDateRes = await checkDate(currentReqInfo.process[currentReqInfo.process.length - 1]._id, currentReqInfo.reqInfo._id, 14);
      const desModals = getState().mainHome.descriptionModals;
      if (postCheckDateRes.data.type === "accepted") {
        const actions = {
          actionId: currentReqInfo.reqInfo._id,
          actionCode: 1,
          userId: localStorage.getItem("id"),
          typeId: 14,
          comment: desModals
        };
        const applyActionsRes = await postAction(actions);
        if (applyActionsRes.data.code === 415) {
          dispatch(RsetAcceptReqModal(false));
          dispatch(RsetDescriptionModals(""));
          successMessage('درخواست با موفقیت تایید شد!');
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            memberId: '',
            mDep: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            type: 14,
            group: 0
          };
          dispatch(handleReqsList(filterValues));
        } else {
          dispatch(RsetNextAcceptReqModal(false));
          errorMessage('خطا!');
        }
      } else {
        dispatch(RsetAcceptReqModal(false));
        errorMessage('وضعیت درخواست تغییر کرده است!');
        const filterValues = {
          applicantId: localStorage.getItem("id"),
          memberId: '',
          mDep: '',
          status: '',
          fromDate: 'null',
          toDate: 'null',
          type: 14,
          group: 0
        };
        dispatch(handleReqsList(filterValues));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

// -> edit overtime req
export const handleEditReqOverTime = createAsyncThunk(
  "overTime/handleEditReqOverTime",
  async (obj, { dispatch, getState }) => {
    try {
      const { fromDateEditModal, toDateEditModal, descriptionEditModal, overTimeReasonEditModal } = getState().overTime;
      const { currentReqInfo } = getState().currentReq;
      const values = {
        reason: overTimeReasonEditModal.value,
        fromDate: fromDateEditModal,
        toDate: toDateEditModal,
        description: descriptionEditModal,
      };
      const editOverTimeRes = await editOverTimeReq(currentReqInfo.reqInfo._id, values);
      if (editOverTimeRes.data.code === 415) {
        successMessage("درخواست شما با موفقیت ویرایش شد.")
        const filterParams = {
          applicantId: localStorage.getItem("id"),
          memberId: '',
          mDep: '',
          status: '',
          fromDate: 'null',
          toDate: 'null',
          type: 14,
          group: 0
        }
        dispatch(handleReqsList(filterParams));
        dispatch(RsetEditReqModal(false));
        dispatch(RsetActionToPersonsModal(true));
      } else {
        errorMessage("ویرایش درخواست شما ناموفق بود.")
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

const OverTimeSlice = createSlice({
  name: "overTime",
  initialState,
  reducers: {
    RsetFormErrors: (state, { payload }) => {
      return { ...state, formErrors: payload };
    },
    RsetFromDate: (state, { payload }) => {
      return { ...state, fromDate: payload };
    },
    RsetToDate: (state, { payload }) => {
      return { ...state, toDate: payload };
    },
    RsetDescriptions: (state, { payload }) => {
      return { ...state, des: payload };
    },
    RsetOverTimeReasonValue: (state, { payload }) => {
      return { ...state, overTimeReasonValue: payload };
    },
    RsetDisable: (state, { payload }) => {
      return { ...state, showFields: payload };
    },
    RsetUserInfoModals: (state, { payload }) => {
      return { ...state, userInfoModal: payload };
    },
    RsetStatus: (state, { payload }) => {
      return { ...state, status: payload };
    },
    RsetDepartemant: (state, { payload }) => {
      return { ...state, dep: payload };
    },
    RsetUserListValue: (state, { payload }) => {
      return { ...state, userRequestFilter: payload };
    },
    RsetCurrentReqId: (state, { payload }) => {
      return { ...state, currentReqId: payload };
    },
    RsetHistoryOverTimeModal: (state, { payload }) => {
      return { ...state, historyOverTime: payload };
    },
    RsetFromDateEditModal: (state, { payload }) => {
      return { ...state, fromDateEditModal: payload };
    },
    RsetToDateEditModal: (state, { payload }) => {
      return { ...state, toDateEditModal: payload };
    },
    RsetDescriptionEditModal: (state, { payload }) => {
      return { ...state, descriptionEditModal: payload };
    },
    RsetOverTimeReasonEditModal: (state, { payload }) => {
      return { ...state, overTimeReasonEditModal: payload };
    },
  },
  extraReducers: {
    [handleReasonOvertime.fulfilled]: (state, { payload }) => {
      return { ...state, overTimeReason: payload };
    },
  },
});

export const {
  RsetFromDate,
  RsetToDate,
  RsetDescriptions,
  RsetOverTimeReasonValue,
  RsetFormErrors,
  RsetDisable,
  RsetUserInfoModals,
  addUserRequest,
  RsetUserCheckoutTables,
  RsetStatus,
  RsetDepartemant,
  RsetUserListValue,
  RsetCurrentReqId,
  RsetFromDateEditModal,
  RsetToDateEditModal,
  RsetDescriptionEditModal,
  RsetOverTimeReasonEditModal,
} = OverTimeSlice.actions;

export const selectDepartmant = (state) => state.overTime.dep;
export const selectOverTimeReason = (state) => state.overTime.overTimeReason;
export const selectStartDate = (state) => state.overTime.fromDate;
export const selectEndDate = (state) => state.overTime.toDate;
export const selectDescription = (state) => state.overTime.des;
export const selectFormErrors = (state) => state.overTime.formErrors;
export const selectShowFields = (state) => state.overTime.showFields;
export const selectStatus = (state) => state.overTime.status;

export const selectUserRequestFilter = (state) =>
  state.overTime.userRequestFilter;
export const selectRequestLists = (state) => state.overTime.requestLists;

export const selectUserInfoModal = (state) => state.overTime.userInfoModal;

// -> select overtime edit modal
export const selectFromDateEditModal = (state) => state.overTime.fromDateEditModal;
export const selectToDateEditModal = (state) => state.overTime.toDateEditModal;
export const selectDescriptionEditModal = (state) => state.overTime.descriptionEditModal;
export const selectOverTimeReasonEditModal = (state) => state.overTime.overTimeReasonEditModal;

export const selectOverTimeReasonValue = (state) =>
  state.overTime.overTimeReasonValue;
export default OverTimeSlice.reducer;
