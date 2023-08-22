import React, { useContext } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import GoodSearchInputs from "../../Common/GoodSearch/GoodSearchInputs";
import { reqContext } from '../../context/warehouseReqsContext/reqContext';
import { useDispatch, useSelector } from "react-redux";
import { selectGoodsModal, RsetGoodsModal, selectSelectedGood, RsetGoodCode, RsetGoodName, handleResetGoodSearch, selectGoodsList } from "../../Slices/goodSearchSlice";
import { handleEditWarehouseReqItemInvCode, handleEditWarehouseReqItemInvName } from '../../Slices/warehouseSlice';
import { selectLoading } from "../../Slices/mainSlices";
import { selectCurrentReqItem } from './../../Slices/currentReqSlice';
import WarehouseAddProList from '../../Common/GoodSearch/GoodSearchList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const GoodSearchModal = ({ item }) => {
    const dispatch = useDispatch();
    const goodsModal = useSelector(selectGoodsModal);
    const selectedGood = useSelector(selectSelectedGood);
    const currentReqItem = useSelector(selectCurrentReqItem);
    const loading = useSelector(selectLoading);
    const goodsList = useSelector(selectGoodsList);

    const requestContext = useContext(reqContext);
    const {
        purchaseProTechSpecificationsRef,
    } = requestContext;

    return (
        <Modal
            size="s"
            centered
            backdrop="static"
            show={goodsModal}
            onHide={() => {
                dispatch(RsetGoodsModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Body>
                {/* <div>
                    <GoodSearchInputs showList={true} item={currentReqItem}/>
                </div> */}
                <Row>
                    <Col md='12'>
                        {loading
                            ? <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                            : goodsList.length !== undefined && goodsList.length !== 0 ? <WarehouseAddProList /> : null
                        }
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-around border-0 pb-5">
                <Button
                    disabled={selectedGood.code !== undefined ? false : true}
                    onClick={() => {
                        if(item !== undefined){
                            dispatch(handleEditWarehouseReqItemInvCode({ value: selectedGood.code, itemId: item.itemId }));
                            dispatch(handleEditWarehouseReqItemInvName({ value: selectedGood.name, itemId: item.itemId }));
                        }else{
                            dispatch(RsetGoodCode(selectedGood.code));
                            dispatch(RsetGoodName(selectedGood.name));
                        }
                        // if(purchaseProTechSpecificationsRef !== undefined){
                        //     purchaseProTechSpecificationsRef.current.focus();
                        // }
                        dispatch(handleResetGoodSearch());
                        dispatch(RsetGoodsModal(false));
                    }}
                >انتخاب کالا</Button>
                <Button variant="secondary" onClick={() => {
                    dispatch(handleResetGoodSearch());
                    dispatch(RsetGoodsModal(false));
                    dispatch(RsetGoodCode(''));
                    dispatch(RsetGoodName(''));
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default GoodSearchModal;