import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import momentJalaali from "moment-jalaali";
import {
  selectUserInformations,
  selectUserInfoModal,
  RsetUserInfoModal,
  selectUserImage,
} from "../../Slices/mainSlices";
import {
  selectCheckoutProcessModal,
  RsetCheckoutProcessModal,
} from "../../Slices/checkoutReqSlices";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";
import xssFilters from "xss-filters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const roles = [
  { role: "19", deptName: "واحد اداری" },
  { role: "17", deptName: "واحد نرم افزار" },
  { role: "3", deptName: "واحد انبار" },
  { role: "27", deptName: "واحد اموال" },
  { role: "28", deptName: "واحد کامپیوتر" },
  { role: "29", deptName: "واحد مالی (هزینه)" },
  { role: "30", deptName: "واحد مالی (صندوق)" },
  { role: "31", deptName: "واحد مالی (حقوق و دستمزد)" },
  { role: "32", deptName: "واحد منابع انسانی" },
  { role: "33", deptName: "واحد دبیرخانه" },
];

const CheckoutProcessModal = () => {
  const dispatch = useDispatch();
  const userInformations = useSelector(selectUserInformations);
  const checkoutProcessModal = useSelector(selectCheckoutProcessModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);

  return (
    <Modal
      show={checkoutProcessModal}
      onHide={() => {
        dispatch(RsetCheckoutProcessModal(false));
      }}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header className="d-block bg-primary text-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex justify-content-between"
        >
          <div>
            <span className="fw-bold me-2">شماره سریال:</span>
            <span>{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
          </div>
          <span>روند در خواست تسویه</span>
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
      <Modal.Body className="d-flex flex-column flex-wrap justify-content-center">
        {roles.map((item, idx) => {
          return (
            <p key={idx}>
              {currentReqInfo
                ? currentReqInfo.acceptedRoles
                    .split(",")
                    .some((role) => role === item.role)
                  ? `تسویه حساب از نظر  ${item.deptName} بلا مانع می باشد.`
                  : null
                : null}
            </p>
          );
        })}
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <Button
          name="acceptModal"
          variant="secondary"
          onClick={() => {
            dispatch(RsetCheckoutProcessModal(false));
          }}
        >
          بستن
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutProcessModal;
