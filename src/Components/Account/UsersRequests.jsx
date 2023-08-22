import React, { useEffect } from "react";
import { Table, Row, Col, Button } from "react-bootstrap";
import {useTable, useSortBy, usePagination} from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faAngleDoubleLeft, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const UsersRequests = ({columns, data, initialState, onSort, fetchData, loading, pageCount: controlledPageCount, requests}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, sortBy }
    } = useTable(
        {
            columns,
            data,
            initialState,
            manualPagination: true,
            manualSortBy: true,
            autoResetPage: false,
            autoResetSortBy: false,
            pageCount: controlledPageCount
        },
        useSortBy,
        usePagination
    );

    useEffect(()=>{
        gotoPage(0)
    },[requests])
    
    useEffect(() => {
        if (requests.length !== 0) {
          fetchData({ pageIndex, pageSize, requests });
          onSort({ sortBy, pageIndex, pageSize, requests });
        }
    }, [onSort, sortBy, fetchData, pageIndex, pageSize, requests]);

    return(
        <section>
            <Table striped bordered hover responsive size="sm" variant="light" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th className="bg-secondary text-white fw-normal" {...column.getHeaderProps(column.getSortByToggleProps())} title='' /*title={`مرتب سازی براساس ${column.render("Header")}`} */>
                            {column.render("Header")}
                            <span>
                                {column.isSorted
                                ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
                                : ""}
                            </span>
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, index) => {
                            return (
                                <td key={index}>{cell.render("Cell")}</td>
                            );
                            })}
                        </tr>
                        );
                    })}
                    <tr>
                        {loading ? (
                            <td colSpan="10000">Loading...</td>
                            ) : (
                            <td colSpan="10000">
                                نمایش {page.length} از ~{controlledPageCount * pageSize}{" "}
                                نتیجه
                            </td>
                        )}
                    </tr>
                </tbody>
            </Table>
            <Row>
                <Col lg='9' xl='8' className="mx-auto">
                <div className="row pagination justify-content-center align-items-center">
                    <div className="col-12 col-md-2">
                    <select
                        className="form-control py-1 px-2"
                        value={pageSize}
                        onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            نمایش {pageSize}
                        </option>
                        ))}
                    </select>
                    </div>
                    <div className="col-12 col-md-4 d-flex align-items-center justify-content-around">
                    برو به صفحه:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        gotoPage(page);
                        }}
                        className="form-control w-50 py-1 px-2"
                    />{" "}
                    </div>
                    <div className="col-12 col-md-2">
                    صفحه{" "}
                    <strong>
                        {pageIndex + 1} از {pageOptions.length}
                    </strong>{" "}
                    </div>
                    <div className="col-12 col-md-4">
                        <Button variant="outline-secondary" className="fw-bold py-0" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </Button>{" "}
                        <Button variant="outline-secondary" className="fw-bold py-0" onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Button>{" "}
                        <Button variant="outline-secondary" className="fw-bold py-0" onClick={() => nextPage()} disabled={!canNextPage}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Button>{" "}
                        <Button variant="outline-secondary" className="fw-bold py-0" onClick={() => gotoPage(controlledPageCount - 1)} disabled={!canNextPage}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                        </Button>{" "}
                    </div>
                </div>
                </Col>
            </Row>
        </section>
    )
}

export default UsersRequests;