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
import { handleReqsList, selectReqsList, handleCurrentReqInfo, handleUserInformation, handleUserImage, selectUserInfoModal, selectLoading } from '../../Slices/mainSlices';
import { RsetCurrentReqItems } from '../../Slices/currentReqSlice';
import UserInfoModal from '../../Modals/UserInfoModal';
import { selectShowFilter, RsetShowFilter } from '../../Slices/filterSlices';
import Loading from '../../Common/Loading';

const PurchaseReqsList = ({ setPageTitle }) => {
    const dispatch = useDispatch();
    const reqsList = useSelector(selectReqsList);
    const userInfoModal = useSelector(selectUserInfoModal);
    const showFilter = useSelector(selectShowFilter);
    const loading = useSelector(selectLoading);

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
        dispatch(RsetShowFilter(false));
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
                Header: "تایید کننده",
                accessor: "reqAcceptor",
                sort: true
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
    const userInfo = (request, userStatus) => {
        const name = ()=> {
            if(userStatus === 'user'){
                return xssFilters.inHTMLData(request.fullName)
            }else if(userStatus === 'acceptor' && request.lastActionCode !== 0 && request.lastActionCode !== 2){
                return xssFilters.inHTMLData(request.lastAcceptorName);
            }else{
                return '';
            }
        }
        return (
            <div className='text-dark cursorPointer' title='مشاهده اطلاعات کاربر '
                onClick={() => {
                    if(userStatus === 'user'){
                        dispatch(handleUserInformation(request.userId));
                        dispatch(handleUserImage({ userId: request.userId, status: 1 }));
                    }else if(userStatus === 'acceptor'){
                        dispatch(handleUserInformation(request.lastAcceptorId));
                        dispatch(handleUserImage({ userId: request.lastAcceptorId, status: 1 }));
                    }
                }}
            >
                {name()}
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
                    reqUser: userInfo(requests[i], 'user'),
                    reqAcceptor: userInfo(requests[i], 'acceptor'),
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
                    reqUser: userInfo(requests[i], 'user'),
                    reqAcceptor: userInfo(requests[i], 'acceptor'),
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
            type: 9,
            group: 0
        }
        dispatch(handleReqsList(filterValues));
    }, [])
    return (
        <Container fluid className='pb-4'>
            {/* {menuPermission ? */}
            <Fragment>
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
                        <Button size='sm' variant='warning' className='mb-2 ms-2 font12' onClick={() => { dispatch(RsetShowFilter(!showFilter)) }}>
                            <FontAwesomeIcon icon={faFilter} className='me-2' />فیلتر
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
                            type: 9,
                            group: 0
                        }
                        dispatch(handleReqsList(filterValues));
                    }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی</Button>
                </div>
                <section className="position-relative">
                    {loading ? <Loading /> : null}
                    <div>
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