import http from "./httpService";
import config from "./config.json";

// newRequest
export const upSupervisors = (company, location) => {
    return http.get(`${config.localapi}/user/anbarToPerson/` + company + "/" + location,{timeout: 30000})
}
export const postWarehouseReq = ReqValues => {
    return http.post(`${config.localapi}/inventory`, ReqValues,{timeout: 30000})
}
export const getWarehouseReqItems= reqId => {
    return http.get(`${config.localapi}/inventory/item/` + reqId,{timeout: 30000})
}
export const postDeliveryForReqItem= (itemId, deliveryValues) => {
    return http.post(`${config.localapi}/inventory/item/delivery/` + itemId, deliveryValues,{timeout: 30000})
}
export const getReqId = reqId => {
    return http.get(`${config.localapi}/anbarReq/` + reqId,{timeout: 30000})
}
export const postAction = ActionValues => {
    return http.post(`${config.localapi}/action`, ActionValues,{timeout: 30000})
}
export const postWarehouseReqItems = reqItems => {
    return http.post(`${config.localapi}/inventory/item`, reqItems,{timeout: 30000})
}
export const getReqItemId = reqItemId => {
    return http.get(`${config.localapi}/anbarItem/` + reqItemId,{timeout: 30000})
}
export const postReqItemLink = ReqItemLink => {
    return http.post(`${config.localapi}/buy-item-link/`, ReqItemLink,{timeout: 30000})
}
export const deleteReqItemLink = reqItemId => {
    return http.delete(`${config.localapi}/anbar-item-link/` + reqItemId,{timeout: 30000})
}
export const postReqItemImage = ReqItemImage => {
    return http.post(`${config.localapi}/buy-item-file`, ReqItemImage,{timeout: 30000})
}
export const deleteReqItemImage = reqItemId => {
    return http.delete(`${config.localapi}/anbar-item-file/` + reqItemId,{timeout: 30000})
}
export const setUserSupervisor = (userId, supervisorId) => {
    return http.patch(`${config.localapi}/user/supervisor/` + userId, { supervisor_id: supervisorId },{timeout: 30000})
}
export const getNewRequests = () => {
    return http.get(`${config.localapi}/anbarReq/ntseen/` + localStorage.getItem('id'),{timeout: 30000})
}
export const getReqItems = (requestId) => {
    return http.get(`${config.localapi}/anbarReq/check/` + requestId,{timeout: 30000})
}
export const checkAccOrRejRequest = (requestId, userId) => {
    return http.get(`${config.localapi}/anbarAction/RejOrAccCheck/` + requestId + '/' + userId,{timeout: 30000})
}
export const acceptRequest = (acceptReqValues) => {
    return http.post(`${config.localapi}/anbarAction`, acceptReqValues,{timeout: 30000})
}
export const getWarehouses = (companyCode) => {
    return http.get(`${config.localapi}/inventory`, {companyCode: companyCode},{timeout: 30000})
}
export const editWarehouseItem = (itemId, patchItemValues) => {
    return http.patch(`${config.localapi}/inventory/item/` + itemId , patchItemValues,{timeout: 30000})
}
export const getItemReceivedDetails = (itemId) => {
    return http.get(`${config.localapi}/inventory/item/receivedDetail/` + itemId ,{timeout: 30000})
}

export const visited = (requestId, visitedEdit) => {
    return http.patch(`${config.localapi}/anbarReq/visitedEdit/` + requestId, visitedEdit,{timeout: 30000})
}
export const updateDeadLinePriority = (requestId, editDP) => {
    return http.patch(`${config.localapi}/anbarReq/p&d:Edit/` + requestId, editDP,{timeout: 30000})
}
export const cancelRequest = (cancelReqValues) => {
    return http.post(`${config.localapi}/anbarAction`, cancelReqValues,{timeout: 30000})
}
export const updateRequest = (itemId, updateReqValues) => {
    return http.patch(`${config.localapi}/anbarItem/` + itemId, updateReqValues,{timeout: 30000})
}
export const checkEditRequest = (requestId, userId) => {
    return http.get(`${config.localapi}/anbarAction/EditCheck/` + requestId + '/' + userId,{timeout: 30000})
}
export const deletedReqItem = (itemId) => {
    return http.delete(`${config.localapi}/anbarItem/` + itemId,{timeout: 30000})
}

// itemLinks
export const getReqItemLinks = itemId => {
    return http.get(`${config.localapi}/anbar-item-link/` + itemId,{timeout: 30000});
}
//itemImages
export const getReqItemImages = itemId => {
    return http.get(`${config.localapi}/anbar-item-file/` + itemId,{timeout: 30000});
}
// itemComments
export const getReqItemComments = actionId => {
    return http.get(`${config.localapi}/anbarAction/findComments/` + actionId,{timeout: 30000});
}





export const getReqHistory = serial => {
    return http.get(`${config.localapi}/anbarAction/findComments/` + serial, { params: { id: localStorage.getItem('id') } },{timeout: 30000})
}

// new purchase request
export const postPurchaseReq = (purchaseReqValues) => {
    return http.post(`${config.localapi}/buyReq`, purchaseReqValues,{timeout: 30000})
}
// new purchase request item
export const postPurchaseReqItems = (purchaseReqItemValues) => {
    return http.post(`${config.localapi}/buyReq/item`, purchaseReqItemValues,{timeout: 30000})
}
export const editPurchaseReqItem = (itemId, patchItemValues) => {
    return http.patch(`${config.localapi}/buyReq/item/` + itemId , patchItemValues,{timeout: 30000})
}
export const purchasedItem = (purchaseValues, files) => {
    return http.post(`${config.localapi}/buyReq/item/purchaseHis`, files, {params: purchaseValues},{timeout: 30000})
}
export const postPurchaseItemAction = (actionValues) => {
    return http.post(`${config.localapi}/buyReq/item/action`, actionValues,{timeout: 30000})
}
// purchase list
export const getPurchaseList = (filterParams) => {
    return http.get(`${config.localapi}/buyReq/filter`, { params: filterParams },{timeout: 30000})
}