import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Nav } from 'react-bootstrap';
import SidebarItem from "./SidebarItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { handleMenu, selectMenu, selectUser, handleUserData } from '../../Slices/mainSlices';
import { useSelector, useDispatch } from 'react-redux';

const SideMenu = ({ lockLinks, setLocklinks, setLockLinksModal, setClickedLink, setClearReq, open, setOpen }) => {
    // const user = useSelector(selectUser);
    // useEffect(() => {
    //     if (user.FirstName === undefined) {
    //         dispatch(handleUserData());
    //     }
    // }, [user.FirstName === undefined])
    
    const dispatch = useDispatch();
    const menu = useSelector(selectMenu);
    useEffect(() => {
        if (menu[0] === undefined) {
            dispatch(handleMenu());
        }
    }, [menu])

    const toggleSidebar = (toggle, close) => {
        const sideBar = document.getElementById('sidebarContent');
        const content = document.getElementById('routeContent');
        if (toggle === true) {
            sideBar.classList.toggle('w-5');
            content.classList.toggle('w-95');
        } else if (toggle === false && sideBar.classList.contains('w-5')) {
            sideBar.classList.remove('w-5');
            content.classList.remove('w-95');
        } else if (toggle === false && !sideBar.classList.contains('w-5') && close === true) {
            sideBar.classList.add('w-5');
            content.classList.add('w-95');
        }
        
        const sideMenuItem_caption = document.getElementsByClassName('sideMenuItem_caption');
        const sidebarSubMenu = document.getElementsByClassName('sidebarSubMenu');
        const toggleAngleDown = document.getElementsByClassName('toggleAngleDown');
        const sideMenuItem_icon = document.getElementsByClassName('sideMenuItem_icon');
        const sideMenuIcon_center = document.getElementsByClassName('sideMenuIcon_center');

        if (sideBar.classList.contains('w-5')) {
            for (var i = 0; i < sideMenuItem_caption.length; i++) {
                sideMenuItem_caption[i].classList.add('d-none');
            }
            for (var i = 0; i < toggleAngleDown.length; i++) {
                toggleAngleDown[i].classList.add('d-none');
            }
            for (var i = 0; i < sidebarSubMenu.length; i++) {
                sidebarSubMenu[i].classList.add('d-none');
            }
            for (var i = 0; i < sideMenuItem_icon.length; i++) {
                sideMenuItem_icon[i].classList.add('font20');
            }
            for (var i = 0; i < sideMenuIcon_center.length; i++) {
                sideMenuIcon_center[i].classList.remove('justify-content-between');
                sideMenuIcon_center[i].classList.add('justify-content-center');
            }
        } else {
            for (var i = 0; i < sideMenuItem_caption.length; i++) {
                sideMenuItem_caption[i].classList.remove('d-none');
            }
            for (var i = 0; i < toggleAngleDown.length; i++) {
                toggleAngleDown[i].classList.remove('d-none');
            }
            for (var i = 0; i < sidebarSubMenu.length; i++) {
                sidebarSubMenu[i].classList.remove('d-none');
            }
            for (var i = 0; i < sideMenuItem_icon.length; i++) {
                sideMenuItem_icon[i].classList.remove('font20');
            }
            for (var i = 0; i < sideMenuIcon_center.length; i++) {
                sideMenuIcon_center[i].classList.add('justify-content-between');
                sideMenuIcon_center[i].classList.remove('justify-content-center');
            }
        }
    }
    return (
        <div className='position-relative'>
            <FontAwesomeIcon icon={faBars} className='cursorPointer text-white font20 position-absolute bg-danger rounded-circle p-2 left-M18 top-14' onClick={() => toggleSidebar(true)} />
            <div className="mainMenu pt-4">
                <Nav className="flex-column font14 sidebarMenuLinks">
                    {menu[0] !== undefined ? menu[0].children.map((item, index) => {
                        if (localStorage.getItem('id') === '6360ecd33ba4d4828c9cb40b') {
                            return (
                                <SidebarItem color='text-white' key={index} item={item}
                                    setClickedLink={setClickedLink} lockLinks={lockLinks} setLockLinksModal={setLockLinksModal} setClearReq={setClearReq}
                                    open={open} setOpen={setOpen} toggleSidebar={toggleSidebar} />
                            )
                        } else {
                            if (item.path !== "/UsersInfo" && item.path !== "/UsersLogin" && item.path !== "/AdminPanel") {
                                return (
                                    <SidebarItem color='text-white' key={index} item={item}
                                        setClickedLink={setClickedLink} lockLinks={lockLinks} setLockLinksModal={setLockLinksModal} setClearReq={setClearReq}
                                        open={open} setOpen={setOpen} toggleSidebar={toggleSidebar} />
                                )
                            }
                        }
                    })
                        : null}
                </Nav>
            </div>
        </div>
    );
}

export default withRouter(SideMenu);