import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import PurchaseItemsFilter from './PurchaseItemsFilter';
import { rootContext } from "../../context/rootContext";
import PurchaseReqItem from './PurchaseReqItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowsRotate, faSpinner, faHome, faWarning, faClockRotateLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import Select from 'react-select';
import xssFilters from 'xss-filters';
import { useDispatch, useSelector } from 'react-redux';
import { handleReqsList, selectReqsList, handleCurrentReqInfo, handleUserInformation, handleUserImage, handleAllItems, selectUserInfoModal } from '../../Slices/mainSlices';
import { RsetCurrentReqItems, RsetCurrentReqItem, selectCurrentReqItems } from '../../Slices/currentReqSlice';
import { selectPurchaseItemModal, RsetPurchaseItemModal } from '../../Slices/purchaseSlice';
import UserInfoModal from '../../Modals/UserInfoModal';
import PurchaseItemModal from '../../Modals/WarehouseReqsModals/PurchaseItemModal';

const WarehouseItemsList = ({ setPageTitle, loading, setLoading }) => {
    const dispatch = useDispatch();
    const currentReqItems = useSelector(selectCurrentReqItems);
    const userInfoModal = useSelector(selectUserInfoModal);
    const purchaseItemModal = useSelector(selectPurchaseItemModal)
    const mainContext = useContext(rootContext);
    const {
        // handleCheckPermission,
        // menuPermission,
    } = mainContext;
    useEffect(() => {
        // handleCheckPermission(localStorage.getItem('lastLocation'));
    }, [])

    useEffect(() => {
        setPageTitle('لیست آیتم های انبار');
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
                    reqBuyer:requests[i].buyerName !== null ? xssFilters.inHTMLData(requests[i].buyerName) : '',
                    reqOperation: requests[i].lastActionCode === 26 && requests[i].lastToPersons.split(',').some(person => person === localStorage.getItem('id')) ? operation(requests[i]) : null
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
                    reqBuyer:requests[i].buyerName !== null ? xssFilters.inHTMLData(requests[i].buyerName) : '',
                    reqOperation: requests[i].lastActionCode === 26 && requests[i].lastToPersons.split(',').some(person => person === localStorage.getItem('id')) ? operation(requests[i]) : null
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
        <Container fluid className='py-4'>
            {/* {menuPermission ? */}
            <Fragment>
                <section>
                    {loading ?
                        <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                        :
                        <div>
                            <Row>
                                <Col md='12'>
                                    <PurchaseItemsFilter />
                                </Col>
                            </Row>
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
                            }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی</Button>
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

export default WarehouseItemsList;