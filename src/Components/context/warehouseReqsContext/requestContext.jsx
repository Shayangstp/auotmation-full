import React, { useState, useRef, useEffect, useContext } from "react";
import { reqContext } from "./reqContext";
import AcceptRequest from '../../Modals/WarehouseReqsModals/AcceptRequestModal';
import NextAcceptRequest from "../../Modals/WarehouseReqsModals/NextAcceptRequestModal";
import CancelRequest from '../../Modals/WarehouseReqsModals/CancelRequestModal';
import EditRequest from '../../Modals/WarehouseReqsModals/EditRequestModal';
import ViewRequest from '../../Modals/WarehouseReqsModals/ViewRequestModal';
import ChangedReqValues from "../../Modals/WarehouseReqsModals/ChangedReqValuesModal";
import ReqHistoryModal from "../../Modals/ReqHistoryModal";
import {
    getReqItems, getReqItemLinks, getReqItemImages, getReqItemComments, postAction, getReqItemId, postReqItemLink,
    deleteReqItemLink, postReqItemImage, deleteReqItemImage, setUserSupervisor, upSupervisors, getReqHistory, getNewRequests,
    postPurchaseReq, postPurchaseReqItems, getPurchaseList, getWarehouses, getItemReceivedDetails
} from "../../../Services/warehouseReqService";
import { getToPersonByRole } from '../../../Services/rootServices';
import { successMessage, warningMessage, errorMessage } from "../../../utils/message";
import { useDispatch, useSelector } from 'react-redux';
import xssFilters from "xss-filters";

import { rootContext } from "../rootContext";
import { warehouseAddProCntxt } from "../WarehouseContext/warehouse-addProCntxt";

import { addLinkCntxt } from "../AddLinkContext/addLinkCntxt";
import { addImageCntxt } from "../AddImageContext/addImageCntxt";

import { getProByCodeOrName } from '../../../Services/warehouseAddProService'
import { selectUser } from '../../Slices/mainSlices';
import { selectCurrentReqItems, RsetCurrentReqItems } from "../../Slices/currentReqSlice";
import { selectAcceptReqModal, selectNextAcceptReqModal, selectCancelReqModal, selectEditReqModal, RsetViewReqModal, selectViewReqModal, selectReqHistoryModal, selectViewReqComment, RsetViewReqComment } from '../../Slices/modalsSlice';

const RequestContext = ({ requests, children, clearReq, setClearReq,
    currentRequest, setCurrentRequest, currentRequestItems, setCurrentRequestItems }) => {

    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
    const editReqModal = useSelector(selectEditReqModal);
    const cancelReqModal = useSelector(selectCancelReqModal);
    const viewReqModal = useSelector(selectViewReqModal);
    const reqHistoryModal = useSelector(selectReqHistoryModal);
    const viewReqComment = useSelector(selectViewReqComment);
    const currentReqItems = useSelector(selectCurrentReqItems);

    const mainContext = useContext(rootContext);
    const {
        setLoading,
        currentReqId,
        currentReqInfo,
        setCurrentReqInfo,
        currentReqItem,
        setCurrentReqItems,
        currentReqToPerson,
        setCurrentReqToPerson,
        handleGetWarehouseNSeenCounter,
        purchaseReqs,
        deletedReqItems,

        setReqItemDeliveryModal,
        setReqItemDetailsModal,
        setReqItemReceivedDetailsModal,
    } = mainContext;

    const warehouseAddProContext = useContext(warehouseAddProCntxt);
    const {
        addProCode,
        setAddProCode,
        addProCodeRef,
        addProName,
        addProNameRef,
        setAddProName
    } = warehouseAddProContext;

    const addLinkContext = useContext(addLinkCntxt);
    const {
        setReqItemLink,
        reqItemLinks,
        setReqItemLinks,
        reqItemLinkRef,
    } = addLinkContext;

    const addImageContext = useContext(addImageCntxt);
    const {
        reqItemImageRef,
        reqItemImage,
        setReqItemImage,
        reqItemImagesFile,
        setReqItemImagesFile,
        reqItemImages,
        setReqItemImages,
    } = addImageContext;

    const user = useSelector(selectUser);
    const [applicantFName, setApplicantFName] = useState('');
    const [applicantLName, setApplicantLName] = useState('');
    const [warehouseSelect, setWarehouseSelect] = useState([]);
    const handleGetWarehouses = async (companyCode) => {
        try {
            const warehousesRes = await getWarehouses(companyCode);
            if (warehousesRes.data.code === 415) {
                setWarehouseSelect(warehousesRes.data.list)
            }else{
                setWarehouseSelect([])
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const [warehouse, setWarehouse] = useState('');
    const [reqSupervisor, setReqSupervisor] = useState('');
    useEffect(() => {
        if (user.Supervisor !== undefined) {
            setReqSupervisor({ value: user.Supervisor._id, label: user.Supervisor.FirstName + ' ' + user.Supervisor.LastName });
        }
    }, [user])
    const [reqSupervisors, setReqSupervisors] = useState([]);
    const [requestDescription, setRequestDescription] = useState('');
    const [reqItemName, setReqItemName] = useState('');
    const reqItemNameRef = useRef();
    const [reqItemAmount, setReqItemAmount] = useState('');
    const reqItemAmountRef = useRef();
    const [reqItemUnit, setReqItemUnit] = useState('');
    const reqItemUnitRef = useRef();
    const [reqItemPlaceOfUse, setReqItemPlaceOfUse] = useState('');
    const reqItemPlaceOfUseRef = useRef();
    const [reqItemSubPlaceOfUse, setReqItemSubPlaceOfUse] = useState('');
    const reqItemSubPlaceOfUseRef = useRef();
    const deliveryTypeSelect = [
        { value: 1, label: 'داغی دارد' },
        { value: 2, label: 'داغی ندارد' },
        { value: 3, label: 'امانی' },
        { value: 4, label: 'مصرفی' },
        { value: 5, label: 'پروژه ای' },
        { value: 6, label: 'جدید' },
    ];

    ////
    const [reqTotalImages, setReqTotalImages] = useState([]);
    ////

    const [reqItemDescription, setReqItemDescription] = useState('');
    const reqItemDescriptionRef = useRef();
    const [reqItems, setReqItems] = useState([]);
    const addNewItemRef = useRef();

    const reqDepSups = reqSupervisors.map(data => {
        return { value: xssFilters.inHTMLData(data._id), label: xssFilters.inHTMLData(data.gender) + " " + xssFilters.inHTMLData(data.first_name) + " " + xssFilters.inHTMLData(data.last_name) + " (" + xssFilters.inHTMLData(data.local_phone) + ")" };
    })
    const handleUpSupervisors = async (user) => {
        try {
            const { data } = await upSupervisors(user.CompanyCode, user.Location);
            if (data.length !== 0) {
                setReqSupervisors(data)
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    const handleEnter = (e, reqItems) => {
        e.which = e.which || e.keyCode;
        if (e.which === 13) {
            switch (e.target.id) {
                case "reqItemName":
                    reqItemAmountRef.current.focus();
                    break;
                case "reqItemAmount":
                    reqItemUnitRef.current.focus();
                    break;
                case "reqItemUnitRef":
                    reqItemPlaceOfUseRef.current.focus();
                    break;
                case "reqItemPlaceOfUse":
                    reqItemSubPlaceOfUseRef.current.focus();
                    break;
                case "reqItemSubPlaceOfUse":
                    reqItemDescriptionRef.current.focus();
                    break;
                case "reqItemDescription":
                    addNewItemRef.current.focus();
                    break;
                case "addNewItem":
                    //reqItemNameRef.current.focus();
                    // handleAddNewItem(reqItems);
                    break;
                default:
                    break;
            }
            e.preventDefault();
        }
    }
    const handleSubmitNewReq = async (event) => {
        event.preventDefault();
        if ('myRequest') {
            submitNewRequest();
        } else {
            if (applicantFName === '') {
                errorMessage('واردکردن نام الزامی است!');
                document.getElementById('applicantFName').focus();
            } else {
                if (applicantLName === '') {
                    errorMessage('واردکردن نام خانوادگی الزامی است!');
                    document.getElementById('applicantLName').focus();
                } else {
                    submitNewRequest();
                }
            }
        }
    }
    const submitNewRequest = async () => {
        if (reqItems.length !== 0) {
            const ReqValues = {
                description: requestDescription,
                applicantName: 'myRequest ? undefined : applicantFName',
                applicantLname: 'myRequest ? undefined : applicantLName',
                // project 1 , not 0
                forProject: '',
                projectCode: '',
            }
            const { data } = 'await postReqData(ReqValues)';
            if (data.code === 415) {
                const ActionValues = {
                    actionId: data.id,
                    actionCode: 0,
                    userId: localStorage.getItem("id"),
                    toPersons: [reqSupervisor.value],
                    typeId: 2
                }
                const postActionRes = await postAction(ActionValues);
                if (postActionRes.data.code === 415) {
                    var savedItems = 0;
                    reqItems.map(async (value, index) => {
                        const ItemsValue = {
                            requestId: data.id,
                            row: index + 1,
                            itemName: value.name,
                            itemAmount: value.amount,
                            itemUnit: value.unit.value !== undefined ? value.unit.value : '',
                            mainPlace: value.placeOfUse,
                            subPlace: value.subPlaceOfUse === '' ? value.placeOfUse : value.subPlaceOfUse,
                            comment: value.comment,
                            // daghi 1, not 0
                            rattletrap: "",
                            // masrafi 1/ not 0
                            consumable: "",
                            //amani 1, not 0
                            borrowed: ""
                        }
                        const reqItemRes = 'await postReqItems(ItemsValue)';
                        if (reqItemRes.data.code === 415) {
                            savedItems = savedItems + 1;
                            if (reqItems.length === savedItems) {
                                // dispatch(handleResetWarehouseReq());
                                successMessage('درخواست شما با موفقیت ثبت شد!');
                            }
                        } else {
                            errorMessage('خطا در ثبت آیتم درخواست!')
                        }
                    })
                } else {
                    errorMessage('خطا در ثبت درخواست!')
                }
            } else {
                errorMessage('خطا در ثبت درخواست!')
            }
        } else {
            errorMessage('واردکردن حداقل یک آیتم الزامی است!');
        }
    }


    const [curentRequestLinksModal, setCurentRequestLinksModal] = useState(false);
    const [curentRequestLinksEditModal, setCurentRequestLinksEditModal] = useState(false);
    const [curentRequestImagesModal, setCurentRequestImagesModal] = useState(false);
    const [curentRequestImagesEditModal, setCurentRequestImagesEditModal] = useState(false);
    const [reqItemDeleteModal, setReqItemDeleteModal] = useState(false);
    const [reqItemId, setReqItemId] = useState('');
    const [curentRequestLinks, setCurentRequestLinks] = useState([]);
    const [curentRequestImages, setCurentRequestImages] = useState([]);

    const handleAllNewWarehouseRequests = async () => {
        // setLoading(true);
        // try {
        //     const { data } = await getNewRequests();
        //     if (data) {
        //         setAllWarehouseReqs(data)
        //         setLoading(false);
        //     }
        // } catch (ex) {
        //     setLoading(false);
        // }
    }

    const handleReqComment = async () => {
        const reqCommentValues = {
            actionCode: 8,
            actionId: currentReqId,
            userId: localStorage.getItem('id'),
            comment: viewReqComment !== '' ? viewReqComment : null,
            typeId: 8
        }
        try {
            const { data } = await postAction(reqCommentValues);
            if (data.code === 415) {
                successMessage('نظر شما با موفقیت ارسال شد!');
                dispatch(RsetViewReqComment(''));
                dispatch(RsetViewReqModal(false));
            } else {
                errorMessage('خطا در ثبت نظر!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const [numberOfDeliveries, setNumberOfDeliveries] = useState('');
    const handleAcceptReqByWarehouse = async () => {
        // const acceptReqValues = {
        //     actionCode: 7,
        //     actionId: currentRequest.reqInfo._id,
        //     userId: currentRequest.supInfo.id,
        //     toPersons: currentRequest.userInfo._id,
        //     comment: acceptReqComment
        // }
        // dispatch(handleAcceptRequest(acceptReqValues, setAcceptReqComment, setNextAcceptRequestModal, setAcceptRequestModal, memberId, departmentId, statusId, fromDate, toDate, currentRequest.reqInfo._id, currentRequestItems, setCurrentRequestItems, setUpdateReqValuesModal));
        // const {data} = await postNumberOfDeliveries(currentRequestItems[0]._id, numberOfDeliveries);
        // setAcceptRequestModal(false);
    }
    const [updateReqValuesModal, setUpdateReqValuesModal] = useState(false);
    const handleUpdateReqValues = async () => {
        const { data } = await getReqItems(currentRequest.reqInfo._id);
        setCurrentRequestItems(data[0].items);
        setUpdateReqValuesModal(false);
    }

    const [editReqItem, setEditReqItem] = useState(false);

    const handleGetCurrentRequest = request => {
        setCurrentRequest(request);
        handleGetCurrentRequestItems(request.reqInfo._id)
    }
    const handleGetCurrentRequestItems = async reqId => {
        try {
            const { data } = await getReqItems(reqId);
            setCurrentRequestItems(data[0].items)
        } catch (ex) {
            console.log(ex)
        }
    }
    const handleGetCurrentRequestLinks = async reqItemId => {
        try {
            if (reqItemId.length === undefined) {
                if (reqItemId.list.length !== 0) {
                    setCurentRequestLinks(reqItemId);
                    setCurentRequestLinksModal(true);
                } else {
                    warningMessage('برای این آیتم لینکی وارد نشده است!')
                }
            } else {
                const { data } = await getReqItemLinks(reqItemId);
                if (data[0].list.length !== 0) {
                    setCurentRequestLinks(data[0]);
                    setCurentRequestLinksEditModal(true);
                } else {
                    warningMessage('برای این آیتم لینکی وارد نشده است!')
                }
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    const handleGetCurrentRequestImages = async reqItemId => {
        setEditReqItemImages([]);
        try {
            if (Array.isArray(reqItemId)) {
                if (reqItemId.length !== 0) {
                    setCurentRequestImages(reqItemId);
                    setCurentRequestImagesModal(true);
                } else {
                    warningMessage('برای این آیتم تصویری وارد نشده است!')
                }
            } else {
                const { data } = await getReqItemImages(reqItemId);
                if (data.length !== 0) {
                    setCurentRequestImages(data);
                    setCurentRequestImagesEditModal(true);
                } else {
                    warningMessage('برای این آیتم تصویری وارد نشده است!')
                }
            }

        } catch (ex) {
            console.log(ex)
        }
    }


    const handleReqItemDelete = (reqItemId) => {
        if (reqItemId.length === undefined) {
            const items = [...reqItems];
            if (items.length > 1) {
                const filteredItems = items.filter(tr => tr.id !== reqItemId);
                setReqItems(filteredItems);
                // setCurrentReqItems(filteredItems);
                setReqItemDeleteModal(false)
            } else {
                errorMessage('وجود حداقل یک آیتم ضروری است!')
                setReqItemDeleteModal(false)
            }
        } else {
            const items = [...currentReqItems];
            if (items.length > 1) {
                const filteredItems = items.filter(tr => tr._id !== reqItemId);
                // setCurrentReqItems(filteredItems);
                setReqItems(filteredItems);
                setReqItemDeleteModal(false)
                deletedReqItems.push(reqItemId);
            } else {
                errorMessage('وجود حداقل یک آیتم ضروری است!')
                setReqItemDeleteModal(false)
            }
        }
    }
    // warehouse keeper item fields to accept req
    const handleAddWrhComment = (event, reqItemId) => {
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = {...items[itemIndex]};
        item.invKeeperComment = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems))
    }
    const handleAddManagerComment = (event, reqItemId) => {
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = {...items[itemIndex]};
        item.managerComment = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems))
    }
    const handleAddStoreAsCode = (value, reqItemId) => {
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = {...items[itemIndex]};
        item.invCode = value;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems))
    }
    const handleAddStoreAsName = (value, reqItemId) => {
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = {...items[itemIndex]};
        item.invName = value;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems))
    }
    const [addProList, setAddProList] = useState([]);
    const [addProModal, setAddProModal] = useState(false);
    const [selectedPro, setSelectedPro] = useState({});
    const [currentItem, setCurrentItem] = useState({});
    const handleAddProCode = async (value, itemId) => {
        const addProCodeLength = value.replaceAll("-", "").length;
        const addProCode = value.replaceAll("-", "");
        if (addProCodeLength !== 0) {
            if (addProCodeLength >= 5) {
                const inputLength = 10 - addProCodeLength;
                var zero = '';
                const autoZero = () => {
                    for (var i = 0; i < inputLength; i++) {
                        zero = zero + '0';
                    }
                    return zero;
                }
                const completedCode = addProCode.substring(0, 4) + autoZero() + addProCode.substring(4, addProCodeLength);
                handleAddStoreAsCode(completedCode, itemId)
                // setAddProPrevCode(completedCode);
                // if(addProPrevCode !== completedCode){
                setLoading(true)
                try {
                    const getProByCodeRes = await getProByCodeOrName(completedCode, []);
                    if (getProByCodeRes.data.code === 415) {
                        setLoading(false);
                        handleAddStoreAsName(getProByCodeRes.data.list[0].ItemName, itemId);
                        // handleAddStoreAsCode(getProByCodeRes.data.ItemCode, itemId)
                        setAddProModal(false);
                    } else {
                        setLoading(false);
                        errorMessage('کد موردنظر یافت نشد!');
                    }
                } catch (ex) {
                    setLoading(false);
                    console.log(ex);
                }
                // }
            } else {
                // addProCodeRef.current.focus();
                // addProCodeRef.current.select();
                // setAddProName('');
                // setAddProPrevCode('');
                // setAddProPrevName('');
                errorMessage('کد انبار نمیتواند کمتر از 5 رقم باشد!');
            }
        } else {
            // setAddProName('');
            // setAddProPrevCode('');
            // setAddProPrevName('');
        }
    }
    const handleAddProName = async (value, itemId) => {
        if (value !== '') {
            handleAddStoreAsCode('', itemId)
            if (addProModal !== true) {
                setAddProModal(true);
            }
            const searchedArray = value.split('+')
            //setAddProPrevName(addProName)
            // if(addProPrevName !== addProName){
            setLoading(true);
            try {
                const getProByNameRes = await getProByCodeOrName('', String(searchedArray));
                if (getProByNameRes.data.code === 415) {
                    setLoading(false);
                    setAddProList(getProByNameRes.data.list)
                } else {
                    setLoading(false);
                    errorMessage('کالا موردنظر یافت نشد!');
                    setAddProList([]);
                }
            } catch (ex) {
                setLoading(false);
                console.log(ex);
            }
            // }
        }
    }
    const [receivedInventory, setReceivedInventory] = useState('');
    const reqItemInvRef = useRef();
    const [receivedAmount, setReceivedAmount] = useState('');
    const [receivedUnit, setReceivedUnit] = useState('');
    const [receiver, setReceiver] = useState('');
    const receiverRef = useRef();
    const [receivedDate, setReceivedDate] = useState(null);
    const reqItemRecDateRef = useRef();
    const handleItemInventoryValidation = () => {
        if (reqItemInvRef.current.props.value === '') {
            document.getElementById('reqItemInventory-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('reqItemInventory-required').classList.add('d-none');
            return true;
        }
    }
    const handleItemRecValidation = () => {
        if (receiverRef.current.props.value === '') {
            document.getElementById('reqItemReceiver-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('reqItemReceiver-required').classList.add('d-none');
            return true;
        }
    }
    const handleItemRecDateValidation = () => {
        if (reqItemRecDateRef.current.props.value === null) {
            document.getElementById('reqItemRecDate-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('reqItemRecDate-required').classList.add('d-none');
            return true;
        }
    }
    const handleItemReceiverValidation = () => {
        const itemUnitValidation = 'handleItemUnitValidation()';
        const itemAmountValidation = 'handleItemAmountValidation()';
        const itemInventoryValidation = handleItemInventoryValidation();
        const itemRecDateValidation = handleItemRecDateValidation();
        const itemRecValidation = handleItemRecValidation();
        if (itemUnitValidation && itemAmountValidation && itemInventoryValidation && itemRecDateValidation && itemRecValidation) {
            return true;
        } else {
            return false;
        }
    }
    const handleResetItemReceiverValues = () => {
        setReceivedInventory('');
        setReceivedAmount('');
        setReceivedUnit('');
        setReceiver('');
        setReceivedDate(null);
    }
    const [itemReceivedDetails, setItemReceivedDetails] = useState('');
    const handleItemReceivedDetails = async (itemId) => {
        try{
            const itemReceivedDetailsRes = await getItemReceivedDetails(itemId);
            if(itemReceivedDetailsRes.data.code === 415){
                if(itemReceivedDetailsRes.data.length !== 0){
                    setItemReceivedDetails(itemReceivedDetailsRes.data.list);
                    setReqItemReceivedDetailsModal(true);
                    setReqItemDetailsModal(false);
                }else{
                    errorMessage('جزئیاتی برای تحویل ثبت نشده!');
                }
            }else{
                setItemReceivedDetails('');
            }
        }catch(ex){
            console.log(ex);
        }
    }
    // warehouse keeper item fields to accept req

    const [editReqItemLink, setEditReqItemLink] = useState('');
    const handleAddEditItemLink = () => {
        if (editReqItemLink !== '') {
            var linkValidation = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            if (linkValidation.test(editReqItemLink)) {
                const links = [...curentRequestLinks.list];
                const link = {
                    id: Math.floor(Math.random() * 3000),
                    url: editReqItemLink
                }
                links.push(link);
                const test = {
                    item_id: curentRequestLinks.item_id,
                    list: links
                }
                setCurentRequestLinks(test)
                setEditReqItemLink('');
            } else {
                warningMessage('فرمت لینک وارد شده صحیح نمی باشد.');
            }
        } else {
            warningMessage('هیچ آدرسی وارد نشده است.');
        }
    }
    const handleEditReqItemLink = (value, url, reqItemId) => {
        if (reqItemId !== undefined) {

        } else {
            const links = [...curentRequestLinks.list];
            const linkIndex = links.findIndex(item => item.id === url.id);
            const link = links[linkIndex];
            link.url = value;
            links[linkIndex] = link;
            var curentReqLinks = {
                item_id: curentRequestLinks.item_id,
                list: links,
            }
            setCurentRequestLinks(curentReqLinks);
        }
    }
    const handleReqItemLinkDelete = (url) => {
        if (curentRequestLinks.list === undefined) {
            const links = [...curentRequestLinks];
            const filteredLinks = links.filter(item => item.id !== url.id);
            var curentReqLinks = {
                item_id: curentRequestLinks.item_id,
                list: filteredLinks,
            }
            setCurentRequestLinks(curentReqLinks);
        } else {
            const links = [...curentRequestLinks.list];
            const filteredLinks = links.filter(item => item.id !== url.id);
            var curentReqLinks = {
                item_id: curentRequestLinks.item_id,
                list: filteredLinks,
            }
            setCurentRequestLinks(curentReqLinks);
        }
    }
    const handleEditReqItemLinks = async (reqItemId) => {
        try {
            if (reqItemId.length === undefined) {
                const requestItems = [...purchaseProducts];
                const itemIndex = requestItems.findIndex(item => item.id === reqItemId);
                const item = requestItems[itemIndex];
                item.links = curentRequestLinks.list;
                requestItems[itemIndex] = item;
                setReqItems(requestItems);
                setCurentRequestLinksModal(false);
            } else {
                var count = 0;
                curentRequestLinks.list.map(async (url) => {
                    if (url !== '') {
                        var linkValidation = new RegExp('^(https?:\\/\\/)?' + // protocol
                            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                        if (linkValidation.test(url.url)) {
                            count = count + 1;
                        } else {
                            warningMessage('فرمت لینک وارد شده صحیح نمی باشد.');
                        }
                    } else {
                        errorMessage('لینک نمیتواند خالی باشد!')
                    }
                })
                if (curentRequestLinks.list.length === count) {
                    const { data } = await deleteReqItemLink(reqItemId);
                    if (data) {
                        const ReqItemLink = {
                            item_id: reqItemId,
                            links: curentRequestLinks.list
                        }
                        const reqItemLinkRes = await postReqItemLink(ReqItemLink);
                        setCurentRequestLinksEditModal(false);
                        successMessage('تغییرات موردنظر ثبت شد!')
                    }
                }
            }
        } catch (ex) {
            console.log(ex)
        }
    }
    const [editReqItemImage, setEditReqItemImage] = useState('');
    const [editReqItemImages, setEditReqItemImages] = useState([]);
    const [editReqItemImageType, setEditReqItemImageType] = useState('');
    const [editReqItemImageFile, setEditReqItemImageFile] = useState('');
    const [editReqItemImagesFile, setEditReqItemImagesFile] = useState([]);
    const [editReqItemImagePreviewUrl, setEditReqItemImagePreviewUrl] = useState('');
    const handleUploadEditItemImage = e => {
        e.persist();
        (async () => {
            await console.log(e);
            const reader = new FileReader();
            const fileByteArray = [];
            reader.readAsArrayBuffer(e.target.files[0]);
            reader.onload = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    const arrBuffer = evt.target.result,
                        array = new Uint8Array(arrBuffer);
                    for (const a of array) {
                        fileByteArray.push(a);
                    }
                    setEditReqItemImage(fileByteArray)
                    setEditReqItemImageType(e.target.files[0].type)
                }
            }
            const reader1 = new FileReader();
            const file = e.target.files[0];
            reader1.onloadend = () => {
                setEditReqItemImageFile(file);
                setEditReqItemImagePreviewUrl(reader1.result);
            }
            reader1.readAsDataURL(file);
        })();
    }
    const handleAddEditItemImage = () => {
        var images = [];
        var imagesFile = [];
        if (editReqItemImage !== '') {
            images = [...editReqItemImages];
            imagesFile = [...editReqItemImagesFile]
            const id = Math.floor(Math.random() * 1000);
            const image = { image: editReqItemImage, type: editReqItemImageType, id: id };
            const imageFile = { image: editReqItemImageFile, src: editReqItemImagePreviewUrl, id: id };
            images.push(image);
            imagesFile.push(imageFile)
            setEditReqItemImages(images);
            setEditReqItemImage('');
            setEditReqItemImagesFile(imagesFile);
            setEditReqItemImageType('');
            var inputs = document.getElementsByClassName('editReqItemImage');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].value = '';
            }
        } else {
            warningMessage('هیچ عکسی انتخاب نشده است.');
        }
    }
    const handleReqItemImageDelete = (reqItemImage) => {
        const curentRequestImagesFilter = curentRequestImages.filter(div => div.number ? div.number !== reqItemImage.number : div.id !== reqItemImage.id);
        const editReqItemImagesFileFilter = editReqItemImagesFile.filter(div => div.number ? div.number !== reqItemImage.number : div.id !== reqItemImage.id);
        const editReqItemImagesFilter = editReqItemImages.filter(div => div.number ? div.number !== reqItemImage.number : div.id !== reqItemImage.id);
        setCurentRequestImages(curentRequestImagesFilter);
        setEditReqItemImagesFile(editReqItemImagesFileFilter);
        setEditReqItemImages(editReqItemImagesFilter);
    }
    const handleEditReqItemImages = async (reqItemId) => {
        const images = [...curentRequestImages, ...editReqItemImages];
        if (reqItemId.length !== undefined) {
            try {
                const { data } = await deleteReqItemImage(reqItemId);
                if (data) {
                    var reqItemImageRes;
                    var updatedImages = 1;
                    images.map(async (data, i) => {
                        var ReqItemImage = {}
                        if (data.item_id) {
                            var binary_string = window.atob(data.src);
                            var len = binary_string.length;
                            var bytes = new Uint8Array(len);
                            for (var i = 0; i < len; i++) {
                                bytes[i] = binary_string.charCodeAt(i);
                            }
                            var fileByteArray = [];
                            const array = new Uint8Array(bytes.buffer);
                            for (const a of array) {
                                fileByteArray.push(a);
                            }
                            ReqItemImage = {
                                item_id: reqItemId,
                                src: fileByteArray,
                                number: i + 1,
                                type: data.type
                            }
                        } else {
                            ReqItemImage = {
                                item_id: reqItemId,
                                src: data.image,
                                number: i + 1,
                                type: data.type
                            }
                        }
                        reqItemImageRes = await postReqItemImage(ReqItemImage);
                        if (reqItemImageRes.data) {
                            finish();
                            updatedImages++;
                        }
                    })
                    const finish = () => {
                        if (images.length === updatedImages) {
                            if (curentRequestImagesEditModal) {
                                setCurentRequestImagesEditModal(false);
                            }
                            setCurentRequestImagesModal(false);
                            successMessage('تغییرات تصاویر با موفقیت انجام شد!');
                            setEditReqItemImagesFile([])
                        } else {
                            // setCurentRequestImagesModal(false);
                            // successMessage('لطفا مجدد تلاش کنید!');
                            // setEditReqItemImagesFile([])
                        }
                    }
                }
            } catch (ex) {
                console.log(ex)
            }
        } else {
            const images = [...curentRequestImages, ...editReqItemImagesFile];
            const requestItems = [...purchaseProducts];
            const itemIndex = requestItems.findIndex(item => item.id === reqItemId)
            const item = requestItems[itemIndex];
            item.images = images;
            requestItems[itemIndex] = item;
            setReqItems(requestItems);
            setCurentRequestImages(images)
            setEditReqItemImagesFile([]);
            setEditReqItemImages([]);
            setCurentRequestImagesModal(false);
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
                    } else if (data.status !== 400 && data.length !== 0) {
                        setReqComments(data.comments)
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
            // dispatch(handleResetWarehouseReq());
        }
    }, [clearReq])

    //purchase req
    const prioritySelect = [
        { value: 1, label: 'عادی' },
        { value: 2, label: 'فوری' },
    ]
    const [purchaseProTechSpecifications, setPurchaseProTechSpecifications] = useState('');
    const purchaseProTechSpecificationsRef = useRef();
    const [purchaseProAmount, setPurchaseProAmount] = useState('');
    const purchaseProAmountRef = useRef();
    const [purchaseProPriority, setPurchaseProPriority] = useState('');
    const purchaseProPriorityRef = useRef();
    const [purchaseProUsePlace, setPurchaseProUsePlace] = useState('');
    const purchaseProUsePlaceRef = useRef();
    const buyWithSelect = [
        { value: 1, label: 'تدارکات دفتر مرکزی' },
        { value: 2, label: 'تدارکات کارخانه' },
    ]
    const [purchaseReqBuyPlace, setPurchaseReqBuyPlace] = useState(false);
    const [purchaseReqBuyWith, setPurchaseReqBuyWith] = useState({ value: 1, label: 'تدارکات دفتر مرکزی' });
    useEffect(() => {
        if (purchaseReqBuyPlace === false) {
            setPurchaseReqBuyWith({ value: 1, label: 'تدارکات دفتر مرکزی' });
        } else if (purchaseReqBuyPlace === true) {
            setPurchaseReqBuyWith({ value: 2, label: 'تدارکات کارخانه' });
        }
    }, [purchaseReqBuyPlace])
    const handleAddProCodeValidation = () => {
        if (addProCodeRef.current.value === '') {
            document.getElementById('addProCode-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('addProCode-required').classList.add('d-none');
            return true;
        }
    }
    const handleAddProNameValidation = () => {
        if (addProNameRef.current.value === '') {
            document.getElementById('addProName-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('addProName-required').classList.add('d-none');
            return true;
        }
    }
    const handlePurchaseProTechSpecificationsValidation = () => {
        if (purchaseProTechSpecificationsRef.current.value === '') {
            document.getElementById('purchaseProTechSpecifications-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('purchaseProTechSpecifications-required').classList.add('d-none');
            return true;
        }
    }
    const handlePurchaseProAmountValidation = () => {
        if (purchaseProAmountRef.current.value === '') {
            document.getElementById('purchaseProAmount-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('purchaseProAmount-required').classList.add('d-none');
            return true;
        }
    }
    const handlePurchaseProPriorityValidation = () => {
        if (purchaseProPriorityRef.current.props.value === '') {
            document.getElementById('purchaseProPriority-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('purchaseProPriority-required').classList.add('d-none');
            return true;
        }
    }
    const handlePurchaseProUsePlaceValidation = () => {
        if (purchaseProUsePlaceRef.current.value === '') {
            document.getElementById('purchaseProUsePlace-required').classList.remove('d-none');
            return false;
        } else {
            document.getElementById('purchaseProUsePlace-required').classList.add('d-none');
            return true;
        }
    }
    const handlePurchaseAddProValidation = () => {
        const addProCodeValidation = handleAddProCodeValidation();
        const addProNameValidation = handleAddProNameValidation();
        // const purchaseProTechSpecificationsValidation = handlePurchaseProTechSpecificationsValidation();
        const purchaseProAmountValidation = handlePurchaseProAmountValidation();
        const purchaseProPriorityValidation = handlePurchaseProPriorityValidation();
        const purchaseProUsePlaceValidation = handlePurchaseProUsePlaceValidation();
        if (addProCodeValidation && addProNameValidation && purchaseProAmountValidation &&
            purchaseProPriorityValidation && purchaseProUsePlaceValidation) {
            return true;
        } else {
            return false;
        }
    }
    const [purchaseProducts, setPurchaseProducts] = useState([]);
    const handleAddPurchasePro = async () => {
        if (handlePurchaseAddProValidation()) {
            addProCodeRef.current.focus();
            const newItems = [...purchaseProducts];
            const newItem = {
                id: Math.floor(Math.random() * 1000),
                code: addProCode,
                desc: addProName,
                links: reqItemLinks,
                images: reqItemImagesFile,
                tech: purchaseProTechSpecifications,
                amount: purchaseProAmount,
                priority: purchaseProPriority,
                use: purchaseProUsePlace
            }
            newItems.push(newItem);
            const result = newItems.reduce((acc, item) => {
                const itemInAcc = acc.find(itemAcc => itemAcc.code === item.code);
                if (itemInAcc !== undefined) {
                    warningMessage('این آیتم تکراری می باشد.');
                    addProCodeRef.current.select();
                } else {
                    acc.push({ ...item });
                    addProCodeRef.current.focus();
                }
                return acc;
            }, []);
            if (purchaseProducts.length === result.length) {
                await addProCodeRef.current.select();
            } else {
                const input = document.getElementById('addProCode');
                input.focus();
                reqTotalImages.push(reqItemImages);
                addProCodeRef.current.focus();
                setPurchaseProducts(newItems);
                handlePurchaseReqProReset();
            }
        }
    }
    const handlePurchaseReqProReset = () => {
        setAddProCode('');
        setAddProName('');
        setReqItemLink('');
        setReqItemLinks([]);
        setReqItemImage('');
        setReqItemImages([]);
        setReqItemImagesFile([]);
        setPurchaseProTechSpecifications('');
        setPurchaseProAmount('');
        setPurchaseProPriority('');
        setPurchaseProUsePlace('');
    }
    const handlePurchaseReqItemDelete = (reqItemId) => {
        const items = [...purchaseProducts];
        const filteredItems = items.filter(tr => tr.id !== reqItemId);
        setPurchaseProducts(filteredItems);
        setReqItemDeleteModal(false)
    }

    const addNewPurchaseProRef = useRef();
    const handlePurchaseReq = async (e) => {
        e.preventDefault();
        try {
            if (purchaseProducts.length !== 0) {
                const purchaseReqValues = {
                    placeOfPurchase: 1, // 1 => tehran   &  2 => not tehran
                    description: "",
                    toPersons: "",
                    userId: localStorage.getItem('id'),

                    to: purchaseReqBuyPlace ? 45 : user.CompanyCode
                }
                const { data } = await postPurchaseReq(purchaseReqValues);
                if (data._id !== undefined) {
                    const toPersons = await getToPersonByRole('3, 36', user.Location, user.CompanyCode, 1, null, '0');
                    if (toPersons.data.code === 415) {
                        var toPersonsArr = [];
                        toPersons.data.list.map(async (person) => {
                            toPersonsArr.push(person.value)
                        })
                        const purchaseProActionValues = {
                            actionCode: 0,
                            actionId: data._id,
                            userId: localStorage.getItem('id'),
                            typeId: 8,
                            toPersons: toPersonsArr
                        }
                        const actionRes = await postAction(purchaseProActionValues);
                        if (actionRes.data.code === 415) {
                            var postedItems = 0;
                            var postedLinks = 0;
                            var postedImages = 0;
                            purchaseProducts.map(async (item, index) => {
                                const purchaseReqItemValues = {
                                    row: index + 1,
                                    requestId:'',
                                    invCode: '',
                                    itemPriority: '',
                                    itemTechInfo: '',
                                    itemUnit: '',
                                    itemAmount: '',
                                    itemPlanNo: '',
                                    itemUsePlace: '',
                                    itemProjectNo: '',

                                    reqId: data._id,
                                    goodCode: item.code,
                                    goodDetail: item.tech,
                                    priority: item.priority.value,
                                    amount: item.amount,
                                    usage: item.use,
                                    explanation: item.desc,
                                }

                                const reqItemRes = await postPurchaseReqItems(purchaseReqItemValues);
                                if (reqItemRes.data._id !== undefined) {
                                    postedItems = postedItems + 1;
                                    const postLinks = async () => {
                                        const ReqItemLink = {
                                            item_id: reqItemRes.data._id,
                                            links: item.links
                                        }
                                        const reqItemLinkRes = await postReqItemLink(ReqItemLink);
                                        if (reqItemLinkRes.data._id) {
                                            postedLinks = 1;
                                        }
                                        return true;
                                    }
                                    const postImages = () => {
                                        reqTotalImages[index].map(async (itemImage, i) => {
                                            const ReqItemImage = {
                                                item_id: reqItemRes.data._id,
                                                src: itemImage.image,
                                                number: i + 1,
                                                type: itemImage.type
                                            }
                                            const reqItemImageRes = await postReqItemImage(ReqItemImage);
                                            if (reqItemImageRes.data._id) {
                                                postedImages = postedImages + 1;
                                            }
                                        })
                                        return true;
                                    }
                                    if (item.links.length !== 0) {
                                        await postLinks();
                                    }
                                    if (reqTotalImages[index].length !== 0) {
                                        await postImages();
                                    }
                                    if (purchaseProducts.length === postedItems) {
                                        handlePurchaseReqReset();
                                        successMessage('درخواست با موفقیت ثبت شد!')
                                    } else {
                                        errorMessage('ثبت آیتم های درخواست با خطا مواجه شد!')
                                    }
                                }
                            })
                        }
                    } else {
                        errorMessage('شخص دریافت کننده ای در مدیریت انبار یافت نشد!')
                    }
                    // handlePurchaseReqReset();
                    // successMessage('درخواست شما با موفقیت ثبت شد!');
                } else {
                    errorMessage('ثبت درخواست با خطا مواجه شد!')
                }
            } else {
                warningMessage('واردکردن حداقل یک کالا الزامی است!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    const handlePurchaseReqReset = () => {
        setPurchaseReqBuyPlace(false);
        setPurchaseReqBuyWith('');
        setPurchaseProducts([]);
    }

    const handleaddPurchaseProEnter = (e) => {
        e.which = e.which || e.keyCode;
        if (e.which === 13) {
            switch (e.target.id) {
                case "addProCode":
                    addProNameRef.current.focus();
                    break;
                case "addProName":
                    purchaseProTechSpecificationsRef.current.focus();
                    break;
                case "purchaseProTechSpecifications":
                    purchaseProAmountRef.current.focus();
                    break;
                case "purchaseProAmount":
                    purchaseProPriorityRef.current.focus();
                    break;
                case "react-select-3-input":
                    purchaseProUsePlaceRef.current.focus();
                    break;
                case "purchaseProUsePlace":
                    addNewPurchaseProRef.current.focus();
                    break;
                case "addNewPurchasePro":
                    handleAddPurchasePro();
                    break;
                default:
                    break;
            }
            e.preventDefault();
        }
    }

    return (
        <reqContext.Provider
            value={{
                applicantFName,
                setApplicantFName,
                applicantLName,
                setApplicantLName,
                handleGetWarehouses,
                warehouseSelect,
                warehouse,
                setWarehouse,
                reqSupervisor,
                setReqSupervisor,
                reqDepSups,
                requestDescription,
                setRequestDescription,
                handleEnter,
                reqItemName,
                setReqItemName,
                reqItemNameRef,
                reqItemAmount,
                setReqItemAmount,
                reqItemAmountRef,
                reqItemUnit,
                setReqItemUnit,
                reqItemUnitRef,
                reqItemInvRef,
                reqItemRecDateRef,
                receiverRef,
                reqItemPlaceOfUse,
                setReqItemPlaceOfUse,
                reqItemPlaceOfUseRef,
                reqItemSubPlaceOfUse,
                setReqItemSubPlaceOfUse,
                reqItemSubPlaceOfUseRef,
                deliveryTypeSelect,
                reqItemDescription,
                setReqItemDescription,
                reqItemDescriptionRef,
                reqItems,
                addNewItemRef,
                handleSubmitNewReq,

                handleAllNewWarehouseRequests,
                currentRequest,
                currentRequestItems,
                setCurrentRequestItems,
                handleResetItemReceiverValues,
                handleItemReceivedDetails,
                itemReceivedDetails,

                handleAcceptReqByWarehouse,


                setEditReqItem,

                updateReqValuesModal,
                setUpdateReqValuesModal,
                handleUpdateReqValues,

                handleReqComment,

                reqComments,

                handleGetCurrentRequest,
                handleGetCurrentRequestLinks,
                curentRequestLinks,
                curentRequestLinksModal,
                setCurentRequestLinksModal,
                curentRequestLinksEditModal,
                setCurentRequestLinksEditModal,
                handleGetCurrentRequestImages,
                curentRequestImages,
                curentRequestImagesModal,
                setCurentRequestImagesModal,
                curentRequestImagesEditModal,
                setCurentRequestImagesEditModal,
                reqItemDeleteModal,
                setReqItemDeleteModal,
                handleReqItemDelete,
                reqItemId,
                setReqItemId,
                editReqItem,
                handleReqItemImageDelete,
                //warehouse keeper new fileds in item
                handleAddWrhComment,
                handleAddManagerComment,
                handleAddStoreAsCode,
                handleAddStoreAsName,
                addProList,
                setAddProList,
                addProModal,
                setAddProModal,
                selectedPro,
                setSelectedPro,
                currentItem,
                setCurrentItem,
                handleAddProCode,
                handleAddProName,
                receivedInventory,
                setReceivedInventory,
                receivedAmount,
                setReceivedAmount,
                receivedUnit,
                setReceivedUnit,
                receiver,
                setReceiver,
                receivedDate,
                setReceivedDate,
                // End warehouse keeper fileds
                editReqItemLink,
                setEditReqItemLink,
                handleAddEditItemLink,
                handleEditReqItemLinks,
                handleUploadEditItemImage,
                handleAddEditItemImage,
                handleEditReqItemImages,
                handleReqItemLinkDelete,
                handleEditReqItemLink,
                editReqItemImagesFile,
                setEditReqItemImagesFile,
                numberOfDeliveries,
                setNumberOfDeliveries,
                handleUpSupervisors,
                reqSerialNumber,
                setReqSerialNumber,
                handleReqHistory,

                prioritySelect,
                buyWithSelect,
                purchaseReqBuyPlace,
                setPurchaseReqBuyPlace,
                purchaseReqBuyWith,
                setPurchaseReqBuyWith,
                purchaseProTechSpecifications,
                setPurchaseProTechSpecifications,
                purchaseProTechSpecificationsRef,
                purchaseProAmount,
                setPurchaseProAmount,
                purchaseProAmountRef,
                purchaseProPriority,
                setPurchaseProPriority,
                purchaseProPriorityRef,
                purchaseProUsePlace,
                setPurchaseProUsePlace,
                purchaseProUsePlaceRef,
                handleAddPurchasePro,
                handlePurchaseReqItemDelete,
                handlePurchaseReq,
                handlePurchaseReqReset,
                purchaseProducts,
                addNewPurchaseProRef,
                handleaddPurchaseProEnter,
            }}
        >
            {acceptReqModal ? <AcceptRequest /> : null}

            {nextAcceptReqModal ? <NextAcceptRequest /> : null}

            {cancelReqModal ? <CancelRequest /> : null}

            {editReqModal ? <EditRequest /> : null}

            {updateReqValuesModal ? <ChangedReqValues /> : null}

            {viewReqModal ? <ViewRequest /> : null}

            {reqHistoryModal ? <ReqHistoryModal /> : null}

            {children}
        </reqContext.Provider>
    )
}

export default RequestContext;