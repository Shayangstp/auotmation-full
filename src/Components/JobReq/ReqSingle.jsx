import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Tabs, Tab, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import momentJalaali from 'moment-jalaali';
import { reqContext } from '../context/jobReqsContext/reqContext';
import { getSingleRequest } from "./../../actions/jobReqs/request";
import { requestIdValidator } from "./../../utils/IdValidator";
import ReqItems from '../JobReq/ReqItems';
import xssFilters from 'xss-filters';

import { RsetAcceptReqModal, RsetCancelReqModal, RsetEditReqModal } from '../Slices/modalsSlice';

const ReqSingle = ({ setPageTitle }) => {
    const request = useSelector(state => state.request);
    const dispatch = useDispatch();

    const requestContext = useContext(reqContext);
    const {
        handleGetCurrentRequest,
    } = requestContext;

    var reqId;
    useEffect(() => {
        reqId = window.location.pathname.split('/')[2];
        if (requestIdValidator(reqId)) {
            dispatch(getSingleRequest(reqId));
        }
        setPageTitle('درخواست ' + reqId);
    }, [setPageTitle]);

    const checkLastIndex = (req) => {
        let pr = req.process;
        let index = pr.length - 1
        return index;
    }

    useEffect(() => {
        if (request.process !== undefined) {
            handleGetCurrentRequest(request);
        }
    }, [request.process !== undefined])

    return (
        <Container fluid className='py-4'>
            {request.process !== undefined ?
                <section>
                    <Row>
                        <Col className='bg-white p-3 rounded border'>
                            <ul className='list-unstyled'>
                                <li className="mb-3">
                                    <span className="fw-bold me-2">سریال:</span>
                                    <span>{xssFilters.inHTMLData(request.reqInfo.serial_number)}</span>
                                </li>
                                <li className="mb-3">
                                    <span className="fw-bold me-2">تاریخ ثبت:</span>
                                    <span>{momentJalaali.utc(xssFilters.inHTMLData(request.process[checkLastIndex(request)].date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                </li>
                                {request.reqInfo.description !== '' ?
                                    <li className='mb-3'>
                                        <span className='fw-bold me-2'>شرح درخواست:</span>
                                        <span>{xssFilters.inHTMLData(request.reqInfo.description)}</span>
                                    </li>
                                    : null}
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>نام و نام خانوادگی درخواست کننده:</span>
                                    <span>{xssFilters.inHTMLData(request.userInfo.gender) + ' ' + xssFilters.inHTMLData(request.userInfo.first_name) + ' ' + xssFilters.inHTMLData(request.userInfo.last_name)}</span>
                                </li>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>محل ارسال درخواست:</span>
                                    <span>{"شرکت " + xssFilters.inHTMLData(request.reqInfo.reqFromCompanyName.co_name) + " واحد " + xssFilters.inHTMLData(request.reqInfo.reqFromCompanyDepartment.dep_name)}</span>
                                </li>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>محل دریافت درخواست:</span>
                                    <span>{"شرکت " + xssFilters.inHTMLData(request.reqInfo.reqToCompanyName.co_name)}</span>
                                </li>
                                <li className="mb-3">
                                    <span className="fw-bold me-2">نمونه:</span>
                                    <span>{request.reqInfo.sample === true ? 'دارد' : 'ندارد'}</span>
                                </li>
                                <li className="mb-3">
                                    <span className="fw-bold me-2">وضعیت:</span>
                                    <span>{xssFilters.inHTMLData(request.status)}</span>
                                </li>
                            </ul>
                            {request.items.length !== 0 ? <ReqItems reqItems={request.items} edit={false} reqItemsOperation={false} /> : null}
                            {request.process[checkLastIndex(request)].action_code === 0 && request.process[checkLastIndex(request)].toPerson === localStorage.getItem('id') ?
                                <div className='d-flex justify-content-between flex-wrap'>
                                    <Button variant='success' onClick={() => {
                                        dispatch(RsetAcceptReqModal(true));
                                        handleGetCurrentRequest(request);
                                    }}>تایید درخواست</Button>
                                    <Button variant='danger' onClick={() => {
                                        dispatch(RsetCancelReqModal(true));
                                        handleGetCurrentRequest(request);
                                    }}>ابطال درخواست</Button>
                                    <Button variant='primary' onClick={() => {
                                        dispatch(RsetEditReqModal(true));
                                        handleGetCurrentRequest(request)
                                    }}>ویرایش درخواست</Button>
                                </div>
                                : null}
                        </Col>
                    </Row>
                </section>
                : null}
        </Container>
    )
}

export default ReqSingle;
