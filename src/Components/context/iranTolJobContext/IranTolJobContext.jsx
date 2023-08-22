import React, { useContext, useState, useRef } from "react";
import { rootContext } from "../rootContext";
import { iranTolJobCntxt } from "./IranTolJobCntxt";
import { addFileCntxt } from "../AddFileContext/addFileCntxt";
import { successMessage, warningMessage, errorMessage } from "../../../utils/message";
import { postAction, postActionToPersons, getToPersonByRole, checkReqUpdateDate } from '../../../Services/rootServices';
import {
    postITJReq, downloadITJReqFile, addITJReqFile, downloadITJReqPlans, getWorkDeps, getWorkTypes, getWorkDevices, patchWorkAndMaterials,
    getITJProjectTools, getITJProjectTypes, getITJReqFileList
} from "../../../Services/irantolJobReqServices";
import ActionToPersonsModal from "../../Modals/ITJReqModals/ActionToPersonsModal";
import AcceptRequest from "../../Modals/ITJReqModals/AcceptRequestModal";
import CancelRequest from "../../Modals/ITJReqModals/CancelRequestModal";
import ViewRequest from "../../Modals/ITJReqModals/ViewRequestModal";
import { useSelector, useDispatch } from 'react-redux';
import { RsetLoading, selectUser } from '../../Slices/mainSlices';

import { selectAcceptReqModal, selectCancelReqModal, RsetCancelReqModal, selectViewReqModal, RsetAcceptReqModal, selectAcceptReqComment, RsetAcceptReqComment, selectCancelReqComment, RsetCancelReqComment } from '../../Slices/modalsSlice';

const IranTolJobContext = ({ children }) => {

    const acceptReqModal = useSelector(selectAcceptReqModal);
    const cancelReqModal = useSelector(selectCancelReqModal);
    const viewReqModal = useSelector(selectViewReqModal);
    const acceptReqComment = useSelector(selectAcceptReqComment);
    const cancelReqComment = useSelector(selectCancelReqComment);

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const mainContext = useContext(rootContext);
    const {
        setUsersFilterSelect,
        setLoading,
        currentReqInfo,
        currentReqId,
        setItemDeletePerModal,
        generateRanHex,
        handleGetRequestList
    } = mainContext;

    const addFileContext = useContext(addFileCntxt);
    const {
        reqFiles,
        setReqFiles,
    } = addFileContext;

    const [iTJProjectName, setITJProjectName] = useState('');
    const iTJProjectNameRef = useRef();
    const [iTJProjectType, setITJProjectType] = useState('');
    const iTJProjectTypeRef = useRef();
    const [iTJProjectTypeSelect, setITJProjectTypeSelect] = useState([]);
    const [iTJProjectTypeWithAllSelect, setITJProjectTypeWithAllSelect] = useState([{ value: '', label: 'همه' }]);
    const [iTJProjectTool, setITJProjectTool] = useState('');
    const iTJProjectToolRef = useRef();
    const [iTJProjectToolSelect, setITJProjectToolSelect] = useState([]);
    const [iTJProjectToolWithAllSelect, setITJProjectToolWithAllSelect] = useState([{ value: '', label: 'همه' }]);
    const [iTJProjectAmount, setITJProjectAmount] = useState('');
    const iTJProjectAmountRef = useRef();
    const [iTJProjectDeadline, setITJProjectDeadline] = useState(null);
    const [iTJProjectDesc, setITJProjectDesc] = useState('');
    const [iTJProjectFile, setITJProjectFile] = useState('');
    const [iTJProjectLink, setITJProjectLink] = useState('');
    const [iTJProjectLinks, setITJProjectLinks] = useState([]);

    const handleITJProjectTools = async () => {
        try {
            // 
            const projectToolsRes = await getITJProjectTools();
            if (projectToolsRes.data.code === 415) {
                setITJProjectToolSelect(projectToolsRes.data.types)
                const tools = [...iTJProjectToolWithAllSelect];
                projectToolsRes.data.types.map(tool => {
                    tools.push(tool);
                });
                setITJProjectToolWithAllSelect(tools)
            } else {
                setITJProjectToolSelect([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleITJProjectTypes = async () => {
        try {
            const projectTypesRes = await getITJProjectTypes();
            if (projectTypesRes.data.code === 415) {
                setITJProjectTypeSelect(projectTypesRes.data.types)
                const types = [...iTJProjectTypeWithAllSelect];
                projectTypesRes.data.types.map(tool => {
                    types.push(tool);
                });
                setITJProjectTypeWithAllSelect(types)
            } else {
                setITJProjectTypeSelect([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleITJProjectNameValidation = () => {
        if (iTJProjectNameRef.current.value === "") {
            document.getElementById('iTJProjectName-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectName-required').classList.add('d-none');
            return true;
        }
    }
    const handleITJProjectTypeValidation = () => {
        if (iTJProjectTypeRef.current.props.value === "") {
            document.getElementById('iTJProjectType-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectType-required').classList.add('d-none');
            return true;
        }
    }
    const handleITJToolTypeValidation = () => {
        if (iTJProjectToolRef.current.props.value === "") {
            document.getElementById('iTJProjectTool-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectTool-required').classList.add('d-none');
            return true;
        }
    }
    const handleITJProjectAmountValidation = () => {
        if (iTJProjectAmountRef.current.value === "") {
            document.getElementById('iTJProjectAmount-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectAmount-required').classList.add('d-none');
            return true;
        }
    }

    const handleITJProjectValidation = () => {
        const projectNameValidation = handleITJProjectNameValidation();
        const projectTypeValidation = handleITJProjectTypeValidation();
        const projectToolValidation = handleITJToolTypeValidation();
        const projectAmountValidation = handleITJProjectAmountValidation();
        if (projectNameValidation && projectTypeValidation && projectToolValidation && projectAmountValidation) {
            return true;
        } else {
            return false;
        }
    }
    const [actionToPersonsModal, setActionToPersonsModal] = useState(false);
    const [actionReqId, setActionReqId] = useState('');
    const handleConfirmITJReq = async () => {
        try {
            if (handleITJProjectValidation()) {
                setLoading(true);
                const iTJReqValues = {
                    projectName: iTJProjectName,
                    requestType: iTJProjectType.value,
                    toolType: iTJProjectTool.value,
                    amount: iTJProjectAmount.replace(',', ''),
                    deadline: iTJProjectDeadline !== null ? iTJProjectDeadline.format('YYYY/MM/DD') : null,
                    description: iTJProjectDesc,
                    file: reqFiles.length !== 0 ? true : false
                }
                var files = [];
                if (reqFiles.length !== 0) {
                    const data = new FormData();
                    for (var x = 0; x < reqFiles.length; x++) {
                        data.append('reqFiles', reqFiles[x])
                    }
                    files = data;
                }
                const iTJReqRes = await postITJReq(iTJReqValues, files);
                if (iTJReqRes.data.code === 415) {
                    setActionReqId(iTJReqRes.data.id);
                    const actionValues = {
                        actionCode: 0,
                        actionId: iTJReqRes.data.id,
                        userId: localStorage.getItem('id'),
                        typeId: 1
                    }
                    const actionRes = await postAction(actionValues);
                    if (actionRes.data.code === 415) {
                        successMessage('درخواست با موفقیت ثبت شد!');
                        setActionToPersonsModal(true);
                        setLoading(false);
                    } else {
                        //delete action and req from db
                    }
                } else {
                    errorMessage('خطا در ثبت درخواست!');
                    setLoading(false);
                }
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }

    const handleResetITJReq = () => {
        setITJProjectName('');
        setITJProjectType('');
        setITJProjectTool('');
        setITJProjectAmount('');
        setITJProjectDeadline(null);
        setITJProjectDesc('');
        setReqFiles([]);
        const sendToPersons = document.getElementById('sendToPersons');
        const confirmITJReq = document.getElementById('confirmITJReq');
        if (sendToPersons !== null) {
            sendToPersons.classList.add('disabled');
        }
        if (confirmITJReq !== null) {
            confirmITJReq.classList.remove('disabled');
        }
    }

    const [needConfirmation, setNeedConfirmation] = useState(false);
    const [needConfirmationUsers, setNeedConfirmationUsers] = useState([]);
    const [needConfirmationSelect, setNeedConfirmationSelect] = useState([]);
    const handleNeedConfirmationUsers = async () => {
        try {
            const toPersonRes = await getToPersonByRole('35', 10, 49, 1, null, '0');
            if (toPersonRes.data.code === 415) {
                setNeedConfirmationSelect(toPersonRes.data.list);
            } else {
                setNeedConfirmationSelect([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleITJReqActionToPersons = async () => {
        try {
            var toPersons = '';
            if (needConfirmation === true) {
                if (needConfirmationUsers.length !== 0) {
                    toPersons = needConfirmationUsers.map(person => {
                        return person.value
                    });
                    toPersons = String(toPersons);
                } else {
                    errorMessage('فردی انتخاب نشده است!')
                }
            } else {
                const toPersonRes = await getToPersonByRole('14', 2, 49, 1, null, '0');
                if (toPersonRes.data.code === 415) {
                    toPersons = toPersonRes.data.list[0].value;
                } else {
                    errorMessage('شخص دریافت کننده ای یافت نشد!')
                }
            }
            if (toPersons !== '') {
                const actionToPersonsRes = await postActionToPersons(actionReqId, 1, toPersons);
                if (actionToPersonsRes.data.code === 415) {
                    handleResetITJReq();
                    setActionToPersonsModal(false);
                    const filterParams = {
                        applicantId: localStorage.getItem('id'),
                        serial: '',
                        memberId: '',
                        company: '',
                        requestType: '',
                        toolType: '',
                        status: '',
                        fromDate: 'null',
                        toDate: 'null',
                        type: 1
                    }
                    handleGetRequestList(filterParams);
                    successMessage('درخواست با موفقیت ارسال شد!')
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleDownloadReqFile = async (fileName, reqId, index, multi) => {
        try {
            const downloadRes = await downloadITJReqFile(reqId, index, multi);
            const url = window.URL.createObjectURL(downloadRes.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click()
            link.parentNode.removeChild(link);
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleDownloadReqPlans = async (fileName, reqId, index, multi) => {
        try {
            const downloadRes = await downloadITJReqPlans(reqId, index, multi);
            const url = window.URL.createObjectURL(downloadRes.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click()
            link.parentNode.removeChild(link);
        } catch (ex) {
            console.log(ex);
        }
    }

    // const handleShowReqFiles = (reqId, index, multi, justShow) => {
    //     if (currentReqInfo.userId === localStorage.getItem('id')) {
    //         handleReqFiles(reqId, index, multi, justShow);
    //         return true;
    //     } else if (currentReqInfo.process[0].toPersons.some(userId => userId === localStorage.getItem('id')) === true) {
    //         handleReqFiles(reqId, index, multi, justShow);
    //         return true;
    //     } else if (user.Roles.some(role=> role === '4' || role === '5' || role === '6')) {
    //         handleReqFiles(reqId, index, multi, justShow);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    const [workDeps, setWorkDeps] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [workDevices, setWorkDevices] = useState([]);
    const [workOperators, setWorkOperators] = useState([]);
    const handleWorkDeps = async () => {
        try {
            const workDepsRes = await getWorkDeps();
            if (workDepsRes.data.length !== undefined && workDepsRes.data.length !== 0) {
                setWorkDeps(workDepsRes.data)
            } else {
                setWorkDeps([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleWorkTypes = async () => {
        try {
            const workTypesRes = await getWorkTypes();
            if (workTypesRes.data.length !== undefined && workTypesRes.data.length !== 0) {
                setWorkTypes(workTypesRes.data)
            } else {
                setWorkTypes([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleWorkDevices = async () => {
        try {
            const workDevicesRes = await getWorkDevices();
            if (workDevicesRes.data.length !== undefined && workDevicesRes.data.length !== 0) {
                setWorkDevices(workDevicesRes.data)
            } else {
                setWorkDevices([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleWorkOperators = async () => {
        try {
            const workOperatorsRes = await getToPersonByRole('65', user.Location, user.CompanyCode, 1, null, '0');
            if (workOperatorsRes.data.code === 415) {
                setWorkOperators(workOperatorsRes.data.list)
            } else {
                setWorkOperators([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const [workDep, setWorkDep] = useState('');
    const workDepRef = useRef();
    const [workType, setWorkType] = useState('');
    const workTypeRef = useRef();
    const [workDevice, setWorkDevice] = useState('');
    const workDeviceRef = useRef();
    const [workOperator, setWorkOperator] = useState('');
    const workOperatorRef = useRef();
    const [workFromDate, setWorkFromDate] = useState(null);
    const workFromDateRef = useRef();
    const [workToDate, setWorkToDate] = useState(null);
    const workToDateRef = useRef();
    const [workPriority, setWorkPriority] = useState('');
    const workPriorityRef = useRef();
    const [workDesc, setWorkDesc] = useState('');
    const [workItems, setWorkItems] = useState([]);
    const handleWorkDepValidation = () => {
        if (workDepRef.current.props.value === "") {
            document.getElementById('workDep-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('workDep-required').classList.add('d-none');
            return true;
        }
    }
    const handleWorkTypeValidation = () => {
        if (workTypeRef.current.props.value === "") {
            document.getElementById('workType-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('workType-required').classList.add('d-none');
            return true;
        }
    }
    const handleWorkFromDateValidation = () => {
        if (workFromDateRef.current.props.value === null) {
            document.getElementById('workFromDate-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('workFromDate-required').classList.add('d-none');
            return true;
        }
    }
    const handleWorkToDateValidation = () => {
        if (workToDateRef.current.props.value === null) {
            document.getElementById('workToDate-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('workToDate-required').classList.add('d-none');
            return true;
        }
    }
    const handleWorkPriorityValidation = () => {
        if (workPriorityRef.current.value === "") {
            document.getElementById('workPriority-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('workPriority-required').classList.add('d-none');
            return true;
        }
    }
    const handleWorkValidation = () => {
        const workDepValidation = handleWorkDepValidation();
        const workTypeValidation = handleWorkTypeValidation();
        const workFromDateValidation = handleWorkFromDateValidation();
        const worktoDateValidation = handleWorkToDateValidation();
        const workPriorityValidation = handleWorkPriorityValidation();
        if (workDepValidation && workTypeValidation && workFromDateValidation && worktoDateValidation && workPriorityValidation) {
            return true;
        } else {
            return false;
        }
    }
    const handleAddWorkItem = () => {
        if (handleWorkValidation()) {
            const wItems = [...workItems]
            const wItem = {
                id: generateRanHex(24),
                workDep: workDep,
                workType: workType,
                workDevice: workDevice,
                workFromDate: workFromDate,
                workToDate: workToDate,
                workPriority: workPriority,
                workDesc: workDesc
            }
            wItems.push(wItem);
            setWorkItems(wItems);
            handleResetWorkItem();
        }
    }
    const handleResetWorkItem = () => {
        setWorkDep('');
        setWorkType('');
        setWorkDevice('');
        setWorkFromDate(null);
        setWorkToDate(null);
        setWorkPriority('');
        setWorkDesc('');
    }
    const [iTJProjectMaterialsName, setITJProjectMaterialsName] = useState('');
    const iTJProjectMaterialsNameRef = useRef();
    const [iTJProjectMaterialsUnit, setITJProjectMaterialsUnit] = useState('');
    const iTJProjectMaterialsUnitRef = useRef();
    const [iTJProjectMaterialsAmount, setITJProjectMaterialsAmount] = useState('');
    const iTJProjectMaterialsAmountRef = useRef();
    const [iTJProjectMaterialsDesc, setITJProjectMaterialsDesc] = useState('');
    const [iTJProjectMaterials, setITJProjectMaterials] = useState([]);
    const handleMaterialNameValidation = () => {
        if (iTJProjectMaterialsNameRef.current.value === "") {
            document.getElementById('iTJProjectMaterialsName-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectMaterialsName-required').classList.add('d-none');
            return true;
        }
    }
    const handleMaterialUnitValidation = () => {
        if (iTJProjectMaterialsUnitRef.current.props.value === "") {
            document.getElementById('iTJProjectMaterialsUnit-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectMaterialsUnit-required').classList.add('d-none');
            return true;
        }
    }
    const handleMaterialAmountValidation = () => {
        if (iTJProjectMaterialsAmountRef.current.value === "") {
            document.getElementById('iTJProjectMaterialsAmount-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('iTJProjectMaterialsAmount-required').classList.add('d-none');
            return true;
        }
    }
    const handleMaterialValidation = () => {
        const materialNameValidation = handleMaterialNameValidation();
        const materialUnitValidation = handleMaterialUnitValidation();
        const materialAmountValidation = handleMaterialAmountValidation();
        if (materialNameValidation && materialUnitValidation && materialAmountValidation) {
            return true;
        } else {
            return false;
        }
    }
    const handleAddITJProjectMaterials = () => {
        if (handleMaterialValidation()) {
            const materials = [...iTJProjectMaterials];
            const material = {
                name: iTJProjectMaterialsName,
                unit: iTJProjectMaterialsUnit,
                amount: iTJProjectMaterialsAmount,
                desc: iTJProjectMaterialsDesc,
                id: generateRanHex(24)
            }
            materials.push(material);
            setITJProjectMaterials(materials);
            handleResetMaterialItem();
        }
    }
    const handleResetMaterialItem = () => {
        setITJProjectMaterialsName('');
        setITJProjectMaterialsUnit('');
        setITJProjectMaterialsAmount('');
        setITJProjectMaterialsDesc('');
    }
    const [currentReqFiles, setCurrentReqFiles] = useState([]);
    const handleReqFiles = async (reqId, index, multi, justShow, fileName) => {
        try {
            const reqFilesRes = await getITJReqFileList(reqId, index, multi, justShow);
            if (reqFilesRes.data.code === 415) {
                setCurrentReqFiles(reqFilesRes.data.files);
            } else if (reqFilesRes.data.size !== undefined) {
                const url = window.URL.createObjectURL(reqFilesRes.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click()
                link.parentNode.removeChild(link);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleAcceptITJobReq = async () => {
        try {
            const { data } = await checkReqUpdateDate(currentReqInfo.requestId, currentReqInfo.lastActionId, 1);
            if (data.type === "accepted") {
                var actionCode = '';
                var toPersonsRes = '';
                if (currentReqInfo.lastActionCode === 0 && user.Roles.some(role => role === '35')) {
                    // تاییدیه های مدیریت
                    actionCode = 9;
                    toPersonsRes = await getToPersonByRole('14', user.Location, user.CompanyCode, 1, null, '0');
                } else if (currentReqInfo.lastActionCode === 0 && user.Roles.some(role => role === '14')) {
                    // مدیر کارخانه
                    actionCode = 37;
                    toPersonsRes = await getToPersonByRole('4', user.Location, user.CompanyCode, 1, null, '0');
                } else if (currentReqInfo.lastActionCode === 37) {
                    // مدیر برنامه ریزی
                    actionCode = 38;
                    toPersonsRes = await getToPersonByRole('5', user.Location, user.CompanyCode, 1, null, '0');
                } else if (currentReqInfo.lastActionCode === 38) {
                    // مدیر تولید
                    actionCode = 39;
                    toPersonsRes = await getToPersonByRole('6', user.Location, user.CompanyCode, 1, null, '0');
                } else if (currentReqInfo.lastActionCode === 39) {
                    // طراح نقشه
                    actionCode = 40;
                    toPersonsRes = await getToPersonByRole('5', user.Location, user.CompanyCode, 1, null, '0');
                    if (reqFiles.length !== 0) {
                        var files = [];
                        const data = new FormData();
                        for (var x = 0; x < reqFiles.length; x++) {
                            data.append('reqFiles', reqFiles[x])
                        }
                        files = data;
                        const fileUploadRes = await addITJReqFile(currentReqInfo.serial, currentReqInfo.requestId, files)
                        if (fileUploadRes.data.code === 415) {
                            successMessage('فایل با موفقیت ثبت شد!')
                        } else {
                            errorMessage('خطا در ثبت فایل!');
                        }
                    } else {
                        errorMessage('فایلی آپلود نشده است!')
                    }
                } else if (currentReqInfo.lastActionCode === 40) {
                    // مدیر تولید بعد از آپلود نقشه
                    actionCode = 41;
                    toPersonsRes = await getToPersonByRole('4', user.Location, user.CompanyCode, 1, null, '0');
                } else if (currentReqInfo.lastActionCode === 41) {
                    // مدیر برنامه ریزی بعد از آپلود نقشه
                    if (workItems.length !== 0) {
                        if (iTJProjectMaterials.length !== 0) {
                            actionCode = 42;
                            const anbartoPersonsRes = await getToPersonByRole('3, 35', user.Location, user.CompanyCode, 1, null, '0');
                            toPersonsRes = await getToPersonByRole('58, 59, 60, 61, 62, 63, 64', user.Location, user.CompanyCode, 1, null, '0');
                            const processList = workItems.map(item => {
                                return {
                                    deptId: item.workDep.value,
                                    machine: item.workDevice.value,
                                    startDate: item.workFromDate,
                                    endDate: item.workToDate,
                                    operationId: item.workType.value,
                                    priority: item.workPriority,
                                    desacription: item.workDesc
                                }
                            })
                            const materialList = iTJProjectMaterials.map(item => {
                                return {
                                    name: item.name,
                                    amount: item.amount,
                                    unit: item.unit.value,
                                    comment: item.desc,
                                    place: { main: 'ایران تول - برنامه ریزی', subPlace: currentReqInfo.reqInfo.serial_number }
                                }
                            })
                            const workAndMaterialsRes = await patchWorkAndMaterials(currentReqInfo.reqInfo._id, processList, materialList, anbartoPersonsRes);
                            if (workAndMaterialsRes.data.code === 415) {
                                successMessage('ثبت آیتم ها با موفقیت انجام شد!');
                            } else {
                                errorMessage('ثبت آیتم ها انجام نشد!')
                            }
                        } else {
                            errorMessage('مواد اولیه ثبت نشده اند!');
                        }
                    } else {
                        errorMessage('برنامه های عملیاتی ثبت نشده اند!');
                    }
                }
                if (actionCode !== '' && toPersonsRes.data.code === 415) {
                    const toPersons = [];
                    toPersonsRes.data.list.map(person => {
                        toPersons.push(person.value)
                    })
                    const actionValues = {
                        actionCode: actionCode,
                        actionId: currentReqInfo.requestId,
                        userId: localStorage.getItem('id'),
                        comment: acceptReqComment !== '' ? acceptReqComment : null,
                        toPersons: String(toPersons),
                        typeId: 1
                    }
                    const ActionRes = await postAction(actionValues);
                    if (ActionRes.data.code === 415) {
                        successMessage('درخواست با موفقیت تایید شد!');
                        dispatch(RsetAcceptReqComment(''));
                        dispatch(RsetAcceptReqModal(false));
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            serial: '',
                            memberId: '',
                            company: '',
                            requestType: '',
                            toolType: '',
                            status: '',
                            fromDate: 'null',
                            toDate: 'null',
                            type: 1
                        }
                        handleGetRequestList(filterParams);
                    }
                } else {
                    errorMessage('شخص دریافت کننده ای یافت نشد!');
                }
            } else {
                errorMessage('وضعیت درخواست تغییر کرده است!');
                dispatch(RsetAcceptReqModal(false));
                dispatch(RsetAcceptReqComment(''));
                const filterParams = {
                    applicantId: localStorage.getItem('id'),
                    serial: '',
                    memberId: '',
                    company: '',
                    requestType: '',
                    toolType: '',
                    status: '',
                    fromDate: 'null',
                    toDate: 'null',
                    type: 1
                }
                handleGetRequestList(filterParams);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleCancelITJobReq = async () => {
        try {
            const { data } = await checkReqUpdateDate(currentReqInfo.requestId, currentReqInfo.lastActionId, 1);
            if (data.type === "accepted") {
                var cancelActionValues = {};
                // if (user.Roles.some(role=> role === '14')) {
                cancelActionValues = {
                    actionCode: 2,
                    actionId: currentReqId,
                    userId: localStorage.getItem('id'),
                    typeId: 1,
                    comment: cancelReqComment !== '' ? cancelReqComment : null
                }
                // } else {
                //     cancelActionValues = {
                //         actionCode: currentReqInfo.lastActionCode,
                //         actionId: currentReqId,
                //         userId: localStorage.getItem('id'),
                //         toPersons: currentReqInfo.process[currentReqInfo.process.length - 2].toPersons,
                //         typeId: 1,
                //         comment: cancelReqComment
                //     }
                // }
                const actionRes = await postAction(cancelActionValues);
                if (actionRes.data.code === 415) {
                    dispatch(RsetCancelReqModal(false));
                    dispatch(RsetCancelReqComment(''));
                    successMessage('درخواست با موفقیت رد شد!');
                    const filterParams = {
                        applicantId: localStorage.getItem('id'),
                        serial: '',
                        memberId: '',
                        company: '',
                        requestType: '',
                        toolType: '',
                        status: '',
                        fromDate: 'null',
                        toDate: 'null',
                        type: 1
                    }
                    handleGetRequestList(filterParams);
                }
            } else {
                errorMessage('وضعیت درخواست تغییر کرده است!');
                dispatch(RsetCancelReqModal(false));
                dispatch(RsetCancelReqComment(''));
                const filterParams = {
                    applicantId: localStorage.getItem('id'),
                    serial: '',
                    memberId: '',
                    company: '',
                    requestType: '',
                    toolType: '',
                    status: '',
                    fromDate: 'null',
                    toDate: 'null',
                    type: 1
                }
                handleGetRequestList(filterParams);
            }
        } catch (ex) {
            console.log(ex);
        }
    }


    const deleteItemFromWorks = (itemId) => {
        const items = [...workItems];
        const filteredItems = items.filter((item) => item.id !== itemId)
        setWorkItems(filteredItems);
        setItemDeletePerModal(false);
    }
    const deleteItemFromMaterials = (itemId) => {
        const items = [...iTJProjectMaterials];
        const filteredItems = items.filter((item) => item.id !== itemId)
        setITJProjectMaterials(filteredItems);
        setItemDeletePerModal(false);
    }

    return (
        <iranTolJobCntxt.Provider
            value={{
                handleITJProjectTools,
                handleITJProjectTypes,
                iTJProjectName,
                setITJProjectName,
                iTJProjectNameRef,
                iTJProjectType,
                setITJProjectType,
                iTJProjectTypeRef,
                iTJProjectTypeSelect,
                iTJProjectTypeWithAllSelect,
                iTJProjectTool,
                setITJProjectTool,
                iTJProjectToolRef,
                iTJProjectToolSelect,
                iTJProjectToolWithAllSelect,
                iTJProjectAmount,
                setITJProjectAmount,
                iTJProjectAmountRef,
                iTJProjectDeadline,
                setITJProjectDeadline,
                iTJProjectDesc,
                setITJProjectDesc,
                iTJProjectFile,
                setITJProjectFile,
                iTJProjectLink,
                setITJProjectLink,
                iTJProjectLinks,
                setITJProjectLinks,
                handleConfirmITJReq,
                needConfirmation,
                setNeedConfirmation,
                needConfirmationUsers,
                setNeedConfirmationUsers,
                handleNeedConfirmationUsers,
                needConfirmationSelect,
                handleITJReqActionToPersons,
                setActionReqId,
                actionToPersonsModal,
                setActionToPersonsModal,
                handleResetITJReq,
                handleDownloadReqPlans,
                handleReqFiles,
                handleAcceptITJobReq,
                handleCancelITJobReq,

                workDep,
                setWorkDep,
                workDepRef,
                workType,
                setWorkType,
                workTypeRef,
                workDevice,
                setWorkDevice,
                workOperator,
                setWorkOperator,
                workFromDate,
                setWorkFromDate,
                workFromDateRef,
                workToDate,
                setWorkToDate,
                workToDateRef,
                workPriority,
                setWorkPriority,
                workPriorityRef,
                workDesc,
                setWorkDesc,
                handleAddWorkItem,
                workItems,
                handleWorkDeps,
                workDeps,
                handleWorkTypes,
                workTypes,
                handleWorkDevices,
                workDevices,
                handleWorkOperators,
                workOperators,

                iTJProjectMaterialsName,
                setITJProjectMaterialsName,
                iTJProjectMaterialsNameRef,
                iTJProjectMaterialsUnit,
                setITJProjectMaterialsUnit,
                iTJProjectMaterialsUnitRef,
                iTJProjectMaterialsAmount,
                setITJProjectMaterialsAmount,
                iTJProjectMaterialsAmountRef,
                iTJProjectMaterialsDesc,
                setITJProjectMaterialsDesc,
                handleAddITJProjectMaterials,
                iTJProjectMaterials,
                setITJProjectMaterials,
                handleResetWorkItem,
                handleResetMaterialItem,
                setWorkItems,
                deleteItemFromWorks,
                deleteItemFromMaterials,

                currentReqFiles
            }}
        >
            {actionToPersonsModal ? <ActionToPersonsModal /> : null}

            {acceptReqModal ? <AcceptRequest /> : null}

            {cancelReqModal ? <CancelRequest /> : null}

            {viewReqModal ? <ViewRequest /> : null}

            {children}
        </iranTolJobCntxt.Provider>
    )
}

export default IranTolJobContext;