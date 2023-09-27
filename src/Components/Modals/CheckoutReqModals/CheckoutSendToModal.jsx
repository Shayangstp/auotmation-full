import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RsetCheckoutSendToModal,
  selectChcekoutSendToModal,
  handleCheckoutReqAction,
  RsetCheckoutReqIsSubmitted,
  handleFormReset,
} from "../../Slices/checkoutReqSlices";
import { Button, Modal } from "react-bootstrap";
import { handleReset } from "../../Slices/ceramicPriceSlices";
import { handleReqsList } from "../../Slices/mainSlices";

const CheckoutSendToModal = () => {
  const dispatch = useDispatch();
  const checkoutSendToModal = useSelector(selectChcekoutSendToModal);

  return (
    <Modal
      show={checkoutSendToModal}
      onHide={() => {
        dispatch(RsetCheckoutSendToModal(false));
      }}
      backdrop="static"
      centered
      size="md"
    >
      <Modal.Body className="d-flex flex-wrap justify-content-between">
        <p>آیا در خواست ارسال شود ؟</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          name="acceptModal"
          variant="success"
          onClick={(e) => {
            dispatch(handleCheckoutReqAction(e));
            const filterValues = {
              applicantId: localStorage.getItem("id"),
              serial: "",
              memberId: "",
              status: "",
              fromDate: "null",
              toDate: "null",
              type: 10,
              mDep: "",
            };
            dispatch(handleReqsList(filterValues));
            dispatch(RsetCheckoutSendToModal(false));
          }}
        >
          بله
        </Button>
        <Button
          name="acceptModal"
          variant="danger"
          onClick={() => dispatch(RsetCheckoutSendToModal(false))}
        >
          خیر
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutSendToModal;
