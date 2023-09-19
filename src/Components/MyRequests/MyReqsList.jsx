import React, { Fragment, useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { rootContext } from "../context/rootContext";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWarning, faEye, faPenToSquare, faFilter, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import moment from "moment-jalaali";
import MyReqsItem from "./MyReqsItem";
import MyReqsFilter from "./MyReqsFilter";
import { useDispatch, useSelector } from "react-redux";
import { handleMyReqsList, selectLoading, selectReqsList, handleUserInformation, handleUserImage, selectUserInfoModal, handleCurrentReqInfo } from '../Slices/mainSlices';
import OfficeViewRequestM from "../Modals/OfficeReqsModals/ViewRequestModal";
import WarehouseViewRequestM from "../Modals/WarehouseReqsModals/ViewRequestModal";
import ViewOverTime from "../Modals/OfficeReqsModals/overTimeModals/ViewOverTime";
import ITJobViewRequestM from "../Modals/ITJReqModals/ViewRequestModal";
import { selectViewReqModal, selectProcessModal } from "../Slices/modalsSlice";
import Loading from "../Common/Loading";
import { selectShowFilter, RsetShowFilter } from "../Slices/filterSlices";
import { handleReqProcess, selectCurrentReqType } from '../Slices/currentReqSlice';
import ProcessModal from '../Modals/ProcessModal';
import UserInfoModal from '../Modals/UserInfoModal';
import xssFilters from 'xss-filters';

const MyReqsList = ({ setPageTitle }) => {

    const dispatch = useDispatch();
    const viewReqModal = useSelector(selectViewReqModal);
    const reqsList = useSelector(selectReqsList);
    const loading = useSelector(selectLoading);
    const showFilter = useSelector(selectShowFilter);
    const processModal = useSelector(selectProcessModal);
    const userInfoModal = useSelector(selectUserInfoModal);
    const currentReqType = useSelector(selectCurrentReqType);

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
    } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])

    useEffect(() => {
        setPageTitle('درخواست های من');
    }, [setPageTitle]);

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
                Header: "تایید کننده",
                accessor: "reqAcceptor",
                sort: true
            },
            {
                Header: "دسته بندی",
                accessor: "reqCategory",
                sort: true
            },
            {
                Header: "وضعیت",
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
    const link = (request) => {
        return (
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست ' + request.serial}
                onClick={() => {
                    dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                }}
            >
                {xssFilters.inHTMLData(request.serial)}
            </a>
        )
    }
    const userInfo = (request, userStatus) => {
        const name = () => {
            if (userStatus === 'user') {
                return xssFilters.inHTMLData(request.fullName)
            } else if (userStatus === 'acceptor' && request.lastActionCode !== 0 && request.lastActionCode !== 2) {
                return xssFilters.inHTMLData(request.lastAcceptorName);
            } else {
                return '';
            }
        }
        return (
            <div className='text-dark cursorPointer' title='مشاهده اطلاعات کاربر '
                onClick={() => {
                    if (userStatus === 'user') {
                        dispatch(handleUserInformation(request.userId));
                        dispatch(handleUserImage({ userId: request.userId, status: 1 }));
                    } else if (userStatus === 'acceptor') {
                        dispatch(handleUserInformation(request.lastAcceptorId));
                        dispatch(handleUserImage({ userId: request.lastAcceptorId, status: 1 }));
                    }
                }}
            >
                {name()}
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
        return (
            <div className="d-flex justify-content-between flex-wrap">
                {/* {request.type.code === 2 
                    ? <Button
                        title='ویرایش'
                        className='btn btn-primary d-flex align-items-center'
                        size="sm"
                        active
                        onClick={() => {
                            
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    : null
                } */}
                <Button
                    title='مشاهده'
                    className='btn btn-warning d-flex align-items-center mb-2 mb-md-0'
                    size="sm"
                    active
                    onClick={() => {
                        dispatch(handleCurrentReqInfo({ reqId: request.requestId, reqType: request.typeId, reqSeen: request.seen, company: '', dep: request.deptName, oprationType: 'view' }));
                    }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </Button>
            </div>
        )

    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    reqSerial: link(requests[i]),
                    reqDate: moment.utc(requests[i].createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqAcceptor: userInfo(requests[i], 'acceptor'),
                    reqCategory: requests[i].typeName,
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
                    reqAcceptor: userInfo(requests[i], 'acceptor'),
                    reqCategory: requests[i].typeName,
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

    const viewModal = () => {
        if (currentReqType === 2 || currentReqType === 9) {
            return <WarehouseViewRequestM />
        } else if (currentReqType === 4) {
            return <OfficeViewRequestM />
        } else if (currentReqType === 1) {
            return <ITJobViewRequestM />
        } else {
            return null
        }
    }

    useEffect(() => {
        const filterValues = {
            applicantId: localStorage.getItem('id'),
            memberId: '',
            type: 0,
            status: '',
            fromDate: 'null',
            toDate: 'null',
        }
        dispatch(handleMyReqsList(filterValues));
    }, [])

    return (
        <Container fluid>
            {/* {menuPermission ? */}
            <Fragment>
                {showFilter
                    ? <Row>
                        <Col md='12'>
                            <MyReqsFilter />
                        </Col>
                    </Row>
                    : null
                }
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <Button size='sm' variant='warning' className='mb-2 ms-2 font12' onClick={() => { dispatch(RsetShowFilter(!showFilter)) }}>
                            <FontAwesomeIcon icon={faFilter} className='me-2' />فیلتر
                        </Button>
                    </div>
                    <Button size='sm' variant='primary' className='mb-2 font12' onClick={() => {
                        const filterValues = {
                            applicantId: localStorage.getItem('id'),
                            memberId: '',
                            type: 0,
                            status: '',
                            fromDate: 'null',
                            toDate: 'null',
                        }
                        dispatch(handleMyReqsList(filterValues));
                    }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی</Button>
                </div>
                <section className='position-relative'>
                    {loading ? <Loading /> : null}
                    <div>
                        <MyReqsItem
                            requests={reqsList}
                            columns={columns}
                            data={data}
                            onSort={handleSort}
                            fetchData={fetchData}
                            loading={load}
                            pageCount={pageCount}
                        />
                        {viewReqModal ? viewModal() : null}
                        {processModal ? <ProcessModal /> : null}
                        {userInfoModal && <UserInfoModal />}
                    </div>
                </section>
            </Fragment>
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

export default MyReqsList;