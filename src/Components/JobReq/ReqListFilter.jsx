import React, { useContext, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker2';
import Select from 'react-select';
import NumberFormat from "react-number-format";
import { rootContext } from './../context/rootContext';

const ReqListFilter = ({ cancelFilter, setLoading }) => {
    const mainContext = useContext(rootContext);
    const {
        handleGetCompanies,
        campaniesWithAll,
        handleAllStatuses,
        allStatuses,
        realFilter,
        setRealFilter,
        serialFilter,
        setSerialFilter,
        statusIdFilterSelect,
        setStatusIdFilterSelect,
        companyFilterSelect,
        setCompanyFilterSelect,
        fromDateFilter,
        setFromDateFilter,
        toDateFilter,
        setToDateFilter,
        handleGetRequestList
    } = mainContext;

    useEffect(() => {
        handleGetCompanies();
        handleAllStatuses(13);
    }, [])
    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='serial' className='mb-1'>سریال:</Form.Label>
                <NumberFormat type="text" value={serialFilter} format="######" mask='-' dir='ltr' className='form-control'
                    onChange={(option) => {
                        setSerialFilter(option.target.value);
                        const valueLength = option.target.value.replace(/-/g, '').length;
                        if (realFilter && valueLength === 6) {
                            const filterValues = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? option.target.value : '',
                                company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                type: 13
                            }
                            handleGetRequestList(filterValues);
                        }
                    }}
                    onKeyUp={(option) => {
                        option.which = option.which || option.keyCode;
                        if (option.which === 13) {
                            const valueLength = option.target.value.replace(/-/g, '').length;
                            const filterValues = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? option.target.value : '',
                                company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                type: 13
                            }
                            handleGetRequestList(filterValues);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' xl='2' className='mb-4 mb-xl-0'>
                <Form.Label id='firstname' className='mb-1'> شرکت :</Form.Label>
                <Select
                    id='companies'
                    placeholder='همه'
                    isSearchable
                    value={companyFilterSelect}
                    options={campaniesWithAll}
                    onChange={(option) => {
                        setCompanyFilterSelect(option);
                        if (realFilter) {
                            const valueLength = serialFilter.replace(/-/g, '').length;
                            const filterValues = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? serialFilter : '',
                                company: option !== '' ? option.value : option,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                type: 13
                            }
                            handleGetRequestList(filterValues);
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
                    value={statusIdFilterSelect}
                    options={allStatuses}
                    onChange={(option) => {
                        setStatusIdFilterSelect(option);
                        if (realFilter) {
                            const valueLength = serialFilter.replace(/-/g, '').length;
                            const filterValues = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? serialFilter : '',
                                company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                                status: option !== '' ? option.value : option,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                type: 13
                            }
                            handleGetRequestList(filterValues);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' xl='2' className='mb-4 mb-md-0'>
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
                            const valueLength = serialFilter.replace(/-/g, '').length;
                            const filterValues = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? serialFilter : '',
                                company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                                type: 13
                            }
                            handleGetRequestList(filterValues);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' xl='2' className='mb-4 mb-md-0'>
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
                            const valueLength = serialFilter.replace(/-/g, '').length;
                            const filterValues = {
                                applicantId: localStorage.getItem('id'),
                                serial: valueLength === 6 ? serialFilter : '',
                                company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                                status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                                fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                                toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                                type: 13
                            }
                            handleGetRequestList(filterValues);
                        }
                    }}
                />
            </Form.Group>
            <Col md='4' xl='3' className='mt-3 mt-md-0'>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilterReq' value={realFilter} checked={realFilter} onChange={() => { setRealFilter(!realFilter) }} />
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={() => { 
                        const valueLength = serialFilter.replace(/-/g, '').length;
                        const filterValues = {
                            applicantId: localStorage.getItem('id'),
                            serial: valueLength === 6 ? serialFilter : '',
                            company: companyFilterSelect !== '' ? companyFilterSelect.value : companyFilterSelect,
                            status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            type: 13
                        }
                        handleGetRequestList(filterValues);
                     }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={() => cancelFilter()}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default ReqListFilter;
