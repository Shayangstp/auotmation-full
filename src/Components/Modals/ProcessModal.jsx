import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button, Table } from "react-bootstrap";
import { selectProcessModal, RsetProcessModal } from '../Slices/modalsSlice';
import { selectCurrentReqProcess } from "../Slices/currentReqSlice";
import moment from "moment-jalaali";
import xssFilters from "xss-filters";

const ProcessModal = () => {
    const dispatch = useDispatch();
    const processModal = useSelector(selectProcessModal);
    const currentReqProcess = useSelector(selectCurrentReqProcess);
    
    const actionCodeTitle = (process) => {
        if(process.actionCode === 0){
            return 'درخواست کننده: '
        }else if(process.actionCode === 2){
            return 'ابطال کننده: '
        }else{
            return 'تایید کننده: '
        }
    }

    return (
        <div>
            <Modal
                size="s"
                centered
                show={processModal}
                onHide={() => {
                    dispatch(RsetProcessModal(false));
                }}
                className='modal'
                scrollable={true}
            >
                <Modal.Body>
                    {currentReqProcess.map(process => {
                        return (<div className="mb-2">
                            <span className="me-2">{actionCodeTitle(process)}</span>
                            <span className="me-3">{xssFilters.inHTMLData(process.userFullName)}</span>
                            <span className="">{moment.utc(xssFilters.inHTMLData(process.date), 'YYYY/MM/DD hh:mm A').locale('fa').format('jYYYY/jMM/jDD hh:mm A')}</span>
                        </div>)
                    })}
                </Modal.Body>
                <Modal.Footer className="justify-content-end border-0">
                    <Button variant="secondary" onClick={() => {
                        dispatch(RsetProcessModal(false));
                    }}>بستن</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ProcessModal;