import React, { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { selectIrantoolOperationName, RsetIrantoolOperationName, selectIrantoolOperationList, handleChangeOperation } from '../../Slices/irantoolSlices';
import { selectFormErrors, RsetFormErrors, selectAddRole, handleUsersByRole } from '../../Slices/mainSlices';

const OperationForm = () => {
    const dispatch = useDispatch();
    const irantoolOperationName = useSelector(selectIrantoolOperationName);
    const addRole = useSelector(selectAddRole);
    const irantoolOperationList = useSelector(selectIrantoolOperationList)

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
        if (!irantoolOperationName) {
            errors.irantoolOperationName = "واردکردن نام عملیات اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (irantoolOperationName !== '') {
            const changedValues = {
                userId: localStorage.getItem('id'),
                operationId: addRole ? undefined : irantoolOperationName.value,
                operationName: addRole ? irantoolOperationName : undefined,
                action: addRole ? 1 : 2,
            }
            dispatch(handleChangeOperation(changedValues));
        } else {
            dispatch(RsetFormErrors(
                validation({
                    irantoolOperationName: irantoolOperationName,
                })
            ));
        }
    }

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4 mb-md-0'>
                <Form.Label className='mb-1'>نام عملیات: </Form.Label>
                {addRole
                    ? <Form.Control type="text" name='irantoolOperationName' value={irantoolOperationName} onChange={e => dispatch(RsetIrantoolOperationName(e.target.value))} />
                    : <Select name='irantoolOperationName' value={irantoolOperationName} onChange={e => dispatch(RsetIrantoolOperationName(e))}
                    options={irantoolOperationList}
                    />
                }
                {!irantoolOperationName && (
                    <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.irantoolOperationName}
                    </p>
                )}
            </Form.Group>
            <Col className='d-flex mt-0 mt-md-3'>
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

export default OperationForm;
