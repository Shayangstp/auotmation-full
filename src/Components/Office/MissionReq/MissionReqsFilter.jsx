import React, { useContext, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { rootContext } from "../../context/rootContext";

const MissionReqsFilter = () => {
    const mainContext = useContext(rootContext);
    const {
        handleAllStatuses,
        allStatuses,
        serialFilter,
        setSerialFilter,
        userIdFilterSelect,
        setUserIdFilterSelect,
        statusIdFilterSelect,
        setStatusIdFilterSelect,
        fromDateFilter,
        setFromDateFilter,
        toDateFilter,
        setToDateFilter,
        yearFilter,
        setYearFilter,
        cityFilter,
        setCityFilter,
        realFilter,
        setRealFilter,
        handleCancelFilter,
        usersFilterSelect,
        handleGetRequestList,
        handleCitiesByType,
        allCitiesByType,
    } = mainContext;

    useEffect(() => {
        handleAllStatuses(9);
        handleCitiesByType(9);
    }, [])

    const year = new Date().toLocaleDateString('fa-IR', {numberingSystem: 'latn'}).slice(0, 4);
    const years = [
        {value: year-2, label: year-2},
        {value: year-1, label: year-1},
        {value: year, label: year},
    ]

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='serial' className='mb-1'>سریال:</Form.Label>
                <NumberFormat type="text" value={serialFilter} format="######" mask='-' dir='ltr' className='form-control'
                    onChange={(option) => {
                        setSerialFilter(option.target.value);
                        if (realFilter && option.target.value.replaceAll('-', '').length === 6) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: option.target.value,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
                        }
                    }}
                    onKeyUp={(option) => {
                        option.which = option.which || option.keyCode;
                        if (option.which === 13) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: option.target.value,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            serial: serialFilter,
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                            city: cityFilter !== '' ? cityFilter.value : cityFilter,
                            type: 9
                        }
                        handleGetRequestList(filterParams);
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
                                serial: serialFilter,
                                memberId: option !== '' ? option.value : option,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            serial: serialFilter,
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                            city: cityFilter !== '' ? cityFilter.value : cityFilter,
                            type: 9
                        }
                        handleGetRequestList(filterParams);
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
                                serial: serialFilter,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: option !== '' ? option.value : option,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
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
                        setFromDateFilter(value);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
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
                        setToDateFilter(value);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
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
                        setYearFilter(option);
                        if(realFilter){
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: typeof(option.value) !== 'string' ? option.value.toString() : option.value,
                                city: cityFilter !== '' ? cityFilter.value : cityFilter,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
                        }
                    } }
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4 mb-md-0'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            serial: serialFilter,
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                            city: cityFilter !== '' ? cityFilter.value : cityFilter,
                            type: 9
                        }
                        handleGetRequestList(filterParams);
                    }
                }}
            >
                <Form.Label id='firstname' className='mb-1'> شهر:</Form.Label>
                <Select
                    id='stauses'
                    placeholder='همه'
                    isSearchable
                    value={cityFilter}
                    options={allCitiesByType}
                    onChange={(option) => {
                        setCityFilter(option);
                        if (realFilter) {
                            const filterParams = {
                                applicantId: localStorage.getItem('id'),
                                serial: serialFilter,
                                memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                                city: option !== '' ? option.value : option,
                                type: 9
                            }
                            handleGetRequestList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Col md='4' lg='3' xl='3' className='mt-3 mt-md-0'>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilter' value={realFilter} checked={realFilter} onChange={() => {setRealFilter(!realFilter)}}/>
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={()=>{
                        const filterParams = {
                            applicantId: localStorage.getItem('id'),
                            serial: serialFilter,
                            memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                            city: cityFilter !== '' ? cityFilter.value : cityFilter,
                            type: 9
                        }
                        handleGetRequestList(filterParams);
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={()=>handleCancelFilter('mission')}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default MissionReqsFilter;
