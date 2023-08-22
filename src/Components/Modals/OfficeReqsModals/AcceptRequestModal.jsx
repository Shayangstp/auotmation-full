import React, { useContext, useEffect, useState } from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Table, Form, Row, Col } from "react-bootstrap";
import momentJalaali from 'moment-jalaali';
import { Fragment } from "react";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import moment from 'moment-jalaali';
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../Slices/mainSlices';
import { getToPersonByRole } from '../../../Services/rootServices';

import {
    selectAcceptReqModal, RsetAcceptReqModal, selectAcceptReqComment,
    RsetAcceptReqComment, RsetNextAcceptReqModal
} from "../../Slices/modalsSlice";
import { selectCurrentReqInfo, selectCurrentReqComments } from "../../Slices/currentReqSlice";
import { handleUserInformation, handleUserImage } from "../../Slices/mainSlices";

const AcceptRequestModal = () => {

    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const acceptReqComment = useSelector(selectAcceptReqComment);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const currentReqComments = useSelector(selectCurrentReqComments);

    const user = useSelector(selectUser);
    const mainContext = useContext(rootContext);
    const [toPersons, setToPersons] = useState([]);
    const {
        handleOfficeLeaveAccept,
        currentReqToPerson,
        setCurrentReqToPerson,
        companyCar,
        setCompanyCar,
        driver,
        setDriver,
        officeMissionToDate,
        setOfficeMissionToDate,
    } = mainContext;

    const officeContext = useContext(officeReqContext);
    const {
        setDriverInfo,
        handleGetDrivers,
        handleGetDriverInfo,
        driverInfo,
        handleGetUserInfoToCoordinateMission,
        userInfoToCoordinateMission,
        driversSelect,
    } = officeContext;

    const getToPersons = async () => {
        var destinationToPersons = [];
        var originToPersons = await getToPersonByRole('21, 54', user.Location, user.CompanyCode, 1, null, '0');
        if (currentReqInfo.toCompany !== undefined && currentReqInfo.toCompany !== '') {
            destinationToPersons = await getToPersonByRole('21, 54', 2, currentReqInfo.toCompany.code, 1, null, '0');
        }
        if (originToPersons.data.code === 415 && destinationToPersons.data.code === 415) {
            const toPersons = [...originToPersons.data.list, ...destinationToPersons.data.list];
            setToPersons(toPersons);
        } else {
            setToPersons([]);
        }
    }

    useEffect(() => {
        getToPersons();
    }, [currentReqInfo]);

    const handleCoordinatorOptions = () => {
        if (currentReqInfo.tripType.code === 1 && (currentReqInfo.lastActionCode === 33)) {
            return (
                <Row>
                    <div className="col-12 d-flex align-items-center mb-3">
                        <Form.Label className='mb-1 me-3 fw-bold'>ماشین :</Form.Label>
                        <div className="d-flex align-items-center me-4">
                            <input type='radio' name='companyCar' value={companyCar} defaultChecked={companyCar} onChange={(e) => { setCompanyCar(!companyCar) }} />
                            <Form.Label className='ms-2 font12 mb-0'> شرکتی </Form.Label>
                        </div>
                        <div className="d-flex align-items-center">
                            <input type='radio' name='companyCar' value={!companyCar} defaultChecked={!companyCar} onChange={(e) => { setCompanyCar(!companyCar) }} />
                            <Form.Label className='ms-2 font12 mb-0'> شخصی </Form.Label>
                        </div>
                    </div>
                    {companyCar === true
                        ? <Fragment>
                            <Form.Group as={Col} md='3' className='mb-4'>
                                <DatePicker
                                    placeholder='تاریخ'
                                    setTodayOnBlur={true}
                                    timePicker={false}
                                    inputReadOnly
                                    name="officeMissionToDate"
                                    isGregorian={false}
                                    inputFormat="YYYY-MM-DD"
                                    inputJalaaliFormat="jYYYY/jMM/jDD"
                                    value={officeMissionToDate}
                                    className="form-control"
                                    onChange={e => { setOfficeMissionToDate(e) }}
                                />
                            </Form.Group>
                            <Select placeholder='انتخاب راننده' className="col-12 col-md-4 mb-3" options={driversSelect} value={driver} onChange={(e) => { setDriver(e); handleGetDriverInfo(e.value) }} />
                            {driver !== ''
                                ? <Table striped bordered hover responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th className="col-2 bg-secondary text-white fw-normal">نام و نام خانوادگی</th>
                                            <th className="col-2 bg-secondary text-white fw-normal">کد ملی</th>
                                            <th className="col-2 bg-secondary text-white fw-normal">شماره موبایل</th>
                                            <th className="col-2 bg-secondary text-white fw-normal">نام ماشین</th>
                                            <th className="col-2 bg-secondary text-white fw-normal">مدل ماشین</th>
                                            <th className="col-2 bg-secondary text-white fw-normal">پلاک ماشین</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{driverInfo.first_name + ' ' + driverInfo.last_name}</td>
                                            <td>{driverInfo.natCode}</td>
                                            <td>{driverInfo.mobileNumber}</td>
                                            <td>{driverInfo.carBrand}</td>
                                            <td>{driverInfo.carModel}</td>
                                            <td>{driverInfo.carPlate}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                : null
                            }
                            <Select value={currentReqToPerson} onChange={(e) => { setCurrentReqToPerson(e) }} name='currentReqToPerson' isMulti className="col-12 col-md-5" options={toPersons} placeholder='ارسال برای...' />
                        </Fragment>
                        : null
                    }
                </Row>
            )
        } else if (currentReqInfo.tripType.code !== 1 && (currentReqInfo.lastActionCode === 33)) {
            return (
                <Fragment>
                    <Table striped bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th className="col-2 bg-secondary text-white fw-normal">کد ملی</th>
                                <th className="col-2 bg-secondary text-white fw-normal">شماره موبایل</th>
                                <th className="col-2 bg-secondary text-white fw-normal">تاریخ تولد</th>
                                <th className="col-2 bg-secondary text-white fw-normal">سفر قبلی</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{userInfoToCoordinateMission.user_name}</td>
                                <td>{userInfoToCoordinateMission.phone_number}</td>
                                <td>{moment(userInfoToCoordinateMission.birthdate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</td>
                                <td>{moment(userInfoToCoordinateMission.lastMissionDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Row>
                        <Col md='12' className="my-3">
                            <FontAwesomeIcon icon={faPlaneDeparture} className='text-success' />
                            <span className="fw-bold ms-2">اطلاعات بلیط مبدا</span>
                        </Col>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>فرودگاه/ترمینال: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                            <div id='-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن موضوع ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>تاریخ: </Form.Label>
                            <DatePicker
                                setTodayOnBlur={true}
                                timePicker={false}
                                inputReadOnly
                                name=""
                                isGregorian={false}
                                inputFormat="YYYY-MM-DD"
                                inputJalaaliFormat="jYYYY/jMM/jDD"
                                value={null}
                                className="form-control"
                                onChange={e => { console.log(e) }}
                            />
                            <div id='officeMissionFromDate-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>انتخاب مقصد ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>ساعت حرکت: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                            <div id='-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن موضوع ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>شماره بلیط: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                            <div id='-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن موضوع ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>آژانس مسافرتی: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                            <div id='-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن موضوع ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1 required-field'>قیمت بلیط: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                            <div id='-required' className='d-none mt-1'>
                                <span className='font12 text-danger mb-1'>واردکردن موضوع ماموریت اجباری است!</span>
                            </div>
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col md='12' className="my-3">
                            <FontAwesomeIcon icon={faPlaneArrival} className='text-success' />
                            <span className="fw-bold ms-2">اطلاعات بلیط مقصد</span>
                        </Col>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>فرودگاه/ترمینال: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>تاریخ: </Form.Label>
                            <DatePicker
                                setTodayOnBlur={true}
                                timePicker={false}
                                inputReadOnly
                                name=""
                                isGregorian={false}
                                inputFormat="YYYY-MM-DD"
                                inputJalaaliFormat="jYYYY/jMM/jDD"
                                value={null}
                                className="form-control"
                                onChange={e => { console.log(e) }}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>ساعت حرکت: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>شماره بلیط: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>آژانس مسافرتی: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>قیمت بلیط: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} md='6' lg='3' className='mb-4'>
                            <Form.Label className='mb-1'>توضیحات: </Form.Label>
                            <Form.Control name='' value='' onChange={e => console.log(e.target.value)} />
                        </Form.Group>
                    </Row>
                </Fragment>
            )
        }
    }

    useEffect(() => {
        if (currentReqInfo.typeId === 9) {
            if (currentReqInfo.tripType.code === 1 && (currentReqInfo.lastActionCode === 33)) {
                handleGetDrivers();
            } else if (currentReqInfo.tripType.code !== 1 && (currentReqInfo.lastActionCode === 33)) {
                handleGetUserInfoToCoordinateMission(currentReqInfo.userId);
            }
        }
    }, [currentReqInfo])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={acceptReqModal}
            onHide={() => {
                dispatch(RsetAcceptReqModal(false));
            }}
            dialogClassName="modal-96w overflow-visible-modal"
        >
            <Fragment>
                <Modal.Header className='d-block bg-success text-white'>
                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                        <div>
                            <span className='me-2'>تایید درخواست شماره </span>
                            <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
                        </div>
                        <div>
                            <span className='fw-bold me-2'>تاریخ درخواست:</span>
                            <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className='list-unstyled'>
                        <li className='mb-3'>
                            <span className='fw-bold me-2'>نام و نام خانوادگی: </span>
                            <span>{xssFilters.inHTMLData(currentReqInfo.fullName)}</span>
                        </li>
                        {currentReqInfo.typeId === 4 ?
                            <Fragment>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>نوع درخواست: </span>
                                    <span>{currentReqInfo.leaveKindName}</span>
                                </li>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>نوع مرخصی: </span>
                                    <span>{xssFilters.inHTMLData(currentReqInfo.leaveTypeName)}</span>
                                </li>
                                {currentReqInfo.leaveKindName === 'روزانه' ?
                                    <li className='mb-3 d-flex'>
                                        <div className="me-3">
                                            <span className='fw-bold me-2'>از تاریخ: </span>
                                            <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.startDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                        </div>
                                        <div>
                                            <span className='fw-bold me-2'>تا تاریخ: </span>
                                            <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.endDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                        </div>
                                    </li>
                                    :
                                    <li className='mb-3 d-flex'>
                                        <div className="me-3">
                                            <span className='fw-bold me-2'>از ساعت: </span>
                                            <span>{new Date(currentReqInfo.startDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div>
                                            <span className='fw-bold me-2'>تا ساعت: </span>
                                            <span>{new Date(currentReqInfo.endDate).toLocaleString('fa-IR', { numberingSystem: 'latn', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </li>
                                }
                            </Fragment>
                            : null
                        }
                        {currentReqInfo.typeId === 9 ?
                            <Fragment>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>موضوع ماموریت: </span>
                                    <span>{xssFilters.inHTMLData(currentReqInfo.subject)}</span>
                                </li>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>شهر مقصد: </span>
                                    <span>{xssFilters.inHTMLData(currentReqInfo.city)}</span>
                                </li>
                                <li className='mb-3'>
                                    <span className='fw-bold me-2'>کارخانه: </span>
                                    <span>{currentReqInfo.toCompany !== undefined ? xssFilters.inHTMLData(currentReqInfo.toCompany) : ''}</span>
                                </li>
                                <li className='mb-3 d-flex'>
                                    <div className="me-3">
                                        <span className='fw-bold me-2'>از تاریخ: </span>
                                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.startDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                    </div>
                                    <div>
                                        <span className='fw-bold me-2'>تا تاریخ: </span>
                                        <span>{momentJalaali.utc(xssFilters.inHTMLData(currentReqInfo.endDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                    </div>
                                </li>
                                <li className="mb-3">
                                    <span className='fw-bold me-2'>نوع سفر: </span>
                                    <span>{xssFilters.inHTMLData(currentReqInfo.tripType.name)}</span>
                                </li>
                                {handleCoordinatorOptions()}
                            </Fragment>
                            : null
                        }
                        <li className='mb-3'>
                            <span className='fw-bold me-2'>توضیحات: </span>
                            <span>{currentReqInfo.description !== null ? xssFilters.inHTMLData(currentReqInfo.description) : ''}</span>
                        </li>
                    </ul>
                </Modal.Body>
                <Modal.Footer className="d-block">
                    {currentReqComments.map((comment, index) => {
                        if (comment.comment !== null && comment.comment !== undefined && comment.comment !== '') {
                            return (
                                <div className="d-block" key={index}>
                                    <span className='fw-bold me-2 font12 cursorPointer' onClick={() => {
                                        dispatch(handleUserInformation(comment.userId));
                                        dispatch(handleUserImage({ userId: comment.userId, status: 1 }));
                                    }}>{comment.fullName}: </span>
                                    <span className="font12">{xssFilters.inHTMLData(comment.comment)}</span>
                                </div>
                            )
                        }
                    })}
                    <div className="d-flex justify-content-between">
                        <div className="w-75 d-flex align-items-center">
                            <input className="form-control me-3 w-75" placeholder="توضیحات تایید کننده درخواست" defaultValue={acceptReqComment} name="acceptReqComment" onChange={(e) => dispatch(RsetAcceptReqComment(e.target.value))} />
                            <Button
                                variant="success"
                                onClick={() => {
                                    if (currentReqInfo.typeId === 4) {
                                        if (currentReqInfo.lastActionCode === 0) {
                                            dispatch(RsetAcceptReqModal(false));
                                            dispatch(RsetNextAcceptReqModal(true));
                                        } else {
                                            handleOfficeLeaveAccept(true);
                                        }
                                    } else if (currentReqInfo.typeId === 9) {
                                        if (currentReqInfo.lastActionCode === 0) {
                                            dispatch(RsetAcceptReqModal(false));
                                            dispatch(RsetNextAcceptReqModal(true));
                                        } else if (currentReqInfo.lastActionCode === 20) {
                                            handleOfficeLeaveAccept('sendToCoordinator');
                                        } else if (currentReqInfo.lastActionCode === 33 && user.Roles.some(role => role === '44')) {
                                            handleOfficeLeaveAccept('acceptByCarCoordinator');
                                        }
                                    }
                                }}
                            >
                                تایید درخواست
                            </Button>
                        </div>
                        <Button
                            onClick={() => {
                                if (currentReqInfo.typeId === 9) {
                                    if (currentReqInfo.tripType.code === 1 && (currentReqInfo.lastActionCode === 33)) {
                                        setCompanyCar(true);
                                        setDriver('');
                                        setDriverInfo('');
                                        setOfficeMissionToDate(null);
                                        setCurrentReqToPerson('');
                                    }
                                }
                                dispatch(RsetAcceptReqComment(''));
                                dispatch(RsetAcceptReqModal(false));
                            }}
                            variant="secondary"
                        >
                            بستن
                        </Button>
                    </div>
                </Modal.Footer>
            </Fragment>
        </Modal>
    )
}

export default AcceptRequestModal;