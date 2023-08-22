import React, { useContext, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import {
    selectUsersByRole, RsetUsersByRole, selectUsersByRoleOptions, selectRoles, RsetRoles, selectRolesOptions,
    handleChangeUserRole, selectFormErrors, RsetFormErrors, selectAddRole, handleUsersByRole
} from '../../Slices/mainSlices';

const ChangeUserRole = () => {
    const dispatch = useDispatch();
    const usersByRole = useSelector(selectUsersByRole);
    const usersByroleOptions = useSelector(selectUsersByRoleOptions);
    const roles = useSelector(selectRoles);
    const rolesOptions = useSelector(selectRolesOptions);
    const addRole = useSelector(selectAddRole);

    useEffect(()=>{
        if(addRole === true){
            dispatch(handleUsersByRole(0));
        }else if(addRole === false){
            dispatch(handleUsersByRole(1));
        }
    },[addRole])

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!usersByRole) {
            errors.usersByRole = "انتخاب نام کاربر اجباری است!";
        }
        if (roles.length === 0) {
            errors.roles = "انتخاب نقش اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (usersByRole !== '' && roles.length !== 0) {
            const changedValues = {
                userId: localStorage.getItem('id'),
                applicantId: usersByRole.value,
                roles: String(roles.map(role=> {return role.value})),
                action: addRole ? 1 : 2,
            }
            dispatch(handleChangeUserRole(changedValues));
        } else {
            dispatch(RsetFormErrors(
                validation({
                    usersByRole: usersByRole,
                    roles: roles
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
                    options={usersByroleOptions}
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
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4'>
                <Form.Label className='mb-1'>نقش:</Form.Label>
                <Select
                    isSearchable
                    isMulti
                    value={roles}
                    options={rolesOptions}
                    onChange={(option) => {
                        dispatch(RsetRoles(option));
                    }}
                />
                {roles.length === 0 && (
                    <p className="font12 text-danger mb-0 mt-1">
                        {formErrors.roles}
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

export default ChangeUserRole;
