import React from "react";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import { Modal, Button, Table } from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import { selectCurrentReqInfo, RsetCurrentReqInfo } from "../../../Slices/currentReqSlice";
import {
  RsetCancelReqComment,
  selectCancelReqComment,
  RsetCancelReqModal,
  selectCancelReqModal,
} from "../../../Slices/modalsSlice";
import { handleInActiveIrantoolMachine, selectIrantoolInActiveDeviceModal, RsetIrantoolInActiveDeviceModal } from '../../../Slices/irantoolSlices';

const IrantoolInActiveDeviceModal = () => {
  const dispatch = useDispatch();
  const irantoolInActiveDeviceModal = useSelector(selectIrantoolInActiveDeviceModal);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={irantoolInActiveDeviceModal}
      onHide={() => {
        dispatch(RsetIrantoolInActiveDeviceModal(false));
      }}
      scrollable={true}
    >
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
              dispatch(RsetIrantoolInActiveDeviceModal(false));
              dispatch(RsetCurrentReqInfo(''));
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

export default IrantoolInActiveDeviceModal;
