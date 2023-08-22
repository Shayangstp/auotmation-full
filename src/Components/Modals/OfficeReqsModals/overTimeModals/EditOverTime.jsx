import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment-jalaali";
import DatePicker from "react-datepicker2";
import Select from "react-select";
import {
  handleEditReqOverTime, RsetDescriptionEditModal, RsetFromDateEditModal, RsetOverTimeReasonEditModal,
  RsetToDateEditModal, selectOverTimeReason, selectOverTimeReasonEditModal, selectFromDateEditModal,
  selectToDateEditModal, selectDescriptionEditModal
} from "../../../Slices/OverTimeSlice";
import { selectCurrentReqInfo } from "../../../Slices/currentReqSlice";
import { selectEditReqModal, RsetEditReqModal } from "../../../Slices/modalsSlice";
import xssFilters from "xss-filters";

const EditOverTime = () => {
  const dispatch = useDispatch();
  const editReqModal = useSelector(selectEditReqModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);

  const overTimeReason = useSelector(selectOverTimeReason);
  const overTimeReasonEditModal = useSelector(selectOverTimeReasonEditModal);
  const fromDateEditModal = useSelector(selectFromDateEditModal);
  const toDateEditModal = useSelector(selectToDateEditModal);
  const descriptionEditModal = useSelector(selectDescriptionEditModal);
  useEffect(() => {
    if (currentReqInfo.reason !== undefined) {
      dispatch(RsetOverTimeReasonEditModal(currentReqInfo.reason))
    }
    if (currentReqInfo.fromDate !== undefined) {
      dispatch(RsetFromDateEditModal(moment(new Date(currentReqInfo.fromDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }))))
    }
    if (currentReqInfo.toDate !== undefined) {
      dispatch(RsetToDateEditModal(moment(new Date(currentReqInfo.toDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }))))
    }
    if (currentReqInfo.description !== undefined) {
      dispatch(RsetDescriptionEditModal(currentReqInfo.description))
    }
  }, [currentReqInfo])

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={editReqModal}
      onHide={() => dispatch(RsetEditReqModal(false))}
      backdrop="static"
      dialogClassName="modal-96w"
      scrollable={true}
    >
      <Modal.Header className="d-block bg-primary text-white">
        <Modal.Title className="d-flex justify-content-between">
          <div>
            <span className='me-2'>ویرایش درخواست شماره </span>
            <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
          </div>
          <div>
            <span className="fw-bold me-2">تاریخ درخواست:</span>
            <span>
              {currentReqInfo.process !== undefined
                ? moment(currentReqInfo.process[0].date, "YYYY/MM/DD")
                  .locale("fa")
                  .format("jYYYY/jMM/jDD")
                : ""}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <ul className="list-unstyled" >
          <li className="mb-3">
            <span className="fw-bold">نام و نام خانوادگی: </span>
            <span>
              {`${currentReqInfo.process !== undefined
                ? currentReqInfo.process[0].userInfo.first_name : ""
                }
                ${currentReqInfo.process !== undefined
                  ? currentReqInfo.process[0].userInfo.last_name : ""
                }`}
            </span>
          </li>
        </ul>
        <Row className="d-flex" >
          <Col md="4" lg="3" >
            <span className="fw-bold">نوع اضافه کار: </span>
            <Select className="mb-3 mt-1 " placeholder="انتخاب" options={overTimeReason}
              value={overTimeReasonEditModal}
              onChange={(e) => dispatch(RsetOverTimeReasonEditModal(e))}
            />
          </Col>
          <Col md="4" lg="3">
            <span className="fw-bold ">تاریخ و ساعت شروع: </span>
            <DatePicker
              className="form-control mt-1"
              type="date"
              inputFormat="YYYY-MM-DD"
              pick12HourFormat={false}
              isGregorian={false}
              timePicker={true}
              value={fromDateEditModal}
              onChange={(e) => dispatch(RsetFromDateEditModal(e))}
            />
          </Col>
          <Col md="4" lg="3">
            <span className="fw-bold ">تاریخ و ساعت پایان: </span>
            <DatePicker
              value={toDateEditModal}
              onChange={(e) => dispatch(RsetToDateEditModal(e))}
              className="form-control mt-1"
              type="date"
              inputFormat="YYYY-MM-DD"
              pick12HourFormat={false}
              isGregorian={false}
              timePicker={true}
            />
          </Col>
          <Col md="12" >
            <span className="fw-bold">توضیحات: </span>
            <Form.Control as="textarea" rows={5} className="mt-1"
              value={descriptionEditModal}
              onChange={(e) => dispatch(RsetDescriptionEditModal(e.target.value))}
            />
          </Col>
        </Row>
      </Modal.Body >
      <Modal.Footer className="justify-content-between">
        <div className="d-flex">
          <Button onClick={() => {
            dispatch(handleEditReqOverTime())
          }} className=" " variant="primary">
            ویرایش درخواست
          </Button>
        </div>
        <div>
          <Button className="justify-content-end" variant="secondary"
            onClick={() => {
              dispatch(RsetEditReqModal(false));
            }}
          >بستن</Button>
        </div>
      </Modal.Footer>
    </Modal >
  );
};

export default EditOverTime;