import React, { useContext } from "react";
import xssFilters from "xss-filters";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { Modal, Button } from "react-bootstrap";
import moment from "moment-jalaali";

const OfficeReqItemDisLikesModal = () => {
    const officeContext = useContext(officeReqContext);
    const {
        reqItemDisLikesList,
        reqItemDisLikesModalShow,
        setReqItemDisLikesModalShow,
    } = officeContext;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={reqItemDisLikesModalShow}
            onHide={() => {
                setReqItemDisLikesModalShow(false);
            }}
            scrollable={true}
        >
            <Modal.Header>
                <h3>نظرات منفی :</h3>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-unstyled m-0 p-2">
                    {reqItemDisLikesList.map((item, index) => (
                        <li key={index} className="mb-2 font12 d-flex align-items-center justify-content-between">
                            <div>
                                {xssFilters.inHTMLData(item.first_name) + ' ' + xssFilters.inHTMLData(item.last_name)}
                            </div>
                            <div>
                                {' ( ' + moment.utc(xssFilters.inHTMLData(item.date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD') + ' ) '}
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>{setReqItemDisLikesModalShow(false)}}>بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OfficeReqItemDisLikesModal;