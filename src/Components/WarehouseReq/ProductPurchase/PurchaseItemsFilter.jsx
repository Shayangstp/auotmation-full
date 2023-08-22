import React, { useContext, useEffect } from "react";
import { rootContext } from "../../context/rootContext";
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker2';
import Select from 'react-select';
import NumberFormat from "react-number-format";

import { useDispatch, useSelector } from "react-redux";
import { handleAllItems, selectRequestMemb } from '../../Slices/mainSlices';
import { handleAllStatuses, selectStatusOptions, selectSerialFilter, RsetSerialFilter, selectStatusFilter, RsetStatusFilter,
    selectFromDateFilter, RsetFromDateFilter, selectToDateFilter, RsetToDateFilter, selectRealFilter, RsetRealFilter,
    selectUserFilter, RsetUserFilter, handleCancelFilter
} from "../../Slices/filterSlices";

const PurchaseItemsFilter = () => {
    const dispatch = useDispatch();
    const requestMembs = useSelector(selectRequestMemb);
    const serialFilter = useSelector(selectSerialFilter);
    const statusFilter = useSelector(selectStatusFilter);
    const fromDateFilter = useSelector(selectFromDateFilter);
    const toDateFilter = useSelector(selectToDateFilter);
    const realFilter = useSelector(selectRealFilter);
    const statusOptions = useSelector(selectStatusOptions);
    const userFilter = useSelector(selectUserFilter);


    const mainContext = useContext(rootContext);
    const {
        serialFilterRef,
    } = mainContext;

    useEffect(() => {
        dispatch(handleAllStatuses(9));
    }, [])
    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-xl-0'>
                <Form.Label id='serial' className='mb-1'>سریال:</Form.Label>
                <NumberFormat type="text" value={serialFilter} format="######" mask='-' dir='ltr' className='form-control'
                    ref={serialFilterRef}
                    onChange={(option) => {
                        dispatch(RsetSerialFilter(option.target.value));
                        if (realFilter && serialFilterRef.current.state.numAsString.length === 5) {
                            const filterValues = {
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                serial: option.target.value,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }}
                    onKeyUp={(option) => {
                        option.which = option.which || option.keyCode;
                        if (option.which === 13) {
                            const filterValues = {
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                serial: option.target.value,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-xl-0'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterValues = {
                            memberId: userFilter !== '' ? userFilter.value : userFilter,
                            serial: serialFilter,
                            status: statusFilter !== '' ? statusFilter.value : statusFilter,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
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
                            const filterValues = {
                                memberId: option !== '' ? option.value : option,
                                serial: serialFilter,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-xl-0'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterValues = {
                            memberId: userFilter !== '' ? userFilter.value : userFilter,
                            serial: serialFilter,
                            status: statusFilter !== '' ? statusFilter.value : statusFilter,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
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
                            const filterValues = {
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                serial: serialFilter,
                                status: option !== '' ? option.value : option,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-md-0 mb-lg-4 mb-xl-0'>
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
                            const filterValues = {
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                serial: serialFilter,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-md-0'>
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
                            const filterValues = {
                                memberId: userFilter !== '' ? userFilter.value : userFilter,
                                serial: serialFilter,
                                status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }
                    }}
                />
            </Form.Group>
            <Col md='4' lg='3' xl='2' className=''>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilterReq' value={realFilter} checked={realFilter} onChange={() => { dispatch(RsetRealFilter(!realFilter)) }} />
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={() => {
                        const filterValues = {
                            memberId: userFilter !== '' ? userFilter.value : userFilter,
                            serial: serialFilter,
                            status: statusFilter !== '' ? statusFilter.value : statusFilter,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={() => 
                        dispatch(handleCancelFilter('purchaseItems'))
                    }>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default PurchaseItemsFilter;
