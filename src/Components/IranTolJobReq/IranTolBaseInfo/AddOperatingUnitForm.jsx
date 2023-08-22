import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Select from 'react-select';
import { selectFormErrors, RsetFormErrors, selectAddRole } from "../../Slices/mainSlices";
import { selectIrantoolAddOperatingUnitName, RsetIrantoolAddOperatingUnitName, selectIrantoolOperationUnitList, handleChangeOperationUnit } from "../../Slices/irantoolSlices";

const AddOperatingUnitForm = () => {
    const dispatch = useDispatch();
    const irantoolAddOperatingUnitName = useSelector(selectIrantoolAddOperatingUnitName);
    const addRole = useSelector(selectAddRole);
    const irantoolOperationUnitList = useSelector(selectIrantoolOperationUnitList);

    const formErrors = useSelector(selectFormErrors);
    const validation = () => {
        var errors = {};
        if (!irantoolAddOperatingUnitName) {
            errors.irantoolAddOperatingUnitName = "وارد کردن نام واحد اجباری است!";
        }
        return errors;
    }
    const submitFormBtn = (e) => {
        e.preventDefault();
        if (irantoolAddOperatingUnitName !== '') {
            const changedValues = {
                userId: localStorage.getItem('id'),
                operatingDepId: addRole ? undefined : irantoolAddOperatingUnitName.value,
                operatingDepName: addRole ? irantoolAddOperatingUnitName : undefined,
                action: addRole ? 1 : 2
            }
            dispatch(handleChangeOperationUnit(changedValues));
        } else {
            dispatch(RsetFormErrors(
                validation({
                    irantoolAddOperatingUnitName: irantoolAddOperatingUnitName,
                })
            ));
        }
    }

    return (
        <Container fluid>
            <Form>
                <Row className='align-items-center mb-5'>
                    <Form.Group as={Col} md='4' lg='4' xxl='3' className='mb-4 mb-md-0'>
                        <Form.Label className='mb-1'>نام واحد: </Form.Label>
                        {addRole
                            ? <Form.Control type="text" name='irantoolAddOperatingUnitName' value={irantoolAddOperatingUnitName} onChange={e => dispatch(RsetIrantoolAddOperatingUnitName(e.target.value))} />
                            : <Select name='irantoolAddOperatingUnitName' value={irantoolAddOperatingUnitName} onChange={e => dispatch(RsetIrantoolAddOperatingUnitName(e))} options={irantoolOperationUnitList}/>
                        }
                        {!irantoolAddOperatingUnitName && (
                            <p className="font12 text-danger mb-0 mt-1">
                                {formErrors.irantoolAddOperatingUnitName}
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
            </Form>
        </Container>
    )
}
export default AddOperatingUnitForm;