import React, { useContext, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import NumberFormat from "react-number-format";
import { rootContext } from "../../../context/rootContext";
import { useSelector, useDispatch } from "react-redux";
import { selectLeaveTypeFilterSelect, RsetLeaveTypeFilterSelect, selectLeaveTypeeFilterSelect, RsetLeaveTypeeFilterSelect,
    selectLeaveAddOrSubFilterSelect, RsetLeaveAddOrSubFilterSelect
} from "../../../Slices/mainSlices";

const LeaveReqsFilter = () => {

    const dispatch = useDispatch();
    const leaveTypeFilterSelect = useSelector(selectLeaveTypeFilterSelect);
    const leaveTypeeFilterSelect = useSelector(selectLeaveTypeeFilterSelect);
    const leaveAddOrSubFilterSelect = useSelector(selectLeaveAddOrSubFilterSelect);

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
        realFilter,
        setRealFilter,
        usersFilterSelect,
        handleCancelFilter,
        handleGetRequestList
    } = mainContext;

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        console.log('enter filter')
                    }
                }}
            >
                <Form.Label id='leaveType' className='mb-1'>نوع مرخصی:</Form.Label>
                <Select
                    id='type'
                    placeholder='همه'
                    isSearchable
                    value={leaveTypeFilterSelect}
                    options={[]}
                    onChange={(option) => {
                        dispatch(RsetLeaveTypeFilterSelect(option));
                        if (realFilter) {
                            console.log('real filter')
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        console.log('enter filter')
                    }
                }}
            >
                <Form.Label id='leaveType' className='mb-1'>نوع مرخصی:</Form.Label>
                <Select
                    id='type'
                    placeholder='همه'
                    isSearchable
                    value={leaveTypeeFilterSelect}
                    options={[]}
                    onChange={(option) => {
                        dispatch(RsetLeaveTypeeFilterSelect(option));
                        if (realFilter) {
                            console.log('real filter')
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'
                onKeyUp={(option) => {
                    option.which = option.which || option.keyCode;
                    if (option.which === 13) {
                        console.log('enter filter')
                    }
                }}
            >
                <Form.Label id='leaveType' className='mb-1'>کسر / اضافه:</Form.Label>
                <Select
                    id='type'
                    placeholder='همه'
                    isSearchable
                    value={leaveAddOrSubFilterSelect}
                    options={[]}
                    onChange={(option) => {
                        dispatch(RsetLeaveAddOrSubFilterSelect(option));
                        if (realFilter) {
                            console.log('real filter')
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
                            // const filterParams = {
                            //     applicantId: localStorage.getItem('id'),
                            //     serial: serialFilter,
                            //     memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            //     status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            //     fromDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                            //     toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                            //     year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                            //     type: 4
                            // }
                            // handleGetRequestList(filterParams);
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
                            // const filterParams = {
                            //     applicantId: localStorage.getItem('id'),
                            //     serial: serialFilter,
                            //     memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                            //     status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                            //     fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                            //     toDate: value !== null ? value.format('YYYY/MM/DD') : 'null',
                            //     year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                            //     type: 4
                            // }
                            // handleGetRequestList(filterParams);
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4 mb-lg-0'>
                
            </Form.Group>
            <Col md='4' lg='3' xl='3' className='mt-3 mt-md-0'>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilter' value={realFilter} checked={realFilter} onChange={() => {setRealFilter(!realFilter)}}/>
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={()=>{
                        // const filterParams = {
                        //     applicantId: localStorage.getItem('id'),
                        //     serial: serialFilter,
                        //     memberId: userIdFilterSelect !== '' ? userIdFilterSelect.value : userIdFilterSelect,
                        //     status: statusIdFilterSelect !== '' ? statusIdFilterSelect.value : statusIdFilterSelect,
                        //     fromDate: fromDateFilter !== null ? fromDateFilter.format('YYYY/MM/DD') : 'null',
                        //     toDate: toDateFilter !== null ? toDateFilter.format('YYYY/MM/DD') : 'null',
                        //     year: yearFilter !== '' ? typeof(yearFilter.value) !== 'string' ? yearFilter.value.toString() : yearFilter.value : yearFilter,
                        //     type: 4
                        // }
                        // handleGetRequestList(filterParams);
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={()=>{
                        //handleCancelFilter('leave')
                    }}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default LeaveReqsFilter;
