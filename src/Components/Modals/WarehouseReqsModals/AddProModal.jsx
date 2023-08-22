import React, { useContext } from "react";
import { Modal, Button, Row, Col, Table } from "react-bootstrap";
import { reqContext } from '../../context/warehouseReqsContext/reqContext';
import xssFilters from "xss-filters";
import AddPro from "../../WarehouseReq/AddPro";
import { selectCurrentReqItem } from "../../Slices/currentReqSlice";
import { useSelector } from "react-redux";

const AddProModal = ({item}) => {
    const currentReqItem = useSelector(selectCurrentReqItem);
    const requestContext = useContext(reqContext);
    const {
        addProModal,
        setAddProModal,
        addProList,
        setAddProList,
        handleAddStoreAsCode,
        handleAddStoreAsName,
        selectedPro,
        setSelectedPro,
    } = requestContext;
    
    return (
        <Modal
            size="s"
            centered
            backdrop="static"
            show={addProModal}
            onHide={() => {
                setAddProModal(false);
            }}
            dialogClassName="modal-96w"
            scrollable={true}
        >
            <Modal.Body>
                <AddPro {...currentReqItem}/>
                {addProList.length !== undefined && addProList.length !== 0
                    ? <Row>
                        <Col md='12'>
                            <Table striped bordered hover responsive size="sm" variant="light">
                                <thead>
                                    <tr>
                                        <th className="bg-secondary text-white fw-normal">#</th>
                                        <th className="bg-secondary text-white fw-normal">ردیف</th>
                                        <th className="bg-secondary text-white fw-normal">کد کالا</th>
                                        <th className="bg-secondary text-white fw-normal">شرح کالا</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addProList.map((addProItem, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <input type='radio' name='selectedPro' value={addProItem.ItemCode} onChange={() => {
                                                        setSelectedPro({ code: addProItem.ItemCode, name: addProItem.ItemName });
                                                        handleAddStoreAsCode(addProItem.ItemCode, currentReqItem.itemId);
                                                    }} />
                                                </td>
                                                <td>{index + 1}</td>
                                                <td>{<span>{xssFilters.inHTMLData(addProItem.ItemCode)}</span>}</td>
                                                <td>{<span>{xssFilters.inHTMLData(addProItem.ItemName)}</span>}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    : null
                }
            </Modal.Body>
            <Modal.Footer className="justify-content-around border-0 pb-5">
                <Button
                    disabled={selectedPro.code !== undefined ? false : true}
                    onClick={() => {
                        handleAddStoreAsCode(selectedPro.code, currentReqItem.itemId);
                        handleAddStoreAsName(selectedPro.name, currentReqItem.itemId)
                        setAddProList([]);
                        setSelectedPro({});
                        setAddProModal(false);
                        document.getElementById('addProN').blur()
                    }}
                >انتخاب کالا</Button>
                <Button variant="secondary" onClick={() => { 
                    setAddProList([]);
                    setSelectedPro({});
                    setAddProModal(false);
                }}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default AddProModal;