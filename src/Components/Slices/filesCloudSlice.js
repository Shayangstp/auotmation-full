import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cloudAccMode, cloudAppName, cloudFileList, downloadFileCloud, getUploudFile } from "../../Services/r-ghanavatian/fileCloud";
import { postAction } from "../../Services/r-ghanavatian/mainApi";
import { errorMessage, successMessage } from "../../utils/message";
import { RsetIsLoadingCheckout, RsetRealFilter } from "./mainSlices";
const initialState = {
    allAppName: [],
    allAccessMode: [],
    appName: "",
    accessMode: "",

    version: "",
    fileData: "",
    description: "",
    formErrors: {},
    allCloudList: [],
    allMemberCloudList: [],

    fromDateFiterFC: null,
    toDateFiterFC: null,
    serialNumFiterFC: "",
    appNameFilterFC: "",
    userNameReqFilterFC: [],
    fileNameFilterFC: ""
};



export const handleResetFileCloud = createAsyncThunk(
    "filesCloud/handleResetFileCloud", (obj, { dispatch }) => {
        dispatch(RsetAppName(""))
        dispatch(RsetAccessMode(""))
        dispatch(RsetVersion(""))
        dispatch(RsetDescriptionCloudFile(""))
        dispatch(RsetErrorFormsFilesCloud(""))
        dispatch(RsetFileData(""))
        document.getElementById('cloudFile').value = '';
    }
)


// -> Post uploud file
export const handleUploder = createAsyncThunk(`filesCloud/handleUploder `,
    async (obj, { getState, dispatch }) => {
        const { appName, accessMode, description, version, fileData, exeCond } = getState().filesCloud
        var uploadFiles = [];
        let values = {}
        if (version !== '') {
            values = {
                application: appName !== "" ? appName.value : "",
                accessMode: accessMode !== "" ? accessMode.value : "",
                version: version,
                description: description,
            }
        } else {
            values = {
                application: appName !== "" ? appName.value : "",
                accessMode: accessMode !== "" ? accessMode.value : "",
                description: description,
            }
        }
        const data = new FormData();
        for (var x = 0; x < fileData.length; x++) {
            data.append('reqFiles', fileData[x]);
        }
        uploadFiles = data;
        const resUplodeFile = await getUploudFile(uploadFiles, values)
        if (resUplodeFile.data.code === 415) {
            const ActionValues = {
                actionId: resUplodeFile.data.id,
                actionCode: 0,
                userId: localStorage.getItem("id"),
                typeId: 15,
            };
            const resActionCodeUploder = await postAction(ActionValues)
            successMessage("فایل مورد نظر با موفقیت ارسال شد.")
            dispatch(handleResetFileCloud())
            return resUplodeFile.data
        } else {
            errorMessage("عملیات ناموفق بود لطفا دوباره امتحان کنید.")
        }
    })

// -> Access mode
export const handleAccMode = createAsyncThunk(`filesCloud/handleAccMode `,
    async () => {
        const resAccMode = await cloudAccMode()
        if (resAccMode.data.length !== undefined && resAccMode.data.length !== 0) {
            return resAccMode.data
        } else {
            errorMessage(" دسترسی یافت نشد!")
            return []
        }
    })

// -> Handle cloud file list
export const handleCloudListFile = createAsyncThunk(`filesCloud/handleCloudListFile `,
    async (filterValues, { dispatch }) => {
        const resAccMode = await cloudFileList(filterValues)
        dispatch(RsetIsLoadingCheckout(true))
        if (resAccMode.data.length !== 0) {
            dispatch(RsetIsLoadingCheckout(false))
            return resAccMode.data
        } else {
            errorMessage("اطلاعات یافت نشد!")
        }
    })

// -> The name applications
export const handleAppName = createAsyncThunk(`filesCloud/handleAppName `,
    async () => {
        const resAppName = await cloudAppName()
        if (resAppName.data.length !== undefined && resAppName.data.length !== 0) {
            return resAppName.data
        } else {
            errorMessage(" نام نرم افزار یافت نشد!");
            return []
        }
    })

// -> download cloud file
export const handleDownloadFile = createAsyncThunk(`filesCloud/handleDownloadFile `,
    async ({ reqId, fileName }) => {
        const resDownloadFileCloud = await downloadFileCloud(reqId)
        const url = window.URL.createObjectURL(resDownloadFileCloud.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click()
        link.parentNode.removeChild(link);
    }
)

// -> Reset file list 
export const handleResetListFile = createAsyncThunk(`filesCloud/handleResetListFile `,
    (filterValues, { dispatch }) => {
        dispatch(handleCloudListFile())
        dispatch(RsetFileNameFilterFC(""))
        dispatch(RsetRealFilter(false))
        dispatch(RsetSerialFilterFC(""))
        dispatch(RsetUserNameReqFilterFC(""))
        dispatch(RsetAppNameFilterFC(""))
        dispatch(RsetFromDateFilterFC(null))
        dispatch(RsetToDateFilterFC(null))
    })

//  -> Clod files slice
const filesCloudSlice = createSlice({
    name: "filesCloud",
    initialState,
    reducers: {
        RsetAppName: (state, { payload }) => {
            return { ...state, appName: payload };
        },
        RsetFileData: (state, { payload }) => {
            return { ...state, fileData: payload };
        },
        RsetDescriptionCloudFile: (state, { payload }) => {
            return { ...state, description: payload };
        },
        RsetAccessMode: (state, { payload }) => {
            return { ...state, accessMode: payload };
        },
        RsetVersion: (state, { payload }) => {
            return { ...state, version: payload };
        },
        RsetErrorFormsFilesCloud: (state, { payload }) => {
            return { ...state, formErrors: payload };
        },
        RsetFromDateFilterFC: (state, { payload }) => {
            return { ...state, fromDateFiterFC: payload };
        },
        RsetToDateFilterFC: (state, { payload }) => {
            return { ...state, toDateFiterFC: payload };
        },
        RsetAppNameFilterFC: (state, { payload }) => {
            return { ...state, appNameFilterFC: payload };
        },
        RsetSerialFilterFC: (state, { payload }) => {
            return { ...state, serialFilterFC: payload };
        },
        RsetUserNameReqFilterFC: (state, { payload }) => {
            return { ...state, userNameReqFilterFC: payload };
        },
        RsetFileNameFilterFC: (state, { payload }) => {
            return { ...state, fileNameFilterFC: payload };
        },
    },
    extraReducers: {
        [handleAccMode.fulfilled]: (state, { payload }) => {
            return { ...state, allAccessMode: payload }
        },
        [handleAppName.fulfilled]: (state, { payload }) => {
            return { ...state, allAppName: payload }
        },
        [handleCloudListFile.fulfilled]: (state, { payload }) => {
            return { ...state, allCloudList: payload.list, allMemberCloudList: payload.members }
        },

    },
});

export const {
    RsetSoftwareName,
    RsetVersion,
    RsetAppName,
    RsetFileData,
    RsetDescriptionCloudFile,
    RsetAccessMode, RsetErrorFormsFilesCloud, RsetSerialFilterFC, RsetToDateFilterFC, RsetFromDateFilterFC
    , RsetAppNameFilterFC, RsetUserNameReqFilterFC, RsetFileNameFilterFC,
} = filesCloudSlice.actions;

export const selectAllAppName = (state) => state.filesCloud.allAppName;
export const selectAllAccessMode = (state) => state.filesCloud.allAccessMode;
export const selectAccessMode = (state) => state.filesCloud.accessMode;
export const selectAppName = (state) => state.filesCloud.appName;

export const selectFromDateFilterFC = (state) => state.filesCloud.fromDateFiterFC;
export const selectToDateFilterFC = (state) => state.filesCloud.toDateFiterFC;
export const selectAppNameFilterFC = (state) => state.filesCloud.appNameFilterFC;
export const selectSerialFilterFC = (state) => state.filesCloud.serialFilterFC;
export const selectUserNameReqFilterFC = (state) => state.filesCloud.userNameReqFilterFC;
export const selectFileNameFilterFC = (state) => state.filesCloud.fileNameFilterFC;

export const selectFileData = (state) => state.filesCloud.fileData;
export const selectFormErrorsFileCloud = (state) => state.filesCloud.formErrors;

export const selectVersion = (state) => state.filesCloud.version;
export const selectDescriptionCloudFile = (state) => state.filesCloud.description;
export const selectAllCloudList = (state) => state.filesCloud.allCloudList;
export const selectAllMemberCloudList = (state) => state.filesCloud.allMemberCloudList;

export default filesCloudSlice.reducer;