import React, {useState, useEffect} from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import { errorMessage } from './../../../utils/message';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../Slices/mainSlices';
import { getToPersonByRole } from '../../../Services/rootServices';
import { handleAcceptSoftwareReq } from '../../Slices/softwareSlice';
import { selectCurrentReqToPerson, RsetCurrentReqToPerson } from '../../Slices/currentReqSlice';
import { selectNextAcceptReqModal, RsetNextAcceptReqModal } from "../../Slices/modalsSlice";

const NextAcceptRequestModal = () => {
    const dispatch = useDispatch();
    const nextAcceptReqModal = useSelector(selectNextAcceptReqModal);
    const user = useSelector(selectUser);
    const currentReqToPerson = useSelector(selectCurrentReqToPerson);

    const [toPersons, setToPersons] = useState([]);
    const getToPersons = async ()=>{
        const toPersonsRes = await getToPersonByRole('14, 25', user.Location, user.CompanyCode, 1, null, '0');
        if(toPersonsRes.data.code === 415){
            setToPersons(toPersonsRes.data.list)
        }else{
            setToPersons([])
        }
    }
    useEffect(() => {
        getToPersons();
    }, [user])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
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
                <Select className='me-3 w-100 mb-4' value={currentReqToPerson} name="currentReqToPerson"
                    onChange={(e) => { dispatch(RsetCurrentReqToPerson(e)) }} placeholder='انتخاب دریافت کننده درخواست'
                    options={toPersons} />
                <Button variant="success" onClick={(e) => {
                    if(currentReqToPerson !== ''){
                        e.preventDefault();
                        dispatch(handleAcceptSoftwareReq(true));
                    }else{
                        errorMessage('شخص دریافت کننده انتخاب نشده است!');
                    }
                }}>بله</Button>
                <Button variant="danger" onClick={(e) => {
                    e.preventDefault();
                    dispatch(handleAcceptSoftwareReq(false));
                }}>خیر</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NextAcceptRequestModal;