import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentReqHistory, getReqProcess, getCurrentReqItems } from '../../Services/rootServices';
import { RsetLoading } from "./mainSlices";
import { RsetProcessModal } from "./modalsSlice";
import { getITJReqFileList } from '../../Services/irantolJobReqServices';

const initialState = {
    currentReqInfo: '',
    currentReqId: '',
    currentReqType: '',
    currentReqDep: '',
    currentReqCo: '',
    currentReqItems: [],
    currentReqItem: {},
    currentReqComments: [],
    currentReqToPerson: '',
    currentReqProcess: [],
    currentReqFiles: []
};

export const handleCurrentReqItems = createAsyncThunk(
    "currentReq/handleCurrentReqItems",
    async ({reqId, reqType}, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const reqItemsRes = await getCurrentReqItems(reqId, reqType);
            if (reqItemsRes.data.code === 415) {
                dispatch(RsetCurrentReqItems(reqItemsRes.data.list));
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
  );

export const handleCurrentReqComments = createAsyncThunk(
    "currentReq/handleCurrentReqComments",
    async ({commentStatus, reqId, reqType}, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const commentsRes = await getCurrentReqHistory(commentStatus, reqId, reqType);
            if (commentsRes.data.code === 415) {
                dispatch(RsetCurrentReqComments(commentsRes.data.list));
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
  );
  export const handleReqProcess = createAsyncThunk(
    "currentReq/handleReqProcess",
    async (processValues, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const processRes = await getReqProcess(processValues);
            if (processRes.data.code === 415) {
                dispatch(RsetCurrentReqProcess(processRes.data.list));
                dispatch(RsetLoading(false));
                dispatch(RsetProcessModal(true));
            }else{
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
  );
  export const handleReqFiles = createAsyncThunk(
    "currentReq/handleReqFiles",
    async (reqId, index, multi, justShow, fileName, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const reqFilesRes = await getITJReqFileList(reqId, index, multi, justShow);
            if (reqFilesRes.data.code === 415) {
                dispatch(RsetCurrentReqProcess(reqFilesRes.data.list));
                dispatch(RsetLoading(false));
            } else if(reqFilesRes.data.size !== undefined){
                const url = window.URL.createObjectURL(reqFilesRes.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click()
                link.parentNode.removeChild(link);
            }else{
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
  );

const currentReqSlice = createSlice({
    name: "currentReq",
    initialState,
    reducers: {
        RsetCurrentReqInfo: (state, action) => {
            return { ...state, currentReqInfo: action.payload };
        },
        RsetCurrentReqId: (state, action) => {
            return { ...state, currentReqId: action.payload };
        },
        RsetCurrentReqType: (state, action) => {
            return { ...state, currentReqType: action.payload };
        },
        RsetCurrentReqDep: (state, action) => {
            return { ...state, currentReqDep: action.payload };
        },
        RsetCurrentReqCo: (state, action) => {
            return { ...state, currentReqCo: action.payload };
        },
        RsetCurrentReqItems: (state, action) => {
            return { ...state, currentReqItems: action.payload };
        },
        RsetCurrentReqItem: (state, action) => {
            return { ...state, currentReqItem: action.payload };
        },
        RsetCurrentReqComments: (state, action) => {
            return { ...state, currentReqComments: action.payload };
        },
        RsetCurrentReqToPerson: (state, action) => {
            return { ...state, currentReqToPerson: action.payload };
        },
        RsetCurrentReqProcess: (state, action) => {
            return { ...state, currentReqProcess: action.payload };
        },
        RsetCurrentReqFiles: (state, action) => {
            return { ...state, currentReqFiles: action.payload };
        },
    },
    extraReducers: {

    }
});

export const {
    RsetCurrentReqInfo,
    RsetCurrentReqId,
    RsetCurrentReqType,
    RsetCurrentReqDep,
    RsetCurrentReqCo,
    RsetCurrentReqItems,
    RsetCurrentReqItem,
    RsetCurrentReqComments,
    RsetCurrentReqToPerson,
    RsetCurrentReqProcess,
    RsetCurrentReqFiles
} = currentReqSlice.actions;

export const selectCurrentReqInfo = (state) => state.currentReq.currentReqInfo;
export const selectCurrentReqId = (state) => state.currentReq.currentReqId;
export const selectCurrentReqType = (state) => state.currentReq.currentReqType;
export const selectCurrentReqDep = (state) => state.currentReq.currentReqDep;
export const selectCurrentReqCo = (state) => state.currentReq.currentReqCo;
export const selectCurrentReqItems = (state) => state.currentReq.currentReqItems;
export const selectCurrentReqItem = (state) => state.currentReq.currentReqItem;
export const selectCurrentReqComments = (state) => state.currentReq.currentReqComments;
export const selectCurrentReqToPerson = (state) => state.currentReq.currentReqToPerson;
export const selectCurrentReqProcess = (state) => state.currentReq.currentReqProcess;
export const selectCurrentReqFiles = (state) => state.currentReq.currentReqFiles;

export default currentReqSlice.reducer;
