import React, {useContext} from "react";
import { rootContext } from "../context/rootContext";
import { Modal, Button } from "react-bootstrap";
const ItemDeletePermissionModal = ({deleteItemFromList, itemId}) => {
    const mainContext = useContext(rootContext);
    const {
        itemDeletePerModal,
        setItemDeletePerModal
    } = mainContext;
    return(
        <Modal
            size="sm"
            centered
            backdrop='static'
            show={itemDeletePerModal}
            onHide={() => {
                setItemDeletePerModal(false)
            }}
            className="modal"
        >
            <Modal.Body>
                <p className=''>از حذف این مورد اطمینان دارید؟</p>
                <div className="d-flex justify-content-between">
                    <Button variant="danger" onClick={()=> {deleteItemFromList(itemId)}}>بله</Button>
                    <Button variant="secondary" onClick={() => setItemDeletePerModal(false)}>خير</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ItemDeletePermissionModal;