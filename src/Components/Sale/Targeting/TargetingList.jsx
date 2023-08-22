import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TargetingFilter from "./TargetingFilter";
import TargetingItem from "./TargetingItem";
import { selectTargetingList } from "../../Slices/saleSlices";

const TargetingList = () => {
    const dispatch = useDispatch();
    const targetingList = useSelector(selectTargetingList);

    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const columns = useMemo(
        () => [
            {
                Header: "طبقه محصول",
                accessor: "groupname1",
                sort: true
            },
            {
                Header: "گروه محصول",
                accessor: "groupname2",
                sort: true
            },
            {
                Header: "میزان محصول 1399",
                accessor: "productamount1399",
                sort: true
            },
            {
                Header: "میزان محصول 1400",
                accessor: "productamount1400",
                sort: true
            },
            {
                Header: "میزان محصول 1401",
                accessor: "productamount1401",
                sort: true
            },
            {
                Header: "میزان محصول 1402",
                accessor: "productamount1402",
                sort: false
            },
            {
                Header: "هدف محصول 1402",
                accessor: "productgoal1402",
                sort: false
            }
        ]
    );
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    groupname1: requests[i].groupname1,
                    groupname2: requests[i].groupname2,
                    productamount1399: requests[i].productamount1399,
                    productamount1400: requests[i].productamount1400,
                    productamount1401: requests[i].productamount1401,
                    productamount1402: requests[i].productamount1402,
                    productgoal1402: requests[i].productgoal1402,
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
                    groupname1: requests[i].groupname1,
                    groupname2: requests[i].groupname2,
                    productamount1399: requests[i].productamount1399,
                    productamount1400: requests[i].productamount1400,
                    productamount1401: requests[i].productamount1401,
                    productamount1402: requests[i].productamount1402,
                    productgoal1402: requests[i].productgoal1402,
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

    return (
        <Container fluid>
            <TargetingFilter />
            {targetingList.length !== undefined && targetingList.length !== 0
                ?
                <TargetingItem
                    requests={targetingList}
                    columns={columns}
                    data={data}
                    onSort={handleSort}
                    fetchData={fetchData}
                    loading={load}
                    pageCount={pageCount}
                />
                : null}
        </Container>
    )
}

export default TargetingList;