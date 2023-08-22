import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const NewRequestModal = ({newReqModal, setNewReqModal, newReqInfo, setAcceptRequestModal, setCancelRequestModal, setEditRequestModal, setViewRequestModal, setCurrentRequest, setCurrentRequestItems,
     handleUpdateReqs, hasNewReq, handleCheckVisited}) => {
    const [newReqs, setNewReqs] = useState([]);
    const location = useLocation();
    const updateReqs = () => {
        if(location.pathname === '/WarehouseReqPage'){
            handleUpdateReqs();
        }
    }
    useEffect(()=>{
        updateReqs();
    },[])
    return(
        <Modal
            size="md"
            show={newReqModal}
            onHide={() => {
                setNewReqModal(false);
            }}
            scrollable={true}
            className='NewRequestModal'
        >
            <Modal.Body>
                {hasNewReq ?
                    <span>
                        درخواست جدیدی توسط {xssFilters.inHTMLData(newReqInfo.userInfo.gender) + " " + xssFilters.inHTMLData(newReqInfo.userInfo.first_name) + " " + xssFilters.inHTMLData(newReqInfo.userInfo.last_name)} در  واحد {xssFilters.inHTMLData(newReqInfo.userInfo.department)} ثبت شده!
                    </span>
                :
                    <span>
                        درخواست های جدیدی ثبت شده اند!
                    </span>
                }
            </Modal.Body>
            <Modal.Footer className="d-felx justify-content-between">
                {hasNewReq ?
                    <div className="w-75">
                        <Button className='me-2' variant="success" size='sm' onClick={()=>{
                            setCurrentRequest(newReqInfo);
                            setCurrentRequestItems(newReqInfo.items);
                            setNewReqModal(false);
                            setAcceptRequestModal(true);
                        }}><Link className='text-white text-decoration-none' to={'/WarehouseReqPage'}>تایید</Link></Button>
                        <Button className='me-2' variant="danger" size='sm' onClick={()=>{
                            setCurrentRequest(newReqInfo);
                            setCurrentRequestItems(newReqInfo.items);
                            setNewReqModal(false);
                            setCancelRequestModal(true);
                        }}><Link className='text-white text-decoration-none' to={'/WarehouseReqPage'}>ابطال</Link></Button>
                        <Button className='me-2' variant="primary" size='sm' onClick={()=>{
                            setCurrentRequest(newReqInfo);
                            setCurrentRequestItems(newReqInfo.items);
                            setNewReqModal(false);
                            setEditRequestModal(true);
                        }}><Link className='text-white text-decoration-none' to={'/WarehouseReqPage'}>ویرایش</Link></Button>
                        <Button className='me-2' variant="warning" size='sm' onClick={()=>{
                            setCurrentRequest(newReqInfo);
                            setCurrentRequestItems(newReqInfo.items);
                            setNewReqModal(false);
                            setViewRequestModal(true);
                        }}><Link className='text-white text-decoration-none' to={'/WarehouseReqPage'}>مشاهده</Link></Button>
                    </div>
                : 
                    <Button className='me-2' variant="success" size='sm' onClick={()=>{
                        setNewReqModal(false);
                        handleCheckVisited();
                    }}><Link className='text-white text-decoration-none' to={'/WarehouseReqPage'}>مشاهده درخواست ها</Link></Button>
                }
                <Button className="mt-2 mt-md-0" variant="danger" onClick={()=>{
                    setNewReqModal(false);
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewRequestModal;