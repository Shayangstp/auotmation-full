import React, { useEffect, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { rootContext } from "../../context/rootContext";
import PurchaseReqItems from "./PurchaseReqItems";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome, faWarning } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from "react-redux";
import {
    selectPurchaseReqProcurement, RsetPurchaseReqProcurement, selectPurchaseReqDescription, RsetPurchaseReqDescription,
    handleSubmitNewPurchaseReq, handleResetPurchaseReq
} from '../../Slices/purchaseSlice';
import PurchaseReqNewItem from "./PurchaseReqNewItem";
import { selectCurrentReqItems, RsetCurrentReqItems } from './../../Slices/currentReqSlice';
import { selectLoading, selectUser } from "../../Slices/mainSlices";
import Loading from "../../Common/Loading";


const PurchaseReqRegistration = ({ setPageTitle }) => {

    const dispatch = useDispatch();
    const purchaseReqProcurement = useSelector(selectPurchaseReqProcurement);
    const purchaseReqDescription = useSelector(selectPurchaseReqDescription);
    const currentReqItems = useSelector(selectCurrentReqItems);
    const user = useSelector(selectUser);
    const loading = useSelector(selectLoading)

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    useEffect(() => {
        setPageTitle('ثبت درخواست خرید');
        dispatch(RsetCurrentReqItems([]))
    }, [])

    return (
        <Container fluid>
            {/* {menuPermission ? */}
            <Form className="position-relative">
                {loading ? <Loading /> : null}
                <Row className="mt-5">
                    {user.Location !== 1
                        ? <Fragment>
                            <Col md='6' className='text-center text-md-start d-block d-md-flex align-items-center'>
                                <h1 className='font16 mb-0'>محل خرید: </h1>
                                <div className="d-flex justify-content-center">
                                    <div className='ms-md-4'>
                                        <label className="me-2">تهران</label>
                                        <Form.Check
                                            className='d-inline-block'
                                            type="switch"
                                            id="custom-switch"
                                            label="کارخانه"
                                            checked={purchaseReqProcurement}
                                            onChange={(e) => { dispatch(RsetPurchaseReqProcurement(!purchaseReqProcurement)) }}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <hr className="mt-4 mb-5" />
                        </Fragment>
                        : null
                    }
                    <PurchaseReqNewItem />
                </Row>
                {currentReqItems.length !== 0 ? <PurchaseReqItems reqItemsOperation={true} edit={true} /> : null}
                <Row className="mt-5">
                    <Form.Group as={Col} md='12'>
                        <Form.Label className='mb-1'>توضیحات: </Form.Label>
                        <Form.Control as="textarea" rows={10} maxLength={2000} name='purchaseReqDescription' value={purchaseReqDescription} onChange={e => dispatch(RsetPurchaseReqDescription(e.target.value))} />
                    </Form.Group>
                    <Col md='5' xl='4' className='mx-auto d-flex justify-content-between mt-4'>
                        <Button variant='success' className='w-45' onClick={(e) => { dispatch(handleSubmitNewPurchaseReq(e)) }} preventdefault='true'>
                            ثبت درخواست
                        </Button>
                        <Button variant='secondary' type='reset' className='w-45' onClick={() => { dispatch(handleResetPurchaseReq()) }}>
                            انصراف
                        </Button>
                    </Col>
                </Row>
            </Form>
            {/* :
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24' />
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                                کاربر گرامی شما به این بخش دسترسی ندارید.
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2' />
                                        صفحه اصلی
                                    </Button>
                                </Link>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            } */}
        </Container>
    )
}
export default PurchaseReqRegistration;