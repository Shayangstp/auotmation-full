import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Row, Col, Dropdown, Badge, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars, faScrewdriverWrench, faEnvelopeOpenText, faCircleUser, faRightFromBracket, faAddressCard, faShoePrints, faWarehouse, faUserCheck, faBan, faCheck, faCartShopping, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import LogoutM from "../Modals/LogoutModal";
import xssFilters from "xss-filters";

import { rootContext } from "../context/rootContext";
import { selectUser, selectLastNewReqs, selectUserInfoChanged, handleUserData, handleCurrentReqInfo, handleUserImage, selectLoggedInUserImage } from '../Slices/mainSlices';

const UserMenu = ({ logOutModal, setLogoutModal, lockLinks, setLocklinks, setLockLinksModal, setClickedLink, breadcrumb, pathname }) => {
    const dispatch = useDispatch();
    const lastNewReqs = useSelector(selectLastNewReqs);
    const userInfoChanged = useSelector(selectUserInfoChanged);
    const loggedInUserImage = useSelector(selectLoggedInUserImage);
    const mainContext = useContext(rootContext);
    const {
        handleUpdateSupStatus,
        updateAllNewReqsList,
    } = mainContext;

    const user = useSelector(selectUser);
    useEffect(() => {
        if (user.FirstName === undefined) {
            dispatch(handleUserData());
        }
    }, [user.FirstName === undefined])

    useEffect(() => {
        dispatch(handleUserImage({userId: user._id, status: 1}));
    }, [user])

    const handleBellItem = (req) => {
        if (req.typeId === 1 || req.typeId === 13) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faScrewdriverWrench} className='infoBlue-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست کار جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 2) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faWarehouse} className='green-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست انبار جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 3) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faEnvelopeOpenText} className='text-warning me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} نامه اداری جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 4) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faShoePrints} className='pink-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست مرخصی جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 8) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faCartShopping} className='pink-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست خرید جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 9) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faCartShopping} className='pink-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست ماموریت جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 10) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faCartShopping} className='pink-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست تسویه جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 14) {
            return (
                <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                    updateAllNewReqsList();
                    localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                }}>
                    <FontAwesomeIcon icon={faCalendarPlus} className='pink-text me-2 font10' />
                    <p className="m-0 font10"> {req.fullName} درخواست اضافه کار جدیدی ثبت کرد.</p>
                </Link>
            )
        } else if (req.typeId === 5) {
            return (
                <Link className="text-decoration-none text-dark d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUserCheck} className='purple-text me-2 font10' />
                        <p className="m-0 font10"> {req.fullName} شما را به عنوان سرپرست انتخاب کرد.</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCheck} className='text-success me-3' onClick={() => { handleUpdateSupStatus('accept', req.userId, req.requestId) }} />
                        <FontAwesomeIcon icon={faBan} className='text-danger' onClick={() => { handleUpdateSupStatus('reject', req.userId, req.requestId) }} />
                    </div>
                </Link>
            )
        }
    }
    return (
        <Row id='d-none-print'>
            <Col xl='3' className="darkBlue-bg d-flex align-items-center d-none d-xl-block py-2">
                <div className='d-flex align-items-center'>
                    <div className='logo me-0 me-xl-3'>
                        <img
                            width='50px'
                            height='50px'
                            src='../../images/kaveh.png'
                            alt='گروه صنعتی شیشه کاوه'
                        />
                    </div>
                    <div className="light-text m-0 line-height-2">
                        <span className="font12">سامانه اتوماسیون </span>
                        <a href='https://kavehglass.com/' target='blank' className='light-text font12'>
                            گروه صنعتی شیشه کاوه
                        </a>
                    </div>
                </div>
            </Col>
            <Col xl='9' className="darkBlue-bg d-flex justify-content-between align-items-center py-2">
                <div className="">
                    {pathname === "/" || pathname === "/Home" || pathname === "/home"
                        ? null
                        : breadcrumb
                    }
                </div>
                <div className="d-flex align-items-center">
                    <div className="position-relative" id='allNotifications'>
                        <div className="d-flex align-items-center notifications-btn p-3 cursorPointer">
                            <Badge bg="danger">{lastNewReqs.count}</Badge>
                            <FontAwesomeIcon icon={faBell} className="text-light font20" />
                            {lastNewReqs.reqs !== undefined && lastNewReqs.reqs.length !== 0 && userInfoChanged === true ?
                                <div className="position-absolute bg-white rounded shadow notifications-box">
                                    <ListGroup>
                                        {lastNewReqs.reqs !== undefined ? lastNewReqs.reqs.map(req => {
                                            return (
                                                <ListGroup.Item key={req.requestId} action className='border-0 cursorPointer py-3'>
                                                    {/* {handleBellItem(req)} */}
                                                    {req.typeId === 2 ?
                                                        <Link to='/AllNewRequests' className="text-decoration-none text-dark d-flex align-items-center" onClick={() => {
                                                            dispatch(handleCurrentReqInfo({ reqId: req.requestId, reqType: req.typeId, reqSeen: req.seen, company: '', dep: req.deptName, oprationType: 'accept' }));
                                                            updateAllNewReqsList();
                                                            localStorage.setItem('lastLocation', '63353ccfe856190aaaca593d');
                                                        }}>
                                                            <FontAwesomeIcon icon={faWarehouse} className='green-text me-2 font10' />
                                                            <p className="m-0 font10"> {req.fullName} درخواست انبار جدیدی ثبت کرد.</p>
                                                        </Link>
                                                        : null
                                                    }
                                                    {req.typeId === 5 ?
                                                        <Link className="text-decoration-none text-dark d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <FontAwesomeIcon icon={faUserCheck} className='purple-text me-2 font10' />
                                                                <p className="m-0 font10"> {req.fullName} شما را به عنوان سرپرست انتخاب کرد.</p>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <FontAwesomeIcon icon={faCheck} className='text-success me-3' onClick={() => { handleUpdateSupStatus('accept', req.userId, req.requestId) }} />
                                                                <FontAwesomeIcon icon={faBan} className='text-danger' onClick={() => { handleUpdateSupStatus('reject', req.userId, req.requestId) }} />
                                                            </div>
                                                        </Link>
                                                        : null
                                                    }
                                                    {req.typeId === 9 ?
                                                        <Link className="text-decoration-none text-dark d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <FontAwesomeIcon icon={faCartShopping} className='pink-text me-2 font10' />
                                                                <p className="m-0 font10"> {req.fullName} درخواست خرید جدیدی ثبت کرد.</p>
                                                            </div>
                                                        </Link>
                                                        : null
                                                    }
                                                </ListGroup.Item>
                                            )
                                        }) : null}
                                        {/* <ListGroup.Item action className='border-0 cursorPointer d-flex align-items-center justify-content-between'>
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faUserCheck} className='purple-text me-2 font10 py-3'/>
                                                <p className="m-0 font10">
                                                    {text.length > 25 ? text.substring(0,25) + ' ' : text}
                                                    {text.length > 25 ? <a href=''>....</a> : null}
                                                </p>
                                            </div>
                                            <div>
                                                <FontAwesomeIcon icon={faCheck} className='text-success me-3' />
                                                <FontAwesomeIcon icon={faBan} className='text-danger' />
                                            </div>
                                        </ListGroup.Item> */}
                                        <ListGroup.Item className='border-0 border-top cursorPointer'>
                                            <Link to='/AllNewRequests' className="d-flex justify-content-center m-0 text-center text-decoration-none text-dark font12">مشاهده بیشتر</Link>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                                : null}
                        </div>
                    </div>
                    <Dropdown className="d-inline" autoClose={true}>
                        <Dropdown.Toggle className="bg-transparent p-0 border-0" id="dropdown-autoclose-true">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <h3 className='m-0 font12 text-light'>{xssFilters.inHTMLData(user.FirstName) + " " + xssFilters.inHTMLData(user.LastName)}</h3>
                                </div>
                                <div>
                                    {loggedInUserImage === '' ?
                                        <FontAwesomeIcon icon={faCircleUser} className="font30 light-text" />
                                        :
                                        <img width='50px' height='50px' className='rounded-circle' alt='userAvatar' src={loggedInUserImage} />
                                    }
                                </div>
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Link onClick={() => { setClickedLink('/Profile'); if (lockLinks) { setLockLinksModal(true) } }}
                                    to={lockLinks ? '/InterCompanyJobRequest' : '/Profile'} className='text-dark text-decoration-none d-flex align-items-center'>
                                    <FontAwesomeIcon icon={faAddressCard} className="me-2" />
                                    <span className="font12">پروفایل</span>
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item role='button' className='d-flex align-items-center' onClick={() => setLogoutModal(true)}>
                                <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
                                <span className="font12">خروج</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Col>
            {logOutModal ? <LogoutM logOutModal={logOutModal} setLogoutModal={setLogoutModal} /> : null}
        </Row>
    );
};
export default UserMenu;