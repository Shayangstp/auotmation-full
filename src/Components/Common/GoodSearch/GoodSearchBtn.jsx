import react from 'react';
import { Button } from 'react-bootstrap';
import { RsetGoodsList, RsetGoodsModal } from '../../Slices/goodSearchSlice';
import { useDispatch } from 'react-redux';

const GoodSearchBtn = () => {
    const dispatch = useDispatch();
    return (
        <div className="mb-3">
            <Button onClick={()=>{
                dispatch(RsetGoodsModal(true));
                dispatch(RsetGoodsList([]))
            }}>انتخاب کالا</Button>
        </div>
    )
}

export default GoodSearchBtn;
