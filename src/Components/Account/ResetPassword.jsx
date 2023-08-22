import React, { Fragment, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from 'react-bootstrap';
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker2";
import { selectFormErrors, RsetFormErrors, selectUserName, RsetUserName, selectPassword, RsetPassword } from "../Slices/mainSlices";
import { context } from '../context/context';
import { selectChangePassLevel, selectChangePassUserId } from '../Slices/changePassSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const formErrors = useSelector(selectFormErrors);
    const userName = useSelector(selectUserName);
    const password = useSelector(selectPassword);
    const changePassLevel = useSelector(selectChangePassLevel);
    const changePassUserId = useSelector(selectChangePassUserId);

    const accountContext = useContext(context);
    const {
        personalCode,
        setPersonalCode,
        birthCertificateNumber,
        setBirthCertificateNumber,
        insuranceNumber,
        setInsuranceNumber,
        birthday,
        setBirthday,
        phoneNumber,
        setPhoneNumber,
        confirmPassword,
        setConfirmPassword,

        smsCode,
        setSmsCode,
        formatDisplayTime,
        timerMinutes,
        timerSeconds,
        toggleCountDown,
        handleSendSmsCode,

        handleCheckForResetPass
    } = accountContext;

    const [passType, setPassType] = useState('password');
    const handlePassType = () => {
        setPassType((passType) => (passType === 'password' ? 'text' : 'password'))
    }

    var pass = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;

    const validation = () => {
        var errors = {};
        const userNameValue = userName.replaceAll('-', '').replaceAll(' ', '');
        const personalCodeValue = personalCode.replaceAll('-', '').replaceAll(' ', '');
        const phoneNumberValue = phoneNumber.replaceAll('-', '').replaceAll(' ', '');
        if (!userName) {
            errors.userName = "واردکردن کد ملی اجباری است!";
        } else if (userNameValue.length < 10) {
            errors.userName = 'کد ملی باید 10 کاراکتر باشد!';
        }
        if (!personalCode) {
            errors.personalCode = "واردکردن کد پرسنلی اجباری است!";
        } else if (personalCodeValue.length < 10) {
            errors.personalCode = 'کد پرسنلی باید 7 کاراکتر باشد!';
        }
        if (!birthCertificateNumber) {
            errors.birthCertificateNumber = "واردکردن شماره شناسنامه اجباری است!";
        }
        if (!insuranceNumber) {
            errors.insuranceNumber = "واردکردن شماره بیمه اجباری است!";
        }
        if (!birthday) {
            errors.birthday = "واردکردن تاریخ تولد اجباری است!";
        }
        if (!phoneNumber) {
            errors.phoneNumber = "واردکردن شماره موبایل اجباری است!";
        } else if (phoneNumberValue.length < 10) {
            errors.phoneNumber = 'شماره موبایل باید 11 کاراکتر باشد!';
        }
        if (!password) {
            errors.password = "وارد کردن رمز اجباری است!";
        } else if (!pass.test(password)) {
            errors.password = "رمز عبور باید شامل حروف و عدد و حداقل 6 کاراکتر باشد!";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "وارد کردن تکرار رمز اجباری است!";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "رمزهای وارد شده یکسان نیستند!";
        }
        return errors;
    }
    const handleUserValuesForResetPass = (e) => {
        e.preventDefault();
        const userNameValue = userName.replaceAll('-', '').replaceAll(' ', '');
        const personalCodeValue = personalCode.replaceAll('-', '').replaceAll(' ', '');
        const phoneNumberValue = phoneNumber.replaceAll('-', '').replaceAll(' ', '');
        if (userNameValue !== '' && userNameValue.length === 10 && personalCodeValue !== '' && personalCodeValue.length === 7 && birthCertificateNumber !== '' && insuranceNumber !== '' && birthday !== null && phoneNumberValue.length === 11 && phoneNumber !== '' && password !== '' && pass.test(password) && confirmPassword !== '' && password === confirmPassword) {
            const userValues = {
                natcode: userNameValue,
                personelcode: personalCodeValue,
                sejeld: birthCertificateNumber,
                bimeh: insuranceNumber,
                birthdate: birthday,
                phone: phoneNumberValue,
                password: password,
            }
            handleCheckForResetPass(userValues);
        } else {
            dispatch(RsetFormErrors(
                validation({
                    userName: userName,
                    personalCode: personalCode,
                    birthCertificateNumber: birthCertificateNumber,
                    insuranceNumber: insuranceNumber,
                    birthday: birthday,
                    phoneNumber: phoneNumber,
                    password: password,
                    confirmPassword: confirmPassword
                })
            ));
        }
    }

    const timerColor = () => {
        if (timerMinutes === 1 && timerSeconds >= 0) {
            return 'text-success'
        } else if (timerMinutes === 0 && timerSeconds >= 30) {
            return 'text-warning'
        } else if (timerMinutes === 0 && timerSeconds < 30) {
            return 'text-danger'
        }
    }

    const codeValidation = () => {
        var errors = {};
        if (!smsCode) {
            errors.smsCode = "واردکردن کد اجباری است!";
        }
        return errors;
    }

    const sendCode = (e) => {
        e.preventDefault();
        if (smsCode !== '') {
            handleSendSmsCode(smsCode, 1, 'resetPass')
        } else {
            dispatch(RsetFormErrors(
                codeValidation({
                    smsCode: smsCode,
                })
            ));
        }
    }

    useEffect(() => {
        if (changePassLevel === 2) {
            toggleCountDown(2);
        }
    }, [changePassLevel])
    return (
        <Form>
            {changePassLevel === 1
                ? <Fragment>
                    <Form.Group className='mb-4'>
                        <NumberFormat type="text" value={userName} name="userName" id='registerUserName' onChange={(e) => { dispatch(RsetUserName(e.target.value)); }} format="# # # # # # # # # #" mask='-' dir='ltr' placeholder='کدملی' />
                        {!userName || userName.replaceAll('-', '').replaceAll(' ', '').length < 10 ?
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.userName}
                            </p>
                            : null}
                    </Form.Group >
                    <Form.Group className="mb-4">
                        <NumberFormat type="text" value={personalCode} name="personalCode" id='registerPersonalCode' onChange={(e) => { setPersonalCode(e.target.value) }} format="# # # # # # #" mask='-' dir='ltr' placeholder='کدپرسنلی' />
                        {!personalCode || personalCode.replaceAll('-', '').replaceAll(' ', '').length < 7 ?
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.personalCode}
                            </p>
                            : null}
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <NumberFormat type="text" value={birthCertificateNumber} name="birthCertificateNumber" id='registerBirthCertificateNumber' onChange={(e) => { setBirthCertificateNumber(e.target.value); }} maxLength='10' dir='ltr' placeholder='شماره شناسنامه' />
                        {!birthCertificateNumber && (
                            <p className="font12 text-warning  mb-0 mt-1">
                                {formErrors.birthCertificateNumber}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <NumberFormat type="text" value={insuranceNumber} name="insuranceNumber" id='' onChange={(e) => { setInsuranceNumber(e.target.value) }} dir='ltr' placeholder='شماره بیمه' />
                        {!insuranceNumber && (
                            <p className="font12 text-warning  mb-0 mt-1">
                                {formErrors.insuranceNumber}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <DatePicker inputReadOnly name='birthday' isGregorian={false} timePicker={false} showTodayButton={false} inputFormat="YYYY-MM-DD"
                            inputJalaaliFormat="jYYYY/jMM/jDD" value={birthday} className="form-control" onChange={e => { setBirthday(e); }} placeholder='تاریخ تولد' />
                        {!birthday && (
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.birthday}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <NumberFormat type="text" value={phoneNumber} name="phoneNumber" onChange={(e) => { setPhoneNumber(e.target.value) }} format="# # # # # # # # # # #" mask='-' dir='ltr' placeholder='شماره موبایل' />
                        {!phoneNumber || phoneNumber.replaceAll('-', '').replaceAll(' ', '').length < 11 ?
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.phoneNumber}
                            </p>
                            : null}
                    </Form.Group>
                    <Form.Group className='mb-4 position-relative'>
                        <Form.Control type={passType} dir="ltr" id='passInput' autoComplete='new-password' value={password} name="password" onChange={(e) => { dispatch(RsetPassword(e.target.value)) }} placeholder='رمز عبور جدید' />
                        <FontAwesomeIcon icon={faEye} className='position-absolute cursorPointer' onClick={handlePassType} />
                        {!password || !pass.test(password) ?
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.password}
                            </p>
                            : null}
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Control type={passType} dir="ltr" value={confirmPassword} name="confirmPassword" onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder='تکرار رمز عبور جدید' />
                        {!confirmPassword || confirmPassword !== password ?
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.confirmPassword}
                            </p>
                            : null}
                    </Form.Group>
                    <button type="button" className="btn w-100 text-white border-0 buttonDesign" onClick={(e) => {
                        handleUserValuesForResetPass(e)
                    }}>بازیابی رمز عبور</button>
                </Fragment>
                :
                <Fragment>
                    <Form.Group className='mb-4'>
                        <NumberFormat className='form-control' placeholder='code' type="text" value={smsCode} name="smsCode" onChange={(e) => {
                            setSmsCode(e.target.value);
                        }} dir='ltr' format='#####' mask='-' />
                        {!smsCode && (
                            <p className="font12 text-warning mb-0 mt-1">
                                {formErrors.smsCode}
                            </p>
                        )}
                        <div className={`mt-2 font12 fw-bold bg-white ${timerColor()}`}>زمان باقی مانده: <span className='fw-bold'>{formatDisplayTime(timerMinutes)}:{formatDisplayTime(timerSeconds)}</span></div>
                    </Form.Group>
                    <button type="button" className="btn w-100 text-white border-0 buttonDesign" onClick={(e) => {
                        sendCode(e)
                    }}>ارسال</button>
                </Fragment>
            }
        </Form>
    )
}

export default ResetPassword;