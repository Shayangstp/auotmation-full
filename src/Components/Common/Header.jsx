import React, { useState, useEffect, useContext } from "react";
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Navbar, Nav, Offcanvas, Button } from "react-bootstrap";
import LogoutM from "../Modals/LogoutModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarItem from "../Common/Sidebar/SidebarItem";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {selectUser, handleMenu, handleUserData, selectMenu} from '../Slices/mainSlices';

const Header = ({ logOutModal, setLogoutModal, setClearReq, lockLinks, setClickedLink, setLockLinksModal, open, setOpen }) => {
    const menu = useSelector(selectMenu);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    
    // const user = useSelector(selectUser);
    // useEffect(()=>{
    //     if (user.FirstName === undefined) {
    //         dispatch(handleUserData());
    //     }
    // },[user.FirstName === undefined])

    useEffect(()=>{
        if (menu[0] === undefined) {
            dispatch(handleMenu());
        }
    },[menu])


    return (
        <Row id='d-none-print'>
            <Col className='bg-warning'>
                <nav className='d-flex justify-content-between align-items-center py-2'>
                    <Navbar expand={false} className="w-50">
                        <Navbar.Toggle onClick={() => {setShow(true)}} className="border-0 p-0 text-light">
                            <FontAwesomeIcon icon={faBars} className='font24' />
                        </Navbar.Toggle>
                        <Navbar.Offcanvas
                            show={show} onHide={handleClose}
                            id="offcanvasNavbar"
                            aria-labelledby="offcanvasNavbarLabel"
                            placement="start"
                        >
                            <Offcanvas.Header className='justify-content-end' closeButton>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Offcanvas.Title id="offcanvasNavbarLabel" className='fw-bold mb-5 font18'>سامانه اتوماسیون درخواست های شیشه کاوه</Offcanvas.Title>
                                <Nav className="justify-content-end sidebarMenu-link flex-grow-1 mb-5">
                                    {menu[0] !== undefined ? menu[0].children.map((item, index) => {
                                        if (localStorage.getItem('id') === '6360ecd33ba4d4828c9cb40b') {
                                            return (
                                                <SidebarItem color='darkBlue-text' key={index} item={item}
                                                    setClickedLink={setClickedLink} lockLinks={lockLinks} setLockLinksModal={setLockLinksModal} setClearReq={setClearReq} setShow={setShow}
                                                    open={open} setOpen={setOpen} />
                                            )
                                        } else {
                                            if (item.path !== "/UsersInfo" && item.path !== "/UsersLogin") {
                                                return (
                                                    <SidebarItem color='darkBlue-text' key={index} item={item}
                                                        setClickedLink={setClickedLink} lockLinks={lockLinks} setLockLinksModal={setLockLinksModal} setClearReq={setClearReq} setShow={setShow}
                                                        open={open} setOpen={setOpen} />
                                                )
                                            }
                                        }
                                    })
                                        : null}
                                </Nav>
                                <div className='d-flex justify-content-between pt-3 flex-wrap'>
                                    <NavLink
                                        to={'/Profile'} onClick={() => setShow(false)} className='btn btn-info rounded-pill text-white font14 mb-3'>
                                        پروفایل
                                    </NavLink>
                                    <Button variant="danger" className='rounded-pill font14 mb-3' onClick={() => { setLogoutModal(true); setShow(false) }}>
                                        خروج
                                    </Button>
                                    {logOutModal ? <LogoutM logOutModal={logOutModal} setLogoutModal={setLogoutModal} /> : null}
                                </div>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Navbar>
                    <div className='d-flex align-items-center justify-content-center'>
                        <div className='logo me-0 me-xl-3'>
                            <img className='' src='../../images/kaveh.png' alt='گروه صنعتی شیشه کاوه' />
                        </div>
                    </div>
                </nav>
            </Col>
        </Row>
    )
}

export default Header;