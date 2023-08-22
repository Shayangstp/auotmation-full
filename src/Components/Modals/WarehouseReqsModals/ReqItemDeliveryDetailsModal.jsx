import React, { useContext, useEffect } from "react";
import { rootContext } from "../../context/rootContext";
import { reqContext } from "../../context/warehouseReqsContext/reqContext";
import { Modal, Button, Table } from "react-bootstrap";
import moment from 'moment-jalaali';
import xssFilters from "xss-filters";
import { useDispatch } from "react-redux";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";

const ReqItemDeliveryDetailsModal = () => {
    const dispatch = useDispatch();
    const mainContext = useContext(rootContext);
    const {
        reqItemReceivedDetailsModal,
        setReqItemReceivedDetailsModal,
        currentReqItem
    } = mainContext;

    const requestContext = useContext(reqContext);
    const {
        itemReceivedDetails
    } = requestContext;

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqItemReceivedDetailsModal}
            onHide={() => {
                setReqItemReceivedDetailsModal(false);
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Header className='d-block bg-info text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-center">
                    جزئیات تحویل
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered striped hover responsive>
                    <thead>
                        <tr>
                            <th>ردیف</th>
                            <th>تعداد/مقدار تحویلی</th>
                            <th>واحد شمارش تحویلی</th>
                            <th>انبار</th>
                            <th>تاریخ تحویل</th>
                            <th>تحویل گیرنده</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemReceivedDetails !== undefined && itemReceivedDetails.map((item, index) => (
                            <tr key={item.deliveryDate}>
                                <td>{index + 1}</td>
                                <td>
                                    {item.receivedAmount}
                                </td>
                                <td>
                                    {item.receivedUnitName}
                                </td>
                                <td>
                                    {item.inventoryName}
                                </td>
                                <td>
                                    {moment(item.deliveryDate).locale('fa').format('jYYYY/jMM/jDD HH:MM')}
                                </td>
                                <td className="cursorPointer" onClick={()=>{
                                    dispatch(handleUserInformation(item.receiver));
                                    dispatch(handleUserImage({userId: item.receiver, status: 1}));
                                }}>
                                    {item.receiverName}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td>
                                <p>جمع کل: {itemReceivedDetails[0].receivedCount}</p>
                                <p className="m-0">مانده: {itemReceivedDetails[0].remainder}</p>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer className='d-block'>
                <div className="d-flex justify-content-end">
                    <Button
                        onClick={() => {
                            setReqItemReceivedDetailsModal(false);
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqItemDeliveryDetailsModal;