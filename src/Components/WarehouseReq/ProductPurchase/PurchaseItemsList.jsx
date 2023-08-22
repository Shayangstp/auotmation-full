import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import PurchaseItemsFilter from './PurchaseItemsFilter';
import { rootContext } from "../../context/rootContext";
import PurchaseReqItem from './PurchaseReqItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowsRotate, faHome, faWarning, faClockRotateLeft, faPenToSquare, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import Select from 'react-select';
import xssFilters from 'xss-filters';
import { useDispatch, useSelector } from 'react-redux';
import { handleReqsList, selectReqsList, handleCurrentReqInfo, handleUserInformation, handleUserImage, handleAllItems, selectUserInfoModal, selectLoading } from '../../Slices/mainSlices';
import { RsetCurrentReqItems, RsetCurrentReqItem, selectCurrentReqItems } from '../../Slices/currentReqSlice';
import { selectPurchaseItemModal, RsetPurchaseItemModal } from '../../Slices/purchaseSlice';
import UserInfoModal from '../../Modals/UserInfoModal';
import PurchaseItemModal from '../../Modals/WarehouseReqsModals/PurchaseItemModal';
import { selectPurchasedItemModal, RsetPurchasedItemModal } from '../../Slices/purchaseSlice';
import AddPurchasedItemInfoModal from '../../Modals/WarehouseReqsModals/AddPurchasedItemInfoModal';
import Loading from '../../Common/Loading';

const PurchaseItemsList = ({ setPageTitle }) => {
    const dispatch = useDispatch();
    const currentReqItems = useSelector(selectCurrentReqItems);
    const userInfoModal = useSelector(selectUserInfoModal);
    const purchaseItemModal = useSelector(selectPurchaseItemModal);
    const purchasedItemModal = useSelector(selectPurchasedItemModal);
    const loading = useSelector(selectLoading);

    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    useEffect(() => {
        setPageTitle('لیست آیتم های خرید');
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
                Header: "کد کالا",
                accessor: "reqInvCode",
                disableSortBy: false
            },
            {
                Header: "نام کالا",
                accessor: "reqInvName",
                disableSortBy: false
            },
            {
                Header: "تعداد/مقدار درخواستی",
                accessor: "reqAmount",
                disableSortBy: false
            },
            {
                Header: "واحد شمارش",
                accessor: "reqUnitName",
                disableSortBy: false
            },
            {
                Header: "اولویت درخواستی",
                accessor: "reqPriorityName",
                disableSortBy: false
            },
            {
                Header: "وضعیت آیتم",
                accessor: "reqStatus",
                disableSortBy: false
            },
            {
                Header: "تعداد/مقدار مورد تایید",
                accessor: "reqAcceptedAmount",
                disableSortBy: false
            },
            {
                Header: "اولویت مورد تایید",
                accessor: "reqAcceptedPriority",
                disableSortBy: false
            },
            {
                Header: "مامور خرید",
                accessor: "reqBuyer",
                disableSortBy: false
            },
            {
                Header: "عملیات",
                accessor: "reqOperation",
                disableSortBy: true
            }
        ]
    );
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
        if (request.lastActionCode === 26 && request.lastToPersons.split(',').some(person => person === localStorage.getItem('id'))) {
            return (
                <div className="d-flex align-items-center justify-content-center">
                    <Button size="sm" title='ارسال' className='btn btn-primary' onClick={() => {
                        dispatch(RsetCurrentReqItem(request));
                        dispatch(RsetPurchaseItemModal(true));
                    }}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            )
        } else if (request.lastActionCode === 27 && request.lastToPersons.split(',').some(person => person === localStorage.getItem('id'))) {
            return (
                <div className="d-flex align-items-center justify-content-center">
                    <Button size="sm" title='ارسال' className='btn btn-success' onClick={() => {
                        dispatch(RsetCurrentReqItem(request));
                        dispatch(RsetPurchasedItemModal(true));
                    }}>
                        <FontAwesomeIcon icon={faDollarSign} />
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
                    reqSerial: xssFilters.inHTMLData(requests[i].serial),
                    reqDate: moment.utc(requests[i].createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: userInfo(requests[i]),
                    reqInvCode: xssFilters.inHTMLData(requests[i].invCode),
                    reqInvName: xssFilters.inHTMLData(requests[i].invName),
                    reqAmount: xssFilters.inHTMLData(requests[i].itemAmount),
                    reqUnitName: xssFilters.inHTMLData(requests[i].itemUnitName),
                    reqPriorityName: xssFilters.inHTMLData(requests[i].itemPriorityName),
                    reqStatus: xssFilters.inHTMLData(requests[i].statusName),
                    reqAcceptedAmount: requests[i].acceptedAmount !== null ? xssFilters.inHTMLData(requests[i].acceptedAmount) : '',
                    reqAcceptedPriority: requests[i].acceptedPriorityName !== null ? xssFilters.inHTMLData(requests[i].acceptedPriorityName) : '',
                    reqBuyer: requests[i].buyerName !== null ? xssFilters.inHTMLData(requests[i].buyerName) : '',
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
                    reqSerial: xssFilters.inHTMLData(requests[i].serial),
                    reqDate: moment.utc(requests[i].createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'),
                    reqUser: userInfo(requests[i]),
                    reqInvCode: xssFilters.inHTMLData(requests[i].invCode),
                    reqInvName: xssFilters.inHTMLData(requests[i].invName),
                    reqAmount: xssFilters.inHTMLData(requests[i].itemAmount),
                    reqUnitName: xssFilters.inHTMLData(requests[i].itemUnitName),
                    reqPriorityName: xssFilters.inHTMLData(requests[i].itemPriorityName),
                    reqStatus: xssFilters.inHTMLData(requests[i].statusName),
                    reqAcceptedAmount: requests[i].acceptedAmount !== null ? xssFilters.inHTMLData(requests[i].acceptedAmount) : '',
                    reqAcceptedPriority: requests[i].acceptedPriorityName !== null ? xssFilters.inHTMLData(requests[i].acceptedPriorityName) : '',
                    reqBuyer: requests[i].buyerName !== null ? xssFilters.inHTMLData(requests[i].buyerName) : '',
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
            memberId: '',
            serial: '',
            invCode: '',
            status: '',
            fromDate: 'null',
            toDate: 'null',
        }
        dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
    }, [])

    return (
        <Container fluid className='pb-4'>
            {/* {menuPermission ? */}
            <Fragment>
                <Row>
                    <Col md='12'>
                        <PurchaseItemsFilter />
                    </Col>
                </Row>
                <div className="position-relative">
                    {loading ? <Loading /> : <Fragment>
                        <Button size='sm' variant='primary' className='mb-2' onClick={() => {
                            const filterValues = {
                                memberId: '',
                                serial: '',
                                invCode: '',
                                status: '',
                                fromDate: 'null',
                                toDate: 'null',
                            }
                            dispatch(handleAllItems({ typeId: 9, filterValues: filterValues }));
                        }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی جدول</Button>
                        <PurchaseReqItem
                            requests={currentReqItems}
                            columns={columns}
                            data={data}
                            onSort={handleSort}
                            fetchData={fetchData}
                            loading={load}
                            pageCount={pageCount}
                        />
                        {userInfoModal && <UserInfoModal />}
                        {purchaseItemModal && <PurchaseItemModal />}
                        {purchasedItemModal && <AddPurchasedItemInfoModal />}
                    </Fragment>}
                </div>
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

export default PurchaseItemsList;