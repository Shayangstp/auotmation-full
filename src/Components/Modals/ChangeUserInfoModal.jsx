import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { selectChangeUserInfoModal, RsetChangeUserInfoModal } from '../Slices/modalsSlice';

const ChangeUserInfoModal = () => {
    const dispatch = useDispatch();
    const changeUserInfoModal = useSelector(selectChangeUserInfoModal);
    
    return(
        <div>
            <Modal
                size="s"
                centered
                backdrop="static"
                show={changeUserInfoModal}
                onHide={()=>{
                    dispatch(RsetChangeUserInfoModal(false));
                }}
                className = 'modal'
                scrollable= {true}
            >
                <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                        جهت استفاده از امکانات اتوماسیون لطفا اطلاعات حساب کاربری خود را تکمیل نمایید.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer className="justify-content-around border-0 pb-5">
                    <Link to='/Profile'>
                        <Button onClick={()=> {
                            dispatch(RsetChangeUserInfoModal(false));
                        }}>متوجه شدم</Button>
                    </Link>
                    <Button variant="secondary" onClick={()=>{
                        dispatch(RsetChangeUserInfoModal(false));
                    }}>انصراف</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ChangeUserInfoModal;