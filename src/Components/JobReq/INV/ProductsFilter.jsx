import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Alert, Button, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { selectLoading } from '../../Slices/mainSlices';
import { handleProductsList, selectProGroupFilter, RsetProGroupFilter, selectProCodeFilter, RsetProCodeFilter,
    selectProNameFilter, RsetProNameFilter, selectProTechInfo, RsetProTechInfo, handleClearProductsListFilter
} from '../../Slices/ceramicSlices';
import { selectRealFilter, RsetRealFilter } from '../../Slices/filterSlices';
import NumberFormat from 'react-number-format';

const ProductsFilter = ({ setPageTitle }) => {
    const dispatch = useDispatch();
    const realFilter = useSelector(selectRealFilter);
    const proGroupFilter = useSelector(selectProGroupFilter);
    const proCodeFilter = useSelector(selectProCodeFilter);
    const proNameFilter = useSelector(selectProNameFilter);
    const proTechInfo = useSelector(selectProTechInfo);

    return (
        <Row className='align-items-center mb-5'>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='proGroup' className='mb-1'>گروه کالا:</Form.Label>
                <Form.Control type="text" value={proGroupFilter} className='form-control'
                    onChange={(e) => {
                        dispatch(RsetProGroupFilter(e.target.value));
                        if (realFilter) {
                            const filterValues = {
                                itemGroupName: e.target.value, itemCode: proCodeFilter.length === 10 ? proCodeFilter : '' , itemName: proNameFilter, itemTechnicalInfo: proTechInfo
                            }
                            dispatch(handleProductsList(filterValues));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='proGroup' className='mb-1'>کد کالا:</Form.Label>
                <NumberFormat dir='ltr' maxLength='10' type="text" value={proCodeFilter} className='form-control'
                    onChange={(e) => {
                        dispatch(RsetProCodeFilter(e.target.value));
                        if (realFilter && (e.target.value.length === 10 || e.target.value === '')) {
                            const filterValues = {
                                itemGroupName: proGroupFilter, itemCode: e.target.value, itemName: proNameFilter, itemTechnicalInfo: proTechInfo
                            }
                            dispatch(handleProductsList(filterValues));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='proGroup' className='mb-1'>اسم کالا:</Form.Label>
                <Form.Control type="text" value={proNameFilter} className='form-control'
                    onChange={(e) => {
                        dispatch(RsetProNameFilter(e.target.value));
                        if (realFilter) {
                            const filterValues = {
                                itemGroupName: proGroupFilter, itemCode: proCodeFilter.length === 10 ? proCodeFilter : '', itemName: e.target.value, itemTechnicalInfo: proTechInfo
                            }
                            dispatch(handleProductsList(filterValues));
                        }
                    }}
                />
            </Form.Group>
            <Form.Group as={Col} md='4' lg='3' xl='2' className='mb-4'>
                <Form.Label id='proGroup' className='mb-1'>مشخصات فنی:</Form.Label>
                <Form.Control type="text" value={proTechInfo} className='form-control'
                    onChange={(e) => {
                        dispatch(RsetProTechInfo(e.target.value));
                        if (realFilter) {
                            const filterValues = {
                                itemGroupName: proGroupFilter, itemCode: proCodeFilter.length === 10 ? proCodeFilter : '', itemName: proNameFilter, itemTechnicalInfo: e.target.value
                            }
                            dispatch(handleProductsList(filterValues));
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
                                itemGroupName: proGroupFilter, itemCode: proCodeFilter.length === 10 ? proCodeFilter : '', itemName: proNameFilter, itemTechnicalInfo: proTechInfo
                            }
                            dispatch(handleProductsList(filterValues));
                    }}>
                        اعمال فیلتر
                    </Button>
                    <Button variant='secondary' className='font12 ms-1' onClick={() => {dispatch(handleClearProductsListFilter())}}>
                        لغو فیلتر
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default ProductsFilter;