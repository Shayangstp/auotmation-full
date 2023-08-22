import React, { useState, useRef, useEffect, useContext } from "react";
import xssFilters from "xss-filters";
import { reqContext } from "./reqContext";
import { addFileCntxt } from "../AddFileContext/addFileCntxt";
import { useDispatch, useSelector } from 'react-redux';
import { handleAcceptRequest, handleCancelRequest, handleUpdateRequest } from "../../../actions/jobReqs/requests";
import AcceptRequest from '../../Modals/JobReqsModals/AcceptRequestModal';
import CancelRequest from '../../Modals/JobReqsModals/CancelRequestModal';
import EditRequest from '../../Modals/JobReqsModals/EditRequestModal';
import ViewRequest from '../../Modals/JobReqsModals/ViewRequestModal';
import ChangedReqValues from "../../Modals/JobReqsModals/ChangedReqValuesModal";
import ReqHistory from "../../Modals/JobReqsModals/ReqHistoryModal";
import FirstMaterials from "../../Modals/JobReqsModals/FirstMaterialsModal";
import { getCurrentReqInfo, checkReqUpdateDate } from '../../../Services/rootServices';
import {
    getAllUsersWithOffice, getCompanyActs, getToPersonId, getAllUsers, getDepartmentUSers, getExecuterGrp, getWarehouseCodes,
    postRequest, postReqItemFiles, addNewDepartment, reqVisitedAction,
    postProjectControlValues, postReqMaterialsValues, updateReqItemFile, getReqHistory,
    getExecuterPrsns, sendReqToExecuters, getRequest, getNewRequests
} from "../../../Services/jobReqService";
import {
    getReqId, postAction, postReqItems, getReqItemId,
    setUserSupervisor, postNumberOfDeliveries, upSupervisors
} from "../../../Services/jobReqService";
import { successMessage, warningMessage, errorMessage } from "../../../utils/message";

import { rootContext } from "../rootContext";
import { RsetLoading, selectUser } from '../../Slices/mainSlices';

import {
    selectAcceptReqModal, RsetAcceptReqModal, selectCancelReqModal, RsetCancelReqModal,
    selectEditReqModal, RsetEditReqModal, selectViewReqModal, RsetViewReqModal, selectReqHistoryModal,
    selectAcceptReqComment, RsetAcceptReqComment, selectCancelReqComment, RsetCancelReqComment,
    selectViewReqComment, RsetViewReqComment
} from '../../Slices/modalsSlice';

import { selectUnit, RsetUnit } from "../../Slices/mainSlices";
import { selectCeramicReqItems, selectCeramicReqName, RsetNewCeramicReq, RsetCeramicReqName, RsetCeramicReqItems } from "../../Slices/ceramicSlices";

const RequestContext = ({ requests, children, clearReq, setClearReq,
    currentRequest, setCurrentRequest, currentRequestItems, setCurrentRequestItems }) => {

    const acceptReqModal = useSelector(selectAcceptReqModal);
    const cancelReqModal = useSelector(selectCancelReqModal);
    const editReqModal = useSelector(selectEditReqModal);
    const viewReqModal = useSelector(selectViewReqModal);
    const reqHistoryModal = useSelector(selectReqHistoryModal);
    const acceptReqComment = useSelector(selectAcceptReqComment);
    const cancelReqComment = useSelector(selectCancelReqComment);
    const viewReqComment = useSelector(selectViewReqComment);
    const unit = useSelector(selectUnit);
    const ceramicReqItems = useSelector(selectCeramicReqItems);

    const mainContext = useContext(rootContext);
    const {
        setLoading,
        handleGetRequestList,
        currentReqInfo
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

    const user = useSelector(selectUser);


    // handle Department Users
    const [reqWarehouseUser, setReqWarehouseUser] = useState([]);
    const handleDepartmentUsers = async (department, company) => {
        try {
            const { data } = await getDepartmentUSers(department, company);

            if (company === 1) {
                setReqWarehouseUser(data);
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    const warehouseUsersSelect = reqWarehouseUser.map(data => {
        return { value: data.user_id, label: (data.first_name + " " + data.last_name) };
    })

    const handleInputsEnter = () => {
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 13 && event.target.nodeName === 'INPUT' && event.target.form.className === 'enter-in-form') {
                var form = event.target.form;
                var index = Array.prototype.indexOf.call(form, event.target);
                form.elements[index + 1].focus();
                event.preventDefault();
            }
        })
    }

    const [reqSendCopyTo, setReqSendCopyTo] = useState([]);
    const [reqDescription, setReqDescription] = useState('');
    const [reqActs, setReqActs] = useState([]);
    const [companyActsArray, setCompanyActsArray] = useState([]);
    const [reqWithFirstMaterial, setReqWithFirstMaterial] = useState(false);
    const [reqAttachment, setreqAttachment] = useState('');
    const [reqAddDepartmentModal, setReqAddDepartmentModal] = useState(false);
    const [reqAddNewDepartment, setReqAddNewDepartment] = useState('');
    const [reqAddNewReceiverPerson, setReqAddNewReceiverPerson] = useState('');
    const [reqPattern, setReqPattern] = useState('');
    // requestItems
    const [reqItemSubject, setReqItemSubject] = useState('');
    const reqItemSubjectRef = useRef();
    const [reqItemAmount, setReqItemAmount] = useState('');
    const reqItemAmountRef = useRef();
    const [reqItemTechSpecifications, setReqItemTechSpecifications] = useState('');
    const reqItemTechSpecificationsRef = useRef();
    const [reqItemDeadline, setReqItemDeadline] = useState(null);
    const reqItemDeadlineRef = useRef();
    const [reqItemFile, setReqItemFile] = useState('');
    const [reqItemFileType, setReqItemFileType] = useState('');
    const [reqItemFiles, setReqItemFiles] = useState([]);
    const reqItemFileRef = useRef();
    const [description, setdescription] = useState('');
    const descriptionRef = useRef();
    const reqItemAddRef = useRef();

    // get company acts
    const [companyActs, setCompanyActs] = useState([]);
    const handleCompanyActs = async () => {
        try {
            const { data } = await getCompanyActs(21);
            if (data.length !== 0) {
                setCompanyActs(data)
            }
            if (companyActsArray.length === 0) {
                data.map((act) => {
                    companyActsArray.push({ value: false, code: act.code })
                })
                var actInput = document.getElementsByClassName("actInput");
                for (var i = 0; i < actInput.length; i++) {
                    actInput[i].checked = false
                    actInput[i].value = false
                }
            } else {

            }
        } catch (ex) {
            console.log(ex)
        }
    }

    const dynamicValidation = (field, d) => {
        const item = document.getElementById(field);
        item.classList.add('validation-error');
    }

    const [reqItems, setReqItems] = useState([]);
    const addFileContext = useContext(addFileCntxt);
    const {
        setReqFiles,
    } = addFileContext;
    const ceramicReqName = useSelector(selectCeramicReqName);
    const handleSubmitNewRequest = async () => {
        dispatch(RsetLoading(true));
        try {
            if (ceramicReqItems.length !== 0) {
                const ReqValues = {
                    ByInitialMaterial: reqWithFirstMaterial,
                    ReferenceId: ceramicReqName !== '' && ceramicReqName.value !== undefined ? ceramicReqName.value : undefined,
                    Description: reqDescription !== '' ? reqDescription : null,
                    ProjectName: ceramicReqName !== '' && ceramicReqName.value === undefined ? ceramicReqName : undefined,
                }
                const ceramicNewReqRes = await postRequest(ReqValues);
                if (ceramicNewReqRes.data.code === 415) {
                    //send req item values
                    var items = 0;
                    ceramicReqItems.map(async (item, index) => {
                        var files = [];
                        const data = new FormData();
                        for (var x = 0; x < item.reqFiles.length; x++) {
                            data.append('reqFiles', item.reqFiles[x])
                        }
                        files = data;
                        const ItemsValue = {
                            Subject: item.reqItemSubject,
                            Amount: item.reqItemAmount,
                            Unit: item.unit.value,
                            TechInformation: item.reqItemTechSpecifications,
                            Deadline: item.reqItemDeadline,
                            Description: item.description !== '' ? item.description : null,
                            RequestId: ceramicNewReqRes.data.id,
                            Pattern: item.reqPattern.value,
                            File: item.reqFiles.length !== 0 ? true : false,
                            Serial: ceramicNewReqRes.data.serial,
                            Row: index
                        }
                        const reqItemsRes = await postReqItems(ItemsValue, files);
                        if (reqItemsRes.data.code === 415) {
                            items = items + 1;
                            if (items === ceramicReqItems.length) {
                                //send req action
                                const reqSendCopyToArr = reqSendCopyTo.map((user) => {
                                    return user.value
                                })
                                const ActionValues = {
                                    actionId: ceramicNewReqRes.data.id,
                                    actionCode: 0,
                                    userId: localStorage.getItem("id"),
                                    toPersons: "6360ecd53ba4d4828c9ccb06",
                                    typeId: 13,
                                    viewers: reqSendCopyToArr.toString(),
                                }
                                const postActionRes = await postAction(ActionValues);
                                if (postActionRes.data.code === 415) {
                                    dispatch(RsetLoading(false));
                                    handleRequestReset();
                                    handleReqNewItemReset();
                                    successMessage('درخواست شما با موفقیت ثبت شد!')
                                }
                            }
                        }
                    })
                }
                //     const toPersonId = await getToPersonId(reqToCompanyName.value, 1)
                //     if (toPersonId.data === null) {
                //         errorMessage('شخص دریافت کننده برای این درخواست یافت نشد!')
            } else {
                errorMessage('هیچ آیتمی برای ثبت درخواست وارد نشده!');
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
    const handleRequestReset = () => {
        dispatch(RsetNewCeramicReq(true))
        dispatch(RsetCeramicReqName(''));
        dispatch(RsetCeramicReqItems([]));
        setReqDescription('');
        setReqWithFirstMaterial(false);
        setClearReq(false);
        setReqSendCopyTo([]);
        handleReqNewItemReset();
    }
    const handleReqNewItemReset = () => {
        setReqItemSubject('');
        setReqItemAmount('');
        setReqItemTechSpecifications('');
        setReqItemDeadline(null);
        setReqPattern('');
        setdescription('');
        setReqFiles([]);
        dispatch(RsetUnit(''))
        document.getElementById('reqFile').value = '';
    }

    const [allCompaniesFilter, setAllCompaniesFilter] = useState('');
    const [allUsersFilter, setAllUsersFilter] = useState('');
    const [allDepartmentsFilter, setAllDepartmentsFilter] = useState('');
    const [allStatusesFilter, setAllStatusesFilter] = useState('');
    const [fromDateFilter, setFromDateFilter] = useState(null);
    const [toDateFilter, setToDateFilter] = useState(null);
    const [realFilter, setRealFilter] = useState(false);

    const [reqItemDeleteModal, setReqItemDeleteModal] = useState(false);
    const [reqItemId, setReqItemId] = useState('');

    const [projectNumber, setProjectNumber] = useState('');
    const [executerGrp, setExecuterGrp] = useState('');

    const [executerGrpPrsns, setExecuterGrpPrsns] = useState([]);
    const [exeDepANDPrsn, setExeDepANDPrsn] = useState([]);
    const [warehouseCodes, setWarehouseCodes] = useState([]);
    var test;
    const handleDefaultExPrsn = () => {
        for (var i = 0; i < executerGrpPrsns.length; i++) {
            if (executerGrpPrsns[i].supervisor === true) {
                test = { value: executerGrpPrsns[i]._id, label: executerGrpPrsns[i].first_name + ' ' + executerGrpPrsns[i].last_name };
            }
        }
        setExecuterGrpPrsn(test)
    }
    useEffect(() => {
        test = handleDefaultExPrsn();
    }, [executerGrpPrsns])
    const [executerGrpPrsn, setExecuterGrpPrsn] = useState(test);
    const addNewExecuterToList = () => {
        if (executerGrp === '') {
            errorMessage('انتخاب گروه اجرایی الزامی است!')
        } else if (executerGrpPrsn === '') {
            errorMessage('انتخاب پرسنل گروه اجرایی الزامی است!')
        } else if (executerGrp !== '' && executerGrpPrsn !== '') {
            const executers = [...exeDepANDPrsn];
            const executer = { dep: executerGrp, person: executerGrpPrsn };
            executers.push(executer);
            setExeDepANDPrsn(executers);
            setExecuterGrp('');
            setExecuterGrpPrsn('');
        }
    }
    const removeExecuterFromList = (index) => {
        const items = [...exeDepANDPrsn];
        const filteredItems = [];
        for (var i = 0; i < items.length; i++) {
            if (i === index) {

            } else {
                filteredItems.push(items[i])
            }
        }
        setExeDepANDPrsn(filteredItems);
    }


    const handleExecuterPrsns = async (selectedDepId) => {
        try {
            const { data } = await getExecuterPrsns(user.CompanyCode, selectedDepId);
            setExecuterGrpPrsns(data);
        } catch (ex) {
            console.log(ex);
        }
    }
    const executerGrpPrsnsSelect = executerGrpPrsns.map(data => {
        return { value: xssFilters.inHTMLData(data._id), label: xssFilters.inHTMLData(data.first_name) + ' ' + xssFilters.inHTMLData(data.last_name) };
    })

    const dispatch = useDispatch();
    const handleReqVisited = async (reqId, update) => {
        try {
            const visitedReqValues = {
                actionCode: 15,
                actionId: reqId,
                userId: localStorage.getItem('id'),
                typeId: 1
            }
            const { data } = await reqVisitedAction(visitedReqValues);
            if (data.code === 415) {
                //handleGetJobNSeenCounter();
                if (update === true) {
                    handleAllNewRequests();
                }
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    const [executerGrpData, setExecuterGrpData] = useState([]);
    const handleExecuterGrp = async () => {
        try {
            const { data } = await getExecuterGrp(currentRequest.reqInfo.reqToCompanyName.co_code);
            setExecuterGrpData(data)
        } catch (ex) {
            console.log(ex)
        }
    }
    const executerGrpSelect = executerGrpData.map(data => {
        return { value: xssFilters.inHTMLData(data.dep_code), label: xssFilters.inHTMLData(data.dep_name) };
    })
    // const [warehouseCodesData, setWarehouseCodesData] = useState([]);
    // const handleWarehouseCodes = async () => {
    //     try {
    //         const { data } = await getWarehouseCodes();
    //         setWarehouseCodesData(data)
    //     } catch (ex) {
    //         console.log(ex)
    //     }
    // }
    // const warehouseCodesSelect = warehouseCodesData.map(data => {
    //     return { value: data.good_id, label: data.good_name + ' (' + data.good_code + ')' };
    // })
    const [allJobReqs, setAllJobReqs] = useState([])
    const handleAllNewRequests = async () => {
        setLoading(true);
        try {
            const { data } = await getNewRequests();
            if (data) {
                setAllJobReqs(data);
                setLoading(false);
            }
        } catch (ex) {
            setLoading(false);
        }
    }
    const [firstMaterialsModal, setFirstMaterialsModal] = useState(false);
    const [firstMaterialSearch, setFirstMaterialSearch] = useState('');
    const [firstMaterialGrpSearch, setFirstMaterialGrpSearch] = useState('');
    const [firstMaterialCodeSearch, setFirstMaterialCodeSearch] = useState('');
    const handleReqAccept = async () => {
        if (currentReqInfo.lastActionCode === 0 || currentReqInfo.lastActionCode === 3) {
            const { data } = await checkReqUpdateDate(currentReqInfo.requestId, currentReqInfo.lastActionId, currentReqInfo.typeId);
            if (data.type === "accepted") {
                // const sendAction = async () => {
                // const toPersonId = await getToPersonId(currentRequest.reqInfo.reqToCompanyName.co_code, 2)
                const ActionValues = {
                    actionId: currentReqInfo.requestId,
                    actionCode: 4,
                    userId: localStorage.getItem("id"),
                    toPersons: '6360ecd63ba4d4828c9cd71f',
                    comment: acceptReqComment !== '' ? acceptReqComment : null,
                    typeId: currentReqInfo.typeId
                }
                const postActionRes = await postAction(ActionValues);
                if (postActionRes.data.code === 415) {
                    successMessage('درخواست با موفقیت تایید شد!');
                    dispatch(RsetAcceptReqModal(false));
                    dispatch(RsetAcceptReqComment(''));
                    setCurrentRequestItems([]);
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
                        type: 13
                    }
                    handleGetRequestList(filterParams);
                }
                // }
                // if (currentReqInfo.reqInfo.withRawMaterial === true) {
                // const toWarehouseId = await getToPersonId(currentRequest.reqInfo.reqToCompanyName.co_code, 3);
                // const WarehouseValues = {
                //     actionId: currentRequest.reqInfo._id,
                //     actionCode: 14,
                //     userId: localStorage.getItem("id"),
                //     toPersons: toWarehouseId.data._id,
                //     comment: acceptReqComment !== '' ? acceptReqComment : null
                // }
                // const postWarehouseActionRes = await postAction(WarehouseValues);
                //     sendAction();
                // } else {
                //     sendAction();
                // }
            } else {
                setUpdateReqValuesModal(true);
            }
        }
        // else if (currentRequest.lastActionCode === 4 && user.Roles.some(role=> role === '2')) {
        //     if (exeDepANDPrsn.length !== 0) {
        //         const executerGrps = [];
        //         for (var i = 0; i < exeDepANDPrsn.length; i++) {
        //             if (exeDepANDPrsn[i].person.value !== '') {
        //                 executerGrps.push(exeDepANDPrsn[i].person.value);
        //             } else {
        //                 errorMessage('شخص دریافت کننده ای برای گروه ' + exeDepANDPrsn[i].label + ' انتخاب نشده! لطفا گروه دیگری را انتخاب کنید')
        //             }
        //         }
        //         if (executerGrps.length !== 0) {
        //             if (projectNumber !== '') {
        //                 // const sendAction = () =>{

        //                 // }

        //                 executerGrps.map(async executerGrp => {
        //                     const ActionValues = {
        //                         actionId: currentRequest.reqInfo._id,
        //                         actionCode: 16,
        //                         userId: localStorage.getItem("id"),
        //                         toPersons: executerGrp,
        //                     }
        //                     const postActionRes = await postAction(ActionValues);
        //                 })

        //                 const toPersonId = await getToPersonId(currentRequest.reqInfo.reqToCompanyName.co_code, 15)
        //                 const ActionValues = {
        //                     actionId: currentRequest.reqInfo._id,
        //                     actionCode: 10,
        //                     userId: localStorage.getItem("id"),
        //                     toPersons: toPersonId.data._id,
        //                     comment: acceptReqComment !== '' ? acceptReqComment : null
        //                 }
        //                 const postActionRes = await postAction(ActionValues);


        //                 const ProjectControlValues = {
        //                     project_number: projectNumber,
        //                 }
        //                 const getProRes = await postProjectControlValues(currentRequest.reqInfo._id, ProjectControlValues);
        //                 setProjectNumber('');
        //                 setExecuterGrp('');
        //                 setExecuterGrpPrsn('');
        //                 setExecuterGrpPrsns([]);
        //                 exeDepANDPrsn([]);
        //                 goToDispatch();
        //             } else {
        //                 errorMessage('وارد کردن شماره پرونده اجباری است!')
        //             }
        //         } else {
        //             errorMessage('شخص دریافت کننده ای یافت نشد!')
        //         }
        //     } else {
        //         errorMessage('انتخاب گروه اجرایی اجباری است!')
        //     }
        // } else if (currentRequest.lastActionCode === 10 && user.Roles.some(role=> role === '15')) {
        //     if (warehouseCodes.length !== 0) {
        //         const sendLastAction = async () => {
        //             postMaterials();
        //             const toPersonId = await getToPersonId(currentRequest.reqInfo.reqToCompanyName.co_code, 17)
        //             const ActionValues = {
        //                 actionId: currentRequest.reqInfo._id,
        //                 actionCode: 5,
        //                 userId: localStorage.getItem("id"),
        //                 toPersons: toPersonId.data._id,
        //                 comment: acceptReqComment !== '' ? acceptReqComment : null
        //             }
        //             const postActionRes = await postAction(ActionValues);
        //             goToDispatch();
        //         }
        //         const postMaterials = async () => {
        //             const warehouseCode = [];
        //             for (var i = 0; i < warehouseCodes.length; i++) {
        //                 warehouseCode.push(warehouseCodes[i].value);
        //             }
        //             const MaterialsValues = {
        //                 materials: warehouseCode
        //             }

        //             const getMtrlRes = await postReqMaterialsValues(currentRequest.reqInfo._id, MaterialsValues);
        //         }
        //         if (currentRequest.items[0].reqItemFiles.length !== 0) {

        //             if (reqItemFiles.length !== 0) {
        //                 const UpdateFileValues = {
        //                     file: reqItemFiles.file,
        //                     file_type: reqItemFiles.type
        //                 }
        //                 const { data } = await updateReqItemFile(currentRequest.items[0]._id, UpdateFileValues)
        //                 const ActionValues = {
        //                     actionId: currentRequest.reqInfo._id,
        //                     actionCode: 12,
        //                     userId: localStorage.getItem("id"),
        //                 }
        //                 const postActionRes = await postAction(ActionValues);
        //                 sendLastAction()
        //             } else {
        //                 sendLastAction()
        //             }
        //         } else {
        //             if (reqItemFiles.length !== 0) {
        //                 const UpdateFileValues = {
        //                     item_id: currentRequest.items[0]._id,
        //                     file: reqItemFiles[0].file,
        //                     file_type: reqItemFiles[0].type
        //                 }
        //                 const { data } = await updateReqItemFile(currentRequest.items[0]._id, UpdateFileValues)
        //                 const ActionValues = {
        //                     actionId: currentRequest.reqInfo._id,
        //                     actionCode: 12,
        //                     userId: localStorage.getItem("id"),
        //                 }
        //                 const postActionRes = await postAction(ActionValues);
        //                 sendLastAction()
        //             } else {
        //                 errorMessage('فایل پروژه وارد نشده است!');
        //             }
        //         }
        //     } else {
        //         errorMessage('انتخاب مواد اولیه اجباری است!')
        //     }
        // } else if (currentRequest.lastActionCode === 5 && user.Roles.some(role=> role === '17')) {
        //     const { data } = await sendReqToExecuters(currentRequest.reqInfo._id);
        //     if (data) {
        //         goToDispatch();
        //     }
        // }
    }
    const handleReqCancel = async () => {
        try {
            const { data } = await checkReqUpdateDate(currentReqInfo.requestId, currentReqInfo.lastActionId, 1);
            if (data.type === "accepted") {
                const cancelActionValues = {
                    actionCode: 2,
                    actionId: currentReqInfo.requestId,
                    userId: localStorage.getItem('id'),
                    typeId: 13,
                    comment: cancelReqComment !== '' ? cancelReqComment : null
                }
                const actionRes = await postAction(cancelActionValues);
                if (actionRes.data.code === 415) {
                    dispatch(RsetCancelReqModal(false));
                    dispatch(RsetCancelReqComment(''));
                    setCurrentRequestItems([]);
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
                        type: 13
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
                    type: 13
                }
                handleGetRequestList(filterParams);
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handleReqComment = async () => {
        const reqCommentValues = {
            actionCode: 8,
            actionId: currentRequest.reqInfo._id,
            userId: localStorage.getItem('id'),
            comment: viewReqComment !== '' ? viewReqComment : null
        }
        try {
            const { data } = await postAction(reqCommentValues);
            if (data) {
                successMessage('نظر شما با موفقیت ارسال شد!');
                dispatch(RsetViewReqComment(''));
                dispatch(RsetViewReqModal(false));
            }
        } catch (ex) {

        }
    }
    const handleReqEdit = () => {
        const items = [...currentRequestItems];
        const result = items.reduce((acc, item) => {
            const itemInAcc = acc.find(itemAcc => itemAcc.reqItemSubject === item.reqItemSubject);
            if (itemInAcc !== undefined) {
                warningMessage('آیتم ' + itemInAcc.reqItemSubject + ' تکراری می باشد.');
            } else {
                acc.push({ ...item })
            }
            return acc;
        }, []);
        if (currentRequestItems.length === result.length) {
            handleReqNewItemReset();
            dispatch(handleUpdateRequest(currentRequest, RsetEditReqModal, allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter, fromDateFilter, toDateFilter, deletedReqItems, currentRequestItems, currentRequest.reqInfo._id,
                setCurrentRequestItems, setUpdateReqValuesModal))
        }
    }
    const [numberOfDeliveries, setNumberOfDeliveries] = useState('');

    const [updateReqValuesModal, setUpdateReqValuesModal] = useState(false);
    const handleUpdateReqValues = async () => {
        const newData = await getCurrentReqInfo(currentRequest.reqInfo._id, currentRequest.type);
        setCurrentRequestItems(newData.data[0].items);
        setCurrentRequest(newData.data[0])
        setUpdateReqValuesModal(false);
    }

    const [editReqItem, setEditReqItem] = useState(false);

    const handleGetCurrentRequest = async request => {
        setCurrentRequest(request);
        if (request.items) {
            setCurrentRequestItems(request.items)
        } else {
            try {
                const newData = await getCurrentReqInfo(request.reqInfo._id, request.type);
                setCurrentRequestItems(newData.data.items);
                setCurrentRequest(newData.data)
            } catch (ex) {
                console.log(ex)
            }
        }
    }

    const [deletedReqItems, setDeletedReqItems] = useState([]);
    const handleReqItemDelete = (reqItemId, newReq) => {
        if (newReq === true) {
            const items = [...reqItems];
            const filteredItems = items.filter(tr => tr.id !== reqItemId);
            setReqItems(filteredItems);
            setReqItemDeleteModal(false);
        } else {
            const items = [...currentRequestItems];
            if (items.length !== 1) {
                if (reqItemId.length === undefined) {
                    const filteredItems = items.filter(tr => tr.id !== reqItemId);
                    setCurrentRequestItems(filteredItems);
                    setReqItemDeleteModal(false);
                } else {
                    const filteredItems = items.filter(tr => tr._id !== reqItemId);
                    setCurrentRequestItems(filteredItems);
                    setReqItemDeleteModal(false);
                    deletedReqItems.push(reqItemId);
                }
            } else {
                errorMessage('وجود حداقل یک آیتم ضروری است!');
                setReqItemDeleteModal(false);
            }
        }
    }

    const handleEditReqItemSubject = (event, reqItemId) => {
        if (reqItemId.length === undefined) {
            const items = [...reqItems];
            const itemIndex = items.findIndex(tr => tr.id === reqItemId);
            const item = items[itemIndex];
            item.reqItemSubject = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setReqItems(allItems)
        } else {
            const items = [...currentRequestItems];
            const itemIndex = items.findIndex(tr => tr._id === reqItemId);
            const item = items[itemIndex];
            item.reqItemSubject = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setCurrentRequestItems(allItems)
        }
    }
    const handleEditReqItemAmount = (event, reqItemId) => {
        if (reqItemId.length === undefined) {
            const items = [...reqItems];
            const itemIndex = items.findIndex(tr => tr.id === reqItemId);
            const item = items[itemIndex];
            item.reqItemAmount = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setReqItems(allItems)
        } else {
            const items = [...currentRequestItems];
            const itemIndex = items.findIndex(tr => tr._id === reqItemId);
            const item = items[itemIndex];
            item.reqItemAmount = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setCurrentRequestItems(allItems)
        }
    }
    const handleEditReqItemTechSpecifications = (event, reqItemId) => {
        if (reqItemId.length === undefined) {
            const items = [...reqItems];
            const itemIndex = items.findIndex(tr => tr.id === reqItemId);
            const item = items[itemIndex];
            item.reqItemTechSpecifications = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setReqItems(allItems)
        } else {
            const items = [...currentRequestItems];
            const itemIndex = items.findIndex(tr => tr._id === reqItemId);
            const item = items[itemIndex];
            item.reqItemTechSpecifications = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setCurrentRequestItems(allItems)
        }
    }
    const handleEditReqItemDeadline = (event, reqItemId) => {
        if (reqItemId.length === undefined) {
            const items = [...reqItems];
            const itemIndex = items.findIndex(tr => tr.id === reqItemId);
            const item = items[itemIndex];
            item.reqItemDeadline = event;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setReqItems(allItems)
        } else {
            const items = [...currentRequestItems];
            const itemIndex = items.findIndex(tr => tr._id === reqItemId);
            const item = items[itemIndex];
            item.reqItemDeadline = event;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setCurrentRequestItems(allItems)
        }
    }
    const handleEditdescription = (event, reqItemId) => {
        if (reqItemId.length === undefined) {
            const items = [...reqItems];
            const itemIndex = items.findIndex(tr => tr.id === reqItemId);
            const item = items[itemIndex];
            item.description = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setReqItems(allItems)
        } else {
            const items = [...currentRequestItems];
            const itemIndex = items.findIndex(tr => tr._id === reqItemId);
            const item = items[itemIndex];
            item.description = event.target.value;
            const allItems = [...items];
            allItems[itemIndex] = item;
            setCurrentRequestItems(allItems)
        }
    }
    const handleUploadReqItemFile = (e) => {
        e.persist();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        const fileByteArray = [];
        reader.onload = function (evt) {
            setReqItemFileType(file.type);
            if (evt.target.readyState === FileReader.DONE) {
                const arrBuffer = evt.target.result,
                    array = new Uint8Array(arrBuffer);
                for (const a of array) {
                    fileByteArray.push(a);
                }
                setReqItemFile(fileByteArray);
            }
        };
        reader.readAsDataURL(file);
    }
    const handleAddReqItemFile = () => {
        if (reqItemFile !== '') {
            var files = [...reqItemFiles];
            const file = { file: reqItemFile, type: reqItemFileType }
            files.push(file);
            setReqItemFiles(files);
            setReqItemFile('');
            setReqItemFileType('');
            document.getElementById('reqItemFile').value = '';
        } else {
            errorMessage('فایلی انتخاب نشده است!')
        }
    }


    const [reqSerialNumber, setReqSerialNumber] = useState('');
    const [reqComments, setReqComments] = useState([]);
    const handleReqHistory = async (serial) => {
        setLoading(true);
        try {
            if (serial !== '') {
                if (serial.length === 6) {
                    const { data } = await getReqHistory(serial);
                    if (data.length === 0) {
                        errorMessage('نظری برای این سریال یافت نشد!')
                        setReqSerialNumber('');
                        setLoading(false);
                    } else if (data.status !== 400) {
                        setReqComments(data[0].comments)
                        setReqSerialNumber('');
                        setLoading(false);
                    } else {
                        errorMessage('سریال موردنظر یافت نشد!')
                        setReqSerialNumber('');
                        setLoading(false);
                    }
                } else {
                    errorMessage('سریال شش رقمی می باشد!')
                    setLoading(false);
                }
            } else {
                errorMessage('سریال وارد نشده است!')
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex)
            setLoading(false);
        }
    }

    useEffect(() => {
        if (clearReq === true) {
            handleRequestReset();
        }
    }, [clearReq])


    return (
        <reqContext.Provider
            value={{
                handleCompanyActs,
                companyActs,
                reqActs,
                setReqActs,
                companyActsArray,
                reqDescription,
                setReqDescription,
                reqSendCopyTo,
                setReqSendCopyTo,
                reqWithFirstMaterial,
                setReqWithFirstMaterial,
                reqAttachment,
                setreqAttachment,
                reqPattern,
                setReqPattern,
                reqItemSubject,
                setReqItemSubject,
                reqItemSubjectRef,
                reqItemAmount,
                setReqItemAmount,
                reqItemAmountRef,
                reqItemTechSpecifications,
                setReqItemTechSpecifications,
                reqItemTechSpecificationsRef,
                reqItemDeadline,
                setReqItemDeadline,
                reqItemDeadlineRef,
                handleUploadReqItemFile,
                handleAddReqItemFile,
                reqItemFileRef,
                reqItemFiles,
                description,
                setdescription,
                descriptionRef,
                reqItemAddRef,
                handleEditReqItemSubject,
                handleEditReqItemAmount,
                handleEditReqItemTechSpecifications,
                handleEditReqItemDeadline,
                handleEditdescription,
                reqAddDepartmentModal,
                setReqAddDepartmentModal,
                reqAddNewDepartment,
                setReqAddNewDepartment,
                reqAddNewReceiverPerson,
                setReqAddNewReceiverPerson,
                allCompaniesFilter,
                setAllCompaniesFilter,
                allUsersFilter,
                setAllUsersFilter,
                allDepartmentsFilter,
                setAllDepartmentsFilter,
                allStatusesFilter,
                setAllStatusesFilter,
                fromDateFilter,
                setFromDateFilter,
                toDateFilter,
                setToDateFilter,
                allJobReqs,
                handleAllNewRequests,
                handleDepartmentUsers,
                // reqWarehouseUser,
                // setReqWarehouseUser,
                warehouseUsersSelect,
                handleReqVisited,
                projectNumber,
                setProjectNumber,
                executerGrp,
                setExecuterGrp,
                executerGrpPrsn,
                setExecuterGrpPrsn,
                handleExecuterPrsns,
                executerGrpPrsns,
                setExecuterGrpPrsns,
                handleExecuterGrp,
                executerGrpSelect,
                exeDepANDPrsn,
                setExeDepANDPrsn,
                addNewExecuterToList,
                executerGrpPrsnsSelect,
                removeExecuterFromList,
                warehouseCodes,
                setWarehouseCodes,
                // handleWarehouseCodes,
                // warehouseCodesSelect,
                reqSerialNumber,
                setReqSerialNumber,
                handleReqHistory,
                reqComments,
                handleInputsEnter,
                firstMaterialsModal,
                setFirstMaterialsModal,
                firstMaterialSearch,
                setFirstMaterialSearch,
                firstMaterialGrpSearch,
                setFirstMaterialGrpSearch,
                firstMaterialCodeSearch,
                setFirstMaterialCodeSearch,

                handleSubmitNewRequest,
                handleReqNewItemReset,

                reqItems,

                handleRequestReset,
                realFilter,
                setRealFilter,
                handleGetCurrentRequest,
                reqItemDeleteModal,
                setReqItemDeleteModal,
                handleReqItemDelete,
                reqItemId,
                setReqItemId,
                editReqItem,
                setEditReqItem,



                numberOfDeliveries,
                setNumberOfDeliveries,


            }}
        >
            {acceptReqModal ? <AcceptRequest acceptReqComment={acceptReqComment} setAcceptReqComment={RsetAcceptReqComment}
                handleReqAccept={handleReqAccept} /> : null}

            {cancelReqModal ? <CancelRequest cancelReqComment={cancelReqComment} setCancelReqComment={RsetCancelReqComment}
                handleReqCancel={handleReqCancel} /> : null}

            {editReqModal ? <EditRequest setEditReqItem={setEditReqItem} handleReqEdit={handleReqEdit}
                handleReqNewItemReset={handleReqNewItemReset} /> : null}

            {updateReqValuesModal ? <ChangedReqValues updateReqValuesModal={updateReqValuesModal} setUpdateReqValuesModal={setUpdateReqValuesModal} handleUpdateReqValues={handleUpdateReqValues} /> : null}

            {viewReqModal ? <ViewRequest comment={viewReqComment} setComment={RsetViewReqComment} handleReqComment={handleReqComment} /> : null}

            {reqHistoryModal ? <ReqHistory /> : null}

            {firstMaterialsModal ? <FirstMaterials /> : null}

            {children}
        </reqContext.Provider>
    )
}

export default RequestContext;