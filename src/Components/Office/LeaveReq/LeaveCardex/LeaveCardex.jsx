import react, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Col, Container, Row, Alert } from 'react-bootstrap';
import moment from 'moment-jalaali';
import xssFilters from 'xss-filters';
import LeaveCardexItem from './LeaveCardexItem';
import LeaveCardexFilter from './LeaveCardexFilter';

const LeaveCardex = ({setPageTitle}) => {

    useEffect(() => {
        setPageTitle('کاردکس مرخصی');
    }, [setPageTitle])

    const [tableData, setTableData] = useState([
        {date:'1402/01/01', type1:'روزانه', type2:'استحقاقی', time:'18', balance:'18', kasr:'اضافه', description: 'مرخصی ماهانه فروردین'},
        {date:'1402/01/08', type1:'ساعتی', type2:'استحقاقی', time:'2', balance:'16', kasr:'کسر', description: ''},
        {date:'1402/02/01', type1:'روزانه', type2:'استحقاقی', time:'18', balance:'34', kasr:'اضافه', description: 'مرخصی ماهانه اردیبهشت'},
        {date:'1402/02/05', type1:'روزانه', type2:'استحقاقی', time:'16', balance:'50', kasr:'اضافه', description: 'به علت تغییر شیفت'},
        {date:'1402/02/15', type1:'روزانه', type2:'استحقاقی', time:'8', balance:'42', kasr:'کسر', description: ''},
        {date:'1402/02/27', type1:'روزانه', type2:'استحقاقی', time:'8', balance:'34', kasr:'کسر', description: ''},
        {date:'1402/03/01', type1:'روزانه', type2:'استحقاقی', time:'18', balance:'52', kasr:'اضافه', description: 'مرخصی ماهانه خرداد'},
    ]);

    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const columns = useMemo(
        () => [
            {
                Header: "تاریخ",
                accessor: "date",
                sort: true
            },
            {
                Header: "نوع مرخصی",
                accessor: "type1",
                sort: true
            },
            {
                Header: "نوع مرخصی",
                accessor: "type2",
                sort: true
            },
            {
                Header: "ساعت اضافه / کسر شده",
                accessor: "time",
                sort: true
            },
            {
                Header: "مانده لحظه ای",
                accessor: "balance",
                sort: true
            },
            {
                Header: "اضافه / کسر",
                accessor: "kasr",
                sort: true
            },
            {
                Header: "توضیحات",
                accessor: "description",
                sort: true
            }
        ]
    );
    const fetchData = useCallback(({ pageSize, pageIndex, tableData }) => {
        var tableItems = [];
        if (tableData.length !== 0) {
            for (var i = 0; i < tableData.length; i++) {
                var tableItem = {
                    date: tableData[i].date,
                    type1: tableData[i].type1,
                    type2: tableData[i].type2,
                    time: tableData[i].time,
                    balance: tableData[i].balance,
                    kasr: tableData[i].kasr,
                    description: tableData[i].description
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
    const handleSort = useCallback(({ sortBy, pageIndex, pageSize, tableData }) => {
        var tableItems = [];
        if (tableData.length !== 0) {
            for (var i = 0; i < tableData.length; i++) {
                var tableItem = {
                    date: tableData[i].date,
                    type1: tableData[i].type1,
                    type2: tableData[i].type2,
                    time: tableData[i].time,
                    balance: tableData[i].balance,
                    kasr: tableData[i].kasr,
                    description: tableData[i].description
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
            <LeaveCardexFilter/>
            <Row>
                <Col className='mb-3'>
                    <div className='border rounded bg-white mb-3'>
                        مرخصی استحقاقی : 18 ساعت
                    </div>
                    <Alert variant="info">
                        <Alert.Heading className="d-flex align-items-center">
                            <span>مقدار کل مرخصی تا پایان سال <span className="fw-bold font18">204</span> ساعت می باشد.</span>
                        </Alert.Heading>
                    </Alert>
                </Col>
                <Col className='mb-3'>
                    <div className='border rounded bg-white mb-3'>
                        مانده مرخصی : 4 ساعت و 30 دقیقه
                    </div>
                    <Alert variant="danger">
                        <Alert.Heading className="d-flex align-items-center">
                            <span>مقدار کل مرخصی تا پایان سال <span className="fw-bold font18">204</span> ساعت می باشد.</span>
                        </Alert.Heading>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <LeaveCardexItem
                        tableData={tableData}
                        columns={columns}
                        data={data}
                        onSort={handleSort}
                        fetchData={fetchData}
                        loading={load}
                        pageCount={pageCount}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default LeaveCardex;