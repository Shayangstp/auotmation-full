import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import MissionReqsFilter from './MissionReqsFilter';
import { rootContext } from "../../context/rootContext";
import { officeReqContext } from '../../context/officeContext/officeReqContext';
import MissionReqItem from './MissionReqItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faEye, faArrowsRotate, faSpinner, faHome, faWarning, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import xssFilters from 'xss-filters';
import { useSelector } from 'react-redux';
import { selectUser } from '../../Slices/mainSlices';

const MissionReqsList = ({setPageTitle, loading, setLoading}) => {
    const user = useSelector(selectUser)
    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        handleGetRequestList,
        requestList,
        handleGetCurrentReqInfo
    } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])



    useEffect(()=>{
        const filterValues = {   
            applicantId: localStorage.getItem('id'),
            serial: '',
            memberId : '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
            year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
            city: '',
            type: 9
        }
        handleGetRequestList(filterValues);
    },[])

    useEffect(()=>{
        setPageTitle('لیست درخواست های ماموریت');
    }, [setPageTitle])
    const officeRequestContext = useContext(officeReqContext);
    const {
        handleOfficeLeaveDetails,
    } = officeRequestContext;
    
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
                Header: "موضوع",
                accessor: "reqMissionSubject",
                sort: true
            },
            {
                Header: "استان",
                accessor: "reqMissionProvince",
                sort: true
            },
            {
                Header: "شهر",
                accessor: "reqMissionCity",
                sort: true
            },
            {
                Header: "نوع حمل و نقل",
                accessor: "reqMissionTripType",
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
                notVisitedArr.push(requests[i].reqInfo.serial_number);
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

    const editDriverOrMissionDate = (actionCode) => {
        if(actionCode.lastActionCode === 36 && user.Roles.some(role=> role === '44')){
            return(
                <Button
                    title='ویرایش'
                    className='btn btn-primary d-flex align-items-center mb-2 mb-md-0'
                    size="sm"
                    active
                    onClick={()=>{
                        handleGetCurrentReqInfo('',actionCode.reqInfo._id, actionCode.type, actionCode.seen, 'edit', actionCode.department);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
            )
        }
    }

    const link = (reqItem, serialNumber) => {
        return(
            <a className='text-dark text-decoration-none cursorPointer serialHover' title={'مشاهده درخواست '+ xssFilters.inHTMLData(serialNumber)} 
                onClick={()=>{
                    handleGetCurrentReqInfo('',reqItem.reqInfo._id, reqItem.type, reqItem.seen, 'view', reqItem.department);
                    setSeenSerial(serialNumber);
                }}
            >
                {xssFilters.inHTMLData(serialNumber)}
            </a>
        )
    }
    const operation = (actionCode, serialNumber) => {
        var index = actionCode.process.length-1;
        if(actionCode.process[index].toPersons !== undefined && actionCode.process[index].toPersons.some(elm => elm === localStorage.getItem('id')) ){
            return(
                <div className="d-flex justify-content-between flex-wrap">
                    <Button
                        title='تایید'
                        className='btn btn-success d-flex align-items-center mb-2 mb-md-0'
                        size="sm"
                        active
                        onClick={()=>{
                            handleGetCurrentReqInfo('',actionCode.reqInfo._id, actionCode.type, actionCode.seen, 'accept', actionCode.department);
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
                            handleGetCurrentReqInfo('',actionCode.reqInfo._id, actionCode.type, actionCode.seen, 'cancel', actionCode.department);
                            setSeenSerial(serialNumber);
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} />
                    </Button>
                    {editDriverOrMissionDate(actionCode)}
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
                            handleGetCurrentReqInfo('',actionCode.reqInfo._id, actionCode.type, actionCode.seen, 'view', actionCode.department);
                            setSeenSerial(serialNumber);
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </Button>
                </section>
            )
        }
    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                // var index = requests[i].process.length-1;
                var tableItem = {
                    reqSerial: link(requests[i], requests[i].reqInfo.serial_number),
                    reqDate: moment.utc(xssFilters.inHTMLData(requests[i].process[0].date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: (xssFilters.inHTMLData(requests[i].process[0].userInfo.first_name) + " " + xssFilters.inHTMLData(requests[i].process[0].userInfo.last_name)),
                    reqMissionSubject: xssFilters.inHTMLData(requests[i].reqInfo.subject),
                    reqMissionCity: xssFilters.inHTMLData(requests[i].reqInfo.city.CityName),
                    reqMissionProvince: xssFilters.inHTMLData(requests[i].reqInfo.city.ProvinceName),
                    reqMissionTripType: requests[i].reqInfo.tripType !== undefined ? xssFilters.inHTMLData(requests[i].reqInfo.tripType.name) : '',
                    reqStatus: xssFilters.inHTMLData(requests[i].status.name),
                    reqOperation: operation(requests[i], requests[i].reqInfo.serial_number)
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
                // var index = requests[i].process.length-1;
                var tableItem = {
                    reqSerial: link(requests[i], requests[i].reqInfo.serial_number),
                    reqDate: moment.utc(xssFilters.inHTMLData(requests[i].process[0].date), 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: (xssFilters.inHTMLData(requests[i].process[0].userInfo.first_name) + " " + xssFilters.inHTMLData(requests[i].process[0].userInfo.last_name)),
                    reqMissionSubject: xssFilters.inHTMLData(requests[i].reqInfo.subject),
                    reqMissionCity: xssFilters.inHTMLData(requests[i].reqInfo.city.CityName),
                    reqMissionProvince: xssFilters.inHTMLData(requests[i].reqInfo.city.ProvinceName),
                    reqMissionTripType: requests[i].reqInfo.tripType !== undefined ? xssFilters.inHTMLData(requests[i].reqInfo.tripType.name) : '',
                    reqStatus: xssFilters.inHTMLData(requests[i].status.name),
                    reqOperation: operation(requests[i], requests[i].reqInfo.serial_number)
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

    return(
        <Container fluid className='pb-4'>
            {/* {menuPermission ? */}
                <Fragment>
                    {localStorage.getItem("id")?
                        <section>
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60'/></div>
                            : 
                                <div>
                                    <Row>
                                        <Col md='12'>
                                            <MissionReqsFilter/>
                                        </Col>
                                    </Row>
                                    <Button size='sm' variant='primary' className='mb-2' onClick={()=>{
                                        const filterValues = {  
                                            applicantId: localStorage.getItem('id'), 
                                            serial: '',
                                            memberId : '',
                                            status: '',
                                            fromDate: 'null',
                                            toDate: 'null',
                                            year: new Date().toLocaleDateString('fa-IR', { numberingSystem: 'latn' }).slice(0, 4),
                                            city: '',
                                            type: 9
                                        }
                                        handleGetRequestList(filterValues);
                                    }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2'/>به روزرسانی</Button>
                                    <MissionReqItem
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

export default MissionReqsList;