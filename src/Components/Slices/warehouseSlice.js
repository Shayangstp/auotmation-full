import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "../../utils/message";
import {
  RsetFormErrors,
  RsetCompanyNames,
  handleReqsList,
  RsetLoading,
  RsetUsersByRole,
} from "./mainSlices";
import {
  postAction,
  getCoUsers,
  getToPersonByRole,
} from "../../Services/rootServices";
import {
  postWarehouseReq,
  postWarehouseReqItems,
  getWarehouseReqItems,
  editWarehouseItem,
  postDeliveryForReqItem,
  sendToWarehousePermission,
} from "../../Services/warehouseReqService";
import {
  RsetCurrentReqItems,
  RsetCurrentReqInfo,
  RsetCurrentReqToPerson,
  RsetCurrentReqItem,
} from "./currentReqSlice";
import { RsetDeleteReqItemModal, RsetEditReqModal } from "./modalsSlice";

const initialState = {
  warehouseReqMyRequest: true,
  warehouseReqApplicantFName: "",
  warehouseReqApplicantLName: "",
  warehouseReqSupervisor: "",
  warehouseReqIsProject: false,
  warehouseReqProjectCode: "",
  warehouseReqItemName: "",
  warehouseReqItemAmount: "",
  warehouseReqItemUnit: { label: "عدد", value: 82 },
  warehouseReqItemMainPlace: "",
  warehouseReqItemSubPlace: "",
  warehouseReqItemRattletrap: true,
  warehouseReqItemConsumable: true,
  warehouseReqItemBorrowed: true,
  warehouseReqItemDescription: "",
  warehouseReqDescription: "",
  warehouseReqItemId: "",
  warehouseDeletedReqItems: [],
  sendDirectlyToWarehouse: false,
  //
  warehouseReqFilterActions: true,
};

export const handleSendToWarehousePermission = createAsyncThunk(
  "warehouse/handleSendToWarehousePermission",
  async (obj, { dispatch, getState }) => {
    try {
      const permission = await sendToWarehousePermission(2);
      if (permission.data.code === 415 && permission.data.acception === true) {
        dispatch(RsetSendDirectlyToWarehouse(permission.data.acception));
      } else {
        dispatch(RsetSendDirectlyToWarehouse(false));
      }
    } catch (ex) {
      console.log(ex);
    }
  }
);

export const handleResetWarehouseReqItem = createAsyncThunk(
  "warehouse/handleResetWarehouseReqItem",
  async (obj, { dispatch, getState }) => {
    dispatch(RsetWarehouseReqItemName(""));
    dispatch(RsetWarehouseReqItemAmount(""));
    dispatch(RsetWarehouseReqItemUnit({ label: "عدد", value: 82 }));
    dispatch(RsetWarehouseReqItemMainPlace(""));
    dispatch(RsetWarehouseReqItemSubPlace(""));
    dispatch(RsetWarehouseReqItemDescription(""));
  }
);
export const handleResetWarehouseReq = createAsyncThunk(
  "warehouse/handleResetWarehouseReq",
  async (obj, { dispatch, getState }) => {
    dispatch(RsetFormErrors({}));
    dispatch(handleResetWarehouseReqItem());
    dispatch(RsetWarehouseReqIsProject(false));
    dispatch(RsetWarehouseReqProjectCode(""));
    dispatch(RsetWarehouseReqDescription(""));
    dispatch(RsetCurrentReqItems([]));
    dispatch(RsetWarehouseReqMyRequest(true));
    dispatch(RsetWarehouseReqApplicantFName(""));
    dispatch(RsetWarehouseReqApplicantLName(""));
    dispatch(RsetUsersByRole(""));
    // setClearReq(false);
  }
);
export const handleAddNewWarehouseReqItem = createAsyncThunk(
  "warehouse/handleAddNewWarehouseReqItem",
  async (obj, { dispatch, getState }) => {
    const {
      warehouseReqItemName,
      warehouseReqItemAmount,
      warehouseReqItemUnit,
      warehouseReqItemMainPlace,
      warehouseReqItemSubPlace,
      warehouseReqItemDescription,
    } = getState().warehouse;
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const newItem = {
      itemId: Math.floor(Math.random() * 1000),
      itemName: warehouseReqItemName,
      itemAmount: warehouseReqItemAmount,
      itemUnit: warehouseReqItemUnit,
      itemMainPlace: warehouseReqItemMainPlace,
      itemSubPlace: warehouseReqItemSubPlace,
      itemDescription: warehouseReqItemDescription,
    };
    items.push(newItem);
    const result = items.reduce((acc, item) => {
      const itemInAcc = acc.find(
        (itemAcc) => itemAcc.itemName === item.itemName
      );
      if (itemInAcc !== undefined) {
        warningMessage("این آیتم تکراری می باشد.");
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
      dispatch(handleResetWarehouseReqItem());
    }
  }
);
export const handleDeleteWarehouseReqItem = createAsyncThunk(
  "warehouse/handleDeleteWarehouseReqItem",
  async (reqItemId, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const { warehouseDeletedReqItems } = getState().warehouse;
    const items = [...currentReqItems];
    if (items.length > 1) {
      const filteredItems = items.filter((tr) => tr.itemId !== reqItemId);
      dispatch(RsetCurrentReqItems(filteredItems));
      dispatch(RsetDeleteReqItemModal(false));
      const deletedItems = [...warehouseDeletedReqItems];
      deletedItems.push(reqItemId);
      dispatch(RsetWarehouseDeletedReqItems(deletedItems));
    } else {
      errorMessage("وجود حداقل یک آیتم ضروری است!");
      dispatch(RsetDeleteReqItemModal(false));
    }
  }
);
export const handleEditWarehouseReqItemName = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemName",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.itemName = event.target.value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemAmount = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemAmount",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.itemAmount = event.target.value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemUnit = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemUnit",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.itemUnit = event;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemMainPlace = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemMainPlace",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.itemMainPlace = event.target.value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemSubPlace = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemSubPlace",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.itemSubPlace = event.target.value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemDescription = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemDescription",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    var item = { ...items[itemIndex] };
    item.itemDescription = event.target.value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleSubmitNewWarehouseReq = createAsyncThunk(
  "warehouse/handleSubmitNewWarehouseReq",
  async (reqType, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    try {
      const { user, usersByRole, sendOptions } = getState().mainHome;
      if (sendOptions === "2" && usersByRole === "") {
        errorMessage("برای ثبت درخواست ابتدا شخص دریافت کننده را مشخص کنید!");
      } else {
        const { currentReqItems } = getState().currentReq;
        const {
          warehouseReqMyRequest,
          warehouseReqApplicantFName,
          warehouseReqApplicantLName,
          warehouseReqSupervisor,
          warehouseReqDescription,
          warehouseReqIsProject,
          warehouseReqProjectCode,
        } = getState().warehouse;
        if (currentReqItems.length !== 0) {
          const warehouseReqValues = {
            applicantName: warehouseReqMyRequest
              ? undefined
              : warehouseReqApplicantFName,
            applicantLname: warehouseReqMyRequest
              ? undefined
              : warehouseReqApplicantLName,
            // project 1 , not 0
            forProject: warehouseReqIsProject ? 1 : 0,
            projectCode:
              warehouseReqProjectCode !== ""
                ? warehouseReqProjectCode
                : undefined,
            description:
              warehouseReqDescription !== ""
                ? warehouseReqDescription
                : undefined,
          };
          const warehouseReqValuesRes = await postWarehouseReq(
            warehouseReqValues
          );
          if (warehouseReqValuesRes.data.code === 415) {
            var warehouseSavedItems = 0;
            currentReqItems.map(async (value, index) => {
              const ItemsValue = {
                requestId: warehouseReqValuesRes.data.id,
                row: index + 1,
                itemName: value.itemName,
                itemAmount: value.itemAmount,
                itemUnit:
                  value.itemUnit.value !== undefined
                    ? value.itemUnit.value
                    : "",
                mainPlace: value.itemMainPlace,
                subPlace:
                  value.itemSubPlace === ""
                    ? value.itemMainPlace
                    : value.itemSubPlace,
                comment:
                  value.itemDescription !== ""
                    ? value.itemDescription
                    : undefined,
                userId: localStorage.getItem("id"),
              };
              const reqItemRes = await postWarehouseReqItems(ItemsValue);
              if (reqItemRes.data.code === 415) {
                warehouseSavedItems = warehouseSavedItems + 1;
                if (currentReqItems.length === warehouseSavedItems) {
                  var toPersons = "";
                  if (sendOptions === "1") {
                    const actionValues = {
                      actionId: warehouseReqValuesRes.data.id,
                      actionCode: 0,
                      userId: localStorage.getItem("id"),
                      toPersons: user.Supervisor._id,
                      typeId: 2,
                    };
                    const postActionRes = await postAction(actionValues);
                    if (postActionRes.data.code === 415) {
                      dispatch(RsetLoading(false));
                      dispatch(handleResetWarehouseReq());
                      successMessage(
                        "درخواست با موفقیت ثبت و در کارتابل سرپرست قرار گرفت!!"
                      );
                    }
                  } else if (sendOptions === "2" && usersByRole !== "") {
                    const actionValues = {
                      actionId: warehouseReqValuesRes.data.id,
                      actionCode: 0,
                      userId: localStorage.getItem("id"),
                      toPersons: usersByRole.value,
                      typeId: 2,
                    };
                    const postActionRes = await postAction(actionValues);
                    if (postActionRes.data.code === 415) {
                      dispatch(RsetLoading(false));
                      dispatch(handleResetWarehouseReq());
                      successMessage(
                        "درخواست با موفقیت ثبت و در کارتابل شخص انتخاب شده قرار گرفت!!"
                      );
                    }
                  } else if (sendOptions === "3") {
                    const actionValues = {
                      actionId: warehouseReqValuesRes.data.id,
                      actionCode: 0,
                      userId: localStorage.getItem("id"),
                      typeId: 2,
                    };
                    const postActionRes = await postAction(actionValues);
                    if (postActionRes.data.code === 415) {
                      const persons = await getToPersonByRole(
                        "3, 36",
                        user.Location,
                        user.CompanyCode,
                        1,
                        null,
                        "0"
                      );
                      if (persons.data.code === 415) {
                        if (persons.data.list.length > 0) {
                          var toPersonsArr = [];
                          persons.data.list.map(async (person) => {
                            toPersonsArr.push(person.value);
                          });
                          toPersons = String(toPersonsArr);
                        } else {
                          toPersons = "";
                          errorMessage("شخص دریافت کننده ای یافت نشد!");
                        }
                      } else {
                        toPersons = "";
                        errorMessage("شخص دریافت کننده ای یافت نشد!");
                      }
                      if (toPersons !== "") {
                        const actionValues = {
                          actionId: warehouseReqValuesRes.data.id,
                          actionCode: 6,
                          userId: localStorage.getItem("id"),
                          toPersons: toPersons,
                          typeId: 2,
                        };
                        const postActionRes = await postAction(actionValues);
                        if (postActionRes.data.code === 415) {
                          dispatch(RsetLoading(false));
                          dispatch(handleResetWarehouseReq());
                          successMessage(
                            "درخواست با موفقیت ثبت و در کارتابل انبار قرار گرفت!!"
                          );
                        } else {
                          errorMessage("خطا در ارسال درخواست!");
                        }
                      } else {
                        errorMessage("خطا در ارسال درخواست!");
                      }
                    }
                  }
                }
              } else {
                errorMessage("خطا در ثبت آیتم درخواست!");
              }
            });
          } else {
            errorMessage("خطا در ثبت درخواست!");
          }
        } else {
          errorMessage("واردکردن حداقل یک آیتم الزامی است!");
        }
      }
    } catch (ex) {
      dispatch(RsetLoading(false));
      console.log(ex);
    }
  }
);
export const handleGetWarehouseReqItems = createAsyncThunk(
  "warehouse/handleGetWarehouseReqItems",
  async (reqId, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    try {
      const warehouseReqItems = await getWarehouseReqItems(reqId);
      if (warehouseReqItems.data.code === 415) {
        dispatch(RsetCurrentReqItems(warehouseReqItems.data.list));
        dispatch(RsetLoading(false));
      } else {
        dispatch(RsetLoading(false));
        errorMessage("خطا در دریافت آیتم های درخواست!");
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);
export const handleEditWarehouseReqItems = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItems",
  async (reqId, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    try {
      const { currentReqItems, currentReqInfo } = getState().currentReq;
      const { warehouseDeletedReqItems } = getState().warehouse;
      const items = [...currentReqItems];
      const result = items.reduce((acc, item) => {
        const itemInAcc = acc.find(
          (itemAcc) => itemAcc.itemName === item.itemName
        );
        if (itemInAcc !== undefined) {
          warningMessage("آیتم " + itemInAcc.itemName + " تکراری می باشد.");
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      if (currentReqItems.length === result.length) {
        const sendEditedData = async () => {
          currentReqItems.map(async (value, index) => {
            if (value.itemName === "") {
              errorMessage("نام نمیتواند خالی باشد!");
            } else if (value.itemAmount === "" || value.itemAmount <= 0) {
              errorMessage("تعداد نمی تواند خالی یا برابر صفر باشد!");
            } else {
              const updateReqValues = {
                row: index + 1,
                itemName: value.itemName,
                itemAmount: value.itemAmount,
                itemUnit:
                  value.itemUnit.value !== undefined
                    ? value.itemUnit.value
                    : value.itemUnitCode,
                mainPlace: value.itemMainPlace,
                subPlace:
                  value.itemSubPlace === null
                    ? value.itemMainPlace
                    : value.itemSubPlace,
                comment:
                  value.itemDescription !== null
                    ? value.itemDescription
                    : undefined,
                action: 3,
                userId: localStorage.getItem("id"),
              };
              const itemUpdateRes = await editWarehouseItem(
                value.itemId,
                updateReqValues
              );
            }
          });
          if (warehouseDeletedReqItems.length !== 0) {
            warehouseDeletedReqItems.map(async (itemId) => {
              const updateReqValues = {
                action: 2,
                userId: localStorage.getItem("id"),
              };
              const deletedReqItemRes = await editWarehouseItem(
                itemId,
                updateReqValues
              );
            });
          }
          currentReqItems.map(async (value, index) => {
            if (value.itemId.length === undefined) {
              const ItemsValue = {
                requestId: currentReqInfo.requestId,
                row: index + 1,
                itemName: value.itemName,
                itemAmount: value.itemAmount,
                itemUnit:
                  value.itemUnit.value !== undefined
                    ? value.itemUnit.value
                    : "",
                mainPlace: value.itemMainPlace,
                subPlace:
                  value.itemSubPlace === ""
                    ? value.itemMainPlace
                    : value.itemSubPlace,
                comment:
                  value.itemDescription !== ""
                    ? value.itemDescription
                    : undefined,
                userId: localStorage.getItem("id"),
              };
              const reqItems = await postWarehouseReqItems(ItemsValue);
            }
          });
        };

        const sendAction = async () => {
          const ActionValues = {
            actionId: currentReqInfo.requestId,
            actionCode: 10000,
            userId: localStorage.getItem("id"),
            typeId: 2,
          };
          const postActionRes = await postAction(ActionValues);
          if (postActionRes.data.code === 415) {
            const filterValues = {
              applicantId: localStorage.getItem("id"),
              memberId: "",
              mDep: "",
              status: "",
              fromDate: "null",
              toDate: "null",
              type: 2,
            };
            dispatch(handleReqsList(filterValues));
            successMessage("درخواست موردنظر با موفقیت ویرایش شد!");
            dispatch(RsetEditReqModal(false));
            dispatch(RsetCurrentReqItems([]));
          }
        };
        const sendData = async () => {
          await sendEditedData();
          await sendAction();
        };
        sendData();
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);
export const handleEditWarehouseReqItemInvCode = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemInvCode",
  async ({ value, itemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === itemId);
    var item = { ...items[itemIndex] };
    item.invCode = value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
    dispatch(RsetCurrentReqItem(item));
  }
);
export const handleEditWarehouseReqItemInvName = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemInvName",
  async ({ value, itemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === itemId);
    var item = { ...items[itemIndex] };
    item.invName = value;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemRattletrap = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemRattletrap",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.rattletrap = event;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemConsumable = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemConsumable",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.consumable = event;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemBorrowed = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemBorrowed",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.borrowed = event;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
export const handleEditWarehouseReqItemManagerComment = createAsyncThunk(
  "warehouse/handleEditWarehouseReqItemManagerComment",
  async ({ event, reqItemId }, { dispatch, getState }) => {
    const { currentReqItems } = getState().currentReq;
    const items = [...currentReqItems];
    const itemIndex = items.findIndex((tr) => tr.itemId === reqItemId);
    const item = { ...items[itemIndex] };
    item.managerComment = event;
    const allItems = [...items];
    allItems[itemIndex] = item;
    dispatch(RsetCurrentReqItems(allItems));
  }
);
// daghi 1, not 0
// rattletrap: value.itemRattletrap,
// // masrafi 1/ not 0
// consumable: value.itemConsumable,
// // amani 1, not 0
// borrowed: value.itemBorrowed
export const handleDeliveryForReqItem = createAsyncThunk(
  "warehouse/handleDeliveryForReqItem",
  async ({ itemId, deliveryValues }, { dispatch, getState }) => {
    dispatch(RsetLoading(true));
    try {
      const { currentReqInfo } = getState().currentReq;
      const deliveryRes = await postDeliveryForReqItem(itemId, deliveryValues);
      if (deliveryRes.data.code === 415) {
        dispatch(RsetLoading(false));
        dispatch(handleGetWarehouseReqItems(currentReqInfo.requestId));
      } else {
        dispatch(RsetLoading(false));
        errorMessage("خطا در ذخیره اطلاعات تحویل!");
      }
    } catch (ex) {
      console.log(ex);
      dispatch(RsetLoading(false));
    }
  }
);
const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    RsetWarehouseReqMyRequest: (state, { payload }) => {
      return { ...state, warehouseReqMyRequest: payload };
    },
    RsetWarehouseReqApplicantFName: (state, { payload }) => {
      return { ...state, warehouseReqApplicantFName: payload };
    },
    RsetWarehouseReqApplicantLName: (state, { payload }) => {
      return { ...state, warehouseReqApplicantLName: payload };
    },
    RsetWarehouseReqSupervisor: (state, { payload }) => {
      return { ...state, warehouseReqSupervisor: payload };
    },
    RsetWarehouseReqIsProject: (state, { payload }) => {
      return { ...state, warehouseReqIsProject: payload };
    },
    RsetWarehouseReqProjectCode: (state, { payload }) => {
      return { ...state, warehouseReqProjectCode: payload };
    },
    RsetWarehouseReqItemName: (state, { payload }) => {
      return { ...state, warehouseReqItemName: payload };
    },
    RsetWarehouseReqItemAmount: (state, { payload }) => {
      return { ...state, warehouseReqItemAmount: payload };
    },
    RsetWarehouseReqItemUnit: (state, { payload }) => {
      return { ...state, warehouseReqItemUnit: payload };
    },
    RsetWarehouseReqItemMainPlace: (state, { payload }) => {
      return { ...state, warehouseReqItemMainPlace: payload };
    },
    RsetWarehouseReqItemSubPlace: (state, { payload }) => {
      return { ...state, warehouseReqItemSubPlace: payload };
    },
    RsetWarehouseReqItemRattletrap: (state, { payload }) => {
      return { ...state, warehouseReqItemRattletrap: payload };
    },
    RsetWarehouseReqItemConsumable: (state, { payload }) => {
      return { ...state, warehouseReqItemConsumable: payload };
    },
    RsetWarehouseReqItemBorrowed: (state, { payload }) => {
      return { ...state, warehouseReqItemBorrowed: payload };
    },
    RsetWarehouseReqItemDescription: (state, { payload }) => {
      return { ...state, warehouseReqItemDescription: payload };
    },
    RsetWarehouseReqDescription: (state, { payload }) => {
      return { ...state, warehouseReqDescription: payload };
    },
    RsetWarehouseReqItemId: (state, { payload }) => {
      return { ...state, warehouseReqItemId: payload };
    },
    RsetWarehouseDeletedReqItems: (state, { payload }) => {
      return { ...state, warehouseDeletedReqItems: payload };
    },
    RsetSendDirectlyToWarehouse: (state, { payload }) => {
      return { ...state, sendDirectlyToWarehouse: payload };
    },

    //
    RsetWarehouseReqfilterActions: (state, { payload }) => {
      return { ...state, warehouseReqFilterActions: payload };
    },
  },
});

export const {
  RsetWarehouseReqMyRequest,
  RsetWarehouseReqApplicantFName,
  RsetWarehouseReqApplicantLName,
  RsetWarehouseReqSupervisor,
  RsetWarehouseReqIsProject,
  RsetWarehouseReqProjectCode,
  RsetWarehouseReqItemName,
  RsetWarehouseReqItemAmount,
  RsetWarehouseReqItemUnit,
  RsetWarehouseReqItemMainPlace,
  RsetWarehouseReqItemSubPlace,
  RsetWarehouseReqItemRattletrap,
  RsetWarehouseReqItemConsumable,
  RsetWarehouseReqItemBorrowed,
  RsetWarehouseReqItemDescription,
  RsetWarehouseReqDescription,
  RsetWarehouseReqItemId,
  RsetWarehouseDeletedReqItems,
  RsetSendDirectlyToWarehouse,
  //
  RsetWarehouseReqfilterActions,
} = warehouseSlice.actions;

export const selectWarehouseReqMyRequest = (state) =>
  state.warehouse.warehouseReqMyRequest;
export const selectWarehouseReqApplicantFName = (state) =>
  state.warehouse.warehouseReqApplicantFName;
export const selectWarehouseReqApplicantLName = (state) =>
  state.warehouse.warehouseReqApplicantLName;
export const selectWarehouseReqSupervisor = (state) =>
  state.warehouse.warehouseReqSupervisor;
export const selectWarehouseReqIsProject = (state) =>
  state.warehouse.warehouseReqIsProject;
export const selectWarehouseReqProjectCode = (state) =>
  state.warehouse.warehouseReqProjectCode;
export const selectWarehouseReqItemName = (state) =>
  state.warehouse.warehouseReqItemName;
export const selectWarehouseReqItemAmount = (state) =>
  state.warehouse.warehouseReqItemAmount;
export const selectWarehouseReqItemUnit = (state) =>
  state.warehouse.warehouseReqItemUnit;
export const selectWarehouseReqItemMainPlace = (state) =>
  state.warehouse.warehouseReqItemMainPlace;
export const selectWarehouseReqItemSubPlace = (state) =>
  state.warehouse.warehouseReqItemSubPlace;
export const selectWarehouseReqItemRattletrap = (state) =>
  state.warehouse.warehouseReqItemRattletrap;
export const selectWarehouseReqItemConsumable = (state) =>
  state.warehouse.warehouseReqItemConsumable;
export const selectWarehouseReqItemBorrowed = (state) =>
  state.warehouse.warehouseReqItemBorrowed;
export const selectWarehouseReqItemDescription = (state) =>
  state.warehouse.warehouseReqItemDescription;
export const selectWarehouseReqDescription = (state) =>
  state.warehouse.warehouseReqDescription;
export const selectWarehouseReqItems = (state) =>
  state.warehouse.warehouseReqItems;
export const selectWarehouseReqItemId = (state) =>
  state.warehouse.warehouseReqItemId;
export const selectWarehouseDeletedReqItems = (state) =>
  state.warehouse.warehouseDeletedReqItems;
export const selectSendDirectlyToWarehouse = (state) =>
  state.warehouse.sendDirectlyToWarehouse;
//
export const selectWarehouseReqFilterActions = (state) =>
  state.warehouse.warehouseReqFilterActions;

export default warehouseSlice.reducer;
