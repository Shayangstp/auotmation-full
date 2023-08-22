import React, { Fragment, useContext, useEffect, useState } from "react";
import { rootContext } from "../../context/rootContext";
import { reqContext } from "../../context/warehouseReqsContext/reqContext";
import { getToPersonByRole } from '../../../Services/rootServices';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from "react-bootstrap";
import NumberFormat from "react-number-format";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import xssFilters from "xss-filters";
import { selectUser, handleUnits, selectUnitsOption, selectFormErrors, RsetFormErrors } from '../../Slices/mainSlices';
import { selectAcceptReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqItem } from './../../Slices/currentReqSlice';
import { handleDeliveryForReqItem } from "../../Slices/warehouseSlice";
import GoodSearchInputs from './../../Common/GoodSearch/GoodSearchInputs';
import GoodSearchModal from "../Warehouse/GoodSearchModal";
import { selectGoodsModal } from "../../Slices/goodSearchSlice";

const ReqItemDeliveryModal = () => {
    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const currentReqItem = useSelector(selectCurrentReqItem);
    const unitsOption = useSelector(selectUnitsOption);
    const goodsModal = useSelector(selectGoodsModal);

    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        reqItemDeliveryModal,
        setReqItemDeliveryModal,
        units,
        currentReqDep
    } = mainContext;

    const requestContext = useContext(reqContext);
    const {
        handleGetWarehouses,
        warehouseSelect,

        reqItemUnitRef,
        reqItemInvRef,
        reqItemRecDateRef,
        receiverRef,

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
        handleResetItemReceiverValues
    } = requestContext;

    const user = useSelector(selectUser);
    const [receivers, setReceivers] = useState([]);
    const handleGetReceivers = async () => {
        try {
            const recsRes = await getToPersonByRole(undefined, user.Location, user.CompanyCode, 1, currentReqInfo.deptCode, '0');
            if (recsRes.data.code === 415) {
                setReceivers(recsRes.data.list);
            } else {
                setReceivers([]);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    useEffect(() => {
        if (currentReqInfo !== '' && currentReqInfo.lastActionCode === 29 && acceptReqModal === true) {
            handleGetWarehouses();
            handleGetReceivers();
            dispatch(handleUnits());
        }
    }, [])

    const formErrors = useSelector(selectFormErrors);
    const deliveryValidation = () => {
        var errors = {};
        if (!receivedAmount) {
            errors.receivedAmount = "وارد کردن تعداد تحویل اجباری است!";
        }else if(receivedAmount <= 0){
            errors.receivedAmount = "تعداد تحویل باید بزرگ تر از 0 باشد!";
        }
        // else if(receivedAmount > currentReqItem.remainder){
        //     errors.receivedAmount = "تعداد تحویل نمیتواند بیشتر از تعداد درخواستی باشد!";
        // }
        if (!receivedUnit) {
            errors.receivedUnit = "وارد کردن واحد تحویل اجباری است!";
        }
        if (!receiver) {
            errors.receiver = "وارد کردن تحویل گیرنده اجباری است!";
        }
        if (!receivedInventory) {
            errors.receivedInventory = "وارد کردن انبار اجباری است!";
        }
        if (!receivedDate) {
            errors.receivedDate = "وارد کردن تاریخ تحویل اجباری است!";
        }
        return errors;
    }
    const deliverySubmit = (e) => {
        e.preventDefault();
        if (receivedAmount !== '' && receivedAmount > 0 && receivedUnit !== '' && receiver !== '' && receivedInventory !== '' && receivedDate !== '') {
            const deliveryValues = {
                receivedAmount: receivedAmount,
                receivedUnit: receivedUnit.value,
                receiver: receiver.value,
                comment: undefined,
                userId: localStorage.getItem('id'),
                inventory: receivedInventory.value,
                receivedDate: receivedDate
            }
            dispatch(handleDeliveryForReqItem({itemId: currentReqItem.itemId, deliveryValues: deliveryValues}));
            setReqItemDeliveryModal(false);
        } else {
            dispatch(RsetFormErrors(
                deliveryValidation({
                    receivedAmount: receivedAmount,
                    receivedUnit: receivedUnit,
                    receiver: receiver,
                    receivedInventory: receivedInventory,
                    receivedDate: receivedDate,
                })
            ));
        }
    }

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={reqItemDeliveryModal}
            onHide={() => {
                setReqItemDeliveryModal(false);
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-primary text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-center">
                    اطلاعات تحویل آیتم
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-unstyled p-0 row">
                    <li className="mb-3 col-12">
                        <span className="fw-bold">نام کالا: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">کد معادل انبار: </span>
                        <span>{<Fragment><GoodSearchInputs showList={false} item={currentReqItem}/>
                            {goodsModal ? <GoodSearchModal item={currentReqItem}/> : null}</Fragment>
                        }</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">داغی: </span>
                        <span>{currentReqItem.rattletrap === true ? 'دارد' : 'ندارد'}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">امانی: </span>
                        <span>{currentReqItem.consumable === true ? 'هست' : 'نیست'}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">مصرفی: </span>
                        <span>{currentReqItem.borrowed === true ? 'هست' : 'نیست'}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">واحد شمارش درخواستی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemUnit)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">تعداد/مقدار درخواستی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemAmount)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">جمع تعداد/مقدار تحویلی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.receivedAmount)}</span>
                    </li>
                    <li className="mb-5 col-12">
                        <span className="fw-bold">مانده: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.remainder)}</span>
                    </li>
                    <li className="mb-3 col-12 col-md-6">
                        <span className="fw-bold">تعداد/مقدار تحویلی: </span>
                        <NumberFormat type="text" defaultValue={receivedAmount} name="numberOfDeliveries" dir='ltr' className='form-control mt-2'
                            onChange={(e) => { setReceivedAmount(e.target.value) }}
                        />
                        {!receivedAmount || receivedAmount <= 0 || receivedAmount > currentReqItem.remainder ?
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.receivedAmount}
                            </p>
                        :null}
                    </li>
                    <li className="mb-3 col-12 col-md-6">
                        <span className="fw-bold">واحد شمارش: </span>
                        <Select placeholder='انتخاب...' isSearchable name='reqItemUnit' value={receivedUnit}
                            options={unitsOption} className='mt-2' onChange={(e) => {
                                setReceivedUnit(e)
                            }}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                        {!receivedUnit && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.receivedUnit}
                            </p>
                        )}
                    </li>
                    <li className="mb-3 col-12 col-md-6">
                        <span className="fw-bold">انبار: </span>
                        <Select value={receivedInventory} onChange={(e) => { setReceivedInventory(e) }} isSearchable
                            placeholder='انتخاب...' className='mt-2' options={warehouseSelect}
                            menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                        {!receivedInventory && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.receivedInventory}
                            </p>
                        )}
                    </li>
                    <li className="mb-3 col-12 col-md-6">
                        <span className="fw-bold">تحویل گیرنده: </span>
                        <Select value={receiver} onChange={(e) => { setReceiver(e) }} isSearchable
                            placeholder='انتخاب...' className='mt-2' options={receivers}
                            menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                        {!receiver && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.receiver}
                            </p>
                        )}
                    </li>
                    <li className="mb-3 col-12 col-md-6">
                        <span className="fw-bold">تاریخ تحویل: </span>
                        <DatePicker
                            className="form-control mt-2"
                            isGregorian={false}
                            value={receivedDate}
                            onChange={(e) => { setReceivedDate(e) }}
                        />
                        {!receivedDate && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.receivedDate}
                            </p>
                        )}
                    </li>
                </ul>
            </Modal.Body>
            <Modal.Footer className='d-block'>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="primary"
                        onClick={(e) => {
                            deliverySubmit(e);
                        }}
                    >ثبت</Button>
                    <Button
                        onClick={() => {
                            handleResetItemReceiverValues();
                            setReqItemDeliveryModal(false);
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqItemDeliveryModal;