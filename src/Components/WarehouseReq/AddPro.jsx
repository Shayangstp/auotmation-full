import react, { useContext } from 'react';
import { reqContext } from '../context/warehouseReqsContext/reqContext';
import { Row, Col, Form } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { RsetCurrentReqItem } from '../Slices/currentReqSlice';
import { useDispatch } from 'react-redux';

const AddPro = (item) => {
    const dispatch = useDispatch();
    const requestContext = useContext(reqContext);
    const {
        handleAddProCode,
        handleAddProName,
        handleAddStoreAsCode,
        handleAddStoreAsName,
        addProModal
    } = requestContext;

    return (
        <Row className='mb-3'>
            <Form.Group as={Col} md='3'>
                <Form.Label className='mb-1 required-field'>کد کالا: </Form.Label>
                <NumberFormat type="text" value={item.invCode !== null ? item.invCode : ''} name="addProCode" id='addProC' onChange={(e) => { handleAddStoreAsCode(e.target.value, item.itemId) }}
                    aria-describedby="searchProByCode" format="##########" mask='-' dir='ltr' className='form-control'
                    onKeyUp={(e) => {
                        e.which = e.which || e.keyCode;
                        if (e.which === 13) {
                            handleAddProCode(e.target.value, item.itemId);
                            dispatch(RsetCurrentReqItem(item));
                        }
                    }}
                    // onBlur={(e) => {
                    //     handleAddProCode(e.target.value, item._id)
                    // }}
                />
            </Form.Group>
            <Form.Group as={Col} md='9'>
                <Form.Label className='mb-1 required-field'>نام کالا: </Form.Label>
                <Form.Control type="text" value={item.invName !== null ? item.invName : ''} name="addProName" id='addProN' onChange={(e) => { handleAddStoreAsName(e.target.value, item.itemId) }} aria-describedby="searchProByName"
                    onKeyUp={(e) => {
                        e.which = e.which || e.keyCode;
                        if (e.which === 13) {
                            handleAddProName(e.target.value, item.itemId);
                            dispatch(RsetCurrentReqItem(item));
                        }
                    }}
                    // onBlur={(e) => {
                    //     handleAddProName(e.target.value, item._id);
                    // }}
                />
            </Form.Group>
        </Row>
    )
}

export default AddPro;