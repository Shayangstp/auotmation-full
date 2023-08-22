import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSalesChart, getTenChart } from "../../../Services/chartServices";
import { RsetLoading, RsetFormErrors } from "../mainSlices";
import { successMessage, errorMessage } from "../../../utils/message";

const initialState = {
    yearChartTypeNames: [],
    yearChartTypeValues: [],
    monthChartTypeNames: [],
    monthChartTypeValues: [],
    provinceChartTypeNames: [],
    provinceChartTypeValues: [],
    seasonChartTypeNames: [],
    seasonChartTypeValues: [],
    customerChartTypeNames: [],
    customerChartTypeValues: [],
};

export const handleGetTenCharts = createAsyncThunk(
    "chart/handleGetTenCharts",
    async (chartType, { dispatch, getState }) => {
        try {
            const getTenChartRes = await getTenChart(chartType);
            if (getTenChartRes.data.code === 415) {
                if (chartType === 'year') {
                    dispatch(RsetYearChartTypeNames(getTenChartRes.data.name));
                    dispatch(RsetYearChartTypeValues(getTenChartRes.data.value));
                } else if (chartType === 'month') {
                    dispatch(RsetMonthChartTypeNames(getTenChartRes.data.name));
                    dispatch(RsetMonthChartTypeValues(getTenChartRes.data.value));
                } else if (chartType === 'Products') {
                    dispatch(RsetProvinceChartTypeNames(getTenChartRes.data.name));
                    dispatch(RsetProvinceChartTypeValues(getTenChartRes.data.value));
                } else if (chartType === 'season') {
                    dispatch(RsetSeasonChartTypeNames(getTenChartRes.data.name));
                    dispatch(RsetSeasonChartTypeValues(getTenChartRes.data.value));
                }
            } else {
                errorMessage('اطلاعات یافت نشد!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);
export const handleGetSalesChart = createAsyncThunk(
    "chart/handleGetSalesChart",
    async ({financeYear, chartType, numberOfRows} , { dispatch, getState }) => {
        try {
            const getSalesChartRes = await getSalesChart(financeYear, chartType, numberOfRows);
            if (getSalesChartRes.data.code === 415) {
                if (chartType === 'Customers') {
                    dispatch(RsetCustomerChartTypeNames(getSalesChartRes.data.name));
                    dispatch(RsetCustomerChartTypeValues(getSalesChartRes.data.value));
                } else if (chartType === 'Month') {
                    dispatch(RsetMonthChartTypeNames(getSalesChartRes.data.name));
                    dispatch(RsetMonthChartTypeValues(getSalesChartRes.data.value));
                } else if (chartType === 'Products') {
                    dispatch(RsetProvinceChartTypeNames(getSalesChartRes.data.name));
                    dispatch(RsetProvinceChartTypeValues(getSalesChartRes.data.value));
                } else if (chartType === 'Season') {
                    dispatch(RsetSeasonChartTypeNames(getSalesChartRes.data.name));
                    dispatch(RsetSeasonChartTypeValues(getSalesChartRes.data.value));
                } else if (chartType === 'FinanceYear'){
                    dispatch(RsetYearChartTypeNames(getSalesChartRes.data.name));
                    dispatch(RsetYearChartTypeValues(getSalesChartRes.data.value));
                }
            } else {
                // errorMessage('اطلاعات یافت نشد!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

const chartSlice = createSlice({
    name: "chart",
    initialState,
    reducers: {
        RsetYearChartTypeNames: (state, action) => {
            return { ...state, yearChartTypeNames: action.payload };
        },
        RsetYearChartTypeValues: (state, action) => {
            return { ...state, yearChartTypeValues: action.payload };
        },
        RsetMonthChartTypeNames: (state, action) => {
            return { ...state, monthChartTypeNames: action.payload };
        },
        RsetMonthChartTypeValues: (state, action) => {
            return { ...state, monthChartTypeValues: action.payload };
        },
        RsetProvinceChartTypeNames: (state, action) => {
            return { ...state, provinceChartTypeNames: action.payload };
        },
        RsetProvinceChartTypeValues: (state, action) => {
            return { ...state, provinceChartTypeValues: action.payload };
        },
        RsetSeasonChartTypeNames: (state, action) => {
            return { ...state, seasonChartTypeNames: action.payload };
        },
        RsetSeasonChartTypeValues: (state, action) => {
            return { ...state, seasonChartTypeValues: action.payload };
        },
        RsetCustomerChartTypeNames: (state, action) => {
            return { ...state, customerChartTypeNames: action.payload };
        },
        RsetCustomerChartTypeValues: (state, action) => {
            return { ...state, customerChartTypeValues: action.payload };
        },
    },
});

export const {
    RsetYearChartTypeNames,
    RsetYearChartTypeValues,
    RsetMonthChartTypeNames,
    RsetMonthChartTypeValues,
    RsetProvinceChartTypeNames,
    RsetProvinceChartTypeValues,
    RsetSeasonChartTypeNames,
    RsetSeasonChartTypeValues,
    RsetCustomerChartTypeNames,
    RsetCustomerChartTypeValues
} = chartSlice.actions;

export const selectYearChartTypeNames = (state) => state.chart.yearChartTypeNames;
export const selectYearChartTypeValues = (state) => state.chart.yearChartTypeValues;
export const selectMonthChartTypeNames = (state) => state.chart.monthChartTypeNames;
export const selectMonthChartTypeValues = (state) => state.chart.monthChartTypeValues;
export const selectProvinceChartTypeNames = (state) => state.chart.provinceChartTypeNames;
export const selectProvinceChartTypeValues = (state) => state.chart.provinceChartTypeValues;
export const selectSeasonChartTypeNames = (state) => state.chart.seasonChartTypeNames;
export const selectSeasonChartTypeValues = (state) => state.chart.seasonChartTypeValues;
export const selectCustomerChartTypeNames = (state) => state.chart.customerChartTypeNames;
export const selectCustomerChartTypeValues = (state) => state.chart.customerChartTypeValues;

export default chartSlice.reducer;
