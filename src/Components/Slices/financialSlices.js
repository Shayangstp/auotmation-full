import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPaySlipReportFields, getPaySlipReportCompanies, getPaySlipReport } from '../../Services/financialServices';
import { RsetLoading } from "./mainSlices";

const initialState = {
    paySlipReportField: '',
    paySlipReportFieldOptions: [],
    paySlipReportFilterByPadashFrom: '',
    paySlipReportFilterByPadashTo: '',
    paySlipReportFilterByPoshtlistFrom: '',
    paySlipReportFilterByPoshtlistTo: '',
    paySlipReportFilterByAfztolid1From: '',
    paySlipReportFilterByAfztolid1To: '',
    paySlipReportFilterByChildRightFrom: '',
    paySlipReportFilterByChildRightTo: '',
    paySlipReportFilterByHomeRightFrom: '',
    paySlipReportFilterByHomeRightTo: '',
    paySlipReportFilterByBonFrom: '',
    paySlipReportFilterByBonTo: '',
    paySlipReportFilterByMaliatFrom: '',
    paySlipReportFilterByMaliatTo: '',
    paySlipReportFilterByOverTimeFrom: '',
    paySlipReportFilterByOverTimeTo: '',
    paySlipReportFilterByKasrkarFrom: '',
    paySlipReportFilterByKasrkarTo: '',
    paySlipReportFilterByMamouriat2From: '',
    paySlipReportFilterByMamouriat2To: '',
    paySlipReportFilterByNobatKariFrom: '',
    paySlipReportFilterByNobatKariTo: '',
    paySlipReportFilterByMorkhasi1From: '',
    paySlipReportFilterByMorkhasi1To: '',
    paySlipReportFilterByTasvieh1From: '',
    paySlipReportFilterByTasvieh1To: '',
    paySlipReportFilterByHelpPayFrom: '',
    paySlipReportFilterByHelpPayTo: '',
    paySlipReportFilterByLoanPartFrom: '',
    paySlipReportFilterByLoanPartTo: '',
    paySlipReportFromYear: '',
    paySlipReportFromMonth: '',
    paySlipReportToYear: '',
    paySlipReportToMonth: '',
    paySlipReportCompany: '',
    paySlipReportCompanyOptions: [],
    paySlipReport: []
};

export const handlePaySlipReportFieldOptions = createAsyncThunk(
    "financial/handlePaySlipReportFieldOptions",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const paySlipReportFieldsRes = await getPaySlipReportFields();
            if (paySlipReportFieldsRes.data.code === 415) {
                dispatch(RsetPaySlipReportFieldOptions(paySlipReportFieldsRes.data.list));
                dispatch(RsetLoading(false));
            }else{
                dispatch(RsetPaySlipReportFieldOptions([]));
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);
export const handlePaySlipReportCompanies = createAsyncThunk(
    "financial/handlePaySlipReportCompanies",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const paySlipReportCompaniesRes = await getPaySlipReportCompanies();
            if (paySlipReportCompaniesRes.data.code === 415) {
                dispatch(RsetPaySlipReportCompanyOptions(paySlipReportCompaniesRes.data.list));
                dispatch(RsetLoading(false));
            }else{
                dispatch(RsetPaySlipReportCompanyOptions([]));
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);
export const handlePaySlipReport = createAsyncThunk(
    "financial/handlePaySlipReport",
    async ({fields, filterString}, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const paySlipReportRes = await getPaySlipReport(fields, filterString);
            if (paySlipReportRes.data.code === 415) {
                dispatch(RsetPaySlipReport(paySlipReportRes.data.list));
                dispatch(RsetLoading(false));
            }else{
                dispatch(RsetPaySlipReport([]));
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);

const financialSlice = createSlice({
    name: "financial",
    initialState,
    reducers: {
        RsetPaySlipReportField: (state, action) => {
            return { ...state, paySlipReportField: action.payload };
        },
        RsetPaySlipReportFieldOptions: (state, action) => {
            return { ...state, paySlipReportFieldOptions: action.payload };
        },
        RsetPaySlipReportFilterByPadashFrom: (state, action) => {
            return { ...state, paySlipReportFilterByPadashFrom: action.payload };
        },
        RsetPaySlipReportFilterByPadashTo: (state, action) => {
            return { ...state, paySlipReportFilterByPadashTo: action.payload };
        },
        RsetPaySlipReportFilterByPoshtlistFrom: (state, action) => {
            return { ...state, paySlipReportFilterByPoshtlistFrom: action.payload };
        },
        RsetPaySlipReportFilterByPoshtlistTo: (state, action) => {
            return { ...state, paySlipReportFilterByPoshtlistTo: action.payload };
        },
        RsetPaySlipReportFilterByAfztolid1From: (state, action) => {
            return { ...state, paySlipReportFilterByAfztolid1From: action.payload };
        },
        RsetPaySlipReportFilterByAfztolid1To: (state, action) => {
            return { ...state, paySlipReportFilterByAfztolid1To: action.payload };
        },
        RsetPaySlipReportFilterByChildRightFrom: (state, action) => {
            return { ...state, paySlipReportFilterByChildRightFrom: action.payload };
        },
        RsetPaySlipReportFilterByChildRightTo: (state, action) => {
            return { ...state, paySlipReportFilterByChildRightTo: action.payload };
        },
        RsetPaySlipReportFilterByHomeRightFrom: (state, action) => {
            return { ...state, paySlipReportFilterByHomeRightFrom: action.payload };
        },
        RsetPaySlipReportFilterByHomeRightTo: (state, action) => {
            return { ...state, paySlipReportFilterByHomeRightTo: action.payload };
        },
        RsetPaySlipReportFilterByBonFrom: (state, action) => {
            return { ...state, paySlipReportFilterByBonFrom: action.payload };
        },
        RsetPaySlipReportFilterByBonTo: (state, action) => {
            return { ...state, paySlipReportFilterByBonTo: action.payload };
        },
        RsetPaySlipReportFilterByMaliatFrom: (state, action) => {
            return { ...state, paySlipReportFilterByMaliatFrom: action.payload };
        },
        RsetPaySlipReportFilterByMaliatTo: (state, action) => {
            return { ...state, paySlipReportFilterByMaliatTo: action.payload };
        },
        RsetPaySlipReportFilterByOverTimeFrom: (state, action) => {
            return { ...state, paySlipReportFilterByOverTimeFrom: action.payload };
        },
        RsetPaySlipReportFilterByOverTimeTo: (state, action) => {
            return { ...state, paySlipReportFilterByOverTimeTo: action.payload };
        },
        RsetPaySlipReportFilterByKasrkarFrom: (state, action) => {
            return { ...state, paySlipReportFilterByKasrkarFrom: action.payload };
        },
        RsetPaySlipReportFilterByKasrkarTo: (state, action) => {
            return { ...state, paySlipReportFilterByKasrkarTo: action.payload };
        },
        RsetPaySlipReportFilterByMamouriat2From: (state, action) => {
            return { ...state, paySlipReportFilterByMamouriat2From: action.payload };
        },
        RsetPaySlipReportFilterByMamouriat2To: (state, action) => {
            return { ...state, paySlipReportFilterByMamouriat2To: action.payload };
        },
        RsetPaySlipReportFilterByNobatKariFrom: (state, action) => {
            return { ...state, paySlipReportFilterByNobatKariFrom: action.payload };
        },
        RsetPaySlipReportFilterByNobatKariTo: (state, action) => {
            return { ...state, paySlipReportFilterByNobatKariTo: action.payload };
        },
        RsetPaySlipReportFilterByMorkhasi1From: (state, action) => {
            return { ...state, paySlipReportFilterByMorkhasi1From: action.payload };
        },
        RsetPaySlipReportFilterByMorkhasi1To: (state, action) => {
            return { ...state, paySlipReportFilterByMorkhasi1To: action.payload };
        },
        RsetPaySlipReportFilterByTasvieh1From: (state, action) => {
            return { ...state, paySlipReportFilterByTasvieh1From: action.payload };
        },
        RsetPaySlipReportFilterByTasvieh1To: (state, action) => {
            return { ...state, paySlipReportFilterByTasvieh1To: action.payload };
        },
        RsetPaySlipReportFilterByHelpPayFrom: (state, action) => {
            return { ...state, paySlipReportFilterByHelpPayFrom: action.payload };
        },
        RsetPaySlipReportFilterByHelpPayTo: (state, action) => {
            return { ...state, paySlipReportFilterByHelpPayTo: action.payload };
        },
        RsetPaySlipReportFilterByLoanPartFrom: (state, action) => {
            return { ...state, paySlipReportFilterByLoanPartFrom: action.payload };
        },
        RsetPaySlipReportFilterByLoanPartTo: (state, action) => {
            return { ...state, paySlipReportFilterByLoanPartTo: action.payload };
        },
        RsetPaySlipReportFromYear: (state, action) => {
            return { ...state, paySlipReportFromYear: action.payload };
        },
        RsetPaySlipReportFromMonth: (state, action) => {
            return { ...state, paySlipReportFromMonth: action.payload };
        },
        RsetPaySlipReportToYear: (state, action) => {
            return { ...state, paySlipReportToYear: action.payload };
        },
        RsetPaySlipReportToMonth: (state, action) => {
            return { ...state, paySlipReportToMonth: action.payload };
        },
        RsetPaySlipReportCompany: (state, action) => {
            return { ...state, paySlipReportCompany: action.payload };
        },
        RsetPaySlipReportCompanyOptions: (state, action) => {
            return { ...state, paySlipReportCompanyOptions: action.payload };
        },
        RsetPaySlipReport: (state, action) => {
            return { ...state, paySlipReport: action.payload };
        },
    },
    extraReducers: {

    }
});

export const {
    RsetPaySlipReportField,
    RsetPaySlipReportFieldOptions,
    RsetPaySlipReportFilterByPadashFrom,
    RsetPaySlipReportFilterByPadashTo,
    RsetPaySlipReportFilterByPoshtlistFrom,
    RsetPaySlipReportFilterByPoshtlistTo,
    RsetPaySlipReportFilterByAfztolid1From,
    RsetPaySlipReportFilterByAfztolid1To,
    RsetPaySlipReportFilterByChildRightFrom,
    RsetPaySlipReportFilterByChildRightTo,
    RsetPaySlipReportFilterByHomeRightFrom,
    RsetPaySlipReportFilterByHomeRightTo,
    RsetPaySlipReportFilterByBonFrom,
    RsetPaySlipReportFilterByBonTo,
    RsetPaySlipReportFilterByMaliatFrom,
    RsetPaySlipReportFilterByMaliatTo,
    RsetPaySlipReportFilterByOverTimeFrom,
    RsetPaySlipReportFilterByOverTimeTo,
    RsetPaySlipReportFilterByKasrkarFrom,
    RsetPaySlipReportFilterByKasrkarTo,
    RsetPaySlipReportFilterByMamouriat2From,
    RsetPaySlipReportFilterByMamouriat2To,
    RsetPaySlipReportFilterByNobatKariFrom,
    RsetPaySlipReportFilterByNobatKariTo,
    RsetPaySlipReportFilterByMorkhasi1From,
    RsetPaySlipReportFilterByMorkhasi1To,
    RsetPaySlipReportFilterByTasvieh1From,
    RsetPaySlipReportFilterByTasvieh1To,
    RsetPaySlipReportFilterByHelpPayFrom,
    RsetPaySlipReportFilterByHelpPayTo,
    RsetPaySlipReportFilterByLoanPartFrom,
    RsetPaySlipReportFilterByLoanPartTo,
    RsetPaySlipReportFromYear,
    RsetPaySlipReportFromMonth,
    RsetPaySlipReportToYear,
    RsetPaySlipReportToMonth,
    RsetPaySlipReportCompany,
    RsetPaySlipReportCompanyOptions,
    RsetPaySlipReport
} = financialSlice.actions;

export const selectPaySlipReportField = (state) => state.financial.paySlipReportField;
export const selectPaySlipReportFieldOptions = (state) => state.financial.paySlipReportFieldOptions;
export const selectPaySlipReportFilterByPadashFrom = (state) => state.financial.paySlipReportFilterByPadashFrom;
export const selectPaySlipReportFilterByPadashTo = (state) => state.financial.paySlipReportFilterByPadashTo;
export const selectPaySlipReportFilterByPoshtlistFrom = (state) => state.financial.paySlipReportFilterByPoshtlistFrom;
export const selectPaySlipReportFilterByPoshtlistTo = (state) => state.financial.paySlipReportFilterByPoshtlistTo;
export const selectPaySlipReportFilterByAfztolid1From = (state) => state.financial.paySlipReportFilterByAfztolid1From;
export const selectPaySlipReportFilterByAfztolid1To = (state) => state.financial.paySlipReportFilterByAfztolid1To;
export const selectPaySlipReportFilterByChildRightFrom = (state) => state.financial.paySlipReportFilterByChildRightFrom;
export const selectPaySlipReportFilterByChildRightTo = (state) => state.financial.paySlipReportFilterByChildRightTo;
export const selectPaySlipReportFilterByHomeRightFrom = (state) => state.financial.paySlipReportFilterByHomeRightFrom;
export const selectPaySlipReportFilterByHomeRightTo = (state) => state.financial.paySlipReportFilterByHomeRightTo;
export const selectPaySlipReportFilterByBonFrom = (state) => state.financial.paySlipReportFilterByBonFrom;
export const selectPaySlipReportFilterByBonTo = (state) => state.financial.paySlipReportFilterByBonTo;
export const selectPaySlipReportFilterByMaliatFrom = (state) => state.financial.paySlipReportFilterByMaliatFrom;
export const selectPaySlipReportFilterByMaliatTo = (state) => state.financial.paySlipReportFilterByMaliatTo;
export const selectPaySlipReportFilterByOverTimeFrom = (state) => state.financial.paySlipReportFilterByOverTimeFrom;
export const selectPaySlipReportFilterByOverTimeTo = (state) => state.financial.paySlipReportFilterByOverTimeTo;
export const selectPaySlipReportFilterByKasrkarFrom = (state) => state.financial.paySlipReportFilterByKasrkarFrom;
export const selectPaySlipReportFilterByKasrkarTo = (state) => state.financial.paySlipReportFilterByKasrkarTo;
export const selectPaySlipReportFilterByMamouriat2From = (state) => state.financial.paySlipReportFilterByMamouriat2From;
export const selectPaySlipReportFilterByMamouriat2To = (state) => state.financial.paySlipReportFilterByMamouriat2To;
export const selectPaySlipReportFilterByNobatKariFrom = (state) => state.financial.paySlipReportFilterByNobatKariFrom;
export const selectPaySlipReportFilterByNobatKariTo = (state) => state.financial.paySlipReportFilterByNobatKariTo;
export const selectPaySlipReportFilterByMorkhasi1From = (state) => state.financial.paySlipReportFilterByMorkhasi1From;
export const selectPaySlipReportFilterByMorkhasi1To = (state) => state.financial.paySlipReportFilterByMorkhasi1To;
export const selectPaySlipReportFilterByTasvieh1From = (state) => state.financial.paySlipReportFilterByTasvieh1From;
export const selectPaySlipReportFilterByTasvieh1To = (state) => state.financial.paySlipReportFilterByTasvieh1To;
export const selectPaySlipReportFilterByHelpPayFrom = (state) => state.financial.paySlipReportFilterByHelpPayFrom;
export const selectPaySlipReportFilterByHelpPayTo = (state) => state.financial.paySlipReportFilterByHelpPayTo;
export const selectPaySlipReportFilterByLoanPartFrom = (state) => state.financial.paySlipReportFilterByLoanPartFrom;
export const selectPaySlipReportFilterByLoanPartTo = (state) => state.financial.paySlipReportFilterByLoanPartTo;
export const selectPaySlipReportFromYear = (state) => state.financial.paySlipReportFromYear;
export const selectPaySlipReportFromMonth = (state) => state.financial.paySlipReportFromMonth;
export const selectPaySlipReportToYear = (state) => state.financial.paySlipReportToYear;
export const selectPaySlipReportToMonth = (state) => state.financial.paySlipReportToMonth;
export const selectPaySlipReportCompany = (state) => state.financial.paySlipReportCompany;
export const selectPaySlipReportCompanyOptions = (state) => state.financial.paySlipReportCompanyOptions;
export const selectPaySlipReport = (state) => state.financial.paySlipReport;

export default financialSlice.reducer;
