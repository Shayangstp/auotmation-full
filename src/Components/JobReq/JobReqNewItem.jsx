import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Form } from "react-bootstrap";
import NumberFormat from "react-number-format";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import { reqContext } from '../context/jobReqsContext/reqContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddFileInput from './../Common/File/AddFileInput';
import { selectFormErrors, selectUnit, RsetUnit, selectUnitsOption, handleUnits } from '../Slices/mainSlices';

const InterCompanyJobReqNewItem = ({handleAddItemToCeramicReq}) => {
    const dispatch = useDispatch();
    const unit = useSelector(selectUnit);
    const unitsOption = useSelector(selectUnitsOption);

    const formErrors = useSelector(selectFormErrors);

    useEffect(()=>{
        dispatch(handleUnits());
    },[])

    const requestContext = useContext(reqContext);
    const {
        reqPattern,
        setReqPattern,
        reqItemSubject,
        setReqItemSubject,
        reqItemSubjectRef,
        reqItemAmount,
        setReqItemAmount,
        reqItemAmountRef,
        reqItemTechSpecifications,
        setReqItemTechSpecifications,
        reqItemTechSpecificationsRef,
        reqItemDeadline,
        setReqItemDeadline,
        reqItemDeadlineRef,
        handleUploadReqItemFile,
        handleAddReqItemFile,
        reqItemFileRef,
        reqItemFiles,
        description,
        setdescription,
        descriptionRef,
        reqItemAddRef,

    } = requestContext;

    const pattern = [
        {value: 1, label:'نمونه'},
        {value: 2, label:'نقشه'},
        {value: 3, label:'-'},
    ]
    return (
        <>
            <Row>
                <Form.Group as={Col} md='4' lg='4' className='mb-4'>
                    <Form.Label className='mb-1 required-field'> موضوع درخواست: </Form.Label>
                    <Form.Control type="text" value={reqItemSubject} name="reqItemSubject" id='reqItemSubject' onChange={(e) => { setReqItemSubject(e.target.value) }} ref={reqItemSubjectRef} />
                    {!reqItemSubject && (
                        <p className="font12 text-danger mb-0 mt-1">
                            {formErrors.reqItemSubject}
                        </p>
                    )}
                </Form.Group>
                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                    <Form.Label className='mb-1 required-field'> تعداد: </Form.Label>
                    <NumberFormat type="text" value={reqItemAmount} name="reqItemAmount" id='reqItemAmount' onChange={(e) => { setReqItemAmount(e.target.value) }} getInputRef={reqItemAmountRef} dir='ltr' className='form-control' />
                    {!reqItemAmount && (
                        <p className="font12 text-danger mb-0 mt-1">
                            {formErrors.reqItemAmount}
                        </p>
                    )}
                </Form.Group>
                <Form.Group as={Col} md='4' lg='4' xxl='2' className='mb-4'>
                    <Form.Label className='mb-1 required-field'> واحد: </Form.Label>
                    <Select  value={unit} name="unit" onChange={(e) => { dispatch(RsetUnit(e)) }} placeholder='انتخاب...' options={unitsOption} />
                    {!unit && (
                        <p className="font12 text-danger mb-0 mt-1">
                            {formErrors.unit}
                        </p>
                    )}
                </Form.Group>
                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                    <Form.Label className='mb-1 required-field'> مشخصات فنی :</Form.Label>
                    <Form.Control type="text" value={reqItemTechSpecifications} name="reqItemTechSpecifications" id='reqItemTechSpecifications' onChange={(e) => { setReqItemTechSpecifications(e.target.value) }} ref={reqItemTechSpecificationsRef} />
                    {!reqItemTechSpecifications && (
                        <p className="font12 text-danger mb-0 mt-1">
                            {formErrors.reqItemTechSpecifications}
                        </p>
                    )}
                </Form.Group>
                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                    <Form.Label className='mb-1 required-field'> تاریخ مورد نیاز:</Form.Label>
                    <DatePicker
                        ref={reqItemDeadlineRef}
                        setTodayOnBlur={true}
                        inputReadOnly
                        name="reqItemDeadline"
                        isGregorian={false}
                        timePicker={false}
                        showTodayButton={false}
                        inputFormat="YYYY-MM-DD"
                        inputJalaaliFormat="jYYYY/jMM/jDD"
                        value={reqItemDeadline}
                        className="form-control"
                        id="reqItemDeadline"
                        onChange={e => { setReqItemDeadline(e) }}
                    />
                    {!reqItemDeadline && (
                        <p className="font12 text-danger mb-0 mt-1">
                            {formErrors.reqItemDeadline}
                        </p>
                    )}
                </Form.Group>
                <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
                    <Form.Label className='mb-1'>الگو :</Form.Label>
                    <Select name="reqPattern" value={reqPattern} onChange={(e) => { setReqPattern(e) }}
                    placeholder='انتخاب...' options={pattern} id='reqPattern' />
                </Form.Group>
                <AddFileInput />
                <Form.Group as={Col} md='4' lg='6' className='mb-4'>
                    <Form.Label className='mb-1'> توضیحات تکمیلی پروژه :</Form.Label>
                    <Form.Control type="text" value={description} name="description" id='description' onChange={e => { setdescription(e.target.value) }} ref={descriptionRef} />
                </Form.Group>
                <Form.Group as={Col} md='3' className="d-flex align-items-center">
                    <Button variant="info" className="text-white font12 d-flex align-items-center" onClick={(e)=>{
                        handleAddItemToCeramicReq(e);
                    }}>
                        <FontAwesomeIcon icon={faPlus} className="me-2"/>
                        افزودن آیتم
                    </Button>
                </Form.Group>
            </Row>
        </>
    )
}

export default InterCompanyJobReqNewItem;