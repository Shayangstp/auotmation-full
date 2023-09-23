import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker2';
import Select from 'react-select';
import xssFilters from "xss-filters";

import { rootContext } from "../context/rootContext";
import { selectUser, handleReqsList, selectRequestMemb, selectActiveTab } from '../Slices/mainSlices';
import {
    selectUserFilter, RsetUserFilter, selectStatusFilter, RsetStatusFilter, selectFromDateFilter, RsetFromDateFilter, selectToDateFilter, RsetToDateFilter,
    selectRealFilter, RsetRealFilter, handleAllStatuses, selectStatusOptions, handleCancelFilter
} from '../Slices/filterSlices';

const ReqItem = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const userFilter = useSelector(selectUserFilter);
    const requestMemb = useSelector(selectRequestMemb);
    const statusFilter = useSelector(selectStatusFilter);
    const fromDateFilter = useSelector(selectFromDateFilter);
    const toDateFilter = useSelector(selectToDateFilter);
    const realFilter = useSelector(selectRealFilter);
    const statusOptions = useSelector(selectStatusOptions);
    const activeTab = useSelector(selectActiveTab);

    const mainContext = useContext(rootContext);
    const {
        handleGetCoDepartments,
        coDepartmentsWithAll,
        departmentIdFilterSelect,
        setDepartmentIdFilterSelect,
    } = mainContext;

    useEffect(() => {
        dispatch(handleAllStatuses(2));
    }, [])

    useEffect(() => {
        if (user.Location !== undefined && user.Location !== null) {
            handleGetCoDepartments(user.CompanyCode, user.Location);
        }
    }, [user])

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
        <div className="d-flex flex-column  mb-5 lightGray2-bg p-3 borderRadius m-auto shadow border border-white border-2">
            <Row className='justify-content-start py-2'>
                <div className="d-flex">
                    <Form.Group className="d-flex align-items-center mb-4 justify-content-end">
                        <Form.Switch
                            type="checkbox"
                            name="realFilterReq"
                            value={realFilter}
                            checked={realFilter}
                            onChange={() => {
                                dispatch(RsetRealFilter(!realFilter));
                            }}
                        />
                        <Form.Label className="ms-1 font12 mb-0">
                            {" "}
                            فیلتر لحظه ای{" "}
                        </Form.Label>
                    </Form.Group>
                </div>
                <Form.Group as={Col} md='4' xl='2' className='mb-4 mb-xl-0'>
                    <Form.Label id='firstname' className='mb-1'>درخواست کننده :</Form.Label>
                    <Select
                        id='members'
                        placeholder='همه'
                        isSearchable
                        value={userFilter}
                        options={requestMemb}
                        onChange={(option) => {
                            dispatch(RsetUserFilter(option));
                            if (realFilter) {
                                if (activeTab !== '') {
                                    const filterValues = {
                                        applicantId: localStorage.getItem('id'),
                                        memberId: option !== '' ? option.value : option,
                                        mDep: departmentIdFilterSelect !== '' ? departmentIdFilterSelect.value : departmentIdFilterSelect,
                                        status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                        fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                        toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                        type: 2,
                                        group: handleFilterGroup()
                                    }
                                    dispatch(handleReqsList(filterValues));
                                }
                            }
                        }}
                    />
                </Form.Group>
                <Form.Group as={Col} md='4' xl='2' className='mb-4 mb-xl-0'>
                    <Form.Label id='firstname' className='mb-1'>واحد سازمانی :</Form.Label>
                    <Select
                        id='deps'
                        placeholder='همه'
                        isSearchable
                        value={departmentIdFilterSelect}
                        options={coDepartmentsWithAll}
                        onChange={(option) => {
                            setDepartmentIdFilterSelect(option);
                            if (realFilter) {
                                if (activeTab !== '') {
                                    const filterValues = {
                                        applicantId: localStorage.getItem('id'),
                                        memberId: userFilter !== '' ? userFilter.value : userFilter,
                                        mDep: option !== '' ? option.value : option,
                                        status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                        fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                        toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                        type: 2,
                                        group: handleFilterGroup()
                                    }
                                    dispatch(handleReqsList(filterValues));
                                }
                            }
                        }}
                    />
                </Form.Group>
                <Form.Group as={Col} md='4' xl='2' className='mb-4 mb-xl-0'>
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
                                    const filterValues = {
                                        applicantId: localStorage.getItem('id'),
                                        memberId: userFilter !== '' ? userFilter.value : userFilter,
                                        mDep: departmentIdFilterSelect !== '' ? departmentIdFilterSelect.value : departmentIdFilterSelect,
                                        status: option !== '' ? option.value : option,
                                        fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                        toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                        type: 2,
                                        group: handleFilterGroup()
                                    }
                                    dispatch(handleReqsList(filterValues));
                                }
                            }
                        }}
                    />
                </Form.Group>
                <Form.Group as={Col} md='4' xl='3' className='mb-4 mb-md-0'>
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
                                    const filterValues = {
                                        applicantId: localStorage.getItem('id'),
                                        memberId: userFilter !== '' ? userFilter.value : userFilter,
                                        mDep: departmentIdFilterSelect !== '' ? departmentIdFilterSelect.value : departmentIdFilterSelect,
                                        status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                        fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                        toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                        type: 2,
                                        group: handleFilterGroup()
                                    }
                                    dispatch(handleReqsList(filterValues));
                                }
                            }
                        }}
                    />
                </Form.Group>
                <Form.Group as={Col} md='4' xl='3' className='mb-4 mb-md-0'>
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
                                    const filterValues = {
                                        applicantId: localStorage.getItem('id'),
                                        memberId: userFilter !== '' ? userFilter.value : userFilter,
                                        mDep: departmentIdFilterSelect !== '' ? departmentIdFilterSelect.value : departmentIdFilterSelect,
                                        status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                        fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                        toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                        type: 2,
                                        group: handleFilterGroup()
                                    }
                                    dispatch(handleReqsList(filterValues));
                                }
                            }
                        }}
                    />
                </Form.Group>
                </Row>
                <Row className="justify-content-end mt-4">
                <Col md='4' xl='3'>
                    <div className="d-flex justify-content-end">
                        <Button variant='success' className='font12' onClick={() => {
                            if (activeTab !== '') {
                                const filterValues = {
                                    applicantId: localStorage.getItem('id'),
                                    memberId: userFilter !== '' ? userFilter.value : userFilter,
                                    mDep: departmentIdFilterSelect !== '' ? departmentIdFilterSelect.value : departmentIdFilterSelect,
                                    status: statusFilter !== '' ? statusFilter.value : statusFilter,
                                    fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                    toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                    type: 2,
                                    group: handleFilterGroup()
                                }
                                dispatch(handleReqsList(filterValues));
                                console.log(filterValues);
                            }
                        }}>
                            اعمال فیلتر
                        </Button>
                        <Button variant='secondary' className='font12 ms-1' onClick={() => dispatch(handleCancelFilter('warehouse'))}>
                            لغو فیلتر
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ReqItem;
