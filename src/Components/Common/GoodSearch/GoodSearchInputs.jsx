import react, { Fragment } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import WarehouseAddProList from './GoodSearchList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectGoodsList, handleGetGoodInfoWithCode, handleGetGoodInfoWithName } from '../../Slices/goodSearchSlice';
import { selectLoading } from '../../Slices/mainSlices';
import { handleEditWarehouseReqItemInvCode, handleEditWarehouseReqItemInvName } from '../../Slices/warehouseSlice';
import { RsetCurrentReqItem } from '../../Slices/currentReqSlice';

const GoodSearchInputs = ({showList, item}) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const goodsList = useSelector(selectGoodsList);
    return (
        <Fragment>
            <Row className='mb-3'>
                <Form.Group as={Col} md='3'>
                    {/* <Form.Label className='mb-1 required-field'>کد کالا: </Form.Label> */}
                    <NumberFormat placeholder='کد کالا' type="text" value={item.invCode !== null ? item.invCode : ''} name="goodCode" onChange={(e) => { dispatch(handleEditWarehouseReqItemInvCode({value: e.target.value, itemId: item.itemId}))}}
                        aria-describedby="searchProByCode" format="##########" mask='-' dir='ltr' className='form-control'
                        id='goodCode' onBlur={(e) => { dispatch(handleGetGoodInfoWithCode({itemId: item.itemId, value: e.target.value})) }} onKeyUp={(e) => {
                            e.which = e.which || e.keyCode;
                            if (e.which === 13) {
                                dispatch(handleGetGoodInfoWithCode({itemId: item.itemId, value: e.target.value}));
                            }
                        }}
                    />
                    {/* <div id='addProCode-required' className='d-none mt-1'>
                        <span className='font12 text-danger mb-1'>واردکردن کد کالا اجباری است!</span>
                    </div> */}
                </Form.Group>
                <Form.Group as={Col} md='9'>
                    {/* <Form.Label className='mb-1 required-field'>نام کالا: </Form.Label> */}
                    <Form.Control placeholder='نام کالا' type="text" value={item.invName !== null ? item.invName : ''} name="goodName" onChange={(e) => { dispatch(handleEditWarehouseReqItemInvName({value: e.target.value, itemId: item.itemId})) }} aria-describedby="searchProByName"
                        onBlur={(e) => { dispatch(handleGetGoodInfoWithCode({itemId: item.itemId, value: item.invCode})) }} onKeyUp={(e) => {
                            e.which = e.which || e.keyCode;
                            if (e.which === 13) {
                                dispatch(handleGetGoodInfoWithName({itemId: item.itemId, value: e.target.value}));
                                dispatch(RsetCurrentReqItem(item));
                            }
                        }}
                    />
                    {/* <div id='addProName-required' className='d-none mt-1'>
                        <span className='font12 text-danger mb-1'>واردکردن شرح کالا اجباری است!</span>
                    </div> */}
                </Form.Group>
            </Row>
            {/* {showList ? <Row>
                <Col md='12'>
                    {loading 
                        ? <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                        : goodsList.length !== undefined && goodsList.length !== 0 ? <WarehouseAddProList /> : null
                    }
                </Col>
            </Row> : null} */}
        </Fragment>
    )
}

export default GoodSearchInputs;