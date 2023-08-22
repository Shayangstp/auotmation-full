import React, { useState, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import { rootContext } from "../rootContext";
import { allNewReqsContext } from './allNewReqsContext';
import { getOfficeToPerson} from "../../../Services/officeServices";
import ITAcceptRequestModal from "../../Modals/ITJReqModals/AcceptRequestModal";
import ITCancelRequestModal from "../../Modals/ITJReqModals/CancelRequestModal";

import JobAcceptRequestModal from '../../Modals/JobReqsModals/AcceptRequestModal';
import JobCancelRequestModal from "../../Modals/JobReqsModals/CancelRequestModal";
import OfficeAcceptRequestModal from '../../Modals/OfficeReqsModals/AcceptRequestModal';
import OfficeCancelRequestModal from '../../Modals/OfficeReqsModals/CancelRequestModal';
import OfficeNextAcceptRequestModal from '../../Modals/OfficeReqsModals/NextAcceptRequestModal';
import OfficeViewRequestModal from '../../Modals/OfficeReqsModals/ViewRequestModal';
import WarehouseAcceptRequestModal from '../../Modals/WarehouseReqsModals/AcceptRequestModal';
import WarehouseCancelRequestModal from '../../Modals/WarehouseReqsModals/CancelRequestModal';
import WarehouseEditRequestModal from '../../Modals/WarehouseReqsModals/EditRequestModal';
import WarehouseViewRequestModal from "../../Modals/OfficeReqsModals/ViewRequestModal";
import WarehouseNextAcceptRequestModal from './../../Modals/WarehouseReqsModals/NextAcceptRequestModal';
import { successMessage, errorMessage } from "../../../utils/message";
import { getReqCategories } from "../../../Services/allNewReqsServices";
import {checkReqUpdateDate} from '../../../Services/rootServices';
import {selectUser} from '../../Slices/mainSlices';
import { selectAcceptReqModal, selectNextAcceptReqModal, selectCancelReqModal, selectEditReqModal, selectViewReqModal } from '../../Slices/modalsSlice';

const AllNewRequestsContext = ({ children, currentRequest, setCurrentRequest }) => {
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
    const cancelReqModal = useSelector(selectCancelReqModal);
    const editReqModal = useSelector(selectEditReqModal);
    const viewReqModal = useSelector(selectViewReqModal);

    const mainContext = useContext(rootContext);
    const {
        setLoading,
        currentReqId,
        currentReqInfo,
        currentReqToPerson,
        setCurrentReqToPerson,
        currentReqType,
    } = mainContext;

    const [reqCategoriesList, setReqCategoriesList] = useState([]);
    const handleReqCategories = async () => {
        try{
            const {data} = await getReqCategories();
            setReqCategoriesList(data);
        }catch(ex){
            console.log(ex);
        }
    }

    const user = useSelector(selectUser);

    const [updateReqValuesModal, setUpdateReqValuesModal] = useState(false);
    const handleOfficeLastActionDate = async (reqId, actionId, type) => {
        try {
            const { data } = await checkReqUpdateDate(reqId, actionId, type);
            if (data.type === "accepted") {
                return true
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    
    return (
        <allNewReqsContext.Provider
            value={{
                handleReqCategories,
                reqCategoriesList,
                currentRequest,
            }}
        >
            {acceptReqModal && currentReqType === 1 ? <ITAcceptRequestModal /> : null}
            {cancelReqModal && currentReqType === 1 ? <ITCancelRequestModal /> : null}

            {acceptReqModal && currentReqType === 2 ? <WarehouseAcceptRequestModal /> : null}
            {nextAcceptReqModal && (currentReqType === 2 || currentReqType === 8) ? <WarehouseNextAcceptRequestModal /> : null}
            {cancelReqModal && (currentReqType === 2 || currentReqType === 8) ? <WarehouseCancelRequestModal /> : null}
            {editReqModal && (currentReqType === 2 || currentReqType === 8) ? <WarehouseEditRequestModal /> : null}
            {viewReqModal && (currentReqType === 2 || currentReqType === 8) ? <WarehouseViewRequestModal /> : null}

            {/* {viewRequestModal && currentReqType === 3 ? <OfficeViewRequestModal /> : null} */}
            {acceptReqModal && (currentReqType === 4 || currentReqType === 9) ? <OfficeAcceptRequestModal newReqs={true}/> : null}
            {nextAcceptReqModal && (currentReqType === 4 || currentReqType === 9) ? <OfficeNextAcceptRequestModal newReqs={true}/> : null}
            {cancelReqModal && (currentReqType === 4 || currentReqType === 9) ? <OfficeCancelRequestModal newReqs={true}/> : null}

            {children}
        </allNewReqsContext.Provider>
    )
}

export default AllNewRequestsContext;