import React, {useContext} from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Row, Col, Alert } from "react-bootstrap";
import moment from 'moment-jalaali';
import { reqContext } from '../../context/jobReqsContext/reqContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleUser, faWarning } from '@fortawesome/free-solid-svg-icons';

import { rootContext } from "../../context/rootContext";

const ReqHistoryModal = () => {
    const mainContext = useContext(rootContext);
    const {
        loading,
        currentRequest,
        reqHistoryModal,
        setReqHistoryModal,
    } = mainContext;

    const requestContext = useContext(reqContext);
    const {
        reqComments,
    } = requestContext;
    var index = currentRequest.process.length-1;
    return(
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={reqHistoryModal}
            onHide={() => {
                setReqHistoryModal(false);
            }}
            dialogClassName="modal-96w overflow-visible-modal"
        >
            <Modal.Header className='d-block bg-info text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                    <div>
                        <span className='me-2'>تاریخچه درخواست شماره </span>
                        <span className="fw-bold">{xssFilters.inHTMLData(currentRequest.serial)}</span>
                    </div>
                    <div>
                        <span className='fw-bold me-2'>تاریخ درخواست:</span>
                        <span>{moment.utc(xssFilters.inHTMLData(currentRequest.process[index].date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <section>
                    {loading ?
                        <div className="d-flex justify-content-center mt-5 pt-5"><FontAwesomeIcon icon={faSpinner} className='spinner font60'/></div>
                    : 
                        reqComments.length === 0 ?
                            <Alert variant="warning">
                                <Alert.Heading>
                                    <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
                                    <span className="font24">نظری برای نمایش یافت نشد!</span>
                                </Alert.Heading>
                            </Alert>
                        :
                        <div>
                            {reqComments.map(comment=>{
                                return(
                                    <Row className='mb-5'>
                                        <Col md='2' lg='3' xl='2' xxl='1' className='d-flex'>
                                            {comment.photo === '' || comment.photo_type === ''?
                                                <FontAwesomeIcon icon={faCircleUser} className="font95 text-secondary mb-1 mb-md-0"/>
                                            :
                                                <img width='95px' height='95px' className='rounded-circle mb-1 mb-md-0' alt='userAvatar' src={'data:'+xssFilters.inHTMLData(comment.photo_type)+';base64,'+ xssFilters.inHTMLData(comment.photo)} />
                                            }
                                        </Col>
                                        <Col md='10' lg='9' xl='10' xxl='11'>
                                            <div className='border p-4 rounded bg-white w-100 position-relative'>
                                                <div className="triangleBorder position-absolute w-0 h-0">
                                                    <div className="triangle position-absolute w-0 h-0"></div>
                                                </div>
                                                <div className='d-flex align-items-center justify-content-between flex-wrap fw-bold mb-4'>
                                                    <div>{xssFilters.inHTMLData(comment.first_name)+ ' '+xssFilters.inHTMLData(comment.last_name)}</div>
                                                    <div>( {moment.utc(xssFilters.inHTMLData(comment.date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')} )</div>
                                                </div>
                                                <div>
                                                    {xssFilters.inHTMLData(comment.comment)}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                )
                            })}
                    </div>
                    }
                </section>
            </Modal.Body>
            <Modal.Footer className="d-block">
                <div className="d-flex justify-content-between">
                    <Button
                        onClick={() => {
                            setReqHistoryModal(false);
                        }}
                        variant="secondary"
                    >بستن</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ReqHistoryModal;