import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postAction } from "../../Services/rootServices";
import { getUsersByCo, getLeaveTypes, postOfficeLeaveReq, getOfficeLeaveDays, editLeaveReq } from '../../Services/officeServices';
import { RsetFormErrors, RsetActionToPersonsModal } from "./mainSlices";
import { RsetCurrentReqInfo } from "./currentReqSlice";
import { errorMessage, successMessage } from "../../utils/message";
import moment from "moment-jalaali";
import users from '../../data/usersInfo.json';
import { RsetDeleteReqModal, RsetEditReqModal } from './modalsSlice';

const initialState = {
    leaveStatus: '',
    dailyLeave: true,
    leaveType: '',
    leaveTypeOptions: [],
    leaveFromDate: null,
    leaveToDate: null,
    leaveDescription: '',
    leaveDate: null,
    leaveFromHours: '',
    leaveFromMinutes: '',
    leaveToHours: '',
    leaveToMinutes: '',

    leaveUsers: [],
    searchInput: '',
    inDecLeaveType: true,
    inDecLeaveReason: '',
    inDecLeaveMinutes: '',
    inDecLeaveUser: ''
};
export const handleGetLeaveStatus = createAsyncThunk(
    "leave/handleGetLeaveStatus",
    async (obj, { dispatch, getState }) => {
        try {
            const remainderRes = await getOfficeLeaveDays();
            if (remainderRes.data.code === 415) {
                dispatch(RsetLeaveStatus(remainderRes.data));
            } else {
                dispatch(RsetLeaveStatus(''));
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);
export const handleGetLeaveTypeList = createAsyncThunk(
    "leave/handleGetLeaveTypeList",
    async (reqType, { dispatch, getState }) => {
        try {
            const { data } = await getLeaveTypes(reqType);
            if (data.code === 415) {
                dispatch(RsetLeaveTypeOptions(data.types));
            } else {
                dispatch(RsetLeaveTypeOptions([]));
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);
export const handleSubmitNewLeaveReq = createAsyncThunk(
    "leave/handleSubmitNewLeaveReq",
    async (reqType, { dispatch, getState }) => {
        try {
            const { dailyLeave, leaveType, leaveFromDate, leaveToDate, leaveDescription, leaveDate, leaveFromHours, leaveFromMinutes, leaveToHours, leaveToMinutes } = getState().leave;
            const leaveDate1 = new Date(leaveDate);
            var fromDate, toDate;
            if (!dailyLeave) {
                var year = leaveDate1.toLocaleString('en-US', { year: 'numeric' })
                var month = leaveDate1.toLocaleString('en-US', { month: '2-digit' })
                var day = leaveDate1.toLocaleString('en-US', { day: '2-digit' })
                fromDate = moment.utc(`${year}-${month}-${day}T${leaveFromHours}:${leaveFromMinutes}:00.00+03:30`);
                toDate = moment.utc(`${year}-${month}-${day}T${leaveToHours}:${leaveToMinutes}:00.00+03:30`);
            } else {
                fromDate = leaveFromDate;
                toDate = leaveToDate
            }
            if (fromDate < toDate) {
                const officeLeaveReqValues = {
                    leaveKind: dailyLeave ? 1 : 0,
                    leaveTypeId: leaveType.value,
                    startDate: fromDate,
                    endDate: toDate,
                    description: leaveDescription,
                }
                const { data } = await postOfficeLeaveReq(officeLeaveReqValues);
                if (data.code === 415) {
                    const id = {
                        requestId: data.id
                    }
                    dispatch(RsetCurrentReqInfo(id));
                    const officeLeaveActionValues = {
                        actionId: data.id,
                        actionCode: 0,
                        userId: localStorage.getItem('id'),
                        typeId: 4
                    }
                    const leaveActionRes = await postAction(officeLeaveActionValues);
                    if (leaveActionRes.data.code === 415) {
                        dispatch(RsetActionToPersonsModal(true));
                        successMessage('درخواست مرخصی با موفقیت ثبت شد!');
                    }
                } else {
                    errorMessage('خطا در ثبت درخواست!');
                }
            } else {
                errorMessage('تاریخ شروع نمی تواند بزرگ تر از تاریخ اتمام باشد!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);
export const handleResetNewLeaveReq = createAsyncThunk(
    "leave/handleResetNewLeaveReq",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetDailyLeave(true));
        dispatch(RsetLeaveType(''));
        dispatch(RsetLeaveFromDate(null));
        dispatch(RsetLeaveToDate(null));
        dispatch(RsetLeaveDate(null));
        dispatch(RsetLeaveDescription(''));
        dispatch(RsetLeaveFromHours(''));
        dispatch(RsetLeaveFromMinutes(''));
        dispatch(RsetLeaveToHours(''));
        dispatch(RsetLeaveToMinutes(''));
        const sendToPersons = document.getElementById('sendToPersons');
        const confirmReq = document.getElementById('confirmReq');
        if (sendToPersons !== null) {
            sendToPersons.classList.add('disabled');
        }
        if (confirmReq !== null) {
            confirmReq.classList.remove('disabled');
        }
    }
);
export const handleEditLeaveReq = createAsyncThunk(
    "leave/handleEditLeaveReq",
    async (obj, { dispatch, getState }) => {
        try {
            const { currentReqInfo } = getState().currentReq;
            const { leaveFromDate, leaveFromHours, leaveFromMinutes, leaveToDate, leaveToHours, leaveToMinutes, leaveDate, leaveDescription, leaveType } = getState().leave;

            const leaveDate1 = new Date(leaveDate);
            var fromDate, toDate;
            if (currentReqInfo.leaveKind === 0) {
                var year = leaveDate1.toLocaleString('en-US', { year: 'numeric' })
                var month = leaveDate1.toLocaleString('en-US', { month: '2-digit' })
                var day = leaveDate1.toLocaleString('en-US', { day: '2-digit' })
                fromDate = moment.utc(`${year}-${month}-${day}T${leaveFromHours}:${leaveFromMinutes}:00.00+03:30`);
                toDate = moment.utc(`${year}-${month}-${day}T${leaveToHours}:${leaveToMinutes}:00.00+03:30`);
            } else {
                fromDate = leaveFromDate;
                toDate = leaveToDate
            }
            const from = () => {
                let newFrom = new Date(fromDate).toLocaleDateString('fa-IR', { numberingSystem: 'ltn', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                let oldFrom = new Date(currentReqInfo.startDate).toLocaleDateString('fa-IR', { numberingSystem: 'ltn', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                if (newFrom === oldFrom) {
                    return true;
                } else {
                    return false;
                }
            }
            const to = () => {
                let newTo = new Date(toDate).toLocaleDateString('fa-IR', { numberingSystem: 'ltn', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                let oldTo = new Date(currentReqInfo.endDate).toLocaleDateString('fa-IR', { numberingSystem: 'ltn', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                if (newTo === oldTo) {
                    return true;
                } else {
                    return false;
                }
            }
            const editedLeaveValues = {
                startDate: from() === false ? fromDate : undefined,
                endDate: to() === false ? toDate : undefined,
                leaveKind: undefined,
                leaveType: currentReqInfo.leaveTypeId !== leaveType.value ? leaveType.value : undefined,
                description: currentReqInfo.description !== leaveDescription || leaveDescription !== '' ? leaveDescription : undefined
            }
            if (editedLeaveValues.startDate === undefined && editedLeaveValues.endDate === undefined && editedLeaveValues.leaveType === undefined && editedLeaveValues.description === undefined) {
                errorMessage('هیچ تغییری اعمال نشده است!');
            } else {
                const editLeaveReqRes = await editLeaveReq(currentReqInfo.requestId, editedLeaveValues);
                if (editLeaveReqRes.data.code === 415) {
                    dispatch(RsetEditReqModal(false));
                    successMessage('درخواست با موفقیت ویرایش شد!');
                } else {
                    errorMessage('خطا در ویرایش اطلاعات!');
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

export const handleUsersByCo = createAsyncThunk(
    "leave/handleUsersByCo",
    async (obj, { dispatch, getState }) => {
        const { userLogin } = await getState().mainHome;
        try {
            dispatch(RsetLeaveUsers(users.users));
            // const users = await getUsersByCo(userLogin.company.CompanyCode, userLogin.location);
            // if(users.data){
            //     dispatch(RsetLeaveUsers(users.data));
            // }else{
            //     dispatch(RsetLeaveUsers([]));
            // }
        } catch (ex) {
            console.log(ex);
        }
    }
);

export const handleResetGroupLeaveForm = createAsyncThunk(
    "leave/handleResetInDecLeaveForm",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetDailyLeave(true));
        dispatch(RsetLeaveFromDate(null));
        dispatch(RsetLeaveToDate(null));
        dispatch(RsetLeaveDescription(''));
        dispatch(RsetFormErrors({}));
    }
);
export const handleResetInDecLeaveForm = createAsyncThunk(
    "leave/handleResetInDecLeaveForm",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetInDecLeaveUser(''));
        dispatch(RsetInDecLeaveType(true));
        dispatch(RsetInDecLeaveReason(''));
        dispatch(RsetInDecLeaveMinutes(''));
        dispatch(RsetLeaveDescription(''));
        dispatch(RsetFormErrors({}));
    }
);

export const handleDeleteReq = createAsyncThunk(
    "leave/handleDeleteReq",
    async (obj, { dispatch, getState }) => {
        try {
            const { currentReqInfo } = getState().currentReq;
            const { handleReqsList } = getState().mainHome;
            const actionValues = {
                actionId: currentReqInfo.requestId,
                actionCode: 16,
                userId: localStorage.getItem('id'),
                typeId: 4
            }
            const actionRes = await postAction(actionValues);
            if (actionRes.data.code === 415) {
                dispatch(RsetDeleteReqModal(false));
                const filterValues = {
                    applicantId: localStorage.getItem('id'),
                    serial: '',
                    memberId: '',
                    status: '',
                    fromDate: 'null',
                    toDate: 'null',
                    year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
                    type: 4,
                    group: 0
                }
                dispatch(handleReqsList(filterValues));
                successMessage('درخواست مرخصی با موفقیت حذف شد!')
            } else {
                dispatch(RsetDeleteReqModal(false));
                errorMessage('خطا در انجام عملیات!');
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

const leaveSlice = createSlice({
    name: "leave",
    initialState,
    reducers: {
        RsetLeaveStatus: (state, action) => {
            return { ...state, leaveStatus: action.payload };
        },
        RsetDailyLeave: (state, action) => {
            return { ...state, dailyLeave: action.payload };
        },
        RsetLeaveType: (state, action) => {
            return { ...state, leaveType: action.payload };
        },
        RsetLeaveTypeOptions: (state, action) => {
            return { ...state, leaveTypeOptions: action.payload };
        },
        RsetLeaveFromDate: (state, action) => {
            return { ...state, leaveFromDate: action.payload };
        },
        RsetLeaveToDate: (state, action) => {
            return { ...state, leaveToDate: action.payload };
        },
        RsetLeaveDescription: (state, action) => {
            return { ...state, leaveDescription: action.payload };
        },
        RsetLeaveDate: (state, action) => {
            return { ...state, leaveDate: action.payload };
        },
        RsetLeaveFromHours: (state, action) => {
            return { ...state, leaveFromHours: action.payload };
        },
        RsetLeaveFromMinutes: (state, action) => {
            return { ...state, leaveFromMinutes: action.payload };
        },
        RsetLeaveToHours: (state, action) => {
            return { ...state, leaveToHours: action.payload };
        },
        RsetLeaveToMinutes: (state, action) => {
            return { ...state, leaveToMinutes: action.payload };
        },

        RsetLeaveUsers: (state, action) => {
            return { ...state, leaveUsers: action.payload };
        },
        RsetSearchInput: (state, action) => {
            return { ...state, searchInput: action.payload };
        },
        RsetInDecLeaveType: (state, action) => {
            return { ...state, inDecLeaveType: action.payload };
        },
        RsetInDecLeaveReason: (state, action) => {
            return { ...state, inDecLeaveReason: action.payload };
        },
        RsetInDecLeaveMinutes: (state, action) => {
            return { ...state, inDecLeaveMinutes: action.payload };
        },
        RsetInDecLeaveUser: (state, action) => {
            return { ...state, inDecLeaveUser: action.payload };
        },
    },
    extraReducers: {

    }
});

export const {
    RsetLeaveStatus,
    RsetDailyLeave,
    RsetLeaveType,
    RsetLeaveTypeOptions,
    RsetLeaveFromDate,
    RsetLeaveToDate,
    RsetLeaveDescription,
    RsetLeaveDate,
    RsetLeaveFromHours,
    RsetLeaveFromMinutes,
    RsetLeaveToHours,
    RsetLeaveToMinutes,

    RsetLeaveUsers,
    RsetSearchInput,
    RsetInDecLeaveType,
    RsetInDecLeaveReason,
    RsetInDecLeaveMinutes,
    RsetInDecLeaveUser
} = leaveSlice.actions;

export const selectLeaveStatus = (state) => state.leave.leaveStatus;
export const selectDailyLeave = (state) => state.leave.dailyLeave;
export const selectLeaveType = (state) => state.leave.leaveType;
export const selectLeaveTypeOptions = (state) => state.leave.leaveTypeOptions;
export const selectLeaveFromDate = (state) => state.leave.leaveFromDate;
export const selectLeaveToDate = (state) => state.leave.leaveToDate;
export const selectLeaveDescription = (state) => state.leave.leaveDescription;
export const selectLeaveDate = (state) => state.leave.leaveDate;
export const selectLeaveFromHours = (state) => state.leave.leaveFromHours;
export const selectLeaveFromMinutes = (state) => state.leave.leaveFromMinutes;
export const selectLeaveToHours = (state) => state.leave.leaveToHours;
export const selectLeaveToMinutes = (state) => state.leave.leaveToMinutes;

export const selectLeaveUsers = (state) => state.leave.leaveUsers;
export const selectSearchInput = (state) => state.leave.searchInput;
export const selectInDecLeaveType = (state) => state.leave.inDecLeaveType;
export const selectInDecLeaveReason = (state) => state.leave.inDecLeaveReason;
export const selectInDecLeaveMinutes = (state) => state.leave.inDecLeaveMinutes;
export const selectInDecLeaveUser = (state) => state.leave.inDecLeaveUser;


export default leaveSlice.reducer;
