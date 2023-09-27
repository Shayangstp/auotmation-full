import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorMessage, successMessage } from "../../utils/message";
import {
  postAction,
  getAllDepartment,
  getToPersonByRole,
  postActionToPersons,
} from "../../Services/rootServices";
import {
  getLeavingWorkReason,
  submitCheckoutReq,
  getUserBySearch,
  checkoutDataConfirmation,
} from "../../Services/checkoutServices";
import { handleLogin, handleReqsList, RsetFormErrors } from "./mainSlices";

import {
  RsetCheckoutFilterSerial,
  RsetCheckoutFilterUser,
  RsetCheckoutFilterLeavingReason,
  RsetCheckoutFilterDepartment,
  RsetCheckoutFilterCompany,
  RsetCheckoutFilterStatus,
  RsetCheckoutFilterFromDate,
  RsetCheckoutFilterToDate,
  RsetRealFilter,
} from "./filterSlices";
import {
  RsetCurrentReqId,
  RsetCurrentReqType,
  RsetCurrentReqInfo,
} from "./currentReqSlice";
import {
  RsetCancelReqModal,
  RsetCancelReqComment,
  RsetAcceptReqModal,
  RsetAcceptReqComment,
} from "./modalsSlice";

const initialState = {
  checkoutReqPersonName: "",
  checkoutReqPersonNameOption: [],
  checkoutReqMeliCode: "",
  checkoutReqPersonalCode: "",
  checkoutReqSupervisor: "",
  checkoutReqLeavingWorkDate: null,
  checkoutReqLeavingWorkReason: "",
  checkoutReqLeavingWorkReasonOption: [],
  checkoutReqDepartment: "",
  checkoutReqCompanyName: "",
  checkoutReqDescription: "",
  checkoutSendToModal: false,
  checkoutReqActionId: "",
  checkoutReqIsSubmitted: false,
  checkoutFilterData: [],
  checkoutReqSupervisorId: "",
  //modal manager confirmation

  checkoutConEdari: "",
  checkoutConAmozesh: "",
  checkoutConHazineMali: "",
  checkoutConSandoghMali: "",
  checkoutConHoghoghDastmozdMali: "",

  checkoutConAmval: "",
  checkoutConAmvalMobile: false,
  checkoutConAmvalMashin: false,
  checkoutConAmvalMaskoni: false,

  checkoutConHardwareEmail: false,
  checkoutConSoftwareSystem: false,
  checkoutConWarehouseSystem: false,

  checkoutConDabirNumber: false,
  checkoutConDabirCellphone: false,
  checkoutConDabirOther: false,
  //modal process
  checkoutProcessModal: false,
};

export const handleUserBySearch = createAsyncThunk(
  "checkout/handleUserBySearch",
  async ({ id, natCode, personelId }, { dispatch, getState }) => {
    try {
      const getUserBySearchRes = await getUserBySearch(id, natCode, personelId);
      console.log(getUserBySearchRes);
      if (getUserBySearchRes.data.code === 415) {
        dispatch(
          RsetCheckoutReqPersonName({
            label: getUserBySearchRes.data.user.fullName,
            value: getUserBySearchRes.data.user.id,
          })
        );
        dispatch(RsetCheckoutReqMeliCode(getUserBySearchRes.data.user.natCode));
        dispatch(
          RsetCheckoutReqPersonalCode(getUserBySearchRes.data.user.personelId)
        );
        dispatch(
          RsetCheckoutReqSupervisor(getUserBySearchRes.data.user.supervisor)
        );
        dispatch(
          RsetCheckoutReqDepartment(getUserBySearchRes.data.user.deptName)
        );
        dispatch(
          RsetCheckoutReqCompanyName(getUserBySearchRes.data.user.companyName)
        );
        dispatch(
          RsetCheckoutReqSupervisorId(getUserBySearchRes.data.user.supervisorId)
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleLeavingWorkReason = createAsyncThunk(
  "checkout/handleLeavingWorkReason",
  async (obj, { dispatch, getState }) => {
    try {
      const getLeavingWorkReasonRes = await getLeavingWorkReason();
      if (getLeavingWorkReasonRes.data.code === 415) {
        dispatch(
          RsetCheckoutReqLeavingWorkReasonOption(
            getLeavingWorkReasonRes.data.list
          )
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleSubmitCheckoutReq = createAsyncThunk(
  "checkout/handleLeavingWorkReason",
  async (e, { dispatch, getState }) => {
    e.preventDefault();

    const { user } = getState().mainHome;

    const {
      checkoutReqPersonName,
      checkoutReqLeavingWorkReason,
      checkoutReqLeavingWorkDate,
      checkoutReqDescription,
    } = getState().checkout;

    const values = {
      leaverId: checkoutReqPersonName.value,
      leavingWorkCause: checkoutReqLeavingWorkReason.value,
      leavingWorkDate: checkoutReqLeavingWorkDate,
      description: checkoutReqDescription,
    };

    try {
      const submitCheckoutReqRes = await submitCheckoutReq(values);
      console.log(submitCheckoutReqRes);
      if (submitCheckoutReqRes.data.code === 415) {
        const actionValues = {
          actionCode: 0,
          actionId: submitCheckoutReqRes.data.id,
          userId: localStorage.getItem("id"),
          typeId: 10,
          toPersons: null,
          comment: null,
        };
        console.log(actionValues);
        const postActionRes = await postAction(actionValues);
        console.log(postActionRes);
        if (postActionRes.data.code === 415) {
          successMessage("درخواست مورد نظر با موفقیت ثبت شد!");
          dispatch(RsetFormErrors(""));
        }
        dispatch(RsetCurrentReqId(submitCheckoutReqRes.data.id));
        dispatch(RsetCurrentReqType(10));
        dispatch(RsetCheckoutReqActionId(submitCheckoutReqRes.data.id));
        dispatch(RsetCheckoutReqIsSubmitted(true));
      } else {
        errorMessage("خطا در ثبت درخواست!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleCheckoutReqAction = createAsyncThunk(
  "checkout/handleCheckoutReqAction",
  async (e, { dispatch, getState }) => {
    e.preventDefault();

    const { currentReqId, currentReqType } = getState().currentReq;
    const { checkoutReqSupervisorId } = getState().checkout;

    console.log(currentReqId, currentReqType);

    console.log(checkoutReqSupervisorId);

    try {
      const postActionToPersonsRes = await postActionToPersons(
        currentReqId,
        currentReqType,
        checkoutReqSupervisorId
      );

      console.log(postActionToPersonsRes);

      if (postActionToPersonsRes.data.code === 415) {
        dispatch(RsetCheckoutReqIsSubmitted(false));
        dispatch(handleFormReset());
        successMessage("درخواست با موفقیت ارسال شد!");
      } else {
        errorMessage("خطا در ارسال درخواست!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleFormReset = createAsyncThunk(
  "checkout/handleFormReset",
  async (obj, { dispatch, getState }) => {
    dispatch(RsetCheckoutReqPersonName(""));
    dispatch(RsetCheckoutReqMeliCode(""));
    dispatch(RsetCheckoutReqPersonalCode(""));
    dispatch(RsetCheckoutReqSupervisor(""));
    dispatch(RsetCheckoutReqLeavingWorkDate(null));
    dispatch(RsetCheckoutReqLeavingWorkReason(""));
    dispatch(RsetCheckoutReqDepartment(""));
    dispatch(RsetCheckoutReqCompanyName(""));
    dispatch(RsetCheckoutReqDescription(""));
  }
);
export const handleFilterReset = createAsyncThunk(
  "checkout/handleFilterReset",
  async (obj, { dispatch, getState }) => {
    dispatch(RsetCheckoutFilterSerial(""));
    dispatch(RsetCheckoutFilterUser(""));
    dispatch(RsetCheckoutFilterLeavingReason(""));
    dispatch(RsetCheckoutFilterDepartment(""));
    dispatch(RsetCheckoutFilterCompany(""));
    dispatch(RsetCheckoutFilterStatus(""));
    dispatch(RsetCheckoutFilterFromDate(null));
    dispatch(RsetCheckoutFilterToDate(null));
    dispatch(RsetRealFilter(false));
  }
);

export const handleCheckoutReqAccept = createAsyncThunk(
  "checkout/handleCheckoutReqAccept",
  async (e, { dispatch, getState }) => {
    e.preventDefault();

    try {
      const { currentReqInfo } = getState().currentReq;
      const { acceptReqComment, sendTo } = getState().modals;
      const { user } = getState().mainHome;
      const {
        checkoutConAmval,
        checkoutConAmozesh,
        checkoutConHazineMali,
        checkoutConSandoghMali,
        checkoutConHoghoghDastmozdMali,
        checkoutConEdari,
        checkoutConAmvalMobile,
        checkoutConAmvalMashin,
        checkoutConAmvalMaskoni,
        checkoutConHardwareEmail,
        checkoutConSoftwareSystem,
        checkoutConWarehouseSystem,
        checkoutConDabirNumber,
        checkoutConDabirCellphone,
        checkoutConDabirOther,
      } = getState().checkout;

      console.log(currentReqInfo.requestId);

      var actionCode = "";
      var toPersons = [];
      const sendAction = async () => {
        if (actionCode !== "") {
          const actionValues = {
            actionCode: actionCode,
            actionId: currentReqInfo.requestId,
            userId: localStorage.getItem("id"),
            toPersons: toPersons,
            typeId: 10,
            comment: acceptReqComment,
          };
          console.log(actionValues);
          const postActionRes = await postAction(actionValues);
          console.log(postActionRes);
          if (postActionRes.data.code === 415) {
            const filterValues = {
              applicantId: localStorage.getItem("id"),
              serial: "",
              memberId: "",
              status: "",
              fromDate: "null",
              toDate: "null",
              type: 10,
              mDep: "",
            };
            successMessage("عملیات با موفقیت انجام شد");
            dispatch(RsetAcceptReqModal(false));
            dispatch(RsetAcceptReqComment(""));
            dispatch(handleReqsList(filterValues));
            dispatch(handleCheckoutConfirmReset());
            dispatch(RsetFormErrors(""));
          } else {
            errorMessage("درخواست تکراری می باشد!");
            dispatch(RsetAcceptReqModal(false));
            dispatch(RsetAcceptReqComment(""));
          }
        }
      };
      if (currentReqInfo.lastActionCode === 0) {
        const getToPersonByRoleRes = await getToPersonByRole(
          "3, 17, 27, 28, 29 , 30, 31, 32, 33, 34",
          user.Location,
          user.CompanyCode,
          1,
          null
        );
        console.log(getToPersonByRoleRes);
        if (getToPersonByRoleRes.data.code === 415) {
          toPersons = getToPersonByRoleRes.data.list.map((person) => {
            return person.value;
          });
          toPersons = String(toPersons);
          actionCode = 43;
        }
        sendAction();
      } else if (
        currentReqInfo.lastActionCode === 43 &&
        currentReqInfo.acceptedRoles.split(",").length <
          String(currentReqInfo.allAcceptions)
      ) {
        toPersons = null;
        actionCode = 43;
        const values = {
          //vam amval
          belongingDebtBalance: checkoutConAmval
            ? checkoutConAmval.replaceAll(",", "")
            : undefined,
          // vam amozesh
          trainingDebtBalance: checkoutConAmozesh
            ? checkoutConAmozesh.replace(",", "")
            : undefined,
          //mali hazine vam
          expenseDebtBalance: checkoutConHazineMali
            ? checkoutConHazineMali.replace(",", "")
            : undefined,
          //mali sandoq vam
          fundDebtBalance: checkoutConSandoghMali
            ? checkoutConSandoghMali.replace(",", "")
            : undefined,
          //mali dast vam
          salaryDebtBalance: checkoutConHoghoghDastmozdMali
            ? checkoutConHoghoghDastmozdMali.replace(",", "")
            : undefined,
          // vam edari
          loanDebtBalance: checkoutConEdari
            ? checkoutConEdari.replace(",", "")
            : undefined,
          //amval checkbox
          payAndReceiveMobile: checkoutConAmvalMobile ? 1 : 0,
          payAndReceiveCar: checkoutConAmvalMashin ? 1 : 0,
          payAndReceiveHouse: checkoutConAmvalMaskoni ? 1 : 0,
          //hardware
          removeEmailAddress: checkoutConHardwareEmail ? 1 : 0,
          //software
          disableUser: checkoutConSoftwareSystem ? 1 : 0,
          //warehouse
          receivePCSystems: checkoutConWarehouseSystem ? 1 : 0,
          //dabirkhane
          removeLocalNumber: checkoutConDabirNumber ? 1 : 0,
          receivePhone: checkoutConDabirCellphone ? 1 : 0,
          controlOtherSecretarial: checkoutConDabirOther ? 1 : 0,
        };
        console.log(values);
        //the confirmation
        const checkoutDataConfirmationRes = await checkoutDataConfirmation(
          currentReqInfo.requestId,
          values
        );
        console.log(checkoutDataConfirmationRes);
        sendAction();
      } else if (
        currentReqInfo.lastActionCode === 43 &&
        (currentReqInfo.allAcceptions === currentReqInfo.acceptedRoles) !== null
          ? currentReqInfo.acceptedRoles.split(",").length
          : null
      ) {
        const getToPersonByRoleRes = await getToPersonByRole(
          "19,20",
          user.Location,
          user.CompanyCode,
          1,
          null
        );
        console.log(getToPersonByRoleRes);
        if (getToPersonByRoleRes.data.code === 415) {
          toPersons = getToPersonByRoleRes.data.list.map((person) => {
            return person.value;
          });
          toPersons = String(toPersons);
          actionCode = 21;
        }
        sendAction();
      } else if (currentReqInfo.lastActionCode === 21) {
        toPersons = null;
        actionCode = 1;
        sendAction();
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleCheckoutReqCancel = createAsyncThunk(
  "checkout/handleCheckoutReqCancel",
  async (e, { dispatch, getState }) => {
    e.preventDefault();
    try {
      const { cancelReqComment } = getState().modals;
      const { currentReqInfo } = getState().currentReq;
      const actionValues = {
        actionCode: 2,
        actionId: currentReqInfo.requestId,
        userId: localStorage.getItem("id"),
        typeId: 10,
        comment: cancelReqComment,
      };
      console.log(actionValues);
      const postActionRes = await postAction(actionValues);
      console.log(postActionRes);
      if (postActionRes.data.code === 415) {
        successMessage("درخواست با موفقیت کنسل شد!");
        dispatch(RsetCancelReqModal(false));
        //close and reload the list
        // dispatch(RsetCurrentReqInfo(""));
        // dispatch(RsetCancelReqComment(""));
        // dispatch(handleReqsList(6));
      } else {
        errorMessage("خطا در انجام عملیات!");
        dispatch(RsetCancelReqModal(false));
        dispatch(RsetCurrentReqInfo(""));
        dispatch(RsetCancelReqComment(""));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleCheckoutConfirmReset = createAsyncThunk(
  "checkout/handleCheckoutConfirmReset",
  async (e, { dispatch, getState }) => {
    dispatch(RsetCheckoutConAmozesh(""));
    dispatch(RsetCheckoutConAmval(""));
    dispatch(RsetCheckoutConAmvalMobile(false));
    dispatch(RsetCheckoutConAmvalMashin(false));
    dispatch(RsetCheckoutConAmvalMaskoni(false));
    dispatch(RsetCheckoutConHardwareEmail(false));
    dispatch(RsetCheckoutConSoftwareSystem(false));
    dispatch(RsetCheckoutConWarehouseSystem(false));
    dispatch(RsetCheckoutConDabirNumber(false));
    dispatch(RsetCheckoutConDabirCellphone(false));
    dispatch(RsetCheckoutConDabirOther(false));
    dispatch(RsetCheckoutConHazineMali(""));
    dispatch(RsetCheckoutConSandoghMali(""));
    dispatch(RsetCheckoutConHoghoghDastmozdMali(""));
    dispatch(RsetCheckoutConEdari(""));
  }
);

const checkoutSlices = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    RsetCheckoutReqPersonName: (state, { payload }) => {
      return { ...state, checkoutReqPersonName: payload };
    },
    RsetCheckoutReqPersonNameOption: (state, { payload }) => {
      return { ...state, checkoutReqPersonNameOption: payload };
    },
    RsetCheckoutReqMeliCode: (state, { payload }) => {
      return { ...state, checkoutReqMeliCode: payload };
    },
    RsetCheckoutReqPersonalCode: (state, { payload }) => {
      return { ...state, checkoutReqPersonalCode: payload };
    },
    RsetCheckoutReqSupervisor: (state, { payload }) => {
      return { ...state, checkoutReqSupervisor: payload };
    },
    RsetCheckoutReqLeavingWorkDate: (state, { payload }) => {
      return { ...state, checkoutReqLeavingWorkDate: payload };
    },
    RsetCheckoutReqLeavingWorkReason: (state, { payload }) => {
      return { ...state, checkoutReqLeavingWorkReason: payload };
    },
    RsetCheckoutReqLeavingWorkReasonOption: (state, { payload }) => {
      return { ...state, checkoutReqLeavingWorkReasonOption: payload };
    },
    RsetCheckoutReqDepartment: (state, { payload }) => {
      return { ...state, checkoutReqDepartment: payload };
    },
    RsetCheckoutReqDepartmentOption: (state, { payload }) => {
      return { ...state, checkoutReqDepartmentOption: payload };
    },
    RsetCheckoutReqCompanyName: (state, { payload }) => {
      return { ...state, checkoutReqCompanyName: payload };
    },
    RsetCheckoutReqDescription: (state, { payload }) => {
      return { ...state, checkoutReqDescription: payload };
    },
    RsetCheckoutSendToModal: (state, { payload }) => {
      return { ...state, checkoutSendToModal: payload };
    },
    RsetCheckoutReqActionId: (state, { payload }) => {
      return { ...state, checkoutReqActionId: payload };
    },
    RsetCheckoutReqIsSubmitted: (state, { payload }) => {
      return { ...state, checkoutReqIsSubmitted: payload };
    },
    RsetCheckoutFilterData: (state, { payload }) => {
      return { ...state, checkoutFilterData: payload };
    },
    RsetCheckoutReqSupervisorId: (state, { payload }) => {
      return { ...state, checkoutReqSupervisorId: payload };
    },
    //confirmation
    RsetCheckoutConEdari: (state, { payload }) => {
      return { ...state, checkoutConEdari: payload };
    },
    RsetCheckoutConAmozesh: (state, { payload }) => {
      return { ...state, checkoutConAmozesh: payload };
    },
    RsetCheckoutConHazineMali: (state, { payload }) => {
      return { ...state, checkoutConHazineMali: payload };
    },
    RsetCheckoutConSandoghMali: (state, { payload }) => {
      return { ...state, checkoutConSandoghMali: payload };
    },
    RsetCheckoutConHoghoghDastmozdMali: (state, { payload }) => {
      return { ...state, checkoutConHoghoghDastmozdMali: payload };
    },
    RsetCheckoutConAmval: (state, { payload }) => {
      return { ...state, checkoutConAmval: payload };
    },
    RsetCheckoutConAmvalMobile: (state, { payload }) => {
      return { ...state, checkoutConAmvalMobile: payload };
    },
    RsetCheckoutConAmvalMashin: (state, { payload }) => {
      return { ...state, checkoutConAmvalMashin: payload };
    },
    RsetCheckoutConAmvalMaskoni: (state, { payload }) => {
      return { ...state, checkoutConAmvalMaskoni: payload };
    },
    RsetCheckoutConHardwareEmail: (state, { payload }) => {
      return { ...state, checkoutConHardwareEmail: payload };
    },
    RsetCheckoutConSoftwareSystem: (state, { payload }) => {
      return { ...state, checkoutConSoftwareSystem: payload };
    },
    RsetCheckoutConWarehouseSystem: (state, { payload }) => {
      return { ...state, checkoutConWarehouseSystem: payload };
    },
    RsetCheckoutConDabirNumber: (state, { payload }) => {
      return { ...state, checkoutConDabirNumber: payload };
    },
    RsetCheckoutConDabirCellphone: (state, { payload }) => {
      return { ...state, checkoutConDabirCellphone: payload };
    },
    RsetCheckoutConDabirOther: (state, { payload }) => {
      return { ...state, checkoutConDabirOther: payload };
    },
    //modalProcess
    RsetCheckoutProcessModal: (state, { payload }) => {
      return { ...state, checkoutProcessModal: payload };
    },
  },
});

export const {
  RsetCheckoutReqPersonName,
  RsetCheckoutReqPersonNameOption,
  RsetCheckoutReqMeliCode,
  RsetCheckoutReqPersonalCode,
  RsetCheckoutReqSupervisor,
  RsetCheckoutReqLeavingWorkDate,
  RsetCheckoutReqLeavingWorkReason,
  RsetCheckoutReqLeavingWorkReasonOption,
  RsetCheckoutReqDepartment,
  RsetCheckoutReqDepartmentOption,
  RsetCheckoutReqCompanyName,
  RsetCheckoutReqDescription,
  RsetCheckoutSendToModal,
  RsetCheckoutReqActionId,
  RsetCheckoutReqIsSubmitted,
  RsetCheckoutFilterData,
  RsetCheckoutReqSupervisorId,
  //confirmation
  RsetCheckoutConEdari,
  RsetCheckoutConAmozesh,
  RsetCheckoutConHazineMali,
  RsetCheckoutConSandoghMali,
  RsetCheckoutConHoghoghDastmozdMali,
  RsetCheckoutConAmval,
  RsetCheckoutConAmvalMobile,
  RsetCheckoutConAmvalMashin,
  RsetCheckoutConAmvalMaskoni,
  RsetCheckoutConHardwareEmail,
  RsetCheckoutConSoftwareSystem,
  RsetCheckoutConWarehouseSystem,
  RsetCheckoutConDabirNumber,
  RsetCheckoutConDabirCellphone,
  RsetCheckoutConDabirOther,
  //modalProcess
  RsetCheckoutProcessModal,
} = checkoutSlices.actions;

export const selectCheckoutReqPersonName = (state) =>
  state.checkout.checkoutReqPersonName;
export const selectCheckoutReqPersonNameOption = (state) =>
  state.checkout.checkoutReqPersonNameOption;
export const selectCheckoutReqMeliCode = (state) =>
  state.checkout.checkoutReqMeliCode;
export const selectCheckoutReqPersonalCode = (state) =>
  state.checkout.checkoutReqPersonalCode;
export const selectCheckoutReqSupervisor = (state) =>
  state.checkout.checkoutReqSupervisor;
export const selectCheckoutReqLeavingWorkDate = (state) =>
  state.checkout.checkoutReqLeavingWorkDate;
export const selectCheckoutReqLeavingWorkReason = (state) =>
  state.checkout.checkoutReqLeavingWorkReason;
export const selectCheckoutReqLeavingWorkReasonOption = (state) =>
  state.checkout.checkoutReqLeavingWorkReasonOption;
export const selectCheckoutReqDepartment = (state) =>
  state.checkout.checkoutReqDepartment;
export const selectCheckoutReqDepartmentOption = (state) =>
  state.checkout.checkoutReqDepartmentOption;
export const selectCheckoutReqCompanyName = (state) =>
  state.checkout.checkoutReqCompanyName;
export const selectCheckoutReqDescription = (state) =>
  state.checkout.checkoutReqDescription;
export const selectChcekoutSendToModal = (state) =>
  state.checkout.checkoutSendToModal;
export const selectChcekoutReqActionId = (state) =>
  state.checkout.checkoutReqActionId;
export const selectCheckoutReqIsSubmitted = (state) =>
  state.checkout.checkoutReqIsSubmitted;
export const selectCheckoutFilterData = (state) =>
  state.checkout.checkoutFilterData;
export const selectCheckoutReqSupervisorId = (state) =>
  state.checkout.checkoutReqSupervisorId;
//confirmation
export const selectCheckoutConEdari = (state) =>
  state.checkout.checkoutConEdari;
export const selectCheckoutConAmozesh = (state) =>
  state.checkout.checkoutConAmozesh;
export const selectCheckoutConHazineMali = (state) =>
  state.checkout.checkoutConHazineMali;
export const selectCheckoutConSandoghMali = (state) =>
  state.checkout.checkoutConSandoghMali;
export const selectCheckoutConHoghoghDastmozdMali = (state) =>
  state.checkout.checkoutConHoghoghDastmozdMali;
export const selectCheckoutConAmval = (state) =>
  state.checkout.checkoutConAmval;
export const selectCheckoutConAmvalMobile = (state) =>
  state.checkout.checkoutConAmvalMobile;
export const selectCheckoutConAmvalMashin = (state) =>
  state.checkout.checkoutConAmvalMashin;
export const selectCheckoutConAmvalMaskoni = (state) =>
  state.checkout.checkoutConAmvalMaskoni;
export const selectCheckoutConHardwareEmail = (state) =>
  state.checkout.checkoutConHardwareEmail;
export const selectCheckoutConSoftwareSystem = (state) =>
  state.checkout.checkoutConSoftwareSystem;
export const selectCheckoutConWarehouseSystem = (state) =>
  state.checkout.checkoutConWarehouseSystem;
export const selectCheckoutConDabirNumber = (state) =>
  state.checkout.checkoutConDabirNumber;
export const selectCheckoutConDabirCellphone = (state) =>
  state.checkout.checkoutConDabirCellphone;
export const selectCheckoutConDabirOther = (state) =>
  state.checkout.checkoutConDabirOther;
//modalProcess
export const selectCheckoutProcessModal = (state) =>
  state.checkout.checkoutProcessModal;

export default checkoutSlices.reducer;
