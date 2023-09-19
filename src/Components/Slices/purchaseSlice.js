import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorMessage, successMessage, warningMessage } from "../../utils/message";
import { RsetFormErrors, handleReqsList, RsetLoading, handleAllItems, RsetUsersByRole } from "./mainSlices";
import { getToPersonByRole, postAction, checkItemUpdateDate } from "../../Services/rootServices";
import { postPurchaseReq, postPurchaseReqItems, editPurchaseReqItem, postPurchaseItemAction, purchasedItem } from '../../Services/warehouseReqService';
import { RsetCurrentReqItems, handleCurrentReqItems } from "./currentReqSlice";
import { RsetDeleteReqItemModal, RsetAcceptReqModal, RsetAcceptReqComment, RsetEditReqModal } from './modalsSlice';
import { RsetGoodCode, RsetGoodName, RsetPrevList } from "./goodSearchSlice";


const initialState = {
    purchaseReqProcurement: false,
    purchaseReqDescription: '',
    purchaseReqItemAmount: '',
    purchaseReqItemPriority: { label: 'عادی', value: 1 },
    purchaseReqItemUnit: { label: 'عدد', value: 82 },
    purchaseReqItemTechInfo: '',
    purchaseReqItemPlaceOfUse: '',
    purchaseReqItemMapCode: '',
    purchaseReqItemProjectCode: '',
    purchaseReqItemId: '',
    purchaseDeletedReqItems: [],
    purchaseItemModal: false,

    selectedPurchaseItems: [],
    purchaseSendItemsModal: false,
    usersBySupportSupervisor: '',
    usersBySupportSupervisorOptions: [],

    purchasedItemModal: false,
    purchasedItemInvoiceNumber: '',
    purchasedItemStore: '',
    purchasedItemStoreCode: '',
    purchasedItemPrice: '',
    purchasedItemAmount: '',
    purchasedItemUnit: '',
    purchasedItemDiscount: '',
    purchasedItemDate: null,
    purchasedItemFile: '',
};

//type 9
export const handleResetPurchaseReqItem = createAsyncThunk(
    "purchase/handleResetPurchaseReqItem",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetGoodCode(''));
        dispatch(RsetGoodName(''));
        dispatch(RsetPurchaseReqItemAmount(''));
        dispatch(RsetPurchaseReqItemUnit({ label: 'عدد', value: 82 }));
        dispatch(RsetPurchaseReqItemPriority({ label: 'عادی', value: 1 }));
        dispatch(RsetPurchaseReqItemTechInfo(''));
        dispatch(RsetPurchaseReqItemPlaceOfUse(''));
        dispatch(RsetPurchaseReqItemMapCode(''));
        dispatch(RsetPurchaseReqItemProjectCode(''));
        dispatch(RsetFormErrors({}));
    }
);
export const handleResetPurchaseReq = createAsyncThunk(
    "purchase/handleResetPurchaseReq",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetFormErrors({}));
        dispatch(handleResetPurchaseReqItem());
        dispatch(RsetPurchaseReqProcurement(false));
        dispatch(RsetPurchaseReqDescription(''));
        dispatch(RsetCurrentReqItems([]));
        // setClearReq(false);
    }
);
export const handleAddNewPurchaseReqItem = createAsyncThunk(
    "purchase/handleAddNewPurchaseReqItem",
    async (obj, { dispatch, getState }) => {
        const { goodCode, goodName } = getState().goodSearch;
        const { purchaseReqItemAmount, purchaseReqItemPriority, purchaseReqItemUnit, purchaseReqItemTechInfo,
            purchaseReqItemPlaceOfUse, purchaseReqItemMapCode, purchaseReqItemProjectCode
        } = getState().purchase;
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const newItem = {
            itemId: Math.floor(Math.random() * 1000),
            invCode: goodCode,
            invName: goodName,
            itemAmount: purchaseReqItemAmount,
            itemPriority: purchaseReqItemPriority,
            itemUnit: purchaseReqItemUnit,
            itemTechInfo: purchaseReqItemTechInfo,
            usePlace: purchaseReqItemPlaceOfUse,
            planNo: purchaseReqItemMapCode,
            projectNo: purchaseReqItemProjectCode
        };
        items.push(newItem);
        const result = items.reduce((acc, item) => {
            const itemInAcc = acc.find(itemAcc => itemAcc.invCode === item.invCode);
            if (itemInAcc !== undefined) {
                warningMessage('این آیتم تکراری می باشد.');
                // reqItemNameRef.current.select();
            } else {
                acc.push({ ...item });
                // reqItemNameRef.current.focus();
            }
            return acc;
        }, []);
        if (currentReqItems.length === result.length) {

        } else {
            dispatch(RsetCurrentReqItems(result));
            dispatch(RsetPrevList(result));
            dispatch(handleResetPurchaseReqItem());
        }
    }
);
export const handleDeletePurchaseReqItem = createAsyncThunk(
    "purchase/handleDeletePurchaseReqItem",
    async (reqItemId, { dispatch, getState }) => {
        const { purchaseDeletedReqItems } = getState().purchase;
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        if (items.length > 1) {
            const filteredItems = items.filter(tr => tr.itemId !== reqItemId);
            dispatch(RsetCurrentReqItems(filteredItems));
            dispatch(RsetDeleteReqItemModal(false));
            const deletedItems = [...purchaseDeletedReqItems];
            deletedItems.push(reqItemId);
            dispatch(RsetPurchaseDeletedReqItems(deletedItems));
        } else {
            errorMessage('وجود حداقل یک آیتم ضروری است!')
            dispatch(RsetDeleteReqItemModal(false));
        }
    }
);
export const handleEditPurchaseReqItemAmount = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemAmount",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.itemAmount = event.target.value;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemUnit = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemUnit",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.itemUnit = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemPriority = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemPriority",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.itemPriority = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemTechInfo = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemTechInfo",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.itemTechInfo = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemPlaceOfUse = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemPlaceOfUse",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.usePlace = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemMapCode = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemMapCode",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.planNo = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemProjectCode = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemProjectCode",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.projectNo = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleSubmitNewPurchaseReq = createAsyncThunk(
    "purchase/handleSubmitNewPurchaseReq",
    async (e, { dispatch, getState }) => {
        e.preventDefault();
        try {
            const { user } = getState().mainHome;
            const { currentReqItems } = getState().currentReq;
            const { purchaseReqProcurement, purchaseReqDescription } = getState().purchase;
            if (currentReqItems.length !== 0) {
                const toPersons = await getToPersonByRole('37', user.Location, user.CompanyCode, 1, null, '0');
                if (toPersons.data.code === 415) {
                    if (toPersons.data.list.length > 0) {
                        var toPersonsArr = [];
                        toPersons.data.list.map(async (person) => {
                            toPersonsArr.push(person.value)
                        })
                        const purchaseReqValues = {
                            placeOfPurchase: purchaseReqProcurement ? 2 : 1, // 1 => tehran   &  2 => not tehran
                            description: purchaseReqDescription,
                            toPersons: String(toPersonsArr),
                            userId: localStorage.getItem('id'),
                            // to: purchaseReqBuyPlace ? 45 : user.CompanyCode
                        }
                        const purchaseReqRes = await postPurchaseReq(purchaseReqValues);
                        if (purchaseReqRes.data.code === 415) {
                            var postedItems = 0;
                            currentReqItems.map(async (item, index) => {
                                const purchaseReqItemValues = {
                                    row: index + 1,
                                    requestId: purchaseReqRes.data.id,
                                    userId: localStorage.getItem('id'),
                                    invCode: item.invCode,
                                    itemPriority: item.itemPriority.value,
                                    itemTechInfo: item.itemTechInfo !== '' ? item.itemTechInfo : undefined,
                                    itemUnit: item.itemUnit.value,
                                    itemAmount: item.itemAmount,
                                    planNo: item.planNo !== '' ? item.planNo : undefined,
                                    usePlace: item.usePlace !== '' ? item.usePlace : undefined,
                                    projectNo: item.projectNo !== '' ? item.projectNo : undefined,
                                    toPersons: String(toPersonsArr)
                                }
                                const reqItemRes = await postPurchaseReqItems(purchaseReqItemValues);
                                if (reqItemRes.data.code === 415) {
                                    postedItems = postedItems + 1;
                                    if (currentReqItems.length === postedItems) {
                                        dispatch(handleResetPurchaseReq());
                                        successMessage('درخواست با موفقیت ثبت شد!')
                                    }
                                }
                            })
                        } else {
                            errorMessage('خطا در ثبت درخواست!');
                        }
                    } else {
                        errorMessage('شخص دریافت کننده ای یافت نشد!')
                    }
                } else {
                    errorMessage('خطا در دریافت اطلاعات!')
                }
            } else {
                warningMessage('واردکردن حداقل یک کالا الزامی است!')
            }
        } catch (ex) {
            console.log(ex);
        }
    }
);
export const handleEditPurchaseReqItems = createAsyncThunk(
    "purchase/handleEditPurchaseReqItems",
    async (reqId, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const { currentReqItems, currentReqInfo } = getState().currentReq;
            const { purchaseDeletedReqItems } = getState().purchase;
            const items = [...currentReqItems];
            const result = items.reduce((acc, item) => {
                const itemInAcc = acc.find(itemAcc => itemAcc.invCode === item.invCode);
                if (itemInAcc !== undefined) {
                    warningMessage('آیتم ' + itemInAcc.invCode + ' تکراری می باشد.');
                } else {
                    acc.push({ ...item })
                }
                return acc;
            }, []);
            if (currentReqItems.length === result.length) {
                const sendEditedData = async () => {
                    currentReqItems.map(async (item, index) => {
                        if (item.itemId.length !== undefined) {
                            if (item.invName === "") {
                                errorMessage('نام نمیتواند خالی باشد!')
                            } else if (item.itemAmount === "" || item.itemAmount <= 0) {
                                errorMessage('تعداد نمی تواند خالی یا برابر صفر باشد!')
                            } else {
                                const updateReqValues = {
                                    userId: localStorage.getItem('id'),
                                    action: 3,
                                    invCode: item.invCode,
                                    itemPriority: item.itemPriority !== undefined ? item.itemPriority.value : item.itemPriorityCode !== undefined ? item.itemPriorityCode : undefined,
                                    itemTechInfo: item.itemTechInfo !== '' && item.itemTechInfo !== null ? item.itemTechInfo : undefined,
                                    itemUnit: item.itemUnit !== undefined ? item.itemUnit.value : item.itemUnitCode !== undefined ? item.itemUnitCode : undefined,
                                    itemAmount: item.itemAmount,
                                    planNo: item.planNo !== '' && item.planNo !== null ? item.planNo : undefined,
                                    usePlace: item.usePlace !== '' && item.usePlace !== null ? item.usePlace : undefined,
                                    projectNo: item.projectNo !== '' && item.usePlace !== null ? item.projectNo : undefined,
                                }
                                const itemUpdateRes = await editPurchaseReqItem(item.itemId, updateReqValues);
                            }
                        }
                    })
                    if (purchaseDeletedReqItems.length !== 0) {
                        purchaseDeletedReqItems.map(async itemId => {
                            const updateReqValues = {
                                action: 2,
                                userId: localStorage.getItem('id')
                            }
                            const deletedReqItemRes = await editPurchaseReqItem(itemId, updateReqValues);
                        })
                    }
                    currentReqItems.map(async (item, index) => {
                        if (item.itemId.length === undefined) {
                            const purchaseReqItemValues = {
                                row: index + 1,
                                requestId: currentReqInfo.requestId,
                                userId: localStorage.getItem('id'),
                                invCode: item.invCode,
                                itemPriority: item.itemPriority.value,
                                itemTechInfo: item.itemTechInfo !== '' ? item.itemTechInfo : undefined,
                                itemUnit: item.itemUnit.value,
                                itemAmount: item.itemAmount,
                                planNo: item.planNo !== '' ? item.planNo : undefined,
                                usePlace: item.usePlace !== '' ? item.usePlace : undefined,
                                projectNo: item.projectNo !== '' ? item.projectNo : undefined,
                            }
                            const reqItemRes = await postPurchaseReqItems(purchaseReqItemValues);
                        }
                    })
                }

                const sendAction = async () => {
                    const ActionValues = {
                        actionId: currentReqInfo.requestId,
                        actionCode: 10000,
                        userId: localStorage.getItem("id"),
                        typeId: 9
                    }
                    const postActionRes = await postAction(ActionValues);
                    if (postActionRes.data.code === 415) {
                        const filterValues = {
                            applicantId: localStorage.getItem('id'),
                            memberId: '',
                            serial: '',
                            status: '',
                            fromDate: 'null',
                            toDate: 'null',
                            type: 9,
                            group: 0
                        }
                        dispatch(handleReqsList(filterValues));
                        successMessage('درخواست موردنظر با موفقیت ویرایش شد!');
                        dispatch(RsetEditReqModal(false));
                        dispatch(RsetCurrentReqItems([]));
                    }
                }
                const sendData = async () => {
                    await sendEditedData();
                    await sendAction();
                }
                sendData();
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);
export const handleEditPurchaseReqItemAcceptedAmount = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemAcceptedAmount",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.acceptedAmount = event.target.value;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemAcceptedPriority = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemAcceptedPriority",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.acceptedPriorityCode = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleEditPurchaseReqItemBuyer = createAsyncThunk(
    "purchase/handleEditPurchaseReqItemBuyer",
    async ({ event, reqItemId }, { dispatch, getState }) => {
        const { currentReqItems } = getState().currentReq;
        const items = [...currentReqItems];
        const itemIndex = items.findIndex(tr => tr.itemId === reqItemId);
        const item = { ...items[itemIndex] };
        item.buyerId = event;
        const allItems = [...items];
        allItems[itemIndex] = item;
        dispatch(RsetCurrentReqItems(allItems));
    }
);
export const handleSelectedPurchaseItem = createAsyncThunk(
    "purchase/handleResetPurchaseReq",
    async ({ e, request }, { dispatch, getState }) => {
        const { selectedPurchaseItems } = getState().purchase;
        var items = [...selectedPurchaseItems];
        if (e.target.checked === true) {
            items.push(request);
        } else if (e.target.checked === false) {
            items = items.filter(item => item.itemId !== e.target.value);
        }
        dispatch(RsetSelectedPurchaseItems(items));
    }
);
export const handleUsersBySupportSupervisorRole = createAsyncThunk(
    "mainHome/handleUsersBySupportSupervisorRole",
    async ({ roles, location, company, exist, dep, task }, { dispatch, getState }) => {
      try {
        const usersByRoleRes = await getToPersonByRole(roles, location, company, exist, dep, task);
        if (usersByRoleRes.data.code === 415) {
          dispatch(RsetUsersBySupportSupervisorOptions(usersByRoleRes.data.list));
        } else {
          errorMessage("اطلاعات یافت نشد!");
          dispatch(RsetUsersBySupportSupervisorOptions([]));
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  );
export const handleAcceptPurchaseItem = createAsyncThunk(
    "purchase/handleAcceptPurchaseItem",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const { usersByRole, user } = getState().mainHome;
            const { selectedPurchaseItems, usersBySupportSupervisor } = getState().purchase;
            var checkedItems = 0;
            selectedPurchaseItems.map(async item => {
                const checkDateRes = await checkItemUpdateDate(item.itemId, item.lastActionId);
                if (checkDateRes.data.type === "accepted") {
                    checkedItems = checkedItems + 1;
                    if (checkedItems === selectedPurchaseItems.length) {
                        var postedActions = 0;
                        selectedPurchaseItems.map(async itemAction => {
                            var itemActionValues = '';
                            if(user.Roles.some(role => role === '37')){
                                itemActionValues = {
                                    actionCode: 26,
                                    userId: localStorage.getItem('id'),
                                    itemId: itemAction.itemId,
                                    toPersons: usersByRole.value,
                                }
                            }else if(user.Roles.some(role => role === '40')){
                                itemActionValues = {
                                    actionCode: 45,
                                    userId: localStorage.getItem('id'),
                                    itemId: itemAction.itemId,
                                    toPersons: usersByRole.value,
                                    nextToPersons: usersBySupportSupervisor.value
                                }
                            }else if(user.Roles.some(role => role === '38')){
                                itemActionValues = {
                                    actionCode: 46,
                                    userId: localStorage.getItem('id'),
                                    itemId: itemAction.itemId,
                                    toPersons: itemAction.nextToPersons
                                }
                            }else if(user.Roles.some(role => role === '41')){
                                itemActionValues = {
                                    actionCode: 27,
                                    userId: localStorage.getItem('id'),
                                    itemId: itemAction.itemId,
                                    toPersons: usersByRole.value,
                                }
                                const updateReqValues = {
                                    userId: localStorage.getItem('id'),
                                    action: 3,
                                    acceptedAmount: item.acceptedAmount !== '' && item.acceptedAmount > 0 && item.acceptedAmount !== null ? item.acceptedAmount : item.itemAmount,
                                    acceptedUnit: item.acceptedUnitCode !== null ? item.acceptedUnitCode.value : item.itemUnitCode,
                                    acceptedPriority: item.acceptedPriorityCode !== null ? item.acceptedPriorityCode.value : item.itemPriorityCode,
                                    buyerId: usersByRole.value
                                }
                                const itemUpdateRes = await editPurchaseReqItem(item.itemId, updateReqValues);
                            }
                            const itemActionRes = await postPurchaseItemAction(itemActionValues);
                            if (itemActionRes.data.code === 415) {
                                postedActions = postedActions + 1;
                                if (postedActions === selectedPurchaseItems.length) {
                                    successMessage('آیتم ها با موفقیت ارسال شدند!');
                                    dispatch(RsetLoading(false));
                                    dispatch(RsetUsersByRole(''));
                                    dispatch(RsetPurchaseSendItemsModal(false));
                                    dispatch(RsetSelectedPurchaseItems([]));
                                    dispatch(RsetPurchaseSendItemsModal(false));
                                    const filterValues = {
                                        memberId: '',
                                        serial: '',
                                        invCode: '',
                                        status: '',
                                        fromDate: 'null',
                                        toDate: 'null',
                                    }
                                    dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                                }
                            }
                        })
                    }
                } else {
                    dispatch(RsetLoading(false));
                    dispatch(RsetUsersByRole(''));
                    dispatch(RsetPurchaseSendItemsModal(false));
                    dispatch(RsetSelectedPurchaseItems([]));
                    dispatch(RsetPurchaseSendItemsModal(false));
                    errorMessage('وضعیت یا اطلاعات آیتم ها تغییر کرده است. لطفا لیست آیتم ها را بروزرسانی کنید!');
                    const filterValues = {
                        memberId: '',
                        serial: '',
                        invCode: '',
                        status: '',
                        fromDate: 'null',
                        toDate: 'null',
                    }
                    dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                }
            })
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);
export const handlePurchaseReqItemSendToBuy = createAsyncThunk(
    "purchase/handlePurchaseReqItemSendToBuy",
    async (item, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const { currentReqInfo, currentReqItem } = getState().currentReq;
            if (item.buyerId !== null) {
                const updateReqValues = {
                    userId: localStorage.getItem('id'),
                    action: 3,
                    acceptedAmount: item.acceptedAmount !== '' && item.acceptedAmount > 0 && item.acceptedAmount !== null ? item.acceptedAmount : item.itemAmount,
                    acceptedPriority: item.acceptedPriorityCode !== null ? item.acceptedPriorityCode.value : item.itemPriorityCode,
                    buyerId: item.buyerId !== null ? item.buyerId.value : undefined,
                }
                const itemUpdateRes = await editPurchaseReqItem(item.itemId, updateReqValues);
                if (itemUpdateRes.data.code === 415) {
                    const itemActionValues = {
                        actionCode: 27,
                        userId: localStorage.getItem('id'),
                        itemId: item.itemId,
                        toPersons: item.buyerId.value,
                    }
                    const itemActionRes = await postPurchaseItemAction(itemActionValues);
                    if (itemActionRes.data.code === 415) {
                        successMessage('درخواست با موفقیت ارسال شد!');
                        dispatch(RsetLoading(false));
                        if (currentReqInfo !== '') {
                            dispatch(handleCurrentReqItems({ reqId: currentReqInfo.requestId, reqType: 9 }));
                        } else {
                            dispatch(RsetPurchaseItemModal(false));
                            const filterValues = {
                                memberId: '',
                                serial: '',
                                invCode: '',
                                status: '',
                                fromDate: 'null',
                                toDate: 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }
                } else {
                    errorMessage('خطا در ارسال آیتم!');
                    dispatch(RsetLoading(false));
                }
            } else {
                errorMessage('مامور خرید مشخص نشده است!');
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);
export const handleResetPurchasedItem = createAsyncThunk(
    "purchase/handleResetPurchaseReq",
    async (obj, { dispatch, getState }) => {
        dispatch(RsetFormErrors({}));
        dispatch(RsetPurchasedItemInvoiceNumber(''));
        dispatch(RsetPurchasedItemStore(''));
        dispatch(RsetPurchasedItemStoreCode(''));
        dispatch(RsetPurchasedItemPrice(''));
        dispatch(RsetPurchasedItemAmount(''));
        dispatch(RsetPurchasedItemUnit(''));
        dispatch(RsetPurchasedItemDiscount(''));
        dispatch(RsetPurchasedItemDate(null));
        dispatch(RsetPurchasedItemFile(''));
    }
);
export const handlePurchasedReqItem = createAsyncThunk(
    "purchase/handlePurchasedReqItem",
    async ({ purchaseValues, files }, { dispatch, getState }) => {
        dispatch(RsetLoading(true));
        try {
            const purchasedItemRes = await purchasedItem(purchaseValues, files);
            if (purchasedItemRes.data.code === 415) {
                dispatch(RsetLoading(false));
                dispatch(handleResetPurchasedItem());
            } else {
                errorMessage('');
                dispatch(RsetLoading(false));
            }
        } catch (ex) {
            console.log(ex);
            dispatch(RsetLoading(false));
        }
    }
);


const purchaseSlice = createSlice({
    name: "purchase",
    initialState,
    reducers: {
        RsetPurchaseReqProcurement: (state, { payload }) => {
            return { ...state, purchaseReqProcurement: payload };
        },
        RsetPurchaseReqDescription: (state, { payload }) => {
            return { ...state, purchaseReqDescription: payload };
        },
        RsetPurchaseReqItemPlaceOfUse: (state, { payload }) => {
            return { ...state, purchaseReqItemPlaceOfUse: payload };
        },
        RsetPurchaseReqItemAmount: (state, { payload }) => {
            return { ...state, purchaseReqItemAmount: payload };
        },
        RsetPurchaseReqItemPriority: (state, { payload }) => {
            return { ...state, purchaseReqItemPriority: payload };
        },
        RsetPurchaseReqItemUnit: (state, { payload }) => {
            return { ...state, purchaseReqItemUnit: payload };
        },
        RsetPurchaseReqItemTechInfo: (state, { payload }) => {
            return { ...state, purchaseReqItemTechInfo: payload };
        },
        RsetPurchaseReqItemMapCode: (state, { payload }) => {
            return { ...state, purchaseReqItemMapCode: payload };
        },
        RsetPurchaseReqItemProjectCode: (state, { payload }) => {
            return { ...state, purchaseReqItemProjectCode: payload };
        },
        RsetPurchaseReqItemId: (state, { payload }) => {
            return { ...state, purchaseReqItemId: payload };
        },
        RsetPurchaseDeletedReqItems: (state, { payload }) => {
            return { ...state, purchaseDeletedReqItems: payload };
        },
        RsetPurchaseItemModal: (state, { payload }) => {
            return { ...state, purchaseItemModal: payload };
        },


        RsetSelectedPurchaseItems: (state, { payload }) => {
            return { ...state, selectedPurchaseItems: payload };
        },
        RsetPurchaseSendItemsModal: (state, { payload }) => {
            return { ...state, purchaseSendItemsModal: payload };
        },
        RsetUsersBySupportSupervisor: (state, { payload }) => {
            return { ...state, usersBySupportSupervisor: payload };
        },
        RsetUsersBySupportSupervisorOptions: (state, { payload }) => {
            return { ...state, usersBySupportSupervisorOptions: payload };
        },


        RsetPurchasedItemModal: (state, { payload }) => {
            return { ...state, purchasedItemModal: payload };
        },
        RsetPurchasedItemInvoiceNumber: (state, { payload }) => {
            return { ...state, purchasedItemInvoiceNumber: payload };
        },
        RsetPurchasedItemStore: (state, { payload }) => {
            return { ...state, purchasedItemStore: payload };
        },
        RsetPurchasedItemStoreCode: (state, { payload }) => {
            return { ...state, purchasedItemStoreCode: payload };
        },
        RsetPurchasedItemPrice: (state, { payload }) => {
            return { ...state, purchasedItemPrice: payload };
        },
        RsetPurchasedItemAmount: (state, { payload }) => {
            return { ...state, purchasedItemAmount: payload };
        },
        RsetPurchasedItemUnit: (state, { payload }) => {
            return { ...state, purchasedItemUnit: payload };
        },
        RsetPurchasedItemDiscount: (state, { payload }) => {
            return { ...state, purchasedItemDiscount: payload };
        },
        RsetPurchasedItemDate: (state, { payload }) => {
            return { ...state, purchasedItemDate: payload };
        },
        RsetPurchasedItemFile: (state, { payload }) => {
            return { ...state, purchasedItemFile: payload };
        },
    },
});

export const {
    RsetPurchaseReqProcurement,
    RsetPurchaseReqDescription,
    RsetPurchaseReqItemAmount,
    RsetPurchaseReqItemPriority,
    RsetPurchaseReqItemUnit,
    RsetPurchaseReqItemTechInfo,
    RsetPurchaseReqItemPlaceOfUse,
    RsetPurchaseReqItemMapCode,
    RsetPurchaseReqItemProjectCode,
    RsetPurchaseReqItemId,
    RsetPurchaseDeletedReqItems,
    RsetPurchaseItemModal,

    RsetSelectedPurchaseItems,
    RsetPurchaseSendItemsModal,
    RsetUsersBySupportSupervisor,
    RsetUsersBySupportSupervisorOptions,

    RsetPurchasedItemModal,
    RsetPurchasedItemInvoiceNumber,
    RsetPurchasedItemStore,
    RsetPurchasedItemStoreCode,
    RsetPurchasedItemPrice,
    RsetPurchasedItemAmount,
    RsetPurchasedItemUnit,
    RsetPurchasedItemDiscount,
    RsetPurchasedItemDate,
    RsetPurchasedItemFile
} = purchaseSlice.actions;

export const selectPurchaseReqProcurement = (state) => state.purchase.purchaseReqProcurement;
export const selectPurchaseReqDescription = (state) => state.purchase.purchaseReqDescription;
export const selectPurchaseReqItemAmount = (state) => state.purchase.purchaseReqItemAmount;
export const selectPurchaseReqItemPriority = (state) => state.purchase.purchaseReqItemPriority;
export const selectPurchaseReqItemUnit = (state) => state.purchase.purchaseReqItemUnit;
export const selectPurchaseReqItemTechInfo = (state) => state.purchase.purchaseReqItemTechInfo;
export const selectPurchaseReqItemPlaceOfUse = (state) => state.purchase.purchaseReqItemPlaceOfUse;
export const selectPurchaseReqItemMapCode = (state) => state.purchase.purchaseReqItemMapCode;
export const selectPurchaseReqItemProjectCode = (state) => state.purchase.purchaseReqItemProjectCode;
export const selectPurchaseReqItemId = (state) => state.purchase.purchaseReqItemId;
export const selectPurchaseItemModal = (state) => state.purchase.purchaseItemModal;

export const selectSelectedPurchaseItems = (state) => state.purchase.selectedPurchaseItems;
export const selectPurchaseSendItemsModal = (state) => state.purchase.purchaseSendItemsModal;
export const selectUsersBySupportSupervisor = (state) => state.purchase.usersBySupportSupervisor;
export const selectUsersBySupportSupervisorOptions = (state) => state.purchase.usersBySupportSupervisorOptions;

export const selectPurchasedItemModal = (state) => state.purchase.purchasedItemModal;
export const selectPurchasedItemInvoiceNumber = (state) => state.purchase.purchasedItemInvoiceNumber;
export const selectPurchasedItemStore = (state) => state.purchase.purchasedItemStore;
export const selectPurchasedItemStoreCode = (state) => state.purchase.purchasedItemStoreCode;
export const selectPurchasedItemPrice = (state) => state.purchase.purchasedItemPrice;
export const selectPurchasedItemAmount = (state) => state.purchase.purchasedItemAmount;
export const selectPurchasedItemUnit = (state) => state.purchase.purchasedItemUnit;
export const selectPurchasedItemDiscount = (state) => state.purchase.purchasedItemDiscount;
export const selectPurchasedItemDate = (state) => state.purchase.purchasedItemDate;
export const selectPurchasedItemFile = (state) => state.purchase.purchasedItemFile;

export default purchaseSlice.reducer;