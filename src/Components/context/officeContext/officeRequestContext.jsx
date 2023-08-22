import React, { useState, useEffect, useRef, useContext } from "react";
import { officeReqContext } from './officeReqContext';
import { useSelector, useDispatch } from 'react-redux';
import { successMessage, warningMessage, errorMessage } from "../../../utils/message";
import {
    postOfficeAction, postOfficeNewReq, postOfficeNewReqFile, postOfficeNewReqLinks, getOfficeReqsList, postOfficeReqLikeAndDis, getOfficeReqDetails,
    patchOfficeReqExpired, postOfficeMissionReq,
    getOfficeToPerson, getUserPaySlip, postJobChange, postOfficeNews, getOfficeNews, postOfficeNotice, getOfficeNotices,
    postDaysFood, patchDaysFood, getAllTripTypes, getDrivers, getDriverInfo, getUserInfoToCoordinateMission
} from "../../../Services/officeServices";
import { postAction, checkReqUpdateDate, postActionToPersons } from "../../../Services/rootServices";
import AcceptRequest from '../../Modals/OfficeReqsModals/AcceptRequestModal';
import NextAcceptRequest from "../../Modals/OfficeReqsModals/NextAcceptRequestModal";
import ChangedReqValues from "../../Modals/OfficeReqsModals/ChangedReqValuesModal";
import CancelRequest from '../../Modals/OfficeReqsModals/CancelRequestModal';
import ViewRequest from '../../Modals/OfficeReqsModals/ViewRequestModal';
import xssFilters from "xss-filters";

import { rootContext } from "../rootContext";
import { selectUser, RsetActionToPersonsModal, selectActionToPersonsModal } from '../../Slices/mainSlices';
import moment from "moment-jalaali";

import ActionToPersonsM from '../../Modals/ActionToPersonsModal';

import { selectAcceptReqModal, selectNextAcceptReqModal, selectCancelReqModal, selectViewReqModal, selectReqHistoryModal} from '../../Slices/modalsSlice';
import ReqHistoryModal from "../../Modals/ReqHistoryModal";
import { selectCurrentReqInfo, RsetCurrentReqInfo } from "../../Slices/currentReqSlice";
import { selectDailyLeave, selectLeaveFromDate, selectLeaveToDate, handleResetNewLeaveReq } from "../../Slices/leaveSlice";

const OfficeRequestContext = ({ children }) => {

    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
    const cancelReqModal = useSelector(selectCancelReqModal);
    const viewReqModal = useSelector(selectViewReqModal);
    const reqHistoryModal = useSelector(selectReqHistoryModal);

    const dailyLeave = useSelector(selectDailyLeave);

    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const actionToPersonsModal = useSelector(selectActionToPersonsModal);
    const user = useSelector(selectUser);

    const mainContext = useContext(rootContext);
    const {
        setLoading,
        handleGetRequestList,

        handleDepartmentUsers,
        officeMissionToDate,
        setOfficeMissionToDate
    } = mainContext;

    const setCookie = (name, value, days) => {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    const getCookie = (name) => {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // from co, from dep
    var submitNewReqFromCo, submitNewReqFromDep;
    const handleSubmitNewReqFromInfo = () => {
        if (user.CompanyCode !== null && user.DeptCode !== null) {
            submitNewReqFromCo = { value: user.CompanyCode, label: user.CompanyName };
            submitNewReqFromDep = { value: user.DeptCode, label: user.DeptName };
        } else {
            submitNewReqFromCo = '';
            submitNewReqFromDep = '';
        }
        setReqFromCompanyName(submitNewReqFromCo)
        setReqFromCompanyDepartment(submitNewReqFromDep)
    }
    useEffect(() => {
        handleSubmitNewReqFromInfo();
    }, [user.CompanyCode, user.DeptCode])
    const [reqFromCompanyName, setReqFromCompanyName] = useState(submitNewReqFromCo);
    const [reqFromCompanyDepartment, setReqFromCompanyDepartment] = useState(submitNewReqFromDep);


    // to co, to dep
    var submitNewReqToCoId, submitNewReqToCoName,
        submitNewReqToDepId, submitNewReqToDepName,
        submitNewReqToCo, submitNewReqToDep;
    const handleSubmitNewReqToInfo = () => {
        submitNewReqToCoId = getCookie("submitNewReqToCoId");
        submitNewReqToCoName = getCookie("submitNewReqToCoName");
        submitNewReqToDepId = getCookie("submitNewReqToDepId");
        submitNewReqToDepName = getCookie("submitNewReqToDepName");
        if (submitNewReqToCoId !== null && submitNewReqToCoName !== null) {
            submitNewReqToCo = { value: submitNewReqToCoId, label: submitNewReqToCoName };
        } else {
            submitNewReqToCo = '';
        }
        if (submitNewReqToDepId !== null && submitNewReqToDepName !== null) {
            submitNewReqToDep = { value: submitNewReqToDepId, label: submitNewReqToDepName };
        } else {
            submitNewReqToDep = '';
        }
        setReqToCompanyName(submitNewReqToCo);
        setReqToCompanyDepartment(submitNewReqToDep)
    }
    const [reqToCompanyName, setReqToCompanyName] = useState(submitNewReqToCo);
    const [reqToCompanyDepartment, setReqToCompanyDepartment] = useState(submitNewReqToDep);
    useEffect(() => {
        handleSubmitNewReqToInfo();
    }, [submitNewReqToCo, submitNewReqToDep])

    //req send to, send copy to, title, description and has comment
    const [reqSendTo, setReqSendTo] = useState([]);
    const [reqSendCopyTo, setReqSendCopyTo] = useState([]);
    const [reqTitle, setReqTitle] = useState('');
    const [reqDescription, setReqDescription] = useState('');
    const [reqEnableComment, setReqEnableComment] = useState(true);

    // req link
    const [reqLink, setReqLink] = useState('');
    const [reqLinks, setReqLinks] = useState([]);
    const handleAddLink = () => {
        var links = [];
        if (reqLink !== '') {
            var linkValidation = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            if (linkValidation.test(reqLink)) {
                links = [...reqLinks];
                const link = { id: Math.floor(Math.random() * 100000), url: reqLink };
                links.push(link);
                setReqLinks(links);
                setReqLink('');
            } else {
                warningMessage('فرمت لینک وارد شده صحیح نمی باشد.');
            }
        } else {
            warningMessage('هیچ آدرسی وارد نشده است.');
        }
        //reqItemLinkRef.current.focus();
    }
    const [reqLinksModalShow, setReqLinksModalShow] = useState(false);

    //req file
    const [reqFile, setReqFile] = useState('');
    const [reqFileType, setReqFileType] = useState('');
    const [reqFileName, setReqFileName] = useState('');
    const [reqFiles, setReqFiles] = useState([]);
    const handleUploadReqFile = (e) => {
        e.persist();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        const fileByteArray = [];
        reader.onload = function (evt) {
            setReqFileType(file.type);
            setReqFileName(file.name)
            if (evt.target.readyState === FileReader.DONE) {
                const arrBuffer = evt.target.result,
                    array = new Uint8Array(arrBuffer);
                for (const a of array) {
                    fileByteArray.push(a);
                }
                setReqFile(fileByteArray);
            }
        };
        reader.readAsDataURL(file);
    }
    const handleAddReqFile = () => {
        if (reqFile !== '') {
            if (reqFiles.length < 3) {
                var files = [...reqFiles];
                const file = { file: reqFile, type: reqFileType, name: reqFileName }
                files.push(file);
                setReqFiles(files);
                setReqFile('');
                setReqFileType('');
                setReqFileName('');
                document.getElementById('reqFile').value = '';
            } else {
                document.getElementById('reqFile').value = '';
                warningMessage('فایل های انتخابی بیش از حد مجاز است!')
            }
        } else {
            warningMessage('فایلی انتخاب نشده است!')
        }
    }
    const [reqFilesModalShow, setReqFilesModalShow] = useState(false);

    // req submit
    const handleSubmitNewOfficeRequest = async () => {
        var reqSendCopyToValues = [];
        for (var i = 0; i < reqSendCopyTo.length; i++) {
            reqSendCopyToValues.push(reqSendCopyTo[i].value)
        }
        const officeNewReqValues = {
            fromCompany: reqFromCompanyName.value,
            fromDep: reqFromCompanyDepartment.value,
            toCompany: reqToCompanyName.value,
            toDep: reqToCompanyDepartment.value,
            wrote: reqSendCopyToValues,
            title: reqTitle.value,
            body: reqDescription,
            enableComment: reqEnableComment
        }
        try {
            const { data } = await postOfficeNewReq(officeNewReqValues);
            if (data) {
                var uploadedFiles = 0;
                for (var i = 0; i < reqFiles.length; i++) {
                    const officeNewReqFileValues = {
                        file: reqFiles[i].file,
                        file_type: reqFiles[i].type,
                        name: reqFiles[i].name,
                        request_id: data._id
                    }
                    const fileRes = await postOfficeNewReqFile(officeNewReqFileValues);
                    if (fileRes.data) {
                        uploadedFiles++;
                    }
                }
                if (uploadedFiles === reqFiles.length) {
                    const officeNewReqLinksValues = {
                        links: reqLinks,
                        request_id: data._id
                    }
                    const linksRes = await postOfficeNewReqLinks(officeNewReqLinksValues);
                    if (linksRes.data) {
                        var reqSendToValues = [];
                        for (var i = 0; i < reqSendTo.length; i++) {
                            reqSendToValues.push(reqSendTo[i].value)
                        }
                        const actionValues = {
                            actionId: data._id,
                            userId: localStorage.getItem('id'),
                            actionCode: 0,
                            toPersons: reqSendToValues
                        }
                        const actionRes = await postOfficeAction(actionValues);
                        if (actionRes.data) {
                            var reqToCompanyNameValue;
                            if (reqToCompanyName.value === 0) {
                                reqToCompanyNameValue = '0';
                            } else {
                                reqToCompanyNameValue = reqToCompanyName.value;
                            }
                            setCookie('submitNewReqToCoId', reqToCompanyNameValue, 365);
                            setCookie('submitNewReqToCoName', reqToCompanyName.label, 365);
                            // setCookie('submitNewReqToDepId', reqToCompanyDepartment.value, 365);
                            // setCookie('submitNewReqToDepName', reqToCompanyDepartment.label, 365);
                            successMessage('درخواست با موفقیت ثبت شد!');
                            handleRequestReset();
                        } else {
                            errorMessage('ثبت درخواست با خطا مواجه شد!')
                        }
                    }
                }
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    const handleSubmitNewReqValidation = () => {
        if (reqToCompanyName !== '') {
            if (reqToCompanyDepartment !== '') {
                if (reqSendTo.length !== 0) {
                    if (reqTitle !== '') {
                        if (reqDescription !== '') {
                            handleSubmitNewOfficeRequest();
                        } else {
                            warningMessage('متن درخواست نمی تواند خالی باشد!');
                        }
                    } else {
                        warningMessage('انتخاب عنوان درخواست اجباری می باشد!');
                    }
                } else {
                    warningMessage('انتخاب شخص دریافت کننده الزامی می باشد!');
                }
            } else {
                warningMessage('انتخاب واحد مقصد الزامی می باشد!');
            }
        } else {
            warningMessage('انتخاب شرکت مقصد الزامی می باشد!');
        }
    }
    const handleRequestReset = () => {
        setReqFromCompanyName(submitNewReqFromCo);
        setReqFromCompanyDepartment(submitNewReqFromDep);
        setReqToCompanyName(submitNewReqToCo);
        setReqToCompanyDepartment(submitNewReqToDep);
        setReqSendTo([]);
        setReqSendCopyTo([])
        setReqTitle('')
        setReqDescription('');
        setReqLink('');
        setReqLinks([]);
        setReqFile('');
        setReqFileType('');
        setReqFileName('');
        setReqFiles([]);
    }

    const [officeReqsList, setOfficeReqsList] = useState([]);
    const [reqItemViewsList, setReqItemViewsList] = useState([]);
    const [reqItemViewsModalShow, setReqItemViewsModalShow] = useState(false);
    const [reqItemLikesList, setReqItemLikesList] = useState([]);
    const [reqItemLikesModalShow, setReqItemLikesModalShow] = useState(false);
    const [reqItemDisLikesList, setReqItemDisLikesList] = useState([]);
    const [reqItemDisLikesModalShow, setReqItemDisLikesModalShow] = useState(false);
    const handleOfficeReqsList = async () => {
        setLoading(true);
        try {
            const { data } = await getOfficeReqsList();
            if (data.code === 403) {
                setLoading(false);
                errorMessage('داده ای برای نمایش یافت نشد!');
                setOfficeReqsList([]);
            } else if (data) {
                setOfficeReqsList(data);
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }
    const [officeReqDetails, setOfficeReqDetails] = useState({});
    const handleOfficeReqDetails = async (reqId) => {
        setLoading(true);
        try {
            const { data } = await getOfficeReqDetails(reqId);
            if (data) {
                localStorage.setItem('reqId', data._id)
                setOfficeReqDetails(data);
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }
    const handleOfficeReqSeen = async (reqId) => {
        try {
            const actionValues = {
                actionId: reqId,
                actionCode: 15,
                userId: localStorage.getItem('id'),
                typeId: 11
            }
            const { data } = await postOfficeAction(actionValues);
            if (data) {

            }
        } catch (ex) {
            console.log(ex);
        }
    }
    // req detail comments
    const [officeReqNewComment, setOfficeReqNewComment] = useState('');
    const [officeReqComment, setOfficeReqComment] = useState('');
    const [replyCommentId, setReplyCommentId] = useState('');
    const handleReqCommentAction = async (repCommentId) => {
        try {
            const sendCommentAction = async () => {

                const { data } = await postOfficeAction(actionValues);

                if (data) {
                    setReplyCommentId('');
                    setOfficeReqComment('');
                    setOfficeReqNewComment('');
                    handleOfficeReqDetails(localStorage.getItem('reqId'));
                }
            }
            var actionValues;
            if (repCommentId !== undefined) {
                if (officeReqComment !== '') {
                    actionValues = {
                        actionId: officeReqDetails._id,
                        actionCode: 8,
                        userId: localStorage.getItem('id'),
                        comment: officeReqComment,
                        srcComment: repCommentId
                    }
                    sendCommentAction();
                } else {
                    warningMessage('نظری برای ثبت یافت نشد!')
                }
            } else {
                if (officeReqNewComment !== '') {
                    actionValues = {
                        actionId: officeReqDetails._id,
                        actionCode: 8,
                        userId: localStorage.getItem('id'),
                        comment: officeReqNewComment,
                        srcComment: ''
                    }
                    sendCommentAction();
                } else {
                    warningMessage('نظری برای ثبت یافت نشد!')
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    // req and comment likes and dislikes
    const handleOfficeReqLikeAndDis = async (type, eCode, id) => {
        try {
            const officeLikeAndDisValues = {
                type: type,
                user: localStorage.getItem('id'),
                eCode: eCode,
                src: id
            }
            const { data } = await postOfficeReqLikeAndDis(officeLikeAndDisValues);
            if (data.code === 404) {
                warningMessage('نظر شما قبلا ثبت شده!')
            } else {
                if (type === 'r') {
                    handleOfficeReqsList();
                } else if (type === 'c') {
                    handleOfficeReqDetails(localStorage.getItem('reqId'))
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    //req expired
    const handleOfficeReqExpired = async (reqId) => {
        try {
            const { data } = await patchOfficeReqExpired(reqId);
            if (data) {

            }
        } catch (ex) {
            console.log(ex);
        }
    }


    const [updateReqValuesModal, setUpdateReqValuesModal] = useState(false);
    const handleOfficeUpdateReqInfo = async () => {
        var modal = 'accept';
        if (cancelReqModal) {
            modal = 'cancel'
        }
        // handleOfficeLeaveDetails(currentRequest.reqInfo._id, modal);
        setUpdateReqValuesModal(false);
    }



    // new mission request
    const [officeMissionInCity, setOfficeMissionInCity] = useState(true);
    const [officeMissionSubject, setOfficeMissionSubject] = useState('');
    const officeMissionSubjectRef = useRef();
    const [officeMissionCity, setOfficeMissionCity] = useState('');
    const officeMissionCityRef = useRef();
    const [officeMissionProvince, setOfficeMissionProvince] = useState('');
    const officeMissionProvinceRef = useRef();
    const [officeMissionFactory, setOfficeMissionFactory] = useState('');
    const [officeMissionFromDate, setOfficeMissionFromDate] = useState(null);
    const officeMissionFromDateRef = useRef();
    const officeMissionToDateRef = useRef();
    const [allTripTypesSelect, setAllTripTypesSelect] = useState([]);
    const [officeMissionType, setOfficeMissionType] = useState([]);
    const officeMissionTypeRef = useRef();
    const [officeMissionDescription, setOfficeMissionDescription] = useState('');
    const [officeMissionOverTimeFromDate, setOfficeMissionOverTimeFromDate] = useState(null);
    const [officeMissionOverTimeToDate, setOfficeMissionOverTimeToDate] = useState(null);
    const [officeMissionMealExpense, setOfficeMissionMealExpense] = useState('');
    const [officeMissionTransportation, setOfficeMissionTransportation] = useState('');
    const [officeOtherExpenses, setOfficeOtherExpenses] = useState('');
    const handleGetAllTripTypes = async () => {
        try {
            const tripTypesRes = await getAllTripTypes();
            if (tripTypesRes.data) {
                setAllTripTypesSelect(tripTypesRes.data)
            } else {
                setAllTripTypesSelect([])
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleMissionSubjectValidation = () => {
        if (officeMissionSubjectRef.current.value === '') {
            document.getElementById('officeMissionSubject-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('officeMissionSubject-required').classList.add('d-none');
            return true;
        }
    }
    const handleMissionProvinceValidation = () => {
        if (officeMissionProvinceRef.current.props.value === '') {
            document.getElementById('officeMissionProvince-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('officeMissionProvince-required').classList.add('d-none');
            return true;
        }
    }
    const handleMissionCityValidation = () => {
        if (officeMissionCityRef.current.props.value === '') {
            document.getElementById('officeMissionCity-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('officeMissionCity-required').classList.add('d-none');
            return true;
        }
    }
    const handleMissionFromDateValidation = () => {
        if (officeMissionFromDateRef.current.props.value === null) {
            document.getElementById('officeMissionFromDate-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('officeMissionFromDate-required').classList.add('d-none');
            return true;
        }
    }
    const handleMissionToDateValidation = () => {
        if (officeMissionToDateRef.current.props.value === null) {
            document.getElementById('officeMissionToDate-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('officeMissionToDate-required').classList.add('d-none');
            return true;
        }
    }
    const handleMissionTypeValidation = () => {
        if (officeMissionTypeRef.current.props.value === null) {
            document.getElementById('officeMissionType-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('officeMissionType-required').classList.add('d-none');
            return true;
        }
    }
    const handleMissionNewReqValidation = () => {
        const missionSubjectValidate = handleMissionSubjectValidation();
        const missionProvinceValidate = handleMissionProvinceValidation();
        const missionCityValidate = handleMissionCityValidation();
        const missionFromDateValidate = handleMissionFromDateValidation();
        const missionToDateValidate = handleMissionToDateValidation();
        const missionTypeValidation = handleMissionTypeValidation();
        if (missionSubjectValidate && missionProvinceValidate && missionCityValidate && missionFromDateValidate && missionToDateValidate && missionTypeValidation) {
            return true;
        } else {
            return false;
        }
    }
    const handleOfficeNewMissionReq = async () => {
        try {
            if (handleMissionNewReqValidation()) {
                const officeMissionReqValues = {
                    subject: officeMissionSubject,
                    city: JSON.stringify({ CityCode: officeMissionCity.value, ProvinceCode: officeMissionProvince.value }),
                    startDate: officeMissionFromDate,
                    endDate: officeMissionToDate,
                    description: officeMissionDescription,
                    inCity: officeMissionInCity,
                    tripType: officeMissionType.value,
                    toCompany: officeMissionFactory !== '' ? officeMissionFactory.value : '',
                }
                const { data } = await postOfficeMissionReq(officeMissionReqValues);
                if (data.code === 415) {
                    const officeLeaveActionValues = {
                        actionId: data.id,
                        actionCode: 0,
                        userId: localStorage.getItem('id'),
                        toPersons: [user.Supervisor._id],
                        typeId: 9,
                    }
                    const leaveActionRes = await postAction(officeLeaveActionValues);
                    if (leaveActionRes.data.code === 415) {
                        handleOfficeNewMissionReset();
                        successMessage('درخواست ماموریت با موفقیت ثبت شد!')
                    }
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleOfficeNewMissionReset = () => {
        setOfficeMissionSubject('');
        setOfficeMissionProvince('');
        setOfficeMissionCity('');
        setOfficeMissionFactory('');
        setOfficeMissionFromDate(null);
        setOfficeMissionToDate(null);
        setOfficeMissionDescription('');
        setOfficeMissionInCity(true);
        setOfficeMissionType('');
    }


    const [driversSelect, setDriversSelect] = useState([]);
    const [driverInfo, setDriverInfo] = useState('');
    const handleGetDrivers = async () => {
        try {
            const driversRes = await getDrivers();
            if (driversRes.data) {
                setDriversSelect(driversRes.data)
            } else {
                setDriversSelect([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleGetDriverInfo = async (driverId) => {
        try {
            const driverInfoRes = await getDriverInfo(driverId);
            if (driverInfoRes.data) {
                setDriverInfo(driverInfoRes.data)
            } else {
                setDriverInfo('')
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    const [userInfoToCoordinateMission, setUserInfoToCoordinateMission] = useState({});
    const [missionOriginTerminal, setMissionOriginTerminal] = useState('');
    const [missionDestinationTerminal, setMissionDestinationTerminal] = useState('');
    const [missionOriginTicketDate, setMissionOriginTicketDate] = useState(null);
    const [missionDestinationTicketDate, setMissionDestinationTicketDate] = useState(null);
    const [misionOriginTicketHours, setMissionOriginTicketHours] = useState('');
    const [misionOriginTicketMinutes, setMissionOriginTicketMinutes] = useState('');
    const [misionDestinationTicketHours, setMissionDestinationTicketHours] = useState('');
    const [misionDestinationTicketMinutes, setMissionDestinationTicketMinutes] = useState('');
    const [missionOriginTicketNum, setMissionOriginTicketNum] = useState('');
    const [missionDestinationTicketNum, setMissionDestinationTicketNum] = useState('');
    const handleGetUserInfoToCoordinateMission = async (userId) => {
        try {
            const userInfoToCoordinateMissionRes = await getUserInfoToCoordinateMission(userId);
            if (userInfoToCoordinateMissionRes.data.birthdate !== undefined) {
                setUserInfoToCoordinateMission(userInfoToCoordinateMissionRes.data)
            } else {
                setUserInfoToCoordinateMission({});
            }
        } catch (ex) {
            console.log(ex);
        }
    }


    const [paySlipData, setPaySlipData] = useState(null);
    const [getPasswordModalShow, setGetPasswordModalShow] = useState(false);
    const [paySlipPass, setPaySlipPass] = useState('');

    const [yearSelect, setYearSelect] = useState({});
    const [monthSelect, setMonthSelect] = useState({});
    const currentDate = () => {
        // let date1 = new Date()
        // let month1 = new Date().toLocaleDateString('fa-IR', { month: 'numeric', numberingSystem: 'latn'})
        // console.log(month1);
        // date1.setMonth(month1-2)
        // console.log(date1.getMonth());
        // console.log(date1);

        var date = new Date();
        date.setMonth(date.getMonth(0) - 1);
        setYearSelect({ year: date.toLocaleDateString("fa-IR-u-nu-latn", { year: 'numeric' }), yearName: date.toLocaleDateString("fa-IR-u-nu-latn", { year: 'numeric' }) });
        setMonthSelect({ month: date.toLocaleDateString("fa-IR-u-nu-latn", { month: 'numeric' }), monthName: date.toLocaleDateString("fa-IR", { month: 'long' }) });
    }
    useEffect(() => {
        currentDate();
    }, [])
    const [paySlipYear, setPaySlipYear] = useState({});
    const [paySlipMonth, setPaySlipMonth] = useState({});
    useEffect(() => {
        setPaySlipYear({ value: yearSelect.year, label: yearSelect.yearName });
        if(paySlipData !== null && paySlipData.monthCode !== undefined){
            setPaySlipMonth({ value: paySlipData.monthCode, label: paySlipData.monthName });
        }
    }, [yearSelect, paySlipData])

    const handleUserPaySlip = async (event, paySlipStatus) => {
        setLoading(true);
        if (event.preventDefault !== undefined) {
            event.preventDefault();
        }
        setGetPasswordModalShow(false);
        try {
            if (paySlipStatus === 'currentPaySlip') {
                currentDate();
                if (paySlipPass !== '') {
                    const { data } = await getUserPaySlip(user.UserName, user.UserName, paySlipPass, '', paySlipStatus);
                    if (data.code === 407) {
                        setLoading(false);
                        errorMessage('رمزعبور اشتباه می باشد!');
                        setGetPasswordModalShow(true);
                        setPaySlipData(null);
                    } else if (data.code === 406) {
                        setLoading(false);
                        errorMessage('فیش حقوقی یافت نشد!');
                        setPaySlipPass('');
                        setPaySlipData(null);
                    } else if (data.FullName !== undefined) {
                        setLoading(false);
                        setPaySlipData(data);
                        setPaySlipPass('');
                    } else {
                        setLoading(false);
                        errorMessage('خطایی رخ داده است!');
                        setPaySlipData(null);
                    }
                } else {
                    setLoading(false);
                    warningMessage('رمزعبور را وارد کنید!')
                    setGetPasswordModalShow(true);
                }
            } else if (paySlipStatus === 'monthPaySlip') {
                const { data } = await getUserPaySlip(user.UserName, '', '', event, paySlipStatus);
                if (data.code === 406) {
                    setLoading(false);
                    errorMessage('فیش حقوقی یافت نشد!');
                    setPaySlipData(null);
                } else if (data.FullName !== undefined) {
                    setLoading(false);
                    setPaySlipData(data);
                } else {
                    setLoading(false);
                    errorMessage('خطایی رخ داده است!');
                    setPaySlipData(null);
                }
            }
        } catch (ex) {
            setLoading(false);
            console.log(ex);
        }
    }


    const [changeJob, setChangeJob] = useState(false);
    const [changeJobFrom, setJobChangeFrom] = useState('');
    const [changeJobTo, setJobChangeTo] = useState('');
    const [changeJobDesc, setChangeJobDesc] = useState('');
    const handleJobChanged = async () => {
        try {
            const changeJobValues = {
                userId: localStorage.getItem('id'),
                changeJob: changeJob,
                from: changeJobFrom,
                to: changeJobTo,
                description: changeJobDesc
            }
            const { data } = await postJobChange(changeJobValues);
            handleResetJobChange();
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleResetJobChange = () => {
        setChangeJob(false);
        setJobChangeFrom('');
        setJobChangeTo('');
        setChangeJobDesc('');
    }

    // news
    const [officeNewsDescription, setOfficeNewsDescription] = useState('');
    const handleOfficeNewsSubmit = async () => {
        if (officeNewsDescription !== '') {
            try {
                const OfficeAddNewsValues = {
                    userId: localStorage.getItem('id'),
                    body: officeNewsDescription
                }
                const { data } = await postOfficeNews(OfficeAddNewsValues);
                if (data.body !== undefined) {
                    successMessage('خبر با موفقیت منتشر شد!');
                    setOfficeNewsDescription('');
                }
            } catch (ex) {
                console.log(ex);
            }
        } else {
            errorMessage('وارد کردن متن پیام اجباری است!')
        }
    }
    const [officeNewsList, setOfficeNewsList] = useState([]);
    const handleOfficeNews = async () => {
        setLoading(true);
        try {
            const { data } = await getOfficeNews();
            if (data.length !== 0) {
                setLoading(false);
                setOfficeNewsList(data);
            } else if (data.length === 0) {
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }
    // END news

    // notice
    const [officeNoticeDescription, setOfficeNoticeDescription] = useState('');
    const handleOfficeNoticeSubmit = async () => {
        if (officeNoticeDescription !== '') {
            try {
                const OfficeAddNoticeValues = {
                    body: officeNoticeDescription
                }
                const { data } = await postOfficeNotice(OfficeAddNoticeValues);
                if (data.code === 415) {
                    const actionValues = {
                        actionCode: 0,
                        actionId: data._id,
                        userId: localStorage.getItem('id'),
                        typeId: 18
                    }
                    const actionRes = await postAction(actionValues);
                    if (actionRes.data.code === 415) {
                        successMessage('اطلاعیه با موفقیت منتشر شد!');
                        setOfficeNoticeDescription('');
                    }
                } else {
                    errorMessage('اطلاعیه ثبت نشد!');
                }
            } catch (ex) {
                console.log(ex);
            }
        } else {
            errorMessage('وارد کردن متن پیام اجباری است!')
        }
    }
    const [officeNoticesList, setOfficeNoticesList] = useState([]);
    const handleOfficeNotices = async () => {
        setLoading(true);
        try {
            const { data } = await getOfficeNotices();
            if (data.length !== 0) {
                setLoading(false);
                setOfficeNoticesList(data);
            } else if (data.length === 0) {
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }
    // END notice

    // food
    const [menuFoodDate, setMenuFoodDate] = useState(null);
    const [menuFood, setMenuFood] = useState('');
    const [menuDaysFood, setMenuDaysFood] = useState([]);
    const handleAddDayFood = () => {
        if (menuFoodDate !== null) {
            if (menuFood !== '') {
                const newItems = [...menuDaysFood];
                const newItem = { id: Math.floor(Math.random() * 1000), date: menuFoodDate, food: menuFood }
                newItems.push(newItem);
                const result = newItems.reduce((acc, item) => {
                    const itemInAcc = acc.find(itemAcc => itemAcc.food === item.food || itemAcc.date.toJSON().substring(0, 10) === item.date.toJSON().substring(0, 10));
                    if (itemInAcc !== undefined) {
                        warningMessage('تاریخ یا غذای این آیتم تکراری می باشد.');
                    } else {
                        acc.push({ ...item })
                    }
                    return acc;
                }, []);
                if (menuDaysFood.length !== result.length) {
                    setMenuDaysFood(result);
                    setMenuFoodDate(null);
                    setMenuFood('');
                }
            } else {
                errorMessage('وارد کردن نام غذا الزامی است!');
            }
        } else {
            errorMessage('انتخاب تاریخ الزامی است!');
        }
    }
    const [patchDayFoodModal, setPatchDayFoodModal] = useState(false);
    const [patchDayFood, setPatchDayFood] = useState('');
    const handleChangedDaysFood = async () => {
        try {
            if (menuDaysFood.length !== 0) {
                var count = 0;
                var dupCount = 0;
                for (var i = 0; i < menuDaysFood.length; i++) {
                    let food = menuDaysFood[i].food.replace("ك", "ک");
                    food = food.replace("ي", "ی");
                    const daysFoodValues = {
                        userId: localStorage.getItem('id'),
                        name: food,
                        date: menuDaysFood[i].date,
                    }
                    const { data } = await postDaysFood(daysFoodValues);
                    if (data.name !== undefined) {
                        count++;
                    } else if (data.code === 411) {
                        dupCount++;
                        setPatchDayFoodModal(true);
                        setPatchDayFood(daysFoodValues);
                    }
                }
                if (count === (menuDaysFood.length - dupCount) && (menuDaysFood.length - dupCount) !== 0) {
                    setMenuDaysFood([]);
                    setMenuFoodDate(null);
                    setMenuFood('');
                    successMessage(`منو غذایی  ${count} روز با موفقیت ثبت شد`)
                } else if ((menuDaysFood.length - dupCount) === 0) {

                } else {
                    errorMessage('بروزرسانی اطلاعات به درستی انجام نشد!')
                }
            } else {
                errorMessage('وارد کردن حداقل یک آیتم ضروری است!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handlePatchDaysFood = async () => {
        try {
            if (patchDayFood !== '') {
                const { data } = await patchDaysFood(patchDayFood);
                setMenuDaysFood([]);
                setMenuFoodDate(null);
                setMenuFood('');
                setPatchDayFood('');
                successMessage('منو غذایی تاریخ موردنظر با موفقیت بروزرسانی شد!');
                setPatchDayFoodModal(false);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    // END food


    // Send Request toPerson
    const handleSendReqToPersons = async () => {
        if (user.Supervisor.FirstName !== 'نامشخص') {
            const actionToPersonsRes = await postActionToPersons(currentReqInfo.requestId, 4, user.Supervisor._id);
            if (actionToPersonsRes.data.code === 415) {
                dispatch(RsetActionToPersonsModal(false));
                successMessage('درخواست با موفقیت ارسال شد!');
                if (window.location.pathname === '/LeaveReqRegistration') {
                    dispatch(handleResetNewLeaveReq());
                } else if (window.location.pathname === '/LeaveReqsList') {
                    const filterParams = {
                        applicantId: localStorage.getItem('id'),
                        serial: '',
                        memberId: '',
                        status: '',
                        fromDate: 'null',
                        toDate: 'null',
                        year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
                        type: 4
                    }
                    handleGetRequestList(filterParams);
                }
            } else {
                errorMessage('خطا در ارسال درخواست!');
            }
        }else{
            errorMessage('سرپرست انتخاب نشده!');
            dispatch(RsetActionToPersonsModal(false));
        }
    };

    return (
        <officeReqContext.Provider
            value={{
                reqFromCompanyName,
                setReqFromCompanyName,
                reqFromCompanyDepartment,
                setReqFromCompanyDepartment,
                reqToCompanyName,
                setReqToCompanyName,
                reqToCompanyDepartment,
                setReqToCompanyDepartment,
                reqSendTo,
                setReqSendTo,
                reqSendCopyTo,
                setReqSendCopyTo,
                reqTitle,
                setReqTitle,
                reqDescription,
                setReqDescription,
                reqEnableComment,
                setReqEnableComment,
                reqLink,
                setReqLink,
                handleAddLink,
                reqLinks,
                reqLinksModalShow,
                setReqLinksModalShow,
                handleUploadReqFile,
                handleAddReqFile,
                reqFiles,
                reqFilesModalShow,
                setReqFilesModalShow,
                handleSubmitNewReqValidation,
                handleRequestReset,
                handleOfficeReqsList,
                officeReqsList,
                handleOfficeReqLikeAndDis,
                reqItemViewsList,
                setReqItemViewsList,
                reqItemViewsModalShow,
                setReqItemViewsModalShow,
                reqItemLikesList,
                setReqItemLikesList,
                reqItemLikesModalShow,
                setReqItemLikesModalShow,
                reqItemDisLikesList,
                setReqItemDisLikesList,
                reqItemDisLikesModalShow,
                setReqItemDisLikesModalShow,
                handleOfficeReqDetails,
                handleOfficeReqSeen,
                officeReqDetails,
                officeReqNewComment,
                setOfficeReqNewComment,
                officeReqComment,
                setOfficeReqComment,
                handleReqCommentAction,
                replyCommentId,
                setReplyCommentId,
                handleOfficeReqExpired,

                updateReqValuesModal,
                setUpdateReqValuesModal,
                handleOfficeUpdateReqInfo,

                officeMissionInCity,
                setOfficeMissionInCity,
                officeMissionSubject,
                setOfficeMissionSubject,
                officeMissionSubjectRef,
                officeMissionCity,
                setOfficeMissionCity,
                officeMissionCityRef,
                officeMissionProvince,
                setOfficeMissionProvince,
                officeMissionProvinceRef,
                officeMissionFactory,
                setOfficeMissionFactory,
                officeMissionFromDate,
                setOfficeMissionFromDate,
                officeMissionFromDateRef,
                officeMissionToDateRef,
                handleGetAllTripTypes,
                allTripTypesSelect,
                officeMissionType,
                setOfficeMissionType,
                officeMissionTypeRef,
                officeMissionDescription,
                setOfficeMissionDescription,
                officeMissionOverTimeFromDate,
                setOfficeMissionOverTimeFromDate,
                officeMissionOverTimeToDate,
                setOfficeMissionOverTimeToDate,
                officeMissionMealExpense,
                setOfficeMissionMealExpense,
                officeMissionTransportation,
                setOfficeMissionTransportation,
                officeOtherExpenses,
                setOfficeOtherExpenses,
                handleOfficeNewMissionReq,
                handleOfficeNewMissionReset,
                driversSelect,
                handleGetDrivers,
                handleGetDriverInfo,
                driverInfo,
                setDriverInfo,
                handleGetUserInfoToCoordinateMission,
                userInfoToCoordinateMission,

                handleUserPaySlip,
                paySlipData,
                getPasswordModalShow,
                setGetPasswordModalShow,
                paySlipYear,
                setPaySlipYear,
                paySlipMonth,
                setPaySlipMonth,
                paySlipPass,
                setPaySlipPass,

                changeJob,
                setChangeJob,
                changeJobFrom,
                setJobChangeFrom,
                changeJobTo,
                setJobChangeTo,
                changeJobDesc,
                setChangeJobDesc,
                handleJobChanged,
                handleResetJobChange,

                officeNewsDescription,
                setOfficeNewsDescription,
                handleOfficeNewsSubmit,
                handleOfficeNews,
                officeNewsList,

                officeNoticeDescription,
                setOfficeNoticeDescription,
                handleOfficeNoticeSubmit,
                handleOfficeNotices,
                officeNoticesList,

                menuFoodDate,
                setMenuFoodDate,
                menuFood,
                setMenuFood,
                handleAddDayFood,
                menuDaysFood,
                setMenuDaysFood,
                handleChangedDaysFood,
                patchDayFoodModal,
                setPatchDayFoodModal,
                handlePatchDaysFood,

                handleSendReqToPersons
            }}
        >
            {acceptReqModal ? <AcceptRequest /> : null}

            {nextAcceptReqModal ? <NextAcceptRequest /> : null}

            {cancelReqModal ? <CancelRequest /> : null}

            {updateReqValuesModal ? <ChangedReqValues /> : null}

            {viewReqModal ? <ViewRequest /> : null}

            {actionToPersonsModal ? <ActionToPersonsM /> : null}

            {reqHistoryModal ? <ReqHistoryModal /> : null}

            {children}
        </officeReqContext.Provider>
    )
}

export default OfficeRequestContext;