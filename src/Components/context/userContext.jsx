import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { context } from "./context";
import { cookiesContext } from "./Cookies/cookiesContext";
import { registerUser, userData, registerDate,
    getSupervisorsByCoDep, getUSerInfoBeforeRegister, checkPassCompleted,
    updateProfile, changeSupReq, checkForResetPass
} from "../../Services/accountService";
import { withRouter } from "react-router-dom";
import { successMessage, errorMessage, warningMessage } from "./../../utils/message";
import momentJalali from 'moment-jalaali';
import { postAction } from "../../Services/jobReqService";
import xssFilters from "xss-filters";

import { rootContext } from './rootContext';
import { selectUser, handleUserData } from '../Slices/mainSlices';
import { sendSmsCode } from '../../Services/rootServices';
import { RsetChangePassLevel, RsetShowChangePassCom, selectChangePassUserId, RsetChangePassUserId } from '../Slices/changePassSlice';

const UserContext = ({ children, history }) => {
    const changePassUserId = useSelector(selectChangePassUserId);
    const mainContext = useContext(rootContext);
    const {
        generateRanHex,
        setLoading,
        setAccountMode,
        handleGetNSeenCounters,
    } = mainContext;

    const cookieContext = useContext(cookiesContext);
    const {
        setCookie,
        getCookie
    } = cookieContext;

    const user = useSelector(selectUser);

    const [position, setPosition] = useState("");
    const positionRef = useRef();
    const [positionDisabled, setPositionDisabled] = useState(true);
    const [personalCode, setPersonalCode] = useState("");
    const personalCodeRef = useRef();
    const [personalCodeDisabled, setPersonalCodeDisabled] = useState(false);
    const [userName, setUserName] = useState("");
    const userNameRef = useRef();
    const [userNameDisabled, setUserNameDisabled] = useState(false);
    const [password, setPassword] = useState("");
    const passwordRef = useRef();
    const [passwordDisabled, setPasswordDisabled] = useState(true);
    const [gender, setGender] = useState("");
    const genderRef = useRef();
    const [genderDisabled, setGenderDisabled] = useState(true);
    const [fName, setFName] = useState("");
    const firstNameRef = useRef();
    const [fNameDisabled, setFNameDisabled] = useState(true);
    const [lName, setLName] = useState("");
    const lastNameRef = useRef();
    const [lNameDisabled, setLNameDisabled] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const confirmPasswordRef = useRef();
    const [confirmPasswordDisabled, setConfirmPasswordDisabled] = useState(true);
    const [birthday, setBirthday] = useState(null);
    const birthdayRef = useRef();
    const [birthdayDisabled, setBirthdayDisabled] = useState(true);
    const [email, setEmail] = useState("");
    const emailRef = useRef();
    const [emailDisabled, setEmailDisabled] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const phoneNumberRef = useRef();
    const [phoneNumberDisabled, setPhoneNumberDisabled] = useState(true);
    const [localPhoneNumber, setLocalPhoneNumber] = useState("");
    const localPhoneRef = useRef();
    const [localPhoneNumberDisabled, setLocalPhoneNumberDisabled] = useState(true);
    const [location, setLocation] = useState('');
    const locationRef = useRef();
    const [locationDisabled, setLocationDisabled] = useState(true);
    const [company, setCompany] = useState("");
    const companyRef = useRef();
    const [companyDisabled, setCompanyDisabled] = useState(true);
    const [department, setDepartment] = useState("");
    const departmentRef = useRef();
    const [departmentDisabled, setDepartmentDisabled] = useState(true);
    const [supervisor, setSupervisor] = useState("");
    const supervisorRef = useRef();
    const [supervisorDisabled, setSupervisorDisabled] = useState(true);
    const [avatar, setAvatar] = useState("");
    const [avatarType, setAvatarType] = useState("");
    const [avatarDisabled, setAvatarDisabled] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [personalCodeValidationClass, setpersonalCodeValidationClass] = useState("form-control");
    const [userNameValidationClass, setuserNameValidationClass] = useState("form-control");
    const [phoneNumberValidationClass, setPhoneNumberValidationClass] = useState("form-control");
    const [localPhoneValidationClass, setLocalPhoneValidationClass] = useState("form-control");
    const [verifyInfo, setVerifyInfo] = useState(false);
    const [verifyInfoDisabled, setVerifyInfoDisabled] = useState(true);
    const [registerDisabled, setRegisterDisabled] = useState(true);
    const [birthCertificateNumber, setBirthCertificateNumber] = useState("");
    const birthCertificateNumberRef = useRef();
    const [birthCertificateNumberDisabled, setBirthCertificateNumberDisabled] = useState(true);
    const [birthCertificateNumberValidationClass, setBirthCertificateNumberValidationClass] = useState("form-control");
    const [insuranceNumber, setInsuranceNumber] = useState("");
    const insuranceNumberRef = useRef();
    const [insuranceNumberDisabled, setInsuranceNumberDisabled] = useState(true);
    const [insuranceNumberValidationClass, setInsuranceNumberValidationClass] = useState("form-control");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const bankAccountNumberRef = useRef();
    const [bankAccountNumberDisabled, setBankAccountNumberDisabled] = useState(true);
    const [bankAccountNumberValidationClass, setBankAccountNumberValidationClass] = useState("form-control");
    // Profile
    const [fullNameChange, setFullNameChange] = useState(false);
    const [birthdayChange, setBirthdayChange] = useState(false);
    const [userNameChange, setUserNameChange] = useState(false);
    const [avatarChange, setAvatarChange] = useState(false);
    const [passwordChange, setPasswordChange] = useState(false);
    const [emailChange, setEmailChange] = useState(false);
    const [phoneNumberChange, setPhoneNumberChange] = useState(false);
    const [localPhoneChange, setLocalPhoneChange] = useState(false);
    const [departmentChange, setDepartmentChange] = useState(false);
    // Profile END

    const handleInputsEnter = () => {
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 13 && event.target.nodeName === 'INPUT' && event.target.form.className === 'row enter-in-form') {
                var form = event.target.form;
                var index = Array.prototype.indexOf.call(form, event.target);
                form.elements[index + 1].focus();
                event.preventDefault();
            }
        })
    }

    // useEffect(() => {
    //     handleInputsEnter();
    // }, []);

    const dispatch = useDispatch();

    const handleProfileUpload = e => {
        e.persist();
        setAvatar(e.target.files);
    }
    // Validation
    const validateBirthCertificateNumber = () => {
        if (birthCertificateNumberRef.current.state.numAsString.length === 0) {
            setBirthCertificateNumberValidationClass('form-control is-invalid')
            document.getElementById('birthCertificateNumber-required').classList.remove('d-none');
            return false;
        } else {
            setBirthCertificateNumberValidationClass('form-control is-valid')
            document.getElementById('birthCertificateNumber-required').classList.add('d-none');
            return true;
        }
    }
    const validateBankAccountNumber = () => {
        if (bankAccountNumberRef.current.state.numAsString.length === 0) {
            setBankAccountNumberValidationClass('form-control is-invalid')
            document.getElementById('bankAccountNumber-required').classList.remove('d-none');
            return false;
        } else {
            setBankAccountNumberValidationClass('form-control is-valid')
            document.getElementById('bankAccountNumber-required').classList.add('d-none');
            return true;
        }
    }
    const validateInsuranceNumber = () => {
        if (insuranceNumberRef.current.state.numAsString.length === 0) {
            setInsuranceNumberValidationClass('form-control is-invalid')
            document.getElementById('insuranceNumber-required').classList.remove('d-none');
            return false;
        } else {
            setInsuranceNumberValidationClass('form-control is-valid')
            document.getElementById('insuranceNumber-required').classList.add('d-none');
            return true;
        }
    }
    const validatePosition = () => {
        if (positionRef.current.props.value === "") {
            document.getElementById('position-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('position-required').classList.add('d-none');
            return true;
        }
    }
    const validatePersonalCode = () => {
        if (personalCodeRef.current.state.numAsString.length === 0) {
            setpersonalCodeValidationClass('form-control is-invalid')
            document.getElementById("personalCode-validation").classList.remove('d-none');
            document.getElementById("personalCode-validation2").classList.add('d-none');
            return false;
        } else if (personalCodeRef.current.state.numAsString.length < 7) {
            setpersonalCodeValidationClass('form-control is-invalid')
            document.getElementById("personalCode-validation").classList.remove('d-none');
            document.getElementById("personalCode-validation2").classList.add('d-none');
            return false;
        } else if (personalCodeRef.current.state.numAsString.length === 7 && personalCodeRef.current.state.numAsString.startsWith('6')) {
            setpersonalCodeValidationClass('form-control is-valid');
            document.getElementById("personalCode-validation").classList.add('d-none');
            document.getElementById("personalCode-validation2").classList.add('d-none');
            return true;
        } else if (!personalCodeRef.current.state.numAsString.startsWith('6')) {
            setpersonalCodeValidationClass('form-control is-invalid')
            document.getElementById("personalCode-validation").classList.add('d-none');
            document.getElementById("personalCode-validation2").classList.remove('d-none');
            return false;
        }
    }
    const validateGender = () => {
        if (genderRef.current.props.value === "") {
            document.getElementById('gender-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('gender-required').classList.add('d-none');
            return true;
        }
    }
    const validateFirstName = () => {
        if (firstNameRef.current.selectionStart === 0) {
            firstNameRef.current.classList.add('is-invalid');
            firstNameRef.current.classList.remove('is-valid');
            document.getElementById('firstName-required').classList.remove('d-none');
            document.getElementById("firstName-validation").classList.add('d-none');
            return false;
        } else if (firstNameRef.current.selectionStart < 3) {
            firstNameRef.current.classList.add('is-invalid');
            firstNameRef.current.classList.remove('is-valid');
            document.getElementById('firstName-required').classList.add('d-none');
            document.getElementById("firstName-validation").classList.remove('d-none');
            return false;
        } else if (firstNameRef.current.selectionStart >= 3) {
            firstNameRef.current.classList.remove('is-invalid');
            firstNameRef.current.classList.add('is-valid');
            document.getElementById('firstName-required').classList.add('d-none');
            document.getElementById("firstName-validation").classList.add('d-none');
            return true;
        }
    }
    const validateLastName = () => {
        if (lastNameRef.current.selectionStart === 0) {
            lastNameRef.current.classList.add('is-invalid');
            lastNameRef.current.classList.remove('is-valid');
            document.getElementById('lastName-required').classList.remove('d-none');
            document.getElementById("lastName-validation").classList.add('d-none');
            return false;
        } else if (lastNameRef.current.selectionStart < 3) {
            lastNameRef.current.classList.add('is-invalid');
            lastNameRef.current.classList.remove('is-valid');
            document.getElementById('lastName-required').classList.add('d-none');
            document.getElementById("lastName-validation").classList.remove('d-none');
            return false;
        } else if (lastNameRef.current.selectionStart >= 3) {
            lastNameRef.current.classList.remove('is-invalid');
            lastNameRef.current.classList.add('is-valid');
            document.getElementById('lastName-required').classList.add('d-none');
            document.getElementById("lastName-validation").classList.add('d-none');
            return true;
        }
    }
    const validateUserName = () => {
        function isValidIranianNationalCode(meli_code) {
            if (meli_code == '1111111111' || meli_code == '0000000000' ||
                meli_code == '2222222222' || meli_code == '3333333333' ||
                meli_code == '4444444444' || meli_code == '5555555555' ||
                meli_code == '6666666666' || meli_code == '7777777777' ||
                meli_code == '8888888888' || meli_code == '9999999999') {
                return false;
            }
            var c = parseInt(meli_code.charAt(9));
            var n = parseInt(meli_code.charAt(0)) * 10 + parseInt(meli_code.charAt(1)) * 9 +
                parseInt(meli_code.charAt(2)) * 8 + parseInt(meli_code.charAt(3)) * 7 +
                parseInt(meli_code.charAt(4)) * 6 + parseInt(meli_code.charAt(5)) * 5 +
                parseInt(meli_code.charAt(6)) * 4 + parseInt(meli_code.charAt(7)) * 3 +
                parseInt(meli_code.charAt(8)) * 2;
            var r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
                return true;
            } else {
                return false;
            }
        }
        if (userNameRef.current.state.numAsString.length === 0) {
            setuserNameValidationClass('form-control is-invalid')
            document.getElementById('userName-required').classList.remove('d-none');
            document.getElementById("userName-validation").classList.add('d-none');
            return false;
        } else if (userNameRef.current.state.numAsString.length < 10) {
            setuserNameValidationClass('form-control is-invalid')
            document.getElementById('userName-required').classList.add('d-none');
            document.getElementById("userName-validation").classList.remove('d-none');
            return false;
        } else if (userNameRef.current.state.numAsString.length === 10) {
            const testNationalCode = isValidIranianNationalCode(userNameRef.current.state.numAsString);
            if (testNationalCode === true) {
                setuserNameValidationClass('form-control is-valid')
                document.getElementById('userName-required').classList.add('d-none');
                document.getElementById("userName-validation").classList.add('d-none');
                return true;
            } else {
                return false;
            }
        }
    }
    const validateCompany = () => {
        if (companyRef.current.props.value === "") {
            document.getElementById('company-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('company-required').classList.add('d-none');
            return true;
        }
    }
    const validateDepartment = () => {
        if (departmentRef.current.props.value === "") {
            document.getElementById('department-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('department-required').classList.add('d-none');
            return true;
        }
    }
    const validateSupervisor = () => {
        if (supervisorRef.current.props.value === "") {
            document.getElementById('supervisor-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('supervisor-required').classList.add('d-none');
            return true;
        }
    }
    const validateVerifyInfo = () => {
        if (!verifyInfo) {
            document.getElementById('verifyInfo-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('verifyInfo-required').classList.add('d-none');
            return true;
        }
    }
    // Validation End
    const handleCheckUserRegister = async () => {
        try {
            if (userName !== '') {
                if (personalCode !== '') {
                    const personalCodeValidation = validatePersonalCode();
                    const userNameValidation = validateUserName();
                    if (userNameValidation && personalCodeValidation) {
                        const { data } = await getUSerInfoBeforeRegister(userName.replace(/ /g, ''), personalCode.replace(/ /g, ''));
                        if (data.code === 405) {
                            errorMessage('این کدملی قبلا ثبت نام شده!')
                        } else if (data.FirstName !== undefined) {
                            setUserNameDisabled(true);
                            setPersonalCodeDisabled(true);
                            setFName(data.FirstName);
                            setLName(data.LastName);
                            setGender({ value: data.Gender, label: data.gender ? 'خانم' : 'آقا' });
                            setPositionDisabled(false);
                            setPasswordDisabled(false);
                            setConfirmPasswordDisabled(false);
                            setBirthdayDisabled(false);
                            setEmailDisabled(false);
                            setPhoneNumberDisabled(false);
                            setLocalPhoneNumberDisabled(false);
                            setCompanyDisabled(false);
                            setDepartmentDisabled(false);
                            setSupervisorDisabled(false);
                            setAvatarDisabled(false);
                            setVerifyInfoDisabled(false);
                            setRegisterDisabled(false);
                            setLocationDisabled(false);
                            setBirthCertificateNumberDisabled(false);
                            setInsuranceNumberDisabled(false);
                            setBankAccountNumberDisabled(false);
                        } else {
                            errorMessage('اطلاعات شما در سیستم یافت نشد!')
                        }
                    }
                } else {
                    warningMessage('پر کردن کدپرسنلی اجباری است!')
                }
            } else {
                warningMessage('پر کردن کدملی اجباری است!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            var sup;
            if (supervisor === '') {
                // sup = '6360ecd33ba4d4828c9cb40b';
                sup = '';
            } else {
                sup = supervisor.value;
            }
            let name = fName.replaceAll("ک", "ك");
            name = name.replaceAll("ی", "ي");
            let lastname = lName.replaceAll("ک", "ك");
            lastname = lastname.replaceAll('ی', 'ي');
            const user = {
                position: position.value,
                personelCode: personalCode.replace(/ /g, ''),
                user_name: userName.replace(/ /g, ''),
                password,
                gender: gender.value,
                first_name: name,
                last_name: lastname,
                confirmPassword,
                birthdate: birthday,
                email,
                phone_number: phoneNumber.replace(/ /g, ''),
                local_phone: localPhoneNumber.replace(/ /g, ''),
                company: company.value,
                department: department.value,
                supervisor_id: sup,
                profile_photo: '',
                photo_type: '',
                newPhoto: avatar,
                newPhotoType: avatarType,
                accountNo: bankAccountNumber,
                birthCerNo: birthCertificateNumber,
                insCode: insuranceNumber,
                location: location.value
            };
            const res = await registerUser(user);
            if (res.data.message) {
                if (res.data.code === 414 || res.data.code === 413) {
                    errorMessage('خطایی رخ داده است!')
                }
            } else if (res.data.code === 415 || res.data.code === 416) {
                const registerDateValues = {
                    actionId: res.data.message._id,
                    actionCode: 11,
                    userId: "6360ecd33ba4d4828c9cb40b",
                    typeId: 11
                }
                const dateRes = await registerDate(registerDateValues);
                if (dateRes.data.code === 415) {
                    if (res.data.code === 416) {
                        warningMessage('ذخیره شماره موبایل با خطا مواجه شد لطفا با پشتیبانی تماس بگیرید!')
                    }
                    successMessage('ثبت نام با موفقیت انجام شد!')
                    setAccountMode('login');
                    handleResetRegister();
                }
            } else {
                errorMessage('خطا!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const [supervisorsByCoDep, setSupervisorsByCoDep] = useState([]);
    const handleSupervisorsByCoDep = async (coCode, depCode, location) => {
        try {
            const { data } = await getSupervisorsByCoDep(coCode, depCode, location);
            if (data.code === 403) {
                errorMessage('سرپرستی در این شرکت/واحد یافت نشد!');
            } else if (data.length !== 0) {
                if (data[0]._id !== undefined) {
                    setSupervisorsByCoDep(data);
                }
            } else {
                errorMessage('خطا در نمایش سرپرست!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const supervisorsByCoDepSelect = supervisorsByCoDep.map(item => {
        return { value: item._id, label: item.first_name + ' ' + item.last_name }
    })
    const handleResetRegister = () => {
        setUserName("");
        setPassword("");
        setPosition("");
        setPersonalCode("");
        setGender("");
        setFName("");
        setLName("");
        setConfirmPassword("");
        setBirthday(momentJalali.utc('1390/06/31', 'jYYYY/jMM/jDD'));
        setEmail("");
        setPhoneNumber("");
        setLocalPhoneNumber("");
        setCompany("");
        setDepartment("");
        setSupervisor("");
        setAvatar("");
        setBirthCertificateNumber("");
        setInsuranceNumber("");
        setBankAccountNumber("");
        setVerifyInfo(false);
    }
    // Profile
    const id = localStorage.getItem('id');
    const [passChanged, setPassChanged] = useState(false);
    const handlePassChangeCheck = async () => {
        try {
            const checkPassCompletedRes = await checkPassCompleted(localStorage.getItem('id'), 'pass');
            if (checkPassCompletedRes.data === true) {
                setPassChanged(true);
            } else {
                setPassChanged(false);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleUpdateProfile = async (userId, label, value) => {
        try {
            const { data } = await updateProfile(userId, label, value);
            if (data.code === 415) {
                if (label === 'birthdate') {
                    setBirthdayChange(false);
                    successMessage('تاریخ تولد با موفقیت ویرایش شد!');
                } else if (label === 'email') {
                    setEmailChange(false);
                    successMessage('ایمیل با موفقیت تغییر یافت!');
                } else if (label === 'localPhone') {
                    setLocalPhoneChange(false);
                    successMessage('شماره داخلی با موفقیت تغییر یافت!');
                } else if (label === 'mobileNo') {
                    setPhoneNumberChange(false);
                    setSmsCodeInput(true);
                    toggleCountDown(1);
                }
                if (label !== 'mobileNo') {
                    await dispatch(handleUserData());
                    await handlePassChangeCheck();
                    if (passChanged === true) {
                        if (label === 'birthdate') {
                            const d = new Date("2020-08-09T00:00:00.000Z")
                            if (birthday._d !== d && user.MobileNo !== null) {
                                history.replace("/Home");
                            }
                        }
                    }
                }
            } else if (data.code === 417 && label === 'mobileNo') {
                setPhoneNumberChange(false);
                setSmsCodeInput(true);
                toggleCountDown(1);
                errorMessage('ارسال مجدد کد بعد از 90 ثانیه از اولین درخواست امکان پذیر است!');
            } else if (data.code === 418 && label === 'mobileNo') {
                setPhoneNumberChange(false);
                errorMessage('امکان ارسال کد بیش از سه بار ممکن نیست!');
            } else if (data.code === 421 && label === 'birthdate') {
                errorMessage('تاریخ تولد نامعتبر است!');
                setBirthdayChange(false);
            } else if (data.code === 420 && label === 'mobileNo'){
                setPhoneNumberChange(false);
                errorMessage('شماره موبایل وارد شده تکراری است!');
            }else {
                errorMessage('خطا در انجام عملیات!');
                if (label === 'birthdate') {
                    setBirthdayChange(false);
                } else if (label === 'email') {
                    setEmailChange(false);
                } else if (label === 'localPhone') {
                    setLocalPhoneChange(false);
                } else if(label === 'mobileNo'){
                    setPhoneNumberChange(false);
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleUpdateFirstName = async () => {
        if (validateFirstName()) {
            try {
                const { status, data } = await updateProfile('first_name', fName);
                if (status === 200) {
                    setFullNameChange(false);
                    successMessage('نام با موفقیت تغییر یافت!');
                    dispatch(handleUserData());
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
    const handleUpdateLastName = async () => {
        if (validateLastName()) {
            try {
                const { status, data } = await updateProfile('last_name', lName);
                if (status === 200) {
                    setFullNameChange(false);
                    successMessage('نام خانوادگی با موفقیت تغییر یافت!');
                    dispatch(handleUserData());
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
    const handleUpdateUserName = async () => {
        if (validateUserName()) {
            const changedUserName = userName.replace(/ /g, '');
            try {
                const userNameChangeRes = await updateProfile('user_name', changedUserName);
                if (userNameChangeRes.data.message) {
                    if (userNameChangeRes.data.message.code === 11000) {
                        errorMessage('این کدملی تکراری می باشد!')
                    }
                } else {
                    setUserNameChange(false);
                    successMessage('کدملی با موفقیت تغییر یافت!');
                    dispatch(handleUserData());
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
    const handleUpdateAvatar = async () => {
        if (avatar !== '') {
            setLoading(true);
            try {
                var files = [];
                const data = new FormData();
                for (var x = 0; x < avatar.length; x++) {
                    data.append('reqFiles', avatar[x])
                }
                files = data;
                const changeAvatarRes = await updateProfile(localStorage.getItem('id'), 'profilePhoto', files);
                if (changeAvatarRes.data.code === 415) {
                    setAvatarChange(false);
                    successMessage('تصویر در انتظار بررسی قرار گرفت!');
                    setLoading(false);
                    dispatch(handleUserData());
                } else {
                    setAvatarChange(false);
                    errorMessage('عملیات انجام نشد!');
                    setLoading(false);
                    dispatch(handleUserData());
                }
            } catch (ex) {
                setLoading(false)
            }
        } else {
            warningMessage('تصویر انتخاب نشده!');
        }
    }
    const handleResetResetPassForm = () => {
        setPersonalCode('');
        setBirthCertificateNumber('');
        setInsuranceNumber('');
        setBirthday(null);
        setEmail('');
        setPhoneNumber('');
        setSmsCode('');
    }
    const handleUpdatePassword = async () => {
        try {
            const { data } = await updateProfile(localStorage.getItem('id'), 'password', password);
            if (data.code === 415) {
                setPasswordChange(false);
                successMessage('رمزعبور با موفقیت تغییر یافت!');
                await dispatch(handleUserData());
                await handlePassChangeCheck();
                if (passChanged === true) {
                    if (String(user.BirthDate) !== "2020-08-09T00:00:00.000Z"
                        && user.MobileNo !== null
                    ) {
                        history.replace("/Home");
                    }
                }
            } else {
                errorMessage('خطا در انجام عملیات!');
                setPasswordChange(false);
            }
        }
        catch (ex) {
            console.log(ex);
        }
    }
    const handleUpdateDepartment = async (e) => {
        // validateCompany();
        // validateDepartment();
        try {
            const { data } = await updateProfile(localStorage.getItem('id'), 'supervisor', supervisor.value);
            if (data.code === 415) {
                const changeSupReqRes = await changeSupReq();
                if (changeSupReqRes.data.code === 415) {
                    setDepartmentChange(false);
                    const actionValues = {
                        actionCode: 25,
                        actionId: changeSupReqRes.data.id,
                        userId: localStorage.getItem('id'),
                        toPersons: supervisor.value,
                        typeId: 5
                    }
                    const actionRes = await postAction(actionValues);
                    if (actionRes.data.code === 415) {
                        await dispatch(handleUserData());
                        await handlePassChangeCheck();
                        successMessage('تغییرات درانتظار بررسی قرار گرفت!');
                        if (passChanged === true) {
                            if (user.BirthDate !== "2020-08-09T00:00:00.000Z"
                                && user.MobileNo !== null
                            ) {
                                history.replace("/Home");
                            }
                        }
                    }
                }
            }
        }
        catch (ex) {
            console.log(ex);
        }
    }
    // Profile END


    const endOfTimer = async (status) => {
        const smsCodeRes = await sendSmsCode('*', 1, status, changePassUserId);
    }
    const [timer, setTimer] = useState(90)
    const [timerMinutes, setTimerMinutes] = useState('0')
    const [timerSeconds, setTimerSeconds] = useState('0')
    const [timerIntervalId, setTimerIntervalId] = useState(null)
    const secondsToTime = (seconds) => {
        return [Math.floor(seconds / 60), seconds % 60]
    }
    let hasStarted = timerIntervalId !== null // check timer state
    const formatDisplayTime = (time) => {
        if (time < 10) {
            return `0${time}`
        } else {
            return time
        }
    }
    const toggleCountDown = (status) => {
        if (hasStarted) {
            if (timerIntervalId) {
                clearInterval(timerIntervalId)
            }
            setTimerIntervalId(null)
            setTimer(10)
        } else {
            // stopped mode
            // create accurate date timer with date
            const newIntervalId = setInterval(() => {
                setTimer(prevTime => {
                    let newTime = prevTime - 1
                    if (newTime >= 0) {
                        let time = secondsToTime(newTime)
                        setTimerMinutes(time[0])
                        setTimerSeconds(time[1])
                        return newTime
                    } else {
                        clearInterval(newIntervalId);
                        setTimerIntervalId(null)
                        setTimer(90)
                        hasStarted = false;
                        endOfTimer(status);
                        if (status === 1) {
                            setSmsCodeInput(false);
                        } else if (status === 2) {
                            dispatch(RsetChangePassLevel(1));
                            errorMessage('زمان به اتمام رسید!');
                            dispatch(RsetChangePassUserId(''));
                            handleResetResetPassForm();
                        }

                    }
                })
            }, 1000)
            setTimerIntervalId(newIntervalId)
        }
    }

    const [smsCode, setSmsCode] = useState('');
    const [smsCodeInput, setSmsCodeInput] = useState(false);
    const handleSendSmsCode = async (value, status, reset) => {

        try {
            const smsCodeRes = await sendSmsCode(value, 0, status, changePassUserId);
            var changedPhoneNumber;
            if (status === 1) {
                changedPhoneNumber = phoneNumber.replace(/ /g, '');
            }
            if (smsCodeRes.data.code === 415) {
                if (reset === 'resetPhone') {
                    setSmsCode('');
                    setSmsCodeInput(false);
                    successMessage('شماره موبایل با موفقیت تغییر یافت!');
                    await dispatch(handleUserData());
                    await handlePassChangeCheck();
                    if (passChanged === true) {
                        if (String(user.BirthDate) !== "2020-08-09T00:00:00.000Z"
                            && changedPhoneNumber !== null
                        ) {
                            history.replace("/Home");
                        }
                    }
                } else if (reset === 'resetPass') {
                    successMessage('بازیابی رمز عبور با موفقیت انجام شد!');
                    dispatch(RsetChangePassLevel(1));
                    dispatch(RsetShowChangePassCom(false));
                    dispatch(RsetChangePassUserId(''));
                    handleResetResetPassForm();
                }
                clearInterval(timerIntervalId);
                setTimerIntervalId(null)
                setTimer(90)
                hasStarted = false
            } else {
                errorMessage('کد وارد شده اشتباه است!');
                setSmsCode('');
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleCheckForResetPass = async (userValues) => {
        try {
            const checkForResetPassRes = await checkForResetPass(userValues);
            if (checkForResetPassRes.data.result === 'accepted') {
                successMessage('رمز عبور با موفقیت بازیابی شد!');
                dispatch(RsetShowChangePassCom(false));
                handleResetResetPassForm();
            } else if (checkForResetPassRes.data.result === 'code sended') {
                dispatch(RsetChangePassLevel(2));
                dispatch(RsetChangePassUserId(checkForResetPassRes.data.id));
            } else if (checkForResetPassRes.data.result === 'rejected') {
                errorMessage('اطلاعات وارد شده اشتباه می باشد!');
            } else {
                errorMessage('خطا!')
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <context.Provider
            value={{
                position,
                setPosition,
                positionRef,
                positionDisabled,
                personalCode,
                setPersonalCode,
                personalCodeRef,
                personalCodeDisabled,
                userName,
                setUserName,
                userNameRef,
                userNameDisabled,
                password,
                setPassword,
                passwordRef,
                passwordDisabled,
                gender,
                setGender,
                genderRef,
                genderDisabled,
                fName,
                setFName,
                firstNameRef,
                fNameDisabled,
                lName,
                setLName,
                lastNameRef,
                lNameDisabled,
                confirmPassword,
                setConfirmPassword,
                confirmPasswordRef,
                confirmPasswordDisabled,
                birthday,
                setBirthday,
                birthdayRef,
                birthdayDisabled,
                email,
                setEmail,
                emailRef,
                emailDisabled,
                phoneNumber,
                setPhoneNumber,
                phoneNumberRef,
                phoneNumberDisabled,
                localPhoneNumber,
                setLocalPhoneNumber,
                localPhoneRef,
                localPhoneNumberDisabled,
                location,
                setLocation,
                locationRef,
                locationDisabled,
                company,
                setCompany,
                companyRef,
                companyDisabled,
                department,
                setDepartment,
                departmentRef,
                departmentDisabled,
                supervisor,
                setSupervisor,
                supervisorRef,
                supervisorDisabled,
                avatar,
                setAvatar,
                avatarDisabled,
                handleProfileUpload,
                registerDisabled,
                handleRegister,
                departments,
                handleSupervisorsByCoDep,
                handleResetRegister,
                personalCodeValidationClass,
                userNameValidationClass,
                phoneNumberValidationClass,
                localPhoneValidationClass,
                fullNameChange,
                setFullNameChange,
                birthdayChange,
                setBirthdayChange,
                userNameChange,
                setUserNameChange,
                avatarChange,
                setAvatarChange,
                passwordChange,
                setPasswordChange,
                emailChange,
                setEmailChange,
                phoneNumberChange,
                setPhoneNumberChange,
                localPhoneChange,
                setLocalPhoneChange,
                departmentChange,
                setDepartmentChange,
                handleUpdateFirstName,
                handleUpdateLastName,
                handleUpdateUserName,
                handleUpdateAvatar,
                handleUpdatePassword,
                handleUpdateDepartment,
                handleInputsEnter,
                verifyInfo,
                setVerifyInfo,
                verifyInfoDisabled,
                handleCheckUserRegister,
                handlePassChangeCheck,
                passChanged,
                supervisorsByCoDepSelect,

                birthCertificateNumber,
                setBirthCertificateNumber,
                birthCertificateNumberRef,
                birthCertificateNumberDisabled,
                birthCertificateNumberValidationClass,
                insuranceNumber,
                setInsuranceNumber,
                insuranceNumberRef,
                insuranceNumberDisabled,
                insuranceNumberValidationClass,
                bankAccountNumber,
                setBankAccountNumber,
                bankAccountNumberRef,
                bankAccountNumberDisabled,
                bankAccountNumberValidationClass,

                smsCode,
                setSmsCode,
                smsCodeInput,
                handleSendSmsCode,

                formatDisplayTime,
                timerMinutes,
                timerSeconds,
                toggleCountDown,

                handleCheckForResetPass,

                handleUpdateProfile
            }}
        >
            {children}
        </context.Provider>
    );
};

export default withRouter(UserContext);
