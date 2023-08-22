import React, { useEffect, Fragment, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker2';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectPaySlipReportField, RsetPaySlipReportField, handlePaySlipReportFieldOptions, selectPaySlipReportFieldOptions,
    selectPaySlipReportFilterByPadashFrom, RsetPaySlipReportFilterByPadashFrom,
    selectPaySlipReportFilterByPadashTo, RsetPaySlipReportFilterByPadashTo,
    selectPaySlipReportFilterByPoshtlistFrom, RsetPaySlipReportFilterByPoshtlistFrom,
    selectPaySlipReportFilterByPoshtlistTo, RsetPaySlipReportFilterByPoshtlistTo,
    selectPaySlipReportFilterByAfztolid1From, RsetPaySlipReportFilterByAfztolid1From,
    selectPaySlipReportFilterByAfztolid1To, RsetPaySlipReportFilterByAfztolid1To,
    selectPaySlipReportFilterByChildRightFrom, RsetPaySlipReportFilterByChildRightFrom,
    selectPaySlipReportFilterByChildRightTo, RsetPaySlipReportFilterByChildRightTo,
    selectPaySlipReportFilterByHomeRightFrom, RsetPaySlipReportFilterByHomeRightFrom,
    selectPaySlipReportFilterByHomeRightTo, RsetPaySlipReportFilterByHomeRightTo,
    selectPaySlipReportFilterByBonFrom, RsetPaySlipReportFilterByBonFrom,
    selectPaySlipReportFilterByBonTo, RsetPaySlipReportFilterByBonTo,
    selectPaySlipReportFilterByMaliatFrom, RsetPaySlipReportFilterByMaliatFrom,
    selectPaySlipReportFilterByMaliatTo, RsetPaySlipReportFilterByMaliatTo,
    selectPaySlipReportFilterByOverTimeFrom, RsetPaySlipReportFilterByOverTimeFrom,
    selectPaySlipReportFilterByOverTimeTo, RsetPaySlipReportFilterByOverTimeTo,
    selectPaySlipReportFilterByKasrkarFrom, RsetPaySlipReportFilterByKasrkarFrom,
    selectPaySlipReportFilterByKasrkarTo, RsetPaySlipReportFilterByKasrkarTo,
    selectPaySlipReportFilterByMamouriat2From, RsetPaySlipReportFilterByMamouriat2From,
    selectPaySlipReportFilterByMamouriat2To, RsetPaySlipReportFilterByMamouriat2To,
    selectPaySlipReportFilterByNobatKariFrom, RsetPaySlipReportFilterByNobatKariFrom,
    selectPaySlipReportFilterByNobatKariTo, RsetPaySlipReportFilterByNobatKariTo,
    selectPaySlipReportFilterByMorkhasi1From, RsetPaySlipReportFilterByMorkhasi1From,
    selectPaySlipReportFilterByMorkhasi1To, RsetPaySlipReportFilterByMorkhasi1To,
    selectPaySlipReportFilterByTasvieh1From, RsetPaySlipReportFilterByTasvieh1From,
    selectPaySlipReportFilterByTasvieh1To, RsetPaySlipReportFilterByTasvieh1To,
    selectPaySlipReportFilterByHelpPayFrom, RsetPaySlipReportFilterByHelpPayFrom,
    selectPaySlipReportFilterByHelpPayTo, RsetPaySlipReportFilterByHelpPayTo,
    selectPaySlipReportFilterByLoanPartFrom, RsetPaySlipReportFilterByLoanPartFrom,
    selectPaySlipReportFilterByLoanPartTo, RsetPaySlipReportFilterByLoanPartTo,
    selectPaySlipReportFromYear, RsetPaySlipReportFromYear, selectPaySlipReportFromMonth, RsetPaySlipReportFromMonth,
    selectPaySlipReportToYear, RsetPaySlipReportToYear, selectPaySlipReportToMonth, RsetPaySlipReportToMonth,
    selectPaySlipReportCompany, RsetPaySlipReportCompany, handlePaySlipReportCompanies, selectPaySlipReportCompanyOptions,
    handlePaySlipReport
} from '../../../Slices/financialSlices';
import { selectUser } from '../../../Slices/mainSlices';


const PaySlipReportFilter = () => {
    const dispatch = useDispatch();
    const paySlipReportField = useSelector(selectPaySlipReportField);
    const paySlipReportFieldOptions = useSelector(selectPaySlipReportFieldOptions);
    const paySlipReportFilterByPadashFrom = useSelector(selectPaySlipReportFilterByPadashFrom);
    const paySlipReportFilterByPadashTo = useSelector(selectPaySlipReportFilterByPadashTo);
    const paySlipReportFilterByPoshtlistFrom = useSelector(selectPaySlipReportFilterByPoshtlistFrom);
    const paySlipReportFilterByPoshtlistTo = useSelector(selectPaySlipReportFilterByPoshtlistTo);
    const paySlipReportFilterByAfztolid1From = useSelector(selectPaySlipReportFilterByAfztolid1From);
    const paySlipReportFilterByAfztolid1To = useSelector(selectPaySlipReportFilterByAfztolid1To);
    const paySlipReportFilterByChildRightFrom = useSelector(selectPaySlipReportFilterByChildRightFrom);
    const paySlipReportFilterByChildRightTo = useSelector(selectPaySlipReportFilterByChildRightTo);
    const paySlipReportFilterByHomeRightFrom = useSelector(selectPaySlipReportFilterByHomeRightFrom);
    const paySlipReportFilterByHomeRightTo = useSelector(selectPaySlipReportFilterByHomeRightTo);
    const paySlipReportFilterByBonFrom = useSelector(selectPaySlipReportFilterByBonFrom);
    const paySlipReportFilterByBonTo = useSelector(selectPaySlipReportFilterByBonTo);
    const paySlipReportFilterByMaliatFrom = useSelector(selectPaySlipReportFilterByMaliatFrom);
    const paySlipReportFilterByMaliatTo = useSelector(selectPaySlipReportFilterByMaliatTo);
    const paySlipReportFilterByOverTimeFrom = useSelector(selectPaySlipReportFilterByOverTimeFrom);
    const paySlipReportFilterByOverTimeTo = useSelector(selectPaySlipReportFilterByOverTimeTo);
    const paySlipReportFilterByKasrkarFrom = useSelector(selectPaySlipReportFilterByKasrkarFrom);
    const paySlipReportFilterByKasrkarTo = useSelector(selectPaySlipReportFilterByKasrkarTo);
    const paySlipReportFilterByMamouriat2From = useSelector(selectPaySlipReportFilterByMamouriat2From);
    const paySlipReportFilterByMamouriat2To = useSelector(selectPaySlipReportFilterByMamouriat2To);
    const paySlipReportFilterByNobatKariFrom = useSelector(selectPaySlipReportFilterByNobatKariFrom);
    const paySlipReportFilterByNobatKariTo = useSelector(selectPaySlipReportFilterByNobatKariTo);
    const paySlipReportFilterByMorkhasi1From = useSelector(selectPaySlipReportFilterByMorkhasi1From);
    const paySlipReportFilterByMorkhasi1To = useSelector(selectPaySlipReportFilterByMorkhasi1To);
    const paySlipReportFilterByTasvieh1From = useSelector(selectPaySlipReportFilterByTasvieh1From);
    const paySlipReportFilterByTasvieh1To = useSelector(selectPaySlipReportFilterByTasvieh1To);
    const paySlipReportFilterByHelpPayFrom = useSelector(selectPaySlipReportFilterByHelpPayFrom);
    const paySlipReportFilterByHelpPayTo = useSelector(selectPaySlipReportFilterByHelpPayTo);
    const paySlipReportFilterByLoanPartFrom = useSelector(selectPaySlipReportFilterByLoanPartFrom);
    const paySlipReportFilterByLoanPartTo = useSelector(selectPaySlipReportFilterByLoanPartTo);
    const paySlipReportFromYear = useSelector(selectPaySlipReportFromYear);
    const paySlipReportFromMonth = useSelector(selectPaySlipReportFromMonth);
    const paySlipReportToYear = useSelector(selectPaySlipReportToYear);
    const paySlipReportToMonth = useSelector(selectPaySlipReportToMonth);
    const paySlipReportCompany = useSelector(selectPaySlipReportCompany);
    const paySlipReportCompanyOptions = useSelector(selectPaySlipReportCompanyOptions);
    const user = useSelector(selectUser);

    useEffect(() => {
        dispatch(handlePaySlipReportFieldOptions());
    }, [])

    const year = [
        { label: '1395', value: '95' },
        { label: '1396', value: '96' },
        { label: '1397', value: '97' },
        { label: '1398', value: '98' },
        { label: '1399', value: '99' },
        { label: '1400', value: '00' },
        { label: '1401', value: '01' },
        { label: '1402', value: '02' },
    ]
    const month = [
        { label: 'فروردین', value: '01' },
        { label: 'اردیبهشت', value: '02' },
        { label: 'خرداد', value: '03' },
        { label: 'تیر', value: '04' },
        { label: 'مرداد', value: '05' },
        { label: 'شهریور', value: '06' },
        { label: 'مهر', value: '07' },
        { label: 'آبان', value: '08' },
        { label: 'آذر', value: '09' },
        { label: 'دی', value: '10' },
        { label: 'بهمن', value: '11' },
        { label: 'اسفند', value: '12' },
    ]

    useEffect(() => {
        dispatch(handlePaySlipReportCompanies());
    }, [user])

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='12' className='mb-4'>
                <Form.Label id='firstname' className='mb-1'>فیلتر بر اساس:</Form.Label>
                <Select
                    isMulti
                    placeholder='همه'
                    isSearchable
                    value={paySlipReportField}
                    options={paySlipReportFieldOptions}
                    onChange={(option) => {
                        dispatch(RsetPaySlipReportField(option));
                    }}
                />
            </Form.Group>
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Padash' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>پاداش از:</Form.Label>
                                <NumberFormat type="text" id='PadashMin' value={paySlipReportFilterByPadashFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByPadashFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>پاداش تا:</Form.Label>
                                <NumberFormat type="text" id='PadashMax' value={paySlipReportFilterByPadashTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByPadashTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'poshtlist' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>مزایا از:</Form.Label>
                                <NumberFormat type="text" id='poshtlistMin' value={paySlipReportFilterByPoshtlistFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByPoshtlistFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>مزایا تا:</Form.Label>
                                <NumberFormat type="text" id='poshtlistMax' value={paySlipReportFilterByPoshtlistTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByPoshtlistTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'AfzTolid' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>کارانه از:</Form.Label>
                                <NumberFormat type="text" id='AfzTolidMin' value={paySlipReportFilterByAfztolid1From} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByAfztolid1From(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>کارانه تا:</Form.Label>
                                <NumberFormat type="text" id='AfzTolidMax' value={paySlipReportFilterByAfztolid1To} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByAfztolid1To(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Olad' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>حق اولاد از:</Form.Label>
                                <NumberFormat type="text" id='OladMin' value={paySlipReportFilterByChildRightFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByChildRightFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>حق اولاد تا:</Form.Label>
                                <NumberFormat type="text" id='OladMax' value={paySlipReportFilterByChildRightTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByChildRightTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Maskan' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>مسکن از:</Form.Label>
                                <NumberFormat type="text" id='MaskanMin' value={paySlipReportFilterByHomeRightFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByHomeRightFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>مسکن تا:</Form.Label>
                                <NumberFormat type="text" id='MaskanMax' value={paySlipReportFilterByHomeRightTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByHomeRightTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Bon' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>بن کارگری از:</Form.Label>
                                <NumberFormat type="text" id='BonMin' value={paySlipReportFilterByBonFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByBonFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>بن کارگری تا:</Form.Label>
                                <NumberFormat type="text" id='BonMax' value={paySlipReportFilterByBonTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByBonTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Maliat' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>مالیات از:</Form.Label>
                                <NumberFormat type="text" id='MaliatMin' value={paySlipReportFilterByMaliatFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByMaliatFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>مالیات تا:</Form.Label>
                                <NumberFormat type="text" id='MaliatMax' value={paySlipReportFilterByMaliatTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByMaliatTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'EzafehKar' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>اضافه کار از:</Form.Label>
                                <NumberFormat type="text" id='EzafehKarMin' value={paySlipReportFilterByOverTimeFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByOverTimeFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>اضافه کار تا:</Form.Label>
                                <NumberFormat type="text" id='EzafehKarMax' value={paySlipReportFilterByOverTimeTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByOverTimeTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'KasrKar' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>کسر کار از:</Form.Label>
                                <NumberFormat type="text" id='KasrKarMin' value={paySlipReportFilterByKasrkarFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByKasrkarFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>کسر کار تا:</Form.Label>
                                <NumberFormat type="text" id='KasrKarMax' value={paySlipReportFilterByKasrkarTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByKasrkarTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Mamouriat' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>ماموریت از:</Form.Label>
                                <NumberFormat type="text" id='MamouriatMin' value={paySlipReportFilterByMamouriat2From} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByMamouriat2From(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>ماموریت تا:</Form.Label>
                                <NumberFormat type="text" id='MamouriatMax' value={paySlipReportFilterByMamouriat2To} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByMamouriat2To(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'NobatKari' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>نوبت کاری از:</Form.Label>
                                <NumberFormat type="text" id='NobatKariMin' value={paySlipReportFilterByNobatKariFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByNobatKariFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>نوبت کاری تا:</Form.Label>
                                <NumberFormat type="text" id='NobatKariMax' value={paySlipReportFilterByNobatKariTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByNobatKariTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Morkhasi' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>خرید مرخصی از:</Form.Label>
                                <NumberFormat type="text" id='MorkhasiMin' value={paySlipReportFilterByMorkhasi1From} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByMorkhasi1From(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>خرید مرخصی تا:</Form.Label>
                                <NumberFormat type="text" id='MorkhasiMax' value={paySlipReportFilterByMorkhasi1To} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByMorkhasi1To(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Tasvieh' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>سنوات از:</Form.Label>
                                <NumberFormat type="text" id='TasviehMin' value={paySlipReportFilterByTasvieh1From} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByTasvieh1From(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>سنوات تا:</Form.Label>
                                <NumberFormat type="text" id='TasviehMax' value={paySlipReportFilterByTasvieh1To} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByTasvieh1To(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Mosaedeh' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>پیش پرداخل حقوق از:</Form.Label>
                                <NumberFormat type="text" id='MosaedehMin' value={paySlipReportFilterByHelpPayFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByHelpPayFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>پیش پرداخت حقوق تا:</Form.Label>
                                <NumberFormat type="text" id='MosaedehMax' value={paySlipReportFilterByHelpPayTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByHelpPayTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            {paySlipReportField !== '' && (paySlipReportField.length !== undefined && paySlipReportField.length !== 0) ?
                paySlipReportField.map(filter =>
                    filter.value === 'Ghest' ?
                        <Fragment>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>قسط وام از:</Form.Label>
                                <NumberFormat type="text" id='GhestMin' value={paySlipReportFilterByLoanPartFrom} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByLoanPartFrom(option.target.value));
                                    }}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                                <Form.Label className='mb-1'>قسط وام تا:</Form.Label>
                                <NumberFormat type="text" id='GhestMax' value={paySlipReportFilterByLoanPartTo} dir='ltr' className='form-control'
                                    onChange={(option) => {
                                        dispatch(RsetPaySlipReportFilterByLoanPartTo(option.target.value));
                                    }}
                                />
                            </Form.Group>
                        </Fragment>
                        : null
                )
                : null}
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'>
                <Form.Label className='mb-1'>از سال: </Form.Label>
                <Select
                    placeholder='انتخاب...'
                    isSearchable
                    value={paySlipReportFromYear}
                    options={year}
                    onChange={(option) => {
                        dispatch(RsetPaySlipReportFromYear(option));
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'>
                <Form.Label className='mb-1'>از ماه: </Form.Label>
                <Select
                    placeholder='انتخاب...'
                    isSearchable
                    value={paySlipReportFromMonth}
                    options={month}
                    onChange={(option) => {
                        dispatch(RsetPaySlipReportFromMonth(option));
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'>
                <Form.Label className='mb-1'>تا سال: </Form.Label>
                <Select
                    placeholder='انتخاب...'
                    isSearchable
                    value={paySlipReportToYear}
                    options={year}
                    onChange={(option) => {
                        dispatch(RsetPaySlipReportToYear(option));
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'>
                <Form.Label className='mb-1'>تا ماه: </Form.Label>
                <Select
                    placeholder='انتخاب...'
                    isSearchable
                    value={paySlipReportToMonth}
                    options={month}
                    onChange={(option) => {
                        dispatch(RsetPaySlipReportToMonth(option));
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' className='mb-4'>
                <Form.Label className='mb-1'>شرکت :</Form.Label>
                <Select
                    placeholder='انتخاب...'
                    isMulti
                    isSearchable
                    value={paySlipReportCompany}
                    options={paySlipReportCompanyOptions}
                    onChange={(option) => {
                        dispatch(RsetPaySlipReportCompany(option));
                    }}
                />
            </Form.Group>
            {/* <Col md='4' lg='3' xl='3' className='mt-3 mt-md-0'>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilter' value={realFilter} checked={realFilter} onChange={() => {dispatch(RsetRealFilter(!realFilter))}}/>
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end"> */}
            <Button variant='success' className='font12' onClick={() => {
                var string = '';
                var fields = '';
                var fieldsArr = [];
                if(paySlipReportField.length !== 0){
                    for(var i = 0 ; i < paySlipReportField.length ; i++){
                        var min = document.getElementById(`${paySlipReportField[i].value}Min`).value;
                        var max = document.getElementById(`${paySlipReportField[i].value}Max`).value;
                        fields = `${fields} ${paySlipReportField[i].value} <= ${max} and ${paySlipReportField[i].value} >= ${min} and `;
                        fieldsArr.push(paySlipReportField[i].value)
                    }
                }else{
                    fieldsArr = paySlipReportFieldOptions.map(field=>{return field.value})
                }
                string = `${string}DateMonth >= ${paySlipReportFromYear.value}${paySlipReportFromMonth.value} and DateMonth <= ${paySlipReportToYear.value}${paySlipReportToMonth.value}`
                var companies = '';
                for(var i = 0 ; i < paySlipReportCompany.length ; i++){
                    if(i !== paySlipReportCompany.length -1){
                        companies = `${companies} CompId = ${paySlipReportCompany[i].value} or`
                    }else{
                        companies = `${companies} CompId = ${paySlipReportCompany[i].value}`
                    }
                }
                if(companies !== ''){
                    string = `${fields} ${string} and (${companies} )`
                }else{
                    string = `${fields} ${string}`
                }
                dispatch(handlePaySlipReport({fields:String(fieldsArr), filterString: string}))
            }}>
                اعمال فیلتر
            </Button>
            {/* <Button variant='secondary' className='font12 ms-1' onClick={()=>dispatch(handleCancelFilter('leave'))}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col> */}
        </Row>
    )
}

export default PaySlipReportFilter;