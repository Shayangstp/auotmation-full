
import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap'
import '../AdminPanel/design.css'
import User from './User'
import { apContext } from '../context/AdminPanel/apContext';
import Access from './Access';;

function AdminPanel() {
    const adminContext = useContext(apContext);
    const {
        handleAllAccess,
        handleAllUsernames,
        adminUsers,
        adminUser,
        setAdminUser,
        handleFormSubmit,
        accessData,
        handleCancleButton,
        makeJsonFile,
        searchItems,
        searchInput,
        setSearchInput,
        filteredResults,
        setFilteredResults,
        adminAccess,
        setAdminAccess,
        searchTree,
        accessMenu,
        setAccessMenu,
        getNestedChildren,
        filteringAccess,
        levelAccess,
        setLevelAccess,
        handleUserPermissions,
        checkUserPerms,
        userIds,
        numOfUsers,
        setNumOfUsers,
        prevAccess,
        getUserID,
        deleteObj,
    } = adminContext;


    useEffect(() => {
        handleAllUsernames();
        handleAllAccess();
    }, [])

    useEffect(() => {
        if(numOfUsers == 1){
            checkUserPerms()
        }
    }, [numOfUsers])

 

    // useEffect(() => {
    //     // const data = getNestedChildren(adminAccess, "631dcc3239ddb87a079a3a33");
    //     // setAccessMenu(data)
    // }, [adminAccess])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Tabs defaultActiveKey={"page1"} className='mb-4 mx-3'>
                            <Tab eventKey={"page1"} title="صفحه اول" className="justify-content-center mb-5">
                                <Container fluid className=" darkBlue-text">
                                    <Row>
                                        <Col md='4 '>
                                            <div>
                                                <div className="input-group sticky-top mb-3">
                                                    <span className="input-group-text">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                        </svg>
                                                    </span>
                                                    <input className="search-users form-control p-2 " name='searchInput' type="text" placeholder="سرچ کنید ..." onChange={(e) => searchItems(e.target.value)}></input>
                                                </div>
                                            </div>
                                            <div className="list-of-users bg-white overflow-scroll mb-3 rounded">
                                                <div className='d-flex gap-3 align-items-center py-3 px-2 bg-warning sticky-top '>
                                                    <i className="bi bi-people-fill"></i>
                                                    <p className='m-0 fs-6 fw-bold'>تعداد کاربر انتخاب شده : </p>
                                                    <span className='m-0 fs-6 fw-bold'>{numOfUsers}</span>
                                                </div>
                                                {searchInput.length >= 1 ? (
                                                    filteredResults.map((user) => {
                                                        return (
                                                            <User {...user} key={user._id} />
                                                        )
                                                    })
                                                ) : (
                                                    adminUsers.map((user) => {
                                                        return <User {...user} key={user._id} />
                                                    })
                                                )
                                                }
                                            </div>
                                        </Col>
                                        <Col md='8'>
                                            <div className="d-flex align-items-center mb-3 gap-5">
                                                <div className="input-group sticky-top">
                                                    <span className="input-group-text">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                        </svg>
                                                    </span>
                                                    <input className="search-users form-control p-2" name='searchInput' type="text" placeholder="سرچ کنید ..." onChange={(e) => { filteringAccess(levelAccess, e) }} ></input>
                                                </div>
                                                <div className="d-flex gap-1 w-50">
                                                    <button className='btn btn-danger  w-50 align-self-end' onClick={handleCancleButton}>انصراف</button>
                                                    <button className='btn btn-success w-50 align-self-end' onClick={handleFormSubmit}>ثبت</button>
                                                </div>
                                            </div>
                                            <div className="list-of-access overflow-scroll rounded">
                                                <div className='bg-white overflow-scroll'>
                                                    <ul className="access-list px-2">
                                                        <li className="" >
                                                            {accessMenu.length !== 0 ? <Access dataEntry={accessMenu} /> : null}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </Tab>
                            <Tab eventKey={"page2"} title="صفحه دوم" className="justify-content-center mb-5">
                                <Container fluid className=" darkBlue-text">
                                    <Row className='gap-4'>
                                        <Col md='4'>
                                            <div>
                                                <div className="input-group sticky-top mb-3">
                                                    <span className="input-group-text">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                        </svg>
                                                    </span>
                                                    <input className="search-users form-control p-2 " name='searchInput' type="text" placeholder="سرچ کنید ..." onChange={(e) => searchItems(e.target.value)}></input>
                                                </div>
                                            </div>
                                            <div className="list-of-users bg-white overflow-scroll mb-3 rounded">
                                                <div className='d-flex gap-3 align-items-center py-3 px-2 bg-warning sticky-top '>
                                                    <i className="bi bi-people-fill"></i>
                                                    <p className='m-0 fs-6 fw-bold'>تعداد کاربر انتخاب شده : </p>
                                                    <span className='m-0 fs-6 fw-bold'>{numOfUsers}</span>
                                                </div>
                                                {searchInput.length >= 1 ? (
                                                    filteredResults.map((user) => {
                                                        return (
                                                            <User {...user} key={user._id} />
                                                        )
                                                    })
                                                ) : (
                                                    adminUsers.map((user) => {
                                                        return <User {...user} key={user._id} />
                                                    })
                                                )
                                                }
                                            </div>
                                        </Col>
                                        <Col md='4' className=''>
                                            <div>
                                                <div className="input-group sticky-top mb-3">
                                                    <span className="input-group-text">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                                        </svg>
                                                    </span>
                                                    <input className="search-users form-control p-2 " name='searchInput' type="text" placeholder="سرچ کنید ..." onChange={(e) => searchItems(e.target.value)}></input>
                                                </div>
                                            </div>
                                            <div className="list-of-users bg-white overflow-scroll mb-3 rounded">
                                                <div className='d-flex gap-3 align-items-center py-3 px-2 bg-warning sticky-top '>
                                                    <i className="bi bi-people-fill"></i>
                                                    <p className='m-0 fs-6 fw-bold'>تعداد کاربر انتخاب شده : </p>
                                                    <span className='m-0 fs-6 fw-bold'>{numOfUsers}</span>
                                                </div>
                                                {searchInput.length >= 1 ? (
                                                    filteredResults.map((user) => {
                                                        return (
                                                            <User {...user} key={user._id} />
                                                        )
                                                    })
                                                ) : (
                                                    adminUsers.map((user) => {
                                                        return <User {...user} key={user._id} />
                                                    })
                                                )
                                                }
                                            </div>
                                        </Col>
                                        <Col md='3' className='bg-white h-100'>
                                            <div className="d-flex gap-1">
                                                <button className='btn btn-danger  w-50 align-self-end' onClick={handleCancleButton}>انصراف</button>
                                                <button className='btn btn-success w-50 align-self-end' onClick={handleFormSubmit}>ثبت</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>

        </>


    )
}


export default AdminPanel;


