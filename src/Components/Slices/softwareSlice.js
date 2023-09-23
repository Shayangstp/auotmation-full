import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorMessage, successMessage } from "../../utils/message";
import { RsetFormErrors, RsetCompanyNames, handleReqsList } from "./mainSlices";
import {
  postAction,
  getCoUsers,
  getToPersonByRole,
} from "../../Services/rootServices";
import {
  submitSoftwareReq,
  softwareLists,
  softwareReq,
  softwareReqItem,
  softwareReqProcess,
} from "../../Services/softwareServices";
import {
  RsetCurrentReqItems,
  RsetCurrentReqInfo,
  RsetCurrentReqToPerson,
} from "./currentReqSlice";
import {
  RsetAcceptReqModal,
  RsetNextAcceptReqModal,
  RsetAcceptReqComment,
} from "./modalsSlice";

import {
  RsetMembersOption,
  RsetFilterData,
  RsetSerialFilter,
  RsetUserFilter,
  RsetStatusFilter,
  RsetDepFilter,
  RsetFromDateFilter,
  RsetToDateFilter,
  RsetRealFilter,
} from "./filterSlices";

// make the order ok
const initialState = {
  softwareReqDescription: "",
  softwareReqItemName: "",
  softwareReqRequireParts: "",
  softwareReqItems: [],
  softwareReqCoUsers: "",
  softwareReqToPersonByRoles: "",
  softwareToggleHandler: false,
  softwareNamesOption: [],
  softwareCoUsersOption: [],
  softwareToPersonByRolesOption: [],
  radioCheck: true,
  softwareProcess: "",

  //software req list

  softwareReqList: "",

  ///test
  datePicker: null,
};

//get software Lists
export const handleSoftwareLists = createAsyncThunk(
  "software/handleSoftwareLists",
  async (obj, { dispatch, getState }) => {
    try {
      const softwareListsRes = await softwareLists();
      if (softwareListsRes.data.code === 415) {
        dispatch(RsetSoftwareNamesOption(softwareListsRes.data.softwares));
      } else {
        dispatch(RsetSoftwareNamesOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//get coUsers lists
export const handleSoftwareCoUsersLists = createAsyncThunk(
  "software/handleSoftwareCoUsersLists",
  async (obj, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;
      const softwareCoUsersListsRes = await getCoUsers(
        undefined,
        user.CompanyCode,
        user.Location,
        0
      );
      console.log(softwareCoUsersListsRes);
      if (softwareCoUsersListsRes.data.code === 415) {
        dispatch(RsetSoftwareCoUsersOption(softwareCoUsersListsRes.data.list));
      } else {
        dispatch(RsetSoftwareCoUsersOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//get users List by dep
export const handleSoftwareToPersonByRolesLists = createAsyncThunk(
  "software/handleSoftwareToPersonByRolesLists",
  async (obj, { dispatch, getState }) => {
    try {
      const { user } = getState().mainHome;
      const softwareToPersonByRolesListsRes = await getToPersonByRole(
        undefined,
        user.Location,
        user.CompanyCode,
        1,
        user.DeptCode,
        0
      );
      console.log(softwareToPersonByRolesListsRes);
      if (softwareToPersonByRolesListsRes.data.code === 415) {
        dispatch(
          RsetSoftwareToPersonByRolesOption(
            softwareToPersonByRolesListsRes.data.list
          )
        );
      } else {
        dispatch(RsetSoftwareToPersonByRolesOption([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//reset
export const handleSoftwareReset = createAsyncThunk(
  "software/handleSoftwareReqReset",
  (e, { dispatch, getState }) => {
    dispatch(RsetSoftwareReqItemName(""));
    dispatch(RsetCompanyNames(""));
    dispatch(RsetSoftwareReqRequireParts(""));
    dispatch(RsetSoftwareReqCoUsers(""));
    dispatch(RsetSoftwareReqToPersonByRoles(""));
    dispatch(RsetFormErrors(""));
  }
);

//submit the Req
export const handleSoftwareReqSubmit = createAsyncThunk(
  "software/handleSoftwareReqSubmit",
  async (e, { dispatch, getState }) => {
    e.preventDefault();
    try {
      const {
        softwareReqDescription,
        softwareReqCoUsers,
        softwareReqToPersonByRoles,
        softwareReqItems,
        radioCheck,
      } = getState().software;
      const { user } = getState().mainHome;
      const sameAccessValue = radioCheck
        ? softwareReqCoUsers !== ""
          ? softwareReqCoUsers.value
          : null
        : softwareReqToPersonByRoles !== ""
        ? softwareReqToPersonByRoles.value
        : null;
      const softwareReqValues = {
        sameAccess: sameAccessValue,
        description: softwareReqDescription,
      };
      const submitSoftwareReqRes = await submitSoftwareReq(softwareReqValues);
      console.log(submitSoftwareReqRes);
      if (submitSoftwareReqRes.data.code === 415) {
        const sendAction = async () => {
          const actionValues = {
            actionCode: 10,
            actionId: submitSoftwareReqRes.data.id,
            userId: localStorage.getItem("id"),
            typeId: 6,
            toPersons: user.Supervisor._id,
            comment: null,
          };
          const postActionRes = await postAction(actionValues);
          console.log(postActionRes);
          if (postActionRes.data.code === 415) {
            successMessage("درخواست مورد نظر با موفقیت ثبت شد!");
            dispatch(RsetSoftwareReqDescription(""));
            dispatch(RsetFormErrors(""));
            dispatch(handleSoftwareReset());
          }
        };
        if (softwareReqItems.length !== 0) {
          var items = 0;
          softwareReqItems.map(async (item) => {
            const softwareReqItemValues = {
              sourceId: submitSoftwareReqRes.data.id,
              softwares: String(
                item.name.map((item) => {
                  return item.value;
                })
              ),
              companies: String(
                item.companies.map((item) => {
                  return item.value;
                })
              ),
              requireParts: item.require,
              id: item.id,
            };
            const softwareReqRes = await softwareReq(softwareReqItemValues);
            console.log(softwareReqRes);
            if (softwareReqRes.data.code === 415) {
              items = items + 1;
              if (items === softwareReqItems.length) {
                sendAction();
              }
            }
          });
        } else {
          sendAction();
        }
      } else {
        errorMessage("خطا!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleSoftwareReqItem = createAsyncThunk(
  "software/handleSoftwareReqItem",
  async (requestId, { dispatch, getState }) => {
    try {
      const softwareReqItemRes = await softwareReqItem(requestId);
      if (softwareReqItemRes.data.code === 415) {
        dispatch(RsetCurrentReqItems(softwareReqItemRes.data.items));
      } else {
        dispatch(RsetCurrentReqItems([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

//delete item in table
export const handleDeleteItem = createAsyncThunk(
  "software/handleDeleteItem",
  async (itemId, { dispatch, getState }) => {
    const { softwareReqItems } = getState().software;
    const items = [...softwareReqItems];
    const filteredItems = items.filter((tr) => tr.id !== itemId);
    dispatch(RsetSoftwareReqItems(filteredItems));
  }
);

export const handlesoftwareReqProcess = createAsyncThunk(
  "software/handlesoftwareReqProcess",
  async ({ reqId, typeId }, { dispatch, getState }) => {
    try {
      const softwareReqProcessRes = await softwareReqProcess(reqId, typeId);
      if (softwareReqProcessRes.data.code === 415) {
        dispatch(RsetSoftwareProcess(softwareReqProcessRes.data.list));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleSoftwareFilterReset = createAsyncThunk(
  "software/handleSoftwareFilterReset",
  async (obj, { dispatch, getState }) => {
    dispatch(RsetSerialFilter(""));
    dispatch(RsetUserFilter(""));
    dispatch(RsetStatusFilter(""));
    dispatch(RsetDepFilter(""));
    dispatch(RsetFromDateFilter(null));
    dispatch(RsetToDateFilter(null));
    dispatch(RsetRealFilter(false));
  }
);

export const handleAcceptSoftwareReq = createAsyncThunk(
  "software/handleAcceptSoftwareReq",
  async (needManager, { dispatch, getState }) => {
    try {
      const { currentReqInfo, currentReqToPerson } = getState().currentReq;
      const { user } = getState().mainHome;
      const { acceptReqComment, sendTo } = getState().modals;
      var toPersonList = "";
      var actionCode = "";
      if (needManager === false) {
        if (currentReqInfo.lastActionCode === 10) {
          const toPersonsRes = await getToPersonByRole(
            "17",
            10,
            user.CompanyCode,
            1,
            null,
            0
          );
          if (toPersonsRes.data.code === 415) {
            toPersonList = toPersonsRes.data.list.map((item) => {
              return item.value;
            });
            actionCode = 11;
          } else {
            errorMessage("شخص دریافت کننده ای یافت نشد!");
          }
        } else if (
          currentReqInfo.lastActionCode === 11 &&
          sendTo.value !== undefined
        ) {
          actionCode = 12;
          toPersonList = sendTo.value;
        } else if (currentReqInfo.lastActionCode === 12) {
          actionCode = 1;
          toPersonList = null;
        }
      } else {
        toPersonList = currentReqToPerson.value;
        actionCode = 20;
      }
      if (actionCode !== "" && toPersonList !== "") {
        const actionValues = {
          actionCode: actionCode,
          actionId: currentReqInfo.requestId,
          userId: localStorage.getItem("id"),
          toPersons: String(toPersonList),
          typeId: 6,
          comment: acceptReqComment !== "" ? acceptReqComment : null,
        };
        const postActionRes = await postAction(actionValues);
        if (postActionRes.data.code === 415) {
          successMessage("درخواست با موفقبت تایید شد!");
          dispatch(RsetAcceptReqModal(false));
          dispatch(RsetNextAcceptReqModal(false));
          dispatch(RsetCurrentReqInfo(""));
          dispatch(RsetAcceptReqComment(""));
          dispatch(RsetCurrentReqToPerson(""));
          const filterValues = {
            applicantId: localStorage.getItem("id"),
            serial: "",
            memberId: "",
            status: "",
            fromDate: "null",
            toDate: "null",
            type: 6,
            mDep: "",
            group: 0,
          };
          dispatch(handleReqsList(filterValues));
        } else {
          errorMessage("خطا در انجام عملیات!");
          dispatch(RsetAcceptReqModal(false));
          dispatch(RsetNextAcceptReqModal(false));
          dispatch(RsetCurrentReqInfo(""));
          dispatch(RsetAcceptReqComment(""));
          dispatch(RsetCurrentReqToPerson(""));
        }
      } else {
        errorMessage("خطا!");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

const softwareSlice = createSlice({
  name: "software",
  initialState,
  reducers: {
    RsetSoftwareReqDescription: (state, { payload }) => {
      return { ...state, softwareReqDescription: payload };
    },
    RsetSoftwareReqItemName: (state, { payload }) => {
      return { ...state, softwareReqItemName: payload };
    },
    RsetSoftwareReqRequireParts: (state, { payload }) => {
      return { ...state, softwareReqRequireParts: payload };
    },
    RsetSoftwareReqCoUsers: (state, { payload }) => {
      return { ...state, softwareReqCoUsers: payload };
    },
    RsetSoftwareReqToPersonByRoles: (state, { payload }) => {
      return { ...state, softwareReqToPersonByRoles: payload };
    },
    RsetSoftwareToggleHandler: (state, { payload }) => {
      return { ...state, softwareToggleHandler: payload };
    },
    RsetSoftwareReqNumber: (state, { payload }) => {
      return { ...state, softwareReqNumber: payload };
    },
    RsetSoftwareReqItems: (state, { payload }) => {
      return { ...state, softwareReqItems: payload };
    },
    RsetSoftwareNamesOption: (state, { payload }) => {
      return { ...state, softwareNamesOption: payload };
    },
    //software req list
    RsetSoftwareReqList: (state, { payload }) => {
      return { ...state, softwareReqList: payload };
    },
    RsetSoftwareCoUsersOption: (state, { payload }) => {
      return { ...state, softwareCoUsersOption: payload };
    },
    RsetSoftwareToPersonByRolesOption: (state, { payload }) => {
      return { ...state, softwareToPersonByRolesOption: payload };
    },
    RsetRadioCheck: (state, { payload }) => {
      return { ...state, radioCheck: payload };
    },
    RsetSoftwareProcess: (state, { payload }) => {
      return { ...state, softwareProcess: payload };
    },
  },
});

export const {
  RsetSoftwareReqDescription,
  RsetSoftwareReqItemName,
  RsetSoftwareReqRequireParts,
  RsetSoftwareReqCoUsers,
  RsetSoftwareReqToPersonByRoles,
  RsetSoftwareToggleHandler,
  RsetSoftwareReqNumber,
  RsetSoftwareReqItems,
  RsetSoftwareNamesOption,
  RsetSoftwareReqList,
  RsetSoftwareCoUsersOption,
  RsetSoftwareToPersonByRolesOption,
  RsetRadioCheck,
  RsetSoftwareProcess,
  //software req list
} = softwareSlice.actions;

export const selectSoftwareReqDescription = (state) =>
  state.software.softwareReqDescription;
export const selectSoftwareReqItemName = (state) =>
  state.software.softwareReqItemName;
export const selectSoftwareReqRequireParts = (state) =>
  state.software.softwareReqRequireParts;
export const selectSoftwareReqCoUsers = (state) =>
  state.software.softwareReqCoUsers;
export const selectSoftwareReqToPersonByRoles = (state) =>
  state.software.softwareReqToPersonByRoles;
export const selectSoftwareToggleHandler = (state) =>
  state.software.softwareToggleHandler;
export const selectSoftwareReqNumber = (state) =>
  state.software.softwareReqNumber;
export const selectSoftwareReqItems = (state) =>
  state.software.softwareReqItems;
export const selectSoftwareNamesOption = (state) =>
  state.software.softwareNamesOption;
export const selectSoftwareCoUsersOption = (state) =>
  state.software.softwareCoUsersOption;
export const selectSoftwareToPersonByRolesOption = (state) =>
  state.software.softwareToPersonByRolesOption;
export const selectRadioCheck = (state) => state.software.radioCheck;
export const selectSoftwareProcess = (state) => state.software.softwareProcess;
//software req list
export const selectSoftwareReqList = (state) => state.software.softwareReqList;

export default softwareSlice.reducer;
