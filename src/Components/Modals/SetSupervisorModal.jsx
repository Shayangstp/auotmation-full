import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { selectSetSupervisorModal, RsetSetSupervisorModal } from '../Slices/modalsSlice';

const SetSupervisorModal = () => {
    const dispatch = useDispatch();
    const setSupervisorModal = useSelector(selectSetSupervisorModal);

    return (
        <div>
            <Modal
                size="s"
                centered
                backdrop="static"
                show={setSupervisorModal}
                onHide={() => {
                    dispatch(RsetSetSupervisorModal(false));
                }}
                className='modal'
                scrollable={true}
            >
                <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal-title font18 fw-bold">
                        جهت ثبت درخواست لطفا سرپرست/مدیر خود را در قسمت پروفایل مشخص نمایید و از ایشان بخواهید که این مورد را تایید کند
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer className="justify-content-around border-0 pb-5">
                    <Link to='/Profile'>
                        <Button onClick={() => {
                            dispatch(RsetSetSupervisorModal(false));
                        }}>متوجه شدم</Button>
                    </Link>
                    <Link to='/Home'>
                        <Button variant="secondary" onClick={() => {
                            dispatch(RsetSetSupervisorModal(false));
                        }}>انصراف</Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SetSupervisorModal;