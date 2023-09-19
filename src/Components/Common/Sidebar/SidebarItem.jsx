import React, { Fragment, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Nav, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";

import { rootContext } from "../../context/rootContext";
import {selectUserInfoChanged} from '../../Slices/mainSlices';

import { RsetChangeUserInfoModal } from "../../Slices/modalsSlice";

const SidebarItem = ({ color, item, setClickedLink, lockLinks, setLockLinksModal, setClearReq, setShow, open, setOpen, toggleSidebar }) => {
    const dispatch = useDispatch();
    const userInfoChanged = useSelector(selectUserInfoChanged)
    const mainContext = useContext(rootContext);
    const {
        jobNSeenCounter,
        warehouseNSeenCounter,
        purchaseNSeenCounter
    } = mainContext;

    var currentURL = window.location.pathname;
    var path = '';
    if (currentURL === '/InterCompanyJobRequest') {
        path = '#'
    } else if (currentURL === '/WarehouseNewRequest') {
        path = '#'
    }

    return (
        <Fragment>
            {item.children.length === 0 ?
                <NavLink role='link' to={lockLinks && path !== '' ? path : userInfoChanged === false ? '/Home' :item.path}
                    className={open === item.id 
                        ? 'sideMenuItem text-decoration-none p-3 open'
                        : 'sideMenuItem text-decoration-none p-3'
                    }        
                >
                    <div onClick={() => {
                        if(userInfoChanged === false && item.path !== '/Home'){
                            dispatch(RsetChangeUserInfoModal(true));
                        }
                        if(toggleSidebar !== undefined){
                            toggleSidebar(false, item.children.length === 0 ? true : false);
                        }
                        if (item.id !== open) {
                            setOpen(item.id);
                        } else {
                            //setOpen('');
                        }
                        if (item.children.length === 0) {
                            if (setShow !== undefined) { setShow(false) }
                        }
                        setClickedLink(item.path);
                        if (lockLinks) { setLockLinksModal(true) }
                        localStorage.setItem('lastLocation', item.permissionId);
        
                    }}
                        className={`d-flex justify-content-between align-items-center sideMenuIcon_center ${color}`}>
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={xssFilters.inHTMLData(item.icon)} className={`sideMenuItem_icon me-2 ${color}`} />
                            <span className="sideMenuItem_caption">{xssFilters.inHTMLData(item.caption)}</span>
                        </div>
                        {item.children.length !== 0 ? <FontAwesomeIcon icon={faAngleDown} className='toggleAngleDown' /> : null}
                    </div>
        
                    {/* {item.children.length !== 0 && open === item.id ?
                        <Nav className='sidebarSubMenu flex-column pt-2 ms-3'>
                            {item.children.map((item, index) => {
                                return (
                                    <NavLink role='link' key={index} to={lockLinks && path !== '' ? path : item.path} 
                                        className={open === item.id ? 
                                            userInfoChanged === true ? 'sideSubMenuItem text-decoration-none py-3 d-flex align-items-center active' : 'sideSubMenuItem text-decoration-none py-3 d-flex align-items-center active cursorDefault'
                                        : userInfoChanged === true ? 'sideSubMenuItem text-decoration-none py-3 d-flex align-items-center' : 'sideSubMenuItem text-decoration-none py-3 d-flex align-items-center cursorDefault'}
                                        onClick={(event) => {
                                            if(toggleSidebar !== undefined){
                                                toggleSidebar(false, true);
                                            }
                                            localStorage.setItem('lastLocation', item.permissionId);
                                            setClickedLink(item.path);
                                            if (lockLinks) { setLockLinksModal(true) }
                                            if (setShow !== undefined) { setShow(false) }
                                            if ((item.path === '/RequestsList' && currentURL === '/WarehouseNewRequest') || (item.path === '/WarehouseNewRequest' && currentURL === '/RequestsList')) { setClearReq(true) };
                                            if (userInfoChanged === false){ event.preventDefault() }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={xssFilters.inHTMLData(item.icon)} className={`sideSubMenuItem_icon me-2 ${color}`} />
                                        <span className={`sideSubMenuItem_caption font14 ${color}`}>
                                            {xssFilters.inHTMLData(item.caption)}
                                        </span>
                                        {jobNSeenCounter !== 0 && item.path === '/NewRequestsList' ? <Badge bg="info" className={`font14 ms-2 ${color}`}>{jobNSeenCounter}</Badge> : null}
                                        {warehouseNSeenCounter !== 0 && item.path === '/WarehouseNewRequestsList' ? <Badge bg="info" className={`font14 ms-2 ${color}`}>{warehouseNSeenCounter}</Badge> : null}
                                    </NavLink>
                                )
                            })}
                        </Nav>
                    : null} */}
                </NavLink>
            :
                <div
                    className={open === item.id 
                        ? 'sideMenuItem cursorPointer p-3 open'
                        : 'sideMenuItem cursorPointer p-3'
                    }      
                >
                    <div onClick={() => {
                        if(toggleSidebar !== undefined){
                            toggleSidebar(false, item.children.length === 0 ? true : false);
                        }
                        if (item.id !== open) {
                            setOpen(item.id);
                        } else {
                            //setOpen('');
                        }

                        if (item.children.length === 0) {
                            if (setShow !== undefined) { setShow(false) }
                        }
                        setClickedLink(item.path);
                        if (lockLinks) { setLockLinksModal(true) }
                        localStorage.setItem('lastLocation', item.permissionId);

                    }}
                        className={`d-flex justify-content-between align-items-center sideMenuIcon_center ${color}`}>
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={xssFilters.inHTMLData(item.icon)} className={`sideMenuItem_icon me-2 ${color}`} />
                            <span className="sideMenuItem_caption">{xssFilters.inHTMLData(item.caption)}</span>
                        </div>
                        {item.children.length !== 0 ? <FontAwesomeIcon icon={faAngleDown} className='toggleAngleDown' /> : null}
                    </div>

                    {item.children.length !== 0 && open === item.id ?
                        <Nav className='sidebarSubMenu flex-column pt-2 ms-3'>
                            {item.children.map((item, index) => {
                                return (
                                    <NavLink role='link' key={index} to={lockLinks && path !== '' ? path : userInfoChanged === false ? '/Home' :item.path} 
                                        className={open === item.id 
                                            ? 'sideSubMenuItem text-decoration-none py-3 d-flex align-items-center active'
                                            : 'sideSubMenuItem text-decoration-none py-3 d-flex align-items-center'
                                        }
                                        onClick={(event) => {
                                            if(userInfoChanged === false){
                                                dispatch(RsetChangeUserInfoModal(true));
                                            }
                                            if(toggleSidebar !== undefined){
                                                toggleSidebar(false, true);
                                            }
                                            localStorage.setItem('lastLocation', item.permissionId);
                                            setClickedLink(item.path);
                                            if (lockLinks) { setLockLinksModal(true) }
                                            if (setShow !== undefined) { setShow(false) }
                                            if ((item.path === '/RequestsList' && currentURL === '/WarehouseNewRequest') || (item.path === '/WarehouseNewRequest' && currentURL === '/RequestsList')) { setClearReq(true) };
                                        }}
                                    >
                                        <FontAwesomeIcon icon={xssFilters.inHTMLData(item.icon)} className={`sideSubMenuItem_icon me-2 ${color}`} />
                                        <span className={`sideSubMenuItem_caption font14 ${color}`}>
                                            {xssFilters.inHTMLData(item.caption)}
                                        </span>
                                        {/* {jobNSeenCounter !== 0 && item.path === '/NewRequestsList' ? <Badge bg="info" className={`font14 ms-2 ${color}`}>{jobNSeenCounter}</Badge> : null}
                                        {warehouseNSeenCounter !== 0 && item.path === '/WarehouseReqPage' ? <Badge bg="info" className={`font14 ms-2 ${color}`}>{warehouseNSeenCounter}</Badge> : null}
                                        {purchaseNSeenCounter !== 0 && item.path === '/PurchaseReqsList' ? <Badge bg="info" className={`font14 ms-2 ${color}`}>{purchaseNSeenCounter}</Badge> : null} */}
                                    </NavLink>
                                )
                            })}
                        </Nav>
                    : null}
                </div>
            }
        </Fragment>

    );
}

export default SidebarItem;