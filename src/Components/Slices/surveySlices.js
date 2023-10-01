import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  surveyChecked: "",
};

export const handleTabs = createAsyncThunk(
  "survey/handleTabs",
  async (type, { dispatch, getState }) => {}
);

const surveySlices = createSlice({
  name: "survey",
  initialState,
  reducers: {
    RsetSurveyChecked: (state, { payload }) => {
      return { ...state, surveyChecked: payload };
    },
  },
});

export const { RsetSurveyChecked } = surveySlices.actions;

export const selectSurveyChecked = (state) => state.survey.surveyChecked;

export default surveySlices.reducer;
