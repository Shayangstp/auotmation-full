import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button, Col, Form, Row } from "react-bootstrap";
import { errorMessage } from "../../../utils/message";
import { selectFormErrors, selectLoanAmount, selectDescription, RsetFormErrors, RsetLoanAmount, RsetDescription } from '../../Slices/loanSlice';
import { RsetDisable, handleApplyUserOverTime, selectShowFields, handleReasonOvertime, handleResetOvertimeForm
} from "../../Slices/OverTimeSlice";
import { selectActionToPersonsModal, RsetActionToPersonsModal } from '../../Slices/mainSlices';
import ApplySendForms from "../../Modals/OfficeReqsModals/overTimeModals/ApplySendForms";
import NumberFormat from "react-number-format";

const LoanRegistration = ({setPageTitle}) => {

  useEffect(()=>{
    setPageTitle('ثبت درخواست وام');
  },[])

  const dispatch = useDispatch();
  const loanAmount = useSelector(selectLoanAmount);
  const description = useSelector(selectDescription);
  const formErrors = useSelector(selectFormErrors);
  const showFields = useSelector(selectShowFields);
  const actionToPersonsModal = useSelector(selectActionToPersonsModal);

  const applyHandler = (e) => {
    e.preventDefault();
    if (loanAmount) {
      if (loanAmount === '') {
        dispatch(
          RsetFormErrors(
            validation({
              loanAmount: loanAmount,
            })
          )
        );
      } else {
        dispatch(handleApplyUserOverTime());
      }
    } else {
      dispatch(
        RsetFormErrors(
          validation({
            loanAmount: loanAmount,
          })
        )
      );
    }
  };

  const validation = ({ loanAmount }) => {
    const errors = {};
    if (loanAmount) {
      errors.loanAmount = "لطفا مبلغ را وارد نمایید!";
    }
    return errors;
  };

  return (
    <Container fluid>
      <Form>
        <Row>
          <Form.Group>
            <Form.Label className="mb-1"> مبلغ: </Form.Label>
            <NumberFormat type="text" name='loanAmount' value={loanAmount} onChange={(e)=>{dispatch(RsetLoanAmount(e.target.value))}} dir='ltr' thousandSeparator=","/>
          </Form.Group>
          <Form.Group as={Col} md='12'>
            <Form.Label className="mb-1"> توضیحات: </Form.Label>
            <Form.Control as="textarea" rows={10} maxLength={2000} name='description' value={description} onChange={(e) => dispatch(RsetDescription(e.target.value))} />
          </Form.Group>
        </Row>
        <Row>
          <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
            <Button variant='success' id='confirmReq' onClick={(e) => {applyHandler(e)}}
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

export default LoanRegistration;
