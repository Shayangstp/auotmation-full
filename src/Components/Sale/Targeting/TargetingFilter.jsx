import React, { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Select from 'react-select';
import { useDispatch, useSelector } from "react-redux";
import {
    selectProductGroupName, RsetProductGroupName, selectProductGroupNameOptions, selectProductClassName,
    RsetProductClassName, selectProductClassNameOptions, selectCustomerName, RsetCustomerName,
    selectCustomerNameOptions, handleSelectOptions, handleTargetingList, handleResetTargetingList
} from '../../Slices/saleSlices';
import { selectRealFilter, RsetRealFilter } from './../../Slices/filterSlices';


const TargetingFilter = () => {
    const dispatch = useDispatch();
    const productGroupName = useSelector(selectProductGroupName);
    const productGroupNameOptions = useSelector(selectProductGroupNameOptions);
    const productClassName = useSelector(selectProductClassName);
    const productClassNameOptions = useSelector(selectProductClassNameOptions);
    const customerName = useSelector(selectCustomerName);
    const customerNameOptions = useSelector(selectCustomerNameOptions);
    const realFilter = useSelector(selectRealFilter);


    useEffect(() => {
        dispatch(handleSelectOptions('productGroupName'));
        dispatch(handleSelectOptions('productClassName'));
        dispatch(handleSelectOptions('customerName'));
    }, [])

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4 mb-lg-0'>
                <Form.Label id='firstname' className='mb-1'>نام مشتری:</Form.Label>
                <Select
                    placeholder='همه'
                    isSearchable
                    value={customerName}
                    options={customerNameOptions}
                    onChange={(option) => {
                        dispatch(RsetCustomerName(option));
                        if (realFilter) {
                            const filterValues = {
                                customerCode: option.value,
                                productClassName: productClassName.value !== undefined ? productClassName.value : '',
                                productGroupName: productGroupName.value !== undefined ? productGroupName.value : ''
                            }
                            dispatch(handleTargetingList(filterValues));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4 mb-lg-0'>
                <Form.Label id='firstname' className='mb-1'>طبقه محصول:</Form.Label>
                <Select
                    placeholder='همه'
                    isSearchable
                    value={productClassName}
                    options={productClassNameOptions}
                    onChange={(option) => {
                        dispatch(RsetProductClassName(option));
                        if (realFilter) {
                            const filterValues = {
                                customerCode: customerName.value !== undefined ? customerName.value : '',
                                productClassName: option.value,
                                productGroupName: productGroupName.value !== undefined ? productGroupName.value : ''
                            }
                            dispatch(handleTargetingList(filterValues));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='3' className='mb-4 mb-lg-0'>
                <Form.Label id='firstname' className='mb-1'>گروه محصول:</Form.Label>
                <Select
                    placeholder='همه'
                    isSearchable
                    value={productGroupName}
                    options={productGroupNameOptions}
                    onChange={(option) => {
                        dispatch(RsetProductGroupName(option));
                        if (realFilter) {
                            const filterValues = {
                                customerCode: customerName.value !== undefined ? customerName.value : '',
                                productClassName: productClassName.value !== undefined ? productClassName.value : '',
                                productGroupName: option.value
                            }
                            dispatch(handleTargetingList(filterValues));
                        }
                    }}
                />
            </Form.Group>
            <Col md='4' lg='3' xl='3' className='mt-3 mt-md-0'>
                <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
                    <input className="" type='checkbox' name='realFilter' value={realFilter} checked={realFilter} onChange={() => { dispatch(RsetRealFilter(!realFilter)) }} />
                    <Form.Label className='ms-2 font12 mb-0'> فیلتر لحظه ای </Form.Label>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className='font12' onClick={() => {
                        const filterValues = {
                            customerCode: customerName.value !== undefined ? customerName.value : '',
                            productClassName: productClassName.value !== undefined ? productClassName.value : '',
                            productGroupName: productGroupName.value !== undefined ? productGroupName.value : ''
                        }
                        dispatch(handleTargetingList(filterValues));
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={() => dispatch(handleResetTargetingList())}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default TargetingFilter;
