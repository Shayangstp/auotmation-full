import React, { useEffect, useMemo, useCallback, useRef, useState, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BaseInfoItem from './BaseInfoItem';
import xssFilters from 'xss-filters';
import Loading from '../../Common/Loading';
import { selectLoading, selectUser } from '../../Slices/mainSlices';
import { useDispatch, useSelector } from 'react-redux';

const BaseInfoTable = ({ handleList, list, role }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const user = useSelector(selectUser);

    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const handleTableColumn = () => {
        if (role === 'operatingUnit') {
            return (
                () => [
                    {
                        Header: "نام واحد",
                        accessor: "listItem",
                        sort: true
                    }
                ]
            )
        } else if (role === 'changeUserRole') {
            return (() => [
                {
                    Header: "نام و نام خانوادگی",
                    accessor: "listItem",
                    sort: true
                }
            ])
        } else if(role === 'OperationRole'){
            return (() => [
                {
                    Header: "عملیات",
                    accessor: "listItem",
                    sort: true
                }
            ])
        } else if(role === 'OperatorRole'){
            return (() => [
                {
                    Header: "اپراتور",
                    accessor: "listItem",
                    sort: true
                }
            ])
        }else if(role === 'ReasonOfDelayRole'){
            return (() => [
                {
                    Header: "علت تاخیر",
                    accessor: "listItem",
                    sort: true
                }
            ])
        }
    }
    const columns = useMemo(
        handleTableColumn()
    );
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    listItem: xssFilters.inHTMLData(requests[i].label),
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
                    listItem: xssFilters.inHTMLData(requests[i].label),
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
        if (user.Location !== undefined) {
            // const filterValues = {
            //     memberId: '',
            // }
            dispatch(handleList(1));
        }
    }, [user])
    return (
        <Container fluid className='pb-4'>
            <Fragment>
                <Row>
                    <Col md='12'>
                        {/* <IranTolJobReqsFilter /> */}
                    </Col>
                </Row>
                <section className='position-relative'>
                    {loading ? <Loading /> : null}
                    <div>
                        <Fragment>
                            {/* <Button size='sm' variant='primary' className='mb-2' onClick={() => {
                                // const filterValues = {
                                //     memberId: '',
                                // }
                                dispatch(handleList(1));
                            }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی</Button> */}
                            <BaseInfoItem
                                requests={list}
                                columns={columns}
                                data={data}
                                onSort={handleSort}
                                fetchData={fetchData}
                                loading={load}
                                pageCount={pageCount}
                            />
                        </Fragment>
                    </div>
                </section>
            </Fragment>
        </Container>
    )
}

export default BaseInfoTable;