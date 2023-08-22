import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import NumberFormat from "react-number-format";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";
import { selectUser, handleUnits, selectUnitsOption, selectFormErrors, RsetFormErrors, selectLoading } from '../../Slices/mainSlices';
import { selectCurrentReqItem } from './../../Slices/currentReqSlice';
import Loading from './../../Common/Loading';
import {
    selectPurchasedItemModal, RsetPurchasedItemModal, selectPurchasedItemInvoiceNumber, RsetPurchasedItemInvoiceNumber,
    selectPurchasedItemStore, RsetPurchasedItemStore, selectPurchasedItemStoreCode, RsetPurchasedItemStoreCode,
    selectPurchasedItemPrice, RsetPurchasedItemPrice, selectPurchasedItemAmount, RsetPurchasedItemAmount,
    selectPurchasedItemUnit, RsetPurchasedItemUnit, selectPurchasedItemDiscount, RsetPurchasedItemDiscount,
    selectPurchasedItemDate, RsetPurchasedItemDate, selectPurchasedItemFile, RsetPurchasedItemFile,
    handlePurchasedReqItem, handleResetPurchasedItem
} from '../../Slices/purchaseSlice';

const AddPurchasedItemInfoModal = () => {
    const dispatch = useDispatch();
    const currentReqItem = useSelector(selectCurrentReqItem);
    const unitsOption = useSelector(selectUnitsOption);
    const loading = useSelector(selectLoading);

    const purchasedItemModal = useSelector(selectPurchasedItemModal);
    const purchasedItemInvoiceNumber = useSelector(selectPurchasedItemInvoiceNumber);
    const purchasedItemStore = useSelector(selectPurchasedItemStore);
    const purchasedItemStoreCode = useSelector(selectPurchasedItemStoreCode);
    const purchasedItemPrice = useSelector(selectPurchasedItemPrice);
    const purchasedItemAmount = useSelector(selectPurchasedItemAmount);
    const purchasedItemUnit = useSelector(selectPurchasedItemUnit);
    const purchasedItemDiscount = useSelector(selectPurchasedItemDiscount);
    const purchasedItemDate = useSelector(selectPurchasedItemDate);
    const purchasedItemFile = useSelector(selectPurchasedItemFile);

    const user = useSelector(selectUser);

    useEffect(() => {
        dispatch(handleUnits());
    }, [])

    const formErrors = useSelector(selectFormErrors);
    const purchaseValidation = () => {
        var errors = {};
        if (!purchasedItemInvoiceNumber) {
            errors.purchasedItemInvoiceNumber = "وارد کردن شماره فاکتور اجباری است!";
        }
        if (!purchasedItemStore) {
            errors.purchasedItemStore = "وارد کردن نام فروشگاه اجباری است!";
        }
        if (!purchasedItemStoreCode) {
            errors.purchasedItemStoreCode = "وارد کردن کد فروشگاه اجباری است!";
        }
        if (!purchasedItemPrice) {
            errors.purchasedItemPrice = "وارد کردن قیمت اجباری است!";
        }
        if (!purchasedItemAmount) {
            errors.purchasedItemAmount = "وارد کردن تعداد/مقدار اجباری است!";
        } else if (purchasedItemAmount <= 0) {
            errors.purchasedItemAmount = "تعداد/مقدار  باید بزرگ تر از 0 باشد!";
        }
        if (!purchasedItemUnit) {
            errors.purchasedItemUnit = "وارد کردن واحد شمارش اجباری است!";
        }
        if (!purchasedItemDiscount) {
            errors.purchasedItemDiscount = "وارد کردن تخفیف اجباری است!";
        }
        if (!purchasedItemDate) {
            errors.purchasedItemDate = "وارد کردن تاریخ خرید اجباری است!";
        }
        if (!purchasedItemFile) {
            errors.purchasedItemFile = "وارد کردن تصویر فاکتور اجباری است!";
        }
        return errors;
    }
    const purchaseSubmit = (e) => {
        e.preventDefault();
        if (purchasedItemInvoiceNumber !== '' && purchasedItemStore !== '' && purchasedItemStoreCode !== '' && purchasedItemPrice !== '' && purchasedItemAmount !== '' &&
            purchasedItemUnit !== '' && purchasedItemDiscount !== '' && purchasedItemDate !== null && purchasedItemFile !== '') {
            var files = [];
            const data = new FormData();
            for (var x = 0; x < purchasedItemFile.length; x++) {
                data.append('reqFiles', purchasedItemFile[x])
            }
            files = data;
            const purchaseValues = {
                itemId: currentReqItem.itemId,
                invoiceNo: purchasedItemInvoiceNumber,
                storeName: purchasedItemStore,
                storeNo: purchasedItemStoreCode,
                fee: purchasedItemPrice,
                purchaseAmount: purchasedItemAmount,
                purchaseUnit: purchasedItemUnit.value,
                discount: purchasedItemDiscount,
                purchaseDate: purchasedItemDate,
                comment: undefined
            }
            dispatch(handlePurchasedReqItem({purchaseValues: purchaseValues, files:files}));
            dispatch(RsetPurchasedItemModal(false));
        } else {
            dispatch(RsetFormErrors(
                purchaseValidation({
                    purchasedItemInvoiceNumber: purchasedItemInvoiceNumber,
                    purchasedItemStore: purchasedItemStore,
                    purchasedItemStoreCode: purchasedItemStoreCode,
                    purchasedItemPrice: purchasedItemPrice,
                    purchasedItemAmount: purchasedItemAmount,
                    purchasedItemUnit: purchasedItemUnit,
                    purchasedItemDiscount: purchasedItemDiscount,
                    purchasedItemDate: purchasedItemDate,
                    purchasedItemFile: purchasedItemFile
                })
            ));
        }
    }

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={purchasedItemModal}
            onHide={() => {
                dispatch(RsetPurchasedItemModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-success text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-center">
                    اطلاعات خرید آیتم
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-unstyled p-0 row">
                    <li className="mb-3 col-12">
                        <span className="fw-bold">سریال: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.serial)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">تاریخ ثبت: </span>
                        <span>{moment.utc(currentReqItem.createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">درخواست کننده: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.fullName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">کد کالا: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.invCode)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">نام کالا: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.invName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">تعداد/مقدار درخواستی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemAmount)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">واحد شمارش: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemUnitName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">اولویت درخواستی: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.itemPriorityName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">مشخصات فنی: </span>
                        <span>{currentReqItem.itemTechInfo !== null ? xssFilters.inHTMLData(currentReqItem.itemTechInfo) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">محل مصرف: </span>
                        <span>{currentReqItem.usePlace !== null ? xssFilters.inHTMLData(currentReqItem.usePlace) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">کد نقشه: </span>
                        <span>{currentReqItem.planNo !== null ? xssFilters.inHTMLData(currentReqItem.planNo) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">کد پروژه: </span>
                        <span>{currentReqItem.projectNo !== null ? xssFilters.inHTMLData(currentReqItem.projectNo) : ''}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">وضعیت آیتم: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.statusName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">تعداد/مقدار مورد تایید: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.acceptedAmount)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">اولویت مورد تایید: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.acceptedPriorityName)}</span>
                    </li>
                    <li className="mb-3 col-12">
                        <span className="fw-bold">مامور خرید: </span>
                        <span>{xssFilters.inHTMLData(currentReqItem.buyerName)}</span>
                    </li>
                </ul>
                <div className="position-relative">
                    {loading ? <Loading /> : <Row>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>شماره فاکتور: </Form.Label>
                            <NumberFormat className='form-control' value={purchasedItemInvoiceNumber} name='purchasedItemInvoiceNumber' onChange={(e) => { dispatch(RsetPurchasedItemInvoiceNumber(e.target.value)) }} />
                            {!purchasedItemInvoiceNumber && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemInvoiceNumber}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>نام فروشگاه: </Form.Label>
                            <Form.Control value={purchasedItemStore} name='purchasedItemStore' onChange={(e) => { dispatch(RsetPurchasedItemStore(e.target.value)) }} ></Form.Control>
                            {!purchasedItemStore && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemStore}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>کد فروشگاه: </Form.Label>
                            <NumberFormat className='form-control' value={purchasedItemStoreCode} name='purchasedItemStoreCode' onChange={(e) => { dispatch(RsetPurchasedItemStoreCode(e.target.value)) }} />
                            {!purchasedItemStoreCode && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemStoreCode}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>قیمت: </Form.Label>
                            <NumberFormat className='form-control' value={purchasedItemPrice} name='purchasedItemPrice' onChange={(e) => { dispatch(RsetPurchasedItemPrice(e.target.value)) }} />
                            {!purchasedItemPrice && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemPrice}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>تعداد/مقدار: </Form.Label>
                            <NumberFormat className='form-control' value={purchasedItemAmount} name='purchasedItemAmount' onChange={(e) => { dispatch(RsetPurchasedItemAmount(e.target.value)) }} />
                            {(!purchasedItemAmount && purchasedItemAmount <= 0) ?
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemAmount}
                                </p>
                                : null}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>واحد شمارش: </Form.Label>
                            <Select options={unitsOption} value={purchasedItemUnit} name='purchasedItemUnit' onChange={(e) => { dispatch(RsetPurchasedItemUnit(e)) }} />
                            {!purchasedItemUnit && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemUnit}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>تخفیف: </Form.Label>
                            <NumberFormat className='form-control' value={purchasedItemDiscount} name='purchasedItemDiscount' onChange={(e) => { dispatch(RsetPurchasedItemDiscount(e.target.value)) }} />
                            {!purchasedItemDiscount && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemDiscount}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>تاریخ خرید: </Form.Label>
                            <DatePicker className='form-control' value={purchasedItemDate} name='purchasedItemDate' onChange={(e) => { dispatch(RsetPurchasedItemDate(e)) }} />
                            {!purchasedItemDate && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemDate}
                                </p>
                            )}
                        </Col>
                        <Col md='6' lg='4' className="mb-3">
                            <Form.Label className='mb-1 required-field'>تصویر فاکتور: </Form.Label>
                            <Form.Control type="file" multiple name='purchasedItemFile' onChange={(e) => { dispatch(RsetPurchasedItemFile(e.target.files)) }} />
                            {!purchasedItemFile && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.purchasedItemFile}
                                </p>
                            )}
                        </Col>
                    </Row>}
                </div>
            </Modal.Body>
            <Modal.Footer className='d-block'>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="success"
                        onClick={(e) => {
                            purchaseSubmit(e);
                        }}
                    >ثبت</Button>
                    <Button
                        onClick={() => {
                            dispatch(handleResetPurchasedItem());
                            dispatch(RsetPurchasedItemModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AddPurchasedItemInfoModal;