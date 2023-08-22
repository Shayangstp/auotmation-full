import React, { Fragment, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rootContext } from "../../context/rootContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart, faHourglass, faHourglassEnd, faHome, faWarning } from "@fortawesome/free-solid-svg-icons";
import xssFilters from "xss-filters";
import { RsetActionToPersonsModal, selectFormErrors, RsetFormErrors } from "../../Slices/mainSlices";
import {
    selectDailyLeave, RsetDailyLeave, handleGetLeaveTypeList, selectLeaveTypeOptions,
    selectLeaveType, RsetLeaveType, selectLeaveFromDate, RsetLeaveFromDate, selectLeaveDescription,
    RsetLeaveDescription, selectLeaveFromHours, RsetLeaveFromHours, selectLeaveFromMinutes, RsetLeaveFromMinutes,
    selectLeaveToHours, RsetLeaveToHours, selectLeaveToMinutes, RsetLeaveToMinutes, handleResetNewLeaveReq,
    handleSubmitNewLeaveReq, selectLeaveDate, RsetLeaveDate, selectLeaveToDate, RsetLeaveToDate,
    handleGetLeaveStatus, selectLeaveStatus
} from "../../Slices/leaveSlice";
const LeaveReqRegistration = ({ setPageTitle }) => {

    // const mainContext = useContext(rootContext);
    // const {
    //     handleCheckPermission,
    //     menuPermission,
    // } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])

    const dispatch = useDispatch();
    const dailyLeave = useSelector(selectDailyLeave);
    const leaveType = useSelector(selectLeaveType);
    const leaveTypeOptions = useSelector(selectLeaveTypeOptions);
    const leaveFromDate = useSelector(selectLeaveFromDate);
    const leaveToDate = useSelector(selectLeaveToDate);
    const leaveDescription = useSelector(selectLeaveDescription);
    const leaveDate = useSelector(selectLeaveDate);
    const leaveFromHours = useSelector(selectLeaveFromHours);
    const leaveFromMinutes = useSelector(selectLeaveFromMinutes);
    const leaveToHours = useSelector(selectLeaveToHours);
    const leaveToMinutes = useSelector(selectLeaveToMinutes);
    const leaveStatus = useSelector(selectLeaveStatus);

    useEffect(() => {
        setPageTitle('ثبت درخواست مرخصی');
        dispatch(handleGetLeaveStatus());
    }, [setPageTitle])

    useEffect(() => {
        if (dailyLeave === true) {
            dispatch(handleGetLeaveTypeList(0));
        } else {
            dispatch(handleGetLeaveTypeList(1));
        }
    }, [dailyLeave])

    const formErrors = useSelector(selectFormErrors);
    const dayLeaveValidation = () => {
        var errors = {};
        if (!leaveType) {
            errors.leaveType = "انتخاب نوع مرخصی اجباری است!";
        }
        if (leaveFromDate === null) {
            errors.leaveFromDate = "انتخاب تاریخ شروع مرخصی اجباری است!";
        }
        if (leaveToDate === null) {
            errors.leaveToDate = "انتخاب تاریخ پایان مرخصی اجباری است!";
        }
        return errors;
    }
    const timeLeaveValidation = () => {
        var errors = {};
        if (!leaveType) {
            errors.leaveType = "انتخاب نوع مرخصی اجباری است!";
        }
        if (leaveDate === null) {
            errors.leaveDate = "انتخاب تاریخ مرخصی اجباری است!";
        }
        if (!leaveFromHours && !leaveFromMinutes) {
            errors.leaveFromTime = "انتخاب ساعت شروع اجباری است!";
        }
        if (!leaveToHours && !leaveToMinutes) {
            errors.leaveToTime = "انتخاب ساعت پایان اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (dailyLeave) {
            if (leaveType !== '' && leaveFromDate !== null && leaveToDate !== null) {
                dispatch(handleSubmitNewLeaveReq(e));
            } else {
                dispatch(RsetFormErrors(
                    dayLeaveValidation({
                        leaveType: leaveType,
                        leaveFromDate: leaveFromDate,
                        leaveToDate: leaveToDate
                    })
                ));
            }
        } else {
            if (leaveType !== '' && leaveDate !== null && leaveFromHours !== '' && leaveFromMinutes !== '' && leaveToHours !== '' && leaveToMinutes !== '') {
                dispatch(handleSubmitNewLeaveReq(e));
            } else {
                dispatch(RsetFormErrors(
                    timeLeaveValidation({
                        leaveType: leaveType,
                        leaveDate: leaveDate,
                        leaveFromTime: leaveFromHours,
                        leaveFromTime: leaveFromMinutes,
                        leaveToTime: leaveToHours,
                        leaveToTime: leaveToMinutes,
                    })
                ));
            }
        }
    }

    return (
        <Container>
            {/* {menuPermission ? */}
            <Fragment>
                <Row className="mb-5">
                    <Col>
                        <Alert variant="info">
                            <Alert.Heading className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faHourglassStart} className='me-2 font24' />
                                <span>مقدار کل مرخصی تا پایان سال <span className="">204</span> ساعت می باشد.</span>
                            </Alert.Heading>
                        </Alert>
                        <Alert variant="danger">
                            <Alert.Heading className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faHourglass} className='me-2 font24' />
                                <span>مرخصی استفاده شده تاکنون <span className="">{leaveStatus.remainderInfo !== undefined ? xssFilters.inHTMLData(leaveStatus.remainderInfo.usedHour) + ' ساعت و ' + xssFilters.inHTMLData(leaveStatus.remainderInfo.usedMin) : ''}</span> دقیقه می باشد.</span>
                            </Alert.Heading>
                        </Alert>
                        <Alert variant="success">
                            <Alert.Heading className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faHourglassEnd} className='me-2 font24' />
                                <span>مرخصی باقیمانده تا پایان سال <span className="">{leaveStatus.remainderInfo !== undefined ? xssFilters.inHTMLData(leaveStatus.remainderInfo.remainderHour) + ' ساعت و ' + xssFilters.inHTMLData(leaveStatus.remainderInfo.remainderMin) : ''}</span> دقیقه می باشد.</span>
                            </Alert.Heading>
                        </Alert>
                    </Col>
                </Row>
                <Row className='mb-5'>
                    <Col className='text-center text-md-start d-block d-md-flex align-items-center'>
                        <h1 className='font16 mb-0'>مرخصی </h1>
                        <div className="d-flex justify-content-center">
                            <div className='ms-md-4'>
                                <label className="me-2">ساعتی</label>
                                <Form.Check
                                    className='d-inline-block'
                                    type="switch"
                                    id="custom-switch"
                                    label="روزانه"
                                    checked={dailyLeave}
                                    onChange={() => { dispatch(RsetDailyLeave(!dailyLeave)) }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Form>
                    <Row>
                        <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>نوع مرخصی: </Form.Label>
                            <Select value={leaveType} name="leaveType" onChange={(e) => { dispatch(RsetLeaveType(e)) }} placeholder='انتخاب...' options={leaveTypeOptions} />
                            {!leaveType && (
                                <p className="font12 text-danger mb-0 mt-1">
                                    {formErrors.leaveType}
                                </p>
                            )}
                        </Form.Group>
                        {dailyLeave ?
                            <Fragment>
                                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>تاریخ شروع: </Form.Label>
                                    <DatePicker
                                        timePicker={false}
                                        setTodayOnBlur={true}
                                        inputReadOnly
                                        name="leaveFromDate"
                                        isGregorian={false}
                                        inputFormat="YYYY-MM-DD"
                                        inputJalaaliFormat="jYYYY/jMM/jDD"
                                        value={leaveFromDate}
                                        className="form-control"
                                        onChange={e => { dispatch(RsetLeaveFromDate(e)) }}
                                    />
                                    {!leaveFromDate && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveFromDate}
                                        </p>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>تاریخ اتمام: </Form.Label>
                                    <DatePicker
                                        timePicker={false}
                                        setTodayOnBlur={true}
                                        inputReadOnly
                                        name="leaveToDate"
                                        isGregorian={false}
                                        inputFormat="YYYY-MM-DD"
                                        inputJalaaliFormat="jYYYY/jMM/jDD"
                                        value={leaveToDate}
                                        className="form-control"
                                        onChange={e => { dispatch(RsetLeaveToDate(e)) }}
                                    />
                                    {!leaveToDate && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveToDate}
                                        </p>
                                    )}
                                </Form.Group>
                            </Fragment>
                            :
                            <Fragment>
                                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>تاریخ : </Form.Label>
                                    <DatePicker
                                        timePicker={false}
                                        setTodayOnBlur={true}
                                        inputReadOnly
                                        name="leaveDate"
                                        isGregorian={false}
                                        inputFormat="YYYY-MM-DD"
                                        inputJalaaliFormat="jYYYY/jMM/jDD"
                                        value={leaveDate}
                                        className="form-control"
                                        onChange={e => { dispatch(RsetLeaveDate(e)) }}
                                    />
                                    {!leaveDate && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveDate}
                                        </p>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md='2' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>از ساعت : </Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            as="select"
                                            className="bg-transparent border-0 text-center"
                                            value={leaveFromMinutes}
                                            onChange={e => {
                                                dispatch(RsetLeaveFromMinutes(e.target.value));
                                            }}
                                        >
                                            <option value="" disabled>--</option>
                                            <option value="00">00</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                            <option value="24">24</option>
                                            <option value="25">25</option>
                                            <option value="26">26</option>
                                            <option value="27">27</option>
                                            <option value="28">28</option>
                                            <option value="29">29</option>
                                            <option value="30">30</option>
                                            <option value="31">31</option>
                                            <option value="32">32</option>
                                            <option value="33">33</option>
                                            <option value="34">34</option>
                                            <option value="35">35</option>
                                            <option value="36">36</option>
                                            <option value="37">37</option>
                                            <option value="38">38</option>
                                            <option value="39">39</option>
                                            <option value="40">40</option>
                                            <option value="41">41</option>
                                            <option value="42">42</option>
                                            <option value="43">43</option>
                                            <option value="44">44</option>
                                            <option value="45">45</option>
                                            <option value="46">46</option>
                                            <option value="47">47</option>
                                            <option value="48">48</option>
                                            <option value="49">49</option>
                                            <option value="50">50</option>
                                            <option value="51">51</option>
                                            <option value="52">52</option>
                                            <option value="53">53</option>
                                            <option value="54">54</option>
                                            <option value="55">55</option>
                                            <option value="56">56</option>
                                            <option value="57">57</option>
                                            <option value="58">58</option>
                                            <option value="59">59</option>
                                        </Form.Control>
                                        <span>:</span>
                                        <Form.Control
                                            as="select"
                                            className="bg-transparent border-0 text-center"
                                            value={leaveFromHours}
                                            onChange={e => {
                                                dispatch(RsetLeaveFromHours(e.target.value));
                                            }}
                                        >
                                            <option value="" disabled>--</option>
                                            <option value="00">00</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                        </Form.Control>
                                    </div>
                                    {!leaveFromHours && !leaveFromMinutes && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveFromTime}
                                        </p>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md='2' className='mb-4'>
                                    <Form.Label className='mb-1 required-field'>تا ساعت : </Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            as="select"
                                            className="bg-transparent border-0 text-center"
                                            value={leaveToMinutes}
                                            onChange={e => {
                                                dispatch(RsetLeaveToMinutes(e.target.value));
                                            }}
                                        >
                                            <option value="" disabled>--</option>
                                            <option value="00">00</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                            <option value="24">24</option>
                                            <option value="25">25</option>
                                            <option value="26">26</option>
                                            <option value="27">27</option>
                                            <option value="28">28</option>
                                            <option value="29">29</option>
                                            <option value="30">30</option>
                                            <option value="31">31</option>
                                            <option value="32">32</option>
                                            <option value="33">33</option>
                                            <option value="34">34</option>
                                            <option value="35">35</option>
                                            <option value="36">36</option>
                                            <option value="37">37</option>
                                            <option value="38">38</option>
                                            <option value="39">39</option>
                                            <option value="40">40</option>
                                            <option value="41">41</option>
                                            <option value="42">42</option>
                                            <option value="43">43</option>
                                            <option value="44">44</option>
                                            <option value="45">45</option>
                                            <option value="46">46</option>
                                            <option value="47">47</option>
                                            <option value="48">48</option>
                                            <option value="49">49</option>
                                            <option value="50">50</option>
                                            <option value="51">51</option>
                                            <option value="52">52</option>
                                            <option value="53">53</option>
                                            <option value="54">54</option>
                                            <option value="55">55</option>
                                            <option value="56">56</option>
                                            <option value="57">57</option>
                                            <option value="58">58</option>
                                            <option value="59">59</option>
                                        </Form.Control>
                                        <span>:</span>
                                        <Form.Control
                                            as="select"
                                            className="bg-transparent border-0 text-center"
                                            value={leaveToHours}
                                            onChange={e => {
                                                dispatch(RsetLeaveToHours(e.target.value));
                                            }}
                                        >
                                            <option value="" disabled>--</option>
                                            <option value="00">00</option>
                                            <option value="01">01</option>
                                            <option value="02">02</option>
                                            <option value="03">03</option>
                                            <option value="04">04</option>
                                            <option value="05">05</option>
                                            <option value="06">06</option>
                                            <option value="07">07</option>
                                            <option value="08">08</option>
                                            <option value="09">09</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                            <option value="22">22</option>
                                            <option value="23">23</option>
                                        </Form.Control>
                                    </div>
                                    {!leaveToHours && !leaveToMinutes && (
                                        <p className="font12 text-danger mb-0 mt-1">
                                            {formErrors.leaveToTime}
                                        </p>
                                    )}
                                </Form.Group>
                            </Fragment>
                        }
                        <Form.Group as={Col} md='12'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control as="textarea" rows={10} maxLength={2000} name='leaveDescription' value={leaveDescription} onChange={e => dispatch(RsetLeaveDescription(e.target.value))} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                            <Button variant='success' id='confirmReq' onClick={(e) => submitFormBtn(e)}>
                                ثبت درخواست
                            </Button>
                            <Button variant='primary' id='sendToPersons' className='mx-3 disabled' onClick={(e) => dispatch(RsetActionToPersonsModal(true))}>
                                ارسال
                            </Button>
                            <Button variant='secondary' type='reset' onClick={() => { dispatch(handleResetNewLeaveReq()) }}>
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
            {/* :
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                            کاربر گرامی شما به این بخش دسترسی ندارید. 
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">   
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2'/>
                                        صفحه اصلی
                                    </Button>
                                </Link>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            } */}
        </Container>
    )
}
export default LeaveReqRegistration;