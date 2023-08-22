import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { selectUserNotFoundModal, RsetUserNotFoundModal } from '../Slices/mainSlices';

const UserNotFoundModal = () => {
    const dispatch = useDispatch();
    const userNotFoundModal = useSelector(selectUserNotFoundModal);
    return (
        <Modal
            size="s"
            centered
            backdrop="static"
            show={userNotFoundModal}
            onHide={() => {
                dispatch(RsetUserNotFoundModal(false));
            }}
            className='modal'
            scrollable={true}
        >
            <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                    کاربر یافت نشد!
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer className="justify-content-around border-0 pb-5">
                <Link to='/Logout' className='w-45'>
                    <Button
                        className='w-100'
                        onClick={() => {
                            dispatch(RsetUserNotFoundModal(false));
                        }}
                    >خروج</Button>
                </Link>
            </Modal.Footer>
        </Modal>
    )

}

export default UserNotFoundModal;