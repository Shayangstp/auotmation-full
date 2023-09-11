import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import Sidebar from "../Common/Sidebar/Sidebar";
import Breadcrumb from "../Common/Breadcrumb";
import UserMenu from "../Common/UserMenu";
import Header from "../Common/Header";
import LockLinksM from "../Modals/LockLinksModal";
// import InstallAutomationModal from "../Modals/InstallAutomationModal"

import NotFound from "../Common/NotFound";

import MainContext from "../context/mainContext";
import AllNewRequestsContext from "../context/allNewReqsContext/allNewRequestsContext";

import { useSelector } from "react-redux";
import { selectUserNotFoundModal } from "../Slices/mainSlices";
import UserNotFoundM from "../Modals/UserNotFoundModal";

import { selectChangeUserInfoModal } from "../Slices/modalsSlice";
import ChangeUserInfoM from "../Modals/ChangeUserInfoModal";

const MainLayout = (props) => {
  const userNotFoundModal = useSelector(selectUserNotFoundModal);

  const changeUserInfoModal = useSelector(selectChangeUserInfoModal);

  const [installAppModal, setInstallAppModal] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (
      localStorage.getItem("id") === null &&
      props.location.pathname !== "/"
    ) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
    // if (!window.matchMedia('(display-mode: standalone)').matches) {
    //     if (localStorage.getItem('id') === null) {
    //         setInstallAppModal(true);
    //     }
    // }
  }, [localStorage.getItem("id")]);

  const [open, setOpen] = useState("");

  const [logOutModal, setLogoutModal] = useState(false);
  const { pathname } = props.location;

  var breadcrumb = (
    <Breadcrumb
      pathname={pathname}
      pageTitle={props.pageTitle}
      lockLinks={props.lockLinks}
      setLocklinks={props.setLocklinks}
      setLockLinksModal={props.setLockLinksModal}
      setClickedLink={props.setClickedLink}
    />
  );
  var userMenu = (
    <AllNewRequestsContext>
      {/* <MainContext> */}
      <UserMenu
        logOutModal={logOutModal}
        setLogoutModal={setLogoutModal}
        lockLinks={props.lockLinks}
        setLocklinks={props.setLocklinks}
        setLockLinksModal={props.setLockLinksModal}
        setClickedLink={props.setClickedLink}
        breadcrumb={breadcrumb}
        pathname={pathname}
      />
      {/* </MainContext> */}
    </AllNewRequestsContext>
  );
  var sideBar = (
    <Col
      xl={3}
      xxl={2}
      className="d-none d-xl-block sidebarMenu darkBlue-bg p-0 topLeftRadius"
      id="sidebarContent"
    >
      {/* <MainContext> */}
      <Sidebar
        lockLinks={props.lockLinks}
        setLocklinks={props.setLocklinks}
        setLockLinksModal={props.setLockLinksModal}
        setClickedLink={props.setClickedLink}
        setClearReq={props.setClearReq}
        open={open}
        setOpen={setOpen}
      />
      {/* </MainContext> */}
    </Col>
  );
  var side = true;

  if (pathname === "/" || pathname === "/Home" || pathname === "/home") {
    breadcrumb = null;
  }
  if (pathname === "/") {
    userMenu = null;
  }
  if (pathname === "/") {
    sideBar = null;
  }
  if (pathname === "/") {
    side = false;
  } else if (pathname !== "/") {
    side = true;
  }

  return (
    <Container fluid id="blur">
      {isLogin === true ? (
        <section>
          {side === true ? (
            <div className="d-block d-xl-none">
              {/* <MainContext> */}
              <Header
                logOutModal={logOutModal}
                setLogoutModal={setLogoutModal}
                setClearReq={props.setClearReq}
                lockLinks={props.lockLinks}
                setClickedLink={props.setClickedLink}
                setLockLinksModal={props.setLockLinksModal}
                open={open}
                setOpen={setOpen}
              />
              {/* </MainContext> */}
            </div>
          ) : null}
          <Row>
            <Col md="12">{userMenu}</Col>
            {props.lockLinks ? (
              <LockLinksM
                lockLinksModal={props.lockLinksModal}
                setLockLinksModal={props.setLockLinksModal}
                setLocklinks={props.setLocklinks}
                clickedLink={props.clickedLink}
                setClearReq={props.setClearReq}
              />
            ) : null}
            {sideBar}
            <Col
              xl={side === true ? { span: 9 } : { span: 12 }}
              xxl={side === true ? { span: 10 } : { span: 12 }}
              className="p-0 pt-4 min-vh-100"
              id="routeContent"
            >
              <main id="page-content">{props.children}</main>
            </Col>
            {userNotFoundModal && pathname !== "/" ? <UserNotFoundM /> : null}
            {changeUserInfoModal && pathname !== "/" ? (
              <ChangeUserInfoM />
            ) : null}
          </Row>
        </section>
      ) : (
        <section>
          <NotFound />
        </section>
      )}
      {/* {installAppModal ? <InstallAutomationModal installAppModal={installAppModal} setInstallAppModal={setInstallAppModal} /> : null} */}
    </Container>
  );
};

export default withRouter(MainLayout);
