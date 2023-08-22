import React, {useContext} from "react";
import { officeReqContext } from './../../context/officeContext/officeReqContext';
import { Modal, Button } from "react-bootstrap";

const PatchDayFoodModal = () => {
    const requestContext = useContext(officeReqContext);
    const {
        patchDayFoodModal,
        setPatchDayFoodModal,
        handlePatchDaysFood
    } = requestContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            backdrop="static"
            show={patchDayFoodModal}
            onHide={() => {
                setPatchDayFoodModal(false);
            }}
            scrollable={true}
        >
            <Modal.Body>
                <span>
                    این فیلد قبلا ثبت شده، اطلاعات جدید جایگزین شوند؟
                </span>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <Button variant="success" onClick={()=>{
                    handlePatchDaysFood();
                }}>بله</Button>
                <Button variant="danger" onClick={()=>{
                    setPatchDayFoodModal(false);
                }}>خیر</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PatchDayFoodModal;