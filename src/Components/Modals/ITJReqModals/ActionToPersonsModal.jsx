import React, { useContext } from "react";
import { Modal, Button, Row, Form, Col } from "react-bootstrap";
import { iranTolJobCntxt } from "../../context/iranTolJobContext/IranTolJobCntxt";
import Select from 'react-select';
import { useEffect } from "react";

const ActionToPersonsModal = () => {

    const jobContext = useContext(iranTolJobCntxt);
    const {
        actionToPersonsModal,
        setActionToPersonsModal,
        handleITJReqActionToPersons,
        needConfirmation,
        setNeedConfirmation,
        needConfirmationUsers,
        setNeedConfirmationUsers,
        handleNeedConfirmationUsers,
        needConfirmationSelect
    } = jobContext;

    useEffect(() => {
        if (needConfirmation === true) {
            handleNeedConfirmationUsers();
        }
    }, [needConfirmation])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            backdrop="static"
            show={actionToPersonsModal}
            onHide={() => {
                setActionToPersonsModal(false);
            }}
            scrollable={true}
        >
            <Modal.Body>
                <span>ارسال درخواست</span>
                <Row>
                    <Form.Group as={Col} md='12' className="mt-3">
                        <input type='checkbox' name='needConfirmation' value={needConfirmation} onChange={(e) => {
                            setNeedConfirmation(!needConfirmation)
                        }} />
                        <Form.Label className='mb-0 ms-2'>نیاز به تایید مدیریت دارد؟</Form.Label>
                    </Form.Group>
                    {needConfirmation === true ? <Form.Group as={Col} md='12' className='mt-3 mb-5'>
                        <Select isMulti placeholder='انتخاب...' name='needConfirmationUsers' value={needConfirmationUsers} options={needConfirmationSelect} onChange={(e) => {
                            setNeedConfirmationUsers(e)
                        }} />
                    </Form.Group> : null}
                </Row>
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="success" onClick={() => {
                        handleITJReqActionToPersons();
                    }}>ارسال</Button>
                    <Button variant="danger" onClick={() => {
                        setActionToPersonsModal(false);
                        setNeedConfirmation(false);
                        setNeedConfirmationUsers([]);
                        const sendToPersons = document.getElementById('sendToPersons');
                        const confirmITJReq = document.getElementById('confirmITJReq');
                        if (sendToPersons !== null) {
                            sendToPersons.classList.remove('disabled');
                        }
                        if (confirmITJReq !== null) {
                            confirmITJReq.classList.add('disabled');
                        }
                    }}>انصراف</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ActionToPersonsModal;