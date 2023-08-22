import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCeramicCostList, submitCeramicCost } from "../../Services/ceramicMaterialServices";
import { RsetLoading } from "./mainSlices";
import { getProByCodeOrName } from '../../Services/warehouseAddProService';
import { successMessage, errorMessage } from "../../utils/message";
import { handleEditWarehouseReqItemInvCode, handleEditWarehouseReqItemInvName } from '../Slices/warehouseSlice';

const initialState = {
    goodCode: '',
    prevGoodCode: '',
    goodName: '',
    prevGoodName: '',
    goodPrice: '',
    goodPriceDate: '',
    goodsList: [],
    goodsModal: false,
    selectedGood: {},
    prevList: []
};

export const handleGetGoodInfoWithCode = createAsyncThunk(
    "goodSearch/handleGetGoodInfoWithCode",
    async ({itemId, value}, { dispatch, getState }) => {
        const { prevList, goodsModal } = getState().goodSearch;
        const goodCodeLength = value.replaceAll("-", "").length;
        const goodCodeValue = value.replaceAll("-", "");
        if (goodCodeLength !== 0) {
            if (goodCodeLength >= 5) {
                const inputLength = 10 - goodCodeLength;
                var zero = '';
                const autoZero = () => {
                    for (var i = 0; i < inputLength; i++) {
                        zero = zero + '0';
                    }
                    return zero;
                }
                const completedCode = goodCodeValue.substring(0, 4) + autoZero() + goodCodeValue.substring(4, goodCodeLength);
                dispatch(handleEditWarehouseReqItemInvCode({value: completedCode, itemId: itemId}));
                const items = [...prevList];
                const itemIndex = items.findIndex(item => item.itemId === itemId);
                var item = { ...items[itemIndex] };
                item.invCode = completedCode;
                const allItems = [...items];
                allItems[itemIndex] = item;
                dispatch(RsetPrevList(allItems));
                if (prevList[itemIndex].invCode !== completedCode) {
                    dispatch(RsetLoading(true));
                    try {
                        const getProByCodeRes = await getProByCodeOrName(completedCode, undefined);
                        if (getProByCodeRes.data.code === 415 && getProByCodeRes.data.length !== 0) {
                            dispatch(RsetLoading(false));
                            dispatch(handleEditWarehouseReqItemInvName({value: getProByCodeRes.data.list[0].ItemName, itemId: itemId}));
                            const items = [...prevList];
                            const itemIndex = items.findIndex(item => item.itemId === itemId);
                            var item = { ...items[itemIndex] };
                            item.invName = getProByCodeRes.data.list[0].ItemName;
                            const allItems = [...items];
                            allItems[itemIndex] = item;
                            dispatch(RsetPrevList(allItems));
                            dispatch(RsetGoodsModal(false));
                            // if (document.getElementById('purchaseProTechSpecifications') !== null) {
                            //     document.getElementById('purchaseProTechSpecifications').focus();
                            // }
                        } else {
                            dispatch(RsetLoading(false));
                            errorMessage('کد موردنظر یافت نشد!');
                            dispatch(handleEditWarehouseReqItemInvCode({value: '', itemId: itemId}));
                            dispatch(handleEditWarehouseReqItemInvName({value: '', itemId: itemId}));
                            const items = [...prevList];
                            const itemIndex = items.findIndex(item => item.itemId === itemId);
                            var item = { ...items[itemIndex] };
                            item.invCode = null;
                            item.invName = null;
                            const allItems = [...items];
                            allItems[itemIndex] = item;
                            dispatch(RsetPrevList(allItems));
                        }
                    } catch (ex) {
                        dispatch(RsetLoading(false));
                        console.log(ex);
                    }
                }else if(prevList[itemIndex].invCode === completedCode){
                    const prevName = item.invName;
                    dispatch(handleEditWarehouseReqItemInvName({value: prevName, itemId: itemId}));
                }
            } else {
                dispatch(RsetLoading(true));
                try {
                    const getProByCodeRes = await getProByCodeOrName(goodCodeValue, undefined);
                    if (getProByCodeRes.data.code === 415 && getProByCodeRes.data.list.length !== 0) {
                        dispatch(RsetLoading(false));
                        if(getProByCodeRes.data.list.length === 1){
                            dispatch(handleEditWarehouseReqItemInvName({value: getProByCodeRes.data.list[0].ItemName, itemId: itemId}));
                            const items = [...prevList];
                            const itemIndex = items.findIndex(item => item.itemId === itemId);
                            var item = { ...items[itemIndex] };
                            item.invName = getProByCodeRes.data.list[0].ItemName;
                            const allItems = [...items];
                            allItems[itemIndex] = item;
                            dispatch(RsetPrevList(allItems));
                            dispatch(RsetGoodsModal(false));
                        }else{
                            if(goodsModal !== true){
                                dispatch(RsetGoodsModal(true));
                            }
                            dispatch(RsetGoodsList(getProByCodeRes.data.list));
                        }
                        // if (document.getElementById('purchaseProTechSpecifications') !== null) {
                        //     document.getElementById('purchaseProTechSpecifications').focus();
                        // }
                    } else {
                        dispatch(RsetLoading(false));
                        errorMessage('کد موردنظر یافت نشد!');
                        dispatch(handleEditWarehouseReqItemInvCode({value: '', itemId: itemId}));
                        dispatch(handleEditWarehouseReqItemInvName({value: '', itemId: itemId}));
                        const items = [...prevList];
                        const itemIndex = items.findIndex(item => item.itemId === itemId);
                        var item = { ...items[itemIndex] };
                        item.invCode = null;
                        item.invName = null;
                        const allItems = [...items];
                        allItems[itemIndex] = item;
                        dispatch(RsetPrevList(allItems));
                    }
                } catch (ex) {
                    dispatch(RsetLoading(false));
                    console.log(ex);
                }

                // document.getElementById('goodCode').focus();
                // document.getElementById('goodCode').select();

                // dispatch(handleEditWarehouseReqItemInvName({value: '', itemId: itemId}));
                // dispatch(handleEditWarehouseReqItemInvCode({value: '', itemId: itemId}));
                // const items = [...prevList];
                // const itemIndex = items.findIndex(item => item.itemId === itemId);
                // var item = { ...items[itemIndex] };
                // item.invCode = null;
                // item.invName = null;
                // const allItems = [...items];
                // allItems[itemIndex] = item;
                // dispatch(RsetPrevList(allItems));
                // errorMessage('کد انبار نمیتواند کمتر از 5 رقم باشد!');
            }
        } else {
            const items = [...prevList];
            const itemIndex = items.findIndex(item => item.itemId === itemId);
            var item = { ...items[itemIndex] };
            item.invCode = null;
            item.invName = null;
            const allItems = [...items];
            allItems[itemIndex] = item;
            dispatch(RsetPrevList(allItems));
            dispatch(handleEditWarehouseReqItemInvCode({value: '', itemId: itemId}));
            dispatch(handleEditWarehouseReqItemInvName({value: '', itemId: itemId}));
        }
    }
);
export const handleGetGoodInfoWithName = createAsyncThunk(
    "goodSearch/handleGetGoodInfoWithName",
    async ({itemId, value}, { dispatch, getState }) => {
        const {prevList, goodsModal} = getState().goodSearch;
        if(value !== ''){
            dispatch(handleEditWarehouseReqItemInvCode({value: '', itemId: itemId}))
            const items = [...prevList];
            const itemIndex = items.findIndex(item => item.itemId === itemId);
            const item = {...items[itemIndex]}
            item.invName = value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            dispatch(RsetPrevList(allItems));
            if(items[itemIndex].invName !== value){
                const searchedArray = value.split('+');
                dispatch(RsetLoading(true));
                dispatch(handleEditWarehouseReqItemInvCode({value: '', itemId: itemId}))
                try{
                    const getProByNameRes = await getProByCodeOrName(undefined, String(searchedArray));
                    if(getProByNameRes.data.code === 415 && getProByNameRes.data.list.length !== 0){
                        dispatch(RsetLoading(false));
                        if(getProByNameRes.data.list.length === 1){
                            dispatch(handleEditWarehouseReqItemInvCode({ value: getProByNameRes.data.list[0].ItemCode, itemId: itemId }));
                            dispatch(handleEditWarehouseReqItemInvName({ value: getProByNameRes.data.list[0].ItemName, itemId: itemId }));
                            dispatch(RsetSelectedGood({code: getProByNameRes.data.list[0].ItemCode, name: getProByNameRes.data.list[0].ItemName, unitName: getProByNameRes.data.list[0].UnitName, unitCode: getProByNameRes.data.list[0].UnitCode}));
                        }else if(getProByNameRes.data.list.length > 1){
                            if(goodsModal !== true){
                                dispatch(RsetGoodsModal(true));
                            }
                            dispatch(RsetGoodsList(getProByNameRes.data.list));
                        }
                    }else{
                        dispatch(RsetLoading(false));
                        errorMessage('کالا موردنظر یافت نشد!');
                        dispatch(RsetGoodsList([]));
                        dispatch(RsetGoodsModal(false));
                        const items = [...prevList];
                        const itemIndex = items.findIndex(item => item.itemId === itemId);
                        const item = {...items[itemIndex]}
                        item.invName = null;
                        const allItems = [...items];
                        allItems[itemIndex] = item;
                        dispatch(RsetPrevList(allItems));
                        dispatch(handleEditWarehouseReqItemInvName({value: '', itemId: itemId}))
                    }
                }catch(ex){
                    dispatch(RsetLoading(false));
                    console.log(ex);
                }
            }
        }else{
            errorMessage('جهت استفاده از این امکان باید بخشی از نام کالا را تایپ کرده باشید!');
        }
    }
);

export const handleGoodInfoWithCode = createAsyncThunk(
    "goodSearch/handleGoodInfoWithCode",
    async (obj, { dispatch, getState }) => {
        const { goodCode, prevGoodCode, prevGoodName, goodsModal } = getState().goodSearch;
        const goodCodeLength = goodCode.replaceAll("-", "").length;
        const goodCodeValue = goodCode.replaceAll("-", "");
        if (goodCodeLength !== 0) {
            if (goodCodeLength >= 5) {
                const inputLength = 10 - goodCodeLength;
                var zero = '';
                const autoZero = () => {
                    for (var i = 0; i < inputLength; i++) {
                        zero = zero + '0';
                    }
                    return zero;
                }
                const completedCode = goodCodeValue.substring(0, 4) + autoZero() + goodCodeValue.substring(4, goodCodeLength);
                dispatch(RsetGoodCode(completedCode));
                dispatch(RsetPrevGoodCode(completedCode));
                if (prevGoodCode !== completedCode) {
                    dispatch(RsetLoading(true));
                    try {
                        const getProByCodeRes = await getProByCodeOrName(completedCode, undefined);
                        if (getProByCodeRes.data.code === 415 && getProByCodeRes.data.list.length !== 0) {
                            dispatch(RsetLoading(false));
                            dispatch(RsetGoodName(getProByCodeRes.data.list[0].ItemName));
                            dispatch(RsetPrevGoodName(getProByCodeRes.data.list[0].ItemName));
                            dispatch(RsetSelectedGood({code: getProByCodeRes.data.list[0].ItemCode, name: getProByCodeRes.data.list[0].ItemName, unitName: getProByCodeRes.data.list[0].UnitName, unitCode: getProByCodeRes.data.list[0].UnitCode}));
                            dispatch(RsetGoodsModal(false));
                            // if (document.getElementById('purchaseProTechSpecifications') !== null) {
                            //     document.getElementById('purchaseProTechSpecifications').focus();
                            // }
                        } else {
                            dispatch(RsetLoading(false));
                            errorMessage('کد موردنظر یافت نشد!');
                            dispatch(RsetGoodCode(''));
                            dispatch(RsetPrevGoodCode(''));
                            dispatch(RsetGoodName(''));
                            dispatch(RsetPrevGoodName(''));
                        }
                    } catch (ex) {
                        dispatch(RsetLoading(false));
                        console.log(ex);
                    }
                }else if(prevGoodCode === completedCode){
                    dispatch(RsetGoodName(prevGoodName));
                }
            } else {
                dispatch(RsetLoading(true));
                    try {
                        const getProByCodeRes = await getProByCodeOrName(goodCodeValue, undefined);
                        if (getProByCodeRes.data.code === 415 && getProByCodeRes.data.list.length !== 0) {
                            dispatch(RsetLoading(false));
                            if(getProByCodeRes.data.list.length === 1){
                                dispatch(RsetGoodName(getProByCodeRes.data.list[0].ItemName));
                                dispatch(RsetPrevGoodName(getProByCodeRes.data.list[0].ItemName));
                                dispatch(RsetSelectedGood({code: getProByCodeRes.data.list[0].ItemCode, name: getProByCodeRes.data.list[0].ItemName, unitName: getProByCodeRes.data.list[0].UnitName, unitCode: getProByCodeRes.data.list[0].UnitCode}));
                            }else{
                                if(goodsModal !== true){
                                    dispatch(RsetGoodsModal(true));
                                }
                                dispatch(RsetGoodsList(getProByCodeRes.data.list));
                            }
                            // if (document.getElementById('purchaseProTechSpecifications') !== null) {
                            //     document.getElementById('purchaseProTechSpecifications').focus();
                            // }
                        } else {
                            dispatch(RsetLoading(false));
                            errorMessage('کد موردنظر یافت نشد!');
                            dispatch(RsetGoodCode(''));
                            dispatch(RsetPrevGoodCode(''));
                            dispatch(RsetGoodName(''));
                            dispatch(RsetPrevGoodName(''));
                        }
                    } catch (ex) {
                        dispatch(RsetLoading(false));
                        console.log(ex);
                    }

                // document.getElementById('goodCode').focus();
                // document.getElementById('goodCode').select();

                // dispatch(RsetGoodCode(''));
                // dispatch(RsetPrevGoodCode(''));
                // dispatch(RsetGoodName(''));
                // dispatch(RsetPrevGoodName(''));
                // errorMessage('کد انبار نمیتواند کمتر از 5 رقم باشد!');
            }
        } else {
            dispatch(RsetGoodCode(''));
            dispatch(RsetPrevGoodCode(''));
            dispatch(RsetGoodName(''));
            dispatch(RsetPrevGoodName(''));
        }
    }
);
export const handleGoodInfoWithName = createAsyncThunk(
    "goodSearch/handleGoodInfoWithName",
    async (obj, { dispatch, getState }) => {
        const { goodName, prevGoodName, goodsModal } = getState().goodSearch;
        if(goodName !== ''){
            dispatch(RsetGoodCode(''));
            dispatch(RsetPrevGoodName(goodName));
            if(prevGoodName !== goodName){
                const searchedArray = goodName.split('+');
                dispatch(RsetLoading(true));
                dispatch(RsetGoodCode(''))
                try{
                    const getProByNameRes = await getProByCodeOrName(undefined, String(searchedArray));
                    if(getProByNameRes.data.code === 415 && getProByNameRes.data.list.length !== 0){
                        dispatch(RsetLoading(false));
                        if(getProByNameRes.data.list.length === 1){
                            dispatch(RsetGoodCode(getProByNameRes.data.list[0].ItemCode));
                            dispatch(RsetGoodName(getProByNameRes.data.list[0].ItemName));
                            dispatch(RsetSelectedGood({code: getProByNameRes.data.list[0].ItemCode, name: getProByNameRes.data.list[0].ItemName, unitName: getProByNameRes.data.list[0].UnitName, unitCode: getProByNameRes.data.list[0].UnitCode}));
                        }else if(getProByNameRes.data.list.length > 1){
                            if(goodsModal !== true){
                                dispatch(RsetGoodsModal(true));
                            }
                            dispatch(RsetGoodsList(getProByNameRes.data.list));
                        }
                    }else{
                        dispatch(RsetLoading(false));
                        errorMessage('کالا موردنظر یافت نشد!');
                        dispatch(RsetGoodsList([]));
                        dispatch(RsetGoodsModal(false));
                        dispatch(RsetPrevGoodName(''));
                        dispatch(RsetGoodName(''));
                    }
                }catch(ex){
                    dispatch(RsetLoading(false));
                    console.log(ex);
                }
            }
        }else{
            errorMessage('جهت استفاده از این امکان باید بخشی از نام کالا را تایپ کرده باشید!');
        }
    }
);

export const handleResetGoodSearch = createAsyncThunk(
    "goodSearch/handleResetGoodSearch",
    async (event, { dispatch, getState }) => {
        dispatch(RsetGoodsList([]));
        dispatch(RsetSelectedGood({}));
        dispatch(RsetPrevGoodCode(''));
        dispatch(RsetPrevGoodName(''));
    }
);

const goodSearchSlice = createSlice({
    name: "goodSearch",
    initialState,
    reducers: {
        RsetGoodCode: (state, action) => {
            return { ...state, goodCode: action.payload };
        },
        RsetPrevGoodCode: (state, action) => {
            return { ...state, prevGoodCode: action.payload };
        },
        RsetGoodName: (state, action) => {
            return { ...state, goodName: action.payload };
        },
        RsetPrevGoodName: (state, action) => {
            return { ...state, prevGoodName: action.payload };
        },
        RsetGoodPrice: (state, action) => {
            return { ...state, goodPrice: action.payload };
        },
        RsetGoodPriceDate: (state, action) => {
            return { ...state, goodPriceDate: action.payload };
        },
        RsetGoodsList: (state, action) => {
            return { ...state, goodsList: action.payload };
        },
        RsetGoodsModal: (state, action) => {
            return { ...state, goodsModal: action.payload };
        },
        RsetSelectedGood: (state, action) => {
            return { ...state, selectedGood: action.payload };
        },
        RsetPrevList: (state, action) => {
            return { ...state, prevList: action.payload };
        },
    },
});

export const {
    RsetGoodCode,
    RsetPrevGoodCode,
    RsetGoodName,
    RsetPrevGoodName,
    RsetGoodPrice,
    RsetGoodPriceDate,
    RsetGoodsList,
    RsetGoodsModal,
    RsetSelectedGood,
    RsetPrevList
} = goodSearchSlice.actions;

export const selectGoodCode = (state) => state.goodSearch.goodCode;
export const selectPrevGoodCode = (state) => state.goodSearch.prevGoodCode;
export const selectGoodName = (state) => state.goodSearch.goodName;
export const selectPrevGoodName = (state) => state.goodSearch.prevGoodName;
export const selectGoodPrice = (state) => state.goodSearch.goodPrice;
export const selectGoodPriceDate = (state) => state.goodSearch.goodPriceDate;
export const selectGoodsList = (state) => state.goodSearch.goodsList;
export const selectGoodsModal = (state) => state.goodSearch.goodsModal;
export const selectSelectedGood = (state) => state.goodSearch.selectedGood;
export const selectPrevList = (state) => state.goodSearch.prevList;

export default goodSearchSlice.reducer;
