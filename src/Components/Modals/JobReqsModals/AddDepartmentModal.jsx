import React from "react";
import { Modal, Button } from "react-bootstrap";

const AddDepartmentModal = ({reqAddDepartmentModal, setReqAddDepartmentModal, reqAddNewDepartment, setReqAddNewDepartment, handleAddNewDepartment}) => {
    return(
        <Modal
            size="s"
            centered
            backdrop="static"
            show={reqAddDepartmentModal}
            onHide={()=>{
                setReqAddDepartmentModal(false);
            }}
            className = 'modal'
            scrollable= {true}
        >
            <Modal.Header className='justify-content-center border-0 pt-5 text-center'>
                <Modal.Title id="contained-modal-title-vcenter" className="modal-title font20 fw-bold">
                    افزودن دپارتمان جدید
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input className='form-control' type='text' name='addNewDepartment' value={reqAddNewDepartment} onChange={(e)=>{setReqAddNewDepartment(e.target.value)}}/> 
            </Modal.Body>
            <Modal.Footer className="justify-content-between border-0 pb-5">
                <Button
                    onClick={()=> {
                        handleAddNewDepartment();
                        setReqAddDepartmentModal(false);
                        setReqAddNewDepartment('');
                    }}
                >افزودن</Button>
                <Button
                    variant="danger"
                    onClick={()=> {
                        setReqAddDepartmentModal(false);
                        setReqAddNewDepartment('');
                    }}
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddDepartmentModal;