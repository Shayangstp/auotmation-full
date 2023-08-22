import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import MainLayout from "../Components/Layouts/MainLayout";
import CookieContext from "../Components/context/Cookies/cookieContext";
import MainContext from "../Components/context/mainContext";
import UserContext from "../Components/context/userContext";
import RequestContext from "../Components/context/jobReqsContext/requestContext";
import AllNewRequestsContext from "../Components/context/allNewReqsContext/allNewRequestsContext";

import Logout from "../Components/Account/Logout";
import Profile from '../Components/Account/Profile';
import UsersInfo from '../Components/Account/UsersInfo';
import Home from '../Components/Dashboard/Home';
import Setting from "../Components/Dashboard/Setting";
import UsersLogin from "../Components/Dashboard/UsersLogin/UsersLogin";
import InterCompanyJobRequest from '../Components/JobReq/JobRequest'
import RequestsList from "../Components/JobReq/RequestsList";
import NewRequestsList from "../Components/JobReq/NewRequestsList";
import RequestHistory from "../Components/JobReq/ReqHistory";
import ReqSingle from "../Components/JobReq/ReqSingle";
import NotFound from "../Components/Common/NotFound";

import { useSelector } from "react-redux";

import LoginAndRegister from './../Components/Account/LoginAndRegister';

// warehouse
import WarehouseRequestContext from "../Components/context/warehouseReqsContext/requestContext";
import WarehouseAddProContext from "../Components/context/WarehouseContext/warehouse-addProContext";
import WarehouseNewRequest from '../Components/WarehouseReq/WarehouseNewRequest';
import WarehouseReqPage from '../Components/WarehouseReq/WarehouseReqPage';
import WarehouseRequestHistory from "../Components/WarehouseReq/WarehouseReqHistory";
import WarehouseNewRequestsList from "../Components/WarehouseReq/WarehouseNewRequestsList";
import PurchaseReqRegistration from "../Components/WarehouseReq/ProductPurchase/PurchaseReqRegistration";
import PurchaseReqsList from "../Components/WarehouseReq/ProductPurchase/PurchaseReqsList";

// office
import OfficeRequestContext from "../Components/context/officeContext/officeRequestContext";
import OfficeNewReq from "../Components/Office/OfficeNewReq";
import OfficeReqsList from "../Components/Office/OfficeReqsList";
import OfficeReqItemDetails from "../Components/Office/OfficeReqItemDetails";
import LeaveReqRegistration from "../Components/Office/LeaveReq/LeaveReqRegistration";
import LeaveReqsList from './../Components/Office/LeaveReq/LeaveReqsList';
import MissionReqRegistration from "../Components/Office/MissionReq/MissionReqRegistration";
import MissionReqsList from './../Components/Office/MissionReq/MissionReqsList';
import PaySlip from "../Components/Office/PaySlip/PaySlip";
import PaySlipExport from "../Components/Office/PaySlip/PaySlipExport";
import JobChangeReqRegistration from "../Components/Office/JobChangeReq/JobChangeRegistration";
import NewsRegistration from "../Components/Office/News/NewsRegistration";
import NoticeRegistration from "../Components/Office/Notice/NoticeRegistration";
import ChangeFoodMenu from "../Components/Office/FoodMenu/ChangeFoodMenu";
import OverTimeRegistration from "../Components/Office/Overtime/OverTimeRegistration";
import OverTimeReqsList from "../Components/Office/Overtime/OverTimeReqsList";

// add Link Input
import AddLinkContext from "../Components/context/AddLinkContext/addLinkContext";
// add Image Input 
import AddImageContext from "../Components/context/AddImageContext/addImageContext";
// add File Input
import AddFileContext from "../Components/context/AddFileContext/addFileContext";

// all new requests
import AllNewRequests from "../Components/AllNewReqs/AllNewReuests";

// sale charts
import SaleCharts from './../Components/Sale/SaleCharts';

import AdminContext from "../Components/context/AdminPanel/adminContext";
import AdminPanel from "../Components/AdminPanel/AdminPanel";

import IranTolJobContext from "../Components/context/iranTolJobContext/IranTolJobContext";
import IranTolJobRegistration from "../Components/IranTolJobReq/IranTolJobRegistration";
import IranTolJobReqsList from "../Components/IranTolJobReq/IranTolJobReqsList";

import { selectUser } from '../Components/Slices/mainSlices';

import FileUploadForm from "../Components/Cloud/FileUploadForm";
import UploadedFilesList from "../Components/Cloud/UploadedFilesList";

import SoftwareReqRegistration from "../Components/Software/SoftwareReq/SoftwareReqRegistration";
import SoftwareReqList from './../Components/Software/SoftwareReq/SoftwareReqList';

import MyReqsList from "../Components/MyRequests/MyReqsList";
import GroupLeaveRegistration from './../Components/Office/LeaveReq/GroupLeave/GroupLeaveRegistration';
import InDecLeaveRegistration from "../Components/Office/LeaveReq/InDecLeave/InDecLeaveRegistration";

import LeaveCardex from '../Components/Office/LeaveReq/LeaveCardex/LeaveCardex';
import LoanRegistration from './../Components/Office/LoanReq/LoanReqRegistration';


import IrantoolDevicesList from '../Components/IranTolJobReq/IranTolDevices/IrantoolDevicesList';
import ProductsList from '../Components/JobReq/INV/ProductsList';

import CeramicPriceRegistration from './../Components/JobReq/CeraJobPrice/CeramicPriceRegistration';
import CeramicProjectPrice from './../Components/JobReq/CeramicJobReqPrice/CeramicProjectPrice';
import Test from "../Components/test/Test";
import TargetingList from './../Components/Sale/Targeting/TargetingList';
import BaseInfo from "../Components/IranTolJobReq/IranTolBaseInfo/BaseInfo";
import PaySlipReport from "../Components/Financial/Report/PaySlip/PaySlipReport";

import PurchaseItemsList from "../Components/WarehouseReq/ProductPurchase/PurchaseItemsList";

const Automation = (props) => {

    const [currentRequest, setCurrentRequest] = useState({});
    const [currentRequestItems, setCurrentRequestItems] = useState([]);

    const [clearReq, setClearReq] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState('');
    const [lockLinks, setLocklinks] = useState(false);
    const [lockLinksModal, setLockLinksModal] = useState(false);
    const [clickedLink, setClickedLink] = useState('');

    const user = useSelector(selectUser);
    useEffect(() => {
        if (user.FirstName !== undefined) {
            setPageLoading(false);
        }
    }, [user])

    // const [currentPathName, setCurrentPathName] = useState('/')
    // useEffect(()=>{
    //     if(window.location.pathname !== currentPathName){
    //         setLoading(false);
    //         setCurrentPathName(window.location.pathname)
    //     }
    // },[currentPathName])

    const hasJWT = () => {
        let flag = false;
        localStorage.getItem("token") ? flag = true : flag = false;
        return flag;
    }


    return (
        <MainContext>
            <MainLayout pageTitle={pageTitle} lockLinks={lockLinks} setLocklinks={setLocklinks}
                lockLinksModal={lockLinksModal} setLockLinksModal={setLockLinksModal} clickedLink={clickedLink} setClickedLink={setClickedLink}
                setClearReq={setClearReq}>
                <Switch>
                    <Route path="/Profile" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            pageLoading === false ?
                                <CookieContext>
                                    {/* <MainContext> */}
                                    <UserContext>
                                        <Profile setPageTitle={setPageTitle} />
                                    </UserContext>
                                    {/* </MainContext> */}
                                </CookieContext> : null
                    }
                    />
                    <Route path="/UsersInfo" render={() =>
                        hasJWT() === false || localStorage.getItem('id') !== '6360ecd33ba4d4828c9cb40b' ?
                            <Redirect to="/" />
                            :
                            <MainContext>
                                <UsersInfo setPageTitle={setPageTitle} />
                            </MainContext>
                    }
                    />
                    <Route path="/Home" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                {/* <MainContext> */}
                                <OfficeRequestContext >
                                    <Home />
                                </OfficeRequestContext>
                                {/* </MainContext> */}
                            </CookieContext>}
                    />
                    <Route path="/Setting" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <Setting setPageTitle={setPageTitle} />}
                    />
                    <Route path="/UsersLogin" render={() =>
                        hasJWT() === false || localStorage.getItem('id') !== '6360ecd33ba4d4828c9cb40b' ?
                            <Redirect to="/" />
                            :
                            <UsersLogin setPageTitle={setPageTitle} />}
                    />

                    <Route path="/ProductsList" render={() =>
                        hasJWT() === false || (user.Roles !== undefined && user.Roles.some(role => role === '22') === false) ?
                            <Redirect to="/" />
                            :
                            <ProductsList setPageTitle={setPageTitle} />}
                    />
                    <Route path="/CeramicProductsPriceRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CeramicPriceRegistration setPageTitle={setPageTitle} />}
                    />
                    <Route path="/CeramicJobReqPriceRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CeramicProjectPrice setPageTitle={setPageTitle} />}
                    />
                    {/* <Route path="/Test" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <Test setPageTitle={setPageTitle} />}
                    /> */}
                    <Route path="/InterCompanyJobRequest" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <AddFileContext>
                                        <RequestContext clearReq={clearReq} setClearReq={setClearReq}
                                            currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems}
                                            setCurrentRequestItems={setCurrentRequestItems}>
                                            <InterCompanyJobRequest setPageTitle={setPageTitle} setLocklinks={setLocklinks} />
                                        </RequestContext>
                                    </AddFileContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/RequestsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <RequestContext clearReq={clearReq} setClearReq={setClearReq}
                                        currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems} setCurrentRequestItems={setCurrentRequestItems}>
                                        <RequestsList setPageTitle={setPageTitle} />
                                    </RequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/NewRequestsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <RequestContext clearReq={clearReq} setClearReq={setClearReq}
                                        currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems} setCurrentRequestItems={setCurrentRequestItems}>
                                        <NewRequestsList setPageTitle={setPageTitle} />
                                    </RequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/RequestHistory" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <RequestContext>
                                        <RequestHistory setPageTitle={setPageTitle} />
                                    </RequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/Request/:id" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <RequestContext currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems} setCurrentRequestItems={setCurrentRequestItems}>
                                <ReqSingle setPageTitle={setPageTitle} />
                            </RequestContext>
                    }
                    />

                    {/* irantool routs */}
                    <Route path="/IrtReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <AddFileContext>
                                        <IranTolJobContext>
                                            <IranTolJobRegistration setPageTitle={setPageTitle} setLocklinks={setLocklinks} />
                                        </IranTolJobContext>
                                    </AddFileContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/IrtReqList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <AddFileContext>
                                        <IranTolJobContext>
                                            <IranTolJobReqsList setPageTitle={setPageTitle} setLocklinks={setLocklinks} />
                                        </IranTolJobContext>
                                    </AddFileContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    {/* <Route path="/IrtDevices" render={() =>
                        hasJWT() === false || (user.Roles !== undefined && user.Roles.some(role => role === '23') === false) ?
                            <Redirect to="/" />
                            :
                            <MainContext>
                                <IranTolJobContext>
                                    <IrantoolDevicesList setPageTitle={setPageTitle} setLocklinks={setLocklinks} />
                                </IranTolJobContext>
                            </MainContext>}
                    /> */}
                    <Route path="/IrtBaseInfo" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <BaseInfo setPageTitle={setPageTitle} setLocklinks={setLocklinks} />}
                    />
                    {/* irantool routs  END*/}
                    {/* warehouse routes */}
                    <Route path="/WarehouseNewRequest" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseRequestContext clearReq={clearReq} setClearReq={setClearReq}
                                        currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems} setCurrentRequestItems={setCurrentRequestItems}>
                                        <WarehouseNewRequest setPageTitle={setPageTitle} setLocklinks={setLocklinks} />
                                    </WarehouseRequestContext>
                                </MainContext>
                            </CookieContext>
                    }
                    />
                    <Route path="/WarehouseReqPage" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseAddProContext>
                                        <WarehouseRequestContext clearReq={clearReq} setClearReq={setClearReq}
                                            currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems} setCurrentRequestItems={setCurrentRequestItems}>
                                            <WarehouseReqPage setPageTitle={setPageTitle} />
                                        </WarehouseRequestContext>
                                    </WarehouseAddProContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/WarehouseNewRequestsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseRequestContext clearReq={clearReq} setClearReq={setClearReq}
                                        currentRequest={currentRequest} setCurrentRequest={setCurrentRequest} currentRequestItems={currentRequestItems} setCurrentRequestItems={setCurrentRequestItems}>
                                        <WarehouseNewRequestsList setPageTitle={setPageTitle} />
                                    </WarehouseRequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/WarehouseRequestHistory" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseRequestContext>
                                        <WarehouseRequestHistory setPageTitle={setPageTitle} />
                                    </WarehouseRequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/PurchaseReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseAddProContext>
                                        <AddLinkContext>
                                            <AddImageContext>
                                                <WarehouseRequestContext>
                                                    <PurchaseReqRegistration setPageTitle={setPageTitle} />
                                                </WarehouseRequestContext>
                                            </AddImageContext>
                                        </AddLinkContext>
                                    </WarehouseAddProContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/PurchaseReqsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseRequestContext>
                                        <PurchaseReqsList setPageTitle={setPageTitle} />
                                    </WarehouseRequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/PurchaseItemsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <PurchaseItemsList setPageTitle={setPageTitle} />}
                    />
                    {/* warehouse routes END */}
                    {/* office routs */}
                    <Route path="/OfficeNewRequest" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <OfficeNewReq setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/officeRequests" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <OfficeReqsList setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/OfficeRequest/:id" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <MainContext>
                                <OfficeRequestContext>
                                    <OfficeReqItemDetails setPageTitle={setPageTitle} />
                                </OfficeRequestContext>
                            </MainContext>}
                    />
                    <Route path="/LoanRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <LoanRegistration setPageTitle={setPageTitle} />
                    } />
                    <Route path="/LeaveReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <LeaveReqRegistration setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/GroupLeaveRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <GroupLeaveRegistration setPageTitle={setPageTitle} />
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/InDecLeaveRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <InDecLeaveRegistration setPageTitle={setPageTitle} />
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/LeaveCardex" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <LeaveCardex setPageTitle={setPageTitle} />
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/LeaveReqsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext currentRequest={currentRequest} setCurrentRequest={setCurrentRequest}>
                                        <LeaveReqsList setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/MissionReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <MissionReqRegistration setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/MissionReqsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <MissionReqsList setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/PaySlip" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <PaySlip setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/PaySlipExport" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <PaySlipExport setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/JobChangeReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <JobChangeReqRegistration setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/NewsRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <NewsRegistration setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/NoticeRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <NoticeRegistration setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    <Route path="/ChangeFoodMenu" render={() =>
                        hasJWT() === false ?
                            <Redirect to='/' />
                            :
                            <CookieContext>
                                <MainContext>
                                    <OfficeRequestContext>
                                        <ChangeFoodMenu setPageTitle={setPageTitle} />
                                    </OfficeRequestContext>
                                </MainContext>
                            </CookieContext>
                    } />
                    {/* <Route path="/Checkout" element={<CheckoutOfficial />} />
                    <Route path="/CheckoutList" element={<CheckoutList />} /> */}
                    <Route path="/OverTimeReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <OverTimeRegistration setPageTitle={setPageTitle} />}
                    />
                    <Route path="/OverTimeReqsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <OverTimeReqsList setPageTitle={setPageTitle} />}
                    />
                    {/* <Route path="/ExpenseAccount" element={<ExpenseAccount />} />
                    <Route path="/ExpenseAccountTable" element={<ExpensesAccountTable />} /> */}
                    {/* office routs END */}
                    {/* financial routs */}
                    {/* <Route path="/PaySlipReport" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <PaySlipReport setPageTitle={setPageTitle} />}
                    /> */}
                    {/* financial routs END */}
                    {/* cloud routs */}
                    <Route path="/FileUploadForm" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <FileUploadForm setPageTitle={setPageTitle} />}
                    />
                    <Route path="/UploadedFilesList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <UploadedFilesList setPageTitle={setPageTitle} />}
                    />
                    {/* cloud routs END */}
                    {/* software routs */}
                    <Route path="/SoftwareReqRegistration" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <SoftwareReqRegistration setPageTitle={setPageTitle} />}
                    />
                    <Route path="/SoftwareReqsList" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <SoftwareReqList setPageTitle={setPageTitle} />}
                    />
                    {/* software routs END */}
                    <Route path="/MyRequests" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <MyReqsList setPageTitle={setPageTitle} />
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/AllNewRequests" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <WarehouseRequestContext>
                                        <AllNewRequestsContext currentRequest={currentRequest} setCurrentRequest={setCurrentRequest}>
                                            <AllNewRequests setPageTitle={setPageTitle} />
                                        </AllNewRequestsContext>
                                    </WarehouseRequestContext>
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/SaleCharts" render={() =>
                        hasJWT() === false || (user.Roles !== undefined && user.Roles.some(role => role === '24') === false) ?
                            <Redirect to="/" />
                            :
                            <CookieContext>
                                <MainContext>
                                    <SaleCharts setPageTitle={setPageTitle} />
                                </MainContext>
                            </CookieContext>}
                    />
                    <Route path="/Target" render={() =>
                        hasJWT() === false || (user.Roles !== undefined && user.Roles.some(role => role === '24') === false) ?
                            <Redirect to="/" />
                            : <TargetingList setPageTitle={setPageTitle} />
                    }
                    />
                    {/* Route for Admin Panel - mehrdad karami */}
                    <Route path="/adminpanel" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <MainContext>
                                <AdminContext>
                                    <AdminPanel />
                                </AdminContext>
                            </MainContext>
                    }
                    />
                    <Route path="/Logout" render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <Logout />}
                    />
                    <Route path="/" exact render={() =>
                        <CookieContext>
                            {/* <MainContext> */}
                            <UserContext>
                                <LoginAndRegister />
                            </UserContext>
                            {/* </MainContext> */}
                        </CookieContext>} />
                    <Route path="*" exact render={() =>
                        hasJWT() === false ?
                            <Redirect to="/" />
                            :
                            <NotFound setPageTitle={setPageTitle} />}
                    />
                </Switch>
            </MainLayout>
        </MainContext>
    );
};

export default Automation;