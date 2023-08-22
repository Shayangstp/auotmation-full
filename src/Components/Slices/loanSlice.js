import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loanAmount: '',
  description: '',
  formErrors: {},
};



const LoanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    RsetFormErrors: (state, { payload }) => {
      return { ...state, formErrors: payload };
    },
    RsetLoanAmount: (state, { payload }) => {
        return { ...state, loanAmount: payload };
    },
    RsetDescription: (state, { payload }) => {
    return { ...state, description: payload };
    },
  },
  extraReducers: {
    
  },
});

export const {
    RsetFormErrors,
    RsetLoanAmount,
    RsetDescription
} = LoanSlice.actions;

export const selectFormErrors = (state) => state.loan.formErrors;
export const selectLoanAmount = (state) => state.loan.loanAmount;
export const selectDescription = (state) => state.loan.description;

export default LoanSlice.reducer;
