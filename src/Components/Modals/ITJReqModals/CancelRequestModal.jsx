import React, { useContext } from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Table } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import { iranTolJobCntxt } from '../../context/iranTolJobContext/IranTolJobCntxt';
import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectCancelReqModal, RsetCancelReqModal, selectCancelReqComment, RsetCancelReqComment } from "../../Slices/modalsSlice";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";

const CancelRequestModal = () => {
    const dispatch = useDispatch();
    const cancelReqModal = useSelector(selectCancelReqModal);
    const cancelReqComment = useSelector(selectCancelReqComment);

    const mainContext = useContext(rootContext);
    const {
        currentReqInfo,
        currentReqCo,
        currentReqComments,
    } = mainContext;

    const jobContext = useContext(iranTolJobCntxt);
    const {
        handleCancelITJobReq
    } = jobContext;

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={cancelReqModal}
            onHide={() => {
                dispatch(RsetCancelReqModal(false));
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-danger text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>ابطال درخواست شماره </span>
                        <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                    </div>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>نام و نام خانوادگی</th>
                            <th>شرکت</th>
                            <th>نام پروژه</th>
                            <th>نوع فرایند</th>
                            <th>نوع پروژه</th>
                            <th>تعداد</th>
                            <th>تاریخ مدنظر مشتری</th>
                            <th>توضیحات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{xssFilters.inHTMLData(currentReqInfo.fullName)}</td>
                            <td>{xssFilters.inHTMLData(currentReqCo)}</td>
                            <td>{xssFilters.inHTMLData(currentReqInfo.projectName)}</td>
                            <td>{xssFilters.inHTMLData(currentReqInfo.requestTypeName)}</td>
                            <td>{xssFilters.inHTMLData(currentReqInfo.toolTypeName)}</td>
                            <td>{xssFilters.inHTMLData(currentReqInfo.amount)}</td>
                            <td>{currentReqInfo.deadline !== null ? momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.deadline), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD') : ''}</td>
                            <td>{xssFilters.inHTMLData(currentReqInfo.description)}</td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer className="d-block">
                {currentReqComments.map((action, index) => {
                    if (action.comment !== null && action.comment !== undefined && action.comment !== '') {
                        return (
                            <div className="d-block" key={index}>
                                <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                                    dispatch(handleUserInformation(action.userId));
                                    dispatch(handleUserImage({ userId: action.userId, status: 1 }));
                                }}>{action.fullName}: </span>
                                <span className="font12">{xssFilters.inHTMLData(action.comment)}</span>
                            </div>
                        )
                    }
                })}
                <div className="d-flex justify-content-between">
                    <div className="w-75 d-flex align-items-center">
                        <input className="form-control me-3 w-75" placeholder="توضیحات کنسل کننده درخواست" defaultValue={cancelReqComment} name="setComment" onChange={(e) => dispatch(RsetCancelReqComment(e.target.value))} />
                        <Button
                            variant="danger"
                            onClick={() => {
                                handleCancelITJobReq();
                            }}
                        >ابطال درخواست</Button>
                    </div>
                    <Button
                        onClick={() => {
                            dispatch(RsetCancelReqComment(''));
                            dispatch(RsetCancelReqModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default CancelRequestModal;