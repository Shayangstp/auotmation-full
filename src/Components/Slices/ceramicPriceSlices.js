import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCeramicCostList, submitCeramicCost, getCeramicMaterialFilterList,
  getCeramicProjectItem, submitCeramicProCalculateCost, submitCeramicProItemCalculateCost
} from "../../Services/ceramicMaterialServices";
import { RsetLoading, RsetFormErrors } from "./mainSlices";
import { successMessage, errorMessage } from "../../utils/message";

const initialState = {
  ceramicMaterialCode: "",
  ceramicMaterialName: "",
  ceramicMaterialfromDate: "",
  ceramicMaterialToData: "",
  ceramicMaterialPrice: "",
  ceramicMaterialDescription: "",
  ceramicMaterialFilterData: [],
  ceramicMaterialModalSearch: false,
  ceramicMaterialModalHistory: false,
  ceramicAddMaterialList: [],
  ceramicAddMaterialCode: "",
  ceramicAddMaterialName: "",
  ceramicSelectedMaterial: "",
  ceramicMaterialHistoryList: [],
  //ceramicProject
  ceramicProjectCode: "",
  ceramicProjectName: "",
  ceramicProjectDescription: "",
  ceramicProjectMaterialCode: "",
  ceramicProjectMaterialName: "",
  ceramicProjectMaterialPrice: "",
  ceramicProjectMaterialCount: "",
  ceramicProjectMaterialDate: null,
  ceramicProjectMaterialUnit: "",
  ceramicItems: [],
};

export const handleGetProWithCode = createAsyncThunk(
  "ceramicPrice/handleGetProWithCode",
  async (event, { dispatch, getState }) => {
    const {ceramicMaterialCode ,ceramicProjectMaterialDate} = getState().ceramicPrice
    let addProCode = event.target.value;
    if (addProCode.length >= 5) {
      const inputLength = 10 - addProCode.length;
      var zero = "";
      const autoZero = () => {
        for (var i = 0; i < inputLength; i++) {
          zero = zero + "0";
        }
        return zero;
      };
      const completedCode = addProCode.substring(0, 4) + autoZero() + addProCode.substring(4, addProCode.Length);
      dispatch(RsetCeramicMaterialCode(completedCode));
      dispatch(RsetLoading(true));
      try {
        const values = {
          itemCode: completedCode,
          itemName: "",
          itemGroupName: "",
          itemTechnicalInfo: "",
          date: ceramicProjectMaterialDate ? ceramicProjectMaterialDate : undefined,
        };
        const getProByCodeRes = await getCeramicProjectItem(values);
        if (getProByCodeRes.data.code === 415) {
          dispatch(RsetLoading(false));
          dispatch(RsetCeramicMaterialName(getProByCodeRes.data.items[0].itemName));
          dispatch(RsetCeramicProjectMaterialPrice(getProByCodeRes.data.items[0].itemCost));
        } else {
          dispatch(RsetCeramicMaterialName(''));
          dispatch(RsetCeramicProjectMaterialPrice(''));
          dispatch(RsetLoading(false));
          errorMessage('کد موردنظر یافت نشد!');
        }
      } catch (ex) {
        dispatch(RsetLoading(false));
        console.log(ex);
      }
    } else {
      dispatch(RsetCeramicMaterialCode(event.target.value));
    }
  }
);
export const handleGetProWithName = createAsyncThunk(
  "ceramicPrice/handleGetProWithName",
  async (event, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    try {
      const {ceramicMaterialName, ceramicProjectMaterialDate} = getState().ceramicPrice;
      const values = {
        itemCode: "",
        itemName: ceramicMaterialName,
        itemGroupName: "",
        itemTechnicalInfo: "",
        date: ceramicProjectMaterialDate ? ceramicProjectMaterialDate : undefined,
      };
      const getProByNameRes = await getCeramicProjectItem(values);
      if (getProByNameRes.data.code === 415) {
        dispatch(RsetLoading(false));
        dispatch(RsetCeramicAddMaterialList(getProByNameRes.data.items));
      } else {
        dispatch(RsetLoading(false));
        errorMessage('کالا موردنظر یافت نشد!');
        dispatch(RsetCeramicAddMaterialList([]));
      }
    } catch (ex) {
      dispatch(RsetLoading(false));
      console.log(ex);
    }
  }
);

export const handleCeramicCostList = createAsyncThunk(
  "ceramicPrice/handleCeramicCostList",
  async (itemCode, { dispatch, getState }) => {
    try {
      if (itemCode) {
        const ceramicMaterialCostListRes = await getCeramicCostList(itemCode);
        if (ceramicMaterialCostListRes.data.code === 415) {
          dispatch(
            RsetCeramicMaterialHistoryList(ceramicMaterialCostListRes.data.list)
          );
        } else {
          dispatch(RsetCeramicAddMaterialList([]));
        }
      } else {
        return null;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleCostSubmit = createAsyncThunk(
  "ceramicPrice/handleCostSubmit",
  async (e, { dispatch, getState }) => {
    e.preventDefault();
    try {
      const { ceramicMaterialCode, ceramicMaterialFromDate, ceramicMaterialToDate, ceramicMaterialPrice } = getState().ceramicPrice;
      const material = {
        itemCode: ceramicMaterialCode,
        fromDate: ceramicMaterialFromDate,
        toDate: ceramicMaterialToDate,
        cost: ceramicMaterialPrice.replaceAll(',', ""),
        userId: localStorage.getItem("id"),
      };
      const submitCeramicCostRes = await submitCeramicCost(material);
      if (submitCeramicCostRes.data.code === 415) {
        successMessage("ثبت قیمت با موفقیت انجام شد");
        dispatch(handleReset());
        dispatch(RsetFormErrors(""));
      } else if(submitCeramicCostRes.data.code === 429){
        errorMessage('برای این بازه زمانی قیمت ثبت شده است!')
      }else {
        errorMessage("خطا در ثبت قیمت ");
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleReset = createAsyncThunk(
  "ceramicPrice/handleResetSubmit",
  (obj, { dispatch, getState }) => {
    dispatch(RsetCeramicMaterialCode(""));
    dispatch(RsetCeramicMaterialName(""));
    dispatch(RsetCeramicMaterialFromDate(null));
    dispatch(RsetCeramicMaterialToDate(null));
    dispatch(RsetCeramicMaterialPrice(""));
    dispatch(RsetCeramicMaterialDescription(""));
  }
);

export const handleCeramicProjectItem = createAsyncThunk(
  "ceramicPrice/handleCeramicProjectItem",
  async (obj, { dispatch, getState }) => {
    const { ceramicProjectMaterialCode, ceramicProjectMaterialName, ceramicProjectMaterialDate } = getState().ceramicPrice;
    try {
      const values = {
        itemCode: ceramicProjectMaterialCode,
        itemName: ceramicProjectMaterialName,
        itemGroupName: "",
        itemTechnicalInfo: "",
        date: ceramicProjectMaterialDate
          ? ceramicProjectMaterialDate
          : undefined,
      };
      const ceramicProjectItemRes = await getCeramicProjectItem(values);
      if (ceramicProjectItemRes.data.code === 415) {
        dispatch(
          RsetCeramicProjectMaterialName(
            ceramicProjectItemRes.data.items[0].itemName
          )
        );
        dispatch(
          RsetCeramicProjectMaterialPrice(
            ceramicProjectItemRes.data.items[0].itemCost
          )
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleCeramicProCalculateCost = createAsyncThunk(
  "ceramicPrice/handleCeramicProCalculateCost",
  async (e, { dispatch, getState }) => {
    e.preventDefault();
    const { ceramicProjectCode, ceramicProjectName, ceramicProjectDescription, ceramicItems } = getState().ceramicPrice;
    if (ceramicItems.length !== 0) {
      try {
        const values = {
          projectCode: ceramicProjectCode ? ceramicProjectCode : undefined,
          title: ceramicProjectName,
          description: ceramicProjectDescription
            ? ceramicProjectDescription
            : undefined,
        };
        const submitCeramicProCalculateCostRes =
          await submitCeramicProCalculateCost(values);
        if (submitCeramicProCalculateCostRes.data.code === 415) {
          var count = 0;
          ceramicItems.map(async (item, index) => {
            const itemValues = {
              projectId: submitCeramicProCalculateCostRes.data.id,
              amount: item.materialCount,
              unit: item.materialUnit.value,
              row: String(index),
              itemCode: item.materialCode,
              cost: item.materialPrice.replaceAll(',', ''),
            };
            const submitCeramicProItemCalculateCostRes =
              await submitCeramicProItemCalculateCost(itemValues);
            if (submitCeramicProItemCalculateCostRes.data.code === 415) {
              count = count + 1;
              if (count === ceramicItems.length) {
                successMessage("درخواست با موفقیت ثبت شد");
                dispatch(handleResetSubmit());
              }
            } else {
              errorMessage("خطا در ثبت آیتم");
            }
          });
        } else {
          errorMessage("خطا در ثبت در خواست");
        }
      } catch (ex) {
        console.log(ex);
      }
    } else {
      errorMessage("وارد کردن حداقل یک آیتم ضروری است!");
    }
  }
);
export const handleResetItem = createAsyncThunk(
  "ceramicPrice/handleResetItem",
  (obj, { dispatch, getState }) => {
    dispatch(RsetCeramicMaterialCode(""));
    dispatch(RsetCeramicMaterialName(""));
    dispatch(RsetCeramicProjectMaterialCount(""));
    dispatch(RsetCeramicProjectMaterialPrice(""));
    dispatch(RsetCeramicProjectMaterialUnit(""));
    dispatch(RsetCeramicProjectMaterialDate(null));
    dispatch(RsetFormErrors(""));
  }
);
export const handleResetSubmit = createAsyncThunk(
  "ceramicPrice/handleResetSubmit",
  (obj, { dispatch, getState }) => {
    dispatch(handleResetItem());
    dispatch(RsetCeramicProjectCode(""));
    dispatch(RsetCeramicProjectName(""));
    dispatch(RsetCeramicProjectDescription(""));
    dispatch(RsetCeramicItems([]));
  }
);

const ceramicPriceSlice = createSlice({
  name: "ceramicPrice",
  initialState,
  reducers: {
    RsetCeramicMaterialCode: (state, action) => {
      return { ...state, ceramicMaterialCode: action.payload };
    },
    RsetCeramicMaterialName: (state, action) => {
      return { ...state, ceramicMaterialName: action.payload };
    },
    RsetCeramicMaterialFromDate: (state, action) => {
      return { ...state, ceramicMaterialFromDate: action.payload };
    },
    RsetCeramicMaterialToDate: (state, action) => {
      return { ...state, ceramicMaterialToDate: action.payload };
    },
    RsetCeramicMaterialPrice: (state, action) => {
      return { ...state, ceramicMaterialPrice: action.payload };
    },
    RsetCeramicMaterialDescription: (state, action) => {
      return { ...state, ceramicMaterialDescription: action.payload };
    },
    RsetCeramicMaterialFiterData: (state, action) => {
      return { ...state, ceramicMaterialFilterData: action.payload };
    },
    RsetCeramicMaterialModalSearch: (state, action) => {
      return { ...state, ceramicMaterialModalSearch: action.payload };
    },
    RsetCeramicMaterialModalHistory: (state, action) => {
      return { ...state, ceramicMaterialModalHistory: action.payload };
    },
    RsetCeramicAddMaterialList: (state, action) => {
      return { ...state, ceramicAddMaterialList: action.payload };
    },
    RsetCeramicAddMaterialCode: (state, action) => {
      return { ...state, ceramicAddMaterialCode: action.payload };
    },
    RsetCeramicAddMaterialName: (state, action) => {
      return { ...state, ceramicAddMaterialName: action.payload };
    },
    RsetCeramicSelectedMatrial: (state, action) => {
      return { ...state, ceramicSelectedMaterial: action.payload };
    },
    RsetCeramicMaterialHistoryList: (state, action) => {
      return { ...state, ceramicMaterialHistoryList: action.payload };
    },
    //ceramicProject
    RsetCeramicProjectCode: (state, action) => {
      return { ...state, ceramicProjectCode: action.payload };
    },
    RsetCeramicProjectName: (state, action) => {
      return { ...state, ceramicProjectName: action.payload };
    },
    RsetCeramicProjectDescription: (state, action) => {
      return { ...state, ceramicProjectDescription: action.payload };
    },
    RsetCeramicProjectMaterialCode: (state, action) => {
      return { ...state, ceramicProjectMaterialCode: action.payload };
    },
    RsetCeramicProjectMaterialName: (state, action) => {
      return { ...state, ceramicProjectMaterialName: action.payload };
    },
    RsetCeramicProjectMaterialPrice: (state, action) => {
      return { ...state, ceramicProjectMaterialPrice: action.payload };
    },
    RsetCeramicProjectMaterialCount: (state, action) => {
      return { ...state, ceramicProjectMaterialCount: action.payload };
    },
    RsetCeramicProjectMaterialDate: (state, action) => {
      return { ...state, ceramicProjectMaterialDate: action.payload };
    },
    RsetCeramicProjectMaterialUnit: (state, action) => {
      return { ...state, ceramicProjectMaterialUnit: action.payload };
    },
    RsetCeramicItems: (state, action) => {
      return { ...state, ceramicItems: action.payload };
    },
  },
});

export const {
  RsetCeramicMaterialCode,
  RsetCeramicMaterialName,
  RsetCeramicMaterialFromDate,
  RsetCeramicMaterialToDate,
  RsetCeramicMaterialPrice,
  RsetCeramicMaterialDescription,
  RsetCeramicMaterialFiterData,
  RsetCeramicMaterialModalSearch,
  RsetCeramicMaterialModalHistory,
  RsetCeramicAddMaterialCode,
  RsetCeramicAddMaterialName,
  RsetCeramicAddMaterialList,
  RsetCeramicSelectedMatrial,
  RsetCeramicMaterialHistoryList,
  //ceramicProject
  RsetCeramicProjectCode,
  RsetCeramicProjectName,
  RsetCeramicProjectDescription,
  RsetCeramicProjectMaterialCode,
  RsetCeramicProjectMaterialName,
  RsetCeramicProjectMaterialPrice,
  RsetCeramicProjectMaterialCount,
  RsetCeramicProjectMaterialDate,
  RsetCeramicProjectMaterialUnit,

  RsetCeramicItems,
} = ceramicPriceSlice.actions;

export const selectCeramicMaterialCode = (state) => state.ceramicPrice.ceramicMaterialCode;
export const selectCeramicMaterialName = (state) => state.ceramicPrice.ceramicMaterialName;
export const selectCeramicMaterialFromDate = (state) => state.ceramicPrice.ceramicMaterialFromDate;
export const selectCeramicMaterialToDate = (state) => state.ceramicPrice.ceramicMaterialToDate;
export const selectCeramicMaterialPrice = (state) => state.ceramicPrice.ceramicMaterialPrice;
export const selectCeramicMaterialDescription = (state) => state.ceramicPrice.ceramicMaterialDescription;
export const selectCeramicMaterialFilterData = (state) => state.ceramicPrice.ceramicMaterialFilterData;
export const selectCeramicMaterialModalSearch = (state) => state.ceramicPrice.ceramicMaterialModalSearch;
export const selectCeramicMaterialModalHistory = (state) => state.ceramicPrice.ceramicMaterialModalHistory;
export const selectCeramicAddMaterialCode = (state) => state.ceramicPrice.ceramicAddMaterialCode;
export const selectCeramicAddMaterialName = (state) => state.ceramicPrice.ceramicAddMaterialName;
export const selectCeramicAddMaterialList = (state) => state.ceramicPrice.ceramicAddMaterialList;
export const selectCeramicSelectedMatrial = (state) => state.ceramicPrice.ceramicSelectedMaterial;
export const selectCeramicMaterialHistoryList = (state) => state.ceramicPrice.ceramicMaterialHistoryList;
//ceramicProject
export const selectCeramicProjectCode = (state) => state.ceramicPrice.ceramicProjectCode;
export const selectCeramicProjectName = (state) => state.ceramicPrice.ceramicProjectName;
export const selectCeramicProjectDescription = (state) => state.ceramicPrice.ceramicProjectDescription;
export const selectCeramicProjectMaterialCode = (state) => state.ceramicPrice.ceramicProjectMaterialCode;
export const selectCeramicProjectMaterialName = (state) => state.ceramicPrice.ceramicProjectMaterialName;
export const selectCeramicProjectMaterialPrice = (state) => state.ceramicPrice.ceramicProjectMaterialPrice;
export const selectCeramicProjectMaterialCount = (state) => state.ceramicPrice.ceramicProjectMaterialCount;
export const selectCeramicProjectMaterialDate = (state) => state.ceramicPrice.ceramicProjectMaterialDate;
export const selectCeramicProjectMaterialUnit = (state) => state.ceramicPrice.ceramicProjectMaterialUnit;

export const selectCeramicItems = (state) => state.ceramicPrice.ceramicItems;


export default ceramicPriceSlice.reducer;
