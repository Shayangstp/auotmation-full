import React, { Fragment, useCallback, useMemo, useState, useRef } from "react";
import moment from "moment-jalaali";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Table } from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import xssFilters from "xss-filters";
import { RsetViewReqModal, selectViewReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";
import {
  handleUserImage,
  handleUserInformation,
} from "../../Slices/mainSlices";
import {
  selectCurrentReqComments,
  selectCurrentReqItems,
  RsetCurrentReqItems,
} from "../../Slices/currentReqSlice";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { softwareReqProcess } from "../../../Services/softwareServices";
// import SoftwareProcess from "../../Software/SoftwareProcess";

const CheckoutReqViewModal = () => {
  const dispatch = useDispatch();
  const viewReqModal = useSelector(selectViewReqModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const currentReqItems = useSelector(selectCurrentReqItems);
  const currentReqComments = useSelector(selectCurrentReqComments);
  // const softwareProcess = useSelector(selectSoftwareProcess);

  // console.log(softwareProcess);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={viewReqModal}
      onHide={() => {
        dispatch(RsetViewReqModal(false));
      }}
      dialogClassName="modal-96w"
      scrollable={true}
    >
      <Modal.Header className="d-block bg-warning text-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex justify-content-between"
        >
          <div>
            <span className="fw-bold me-2">شماره سریال:</span>
            <span>{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
          </div>
          <span>مشاهده درخواست</span>
          <div>
            <span className="fw-bold me-2">تاریخ درخواست:</span>
            <span>
              {momentJalaali
                .utc(
                  xssFilters.inHTMLData(currentReqInfo.createdDate),
                  "YYYY/MM/DD"
                )
                .locale("fa")
                .format("jYYYY/jMM/jDD")}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="p-0 list-unstyled">
          <li className="mb-2">
            <span className="fw-bold">نام و نام خانوادگی: </span>
            {xssFilters.inHTMLData(currentReqInfo.leaverFullName)}
          </li>
          {currentReqInfo.sameAccess !== null && (
            <li className="mb-2">
              <span className="fw-bold">دلیل ترک کار: </span>
              {xssFilters.inHTMLData(currentReqInfo.leavingWorkCauseName)}
            </li>
          )}
          <li className="mb-2">
            <span className="fw-bold">توضیحات: </span>
            {xssFilters.inHTMLData(currentReqInfo.description)}
          </li>
        </ul>
      </Modal.Body>
      {/* <hr className="w-75 me-auto ms-auto" /> */}
      {/* <SoftwareProcess /> */}
      <Modal.Footer className="d-flex">
        {currentReqComments.map((action, index) => {
          if (
            action.comment !== null &&
            action.comment !== undefined &&
            action.comment !== ""
          ) {
            return (
              <div className="d-block" key={index}>
                <span
                  className="fw-bold me-2 font12 cursorPointer"
                  onClick={() => {
                    dispatch(handleUserInformation(action.userId));
                    dispatch(
                      handleUserImage({
                        userId: action.userId,
                        status: 1,
                      })
                    );
                  }}
                >
                  {action.fullName}:{" "}
                </span>
                <span className="font12">
                  {xssFilters.inHTMLData(action.comment)}
                </span>
              </div>
            );
          }
        })}
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => {
              dispatch(RsetViewReqModal(false));
              dispatch(RsetCurrentReqItems([]));
              // dispatch(RsetSoftwareProcess(""));
            }}
            variant="secondary"
          >
            بستن
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutReqViewModal;
