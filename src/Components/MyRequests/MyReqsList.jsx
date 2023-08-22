import React, { Fragment, useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import { rootContext } from "../context/rootContext";
import { allNewReqsContext } from "../context/allNewReqsContext/allNewReqsContext";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faHome, faWarning, faEye, faBan, faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import moment from "moment-jalaali";
import MyReqsItem from "./MyReqsItem";
import MyReqsFilter from "./MyReqsFilter";
import { useDispatch, useSelector } from "react-redux";
import { handleMyReqsList, selectReqsList } from '../Slices/mainSlices';
import OfficeViewRequestM from "../Modals/OfficeReqsModals/ViewRequestModal";
import WarehouseViewRequestM from "../Modals/WarehouseReqsModals/ViewRequestModal";
import ViewOverTime from "../Modals/OfficeReqsModals/overTimeModals/ViewOverTime";
import ViewRequestM from "../Modals/ITJReqModals/ViewRequestModal";
import { selectViewReqModal } from "../Slices/modalsSlice";

const MyReqsList = ({ setPageTitle, loading }) => {
    const dispatch = useDispatch();
    const viewReqModal = useSelector(selectViewReqModal);
    const reqsList = useSelector(selectReqsList);
    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
        handleGetCurrentReqInfo,
        currentReqType
    } = mainContext;
    // useEffect(()=>{
    //     handleCheckPermission(localStorage.getItem('lastLocation'));
    // },[])
    useEffect(() => {
        setPageTitle('درخواست های جدید');
    }, [setPageTitle]);

    const allNewRequestsContext = useContext(allNewReqsContext);
    const {

    } = allNewRequestsContext;
    useEffect(() => {
        const filterParams = {
            applicantId: localStorage.getItem('id'),
            memberId: '',
            type: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
        }
        dispatch(handleMyReqsList(filterParams));
    }, [])

    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const columns = useMemo(
        () => [
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
                {request.type.code !== 15 ? <Button
                    title='مشاهده'
                    className='btn btn-warning d-flex align-items-center mb-2 mb-md-0'
                    size="sm"
                    active
                    onClick={() => {
                        handleGetCurrentReqInfo('', request.reqInfo._id, request.type.code, true, 'view', '');
                    }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </Button>:null}
            </div>
        )

    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    reqDate: moment.utc(requests[i].date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: (requests[i].process[0].userInfo.first_name + " " + requests[i].process[0].userInfo.last_name),
                    reqCategory: requests[i].type.name,
                    reqStatus: requests[i].type.code !== 15 ? requests[i].status.name : '',
                    reqOperation: operation(requests[i], requests[i].reqInfo !== undefined ? requests[i].reqInfo.serial_number : '')
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
                    reqDate: moment.utc(requests[i].date, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: (requests[i].process[0].userInfo.first_name + " " + requests[i].process[0].userInfo.last_name),
                    reqCategory: requests[i].type.name,
                    reqStatus: requests[i].type.code !== 15 ? requests[i].status.name : '',
                    reqOperation: operation(requests[i], requests[i].reqInfo !== undefined ? requests[i].reqInfo.serial_number : '')
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
    const viewModal = () =>{
        if(viewReqModal && (currentReqType === 4 || currentReqType === 9)){
            return <OfficeViewRequestM />
        }else if(viewReqModal && currentReqType === 2){
            return <WarehouseViewRequestM />
        }else if(viewReqModal && currentReqType === 14){
            return <ViewOverTime />
        }else if(viewReqModal && currentReqType === 1){
            return <ViewRequestM />
        }else{
            return null
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    {/* {menuPermission ? */}
                    <Fragment>
                        {localStorage.getItem("id") ?
                            <section>
                                {loading ?
                                    <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                                    :
                                    <Fragment>
                                        {/* <MyReqsFilter /> */}
                                        <MyReqsItem
                                            requests={reqsList}
                                            columns={columns}
                                            data={data}
                                            onSort={handleSort}
                                            fetchData={fetchData}
                                            loading={load}
                                            pageCount={pageCount}
                                        />
                                    </Fragment>
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
                </Col>
            </Row>

            {viewModal()}

        </Container>
    )
}

export default MyReqsList;