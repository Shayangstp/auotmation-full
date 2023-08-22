import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "../../utils/message";
import { RsetLoading } from "./mainSlices";
import { getProList, getCeramicReqNames } from "../../Services/jobReqService";
import { RsetRealFilter } from "./filterSlices";

const initialState = {
    newCeramicReq: true,
    ceramicReqName: '',
    ceramicReqNamesOption: [],
    ceramicReqItems: [],
    productsList: [],
    proGroupFilter: '',
    proCodeFilter: '',
    proNameFilter: '',
    proTechInfo: ''
};

export const handleCeramicReqNames = createAsyncThunk(
    "ceramic/handleCeramicReqNames",
    async (obj, { dispatch }) => {
        try {
            const ceramicReqNamesRes = await getCeramicReqNames();
            if (ceramicReqNamesRes.data.code === 415) {
                dispatch(RsetCeramicReqNamesOption(ceramicReqNamesRes.data.list))
            } else {
                dispatch(RsetCeramicReqNamesOption([]))
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

export const handleProductsList = createAsyncThunk(
    "ceramic/handleProductsList",
    async (filterValues, { dispatch }) => {
        dispatch(RsetLoading(true));
        try {
            const proListRes = await getProList(filterValues);
            if (proListRes.data.code === 415) {
                dispatch(RsetLoading(false));
                dispatch(RsetProductsList(proListRes.data.list))
            } else {
                errorMessage("اطلاعات یافت نشد!");
                dispatch(RsetLoading(false));
                dispatch(RsetProductsList([]))
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);
export const handleClearProductsListFilter = createAsyncThunk(
    "ceramic/handleProductsList",
    async (obj, { dispatch }) => {
        dispatch(RsetRealFilter(false));
        dispatch(RsetProGroupFilter(''));
        dispatch(RsetProCodeFilter(''));
        dispatch(RsetProNameFilter(''));
        dispatch(RsetProTechInfo(''));
        const filterValues = {
            itemGroupName: '', itemCode: '', itemName: '', itemTechnicalInfo: ''
        }
        dispatch(handleProductsList(filterValues));
    }
);

const ceramicSlices = createSlice({
    name: "ceramic",
    initialState,
    reducers: {
        RsetNewCeramicReq: (state, action) => {
            return { ...state, newCeramicReq: action.payload };
        },
        RsetCeramicReqName: (state, action) => {
            return { ...state, ceramicReqName: action.payload };
        },
        RsetCeramicReqNamesOption: (state, action) => {
            return { ...state, ceramicReqNamesOption: action.payload };
        },
        RsetCeramicReqItems: (state, action) => {
            return { ...state, ceramicReqItems: action.payload };
        },
        RsetProductsList: (state, action) => {
            return { ...state, productsList: action.payload };
        },
        RsetProGroupFilter: (state, action) => {
            return { ...state, proGroupFilter: action.payload };
        },
        RsetProCodeFilter: (state, action) => {
            return { ...state, proCodeFilter: action.payload };
        },
        RsetProNameFilter: (state, action) => {
            return { ...state, proNameFilter: action.payload };
        },
        RsetProTechInfo: (state, action) => {
            return { ...state, proTechInfo: action.payload };
        },
    }
});

export const {
    RsetNewCeramicReq,
    RsetCeramicReqName,
    RsetCeramicReqNamesOption,
    RsetCeramicReqItems,
    RsetProductsList,
    RsetProGroupFilter,
    RsetProCodeFilter,
    RsetProNameFilter,
    RsetProTechInfo
} = ceramicSlices.actions;

export const selectNewCeramicReq = (state) => state.ceramic.newCeramicReq;
export const selectCeramicReqName = (state) => state.ceramic.ceramicReqName;
export const selectCeramicReqNamesOption = (state) => state.ceramic.ceramicReqNamesOption;
export const selectCeramicReqItems = (state) => state.ceramic.ceramicReqItems;
export const selectProductsList = (state) => state.ceramic.productsList;
export const selectProGroupFilter = (state) => state.ceramic.proGroupFilter;
export const selectProCodeFilter = (state) => state.ceramic.proCodeFilter;
export const selectProNameFilter = (state) => state.ceramic.proNameFilter;
export const selectProTechInfo = (state) => state.ceramic.proTechInfo;

export default ceramicSlices.reducer;
