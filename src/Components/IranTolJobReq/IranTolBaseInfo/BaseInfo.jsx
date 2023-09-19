import React, { Fragment } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import AddOperatingUnitForm from "./AddOperatingUnitForm";
import BaseInfoTable from "./BaseInfoTable";
import ChangeUserRole from "../../Common/Role/ChangeUserRole";
import { selectUsersByRoleOptions, selectAddRole, RsetAddRole, RsetUsersByRole, RsetRoles } from '../../Slices/mainSlices';
import { handleIrtUsersByRole, selectIrantoolUsersByRoleList, handleOperationUnitList, selectIrantoolOperationUnitList, selectIrantoolOperatorList, handleOperatorList,
    handleOperationList, selectIrantoolOperationList, handleReasonOfDelayList, selectIrantoolReasonOfDelayList
} from '../../Slices/irantoolSlices';
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare, faCancel } from '@fortawesome/free-solid-svg-icons';
import OperationForm from "./OperationForm";
import OperatorForm from "./OperatorForm";
import ReasonOfDelayForm from "./ReasonOfDelayForm";
import IrantoolDevicesList from "../IranTolDevices/IrantoolDevicesList";

const BaseInfo = () => {
    const dispatch = useDispatch();
    const irantoolUsersByRoleList = useSelector(selectIrantoolUsersByRoleList);
    const irantoolOperationUnitList = useSelector(selectIrantoolOperationUnitList);
    const addRole = useSelector(selectAddRole);
    const irantoolOperatorList = useSelector(selectIrantoolOperatorList)
    const irantoolOperationList = useSelector(selectIrantoolOperationList)
    const irantoolReasonOfDelayList = useSelector(selectIrantoolReasonOfDelayList)

    return (
        <Container fluid>
            <Tabs defaultActiveKey={1}>
                <Tab eventKey={1} title="واحدهای عملیاتی" className="pt-5">
                    <div className="d-flex align-items-center mb-5">
                        <FontAwesomeIcon icon={faPlusSquare} className="btn-success font24 py-1 px-2 rounded me-2" onClick={() => {
                            dispatch(RsetAddRole(true));
                        }} />
                        افزودن
                        <FontAwesomeIcon icon={faMinusSquare} className="btn-danger font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                            dispatch(RsetAddRole(false));
                        }} />
                        حذف
                        {addRole === true || addRole === false ? <Fragment>
                            <FontAwesomeIcon icon={faCancel} className="btn-secondary font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                                dispatch(RsetAddRole(null));
                                dispatch(RsetUsersByRole(''));
                                dispatch(RsetRoles([]));
                            }} />
                            انصراف
                        </Fragment> : null}
                    </div>
                    {addRole === true || addRole === false ? <AddOperatingUnitForm /> : null}
                    <BaseInfoTable handleList={handleOperationUnitList} list={irantoolOperationUnitList} role='operatingUnit' />
                </Tab>
                <Tab eventKey={2} title="تایید کننده QC" className="pt-5">
                    <div className="d-flex align-items-center mb-5">
                        <FontAwesomeIcon icon={faPlusSquare} className="btn-success font24 py-1 px-2 rounded me-2" onClick={() => {
                            dispatch(RsetAddRole(true));
                        }} />
                        افزودن نقش
                        <FontAwesomeIcon icon={faMinusSquare} className="btn-danger font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                            dispatch(RsetAddRole(false));
                        }} />
                        حذف نقش
                        {addRole === true || addRole === false ? <Fragment>
                            <FontAwesomeIcon icon={faCancel} className="btn-secondary font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                                dispatch(RsetAddRole(null));
                                dispatch(RsetUsersByRole(''));
                                dispatch(RsetRoles([]));
                            }} />
                            انصراف
                        </Fragment> : null}
                    </div>
                    {addRole === true || addRole === false ? <ChangeUserRole /> : null}
                    <BaseInfoTable handleList={handleIrtUsersByRole} list={irantoolUsersByRoleList} role='changeUserRole' />
                </Tab>
                <Tab eventKey={3} title="اپراتور ها" className="pt-5">
                    <div className="d-flex align-items-center mb-5">
                        <FontAwesomeIcon icon={faPlusSquare} className="btn-success font24 py-1 px-2 rounded me-2" onClick={() => {
                            dispatch(RsetAddRole(true));
                        }} />
                        افزودن اپراتور
                        <FontAwesomeIcon icon={faMinusSquare} className="btn-danger font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                            dispatch(RsetAddRole(false));
                        }} />
                        حذف اپراتور
                        {addRole === true || addRole === false ? <Fragment>
                            <FontAwesomeIcon icon={faCancel} className="btn-secondary font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                                dispatch(RsetAddRole(null));
                                dispatch(RsetUsersByRole(''));
                                dispatch(RsetRoles([]));
                            }} />
                            انصراف
                        </Fragment> : null}
                    </div>
                    {addRole === true || addRole === false ? <OperatorForm /> : null}
                    <BaseInfoTable handleList={handleOperatorList} list={irantoolOperatorList} role='OperatorRole' />
                </Tab>
                <Tab eventKey={4} title="عملیات" className="pt-5">
                    <div className="d-flex align-items-center mb-5">
                        <FontAwesomeIcon icon={faPlusSquare} className="btn-success font24 py-1 px-2 rounded me-2" onClick={() => {
                            dispatch(RsetAddRole(true));
                        }} />
                        افزودن عملیات
                        <FontAwesomeIcon icon={faMinusSquare} className="btn-danger font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                            dispatch(RsetAddRole(false));
                        }} />
                        حذف عملیات
                        {addRole === true || addRole === false ? <Fragment>
                            <FontAwesomeIcon icon={faCancel} className="btn-secondary font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                                dispatch(RsetAddRole(null));
                                dispatch(RsetUsersByRole(''));
                                dispatch(RsetRoles([]));
                            }} />
                            انصراف
                        </Fragment> : null}
                    </div>
                    {addRole === true || addRole === false ? <OperationForm /> : null}
                    <BaseInfoTable handleList={handleOperationList} list={irantoolOperationList} role='OperationRole' />
                </Tab>
                <Tab eventKey={5} title="علت تاخیر" className="pt-5">
                    <div className="d-flex align-items-center mb-5">
                        <FontAwesomeIcon icon={faPlusSquare} className="btn-success font24 py-1 px-2 rounded me-2" onClick={() => {
                            dispatch(RsetAddRole(true));
                        }} />
                        افزودن علت
                        <FontAwesomeIcon icon={faMinusSquare} className="btn-danger font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                            dispatch(RsetAddRole(false));
                        }} />
                        حذف علت
                        {addRole === true || addRole === false ? <Fragment>
                            <FontAwesomeIcon icon={faCancel} className="btn-secondary font24 py-1 px-2 rounded me-2 ms-4" onClick={() => {
                                dispatch(RsetAddRole(null));
                                dispatch(RsetUsersByRole(''));
                                dispatch(RsetRoles([]));
                            }} />
                            انصراف
                        </Fragment> : null}
                    </div>
                    {addRole === true || addRole === false ? <ReasonOfDelayForm /> : null}
                    <BaseInfoTable handleList={handleReasonOfDelayList} list={irantoolReasonOfDelayList} role='ReasonOfDelayRole' />
                </Tab>
                <Tab eventKey={6} title="دستگاه ها" className="pt-5">
                    <IrantoolDevicesList />
                </Tab>
            </Tabs>
        </Container>
    );
};
export default BaseInfo;