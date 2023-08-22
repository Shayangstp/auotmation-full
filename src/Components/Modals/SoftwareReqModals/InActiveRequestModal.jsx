import React from "react";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import { Modal, Button, Table } from "react-bootstrap";

import { RsetCurrentReqItems } from "../../Slices/currentReqSlice";
import { RsetCancelReqComment } from "../../Slices/modalsSlice";

import {
  handleInActiveIrantoolMachine,
  RsetInActiveReqModal,
  selectInActiveReqModal,
} from "../../Slices/irantoolSlices";

const CancelRequestModal = () => {
  const dispatch = useDispatch();
  const inActiveReqModal = useSelector(selectInActiveReqModal);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={inActiveReqModal}
      onHide={() => {
        dispatch(RsetInActiveReqModal(false));
      }}
      dialogClassName="modal-96w"
      scrollable={true}
    >
      <Modal.Header className="d-block bg-danger text-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex justify-content-between"
        >
          <span>غیرفعال کردن درخواست </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="font16">آیا از غیر فعال کردن درخواست فوق مطمئن هستید؟</p>
      </Modal.Body>
      <Modal.Footer className="d-block">
        <div className="d-flex justify-content-center">
          <div className="me-2 d-flex align-items-center">
            <Button
              variant="danger"
              onClick={(e) => {
                dispatch(handleInActiveIrantoolMachine());
              }}
            >
              بله
            </Button>
          </div>
          <Button
            onClick={() => {
              dispatch(RsetInActiveReqModal(false));
              dispatch(RsetCurrentReqItems([]));
              dispatch(RsetCancelReqComment(""));
            }}
            variant="secondary"
          >
            خیر
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelRequestModal;
