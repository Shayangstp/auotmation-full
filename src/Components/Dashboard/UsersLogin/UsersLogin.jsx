import React, { useState, useRef, useMemo, useCallback, useEffect} from "react";
import { Container } from "react-bootstrap";
import UsersLoginItem from "./UsersLoginItem";
import { getUsersLogin } from "../../../Services/rootServices";

const UsersLogin = ({setPageTitle}) => {
    useEffect(()=>{
        setPageTitle('ورود کاربران');
        handleUsersLogin();
    }, [])

    const [usersLogin, setUsersLogin] = useState([]);
    const handleUsersLogin = async () => {
        try {
            const {data} = await getUsersLogin();
            setUsersLogin(data)
        } catch (ex) {
            console.log(ex)
        }
    }
    const [data, setData] = useState([]);
    const [load, setload] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const sortIdRef = useRef(0);
    const columns = useMemo(
        () => [
            {
                Header: "نام و نام خانوادگی",
                accessor: "userFullName",
                sort: true
            },
            {
                Header: "تاریخ ورود",
                accessor: "loginDate",
                sort: true
            },
        ]
    );
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    userFullName: requests[i].first_name + " " + requests[i].last_name,
                    loginDate: requests[i].date,
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
                    userFullName: requests[i].first_name + " " + requests[i].last_name,
                    loginDate: requests[i].date,
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
        <Container fluid className='py-4'>
            <UsersLoginItem
                requests={usersLogin}
                columns={columns}
                data={data}
                onSort={handleSort}
                fetchData={fetchData}
                loading={load}
                pageCount={pageCount}
            />
        </Container>
    )
}

export default UsersLogin;