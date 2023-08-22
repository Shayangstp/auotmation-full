import React, { useEffect, useContext, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { officeReqContext } from "../context/officeContext/officeReqContext";
import { rootContext } from "../context/rootContext";
import { Container, Row, Col, Alert, Button, Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faNewspaper, faPizzaSlice, faSpinner, faBell, faWarehouse, faShoePrints, faSuitcase, faUser, faMoneyCheckDollar, faCloudArrowUp, faCalendarPlus, faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from "react-datepicker2";
import xssFilters from "xss-filters";
import DonutChart from "./DonutChart";
import LineChart from "./LineChart";
import { selectUser, selectUserInfoChanged } from '../Slices/mainSlices';
import { RsetChangeUserInfoModal } from "../Slices/modalsSlice";

const Home = () => {
    const dispatch = useDispatch();
    const userInfoChanged = useSelector(selectUserInfoChanged);
    useEffect(() => {
        if (window.location.pathname === '/Home') {
            var bodyTag = document.getElementById('body');
            if (bodyTag.getAttribute("style") !== null || bodyTag.getAttribute("style") !== "") {
                bodyTag.removeAttribute("style")
            }
        }
    }, [])

    const user = useSelector(selectUser);
    const officeContext = useContext(officeReqContext);
    const {
        handleOfficeNews,
        officeNewsList,
        handleOfficeNotices,
        officeNoticesList
    } = officeContext;

    const mainContext = useContext(rootContext);
    const {
        loading,
        handleGetDaysFood,
        foods,
    } = mainContext;

    useEffect(() => {
        handleOfficeNews();
        handleOfficeNotices();
        // handleGetDaysFood();
    }, [])

    return (
        <div className="home">
            <Container fluid className="mb-4">
                <Row className="mb-3">
                    <Col md={user.HappyBirthday === true ? '9' : '12'}>
                        <Alert variant="light" className="mb-0 h-100 shadow01">
                            <Alert.Heading>
                                <span className="font20 lh-base titlesPhoneFontSize">{`${xssFilters.inHTMLData(user.Gender)} ${xssFilters.inHTMLData(user.FirstName)} ${xssFilters.inHTMLData(user.LastName)} به سامانه اتوماسیون گروه صنعتی شیشه کاوه خوش آمدید!`}</span>
                            </Alert.Heading>
                            {/* <hr />
                            <h3 className="fw-bold">امکانات اتوماسیون:</h3>
                            <ul>
                                <li><Link to='/PaySlip' className={userInfoChanged === true ? "text-dark" : 'text-dark cursorDefault'}
                                    onClick={ (event) => {if (userInfoChanged === false){ event.preventDefault() }}}   
                                >فیش حقوقی</Link></li>
                                <li>فرم درخواست کالا از انبار</li>
                                <li>فرم درخواست مرخصی</li>
                                <li>فرم درخواست ماموریت</li>
                            </ul> */}
                            {userInfoChanged === false ?
                                <Fragment>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <p className="m-0">برای استفاده از امکانات اتوماسیون لازم است اطلاعات کاربری خود را در بخش پروفایل اصلاح کنید.</p>
                                        <Link to='/Profile'>
                                            <Button variant="outline-dark">
                                                <FontAwesomeIcon icon={faEdit} className='me-2' />
                                                ویرایش اطلاعات کاربری
                                            </Button>
                                        </Link>
                                    </div>
                                </Fragment>
                                : null}
                        </Alert>
                    </Col>
                    {user.HappyBirthday === true ?
                        <Col md='3'>
                            <div className="bg-white h-100">
                                <img src="../../images/gif/dribbleballoon.gif" alt="birthday" className="img-fluid py-4" />
                                <div className="w-100 text-center fw-bold pb-4">
                                    <span>تولدت مبارک :)</span>
                                </div>
                            </div>
                        </Col>
                        : null}
                </Row>
                <Row className="mb-3">
                    <Col md='4' lg='3' xxl='3' className='mb-3'>
                        <Link to={userInfoChanged !== false ? '/PaySlip' : '/Home'} className="bg-pink p-2 rounded border d-flex align-items-center
                         flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faMoneyCheckDollar} className='bg-darkPink p-3 rounded font20 me-3' />
                            <span className="font12">فیش حقوقی</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3' className='mb-3 mb-md-0'>
                        <Link to={userInfoChanged !== false ? '/WarehouseNewRequest' : '/Home'} className="bg-purple p-2 rounded border d-flex
                         align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faWarehouse} className='bg-darkPurple p-3 rounded font20 me-3' />
                            <span className="font12">درخواست انبار</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3' className='mb-3 mb-md-0'>
                        <Link to={userInfoChanged !== false ? '/LeaveReqRegistration' : '/Home'} className="bg-infoBlue p-2 rounded border d-flex
                         align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faShoePrints} className='bg-darkInfoBlue p-3 rounded font20 me-3' />
                            <span className="font12">درخواست مرخصی</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3' className='mb-3 mb-lg-0'>
                        <Link to='/Home' className="bg-green p-2 rounded border d-flex
                         align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faSuitcase} className='bg-darkGreen p-3 rounded font20 me-3' />
                            <span className="font12">درخواست ماموریت</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3' className='mb-3 mb-lg-0'>
                        <Link to={userInfoChanged !== false ? '/AllNewRequests' : '/Home'} className="bg-yellow p-2 rounded border d-flex
                         align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faUser} className='bg-darkYellow p-3 rounded font20 me-3' />
                            <span className="font12">درخواست های من</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3' className='mb-3 mb-md-0'>
                        <Link to={userInfoChanged !== false ? '/FileUploadForm' : '/Home'} className="bg-magenta p-2 rounded border d-flex
                         align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faCloudArrowUp} className='bg-darkMagenta p-3 rounded font20 me-3' />
                            <span className="font12">آپلود فایل</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3' className='mb-3 mb-md-0'>
                        <Link to={userInfoChanged !== false ? '/OverTimeReqRegistration' : '/Home'} className="bg-orange p-2 rounded border
                         d-flex align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faCalendarPlus} className='bg-darkOrange p-3 rounded font20 me-3' />
                            <span className="font12">درخواست اضافه کار</span>
                        </Link>
                    </Col>
                    <Col md='4' lg='3' xxl='3'>
                        <Link to={userInfoChanged !== false ? '/SoftwareReqRegistration' : '/Home'} className="bg-violet p-2 rounded border
                         d-flex align-items-center flex-wrap shadow01 text-decoration-none text-white" onClick={() => {
                                if (userInfoChanged === false) {
                                    dispatch(RsetChangeUserInfoModal(true));
                                }
                            }}>
                            <FontAwesomeIcon icon={faLaptopCode} className='bg-darkViolet p-3 rounded font20 me-3' />
                            <span className="font12">درخواست نرم افزار</span>
                        </Link>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xxl='4' className="mb-3 mb-xxl-0 d-none d-md-block">
                        <DonutChart />
                    </Col>
                    <Col xxl='8' className="d-none d-md-block">
                        <LineChart />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md='12' className="mb-3 mb-md-0">
                        <Card className="h-100 shadow01">
                            <Card.Header className="d-flex justify-content-between align-items-center py-4">
                                آخرین اطلاعیه ها
                                <FontAwesomeIcon icon={faBell} />
                            </Card.Header>
                            <Card.Body>
                                {loading !== true ?
                                    <ListGroup as="ol" variant="flush">
                                        {officeNoticesList.length !== 0 ?
                                            officeNoticesList.map((news) => {
                                                return (
                                                    <ListGroup.Item key={news._id} as="li" className="font12 spacePreWrap">{xssFilters.inHTMLData(news.body)}</ListGroup.Item>
                                                )
                                            })
                                            : <ListGroup.Item as="li" className="font12">اطلاعاتی برای نمایش یافت نشد!</ListGroup.Item>}
                                    </ListGroup>
                                    :
                                    <div className="d-flex justify-content-center">
                                        <FontAwesomeIcon icon={faSpinner} className='spinner font60' />
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* <Col md='4' xl='3'>
                        <ListGroup className="shadow01">
                            <ListGroup.Item className="d-flex justify-content-between align-items-center py-4">
                                منو غذایی دستگاه طبقه همکف
                                <FontAwesomeIcon icon={faPizzaSlice} />
                            </ListGroup.Item>
                            {foods.length !== 0 ? foods.map((food, i)=>(
                                <ListGroup.Item key={i} className="d-flex border-bottom-0">
                                    <span className="w-50 font12">{xssFilters.inHTMLData(food.day)}</span>
                                    <span className="font12">{xssFilters.inHTMLData(food.name)}</span>
                                </ListGroup.Item>
                            )) : null}
                        </ListGroup>
                    </Col> */}
                </Row>
                <Row>
                    <Col md='8' xl='9' className="mb-3 mb-md-0">
                        <Card className="h-100 shadow01">
                            <Card.Header className="d-flex justify-content-between align-items-center py-4">
                                آخرین اخبار
                                <FontAwesomeIcon icon={faNewspaper} />
                            </Card.Header>
                            <Card.Body>
                                {loading !== true ?
                                    <ListGroup as="ol" variant="flush">
                                        {officeNewsList.length !== 0 ?
                                            officeNewsList.map((news) => {
                                                return (
                                                    <ListGroup.Item key={news._id} as="li" className="font12">{xssFilters.inHTMLData(news.body)}</ListGroup.Item>
                                                )
                                            })
                                            : <ListGroup.Item as="li" className="font12">اطلاعاتی برای نمایش یافت نشد!</ListGroup.Item>}
                                    </ListGroup>
                                    :
                                    <div className="d-flex justify-content-center">
                                        <FontAwesomeIcon icon={faSpinner} className='spinner font60' />
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md='4' xl='3'>
                        <Calendar
                            className='w-100 shadow01'
                            isGregorian={false}
                            showTodayButton={false}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home;