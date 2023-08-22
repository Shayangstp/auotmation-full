import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    acceptReqModal: false,
    nextAcceptReqModal: false,
    cancelReqModal: false,
    editReqModal: false,
    viewReqModal: false,
    deleteReqModal: false,
    reqHistoryModal: false,
    changeUserInfoModal: false,
    deleteReqItemModal: false,
    acceptReqComment: '',
    cancelReqComment: '',
    viewReqComment: '',
    sendTo: '',
    sendToOptions: [],
    resetFormModal: false,
    setSupervisorModal: false,
    processModal: false
};

const modalsSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        RsetAcceptReqModal: (state, action) => {
            return { ...state, acceptReqModal: action.payload };
        },
        RsetNextAcceptReqModal: (state, action) => {
            return { ...state, nextAcceptReqModal: action.payload };
        },
        RsetCancelReqModal: (state, action) => {
            return { ...state, cancelReqModal: action.payload };
        },
        RsetEditReqModal: (state, action) => {
            return { ...state, editReqModal: action.payload };
        },
        RsetViewReqModal: (state, action) => {
            return { ...state, viewReqModal: action.payload };
        },
        RsetDeleteReqModal: (state, action) => {
            return { ...state, deleteReqModal: action.payload };
        },
        RsetReqHistoryModal: (state, action) => {
            return { ...state, reqHistoryModal: action.payload };
        },
        RsetChangeUserInfoModal: (state, action) => {
            return { ...state, changeUserInfoModal: action.payload };
        },
        RsetDeleteReqItemModal: (state, action) => {
            return { ...state, deleteReqItemModal: action.payload };
        },
        RsetAcceptReqComment: (state, action) => {
            return { ...state, acceptReqComment: action.payload };
        },
        RsetCancelReqComment: (state, action) => {
            return { ...state, cancelReqComment: action.payload };
        },
        RsetViewReqComment: (state, action) => {
            return { ...state, viewReqComment: action.payload };
        },
        RsetSendTo: (state, action) => {
            return { ...state, sendTo: action.payload };
        },
        RsetSendToOptions: (state, action) => {
            return { ...state, sendToOptions: action.payload };
        },
        RsetResetFormModal: (state, action) => {
            return { ...state, resetFormModal: action.payload };
        },
        RsetSetSupervisorModal: (state, action) => {
            return { ...state, setSupervisorModal: action.payload };
        },
        RsetProcessModal: (state, action) => {
            return { ...state, processModal: action.payload };
        },
    },
    extraReducers: {

    }
});

export const {
    RsetAcceptReqModal,
    RsetNextAcceptReqModal,
    RsetCancelReqModal,
    RsetEditReqModal,
    RsetViewReqModal,
    RsetDeleteReqModal,
    RsetReqHistoryModal,
    RsetChangeUserInfoModal,
    RsetDeleteReqItemModal,
    RsetAcceptReqComment,
    RsetCancelReqComment,
    RsetViewReqComment,
    RsetSendTo,
    RsetSendToOptions,
    RsetResetFormModal,
    RsetSetSupervisorModal,
    RsetProcessModal
} = modalsSlice.actions;

export const selectAcceptReqModal = (state) => state.modals.acceptReqModal;
export const selectNextAcceptReqModal = (state) => state.modals.nextAcceptReqModal;
export const selectCancelReqModal = (state) => state.modals.cancelReqModal;
export const selectEditReqModal = (state) => state.modals.editReqModal;
export const selectViewReqModal = (state) => state.modals.viewReqModal;
export const selectDeleteReqModal = (state) => state.modals.deleteReqModal;
export const selectReqHistoryModal = (state) => state.modals.reqHistoryModal;
export const selectChangeUserInfoModal = (state) => state.modals.changeUserInfoModal;
export const selectDeleteReqItemModal = (state) => state.modals.deleteReqItemModal;
export const selectAcceptReqComment = (state) => state.modals.acceptReqComment;
export const selectCancelReqComment = (state) => state.modals.cancelReqComment;
export const selectViewReqComment = (state) => state.modals.viewReqComment;
export const selectSendTo = (state) => state.modals.sendTo;
export const selectSendToOptions = (state) => state.modals.sendToOptions;
export const selectResetFormModal = (state) => state.modals.resetFormModal;
export const selectSetSupervisorModal = (state) => state.modals.setSupervisorModal;
export const selectProcessModal = (state) => state.modals.processModal;

export default modalsSlice.reducer;
