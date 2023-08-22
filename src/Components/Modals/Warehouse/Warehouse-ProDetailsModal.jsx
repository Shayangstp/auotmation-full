import React, { useContext } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { rootContext } from "../../context/rootContext";

const WarehouseProDetailsModal = (itemId) => {
    const mainContext = useContext(rootContext);
    const {
        proDetailsModal,
        setProDetailsModal,
        proInfo
    } = mainContext;

    return (
        <Modal
            size="s"
            centered
            backdrop="static"
            show={proDetailsModal}
            onHide={() => {
                setProDetailsModal(false);
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Body>
                <Table hover striped responsive bordered className="my-5">
                    <thead>
                        <tr>
                            <td className="fw-bold">کد کالا</td>
                            <td className="fw-bold">شرح کالا</td>
                            <td className="fw-bold">واحد شمارش</td>
                            <td className="fw-bold">فی</td>
                            <td className="fw-bold">مشخصات فنی</td>
                            <td className="fw-bold">وضعیت گردش</td>
                            <td className="fw-bold">نقطه سفارش</td>
                            <td className="fw-bold">شماره قفسه</td>
                            <td className="fw-bold">بالانس</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{proInfo.ItemCode}</td>
                            <td>{proInfo.ItemName}</td>
                            <td>{proInfo.UnitName}</td>
                            <td>{proInfo.Fee}</td>
                            <td>{proInfo.TechnicalInfo}</td>
                            <td>{proInfo.InevntoryName}</td>
                            <td>{proInfo.OrderPoint}</td>
                            <td>{proInfo.CellNo}</td>
                            <td>{proInfo.Balance}</td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer className="justify-content-end">
                <Button variant="secondary" onClick={() => {
                    //handleResetAddPro();
                    setProDetailsModal(false); 
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default WarehouseProDetailsModal;