import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment-jalaali';
import { rootContext } from "../context/rootContext";
import WarehouseRequests from './WarehouseRequests';
import ReqListFilter from './WarehouseReqFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan, faCheck, faEye, faArrowsRotate, faSpinner, faClockRotateLeft, faHome, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import xssFilters from 'xss-filters';
import Loading from '../Common/Loading';

import ReqItemDeliveryM from "../Modals/WarehouseReqsModals/ReqItemDeliveryModal";
import ReqItemDetailsM from '../Modals/WarehouseReqsModals/ReqItemDetailsModal';
import ReqItemDeliveryDetailsM from '../Modals/WarehouseReqsModals/ReqItemDeliveryDetailsModal';
import WarehouseProDetailsM from '../Modals/Warehouse/Warehouse-ProDetailsModal';
import { selectUser, selectLoading, handleCurrentReqInfo, handleReqsList, selectReqsList, handleUserInformation, handleUserImage, selectUserInfoModal } from '../Slices/mainSlices';
import { handleReqProcess, RsetCurrentReqItems } from '../Slices/currentReqSlice';
import ProcessModal from '../Modals/ProcessModal';
import { selectProcessModal } from '../Slices/modalsSlice';
import UserInfoModal from '../Modals/UserInfoModal';

const WarehouseReqPage = ({ setPageTitle }) => {
    const processModal = useSelector(selectProcessModal);
    const userInfoModal = useSelector(selectUserInfoModal);
    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        handleCancelFilter,
        handleGetCurrentReqComments,
        reqItemDeliveryModal,
        reqItemDetailsModal,
        reqItemReceivedDetailsModal,
        proDetailsModal,
    } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])
    useEffect(() => {
        setPageTitle('مدیریت درخواست ها');
        dispatch(RsetCurrentReqItems([]));
    }, []);

    const user = useSelector(selectUser);
    const loading = useSelector(selectLoading);
    const reqsList = useSelector(selectReqsList);
    const dispatch = useDispatch();

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
                sort: true
            },
            {
                Header: "تاریخ ثبت درخواست",
                accessor: "reqDate",
                sort: true
            },
            {
                Header: "درخواست کننده",
                accessor: "reqUser",
                sort: true
            },
            {
                Header: "واحد سازمانی",
                accessor: "reqDep",
                sort: true
            },
            {
                Header: "نوع درخواست",
                accessor: "reqType",
                sort: true
            },
            {
                Header: "وضعیت درخواست",
                accessor: "reqStatus",
                sort: true
            },
            {
                Header: "عملیات",
                accessor: "reqOperation",
                sort: false
            }
        ]
    );

    const [seenSerial, setSeenSerial] = useState('');
    const [notVisited, setNotVisited] = useState([]);
    const handleNotVisited = (requests) => {
        const notVisitedArr = []
        for (var i = 0; i < requests.length; i++) {
            if (requests[i].seen === false) {
                notVisitedArr.push(requests[i].serial);
            } else {

            }
        }
        setNotVisited(notVisitedArr);
    }

    const handleUpdateNSeen = (serialNumber) => {
        var notVisitedArr = []
        for (var i = 0; i < notVisited.length; i++) {
            if (notVisited[i] !== serialNumber) {
                notVisitedArr.push(notVisited[i])
            } else {

            }
        }
        setNotVisited(notVisitedArr)
    }

    useEffect(() => {
        handleUpdateNSeen(seenSerial);
    }, [seenSerial])

    const link = (request) => {
        return (
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست ' + request.serial}
                onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                    setSeenSerial(request.serial);
                }}
            >
                {xssFilters.inHTMLData(request.serial)}
            </a>
        )
    }
    const edit = (request) => {
        if (request.lastActionCode === 0 && request.userId === localStorage.getItem('id')) {
            return (
                <Button
                    title='ویرایش'
                    className='btn btn-primary d-flex align-items-center'
                    size="sm"
                    active
                    onClick={() => {
                        dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'edit' }));
                        setSeenSerial(request.serial);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
            )
        } else {
            return null;
        }
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
    const status = (request) => {
        return (
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده روند درخواست ' + request.serial}
                onClick={() => {
                    dispatch(handleReqProcess({ typeId: request.typeId, requestId: request.requestId }));
                }}
            >
                {xssFilters.inHTMLData(request.statusName)}
            </a>
        )
    }
    const operation = (request) => {
        if ((request.userId === localStorage.getItem('id') && request.lastActionCode === 0) || (request.lastActionCode === 10000 && request.userId === localStorage.getItem('id'))) {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='ویرایش'
                        className='btn btn-primary d-flex align-items-center me-2'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'edit' }));
                            setSeenSerial(request.serial);
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
                </div>
            )
        } else if (request.lastToPersons === localStorage.getItem('id') || (request.lastToPersons !== null && request.lastToPersons.split(",").some(person => person === localStorage.getItem('id')) === true)) {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center me-2 mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'accept' }));
                            setSeenSerial(request.serial);
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    {request.lastActionCode !== 29
                        ? <Button
                            title='ابطال'
                            className='btn btn-danger d-flex align-items-center me-2 mb-2 mb-md-0'
                            size="sm"
                            active
                            onClick={() => {
                                dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'cancel' }));
                                setSeenSerial(request.serial);
                            }}
                        >
                            <FontAwesomeIcon icon={faBan} />
                        </Button>
                        : null
                    }
                    {edit(request, request.serial)}
                    <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center ms-2 mb-2 mb-md-0'
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
        } else if (request.lastActionCode === 1 && user.DeptCode === "1") {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center me-2 mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'accept' }));
                            setSeenSerial(request.serial);
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                        title='ابطال'
                        className='btn btn-danger d-flex align-items-center me-2 mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'cancel' }));
                            setSeenSerial(request.serial);
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} />
                    </Button>
                    <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center me-2 mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo('', request.requestId, request.typeId, request.seen, 'history', request.deptName));
                        }}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button>
                </div>
            )
        } else {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button title='مشاهده'
                        className='btn btn-warning d-flex me-2 align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                            setSeenSerial(request.serial);
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
                </div>
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
                    reqDep: xssFilters.inHTMLData(requests[i].deptName),
                    reqType: xssFilters.inHTMLData(requests[i].reqTypeName),
                    reqStatus: status(requests[i]),
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
                    reqDep: xssFilters.inHTMLData(requests[i].deptName),
                    reqType: xssFilters.inHTMLData(requests[i].reqTypeName),
                    reqStatus: status(requests[i]),
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
            mDep: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            type: 2
        }
        dispatch(handleReqsList(filterValues));
    }, [])

    useEffect(() => {
        var acceptWarehouseModal = document.getElementById('modalBlur');
        if ((reqItemDeliveryModal === true || reqItemReceivedDetailsModal === true) && acceptWarehouseModal !== null) {
            document.getElementById('modalBlur').classList.add('blur-5')
        } else if ((reqItemDeliveryModal === false || reqItemReceivedDetailsModal === false) && acceptWarehouseModal !== null) {
            document.getElementById('modalBlur').classList.remove('blur-5')
        }
    }, [reqItemDeliveryModal, reqItemReceivedDetailsModal])

    useEffect(() => {
        var viewWarehouseModal = document.getElementById('viewModalBlur');
        if (proDetailsModal === true && viewWarehouseModal !== null) {
            viewWarehouseModal.classList.add('blur-5')
        } else if (proDetailsModal === false && viewWarehouseModal !== null) {
            viewWarehouseModal.classList.remove('blur-5')
        }
    }, [proDetailsModal])

    return (
        <Container fluid className='pb-4'>
            {/* {menuPermission? */}
            <Fragment>
                <ReqListFilter />
                <section className='position-relative'>
                    {loading ? <Loading /> : null}
                    <div>
                        <Button size='sm' variant='primary' className='mb-2' onClick={() => {
                            handleCancelFilter('warehouse')
                        }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی جدول</Button>
                        <WarehouseRequests
                            requests={reqsList}
                            notVisited={notVisited}
                            columns={columns}
                            data={data}
                            onSort={handleSort}
                            fetchData={fetchData}
                            loading={load}
                            pageCount={pageCount}
                            handleNotVisited={handleNotVisited}
                        />
                        {reqItemDeliveryModal ? <ReqItemDeliveryM /> : null}
                        {reqItemDetailsModal ? <ReqItemDetailsM /> : null}
                        {reqItemReceivedDetailsModal ? <ReqItemDeliveryDetailsM /> : null}
                        {proDetailsModal ? <WarehouseProDetailsM /> : null}
                        {processModal ? <ProcessModal /> : null}
                        {userInfoModal && <UserInfoModal />}
                    </div>
                </section>
            </Fragment>
            {/*:
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

export default WarehouseReqPage;