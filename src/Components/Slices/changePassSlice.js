import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkForResetPass, changeUserPassword } from '../../Services/accountService';
import { errorMessage, successMessage } from "../../utils/message";

const initialState = {
    showChangePassCom: false,
    changeUserPass: '',
    userFullName: '',
    changePassLevel: 1,
    changePassUserId: '',
};


// export const handleCheckForResetPass = createAsyncThunk(
//     "changePass/handleCheckForResetPass",
//     async (userValues, { dispatch, getState }) => {
//         try {
//             const checkForResetPassRes = await checkForResetPass(userValues);
//             if (checkForResetPassRes.data.result === 'accepted') {
//                 successMessage('رمز عبور با موفقیت بازیابی شد!');
//                 dispatch(RsetShowChangePassCom(false));
//                 // dispatch(RsetChangePassUserId(checkForResetPassRes.data.id));
//             } else if(checkForResetPassRes.data.result === 'code') {
//                 dispatch(RsetChangePassLevel(2));
//             } else if (checkForResetPassRes.data.result === 'rejected') {
//                 errorMessage('اطلاعات وارد شده اشتباه می باشد!');
//             } else {
//                 errorMessage('خطا!')
//             }
//         } catch (ex) {
//             
//         }
//     }
// );

export const handleChangeUserPass = createAsyncThunk(
    "changePass/handleChangeUserPass",
    async (status, { dispatch, getState }) => {
        try {
            const { changeUserPass } = getState().changePass;
            const changePassBTN = document.getElementById('changePassBTN');
            const res = await changeUserPassword(changeUserPass, status);
            if (res.data.FirstName !== undefined && res.data.LastName !== undefined) {
                dispatch(RsetUserFullName(res.data.FirstName + ' ' + res.data.LastName))
                changePassBTN.classList.remove('disabled');
            } else if (res.data.code === 415) {
                dispatch(RsetChangeUserPass(''));
                changePassBTN.classList.add('disabled');
                dispatch(RsetUserFullName(''));
                successMessage('رمز عبور با موفقیت تغییر یافت!');
            } else {
                errorMessage('خطا در انجام عملیات!');
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);

const changePassSlice = createSlice({
    name: "changePass",
    initialState,
    reducers: {
        RsetShowChangePassCom: (state, action) => {
            return { ...state, showChangePassCom: action.payload };
        },
        RsetChangeUserPass: (state, action) => {
            return { ...state, changeUserPass: action.payload };
        },
        RsetUserFullName: (state, action) => {
            return { ...state, userFullName: action.payload };
        },
        RsetChangePassLevel: (state, action) => {
            return { ...state, changePassLevel: action.payload };
        },
        RsetChangePassUserId: (state, action) => {
            return { ...state, changePassUserId: action.payload };
        },
    },
    extraReducers: {

    }
});

export const {
    RsetShowChangePassCom,
    RsetChangeUserPass,
    RsetUserFullName,
    RsetChangePassLevel,
    RsetChangePassUserId,
} = changePassSlice.actions;

export const selectShowChangePassCom = (state) => state.changePass.showChangePassCom;
export const selectChangeUserPass = (state) => state.changePass.changeUserPass;
export const selectUserFullName = (state) => state.changePass.userFullName;
export const selectChangePassLevel = (state) => state.changePass.changePassLevel;
export const selectChangePassUserId = (state) => state.changePass.changePassUserId;

export default changePassSlice.reducer;
