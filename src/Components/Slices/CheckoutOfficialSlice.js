import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsersByPersonalCode,
  getReasonLeavingWork,
  patchEditCheckout,
} from "../../Services/r-ghanavatian/checkout";
import { checkDate } from "../../Services/r-ghanavatian/tableListServices";
import { errorMessage, successMessage } from "../../utils/message";
import { RsetDescriptionModals } from "./mainSlices";

const initialState = {
  reasonLeavingData: [],
  reasonLeavingOffice: [],
  reasonLeavingModal: {},
  reasonLeavingTable: {},
  userName: {},
  personalCode: "",
  meliCode: "",
  description: "",
  allUserNames: [],
  isSubmit: false,
  applyModal: false,
  leavingWorkDate: null,
};

export const handleReasonLeavingWork = createAsyncThunk(
  "checkout/handleReasonLeavingWork",
  async () => {
    try {
      const reasonLeavingRes = await getReasonLeavingWork();
      return reasonLeavingRes.data;
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleUsersCheckout = createAsyncThunk(
  "checkout/handleUsersCheckout",
  async (obj, { getState }) => {
    const { userLogin } = getState().mainHome;
    try {
      const resAllUsers = await getAllUsersByPersonalCode(
        userLogin.company.companyCode,
        userLogin.location
      );
      return resAllUsers.data;
    } catch (ex) {
      console.log(ex);
    }
  }
);

//  Edit post
//ip/settlement/{request id}, {leaver: "", leavingWorkDate: "", leavingWorkCause: ""}
export const handlePostEdit = createAsyncThunk(
  "checkout/handlePostEdit",
  async (type, { getState, dispatch }) => {
    const { currentReqInfo, descriptionModals } = getState().mainHome;
    const { leavingWorkDate } = getState().checkout;
    const { leavingWorkCause } = getState().tableCheckoutList;
    const getLastActionId =
      currentReqInfo.process[currentReqInfo.process.length - 1]._id;
    const getReqId = currentReqInfo.reqInfo._id;
    const postCheckDateRes = await checkDate(getLastActionId, getReqId, type);

    if (postCheckDateRes.data.type === "accepted") {
      const reqId = currentReqInfo.reqInfo._id;
      const values = {
        description: descriptionModals,
        leavingWorkDate:
          leavingWorkDate !== null ? leavingWorkDate.format("YYYY/MM/DD") : "",
        leavingWorkCause: leavingWorkCause !== "" ? leavingWorkCause.value : "",
      };
      const editCheckoutRes = await patchEditCheckout(reqId, values);
      dispatch(RsetDescriptionModals(""));
      successMessage("درخواست شما با موفقیت ثبت شد.");
      return editCheckoutRes;
    } else {
      errorMessage("خطا متاسفانه عملیات انجام نشد، لطفا دوباره امتحان کنید!");
    }
  }
);

const CheckoutOfficialSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    RsetUsernames: (state, { payload }) => {
      return { ...state, userName: payload };
    },
    RsetReasonLeavingWork: (state, { payload }) => {
      return { ...state, reasonLeavingOffice: payload };
    },
    RsetMeliCode: (state, { payload }) => {
      return { ...state, meliCode: payload };
    },
    RsetPersonalCode: (state, { payload }) => {
      return { ...state, personalCode: payload };
    },
    RsetDescriptions: (state, { payload }) => {
      return { ...state, description: payload };
    },
    RsetApplyModal: (state, { payload }) => {
      return { ...state, applyModal: payload };
    },
    RsetReasonLeavingModal: (state, { payload }) => {
      return { ...state, reasonLeavingModal: payload };
    },
    RsetLeavingWorkDate: (state, { payload }) => {
      return { ...state, leavingWorkDate: payload };
    },
  },
  extraReducers: {
    [handleReasonLeavingWork.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        reasonLeavingData: payload,
      };
    },
    [handleUsersCheckout.fulfilled]: (state, { payload }) => {
      return { ...state, allUserNames: payload };
    },
  },
});

export const {
  RsetPersonalCode,
  RsetMeliCode,
  clearCode,
  addSubbmit,
  RsetUsernames,
  RsetDescriptions,
  RsetReasonLeavingWork,
  RsetApplyModal,
  RsetReasonLeavingModal,
  RsetLeavingWorkDate,
} = CheckoutOfficialSlice.actions;
export const selectSubmit = (state) => state.checkout.isSubmit;
export const loginInfo = (state) => state.checkout.user;
export const selectAllUserNames = (state) => state.checkout.allUserNames;
export const selectApplyModal = (state) => state.checkout.applyModal;
export const selectAllUsers = (state) => state.checkout.allUser;
export const selectUserValue = (state) => state.checkout.userName;
export const selectReasonLeavingModal = (state) =>
  state.checkout.reasonLeavingModal;

export const selectPersonalCode = (state) => state.checkout.personalCode;
export const selectLeavingWorkDate = (state) => state.checkout.leavingWorkDate;

export const selectReasonLeavingData = (state) =>
  state.checkout.reasonLeavingData;

export const selectReasonLeaving = (state) =>
  state.checkout.reasonLeavingOffice;

export const selectReasonLeavingTable = (state) =>
  state.checkout.reasonLeavingDataTable;

export const selectDescription = (state) => state.checkout.description;

export const selectMeliCode = (state) => state.checkout.meliCode;
export default CheckoutOfficialSlice.reducer;
