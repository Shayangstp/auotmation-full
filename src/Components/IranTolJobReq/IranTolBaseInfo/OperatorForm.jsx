import React, { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { handleOperatorOptions, selectIrantoolOperatorOption } from '../../Slices/irantoolSlices';
import {
    selectUsersByRole, RsetUsersByRole, handleChangeUserRole, selectFormErrors, RsetFormErrors, selectAddRole
} from '../../Slices/mainSlices';

const OperatorForm = () => {
    const dispatch = useDispatch();
    const usersByRole = useSelector(selectUsersByRole);
    const irantoolOperatorOption = useSelector(selectIrantoolOperatorOption);
    const addRole = useSelector(selectAddRole);

    useEffect(()=>{
        if(addRole === true){
            dispatch(handleOperatorOptions(0));
        }else if(addRole === false){
            dispatch(handleOperatorOptions(1));
        }
    },[addRole])

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!usersByRole) {
            errors.usersByRole = "انتخاب نام کاربر اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (usersByRole !== '') {
            const changedValues = {
                userId: localStorage.getItem('id'),
                applicantId: usersByRole.value,
                roles: '2',
                action: addRole ? 1 : 2,
            }
            dispatch(handleChangeUserRole(changedValues));
        } else {
            dispatch(RsetFormErrors(
                validation({
                    usersByRole: usersByRole,
                })
            ));
        }
    }

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'>
                <Form.Label className='mb-1'>کاربر:</Form.Label>
                <Select
                    isSearchable
                    value={usersByRole}
                    options={irantoolOperatorOption}
                    onChange={(option) => {
                        dispatch(RsetUsersByRole(option));
                    }}
                />
                {!usersByRole && (
                    <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.usersByRole}
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

export default OperatorForm;
