import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNumberOfStaff } from "../../Services/rootServices";

const initialState = {
  lessThan500CoNames: [],
  lessThan500Staff: [],
  moreThan500CoNames: [],
  moreThan500Staff: []
};

export const handleCompaniesEmployees = createAsyncThunk(
  "mainHome/handleCompaniesEmployees",
  async (minmaxValues, { dispatch }) => {
    try {
      const companiesEmployeesRes = await getNumberOfStaff(minmaxValues);
      if (companiesEmployeesRes.data.code === 415) {
        if(minmaxValues.min >= 400){
          dispatch(RsetMoreThan500CoNames(companiesEmployeesRes.data.Companies));
          dispatch(RsetMoreThan500Staff(companiesEmployeesRes.data.numberOfPersonel));
        }else{
          dispatch(RsetLessThan500CoNames(companiesEmployeesRes.data.Companies));
          dispatch(RsetLessThan500Staff(companiesEmployeesRes.data.numberOfPersonel));
        }
      } else {
        dispatch(RsetMoreThan500CoNames([]));
        dispatch(RsetMoreThan500Staff([]));
        dispatch(RsetLessThan500CoNames([]));
        dispatch(RsetLessThan500Staff([]));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

const chartsSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    RsetLessThan500CoNames: (state, action) => {
      return { ...state, lessThan500CoNames: action.payload };
    },
    RsetLessThan500Staff: (state, action) => {
      return { ...state, lessThan500Staff: action.payload };
    },
    RsetMoreThan500CoNames: (state, action) => {
      return { ...state, moreThan500CoNames: action.payload };
    },
    RsetMoreThan500Staff: (state, action) => {
      return { ...state, moreThan500Staff: action.payload };
    },
  },
  extraReducers: {

  }
});

export const {
  RsetLessThan500CoNames,
  RsetLessThan500Staff,
  RsetMoreThan500CoNames,
  RsetMoreThan500Staff
} = chartsSlice.actions;

export const selectLessThan500CoNames = (state) => state.charts.lessThan500CoNames;
export const selectLessThan500Staff = (state) => state.charts.lessThan500Staff;
export const selectMoreThan500CoNames = (state) => state.charts.moreThan500CoNames;
export const selectMoreThan500Staff = (state) => state.charts.moreThan500Staff;

export default chartsSlice.reducer;
