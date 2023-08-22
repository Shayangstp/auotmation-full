import React, { useContext, useEffect } from "react";
import { rootContext } from "../context/rootContext";
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker2';
import Select from 'react-select';
import { allNewReqsContext } from "../context/allNewReqsContext/allNewReqsContext";

const MyReqsFilter = () => {
    const mainContext = useContext(rootContext);
    const {
        handleAllStatuses,
        allStatuses,
        typeFilterSelect,
        setTypeFilterSelect,
        userIdFilterSelect,
        setUserIdFilterSelect,
        statusIdFilterSelect,
        setStatusIdFilterSelect,
        fromDateFilter,
        setFromDateFilter,
        toDateFilter,
        setToDateFilter,
        realFilter,
        setRealFilter,
        handleGetAllNewReqsList,
        handleCancelFilter,
        usersFilterSelect,
    } = mainContext;

    useEffect(() => {
        handleAllStatuses('all');
    }, [])

    const allNewRequestContext = useContext(allNewReqsContext);
    const {
        handleReqCategories,
        reqCategoriesList,
    } = allNewRequestContext;

    useEffect(()=>{
        handleReqCategories();
    },[])

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-xl-0'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            memberId: option !== '' ? option.value : option,
                            type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        handleGetAllNewReqsList(filterParams);
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'>درخواست کننده:</Form.Label>
                <Select
                    id='members'
                    placeholder='همه'
                    isSearchable
                    value={userIdFilterSelect}
                    options={usersFilterSelect}
                    onChange={(option) => {
                        setUserIdFilterSelect(option);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                memberId: option !== '' ? option.value : option,
                                type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            handleGetAllNewReqsList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-xl-0'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            type : option !== '' ? option.value : option,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        handleGetAllNewReqsList(filterParams);
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'>دسته بندی:</Form.Label>
                <Select
                    id='supMembers'
                    placeholder='همه'
                    isSearchable
                    value={typeFilterSelect}
                    options={reqCategoriesList}
                    onChange={(option) => {
                        setTypeFilterSelect(option);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                type : option !== '' ? option.value : option,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            handleGetAllNewReqsList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-xl-0'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                            status: option !== '' ? option.value : option,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        handleGetAllNewReqsList(filterParams);
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'>وضعیت درخواست:</Form.Label>
                <Select
                    id='stauses'
                    placeholder='همه'
                    isSearchable
                    value={statusIdFilterSelect}
                    options={allStatuses}
                    onChange={(option) => {
                        setStatusIdFilterSelect(option);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                                status: option !== '' ? option.value : option,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            handleGetAllNewReqsList(filterParams);
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
                        setFromDateFilter(value);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            }
                            handleGetAllNewReqsList(filterParams);
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
                        setToDateFilter(value);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                            }
                            handleGetAllNewReqsList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Col md='4' lg='3' xl='2' className=''>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilterReq' value={realFilter} checked={realFilter} onChange={() => { setRealFilter(!realFilter) }} />
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={() => {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            type : typeFilterSelect !== '' ? typeFilterSelect.value : typeFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        }
                        handleGetAllNewReqsList(filterParams);
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={() => handleCancelFilter('allNewReqs')}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default MyReqsFilter;
