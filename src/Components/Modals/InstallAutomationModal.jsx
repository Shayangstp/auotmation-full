import React from "react";
import { Modal, Button } from "react-bootstrap";

const InstallAutomationModal = ({installAppModal, setInstallAppModal}) => {
    return(
        <Modal
            size="s"
            centered
            show={installAppModal}
            onHide={()=>{
                setInstallAppModal(false);
            }}
            className = 'modal bottom-0 top-auto height-auto'
            dialogClassName="vw-100"
            scrollable= {true}
        >
            {/* <Modal.Header className='justify-content-center border-0 text-center'>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                    برای نصب برنامه کلیک کنید
                </Modal.Title>
            </Modal.Header> */}
            <Modal.Footer className="justify-content-around border-0">
                <span className="cursorPointer" id='installApp' onClick={()=> {
                    setInstallAppModal(false);
                }}>
                    برای نصب برنامه کلیک کنید
                </span>
                {/* <Button
                    id='installApp'
                    variant="success"
                    onClick={()=> {
                        setInstallAppModal(false);
                    }}
                >نصب</Button> */}
                {/* <Button variant="danger" onClick={()=>{
                    setInstallAppModal(false);
                }}>خیر</Button> */}
            </Modal.Footer>
        </Modal>
    )
}

export default InstallAutomationModal;