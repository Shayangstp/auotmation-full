import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import LeaveReqsFilter from './LeaveReqsFilter';
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from "../../context/officeContext/officeReqContext";
import LeaveReqItem from './LeaveReqItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faEye, faArrowsRotate, faPaperPlane, faSpinner, faHome, faWarning, faClockRotateLeft, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import xssFilters from 'xss-filters';
import Loading from '../../Common/Loading';
import ActionToPersonsM from '../../Modals/ActionToPersonsModal';
import { selectActionToPersonsModal, RsetActionToPersonsModal, selectUser, handleCurrentReqInfo } from '../../Slices/mainSlices';
import { RsetCurrentReqInfo } from '../../Slices/currentReqSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectDeleteReqModal, selectEditReqModal } from '../../Slices/modalsSlice';
import DeleteRequestModal from '../../Modals/OfficeReqsModals/DeleteRequestModal';
import EditRequestModal from '../../Modals/OfficeReqsModals/EditRequestModal';
import { handleReqsList, selectReqsList, handleUserInformation, handleUserImage } from '../../Slices/mainSlices';

const LeaveReqsList = ({ setPageTitle }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser)
    const actionToPersonsModal = useSelector(selectActionToPersonsModal);
    const deleteReqModal = useSelector(selectDeleteReqModal);
    const editReqModal = useSelector(selectEditReqModal);
    const reqsList = useSelector(selectReqsList);

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        loading,
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    useEffect(() => {
        setPageTitle('لیست درخواست های مرخصی');
    }, [setPageTitle])

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
                Header: "نوع مرخصی",
                accessor: "reqLeaveType",
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
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست ' + xssFilters.inHTMLData(request.serial)}
                onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                    setSeenSerial(request.serial);
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
                    dispatch(handleUserImage({userId: request.userId, status: 1}));
                }}
            >
                {xssFilters.inHTMLData(request.fullName)}
            </div>
        )
    }
    const operation = (request) => {
        if (request.lastToPersons === null && request.lastActionCode === 0) {
            return (
                <section className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='ارسال'
                        className='btn btn-primary d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(RsetCurrentReqInfo(request));
                            dispatch(RsetActionToPersonsModal(true));
                        }}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </section>
            )
        } else if (request.userId === localStorage.getItem('id') && request.lastActionCode === 0) {
            return (
                <section className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='ویرایش'
                        className='btn btn-primary d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'edit' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    <Button
                        title='حذف'
                        className='btn btn-danger d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'delete' }));
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
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
            );
        } else if ((request.lastToPersons !== null && request.lastToPersons.split(",").some(elm => elm === localStorage.getItem('id')))
            //  || ((request.lastActionCode !== 1 && request.lastActionCode !== 2) 
            //  && (user.Roles !== undefined && user.Roles.some(role=> role === '19' || role === '20')))
        ) {
            return (
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
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
                        className='btn btn-danger d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={() => {
                            dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'cancel' }));
                            setSeenSerial(request.serial);
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} />
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
                    reqLeaveType: xssFilters.inHTMLData(requests[i].leaveKindName),
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
                    reqLeaveType: xssFilters.inHTMLData(requests[i].leaveKindName),
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
        const filterParams = {
            applicantId: localStorage.getItem('id'),
            serial: '',
            memberId: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
            type: 4,
            group: 0
        }
        dispatch(handleReqsList(filterParams));
    }, [])
    return (
        <Container fluid className='py-4'>
            {/* {menuPermission ? */}
            <Fragment>
                <LeaveReqsFilter />
                {localStorage.getItem("id") ?
                    <section className='position-relative'>
                        {loading ? <Loading /> : null}
                        <div>
                            <Fragment>
                                <Button size='sm' variant='primary' className='mb-2' onClick={() => {
                                    const filterParams = {
                                        applicantId: localStorage.getItem('id'),
                                        serial: '',
                                        memberId: '',
                                        status: '',
                                        fromDate: 'null',
                                        toDate: 'null',
                                        year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
                                        type: 4,
                                        group: 0
                                    }
                                    dispatch(handleReqsList(filterParams));
                                }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی</Button>
                                <LeaveReqItem
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
                                {actionToPersonsModal ? <ActionToPersonsM /> : null}
                                {editReqModal ? <EditRequestModal/> : null}
                                {deleteReqModal ? <DeleteRequestModal /> : null}
                            </Fragment>
                        </div>
                    </section>
                    :
                    <Redirect push to="/" />
                }
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

export default LeaveReqsList;