import React, { useContext } from "react";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { useHistory } from "react-router-dom";
import { Modal, Button, Form, Col } from "react-bootstrap";

const GetPasswordModal = () => {
    let history = useHistory();
    const officeContext = useContext(officeReqContext);
    const {
        getPasswordModalShow,
        setGetPasswordModalShow,
        paySlipPass,
        setPaySlipPass,
        handleUserPaySlip
    } = officeContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop='static'
            show={getPasswordModalShow}
            onHide={() => {
                setGetPasswordModalShow(false);
            }}
            scrollable={true}
            id='getPass'
        >
            <Modal.Header>
                <h3>لطفا رمز خود را وارد کنید!</h3>
            </Modal.Header>
            <Modal.Body>
                <Form className="d-flex" onSubmit={(e)=>{handleUserPaySlip(e, 'currentPaySlip')}}>
                    <Form.Group as={Col} md='6' className='mb-4 px-0 px-md-3'>
                        <Form.Control type="password" value={paySlipPass} name="paySlipPass" onChange={(e) => { setPaySlipPass(e.target.value) }} placeholder='رمز عبور'/>
                    </Form.Group>
                    <Form.Group as={Col} md='6' className='mb-4 px-0 px-md-3 d-flex justify-content-between align-items-center'>
                        <div>
                            <Button variant="success" type="submit">تایید</Button>
                        </div>
                        <div>
                            <Button variant="danger" onClick={async ()=>{
                                await setGetPasswordModalShow(false);
                                history.push("/Home")
                            }}>
                                انصراف 
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default GetPasswordModal;