import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  RsetUserInfoModals,
  selectUserInfoModal,
} from "../../slices/OverTimeSlice";
import { selectUserInformations, selectUserPic } from "../../slices/mainSlices";
import xssFilters from "xss-filters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const UserInfoModal = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfoModal);
  const userInformations = useSelector(selectUserInformations);
  const userImage = useSelector(selectUserPic);

  const handleUserImage = () => {
    if (userImage.photo_type !== "") {
      return (
        <img
          width="95px"
          height="95px"
          className="rounded-circle mb-1 mb-md-0 cursorPointer"
          alt="userAvatar"
          src={`data:${userImage.photo_type} ;base64,${userImage.profile_photo}`}
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faCircleUser}
          className="rounded-circle font95 mb-1 mb-md-0 text-secondary"
        />
      );
    }
  };

  return (
    <>
      <Modal
        show={userInfo}
        onHide={() => dispatch(RsetUserInfoModals(false))}
        backdrop="static"
        role="dialog"
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Body className="d-flex flex-wrap justify-content-between">
          <ul className="list-unstyled p-0">
            <li>
              <span className="fw-bold">نام و نام خانوادگی: </span>
              {xssFilters.inHTMLData(userInformations.first_name) +
                " " +
                xssFilters.inHTMLData(userInformations.last_name)}
            </li>
            <li>
              <span className="fw-bold">شرکت: </span>
              {xssFilters.inHTMLData(userInformations.company)}
            </li>
            <li>
              <span className="fw-bold">واحد: </span>
              {xssFilters.inHTMLData(userInformations.department)}
            </li>
            <li>
              <span className="fw-bold">ایمیل: </span>
              {xssFilters.inHTMLData(userInformations.email)}
            </li>
            <li><span className="fw-bold">سرپرست: </span>{xssFilters.inHTMLData(userInfo.Supervisor)}</li>
                    <li><span className="fw-bold">مدیر: </span>{xssFilters.inHTMLData(userInfo.Manager)}</li>
          </ul>
          {handleUserImage()}
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button
            name="acceptModal"
            variant="secondary"
            onClick={() => dispatch(RsetUserInfoModals(false))}
          >
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserInfoModal;
