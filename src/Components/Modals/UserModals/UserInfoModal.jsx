import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { rootContext } from './../../context/rootContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";

const UserInfoModal = () => {

    const mainContext = useContext(rootContext);
    const {
        userInfoModal,
        setUserInfoModal,
        userInfo,
        userImage
    } = mainContext;

    const handleUserImage = () => {
        if (userImage !== '') {
            return (
                <img width='95px' height='95px' className='rounded-circle mb-1 mb-md-0 cursorPointer'
                 alt='userAvatar' src={userImage} />
            )
        } else {
            return <FontAwesomeIcon icon={faCircleUser} className="font95 text-secondary mb-1 mb-md-0"/>;
        }
    }

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="md"
            backdrop="static"
            show={userInfoModal}
            onHide={() => {
                setUserInfoModal(false);
            }}
            scrollable={true}
        >
            <Modal.Body className="d-flex flex-wrap justify-content-between">
                <ul className="list-unstyled p-0">
                    <li><span className="fw-bold">نام و نام خانوادگی: </span>{xssFilters.inHTMLData(userInfo.FullName)}</li>
                    <li><span className="fw-bold">شرکت: </span>{xssFilters.inHTMLData(userInfo.CompanyName)}</li>
                    <li><span className="fw-bold">واحد: </span>{xssFilters.inHTMLData(userInfo.DeptName)}</li>
                    <li><span className="fw-bold">ایمیل: </span>{xssFilters.inHTMLData(userInfo.Email)}</li>
                    <li><span className="fw-bold">سرپرست: </span>{xssFilters.inHTMLData(userInfo.Supervisor)}</li>
                    <li><span className="fw-bold">مدیر: </span>{xssFilters.inHTMLData(userInfo.Manager)}</li>
                </ul>
                {handleUserImage()}
            </Modal.Body>
            <Modal.Footer className="justify-content-end">
                <Button variant="secondary" onClick={() => {
                    setUserInfoModal(false);
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserInfoModal;