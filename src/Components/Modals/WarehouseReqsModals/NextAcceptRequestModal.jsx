import React, { useContext, useEffect, useState, Fragment } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import { rootContext } from "../../context/rootContext";
import { errorMessage } from './../../../utils/message';
import { useDispatch, useSelector } from 'react-redux';
import {selectUser} from '../../Slices/mainSlices';
import { getToPersonByRole } from '../../../Services/rootServices';

import { selectNextAcceptReqModal, RsetNextAcceptReqModal, RsetAcceptReqModal, RsetAcceptReqComment } from "../../Slices/modalsSlice";
import { selectCurrentReqItems } from "../../Slices/currentReqSlice";

const NextAcceptRequestModal = () => {
    const dispatch = useDispatch();
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);

    const user = useSelector(selectUser);
    const mainContext = useContext(rootContext);
    const {
        currentReqToPerson,
        setCurrentReqToPerson,
        handleAcceptReq,
        currentReqInfo,
    } = mainContext;
    const [toPersons, setToPersons] = useState([]);
    const getToPersons = async ()=>{
        const toPersonsRes = await getToPersonByRole('36, 3', user.Location, user.CompanyCode, 0, null, '0');
        if(toPersonsRes.data.code === 415){
            setToPersons(toPersonsRes.data.list)
        }else{
            setToPersons([])
        }
    }
    useEffect(() => {
        getToPersons();
    }, [user])

    const [isLastAction, setIsLastAction] = useState(true);
    const currentReqItems = useSelector(selectCurrentReqItems)
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={nextAcceptReqModal}
            onHide={() => {
                dispatch(RsetNextAcceptReqModal(false));
            }}
            scrollable={true}
            dialogClassName='overflow-visible-modal'
        >
            <Modal.Body>
                <span>آیا نیاز به تایید بعدی هست؟</span>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                {isLastAction === false ?
                    <Fragment>
                        <Select className='me-3 w-100 mb-4' value={currentReqToPerson} name="currentReqToPerson"
                            onChange={(e) => { setCurrentReqToPerson(e) }} placeholder='انتخاب دریافت کننده درخواست'
                            options={toPersons}/>
                        <Button variant="success" onClick={() => {
                            if (currentReqToPerson !== '') {
                                if(currentReqInfo.lastActionCode === 6){
                                    handleAcceptReq('warehouseToPersonAccept');
                                }else{
                                    handleAcceptReq('toPersonAccept');
                                }
                            } else {
                                errorMessage('انتخاب شخص دریافت کننده درخواست الزامی می باشد!')
                            }
                        }}>بله</Button>
                        <Button
                        onClick={() => {
                            dispatch(RsetAcceptReqComment(''));
                            setCurrentReqToPerson('');
                            dispatch(RsetAcceptReqModal(false));
                            dispatch(RsetNextAcceptReqModal(false));
                        }}
                        variant="secondary"
                    >بستن</Button>
                    </Fragment>
                    :
                    <Fragment>
                        <Button variant="success" onClick={() => {
                            setIsLastAction(false);
                        }}>بله</Button>
                        <Button variant="danger" onClick={() => {
                            if(currentReqInfo.lastActionCode === 6){
                                handleAcceptReq('warehouseAccept');
                            }else{
                                handleAcceptReq('lastAccept');
                            }
                        }}>خیر</Button>
                    </Fragment>
                }
            </Modal.Footer>
        </Modal>
    )
}

export default NextAcceptRequestModal;