import React from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import CountDown from "../Common/CountDown";

const CompleteUserInfoModal = ({lockLinksModal, setLockLinksModal, setLocklinks, clickedLink, setClearReq}) => {
    return(
        <div>
            <Modal
                size="s"
                centered
                backdrop="static"
                show={lockLinksModal}
                onHide={()=>{
                    setLockLinksModal(false);
                }}
                className = 'modal'
                scrollable= {true}
            >
                <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                        شما درحال ویرایش اطلاعات هستید.
                        <br/>
                        آیا جهت خروج از این صفحه اطمینان دارید؟
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer className="justify-content-around border-0 pb-5">
                    <Link to={clickedLink} className='w-45'>
                        <Button
                            className='w-100'
                            onClick={()=> {
                                setLocklinks(false);
                                setClearReq(true);
                                setLockLinksModal(false);
                            }}
                        >بله</Button>
                    </Link>
                    <CountDown exitModal={lockLinksModal} onClick={(e) => { setLockLinksModal(e) }}/>
                </Modal.Footer>
            </Modal>
        </div>
    )
    
}

export default CompleteUserInfoModal;