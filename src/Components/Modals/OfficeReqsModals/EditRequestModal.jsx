import React, {useEffect, Fragment} from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import { useDispatch, useSelector } from "react-redux";
import { selectEditReqModal, RsetEditReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";
import { RsetLeaveDescription, RsetLeaveType, selectLeaveTypeOptions, handleGetLeaveTypeList,
    RsetLeaveFromDate, RsetLeaveToDate, RsetLeaveDate, selectLeaveDate, selectLeaveFromDate, selectLeaveToDate,
    RsetLeaveFromMinutes, RsetLeaveFromHours, selectLeaveFromMinutes, selectLeaveFromHours, RsetLeaveToHours,
    RsetLeaveToMinutes, selectLeaveToMinutes, selectLeaveToHours, handleEditLeaveReq, selectLeaveDescription
} from "../../Slices/leaveSlice";
import moment from "moment-jalaali";

const EditRequestModal = () => {

    const dispatch = useDispatch();
    const editReqModal = useSelector(selectEditReqModal);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const leaveTypeOptions = useSelector(selectLeaveTypeOptions);
    const leaveFromDate = useSelector(selectLeaveFromDate);
    const leaveFromMinutes = useSelector(selectLeaveFromMinutes);
    const leaveFromHours = useSelector(selectLeaveFromHours);
    const leaveToMinutes = useSelector(selectLeaveToMinutes);
    const leaveToHours = useSelector(selectLeaveToHours);
    const leaveToDate = useSelector(selectLeaveToDate);
    const leaveDate = useSelector(selectLeaveDate);

    useEffect(()=>{
        dispatch(RsetLeaveDate(null));
        dispatch(RsetLeaveFromHours(''));
        dispatch(RsetLeaveFromMinutes(''));
        dispatch(RsetLeaveToHours(moment('')));
        dispatch(RsetLeaveToMinutes(moment('')));
        dispatch(RsetLeaveDescription(''));
        dispatch(RsetLeaveFromDate(null));
        dispatch(RsetLeaveToDate(null));
    },[])

    useEffect(()=>{
        if (currentReqInfo.leaveKind === 1) {
            dispatch(RsetLeaveFromDate(moment(currentReqInfo.startDate)));
            dispatch(RsetLeaveToDate(moment(currentReqInfo.endDate)));
        } else {
            dispatch(RsetLeaveDate(moment(currentReqInfo.startDate)));
            dispatch(RsetLeaveFromHours(moment(currentReqInfo.startDate).format('HH')));
            dispatch(RsetLeaveFromMinutes(moment(currentReqInfo.startDate).format('mm')));
            dispatch(RsetLeaveToHours(moment(currentReqInfo.endDate).format('HH')));
            dispatch(RsetLeaveToMinutes(moment(currentReqInfo.endDate).format('mm')));
        }
    },[currentReqInfo])

    useEffect(() => {
        if (currentReqInfo.leaveKind === 1) {
            dispatch(handleGetLeaveTypeList(0));
        } else {
            dispatch(handleGetLeaveTypeList(1));
        }
    }, [currentReqInfo.leaveKind])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={editReqModal}
            onHide={() => {
                dispatch(RsetEditReqModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-primary text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>ویرایش درخواست شماره </span>
                        <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                    </div>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                        <Form.Label className='mb-1 required-field'>نوع مرخصی: </Form.Label>
                        <Select defaultValue={{label: currentReqInfo.leaveTypeName, value: currentReqInfo.leaveTypeId}} name="leaveType" onChange={(e) => { dispatch(RsetLeaveType(e)) }} placeholder='انتخاب...' options={leaveTypeOptions} />
                    </Form.Group>
                    {currentReqInfo.leaveKind === 1 ?
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
                                </Form.Group>
                            </Fragment>
                        }
                    <Form.Group as={Col} md='12'>
                        <Form.Label className='mb-1'>توضیحات: </Form.Label>
                        <Form.Control as="textarea" rows={10} maxLength={2000} name='leaveDescription' defaultValue={currentReqInfo.description !== null ? currentReqInfo.description : ''} onChange={e => dispatch(RsetLeaveDescription(e.target.value))} />
                    </Form.Group>
                </Row>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <div className="w-75 d-flex align-items-center">
                    <Button
                        variant="primary"
                        onClick={() => {
                            dispatch(handleEditLeaveReq());
                        }}
                    >ویرایش درخواست</Button>
                </div>
                <Button
                    onClick={() => {
                        // setCurrentRequestItems([]);
                        // setEditReqItem(false);
                        dispatch(RsetEditReqModal(false));
                        // handleReqNewItemReset();
                    }}
                    variant="secondary"
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRequestModal;