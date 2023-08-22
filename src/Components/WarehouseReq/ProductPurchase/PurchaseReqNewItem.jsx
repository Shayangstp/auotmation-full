import React, { useEffect, useContext } from "react";
import { reqContext } from '../../context/warehouseReqsContext/reqContext';
import Select from 'react-select';
import NumberFormat from "react-number-format";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";

import WarehouseAddProModal from "../../Modals/Warehouse/GoodSearchModal";

import { warehouseAddProCntxt } from './../../context/WarehouseContext/warehouse-addProCntxt';

import { useDispatch, useSelector } from "react-redux";
import { selectFormErrors, RsetFormErrors, handleInputsEnter, selectLoading } from "../../Slices/mainSlices";
import {
    selectPurchaseReqItemPlaceOfUse, RsetPurchaseReqItemPlaceOfUse, selectPurchaseReqItemAmount, RsetPurchaseReqItemAmount,
    selectPurchaseReqItemPriority, RsetPurchaseReqItemPriority, selectPurchaseReqItemUnit, RsetPurchaseReqItemUnit,
    selectPurchaseReqItemTechInfo, RsetPurchaseReqItemTechInfo, selectPurchaseReqItemMapCode, RsetPurchaseReqItemMapCode,
    selectPurchaseReqItemProjectCode, RsetPurchaseReqItemProjectCode, handleAddNewPurchaseReqItem
} from '../../Slices/purchaseSlice';
import { handleUnits, selectUnitsOption } from "../../Slices/mainSlices";
import { selectGoodCode, RsetGoodCode, selectGoodName, RsetGoodName, handleGoodInfoWithCode, handleGoodInfoWithName, selectGoodsModal, selectSelectedGood } from "../../Slices/goodSearchSlice";
import GoodSearchModal from "../../Modals/Warehouse/GoodSearchModal";
import Loading from "../../Common/Loading";

const PurchaseReqNewItem = () => {

    const dispatch = useDispatch();
    const goodCode = useSelector(selectGoodCode);
    const goodName = useSelector(selectGoodName);
    const purchaseReqItemAmount = useSelector(selectPurchaseReqItemAmount);
    const purchaseReqItemPriority = useSelector(selectPurchaseReqItemPriority);
    const purchaseReqItemUnit = useSelector(selectPurchaseReqItemUnit);
    const purchaseReqItemTechInfo = useSelector(selectPurchaseReqItemTechInfo);
    const purchaseReqItemPlaceOfUse = useSelector(selectPurchaseReqItemPlaceOfUse);
    const unitsOption = useSelector(selectUnitsOption);
    const goodsModal = useSelector(selectGoodsModal);
    const purchaseReqItemProjectCode = useSelector(selectPurchaseReqItemProjectCode);
    const purchaseReqItemMapCode = useSelector(selectPurchaseReqItemMapCode);
    const selectedGood = useSelector(selectSelectedGood);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(handleUnits());
    }, [])

    const warehouseAddProContext = useContext(warehouseAddProCntxt);
    const {
        addProModal
    } = warehouseAddProContext;

    const requestContext = useContext(reqContext);
    const {
        addNewPurchaseProRef,
    } = requestContext;

    const formErrors = useSelector(selectFormErrors);
    const purchaseReqItemValidation = () => {
        var errors = {};
        if (!goodCode) {
            errors.goodCode = "انتخاب کد کالا اجباری است!";
        }
        if (!goodName) {
            errors.goodName = "انتخاب نام کالا اجباری است!";
        }
        if (!purchaseReqItemAmount) {
            errors.purchaseReqItemAmount = "انتخاب تعداد/مقدار کالا اجباری است!";
        }
        if (!purchaseReqItemPriority) {
            errors.purchaseReqItemPriority = "انتخاب اولویت اجباری است!";
        }
        if (!purchaseReqItemUnit) {
            errors.purchaseReqItemUnit = "انتخاب واحد شمارش اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (goodCode !== '' && goodName !== '' && purchaseReqItemAmount !== '' && purchaseReqItemPriority !== '' && purchaseReqItemUnit !== '') {
            dispatch(handleAddNewPurchaseReqItem());
        } else {
            dispatch(RsetFormErrors(
                purchaseReqItemValidation({
                    goodCode: goodCode,
                    goodName: goodName,
                    purchaseReqItemAmount: purchaseReqItemAmount,
                    purchaseReqItemPriority: purchaseReqItemPriority,
                    purchaseReqItemUnit: purchaseReqItemUnit,
                })
            ));
        }
    }

    useEffect(() => {
        if (selectedGood.unitName !== undefined) {
            dispatch(RsetPurchaseReqItemUnit({ label: selectedGood.unitName, value: selectedGood.unitCode }))
        }
    }, [selectedGood])

    // useEffect(() => {
    //     dispatch(handleInputsEnter());
    // }, []);

    return (
        <Form
            //className="enter-in-form"
        >
            <div className="position-relative">
                {loading ? <Loading /> : null}
                <Row>
                    <Form.Group as={Col} md='3' className='mb-4'>
                        <Form.Label className='mb-1 required-field'>کد کالا: </Form.Label>
                        <InputGroup>
                            <NumberFormat placeholder='کد کالا' type="text" value={goodCode} name="goodCode" onChange={(e) => { dispatch(RsetGoodCode(e.target.value)) }}
                                aria-describedby="searchProByCode" format="##########" mask='-' dir='ltr' className='form-control'
                                id='goodCode' onBlur={(e) => { dispatch(handleGoodInfoWithCode()) }} onKeyUp={(e) => {
                                    e.which = e.which || e.keyCode;
                                    if (e.which === 13) {
                                        dispatch(handleGoodInfoWithCode());
                                    }
                                }}
                            />
                            {/* <Button variant="outline-info" tabIndex="-1" onClick={()=>{dispatch(handleGoodInfoWithCode())}}>
                        <span className="fw-bold">؟</span>
                    </Button> */}
                        </InputGroup>
                        {!goodCode && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.goodCode}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md='9' className='mb-4'>
                        <Form.Label className='mb-1 required-field'>نام کالا: </Form.Label>
                        <InputGroup>
                            <Form.Control placeholder='نام/شرح کالا (جهت جستجو دقیق تر کالا، میتوانید بخشی از نام کالا را در این قسمت تایپ کنید)' type="text" value={goodName} name="goodName" onChange={(e) => { dispatch(RsetGoodName(e.target.value)) }} aria-describedby="searchProByName"
                                onBlur={(e) => { dispatch(handleGoodInfoWithCode()) }} onKeyUp={(e) => {
                                    e.which = e.which || e.keyCode;
                                    if (e.which === 13) {
                                        dispatch(handleGoodInfoWithName());
                                    }
                                }}
                            />
                            <Button variant="outline-info" tabIndex="-1" title='جهت جستجو کالا کلیک کنید' onFocus={(e) => {
                                document.getElementById('purchaseReqItemAmount').focus();
                            }} onMouseDown={() => { dispatch(handleGoodInfoWithName()) }}>
                                <span className="fw-bold">؟</span>
                            </Button>
                        </InputGroup>
                        {!goodName && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.goodName}
                            </p>
                        )}
                    </Form.Group>
                    {goodsModal ? <GoodSearchModal item={undefined} /> : null}
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1 required-field'>تعداد/مقدار: </Form.Label>
                        <NumberFormat type="text" value={purchaseReqItemAmount} name="purchaseReqItemAmount" id='purchaseReqItemAmount' onChange={(e) => { dispatch(RsetPurchaseReqItemAmount(e.target.value)) }} dir='ltr' className='form-control' />
                        {!purchaseReqItemAmount && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.purchaseReqItemAmount}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1 required-field'>واحد شمارش: </Form.Label>
                        <Select value={purchaseReqItemUnit} name="purchaseReqItemUnit" onChange={(e) => { dispatch(RsetPurchaseReqItemUnit(e)) }}
                            options={unitsOption} placeholder='انتخاب...' />
                        {!purchaseReqItemUnit && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.purchaseReqItemUnit}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1 required-field'>اولویت: </Form.Label>
                        <Select value={purchaseReqItemPriority} name="purchaseReqItemPriority" onChange={(e) => { dispatch(RsetPurchaseReqItemPriority(e)) }}
                            options={[{ label: 'عادی', value: 1 }, { label: 'فوری', value: 2 }]} placeholder='انتخاب...' />
                        {!purchaseReqItemPriority && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.purchaseReqItemPriority}
                            </p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1'>مشخصات فنی: </Form.Label>
                        <Form.Control type="text" value={purchaseReqItemTechInfo} name="purchaseReqItemTechInfo" id='purchaseReqItemTechInfo' onChange={(e) => {
                            dispatch(RsetPurchaseReqItemTechInfo(e.target.value))
                        }} />
                    </Form.Group>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1'>محل مصرف: </Form.Label>
                        <Form.Control type="text" value={purchaseReqItemPlaceOfUse} name="purchaseReqItemPlaceOfUse" id='purchaseReqItemPlaceOfUse' onChange={(e) => { dispatch(RsetPurchaseReqItemPlaceOfUse(e.target.value)) }} />
                    </Form.Group>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1'>شماره پروژه: </Form.Label>
                        <Form.Control type="text" value={purchaseReqItemProjectCode} name="purchaseReqItemProjectCode" id='purchaseReqItemProjectCode' onChange={(e) => { dispatch(RsetPurchaseReqItemProjectCode(e.target.value)) }} />
                    </Form.Group>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1'>شماره نقشه: </Form.Label>
                        <Form.Control type="text" value={purchaseReqItemMapCode} name="purchaseReqItemMapCode" id='purchaseReqItemMapCode' onChange={(e) => { dispatch(RsetPurchaseReqItemMapCode(e.target.value)) }} />
                    </Form.Group>
                    <Form.Group as={Col} md='4' xl='3' xxl='2' className='mb-4 d-flex align-items-end'>
                        <Button variant="info"
                            className="w-100 text-white d-flex justify-content-center"
                            id='addNewPurchasePro'
                            onClick={(e) => { submitFormBtn(e) }}
                            ref={addNewPurchaseProRef}
                            preventdefault='true'
                        >
                            <span>افزودن آیتم</span>
                        </Button>
                    </Form.Group>
                    {addProModal ? <WarehouseAddProModal /> : null}
                </Row>
            </div>

        </Form>
    )
}
export default PurchaseReqNewItem;