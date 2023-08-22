import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment-jalaali";
import { handlePostCancelModal, RsetDescriptionModals, selectDescriptionModals, handleUserInformation, handleUserImage } from "../../../Slices/mainSlices";
import xssFilters from "xss-filters";
import { selectCurrentReqInfo } from "../../../Slices/currentReqSlice";
import { selectCancelReqModal, RsetCancelReqModal } from "../../../Slices/modalsSlice";

const CancelOverTime = () => {
  const dispatch = useDispatch();
  const cancelReqModal = useSelector(selectCancelReqModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);

  const complateDescription = useSelector(selectDescriptionModals);

  const fromDate = moment(currentReqInfo.fromDate, "YYYY/MM/DD hh:mm A")
    .locale("fa")
    .format("jYYYY/jMM/jDD hh:mm A");

  const toDate = moment(currentReqInfo.toDate, "YYYY/MM/DD hh:mm A")
    .locale("fa")
    .format("jYYYY/jMM/jDD hh:mm A");

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={cancelReqModal}
      onHide={() => dispatch(RsetCancelReqModal(false))}
      backdrop="static"
      dialogClassName="modal-96w"
      scrollable={true}
    >
      <Modal.Header className="d-block bg-danger text-white">
        <Modal.Title className="d-flex justify-content-between">
          <div>
            <span className='me-2'>ابطال درخواست شماره </span>
            <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
          </div>
          <div>
            <span className="fw-bold me-2">تاریخ درخواست:</span>
            <span>
              {currentReqInfo.process !== undefined ? moment(currentReqInfo.process[0].date, "YYYY/MM/DD").locale("fa").format("jYYYY/jMM/jDD") : ""}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <ul className="list-unstyled" >
          <li className="mb-3">
            <span className="fw-bold">نام و نام خانوادگی: </span>
            <span>
              {currentReqInfo.process !== undefined ? `${currentReqInfo.process[0].userInfo.first_name} ${currentReqInfo.process[0].userInfo.last_name}` : ""}
            </span>
          </li>
          <li className=" mb-3">
            <span className="fw-bold">نوع اضافه کار: </span>
            <span>
              {currentReqInfo.reason !== undefined ? currentReqInfo.reason.label : ""}
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-bold">تاریخ و ساعت شروع: </span>
            <span>
              {currentReqInfo.fromDate !== undefined
                ? new Date(currentReqInfo.fromDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                : ""
              }
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-bold">تاریخ و ساعت پایان: </span>
            <span>
              {currentReqInfo.toDate !== undefined
                ? new Date(currentReqInfo.toDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                : ""
              }
            </span>
          </li>
          <li className="mb-3">
            <span className="fw-bold">توضیحات: </span>
            <span>
              {currentReqInfo.description !== undefined ? currentReqInfo.description : ""}
            </span>
          </li>
        </ul >
      </Modal.Body>
      <Modal.Footer className="d-block">
        {currentReqInfo.process.map((action, index) => {
          if (action.comment !== null && action.comment !== undefined && action.comment !== '') {
            return (
              <div className="d-block" key={index}>
                <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                  dispatch(handleUserInformation(action.userInfo._id));
                  dispatch(handleUserImage({ userId: action.userInfo._id, status: 1 }));
                }}>{action.userInfo.gender + ' ' + action.userInfo.first_name + ' ' + action.userInfo.last_name}: </span>
                <span className="font12">{xssFilters.inHTMLData(action.comment)}</span>
              </div>
            )
          }
        })}
        <div className="d-flex justify-content-between">
          <div className="w-75 d-flex align-items-center">
            <Form.Control placeholder="توضیحات ابطال کننده درخواست" name="description" value={complateDescription} className='me-3 w-75'
              onChange={(e) => dispatch(RsetDescriptionModals(e.target.value))}
            />
            <Button variant="danger"
              onClick={() => {
                dispatch(handlePostCancelModal(14))
              }}
            >ابطال درخواست</Button>
          </div>
          <Button variant="secondary"
            onClick={() => {
              dispatch(RsetDescriptionModals(""))
              dispatch(RsetCancelReqModal(false))
            }}
          >بستن</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelOverTime;
