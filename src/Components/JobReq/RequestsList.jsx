import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment-jalaali';
import { rootContext } from "../context/rootContext";
import { reqContext } from '../context/jobReqsContext/reqContext';
import Requests from './Requests';
import ReqListFilter from './ReqListFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan, faCheck, faEye, faArrowsRotate, faSpinner, faClockRotateLeft, faWarning, faHome } from '@fortawesome/free-solid-svg-icons';
import xssFilters from 'xss-filters';

import { RsetAcceptReqModal, RsetCancelReqModal, RsetViewReqModal } from '../Slices/modalsSlice';
import { useDispatch } from 'react-redux';
import { handleUserInformation, handleUserImage } from '../Slices/mainSlices';

const RequestsList = ({setPageTitle, loading, setLoading}) => {
    const dispatch = useDispatch();
    
    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        handleGetRequestList,
        requestList,
        setUsersFilterSelect,
        handleGetCurrentReqInfo
    } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])

    useEffect(()=>{
        setPageTitle('مدیریت درخواست کار سرامیک');
    }, [setPageTitle])
    
    const context = useContext(reqContext);
    const {
        allCompaniesFilter,
        setAllCompaniesFilter,
        realFilter,
        setRealFilter,
        allUsersFilter,
        setAllUsersFilter,
        allDepartmentsFilter,
        setAllDepartmentsFilter,
        allStatusesFilter,
        setAllStatusesFilter,
        fromDateFilter,
        setFromDateFilter,
        toDateFilter,
        setToDateFilter,
        handleGetCurrentRequest,
        handleReqHistory,
        setReqHistoryModal,
    } = context;
    
    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(-1);
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
                Header: "شرکت",
                accessor: "reqCompany",
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
    const [notVisited, setNotVisited ] = useState([]);
    const  handleNotVisited = (requests) =>{
        const notVisitedArr = []
        for(var i = 0 ; i < requests.length ; i++){
            if(requests[i].seen === false){
                notVisitedArr.push(requests[i].serial);
            }else {
               
            }
        }
        setNotVisited(notVisitedArr);   
    }
    const handleUpdateNSeen = (serialNumber) => {
            var notVisitedArr = []
            for(var i = 0 ; i < notVisited.length ; i++){
                if(notVisited[i] !== serialNumber){
                    notVisitedArr.push(notVisited[i])
                }else {
                   
                }
            }

            setNotVisited(notVisitedArr)
    }
    useEffect(()=>{
        handleUpdateNSeen(seenSerial);
    },[seenSerial])

    const link = (reqItem, serialNumber) => {
        return(
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست '+ xssFilters.inHTMLData(serialNumber)} 
                onClick={()=>{
                    handleGetCurrentReqInfo(reqItem.companyName, reqItem.requestId, reqItem.typeId, reqItem.seen, 'view', '');
                    setSeenSerial(serialNumber);
                }}
            >
                {xssFilters.inHTMLData(serialNumber)}
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
    const operation = (actionCode, serialNumber) => {
        // if(actionCode.userId === localStorage.getItem('id') && actionCode.lastActionCode === 0 ){
        //     return(
        //         <Button
        //             title='ویرایش'
        //             className='btn btn-primary d-flex align-items-center'
        //             size="sm"
        //             active
        //             onClick={()=>{
        //                 setEditRequestModal(true);
        //                 handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'edit', '')}}
        //         >
        //             <FontAwesomeIcon icon={faPenToSquare} />
        //         </Button>
        //     )
        // }else 
        if(actionCode.lastToPersons === localStorage.getItem('id') ){
            return(
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{
                            dispatch(RsetAcceptReqModal(true));
                            handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'accept', '');
                            setSeenSerial(serialNumber);
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                        title='ابطال'
                        className='btn btn-danger d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{
                            dispatch(RsetCancelReqModal(true));
                            handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'cancel', '');
                            setSeenSerial(serialNumber);
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} />
                    </Button>
                    {/* <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{setReqHistoryModal(true);handleGetCurrentRequest(actionCode);handleReqHistory(actionCode.reqInfo.serial_number)}}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button> */}
                    {/* <Button
                        title='ویرایش'
                        className='btn btn-primary d-flex align-items-center'
                        size="sm"
                        active
                        onClick={()=>{setEditRequestModal(true);handleGetCurrentRequest(actionCode)}}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button> */}
                </div>
            )
        }else if(actionCode.lastActionCode === 15){
            if(actionCode.lastToPersons === localStorage.getItem('id')){
                return(
                    <div className="d-flex justify-content-between flex-wrap">
                        <Button
                            title='تایید'
                            className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                            size="sm"
                            active
                            onClick={()=>{
                                dispatch(RsetAcceptReqModal(true));
                                handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'accept', '');
                                setSeenSerial(serialNumber);
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                        <Button
                            title='ابطال'
                            className='btn btn-danger d-flex align-items-center mb-2 mb-md-0'
                            size="sm"
                            active
                            onClick={()=>{
                                dispatch(RsetCancelReqModal(true));
                                handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'cancel', '');
                                setSeenSerial(serialNumber);
                            }}
                        >
                            <FontAwesomeIcon icon={faBan} />
                        </Button>
                        {/* <Button
                            title='ویرایش'
                            className='btn btn-primary d-flex align-items-center'
                            size="sm"
                            active
                            onClick={()=>{setEditRequestModal(true);handleGetCurrentRequest(actionCode)}}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Button> */}
                    </div>
                )
            }else{
                return(
                    <section className="d-flex justify-content-between flex-wrap">
                        <Button
                            title='مشاهده'
                            className='btn btn-warning d-flex align-items-center'
                            size="sm"
                            active
                            onClick={()=>{
                                dispatch(RsetViewReqModal(true));
                                handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'view', '');
                                setSeenSerial(serialNumber);
                            }}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </Button>
                        {/* <Button
                            title='تاریخچه'
                            className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                            size="sm"
                            active
                            onClick={()=>{setReqHistoryModal(true);handleGetCurrentRequest(actionCode);handleReqHistory(actionCode.reqInfo.serial_number)}}
                        >
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                        </Button> */}
                    </section>
                )
            }
        }else{
            return(
                <section className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='مشاهده'
                        className='btn btn-warning d-flex align-items-center'
                        size="sm"
                        active
                        onClick={()=>{
                            dispatch(RsetViewReqModal(true));
                            handleGetCurrentReqInfo(actionCode.companyName, actionCode.requestId, actionCode.typeId, actionCode.seen, 'view', '')}}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                    {/* <Button
                        title='تاریخچه'
                        className='btn btn-info d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{setReqHistoryModal(true);handleGetCurrentRequest(actionCode);handleReqHistory(actionCode.reqInfo.serial_number)}}
                    >
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                    </Button> */}
                </section>
            )
        }
    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    reqSerial: link(requests[i], requests[i].serial),
                    reqDate: moment.utc(xssFilters.inHTMLData(requests[i].createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: userInfo(requests[i]),
                    reqCompany: xssFilters.inHTMLData(requests[i].companyName),
                    // reqDep: requests[i].userInfo.department,
                    reqStatus: xssFilters.inHTMLData(requests[i].statusName),
                    reqOperation: operation(requests[i], requests[i].serial)
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
                    reqSerial: link(requests[i], requests[i].serial),
                    reqDate: moment.utc(xssFilters.inHTMLData(requests[i].createdDate), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: userInfo(requests[i]),
                    reqCompany: xssFilters.inHTMLData(requests[i].companyName),
                    // reqDep: requests[i].userInfo.department,
                    reqStatus: xssFilters.inHTMLData(requests[i].statusName),
                    reqOperation: operation(requests[i], requests[i].serial)
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

    const handleCancelFilter = () => {
        if(allCompaniesFilter !== '' || allUsersFilter !== '' || allDepartmentsFilter !== '' || allStatusesFilter !== '' || fromDateFilter !== null || toDateFilter !== null){
            setAllCompaniesFilter('');
            setAllUsersFilter('');
            setAllDepartmentsFilter('');
            setAllStatusesFilter('');
            setFromDateFilter(null);
            setToDateFilter(null); 
            const filterParams = {
                applicantId: localStorage.getItem('id'),
                serial: '',
                company: '',
                status: '',
                fromDate: 'null',
                toDate: 'null',
                type: 13
            }
            handleGetRequestList(filterParams);
        }
    }

    useEffect(() => {
        const filterParams = {
            applicantId: localStorage.getItem('id'),
            serial: '',
            company: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            type: 13
        }
        handleGetRequestList(filterParams);
    }, [])

    return(
        <Container fluid className='pb-4'>
            {/* {menuPermission ? */}
                <Fragment>
                    <ReqListFilter cancelFilter={handleCancelFilter} setLoading={setLoading}/>
                    {localStorage.getItem("id")?
                        <section>
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60'/></div>
                            : 
                                <div>
                                    <Button size='sm' variant='primary' className='mb-2' onClick={()=>{
                                        const filterParams = {
                                            applicantId: localStorage.getItem('id'),
                                            serial: '',
                                            company: '',
                                            status: '',
                                            fromDate: 'null',
                                            toDate: 'null',
                                            type: 13
                                        }
                                        handleGetRequestList(filterParams);
                                    }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2'/>به روزرسانی</Button>
                                    <Requests
                                        requests={requestList}
                                        notVisited={notVisited}
                                        columns={columns}
                                        data={data}
                                        onSort={handleSort}
                                        fetchData={fetchData}
                                        loading={load}
                                        pageCount={pageCount}
                                        handleNotVisited={handleNotVisited}
                                    />
                                </div>
                            }
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

export default RequestsList;