import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  cloudAccMode,
  cloudAppName,
  cloudFileList,
  downloadFileCloud,
  getUploudFile,
} from "../../Services/r-ghanavatian/fileCloud";
import { postAction } from "../../Services/r-ghanavatian/mainApi";
import { errorMessage, successMessage } from "../../utils/message";
import { RsetIsLoadingCheckout, RsetRealFilter } from "./mainSlices";
import { softwareLists } from "../../Services/softwareServices";
import { RsetFormErrors } from "./mainSlices";
const initialState = {
  uploadSoftwareName: "",
  uploadSoftwareNameOption: [],
  uploadFile: "",
  uploadAccessLevel: "",
  uploadAccessLevelOption: [],
  uploadVersion: "",
  uploadDescription: "",
};

export const handleSoftwareNameOption = createAsyncThunk(
  "filesCloud/handleSoftwareNameOption",
  async (obj, { dispatch, getState }) => {
    try {
      const softwareListsRes = await softwareLists();
      if (softwareListsRes.data.code === 415) {
        dispatch(RsetUploadSoftwareNameOption(softwareListsRes.data.softwares));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleAccessLevelOption = createAsyncThunk(
  "filesCloud/handleAccessLevelOption",
  async (obj, { dispatch, getState }) => {
    try {
      //   const softwareListsRes = await softwareLists();
      //   console.log(softwareListsRes);
      //   if (softwareListsRes.data.code === 415) {
      //     dispatch(RsetUploadSoftwareNameOption(softwareListsRes.data.softwares));
      //   }
    } catch (ex) {
      console.log(ex);
    }
  }
);
export const handleResetUpload = createAsyncThunk(
  "filesCloud/handleResetUpload",
  async (obj, { dispatch, getState }) => {
    dispatch(RsetUploadSoftwareName(""));
    dispatch(RsetUploadAccessLevel(""));
    dispatch(RsetUploadVersion(""));
    dispatch(RsetUploadDescription(""));
    dispatch(RsetFormErrors(""));
  }
);

const filesCloudSlice = createSlice({
  name: "filesCloud",
  initialState,
  reducers: {
    RsetUploadSoftwareName: (state, { payload }) => {
      return { ...state, uploadSoftwareName: payload };
    },
    RsetUploadSoftwareNameOption: (state, { payload }) => {
      return { ...state, uploadSoftwareNameOption: payload };
    },
    RsetUploadAccessLevel: (state, { payload }) => {
      return { ...state, uploadAccessLevel: payload };
    },
    RsetUploadAccessLevelOption: (state, { payload }) => {
      return { ...state, uploadAccessLevelOption: payload };
    },
    RsetUploadVersion: (state, { payload }) => {
      return { ...state, uploadVersion: payload };
    },
    RsetUploadDescription: (state, { payload }) => {
      return { ...state, uploadDescription: payload };
    },
  },
});

export const {
  RsetUploadSoftwareName,
  RsetUploadSoftwareNameOption,
  RsetUploadAccessLevel,
  RsetUploadAccessLevelOption,
  RsetUploadVersion,
  RsetUploadDescription,
} = filesCloudSlice.actions;

export const selectUploadSoftwareName = (state) =>
  state.filesCloud.uploadSoftwareName;
export const selectUploadSoftwareNameOption = (state) =>
  state.filesCloud.uploadSoftwareNameOption;
export const selectUploadAccessLevel = (state) =>
  state.filesCloud.uploadAccessLevel;
export const selectUploadAccessLevelOption = (state) =>
  state.filesCloud.uploadAccessLevelOption;
export const selectUploadVersion = (state) => state.filesCloud.uploadVersion;
export const selectUploadDescription = (state) =>
  state.filesCloud.uploadDescription;

export default filesCloudSlice.reducer;
