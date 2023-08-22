import React from "react";
import { BrowserRouter } from "react-router-dom";

import Automation from "./Automation";
import { ToastContainer } from "react-toastify";

import { library } from '@fortawesome/fontawesome-svg-core'

import { faHome, faFileCirclePlus, faListCheck, faFolderPlus, faUserCheck, faCog, faCircleUser, faClockRotateLeft, faWarehouse, faScrewdriverWrench, faClipboardList, faEnvelopesBulk, faSuitcase, faShoePrints, faMoneyCheckDollar, faCartShopping, faArrowRightArrowLeft, faEnvelopeOpenText, faBell, faPizzaSlice, faChartColumn, faSackDollar, faPaperPlane, faGhost, faCalendarPlus, faCreditCard, faFileCode, faLaptopCode, faCloud, faCloudArrowUp, faHandHoldingDollar,faCrosshairs, faBullseye, faMoneyBillTransfer, faMoneyBillTrendUp} from '@fortawesome/free-solid-svg-icons'

library.add(faHome, faFileCirclePlus, faListCheck, faFolderPlus, faUserCheck, faCog, faCircleUser, faClockRotateLeft, faWarehouse, faScrewdriverWrench, faClipboardList, faEnvelopesBulk, faSuitcase, faShoePrints, faMoneyCheckDollar, faCartShopping, faArrowRightArrowLeft, faEnvelopeOpenText, faBell, faPizzaSlice, faChartColumn, faSackDollar, faPaperPlane, faGhost, faCalendarPlus, faCreditCard, faFileCode, faLaptopCode, faCloud, faCloudArrowUp, faHandHoldingDollar, faCrosshairs, faBullseye, faMoneyBillTransfer, faMoneyBillTrendUp)


const App = () => {
    return (
        <BrowserRouter>
            <Automation />
            <ToastContainer rtl/>
        </BrowserRouter>
    );
};

export default App;