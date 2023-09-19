import React, { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import {
    selectSerialFilter, RsetSerialFilter, selectUserFilter, RsetUserFilter,
    selectStatusFilter, RsetStatusFilter, selectFromDateFilter, RsetFromDateFilter,
    selectToDateFilter, RsetToDateFilter, selectRealFilter, RsetRealFilter,
    handleAllStatuses, selectStatusOptions,
    selectYearFilter, RsetYearFilter, handleCancelFilter,
} from "../../Slices/filterSlices";
import { handleReqsList, selectRequestMemb, selectActiveTab } from '../../Slices/mainSlices';
import { useDispatch, useSelector } from "react-redux";

const LeaveReqsFilter = () => {
    const dispatch = useDispatch();
    const serialFilter = useSelector(selectSerialFilter);
    const userFilter = useSelector(selectUserFilter);
    const statusFilter = useSelector(selectStatusFilter);
    const fromDateFilter = useSelector(selectFromDateFilter);
    const toDateFilter = useSelector(selectToDateFilter);
    const realFilter = useSelector(selectRealFilter);
    const requestMembs = useSelector(selectRequestMemb);
    const statusOptions = useSelector(selectStatusOptions);
    const yearFilter = useSelector(selectYearFilter);
    const activeTab = useSelector(selectActiveTab);

    useEffect(() => {
        dispatch(handleAllStatuses(4));
    }, [])

    const year = new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4);
    const years = [
        { value: year - 2, label: year - 2 },
        { value: year - 1, label: year - 1 },
        { value: year, label: year },
    ]

    const handleFilterGroup = () => {
        if (activeTab === 'myReqs') {
            return 2
        } else if (activeTab === 'inProcessReqs') {
            return 0
        } else if (activeTab === 'allReqs') {
            return 1
        }
    }

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='serial' className='mb-1'>سریال:</Form.Label>
                <NumberFormat type="text" value={serialFilter} format="######" mask='-' dir='ltr' className='form-control'
                    onChange={(option) => {
                        dispatch(RsetSerialFilter(option.target.value));
                        if (realFilter && option.target.value.replaceAll('-', '').length === 6) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: option.target.value,
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                    onKeyUp={(option) => {
                        option.which = option.which || option.keyCode;
                        if (option.which === 13) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: option.target.value,
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        if (activeTab !== '') {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                type: 4,
                                group: handleFilterGroup()
                            }
                            dispatch(handleReqsList(filterParams));
                        }
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'>درخواست کننده:</Form.Label>
                <Select
                    id='members'
                    placeholder='همه'
                    isSearchable
                    value={userFilter}
                    options={requestMembs}
                    onChange={(option) => {
                        dispatch(RsetUserFilter(option));
                        if (realFilter) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: serialFilter,
                                    memberId: option !== '' ? option.value : option,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        if (activeTab !== '') {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                type: 4,
                                group: handleFilterGroup()
                            }
                            dispatch(handleReqsList(filterParams));
                        }
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'>وضعیت درخواست:</Form.Label>
                <Select
                    id='stauses'
                    placeholder='همه'
                    isSearchable
                    value={statusFilter}
                    options={statusOptions}
                    onChange={(option) => {
                        dispatch(RsetStatusFilter(option));
                        if (realFilter) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: serialFilter,
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    status: option !== '' ? option.value : option,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='fromDate' className='mb-1'>از تاریخ درخواست :</Form.Label>
                <DatePicker
                    inputReadOnly
                    name='from_date'
                    isGregorian={false}
                    timePicker={false}
                    inputFormat="YYYY-MM-DD"
                    value={fromDateFilter}
                    className="form-control"
                    onChange={value => {
                        dispatch(RsetFromDateFilter(value));
                        if (realFilter) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: serialFilter,
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-lg-0 mb-xl-4'>
                <Form.Label id='toDate' className='mb-1'>تا تاریخ درخواست :</Form.Label>
                <DatePicker
                    inputReadOnly
                    name='from_date'
                    isGregorian={false}
                    timePicker={false}
                    inputFormat="YYYY-MM-DD"
                    value={toDateFilter}
                    className="form-control"
                    onChange={value => {
                        dispatch(RsetToDateFilter(value));
                        if (realFilter) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: serialFilter,
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                    year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-lg-0'>
                <Form.Label id='firstname' className='mb-1'> سال :</Form.Label>
                <Select
                    placeholder={year}
                    isSearchable
                    value={yearFilter}
                    options={years}
                    onChange={(option) => {
                        dispatch(RsetYearFilter(option));
                        if (realFilter) {
                            if (activeTab !== '') {
                                const filterParams = {
                                    applicantId: localStorage.getItem('id'),
                                    serial: serialFilter,
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    year: typeof (option.value) !== 'string' ? option.value.toString() : option.value,
                                    type: 4,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterParams));
                            }
                        }
                    }}
                />
            </Form.Group>
            <Col md='4' lg='3' xl='3' className='mt-3 mt-md-0'>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilter' value={realFilter} checked={realFilter} onChange={() => { dispatch(RsetRealFilter(!realFilter)) }} />
                    <Form.Label className='ms-2 font10 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={() => {
                        if (activeTab !== '') {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof (yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                type: 4,
                                group: handleFilterGroup()
                            }
                            dispatch(handleReqsList(filterParams));
                        }
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={() => dispatch(handleCancelFilter('leave'))}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default LeaveReqsFilter;
