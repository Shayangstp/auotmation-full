import React from "react";
import { Link, NavLink } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faHomeAlt } from '@fortawesome/free-solid-svg-icons';


const HeaderBreadcrumb = ({pathname, pageTitle, lockLinks, setLocklinks, setLockLinksModal, setClickedLink}) => {
  return(
      <div className="d-flex justify-content-between HeaderBreadcrumb">
        <Breadcrumb className='breadcrumb-sec font14'>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/Home" }}>
            <FontAwesomeIcon icon={faHomeAlt} className='text-light'/>
          </Breadcrumb.Item>
          {pathname === '/InterCompanyJobRequest' || pathname === '/RequestsList' || pathname === '/NewRequestsList' || pathname === '/RequestHistory' ?
            <Breadcrumb.Item className='text-light font12' active>کار فنی</Breadcrumb.Item>
          : null}
          {pathname === '/WarehouseNewRequest' || pathname === '/WarehouseReqPage' || pathname === '/WarehouseNewRequestsList' || pathname === '/WarehouseRequestHistory' || pathname === '/PurchaseReqRegistration' || pathname === '/PurchaseReqsList'?
            <Breadcrumb.Item className='text-light font12' active>انبار</Breadcrumb.Item>
          : null}
          {pathname === '/OfficeNewRequest' || pathname === '/officeRequests' || pathname === '/LeaveReqRegistration' || pathname === '/LeaveReqsList' || pathname === '/MissionReqRegistration' || pathname === '/MissionReqsList' || pathname === '/PaySlip' || pathname === '/JobChangeReqRegistration' || pathname === '/NewsRegistration' || pathname === '/NoticeRegistration' || pathname === '/ChangeFoodMenu' || pathname === '/OverTimeReqRegistration' || pathname === '/OverTimeReqsList' ?
            <Breadcrumb.Item className='text-light font12' active>اداری</Breadcrumb.Item>
          : null}
          <Breadcrumb.Item className='text-light font12' active>{pageTitle}</Breadcrumb.Item>
        </Breadcrumb>
        {/* <NavLink onClick={()=>{setClickedLink('/Home');if(lockLinks){setLocklinks(true);setLockLinksModal(true)}}} to={lockLinks ? '/InterCompanyJobRequest' : '/Home'} 
          className="text-decoration-none d-flex align-items-center justify-content-center closePage rounded-circle"
          ><FontAwesomeIcon icon={faXmark} className='text-secondary' /></NavLink> */}
      </div>
  );
};
export default HeaderBreadcrumb;