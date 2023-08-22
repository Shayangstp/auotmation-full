import React, { useContext, useState, useEffect, Fragment, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { rootContext } from "../context/rootContext";
import { context } from '../context/context';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import momentJalaali from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import { Sugar } from 'react-preloaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan, faCheck, faWarning, faCircleUser, faEye } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";
import {Camera} from "react-camera-pro";
import { selectUser, selectFormErrors , RsetFormErrors, handleUserImage, selectLoggedInUserImage } from '../Slices/mainSlices';
import { errorMessage } from '../../utils/message';


const Profile = ({setPageTitle}) => {

    const dispatch = useDispatch();
    const formErrors = useSelector(selectFormErrors);
    const user = useSelector(selectUser);
    const loggedInUserImage = useSelector(selectLoggedInUserImage);

    const mainContext = useContext(rootContext);
    const {
        loading,
        handleGetCompanies,
        companies,
        handleGetCoDepartments,
        departmentsSelect,
        handleCompanyUsers,
        coUsers,
    } = mainContext;
    const profileContext = useContext(context);
    const {
        userName,
        setUserName,
        userNameRef,
        password,
        setPassword,
        passwordRef,
        fName,
        setFName,
        firstNameRef,
        lName,
        setLName,
        lastNameRef,
        confirmPassword,
        setConfirmPassword,
        confirmPasswordRef,
        birthday,
        setBirthday,
        birthdayRef,
        email,
        setEmail,
        emailRef,
        phoneNumber,
        setPhoneNumber,
        phoneNumberRef,
        localPhoneNumber,
        setLocalPhoneNumber,
        localPhoneRef,
        company,
        setCompany,
        companyRef,
        department,
        setDepartment,
        departmentRef,
        supervisor,
        setSupervisor,
        supervisorRef,
        avatar,
        setAvatar,
        departments,
        depSups,
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
        handleProfileUpload,
        handlePassChangeCheck,
        passChanged,

        smsCode,
        setSmsCode,
        smsCodeInput,
        handleSendSmsCode,

        formatDisplayTime,
        timerMinutes,
        timerSeconds,

        handleUpdateProfile,
    } = profileContext;
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    useEffect(()=>{
        setPageTitle('پروفایل');

        handlePassChangeCheck();

        // handleGetCompanies();
    }, [])
    useEffect(()=>{
        handleCompanyUsers(0);
        dispatch(handleUserImage({userId: user._id, status: 1}));
    },[user])


    const camera = useRef(null);
    const [image, setImage] = useState(null);

    const timerColor = () => {
        if(timerMinutes === 1 && timerSeconds >= 0){
            return 'text-success'
        }else if(timerMinutes === 0 && timerSeconds >= 30){
            return 'text-warning'
        }else if(timerMinutes === 0 && timerSeconds < 30){
            return 'text-danger'
        }
    }

    const [passwordType, setPasswordType] = useState('password');
    const handlePasswordType = () => {
        setPasswordType((passType) => (passType === 'password' ? 'text' : 'password'))
    }

    var passTest = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;
    const passwordValidation = () => {
        var errors = {};
        if (!password) {
            errors.password = "واردکردن رمز عبور اجباری است!";
        } else if (!passTest.test(password)) {
            errors.password = "رمز عبور باید شامل حروف و عدد و حداقل 6 کاراکتر باشد!";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "واردکردن تکرار رمز عبور اجباری است!";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "رمزهای وارد شده یکسان نیستند!";
        }
        return errors;
    }
    var emailTest = /^([a-zA-Z0-9_\.\-\+]{3,})+\@(([a-zA-Z0-9\-]{3,})+\.)+([a-zA-Z0-9]{2,4})+$/;
    const emailValidation = () => {
        var errors = {};
        if (!email) {
            errors.email = "واردکردن ایمیل اجباری است!";
        } else if (!emailTest.test(email)) {
            errors.email = "فرمت ایمیل معتبر نمی باشد!";
        }
        return errors;
    }
    const phoneValidation = () => {
        var errors = {};
        const phoneNumberValue = phoneNumber.replaceAll('-', '').replaceAll(' ', '');
        if (!phoneNumber) {
            errors.phoneNumber = "واردکردن شماره موبایل اجباری است!";
        } else if (phoneNumberValue.length < 11) {
            errors.phoneNumber = "شماره موبایل حداقل باید 11 کاراکتر باشد!";
        } else if (phoneNumberValue.startsWith('09') === false){
            errors.phoneNumber = "شماره موبایل باید با 09 شروع شود!";
        }
        return errors;
    }
    const localPhoneValidation = () => {
        var errors = {};
        const localPhoneNumberValue = localPhoneNumber.replaceAll('-', '').replaceAll(' ', '');
        if (!localPhoneNumber) {
            errors.localPhoneNumber = "واردکردن شماره داخلی اجباری است!";
        } else if (localPhoneNumberValue.length < 4) {
            errors.localPhoneNumber = "شماره داخلی حداقل باید 4 کاراکتر باشد!";
        }
        return errors;
    }
    const supervisorValidation = () => {
        var errors = {};
        if (!supervisor) {
            errors.supervisor = "انتخاب سرپرست اجباری است!";
        }
        return errors;
    }

    return(
        <Container className='py-4'>
            {loading ?
                <Sugar />
            :
                <Form>
                    <Row>
                        <Col lg='12' className='mb-5'>
                            <div className='border bg-white rounded p-3 p-lg-5'>
                                <div className='d-flex align-items-center justify-content-between'>
                                <h1 className='font20 fw-bold mb-4'>اطلاعات اصلی</h1>
                                    {loggedInUserImage === '' ?
                                        <FontAwesomeIcon icon={faCircleUser} className="font95 text-secondary mb-1 mb-md-0"/>
                                    :
                                        <img width='95px' height='95px' className='rounded-circle mb-1 mb-md-0 cursorPointer' alt='userAvatar' src={loggedInUserImage} onClick={() => setShowAvatarModal(true)}/>
                                    }
                                </div>
                                <Row>
                                    <Col md='12' className='py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap'>
                                        <div>
                                            <span className='fw-bold'>نام و نام خانوادگی: </span>
                                            <span className='ms-0 ms-lg-4'>{(xssFilters.inHTMLData(user.Gender) === 'آقا' ? 'آقای' : xssFilters.inHTMLData(user.Gender)) + " " + xssFilters.inHTMLData(user.FirstName) + " " + xssFilters.inHTMLData(user.LastName)}</span>
                                        </div>
                                        {/* {fullNameChange ?
                                            <div className='d-flex align-items-start'>
                                                <Form.Group className='me-2'>
                                                    <Form.Control type='text' value={fName} placeholder='نام' name="fName" onChange={(e) => { setFName(e.target.value) }} ref={firstNameRef}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        <div id='firstName-required' className='d-none'>
                                                            <span className='font12 mb-1'>واردکردن نام اجباری است!</span>
                                                        </div>
                                                        <div id='firstName-validation' className='d-none'>
                                                            <span className='font12'>نام حداقل باید 3 کاراکتر باشد!</span>
                                                        </div>
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Button variant='success' className='d-flex align-items-center me-4 px-3 h-35px' onClick={() => {handleUpdateFirstName()}}><FontAwesomeIcon icon={faCheck} /></Button>
                                                <Form.Group>
                                                    <Form.Control  type='text' value={lName} placeholder='نام خانوادگی' name="lName" onChange={(e) => { setLName(e.target.value) }} ref={lastNameRef}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        <div id='lastName-required' className='d-none'>
                                                            <span className='font12 mb-1'>واردکردن نام خانوادگی اجباری است!</span>
                                                        </div>
                                                        <div id='lastName-validation' className='d-none'>
                                                            <span className='font12'>نام خانوادگی حداقل باید 3 کاراکتر باشد!</span>
                                                        </div>
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Button variant='success' className='d-flex align-items-center ms-2 px-3 h-35px' onClick={() => {handleUpdateLastName()}}><FontAwesomeIcon icon={faCheck} /></Button>
                                            </div>
                                        :null}
                                        <div className='ps-3 cursorPointer' onClick={()=>{setFullNameChange(!fullNameChange)}}>
                                            {fullNameChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div> */}
                                    </Col>
                                    <Col md='12' className='py-3 d-flex border-bottom justify-content-between align-items-center flex-wrap'>
                                        <div className='mb-2 mb-lg-0 me-3'>
                                            {user.BirthDate === '2020-08-09T00:00:00.000Z' ? <FontAwesomeIcon icon={faWarning} className='text-danger me-2'/> : null}
                                            <span className='fw-bold'>تاریخ تولد: </span>
                                            <span className='ms-0 ms-lg-4'>{user.BirthDate !== '2020-08-09T00:00:00.000Z' ? momentJalaali.utc(xssFilters.inHTMLData(user.BirthDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'): ''}</span>
                                        </div>
                                        {birthdayChange ?
                                            <div className='d-flex align-items-center'>
                                                <Form.Group>
                                                <DatePicker
                                                    setTodayOnBlur={true}
                                                    inputReadOnly
                                                    name='birthday'
                                                    isGregorian={false}
                                                    timePicker={false}
                                                    showTodayButton={false}
                                                    //ranges={this.highlightRanges}
                                                    inputFormat="YYYY-MM-DD"
                                                    inputJalaaliFormat="jYYYY/jMM/jDD"
                                                    value={birthday}
                                                    className="form-control"
                                                    onChange={e => {setBirthday(e)}}
                                                />
                                                </Form.Group>
                                                <div className='btn btn-success ms-2 px-3 h-35px'  onClick={(e) => {
                                                    e.preventDefault();
                                                    if(birthday !== null){
                                                        handleUpdateProfile(localStorage.getItem('id'), 'birthdate', JSON.stringify(birthday))
                                                    }
                                                }}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </div>
                                            </div>
                                        :null}
                                        <div className='ps-3 cursorPointer' onClick={()=>{setBirthdayChange(!birthdayChange)}}>
                                            {birthdayChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div>
                                    </Col>
                                    <Col md='12' className='py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap'>
                                        <div>
                                            <span className='fw-bold'>کدملی (نام کاربری): </span>
                                            <span className='ms-0 ms-lg-4' dir='ltr'>{xssFilters.inHTMLData(user.UserName)}</span>
                                        </div>
                                        {/* {userNameChange? 
                                            <div className='d-flex'>
                                                <Form.Group>
                                                    <NumberFormat type='text' value={userName} name='userName' onChange={(e)=> setUserName(e.target.value)} ref={userNameRef} dir='ltr' format="# # # # # # # # # #" mask='-' placeholder='- - - - - - - - - -' className={userNameValidationClass}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        <div id='userName-required' className='d-none'>
                                                            <span className='font12 mb-1'>واردکردن کد ملی اجباری است!</span>
                                                        </div>
                                                        <div id='userName-validation' className='d-none'>
                                                            <span className='font12'>کد ملی حداقل باید 10 کاراکتر باشد!</span>
                                                        </div>
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <div type='submit' className='btn btn-success d-flex align-items-center ms-2 px-3 h-35px' onClick={()=>{handleUpdateUserName()}}><FontAwesomeIcon icon={faCheck} /></div>
                                            </div>
                                        :null}
                                        <div className='ps-3 cursorPointer' onClick={()=>{setUserNameChange(!userNameChange)}}>
                                            {userNameChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div> */}
                                    </Col>
                                    <Col md='12' className='py-3 border-bottom d-flex justify-content-between align-items-center flex-wrap'>
                                        <Modal
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered
                                            show={showAvatarModal}
                                            onHide={() => {
                                                setShowAvatarModal(false)
                                            }}
                                            scrollable={true}
                                        >
                                        <Modal.Body>
                                            {loggedInUserImage === '' ?
                                                <FontAwesomeIcon icon={faCircleUser} className="font95 text-secondary mb-1 mb-md-0"/>
                                            :
                                                <img className='img-fluid' alt='userAvatar' src={loggedInUserImage}/>
                                        }
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => { setShowAvatarModal(false) }}>بستن</Button>
                                        </Modal.Footer>
                                        </Modal>
                                        {user.PhotoType === '' || user.ProfilePhoto === '' || user.PhotoType === undefined || user.ProfilePhoto === undefined || user.PhotoType === null || user.ProfilePhoto === null ? <span className='fw-bold'>تصویر </span> : <div>
                                            <span className='fw-bold'>تصویر: </span>
                                            <span className='ms-0 ms-lg-4 cursorPointer' onClick={() => {setShowAvatarModal(true)}}>نمایش تصویر</span>
                                        </div>}
                                        {avatarChange ?
                                            <div className='d-flex'>
                                                <Form.Group>
                                                    <Form.Control type='file' name='avatar' accept=".jpeg,.jpg,.png,.gif" onChange={(e)=>{handleProfileUpload(e)}}/>
                                                </Form.Group>
                                                {/* <Camera ref={camera}
                                                    errorMessages={{
                                                        noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                                                        permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                                                        switchCamera:
                                                          'It is not possible to switch camera to different one because there is only one video device accessible.',
                                                        canvas: 'Canvas is not supported.',
                                                    }}                                                
                                                />
                                                <button onClick={() => setImage(camera.current.takePhoto())} >Take photo</button> */}
                                                <div type='submit' className='btn btn-success d-flex align-items-center ms-2 px-3 h-35px' onClick={()=>handleUpdateAvatar()}><FontAwesomeIcon icon={faCheck} /></div>
                                            </div>
                                        :null}
                                        {/* edit avatar icon */}
                                        <div className='ps-3 cursorPointer'  onClick={()=>{
                                            if(user.Supervisor.FirstName === "نامشخص"){
                                                errorMessage('ابتدا سرپرست خود را مشخص کنید!')
                                            }else{
                                                setAvatarChange(!avatarChange)
                                            }
                                        }}>
                                            {avatarChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div>
                                    </Col>
                                    <Col md='12' className={`pt-3 ${passwordChange ? 'd-block d-lg-flex' : 'd-flex'} justify-content-between align-items-center flex-wrap`}>
                                        <div className='mb-2 mb-lg-0 me-3'>
                                            {passChanged === false ? <FontAwesomeIcon icon={faWarning} className='text-danger me-2'/> : null}
                                            <span className='fw-bold'>رمز عبور: </span>
                                        </div>
                                        {passwordChange ?
                                            <Row>
                                                <Form.Group as={Col} md='12' lg='5' className='mb-2 mb-lg-0 position-relative'>
                                                    <Form.Control  type={passwordType} value={password} name="password" dir='ltr' placeholder='رمز عبور' onChange={(e) => { setPassword(e.target.value) }} ref={passwordRef}/>
                                                    <FontAwesomeIcon icon={faEye} className='position-absolute cursorPointer topRight-10-20' onClick={handlePasswordType} />
                                                    { !password || passTest.test(password) === false
                                                        ? <p className="font12 text-warning  mb-0 mt-1">
                                                            {formErrors.password}
                                                        </p>
                                                        :null
                                                    }
                                                </Form.Group>
                                                <Form.Group as={Col} md='12' lg='5' className='mb-2 mb-lg-0'>
                                                    <Form.Control  type={passwordType} value={confirmPassword} name="confirmPassword" dir='ltr' placeholder='تکرار رمز عبور' onChange={(e) => { setConfirmPassword(e.target.value) }} ref={confirmPasswordRef}/>
                                                    { !confirmPassword || password !== confirmPassword
                                                        ? <p className="font12 text-warning  mb-0 mt-1">
                                                            {formErrors.confirmPassword}
                                                        </p>
                                                        :null
                                                    }
                                                </Form.Group>
                                                <Col md='12' lg='2' className='d-flex justify-content-end'>
                                                    <div type='submit' className='btn btn-success d-flex align-items-center ms-0 ms-lg-2 px-3 h-35px' onClick={(e)=>{
                                                        e.preventDefault();
                                                        if (password !== '' && passTest.test(password) === true && confirmPassword !== '' && password === confirmPassword) {
                                                            handleUpdatePassword()
                                                        } else {
                                                            dispatch(RsetFormErrors(
                                                                passwordValidation({
                                                                    password: password,
                                                                    confirmPassword: confirmPassword
                                                                })
                                                            ));
                                                        }
                                                    }}><FontAwesomeIcon icon={faCheck} /></div>
                                                </Col>
                                            </Row>
                                        :null}
                                        <div className='ps-lg-3 cursorPointer mt-2 mt-lg-0'  onClick={()=>{setPasswordChange(!passwordChange)}}>
                                            {passwordChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg='6' className='mb-5 mb-lg-0'>
                            <div className='border bg-white rounded p-3 p-lg-5'>
                                <h1 className='font20 fw-bold mb-4'>اطلاعات تماس</h1>
                                <Row>
                                    <Col md='12' className='border-bottom d-flex justify-content-between align-items-center flex-wrap py-3'>
                                        <div className='mb-2 mb-lg-0 me-3'>
                                            <span className='fw-bold'>ایمیل: </span>
                                            <span className=''>{xssFilters.inHTMLData(user.Email)}</span>
                                        </div>
                                        <div className='ps-3 cursorPointer'  onClick={()=>{setEmailChange(!emailChange)}}>
                                            {emailChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div>
                                        {emailChange ?
                                            <div className='d-flex mt-2 w-100'>
                                                <Form.Group className='w-100'>
                                                    <Form.Control type="text" value={email} name="email" onChange={(e) => { setEmail(e.target.value) }} ref={emailRef}/>
                                                    { !email || emailTest.test(email) === false
                                                        ? <p className="font12 text-warning  mb-0 mt-1">
                                                            {formErrors.email}
                                                        </p>
                                                        :null
                                                    }
                                                </Form.Group>
                                                <div type='submit' className='btn btn-success d-flex align-items-center ms-2 px-3 h-35px' onClick={(e)=>{
                                                    e.preventDefault();
                                                    if (email !== '' && emailTest.test(email) === true) {
                                                        handleUpdateProfile(localStorage.getItem('id'), 'email', email)
                                                    } else {
                                                        dispatch(RsetFormErrors(
                                                            emailValidation({
                                                                email: email,
                                                            })
                                                        ));
                                                    }
                                                }}><FontAwesomeIcon icon={faCheck} /></div>
                                            </div>
                                        :null}
                                    </Col>
                                    <Col md='12' className='border-bottom d-flex justify-content-between align-items-center flex-wrap py-3'>
                                        <div className=''>
                                            {user.MobileNo === null ? <FontAwesomeIcon icon={faWarning} className='text-danger me-2'/> : null}
                                            <span className='fw-bold'>شماره موبایل: </span>
                                            <span dir='ltr'>{user.MobileNo !== null ? xssFilters.inHTMLData(user.MobileNo) : ''}</span>
                                        </div>
                                        {user.MobileNo === null ? <div className='ps-3 cursorPointer'  onClick={()=>{setPhoneNumberChange(!phoneNumberChange)}}>
                                            {phoneNumberChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div> : null}
                                        {phoneNumberChange ?
                                            <div className='d-flex mt-2 w-100'>
                                                <Form.Group className='w-100'>
                                                    <NumberFormat type="text" value={phoneNumber} name="phoneNumber" onChange={(e) => { setPhoneNumber(e.target.value) }} ref={phoneNumberRef} format="# # # # # # # # # # #" mask='-' dir='ltr' placeholder='0 9 - - - - - - - - -' className={phoneNumberValidationClass}/>
                                                    { !phoneNumber || phoneNumber.replaceAll('-', '').replaceAll(' ', '').length < 11 || phoneNumber.replaceAll('-', '').replaceAll(' ', '').startsWith('09') === false
                                                        ? <p className="font12 text-warning mb-0 mt-1">
                                                            {formErrors.phoneNumber}
                                                        </p>
                                                        :null
                                                    }
                                                </Form.Group>
                                                <div type='submit' className='btn btn-success d-flex align-items-center ms-2 px-3 h-35px' onClick={(e)=>{
                                                    e.preventDefault();
                                                    if (phoneNumber !== '' && phoneNumber.replaceAll('-', '').replaceAll(' ', '').length === 11 && phoneNumber.replaceAll('-', '').replaceAll(' ', '').startsWith('09') === true) {
                                                        handleUpdateProfile(localStorage.getItem('id'), 'mobileNo', phoneNumber.replace(/ /g, ''));
                                                    } else {
                                                        dispatch(RsetFormErrors(
                                                            phoneValidation({
                                                                phoneNumber: phoneNumber,
                                                            })
                                                        ));
                                                    }
                                                }}><FontAwesomeIcon icon={faCheck} /></div>
                                            </div>
                                        :null}
                                        {smsCodeInput ?
                                            <div className='d-flex mt-2 w-100'>
                                                <Form.Group className='w-100'>
                                                    <NumberFormat className='form-control' placeholder='code' type="text" value={smsCode} name="smsCode" onChange={(e) => { 
                                                        setSmsCode(e.target.value);
                                                        var value = e.target.value.replaceAll('-','');
                                                        if(value.length === 5){
                                                            handleSendSmsCode(value, 1, 'resetPhone');
                                                        }
                                                    }} dir='ltr' format='#####' mask='-'/>
                                                    <div className={`mt-2 font12 ${timerColor()}`}>زمان باقی مانده: <span className='fw-bold'>{formatDisplayTime(timerMinutes)}:{formatDisplayTime(timerSeconds)}</span></div>
                                                </Form.Group>
                                                <div type='submit' className='btn btn-success d-flex align-items-center ms-2 px-3 h-35px' onClick={()=>{
                                                    handleSendSmsCode(smsCode, 1, 'resetPhone');
                                                }}><FontAwesomeIcon icon={faCheck} /></div>
                                            </div>
                                        :null}
                                    </Col>
                                    <Col md='12' className='d-flex justify-content-between align-items-center flex-wrap py-3'>
                                        <div className=''>
                                            <span className='fw-bold'>شماره داخلی: </span>
                                            <span className=''>{xssFilters.inHTMLData(user.LocalPhone)}</span>
                                        </div>
                                        <div className='ps-3 cursorPointer'  onClick={()=>{setLocalPhoneChange(!localPhoneChange)}}>
                                            {localPhoneChange ? <FontAwesomeIcon icon={faBan} className='text-danger' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary' />}
                                        </div>
                                        {localPhoneChange ?
                                            <div className='d-flex mt-2 w-100'>
                                                <Form.Group controlId="validationLocalPhone" className='w-100'>
                                                    <NumberFormat type="text" value={localPhoneNumber} name="localPhoneNumber" onChange={(e) => { setLocalPhoneNumber(e.target.value) }} ref={localPhoneRef} format="# # # #" mask='-' dir='ltr' placeholder='- - - -' className={localPhoneValidationClass}/>
                                                    { !localPhoneNumber || localPhoneNumber.replaceAll('-', '').replaceAll(' ', '').length < 4
                                                        ? <p className="font12 text-warning mb-0 mt-1">
                                                            {formErrors.localPhoneNumber}
                                                        </p>
                                                        :null
                                                    }
                                                </Form.Group>
                                                <div type='submit' className='btn btn-success d-flex align-items-center ms-2 px-3 h-35px' onClick={(e)=>{
                                                    e.preventDefault();
                                                    if (localPhoneNumber !== '' && localPhoneNumber.replaceAll('-', '').replaceAll(' ', '').length === 4) {
                                                        handleUpdateProfile(localStorage.getItem('id'), 'localPhone', localPhoneNumber.replace(/ /g, ''))
                                                    } else {
                                                        dispatch(RsetFormErrors(
                                                            localPhoneValidation({
                                                                localPhoneNumber: localPhoneNumber,
                                                            })
                                                        ));
                                                    }
                                                }}><FontAwesomeIcon icon={faCheck} /></div>
                                            </div>
                                        :null}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg='6' className=''>
                            <div className='border bg-white rounded p-3 p-lg-5 h-100'>
                                <h1 className='font20 fw-bold mb-4'>اطلاعات دپارتمان</h1>
                                <Row>
                                    <Col md='12' className='d-flex justify-content-between align-items-center flex-wrap'>
                                        <div className='mt-3 w-100'>
                                            <span className='fw-bold'>شرکت: </span>
                                            <span className=''>{user.CompanyName !== null ? xssFilters.inHTMLData(user.CompanyName) : 'یافت نشد!'}</span>
                                        </div>
                                        <div className='mt-3'>
                                            <span className='fw-bold'>واحد سازمانی: </span>
                                            <span className=''>{user.DeptName !== null ? xssFilters.inHTMLData(user.DeptName) : 'یافت نشد!'}</span>
                                        </div>
                                        <div className='mt-3'>
                                            {/* {user.Supervisor.FirstName === 'نامشخص' ? <FontAwesomeIcon icon={faWarning} className='text-danger me-2'/> : null} */}
                                            <span className='fw-bold'>سرپرست/مدیر: </span>
                                            <span className=''>{user.Supervisor.FirstName !== null && user.Supervisor.LastName !== null ? xssFilters.inHTMLData(user.Supervisor.FirstName) + " " + xssFilters.inHTMLData(user.Supervisor.LastName) : 'یافت نشد!'}</span>
                                        </div>
                                        <div className='ps-3 cursorPointer' onClick={()=>{setDepartmentChange(!departmentChange)}}>
                                            {departmentChange ? <FontAwesomeIcon icon={faBan} className='text-danger mt-3' /> : <FontAwesomeIcon icon={faPenToSquare} className='text-primary mt-3' />}
                                        </div>
                                        {departmentChange ?
                                            <div className='my-3 w-100'>
                                                {/* {user.Supervisor.FirstName !== 'نامشخص' ?
                                                    <Fragment>
                                                        <div className='d-flex justify-content-between'>
                                                            <Form.Group className='w-100 mb-3'>
                                                                <Select isDisabled value={company} name="company" onChange={(e) => { 
                                                                    setCompany(e);
                                                                    handleGetCoDepartments(e.value, user.Location);
                                                                    setDepartment('');
                                                                    setSupervisor('')
                                                                }} ref={companyRef} placeholder='انتخاب شرکت' options={companies} isSearchable/>
                                                                <div id='company-required' className='d-none mt-1'>
                                                                    <span className='font12 text-danger mb-1'>انتخاب شرکت اجباری است!</span>
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                        <div className='d-flex justify-content-between'>
                                                            <Form.Group className='w-100 mb-3'>
                                                                <Select isDisabled value={department} name="department" onChange={(e) => { setDepartment(e); handleSupervisors(e.value, company.value) }} ref={departmentRef} placeholder='انتخاب واحد سازمانی' options={departmentsSelect} isSearchable/>
                                                                <div id='department-required' className='d-none mt-1'>
                                                                    <span className='font12 text-danger mb-1'>انتخاب واحد سازمانی اجباری است!</span>
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                    </Fragment>
                                                :null} */}
                                                <div className='d-flex justify-content-between'>
                                                    <Form.Group className='me-2 w-100'>
                                                        <Select value={supervisor} name="supervisor" onChange={(e) => { setSupervisor(e) }} ref={supervisorRef} placeholder='انتخاب سرپرست' options={coUsers} isSearchable
                                                        isDisabled={user.NewSupervisorId === null ? false : true}/>
                                                        {user.NewSupervisorId === null ? null : <p className='m-0 font12 text-danger mt-1'>در انتظار تایید سرپرست!</p>}
                                                        { !supervisor 
                                                            ? <p className="font12 text-warning  mb-0 mt-1">
                                                                {formErrors.supervisor}
                                                            </p>
                                                            :null
                                                        }
                                                    </Form.Group>
                                                    <div className='d-flex justify-content-end'>
                                                        <Button disabled={user.NewSupervisorId === null ? false : true} className='btn btn-success d-flex align-items-center px-3 h-35px' onClick={(e)=>{
                                                            e.preventDefault();
                                                            if (supervisor !== '') {
                                                                handleUpdateDepartment()
                                                            } else {
                                                                dispatch(RsetFormErrors(
                                                                    supervisorValidation({
                                                                        supervisor: supervisor,
                                                                    })
                                                                ));
                                                            }  
                                                        }}><FontAwesomeIcon icon={faCheck} /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        :null}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Form>
            }
        </Container>
    )
}

export default Profile;
