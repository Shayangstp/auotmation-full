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
import { getCloudAccessList } from "../../Services/cloudFileService";
import {
  submitCloud,
  getFileCloudDownload,
} from "../../Services/cloudFileService";
const initialState = {
  uploadSoftwareName: "",
  uploadSoftwareNameOption: [],
  uploadFile: "",
  uploadAccessLevel: "",
  uploadAccessLevelOption: [],
  uploadVersion: "",
  uploadDescription: "",
  //filters
  uploadSoftwareNameFilter: "",
  uploadSoftwareNameFilterOption: [],
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
      const getCloudAccessListRes = await getCloudAccessList();
      if (getCloudAccessListRes.data.code === 415) {
        dispatch(RsetUploadAccessLevelOption(getCloudAccessListRes.data.list));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleUploadSubmit = createAsyncThunk(
  "filesCloud/handleUploadSubmit",
  async (obj, { dispatch, getState }) => {
    const {
      uploadSoftwareName,
      uploadAccessLevel,
      uploadVersion,
      uploadDescription,
      uploadFile,
    } = getState().filesCloud;
    try {
      let files = [];
      const data = new FormData();
      for (var x = 0; x < uploadFile.length; x++) {
        data.append("reqFiles", uploadFile[x]);
      }
      files = data;
      const values = {
        softwareName: uploadSoftwareName.value,
        softwareAccessId: uploadAccessLevel.value,
        softwareVersion: uploadVersion,
        description: uploadDescription,
        userId: localStorage.getItem("id"),
      };
      console.log(values);
      const submitCloudRes = await submitCloud(files, values);
      console.log(submitCloudRes);
      if (submitCloudRes.data.code === 415) {
        files = [];
        dispatch(RsetUploadFile(""));
        successMessage("آپلود فایل با موفقیت انجام شد");
        dispatch(handleResetUpload());
      } else {
        errorMessage("خطا !");
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const handleReqFiles = createAsyncThunk(
  "filesCloud/handleReqFiles",
  async (reqId, { dispatch, getState }) => {
    try {
      const getFileCloudDownloadRes = await getFileCloudDownload(reqId);
      console.log(getFileCloudDownloadRes);
    } catch (err) {
      console.log(err);
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
    dispatch(RsetUploadFile(""));
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
    RsetUploadFile: (state, { payload }) => {
      return { ...state, uploadFile: payload };
    },
    //filters
    RsetUploadSoftwareNameFilter: (state, { payload }) => {
      return { ...state, uploadSoftwareNameFilter: payload };
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
  RsetUploadFile,
  //filters
  RsetUploadSoftwareNameFilter,
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
export const selectUploadFile = (state) => state.filesCloud.uploadFile;
export const selectUploadSoftwareNameFilter = (state) =>
  state.filesCloud.uploadSoftwareNameFilter;

export default filesCloudSlice.reducer;
