import React, { useState, useRef, useMemo, useCallback } from 'react';
import PaySlipReportItem from './PaySlipReportItem';
import { selectPaySlipReport, selectPaySlipReportField } from '../../../Slices/financialSlices';
import { useSelector } from 'react-redux';

const PaySlipReportTable = () => {
    const paySlipReport = useSelector(selectPaySlipReport);
    const paySlipReportField = useSelector(selectPaySlipReportField);
    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const handleFieldColumns = () => {
        var columns = [
            {
                Header: "نام و نام خانوادگی",
                accessor: "userName",
                sort: true
            },
            {
                Header: "محل خدمت",
                accessor: "userCompany",
                sort: true
            },
            {
                Header: "دفتر/ کارخانه",
                accessor: "userLocation",
                sort: true
            },
            {
                Header: "تاریخ",
                accessor: "repDate",
                sort: true
            },
        ];
        paySlipReportField.map(field=>{
            columns.push(
                {
                    Header: field.label,
                    accessor: field.value,
                    sort: true
                }
            )
        })
        return () => columns
    }
    const columns = useMemo(
        handleFieldColumns()
    );
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    userName: requests[i].fullName,
                    userCompany: requests[i].companyName,
                    userLocation: requests[i].location,
                    repDate: requests[i].dateMonth,
                }
                paySlipReportField.map(field=>{
                    tableItem[field.value] = requests[i][field.value]
                })
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
                    userName: requests[i].fullName,
                    userCompany: requests[i].companyName,
                    userLocation: requests[i].location,
                    repDate: requests[i].dateMonth,
                }
                paySlipReportField.map(field=>{
                    tableItem[field.value] = requests[i][field.value]
                })
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
        <PaySlipReportItem
            requests={paySlipReport}
            columns={columns}
            data={data}
            onSort={handleSort}
            fetchData={fetchData}
            loading={load}
            pageCount={pageCount}
        />
    )
}

export default PaySlipReportTable;