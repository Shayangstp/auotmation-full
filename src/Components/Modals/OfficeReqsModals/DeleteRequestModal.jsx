import React from "react";
import xssFilters from "xss-filters";
import { Modal, Button } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import { useDispatch, useSelector } from "react-redux";
import { selectDeleteReqModal, RsetDeleteReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";
import { handleDeleteReq } from '../../Slices/leaveSlice';

const DeleteRequestModal = () => {
    const dispatch = useDispatch();
    const deleteReqModal = useSelector(selectDeleteReqModal);
    const currentReqInfo = useSelector(selectCurrentReqInfo);

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={deleteReqModal}
            onHide={() => {
                dispatch(RsetDeleteReqModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-danger text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='fw-bold me-2'>شماره سریال:</span>
                        <span>{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                    </div>
                    <span>حذف درخواست</span>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span>درخواست حذف شود؟</span>
            </Modal.Body>
            <Modal.Footer className="d-block">
                <div className="d-flex justify-content-between">
                    <div className="w-75 d-flex align-items-center">
                        <Button
                            variant="danger"
                            onClick={() => {
                                dispatch(handleDeleteReq());
                            }}
                        >حذف درخواست</Button>
                    </div>
                    <Button
                        onClick={() => {
                            dispatch(RsetDeleteReqModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteRequestModal;