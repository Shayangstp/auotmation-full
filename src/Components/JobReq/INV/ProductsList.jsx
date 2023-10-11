import React, { useEffect, useMemo, useCallback, useRef, useState, useContext, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { selectLoading } from '../../Slices/mainSlices';
import ProItem from './ProItem';
import ProductsFilter from './ProductsFilter';
import { handleProductsList, selectProductsList } from '../../Slices/ceramicSlices';

const ProductsList = ({ setPageTitle }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const productsList = useSelector(selectProductsList);

    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(-1);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const columns = useMemo(
        () => [
            {
                Header: "گروه کالا",
                accessor: "proGroup",
                sort: true
            },
            {
                Header: "کد کالا",
                accessor: "proCode",
                sort: true
            },
            {
                Header: "اسم کالا",
                accessor: "proName",
                sort: true
            },
            {
                Header: "مشخصات فنی",
                accessor: "proTechInfo",
                sort: true
            }
        ]
    );
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    proGroup: requests[i].ItemGroupName,
                    proCode: requests[i].ItemCode,
                    proName: requests[i].ItemName,
                    proTechInfo: requests[i].ItemTechnicalInfo,
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
                    proGroup: requests[i].ItemGroupName,
                    proCode: requests[i].ItemCode,
                    proName: requests[i].ItemName,
                    proTechInfo: requests[i].ItemTechnicalInfo,
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
            itemGroupName: '', itemCode: '', itemName: '', itemTechnicalInfo: ''
        }
        dispatch(handleProductsList(filterValues));
    }, [])

    return (
        <Container fluid className='py-4'>
            <Fragment>
                <ProductsFilter/>
                {loading ?
                    <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                    :
                    <div>
                        <Button size='sm' variant='primary' className='mb-2' onClick={() => {
                            const filterValues = {
                                itemGroupName: '', itemCode: '', itemName: '', itemTechnicalInfo: ''
                            }
                            dispatch(handleProductsList(filterValues));
                        }}><FontAwesomeIcon icon={faArrowsRotate} className='me-2' />به روزرسانی</Button>
                        <ProItem
                            requests={productsList}
                            columns={columns}
                            data={data}
                            onSort={handleSort}
                            fetchData={fetchData}
                            loading={load}
                            pageCount={pageCount}
                        />
                    </div>
                }
            </Fragment>
        </Container>
    )
}

export default ProductsList;