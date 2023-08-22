import react from 'react';
import { Container } from 'react-bootstrap';
import { Row, Col, Form } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';
import GoodSearchBtn from './../Common/GoodSearch/GoodSearchBtn';
import GoodSearchModal from '../Modals/Warehouse/GoodSearchModal';
import { selectGoodsModal, selectGoodCode, selectGoodName, RsetGoodCode, RsetGoodName, handleGetGoodInfoWithCode, handleGetGoodInfoWithName } from '../Slices/goodSearchSlice';

const Test = () => {
    const dispatch = useDispatch();
    const goodsModal = useSelector(selectGoodsModal);
    const goodCode = useSelector(selectGoodCode);
    const goodName = useSelector(selectGoodName);
    return (
        <Container>
            <GoodSearchBtn/>
            <Row className='mb-3'>
                {/* <Form.Group as={Col} md='3'>
                    <Form.Label className='mb-1 required-field'>کد کالا: </Form.Label>
                    <NumberFormat type="text" value={goodCode} name="goodCode" onChange={(e) => { dispatch(RsetGoodCode(e.target.value))}}
                        aria-describedby="searchProByCode" format="##########" mask='-' dir='ltr' className='form-control'
                        id='goodCode' onBlur={(e) => { dispatch(handleGetGoodInfoWithCode()) }} onKeyUp={(e) => {
                            e.which = e.which || e.keyCode;
                            if (e.which === 13) {
                                dispatch(handleGetGoodInfoWithCode());
                            }
                        }}
                    />
                    <div id='addProCode-required' className='d-none mt-1'>
                        <span className='font12 text-danger mb-1'>واردکردن کد کالا اجباری است!</span>
                    </div>
                </Form.Group>
                <Form.Group as={Col} md='9'>
                    <Form.Label className='mb-1 required-field'>نام کالا: </Form.Label>
                    <Form.Control type="text" value={goodName} name="goodName" onChange={(e) => { dispatch(RsetGoodName(e.target.value)) }} aria-describedby="searchProByName"
                        onBlur={() => { dispatch(handleGetGoodInfoWithName()) }} onKeyUp={(e) => {
                            e.which = e.which || e.keyCode;
                            if (e.which === 13) {
                                dispatch(handleGetGoodInfoWithName());
                            }
                        }}
                    />
                    <div id='addProName-required' className='d-none mt-1'>
                        <span className='font12 text-danger mb-1'>واردکردن شرح کالا اجباری است!</span>
                    </div>
                </Form.Group> */}
            </Row>
            {goodsModal ? <GoodSearchModal/> : null}
        </Container>
    )
}

export default Test;