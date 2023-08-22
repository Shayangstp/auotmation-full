import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker2";
import Select from "react-select";
import { errorMessage } from "../../../utils/message";

import { RsetFromDate, RsetToDate, RsetDescriptions, selectDescription, selectStartDate, selectOverTimeReason,
  selectOverTimeReasonValue, RsetOverTimeReasonValue, selectEndDate, selectFormErrors, RsetFormErrors, RsetDisable,
  handleApplyUserOverTime, selectShowFields, handleReasonOvertime, handleResetOvertimeForm
} from "../../Slices/OverTimeSlice";
import { selectActionToPersonsModal, RsetActionToPersonsModal } from '../../Slices/mainSlices';
import ApplySendForms from "../../Modals/OfficeReqsModals/overTimeModals/ApplySendForms";

const OverTimeRegistration = ({setPageTitle}) => {

  useEffect(()=>{
    setPageTitle('ثبت درخواست اضافه کار');
  },[])

  const dispatch = useDispatch();
  const actionToPersonsModal = useSelector(selectActionToPersonsModal);
  const overTimeReasons = useSelector(selectOverTimeReason);
  const des = useSelector(selectDescription);
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  const overTimeReasonValue = useSelector(selectOverTimeReasonValue);
  const formErrors = useSelector(selectFormErrors);
  const showFields = useSelector(selectShowFields);

  useEffect(() => {
    dispatch(handleReasonOvertime());
  }, [])

  const applyHandler = (e) => {
    e.preventDefault();
    if (overTimeReasonValue.value && startDate && endDate) {
      if (overTimeReasonValue.value === undefined) {
        dispatch(
          RsetFormErrors(
            validation({
              overTimeReasonValue: overTimeReasonValue,
              startDate: startDate,
              endDate: endDate,
            })
          )
        );
      } else if (startDate > endDate) {
        errorMessage("تاریخ شروع باید پیش از تاریخ پایان باشد!");
      } else {
        dispatch(handleApplyUserOverTime());
      }
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            overTimeReasonValue: overTimeReasonValue,
            startDate: startDate,
            endDate: endDate,
          })
        )
      );
    }
  };

  const validation = ({ overTimeReasonValue, startDate, endDate }) => {
    const errors = {};
    if (!overTimeReasonValue.value) {
      errors.overTimeReasonValue = "لطفا نوع اضافه کار را انتخاب نمایید!";
    }
    if (!startDate) {
      errors.startDate = "لطفا تاریخ و زمان شروع را مشخص نمایید!";
    } else if (startDate > endDate) {
      errors.startDate = "تاریخ شروع باید از تاریخ پایان عقب تر باشد!";
    }
    if (!endDate) {
      errors.endDate = "لطفا تاریخ و زمان پایان را مشخص نمایید!";
    } else if (startDate < endDate) {
      errors.endDate = "تاریخ پایان باید از تاریخ شروع جلو تر باشد!";
    }
    return errors;
  };

  return (
    <Container fluid>
      <Form>
        <Row>
          <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
            <Form.Label className="mb-1 required-field">نوع اضافه کار: </Form.Label>
            <Select value={overTimeReasonValue} placeholder="انتخاب..." options={overTimeReasons}
              onChange={(e) => dispatch(RsetOverTimeReasonValue(e))}
              className={`${formErrors.overTimeReasonValue && !overTimeReasonValue.value
                  ? "rounded col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                  : "rounded col-12 col-sm-12 col-md-12 col-md-4"
                } `}
            />
            {!overTimeReasonValue.value && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.overTimeReasonValue}
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
            <Form.Label className="mb-1 required-field">تاریخ و زمان شروع: </Form.Label>
            <DatePicker
              value={startDate}
              onChange={(e) => { dispatch(RsetFromDate(e)) }}
              inputFormat="YYYY-MM-DD HH:MM A"
              format="jYYYY-jMM-jDD HH:MM A"
              pick12HourFormat={false}
              isGregorian={false}
              timePicker={true}
              className={`${formErrors.startDate && !startDate
                  ? "form-control col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                  : "form-control col-12 col-sm-12 col-md-12 col-md-4"
                } `}
            />
            {!startDate && (
              <p className="font12 text-danger mt-1">{formErrors.startDate}</p>
            )}
          </Form.Group>
          <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4'>
            <Form.Label className='mb-1 required-field'>تاریخ و زمان پایان: </Form.Label>
            <DatePicker
              value={endDate}
              onChange={(e) => dispatch(RsetToDate(e))}
              inputFormat="YYYY-MM-DD HH:MM A"
              format="jYYYY-jMM-jDD HH:MM A"
              pick12HourFormat={false}
              isGregorian={false}
              timePicker={true}
              className={`${formErrors.endDate && !endDate
                  ? "form-control col-12 col-sm-12 col-md-12 col-md-4 border border-danger"
                  : "form-control col-12 col-sm-12 col-md-12 col-md-4"
                } `}
            />
            {!endDate && (
              <p className="font12 text-danger mb-0 mt-1">
                {formErrors.endDate}
              </p>
            )}
          </Form.Group>
          <Form.Group as={Col} md='12'>
            <Form.Label className="mb-1"> توضیحات: </Form.Label>
            <Form.Control as="textarea" rows={10} maxLength={2000} name='des' value={des} onChange={(e) => dispatch(RsetDescriptions(e.target.value))} />
          </Form.Group>
        </Row>
        <Row>
          <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
            <Button variant='success' id='confirmReq' onClick={(e) => applyHandler(e)}
            >
              ثبت درخواست
            </Button>
            <Button variant='primary' id='sendToPersons' className='mx-3 disabled' onClick={(e) => {
              dispatch(RsetActionToPersonsModal(true));
            }}
            >
              ارسال
            </Button>
            <Button variant='secondary' type='reset' onClick={() => { dispatch(handleResetOvertimeForm()) }}>
              انصراف
            </Button>
          </Col>
        </Row>
      </Form>
      {actionToPersonsModal ? <ApplySendForms/> : null}
    </Container>
  );
};

export default OverTimeRegistration;
