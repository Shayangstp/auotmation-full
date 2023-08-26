import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import moment from 'moment-jalaali';
import { rootContext } from "../context/rootContext";
import { reqContext } from '../context/warehouseReqsContext/reqContext';
import Requests from './WarehouseRequests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faBan, faCheck, faEye, faArrowsRotate, faSpinner, faHome, faWarning } from '@fortawesome/free-solid-svg-icons';

import { RsetAcceptReqModal, RsetCancelReqModal, RsetEditReqModal, RsetViewReqModal } from '../Slices/modalsSlice';

const WarehouseNewRequestsList = ({setPageTitle, loading, setLoading}) => {

    const dispatch = useDispatch();

    const mainContext = useContext(rootContext);
    const {
        handleCheckPermission,
        menuPermission,
        handleReqVisited
    } = mainContext;
    useEffect(()=>{
        handleCheckPermission(localStorage.getItem('lastLocation'));
    },[])
    useEffect(()=>{
        setPageTitle('مدیریت درخواست های جدید');
    }, [setPageTitle])
    const context = useContext(reqContext);

    const {
        handleAllNewWarehouseRequests,
        allWarehouseReqs,
        handleGetCurrentRequest,
    } = context;
    
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
    const [notVisited, setNotVisited ] = useState([]);
    const  handleNotVisited = (requests) =>{
        var notVisitedArr = []
        for(var i = 0 ; i < requests.length ; i++){
            if(requests[i].seen === false){
                notVisitedArr.push(requests[i].reqInfo.serial_number)
            }else {
                
            }
        }
        setNotVisited(notVisitedArr)
    }
    const setReqVisited = (request) => {
        handleReqVisited(request.reqInfo._id, true, request.type);
    }
    const link = (reqItem, serialNumber) => {
        return(
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست '+ serialNumber} 
                onClick={()=>{dispatch(RsetViewReqModal(true));handleGetCurrentRequest(reqItem);
                    setReqVisited(reqItem)}}
            >
                {serialNumber}
            </a>
        )
    }
    const operation = (actionCode) => {
        var index = actionCode.process.length-1;
        if(actionCode.userInfo._id === localStorage.getItem('id') && actionCode.lastActionCode === 0 ){
            return(
                <Button
                    title='ویرایش'
                    className='btn btn-primary d-flex align-items-center'
                    size="sm"
                    active
                    onClick={()=>{dispatch(RsetEditReqModal(true));handleGetCurrentRequest(actionCode)}}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
            )
        }else if(actionCode.process[index].toPerson === localStorage.getItem('id') ){
            return(
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{dispatch(RsetAcceptReqModal(true));handleGetCurrentRequest(actionCode);
                            setReqVisited(actionCode)}}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                        title='ابطال'
                        className='btn btn-danger d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{dispatch(RsetCancelReqModal(true));handleGetCurrentRequest(actionCode);
                            setReqVisited(actionCode)}}
                    >
                        <FontAwesomeIcon icon={faBan} />
                    </Button>
                    {/* <Button
                        title='ویرایش'
                        className='btn btn-primary d-flex align-items-center'
                        size="sm"
                        active
                        onClick={()=>{dispatch(RsetEditReqModal(true));handleGetCurrentRequest(actionCode)}}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </Button> */}
                </div>
            )
        }else if(actionCode.lastActionCode === 15){
            if(actionCode.process[index-1].toPerson === localStorage.getItem('id')){
                return(
                    <div className="d-flex justify-content-between flex-wrap">
                        <Button
                            title='تایید'
                            className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                            size="sm"
                            active
                            onClick={()=>{dispatch(RsetAcceptReqModal(true));handleGetCurrentRequest(actionCode);
                                setReqVisited(actionCode)}}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                        <Button
                            title='ابطال'
                            className='btn btn-danger d-flex align-items-center mb-2 mb-md-0'
                            size="sm"
                            active
                            onClick={()=>{dispatch(RsetCancelReqModal(true));handleGetCurrentRequest(actionCode);
                                setReqVisited(actionCode)}}
                        >
                            <FontAwesomeIcon icon={faBan} />
                        </Button>
                        {/* <Button
                            title='ویرایش'
                            className='btn btn-primary d-flex align-items-center'
                            size="sm"
                            active
                            onClick={()=>{dispatch(RsetEditReqModal(true));handleGetCurrentRequest(actionCode)}}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Button> */}
                    </div>
                )
            }else{
                return(
                    <Button
                        title='مشاهده'
                        className='btn btn-warning d-flex align-items-center'
                        size="sm"
                        active
                        onClick={()=>{dispatch(RsetViewReqModal(true));handleGetCurrentRequest(actionCode);
                            setReqVisited(actionCode)}}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                )
            }
        }else{
            return(
                <Button
                    title='مشاهده'
                    className='btn btn-warning d-flex align-items-center'
                    size="sm"
                    active
                    onClick={()=>{dispatch(RsetViewReqModal(true));handleGetCurrentRequest(actionCode);
                        setReqVisited(actionCode)}}
                >
                    <FontAwesomeIcon icon={faEye} />
                </Button>
            )
        }
    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var index = requests[i].process.length-1;
                var tableItem = {
                    reqSerial: link(requests[i], requests[i].reqInfo.serial_number),
                    reqDate: moment.utc(requests[i].process[index].date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: (requests[i].userInfo.first_name + " " + requests[i].userInfo.last_name),
                    reqDep: requests[i].userInfo.department,
                    reqStatus: requests[i].status,
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
                var index = requests[i].process.length-1;
                var tableItem = {
                    reqSerial: link(requests[i], requests[i].reqInfo.serial_number),
                    reqDate: moment.utc(requests[i].process[index].date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: (requests[i].userInfo.first_name + " " + requests[i].userInfo.last_name),
                    reqDep: requests[i].userInfo.department,
                    reqStatus: requests[i].status,
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
        handleAllNewWarehouseRequests();
    }, [allWarehouseReqs.length])
    return(
        <Container fluid className='pb-4'>
            {menuPermission?
                <Fragment>
                    {localStorage.getItem("id")?
                        <section>
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60'/></div>
                            : 
                                <div>
                                    <Button size='sm' variant='primary' className='mb-2' onClick={()=>{
                                        handleAllNewWarehouseRequests();
                                    }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2'/>به روزرسانی</Button>
                                    <Requests
                                        requests={allWarehouseReqs}
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
            : 
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
            }
        </Container>
    )
}

export default WarehouseNewRequestsList;