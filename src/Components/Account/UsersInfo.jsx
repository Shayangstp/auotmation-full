import React, { useState, useRef, useMemo, useCallback, useEffect, useContext } from "react";
import moment from "moment-jalaali";
import { Container, Row, Col, Tabs, Tab, Button, Modal } from "react-bootstrap";
import UsersReq from "./UsersRequests";
import { getUsersByFilter, acceptUserInfo, rejectUserInfo, updateProfile } from '../../Services/accountService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCircleUser, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from "react-redux";
import { handleUserImage, selectUserImage } from '../Slices/mainSlices';

import { rootContext } from "../context/rootContext";
import { errorMessage, successMessage } from './../../utils/message';


const UsersInfo = ({ setPageTitle }) => {
    const dispatch = useDispatch();
    const userImage = useSelector(selectUserImage);

    const mainContext = useContext(rootContext);
    const {
        loading,
        setLoading,
    } = mainContext;

    useEffect(() => {
        setPageTitle('اطلاعات کاربران');
        handleNotApprovedAvatars();
    }, [])

    const [initialState, setinitialState] = useState({ hiddenColumns: ["userStatus"] })
    const [activeTab, setActiveTab] = useState('notApprovedAvatars');
    const handleTabSelect = (key) => {
        if (key === 'allUsers') {
            handleGetAllUsers();
        } else if (key === 'approvedUsers') {
            handleGetAllApprovedUsers();
        } else if (key === 'notApprovedUsers') {
            handleNotApprovedUsers();
        } else if (key === 'notApprovedAvatars') {
            handleNotApprovedAvatars();
        }
    }

    const [allUsersInfo, setAllUsersInfo] = useState([]);
    const handleGetAllUsers = async () => {
        setLoading(true);
        try {
            setinitialState({ hiddenColumns: ["userOperation", "userRegisterDate"] });
            const usersReqRes = await getUsersByFilter('all');
            if(usersReqRes.data.code === 415){
                setAllUsersInfo(usersReqRes.data.list);
                setLoading(false);
            }else{
                errorMessage('خطا در دریافت لیست کاربران!');
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }

    const [allApprovedUsersInfo, setAllApprovedUsersInfo] = useState([]);
    const handleGetAllApprovedUsers = async () => {
        setLoading(true);
        try {
            setinitialState({ hiddenColumns: ["userOperation", "userRegisterDate", "userStatus"] });
            const usersReqRes = await getUsersByFilter('approved');
            if(usersReqRes.data.code === 415){
                setAllApprovedUsersInfo(usersReqRes.data.list);
                setLoading(false);
            }else{
                errorMessage('خطا در دریافت لیست کاربران!');
                setLoading(false);
            }
            
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }

    const [currentRequest, setCurrentRequest] = useState({});
    const handleGetCurrentRequest = request => {
        setCurrentRequest(request);
    }
    const [usersRequests, setUsersRequests] = useState([]);
    const handleNotApprovedUsers = async () => {
        setLoading(true);
        try {
            setinitialState({ hiddenColumns: ["userStatus"] });
            const usersReqRes = await getUsersByFilter('notApproved');
            if(usersReqRes.data.code === 415){
                setUsersRequests(usersReqRes.data.list);
                setLoading(false);
            }else{
                errorMessage('خطا در دریافت لیست کاربران!');
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
        }
    }

    const [avatarRequests, setAvatarRequests] = useState([]);
    const handleNotApprovedAvatars = async () => {
        setLoading(true);
        try {
            setinitialState({ hiddenColumns: ["userStatus"] });
            const usersReqRes = await getUsersByFilter('notApprovedPhoto');
            if(usersReqRes.data.code === 415){
                setAvatarRequests(usersReqRes.data.list);
                setLoading(false);
            }else{
                errorMessage('خطا در دریافت لیست کاربران!');
                setLoading(false);
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
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
                id: "userAvatar",
                Header: "تصویر پروفایل",
                accessor: "userAvatar",
                sort: false
            },
            {
                id: "userFullName",
                Header: "نام و نام خانوادگی",
                accessor: "userFullName",
                sort: true
            },
            {
                id: "userCompany",
                Header: "شرکت",
                accessor: "userCompany",
                sort: true
            },
            {
                id: "userDep",
                Header: "واحد سازمانی",
                accessor: "userDep",
                sort: true
            },
            {
                id: "userSup",
                Header: "سرپرست",
                accessor: "userSup",
                sort: true
            },
            {
                id: "userLocal",
                Header: "داخلی",
                accessor: "userLocal",
                sort: true
            },
            {
                id: "userRegisterDate",
                Header: "تاریخ ثبت نام",
                accessor: "userRegisterDate",
                sort: true
            },
            {
                id: "userStatus",
                Header: "وضعیت کاربر",
                accessor: "userStatus",
                sort: true
            },
            {
                id: "userOperation",
                Header: "عملیات",
                accessor: "userOperation",
                sort: false,
            }
        ]
    );

    const avatar = (type, photo) => {
        if (type === '' || photo === '') {
            return (
                <div className="d-flex justify-content-center">
                    <FontAwesomeIcon icon={faCircleUser} className="font50 text-secondary" />
                </div>
            )
        } else {
            return (
                <div className="d-flex justify-content-center">
                    <img width='50px' height='50px' className='rounded-circle' alt='userAvatar' src={'data:' + type + ';base64,' + photo} />
                </div>
            )
        }
    }
    const operation = (reqItem) => {
        return (
            <Button
                title='ویرایش'
                className='btn btn-primary d-flex align-items-center'
                size="sm"
                active
                onClick={() => { setModal(true); handleGetCurrentRequest(reqItem); dispatch(handleUserImage({userId: reqItem.id, status: 0})); }}
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
        )
    }
    const fetchData = useCallback(({ pageSize, pageIndex, requests }) => {
        var tableItems = [];
        if (requests.length !== 0) {
            for (var i = 0; i < requests.length; i++) {
                var tableItem = {
                    userAvatar: '',
                    userFullName: requests[i].FullName,
                    userRegisterDate: '',
                    userCompany: requests[i].Company,
                    userDep: requests[i].Department,
                    userSup: requests[i].Supervisor,
                    userStatus: requests[i].Approved === false ? 'تایید نشده' : 'تایید شده',
                    userLocal: requests[i].LocalPhone,
                    userOperation: operation(requests[i])
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
                    userAvatar: '',
                    userFullName: requests[i].FullName,
                    userRegisterDate: '',
                    userCompany: requests[i].Company,
                    userDep: requests[i].Department,
                    userSup: requests[i].Supervisor,
                    userStatus: requests[i].Approved === false ? 'تایید نشده' : 'تایید شده',
                    userLocal: requests[i].LocalPhone,
                    userOperation: operation(requests[i])
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
    const [modal, setModal] = useState(false);

    const [isAdmin, setIsAdmin] = useState(currentRequest.isAdmin);
    const handleAcceptUSerInfo = async () => {
        try {
            const approved = { approved: true, admin: isAdmin }
            const res = await acceptUserInfo(currentRequest._id, approved);
            setModal(false);
            handleNotApprovedUsers();
        } catch (ex) {
            console.log(ex)
        }
    }
    const handleRejectUserInfo = async () => {
        try {
            const approved = { approved: false }
            const res = await rejectUserInfo(currentRequest._id, approved);
            setModal(false);
            handleNotApprovedUsers();
        } catch (ex) {
            console.log(ex)
        }
    }
    return (
        <Container fluid className='pb-4'>
            <Row>
                <Col>
                    <Tabs defaultActiveKey={"notApprovedAvatars"} id="users-tab" onSelect={(e) => { handleTabSelect(e); setActiveTab(e) }} className="justify-content-center mb-5">
                        <Tab eventKey={"notApprovedAvatars"} title="آواتارهای تایید نشده">
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                                : activeTab === 'notApprovedAvatars' && avatarRequests.length !== 0 ?
                                    <section>
                                        {modal ?
                                            <Modal
                                                aria-labelledby="contained-modal-title-vcenter"
                                                centered
                                                backdrop="static"
                                                show={modal}
                                                onHide={() => {
                                                    setModal(false);
                                                }}
                                                dialogClassName="modal-96w"
                                                scrollable={true}
                                            >
                                                <Modal.Header className='d-block bg-primary text-white'>
                                                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                                                        <span>اطلاعات کاربر</span>
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <ul className='list-unstyled'>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>نام و نام خانوادگی:</span>
                                                            <span>{currentRequest.FullName}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>کدملی:</span>
                                                            <span>{currentRequest.UserName}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>تاریخ تولد:</span>
                                                            <span>{moment.utc(currentRequest.BirthDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>ایمیل:</span>
                                                            <span>{currentRequest.Email}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>شماره موبایل:</span>
                                                            <span>{currentRequest.MobileNo}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>شماره داخلی:</span>
                                                            <span>{currentRequest.LocalPhone}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>َشرکت:</span>
                                                            <span>{currentRequest.Company}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>واحد سازمانی:</span>
                                                            <span>{currentRequest.Department}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>سرپرست:</span>
                                                            <span>{currentRequest.Supervisor}</span>
                                                        </li>
                                                        {/* <li className="d-flex align-items-center">
                                                            <input type='checkbox' name='isAdmin' value={currentRequest.isAdmin} defaultChecked={currentRequest.isAdmin} onChange={(e) => {
                                                                e.persist();
                                                                (async () => { await setIsAdmin(e.target.checked); })();
                                                            }}
                                                            />
                                                            <label className='ms-2 font12 mb-0'> سرپرست </label>
                                                        </li> */}
                                                        <div className="d-flex justify-content-center">
                                                            {userImage === ''
                                                                ?<FontAwesomeIcon icon={faSpinner} className='spinner font60' />
                                                                :<img className='img-fluid' alt='userAvatar' width='500' height='500' src={userImage} />
                                                            }
                                                        </div>
                                                    </ul>
                                                </Modal.Body>
                                                <Modal.Footer className="justify-content-between">
                                                    <Button variant="success" onClick={async () => {
                                                        const { data } = await updateProfile(currentRequest.id, 'profilePhoto', 'accepted');
                                                        if (data.code === 415) {
                                                            successMessage('عملیات انجام شد!')
                                                            setModal(false);
                                                            handleNotApprovedAvatars();
                                                        }else{
                                                            errorMessage('خطا!')
                                                        }
                                                    }}>تایید اطلاعات</Button>
                                                    <Button variant="danger" onClick={async () => {
                                                        const { data } = await updateProfile(currentRequest.id, 'profilePhoto', 'rejected');
                                                        if (data.code === 415) {
                                                            successMessage('عملیات انجام شد!')
                                                            setModal(false);
                                                            handleNotApprovedAvatars();
                                                        }else{
                                                            errorMessage('خطا!')
                                                        }
                                                    }}>عدم تایید اطلاعات</Button>
                                                    <Button variant="secondary" onClick={() => setModal(false)}>بستن</Button>
                                                </Modal.Footer>
                                            </Modal>
                                            : null}
                                        <UsersReq
                                            requests={avatarRequests}
                                            columns={columns}
                                            data={data}
                                            initialState={initialState}
                                            onSort={handleSort}
                                            fetchData={fetchData}
                                            loading={load}
                                            pageCount={pageCount}
                                        />
                                    </section>
                                    : null}
                        </Tab>
                        <Tab eventKey={"notApprovedUsers"} title="کاربران تایید نشده">
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                                : activeTab === 'notApprovedUsers' && usersRequests.length !== 0 ?
                                    <section>
                                        {modal ?
                                            <Modal
                                                aria-labelledby="contained-modal-title-vcenter"
                                                centered
                                                backdrop="static"
                                                show={modal}
                                                onHide={() => {
                                                    setModal(false);
                                                }}
                                                dialogClassName="modal-96w"
                                                scrollable={true}
                                            >
                                                <Modal.Header className='d-block bg-primary text-white'>
                                                    <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-between">
                                                        <span>اطلاعات کاربر</span>
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <ul className='list-unstyled'>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>نام و نام خانوادگی:</span>
                                                            <span>{(currentRequest.gender === 'آقا' ? 'آقای' : currentRequest.gender) + ' ' + currentRequest.first_name + ' ' + currentRequest.last_name}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>کدملی:</span>
                                                            <span>{currentRequest.user_name}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>تاریخ تولد:</span>
                                                            <span>{moment.utc(currentRequest.birthdate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>ایمیل:</span>
                                                            <span>{currentRequest.email}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>شماره موبایل:</span>
                                                            <span>{currentRequest.phone_number}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>شماره داخلی:</span>
                                                            <span>{currentRequest.local_phone}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>واحد سازمانی:</span>
                                                            <span>{currentRequest.department}</span>
                                                        </li>
                                                        <li className='mb-3'>
                                                            <span className='fw-bold me-2'>سرپرست:</span>
                                                            <span>{(currentRequest.supervisor.gender === 'آقا' ? 'آقای' : currentRequest.supervisor.gender) + ' ' + currentRequest.supervisor.first_name + ' ' + currentRequest.supervisor.last_name}</span>
                                                        </li>
                                                        <li className="d-flex align-items-center">
                                                            <input type='checkbox' name='isAdmin' value={currentRequest.isAdmin} defaultChecked={currentRequest.isAdmin} onChange={(e) => {
                                                                e.persist();
                                                                (async () => { await setIsAdmin(e.target.checked); })();
                                                            }}
                                                            />
                                                            <label className='ms-2 font12 mb-0'> سرپرست </label>
                                                        </li>
                                                    </ul>
                                                </Modal.Body>
                                                <Modal.Footer className="justify-content-between">
                                                    <Button variant="success" onClick={handleAcceptUSerInfo}>تایید اطلاعات</Button>
                                                    <Button variant="danger" onClick={handleRejectUserInfo}>عدم تایید اطلاعات</Button>
                                                    <Button variant="secondary" onClick={() => setModal(false)}>بستن</Button>
                                                </Modal.Footer>
                                            </Modal>
                                            : null}
                                        <UsersReq
                                            requests={usersRequests}
                                            columns={columns}
                                            data={data}
                                            initialState={initialState}
                                            onSort={handleSort}
                                            fetchData={fetchData}
                                            loading={load}
                                            pageCount={pageCount}
                                        />
                                    </section>
                                    : null}
                        </Tab>
                        <Tab eventKey={"approvedUsers"} title="کاربران تایید شده">
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                                : activeTab === 'approvedUsers' && allApprovedUsersInfo.length !== 0 ?
                                    <UsersReq
                                        requests={allApprovedUsersInfo}
                                        columns={columns}
                                        data={data}
                                        initialState={initialState}
                                        onSort={handleSort}
                                        fetchData={fetchData}
                                        loading={load}
                                        pageCount={pageCount}
                                    />
                                    : null}
                        </Tab>
                        <Tab eventKey={"allUsers"} title="کلیه کاربران">
                            {loading ?
                                <div className="d-flex justify-content-center"><FontAwesomeIcon icon={faSpinner} className='spinner font60' /></div>
                                : activeTab === 'allUsers' && allUsersInfo.length !== 0 ?
                                    <UsersReq
                                        requests={allUsersInfo}
                                        columns={columns}
                                        data={data}
                                        initialState={initialState}
                                        onSort={handleSort}
                                        fetchData={fetchData}
                                        loading={load}
                                        pageCount={pageCount}
                                    />
                                    : null}
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    )
}

export default UsersInfo;