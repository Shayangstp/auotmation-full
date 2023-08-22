import React from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import CountDown from "../Common/CountDown";

const LogoutModal = ({logOutModal, setLogoutModal}) => {
    return(
        <Modal
            size="s"
            centered
            backdrop="static"
            show={logOutModal}
            onHide={()=>{
                setLogoutModal(false);
            }}
            className = 'modal'
            scrollable= {true}
        >
            <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                    آیا از خروج اطمینان دارید؟
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer className="justify-content-around border-0 pb-5">
                <Link to='/Logout' className='w-45'>
                    <Button
                        className='w-100'
                        onClick={()=> {
                            setLogoutModal(false);
                        }}
                    >بله</Button>
                </Link>
                <CountDown logOutModal={logOutModal} onClick={(e) => { setLogoutModal(e) }}/>
            </Modal.Footer>
        </Modal>
    )
}

export default LogoutModal;