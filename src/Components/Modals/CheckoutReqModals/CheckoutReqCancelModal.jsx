import React from "react";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import { Modal, Button, Table } from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import {
  RsetCancelReqModal,
  selectCancelReqModal,
} from "../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";
import {
  RsetCancelReqComment,
  selectCancelReqComment,
} from "../../Slices/modalsSlice";
import {
  handleCancelReq,
  handleUserImage,
  handleUserInformation,
} from "../../Slices/mainSlices";
import {
  selectCurrentReqComments,
  selectCurrentReqItems,
  RsetCurrentReqItems,
} from "../../Slices/currentReqSlice";
import { handleCheckoutReqCancel } from "../../Slices/checkoutReqSlices";

const CheckoutReqCancelModal = () => {
  const dispatch = useDispatch();
  const cancelReqModal = useSelector(selectCancelReqModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const cancelReqComment = useSelector(selectCancelReqComment);
  const currentReqItems = useSelector(selectCurrentReqItems);
  const currentReqComments = useSelector(selectCurrentReqComments);

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
      <Modal.Header className="d-block bg-danger text-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex justify-content-between"
        >
          <div>
            <span className="fw-bold me-2">شماره سریال:</span>
            <span>{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
          </div>
          <span>ابطال درخواست</span>
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
            {xssFilters.inHTMLData(currentReqInfo.fullName)}
          </li>
          {currentReqInfo.sameAccess !== null && (
            <li className="mb-2">
              <span className="fw-bold">کاربر مشابه: </span>
              {xssFilters.inHTMLData(currentReqInfo.sameAccess)}
            </li>
          )}
          <li className="mb-2">
            <span className="fw-bold">توضیحات: </span>
            {xssFilters.inHTMLData(currentReqInfo.description)}
          </li>
        </ul>
        {currentReqItems.length !== 0 && (
          <Table striped bordered hover responsive className="mt-5">
            <thead className="bg-secondary light-text">
              <tr>
                <th>ردیف</th>
                <th>نام نرم افزار</th>
                <th>شرکت عامل</th>
                <th>موارد مورد نیاز</th>
              </tr>
            </thead>
            <tbody>
              {currentReqItems.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td className="font12">{idx + 1}</td>
                    <td className="font12">{item.softNames}</td>
                    <td className="font12">{item.companyNames}</td>
                    <td className="font12">{item.requiredParts}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer className="d-block">
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
        <div className="d-flex justify-content-between">
          <div className="w-75 d-flex align-items-center">
            <input
              className="form-control me-3 w-75"
              placeholder="توضیحات کنسل کننده درخواست"
              defaultValue={cancelReqComment}
              name="setComment"
              onChange={(e) => dispatch(RsetCancelReqComment(e.target.value))}
            />
            <Button
              variant="danger"
              onClick={(e) => {
                dispatch(handleCheckoutReqCancel(e));
              }}
            >
              ابطال درخواست
            </Button>
          </div>
          <Button
            onClick={() => {
              dispatch(RsetCancelReqModal(false));
              dispatch(RsetCurrentReqItems([]));
              dispatch(RsetCancelReqComment(""));
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

export default CheckoutReqCancelModal;
