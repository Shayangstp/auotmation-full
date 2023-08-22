import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSelectOptions, getTargetingList } from '../../Services/saleServices';
import { RsetRealFilter } from "./filterSlices";

const initialState = {
    productGroupName: "",
    productGroupNameOptions: [],
    productClassName: "",
    productClassNameOptions: [],
    customerName: "",
    customerNameOptions: [],
    targetingList: []
};

export const handleSelectOptions = createAsyncThunk(
    "sale/handleSelectOptions",
    async (selectType, { dispatch, getState }) => {
        try {
            const selectOptionsRes = await getSelectOptions(selectType);
            if (selectOptionsRes.data.code === 415) {
                if (selectType === 'productGroupName') {
                    dispatch(RsetProductGroupNameOptions(selectOptionsRes.data.list))
                } else if (selectType === 'productClassName') {
                    dispatch(RsetProductClassNameOptions(selectOptionsRes.data.list))
                } else if (selectType === 'customerName') {
                    dispatch(RsetCustomerNameOptions(selectOptionsRes.data.list))
                }
            } else {
                if (selectType === 'productGroupName') {
                    dispatch(RsetProductGroupNameOptions(''));
                } else if (selectType === 'productClassName') {
                    dispatch(RsetProductClassNameOptions(''));
                } else if (selectType === 'customerName') {
                    dispatch(RsetCustomerNameOptions(''));
                } 
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

export const handleTargetingList = createAsyncThunk(
    "sale/handleTargetingList",
    async (filterValues, { dispatch, getState }) => {
        try {
            const targetingListRes = await getTargetingList(filterValues);
            if(targetingListRes.data.code === 415){
                dispatch(RsetTargetingList(targetingListRes.data.list));
            }else{
                dispatch(RsetTargetingList([]));
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

export const handleResetTargetingList = createAsyncThunk(
    "sale/handleResetTargetingList",
    async (obj, { dispatch, getState }) => { 
        dispatch(RsetProductGroupName(''));
        dispatch(RsetProductClassName(''));
        dispatch(RsetCustomerName(''));
        dispatch(RsetRealFilter(false));
        dispatch(RsetTargetingList([]));
    }
);

const saleSlices = createSlice({
    name: "sale",
    initialState,
    reducers: {
        RsetProductGroupName: (state, { payload }) => {
            return { ...state, productGroupName: payload };
        },
        RsetProductGroupNameOptions: (state, { payload }) => {
            return { ...state, productGroupNameOptions: payload };
        },
        RsetProductClassName: (state, { payload }) => {
            return { ...state, productClassName: payload };
        },
        RsetProductClassNameOptions: (state, { payload }) => {
            return { ...state, productClassNameOptions: payload };
        },
        RsetCustomerName: (state, { payload }) => {
            return { ...state, customerName: payload };
        },
        RsetCustomerNameOptions: (state, { payload }) => {
            return { ...state, customerNameOptions: payload };
        },
        RsetTargetingList: (state, { payload }) => {
            return { ...state, targetingList: payload };
        },
    },
});

export const {
    RsetProductGroupName,
    RsetProductGroupNameOptions,
    RsetProductClassName,
    RsetProductClassNameOptions,
    RsetCustomerName,
    RsetCustomerNameOptions,
    RsetTargetingList
} = saleSlices.actions;

export const selectProductGroupName = (state) => state.sale.productGroupName;
export const selectProductGroupNameOptions = (state) => state.sale.productGroupNameOptions;
export const selectProductClassName = (state) => state.sale.productClassName;
export const selectProductClassNameOptions= (state) => state.sale.productClassNameOptions;
export const selectCustomerName = (state) => state.sale.customerName;
export const selectCustomerNameOptions = (state) => state.sale.customerNameOptions;
export const selectTargetingList = (state) => state.sale.targetingList;

export default saleSlices.reducer;
