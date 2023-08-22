// import { getRequest, getNewRequests, getToPersonId, acceptRequest, cancelRequest, updateRequest, deletedReqItem, postReqItems, getReqItemId,
//      postAction, postProjectControlValues} from "../../Services/jobReqService";
// import { successMessage, errorMessage } from "../../utils/message";
// import {checkReqUpdateDate} from '../../Services/rootServices';

// export const handleAcceptRequest = (setAcceptReqComment, setAcceptRequestModal, allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter, fromDateFilter, toDateFilter,
//      setCurrentRequestItems) => {
//     return async (dispatch, getState) => {
//         const requests = [...getState().requests];
//         try{
//             const {data} = await getRequest(allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter, fromDateFilter, toDateFilter);
//             await dispatch({ type: "INIT", data: data });
//             successMessage('درخواست موردنظر با موفقیت تایید شد!');
//             setAcceptReqComment('');
//             setAcceptRequestModal(false);
//             setCurrentRequestItems([]);
//             if(window.location.pathname !== '/RequestsList'){
//                 window.location.href='/RequestsList';
//             }
//         }catch (ex) {
//             await dispatch({ type: "ACCEPT_REQUEST", data: [...requests] });
//         }
//     }
// }

// export const handleCancelRequest = (cancelReqValues, setCancelReqComment, setCancelRequestModal, allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter,
//      fromDateFilter, toDateFilter, setUpdateReqValuesModal,
//      setCurrentRequestItems, currentRequest) => {
//     return async (dispatch, getState) => {
//         const requests = [...getState().requests];
//         var index = currentRequest.process.length-1;
//         try{
//             const {data} = await checkReqUpdateDate(currentRequest.reqInfo._id, currentRequest.process[index]._id, currentRequest.process[index].type);
//             if(data.type === "accepted"){
//                 const { status } = await cancelRequest(cancelReqValues);
//                 if (status === 200){
//                     const {data} = await getRequest(allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter, fromDateFilter, toDateFilter);
//                     await dispatch({ type: "INIT", data: data });
//                     successMessage('درخواست موردنظر با موفقیت کنسل شد!');
//                     setCancelReqComment('');
//                     setCancelRequestModal(false);
//                     setCurrentRequestItems([]);
//                     if(window.location.pathname !== '/RequestsList'){
//                         window.location.href='/RequestsList';
//                     }
//                 }
//             }else{
//                 setUpdateReqValuesModal(true);
//             }
//         }catch (ex) {
//             await dispatch({ type: "DELETE_REQUEST", data: [...requests] });
//         }
//     }
// }

// export const handleUpdateRequest = (currentRequest, setEditRequestModal, allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter, fromDateFilter, toDateFilter, deletedReqItems, currentRequestItems,
//      requestId, setCurrentRequestItems, setUpdateReqValuesModal) => {
//     return async (dispatch, getState) => {
//         const requests = [...getState().requests];
//         var index = currentRequest.process.length-1;
//         try{
//             const {data} = await checkReqUpdateDate(currentRequest.reqInfo._id, currentRequest.process[index]._id, currentRequest.process[index].type);
//             if(data.type === "accepted"){              
//                 const fun = async () => {
//                     currentRequestItems.map(async item =>{
//                         if(item.reqItemSubject === "") {
//                             errorMessage('موضوع نمیتواند خالی باشد!')
//                         }else{
//                             const updateReqValues = {
//                                 reqItemSubject: item.reqItemSubject,
//                                 reqItemAmount: item.reqItemAmount,
//                                 reqItemTechSpecifications: item.reqItemTechSpecifications,
//                                 reqItemDeadline: item.reqItemDeadline,
//                                 description: item.description,
//                             }
//                             const response = await updateRequest(item._id, updateReqValues);
//                         }
//                     })
//                     if(deletedReqItems.length !== 0){
//                         deletedReqItems.map(async item =>{
//                             const deletedReqItemRes = await deletedReqItem(item);
//                         })
//                     }
//                     currentRequestItems.map(async (item, index) =>{
//                         if(item.hasOwnProperty('id')){
//                             const ItemsValue = {
//                                 request_id: currentRequest.reqInfo._id,
//                                 reqItemSubject: item.reqItemSubject,
//                                 reqItemAmount: item.reqItemAmount,
//                                 reqItemTechSpecifications: item.reqItemTechSpecifications,
//                                 reqItemDeadline: item.reqItemDeadline,
//                                 description: item.description,
//                             }
//                             const reqItems = await postReqItems(ItemsValue);
//                         }
//                     })
//                 }
//                 const test = async () => {
//                     const ActionValues = {
//                         actionId: requestId,
//                         actionCode: 10000,
//                         userId: localStorage.getItem("id")
//                     }
//                     const postActionRes = await postAction(ActionValues);
//                     const {data} = await getRequest(allCompaniesFilter, allUsersFilter, allDepartmentsFilter, allStatusesFilter, fromDateFilter, toDateFilter);
//                     await dispatch({ type: "INIT", data: data });
            
//                     successMessage('درخواست موردنظر با موفقیت ویرایش شد!');
//                     setEditRequestModal(false);
//                     setCurrentRequestItems([]);
//                 }
//                 const sendData = async () => {
//                     await fun();
//                     await test();
//                 }
//                 sendData();
//             }else{
//                 setUpdateReqValuesModal(true);
//             }
//         }catch(ex){
//             await dispatch({ type: "UPDATE_REQUEST", data: [...requests] });
//         }
//     }
// }

