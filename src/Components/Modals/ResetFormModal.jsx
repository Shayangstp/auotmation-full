import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { selectResetFormModal, RsetResetFormModal } from '../Slices/modalsSlice';

const ResetFormModal = ({ resetFunc }) => {
    const dispatch = useDispatch();
    const resetFormModal = useSelector(selectResetFormModal);

    return (
        <div>
            <Modal
                size="s"
                centered
                backdrop="static"
                show={resetFormModal}
                onHide={() => {
                    dispatch(RsetResetFormModal(false));
                }}
                className='modal'
                scrollable={true}
            >
                <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                        از حذف اطلاعات وارد شده اطمینان دارید؟
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer className="justify-content-around border-0 pb-5">
                    <Button variant="success" onClick={() => {
                        dispatch(resetFunc());
                        dispatch(RsetResetFormModal(false));
                    }}>بله</Button>
                    <Button variant="danger" onClick={() => {
                        dispatch(RsetResetFormModal(false));
                    }}>خیر</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ResetFormModal;