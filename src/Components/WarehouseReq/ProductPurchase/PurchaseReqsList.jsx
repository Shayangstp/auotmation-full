import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import PurchaseReqsFilter from './PurchaseReqsFilter';
import { rootContext } from "../../context/rootContext";
import PurchaseReqItem from './PurchaseReqItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faEye, faArrowsRotate, faSpinner, faPlus, faHome, faWarning, faClockRotateLeft, faPenToSquare, faFilter } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import xssFilters from 'xss-filters';
import { useDispatch, useSelector } from 'react-redux';
import { handleReqsList, selectReqsList, handleCurrentReqInfo, handleUserInformation, handleUserImage, selectUserInfoModal } from '../../Slices/mainSlices';
import { RsetCurrentReqItems } from '../../Slices/currentReqSlice';
import UserInfoModal from '../../Modals/UserInfoModal';
import { selectShowFilter, RsetShowFilter } from '../../Slices/filterSlices';

const PurchaseReqsList = ({ setPageTitle, loading, setLoading }) => {
    const dispatch = useDispatch();
    const reqsList = useSelector(selectReqsList);
    const userInfoModal = useSelector(selectUserInfoModal);
    const showFilter = useSelector(selectShowFilter);

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        handleCancelFilter,
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    useEffect(() => {
        setPageTitle('لیست درخواست های خرید');
        dispatch(RsetCurrentReqItems([]));
    }, [])

    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const columns = useMemo(
        () => [
            {
                Header: "سریال درخواست",
                accessor: "reqSerial",
                disableSortBy: true
            },
            {
                Header: "تاریخ ثبت درخواست",
                accessor: "reqDate",
                disableSortBy: false
            },
            {
                Header: "درخواست کننده",
                accessor: "reqUser",
                disableSortBy: false
            },
            {
                Header: "شرکت",
                accessor: "reqCompany",
                disableSortBy: false
            },
            {
                Header: "محل درخواست",
                accessor: "reqPlace",
                disableSortBy: false
            },
            {
                Header: "تعداد آیتم",
                accessor: "reqItemsCount",
                disableSortBy: false
            },
            {
                Header: "وضعیت درخواست",
                accessor: "reqStatus",
                disableSortBy: false
            },
            {
                Header: "عملیات",
                accessor: "reqOperation",
                disableSortBy: true
            }
        ]
    );

    const link = (request) => {
        return (
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست ' + request.serial}
                onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                    // setSeenSerial(request.serial);
                }}
            >
                {xssFilters.inHTMLData(request.serial)}
            </a>
        )
    }
    const userInfo = (request) => {
        return (
            <div className='text-dark cursorPointer' title='مشاهده اطلاعات کاربر '
                onClick={() => {
                    dispatch(handleUserInformation(request.userId));
                    dispatch(handleUserImage({ userId: request.userId, status: 1 }));
                }}
            >
                {xssFilters.inHTMLData(request.fullName)}
            </div>
        )
    }
    const operation = (request) => {
        if (request.lastActionCode === 0 && request.userId === localStorage.getItem('id')) {
            return (
                <section className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='ویرایش'
                        className='btn d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'edit' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    {/* <Button
                        title='مشاهده'
                        className='btn btn-warning d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button> */}
                    <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'history' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button>
                </section>
            )
        }
        else if (request.lastToPersons !== null && request.lastToPersons.split(',').some(elm => elm === localStorage.getItem('id')) && request.lastActionCode === 0) {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'accept' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                        title='ابطال'
                        className='btn btn-danger d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'cancel' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} />
                    </Button>
                    <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'history' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button>
                </div>
            )
        } else if (request.lastToPersons !== null && request.lastToPersons.split(',').some(elm => elm === localStorage.getItem('id')) && request.lastActionCode !== 0) {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'accept' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'history' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button>
                </div>
            )
        } else {
            return (
                <section className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='مشاهده'
                        className='btn btn-warning d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'history' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button>
                </section>
            )
        }
    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    reqSerial: link(requests[i]),
                    reqDate: moment.utc(requests[i].createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: userInfo(requests[i]),
                    reqCompany: xssFilters.inHTMLData(requests[i].companyName),
                    reqPlace: xssFilters.inHTMLData(requests[i].placeOfPurchaseName),
                    reqItemsCount: xssFilters.inHTMLData(requests[i].itemsCount),
                    reqStatus: xssFilters.inHTMLData(requests[i].statusName),
                    reqOperation: operation(requests[i])
                }
                tableItems.push(tableItem)
            }
        }
        const fetchId = ++fetchIdRef.current;
        setload(true);
        if (fetchId === fetchIdRef.current) {
            const startRow = pageSize * pageIndex;
            const endRow = startRow + pageSize;
            setData(tableItems.slice(startRow, endRow));
            setPageCount(Math.ceil(tableItems.length / pageSize));
            setload(false);
        }
    }, []);
    const handleSort = useCallback(({ sortBy, pageIndex, pageSize, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    reqSerial: link(requests[i]),
                    reqDate: moment.utc(requests[i].createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: userInfo(requests[i]),
                    reqCompany: xssFilters.inHTMLData(requests[i].companyName),
                    reqPlace: xssFilters.inHTMLData(requests[i].placeOfPurchaseName),
                    reqItemsCount: xssFilters.inHTMLData(requests[i].itemsCount),
                    reqStatus: xssFilters.inHTMLData(requests[i].statusName),
                    reqOperation: operation(requests[i])
                }
                tableItems.push(tableItem)
            }
        }
        const sortId = ++sortIdRef.current;
        setload(true);
        if (sortId === sortIdRef.current) {
            let sorted = tableItems.slice();
            sorted.sort((a, b) => {
                for (let i = 0; i < sortBy.length; ++i) {
                    if (a[sortBy[i].id] > b[sortBy[i].id])
                        return sortBy[i].desc ? -1 : 1;
                    if (a[sortBy[i].id] < b[sortBy[i].id])
                        return sortBy[i].desc ? 1 : -1;
                }
                return 0;
            });
            const startRow = pageSize * pageIndex;
            const endRow = startRow + pageSize;
            setData(sorted.slice(startRow, endRow));
            setload(false);
        }
    }, []);


    useEffect(() => {
        const filterValues = {
            applicantId: localStorage.getItem('id'),
            memberId: '',
            serial: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            type: 9
        }
        dispatch(handleReqsList(filterValues));
    }, [])
    return (
        <Container fluid className='pb-4'>
            {/* {menuPermission ? */}
            <Fragment>
                <section>
                    {loading ?
                        <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                        :
                        <div>
                            {showFilter
                                ? <Row>
                                    <Col md='12'>
                                        <PurchaseReqsFilter />
                                    </Col>
                                </Row>
                                : null
                            }
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <Link to='/PurchaseReqRegistration'>
                                        <Button size='sm' variant='success' className='mb-2 font12'>
                                            <FontAwesomeIcon icon={faPlus} className='me-2' />افزودن درخواست جدید
                                        </Button>
                                    </Link>
                                    <Button size='sm' variant='warning' className='mb-2 ms-2 font12' onClick={()=>{dispatch(RsetShowFilter(!showFilter))}}>
                                        <FontAwesomeIcon icon={faFilter} className='me-2' />فیلتر پیشرفته
                                    </Button>
                                </div>
                                <Button size='sm' variant='primary' className='mb-2 font12' onClick={() => {
                                    const filterValues = {
                                        applicantId: localStorage.getItem('id'),
                                        memberId: '',
                                        serial: '',
                                        status: '',
                                        fromDate: 'null',
                                        toDate: 'null',
                                        type: 9
                                    }
                                    dispatch(handleReqsList(filterValues));
                                }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی جدول</Button>
                            </div>
                            <PurchaseReqItem
                                requests={reqsList}
                                columns={columns}
                                data={data}
                                onSort={handleSort}
                                fetchData={fetchData}
                                loading={load}
                                pageCount={pageCount}
                            />
                            {userInfoModal && <UserInfoModal />}
                        </div>
                    }
                </section>
            </Fragment>
            {/* :
                <Row>
                    <Col>
                        <Alert variant="warning">
                            <Alert.Heading>
                                <FontAwesomeIcon icon={faWarning} className='me-2 font24'/>
                                <span className="font24">عدم دسترسی!</span>
                            </Alert.Heading>
                            <p>
                            کاربر گرامی شما به این بخش دسترسی ندارید. 
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">   
                                <Link to='/Home'>
                                    <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faHome} className='me-2'/>
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

export default PurchaseReqsList;