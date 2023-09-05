import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInformations, selectUserImage, selectUserInfoModal, RsetUserInfoModal } from "../Slices/mainSlices";
import xssFilters from "xss-filters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const UserInfoModal = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfoModal);
  const userInformations = useSelector(selectUserInformations);
  const userImage = useSelector(selectUserImage);

  const handleUserImage = () => {
    if (userImage !== "") {
      return (
        <img width="95px" height="95px" className="rounded-circle mb-1 mb-md-0 cursorPointer" alt="userAvatar" src={userImage} />
      );
    } else {
      return <FontAwesomeIcon icon={faCircleUser} className="rounded-circle font95 mb-1 mb-md-0 text-secondary" />;
    }
  };

  return (
    <Modal
      show={userInfo}
      onHide={() => { dispatch(RsetUserInfoModal(false)) }}
      centered
      size="md"
    >
      <Modal.Body className="d-flex flex-wrap justify-content-between">
        <ul className="list-unstyled p-0">
          <li className="mb-2">
            <span className="fw-bold">نام و نام خانوادگی: </span>
            {xssFilters.inHTMLData(userInformations.FullName)}
          </li>
          <li className="mb-2">
            <span className="fw-bold">شرکت: </span>
            {xssFilters.inHTMLData(userInformations.CompanyName)}
          </li>
          <li className="mb-2">
            <span className="fw-bold">واحد: </span>
            {xssFilters.inHTMLData(userInformations.DeptName)}
          </li>
          <li className="mb-2">
            <span className="fw-bold">ایمیل: </span>
            {xssFilters.inHTMLData(userInformations.Email)}
          </li>
          <li className="mb-2"><span className="fw-bold">سرپرست: </span>{xssFilters.inHTMLData(userInformations.Supervisor)}</li>
          <li><span className="fw-bold">مدیر: </span>{xssFilters.inHTMLData(userInformations.Manager)}</li>
        </ul>
        {handleUserImage()}
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <Button
          name="acceptModal"
          variant="secondary"
          onClick={() => { dispatch(RsetUserInfoModal(false)) }}
        >
          بستن
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfoModal;
