import React, { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { selectIrantoolReasonOfDelayName, RsetIrantoolReasonOfDelayName, selectIrantoolReasonOfDelayList, handleChangeReasonOfDelay } from '../../Slices/irantoolSlices';
import { selectFormErrors, RsetFormErrors, selectAddRole, handleUsersByRole } from '../../Slices/mainSlices';

const ReasonOfDelayForm = () => {
    const dispatch = useDispatch();
    const irantoolReasonOfDelayName = useSelector(selectIrantoolReasonOfDelayName);
    const addRole = useSelector(selectAddRole);
    const irantoolReasonOfDelayList = useSelector(selectIrantoolReasonOfDelayList)

    useEffect(() => {
        if (addRole === true) {
            dispatch(handleUsersByRole(0));
        } else if (addRole === false) {
            dispatch(handleUsersByRole(1));
        }
    }, [addRole])

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!irantoolReasonOfDelayName) {
            errors.irantoolReasonOfDelayName = "واردکردن علت تاخیر اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (irantoolReasonOfDelayName !== '') {
            const changedValues = {
                userId: localStorage.getItem('id'),
                delayId: addRole ? undefined : irantoolReasonOfDelayName.value,
                delayName: addRole ? irantoolReasonOfDelayName : undefined,
                action: addRole ? 1 : 2,
            }
            dispatch(handleChangeReasonOfDelay(changedValues));
        } else {
            dispatch(RsetFormErrors(
                validation({
                    irantoolReasonOfDelayName: irantoolReasonOfDelayName,
                })
            ));
        }
    }

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4 mb-md-0'>
                <Form.Label className='mb-1'>نام عملیات: </Form.Label>
                {addRole
                    ? <Form.Control type="text" name='irantoolReasonOfDelayName' value={irantoolReasonOfDelayName} onChange={e => dispatch(RsetIrantoolReasonOfDelayName(e.target.value))} />
                    : <Select name='irantoolReasonOfDelayName' value={irantoolReasonOfDelayName} onChange={e => dispatch(RsetIrantoolReasonOfDelayName(e))}
                    options={irantoolReasonOfDelayList}
                    />
                }
                {!irantoolReasonOfDelayName && (
                    <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.irantoolReasonOfDelayName}
                    </p>
                )}
            </Form.Group>
            <Col className='d-flex mt-3 mt-md-0'>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={(e) => {
                        submitFormBtn(e)
                    }}>
                        ثبت
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default ReasonOfDelayForm;
