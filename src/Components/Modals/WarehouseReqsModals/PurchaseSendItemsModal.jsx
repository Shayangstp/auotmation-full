import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Table, Form, Row, Col } from "react-bootstrap";
import moment from 'moment-jalaali';
import xssFilters from "xss-filters";
import Select from 'react-select';

import { selectUser, selectUsersByRoleOptions, handleUsersByRoles, selectUsersByRole, RsetUsersByRole, handleUnits, selectUnitsOption } from '../../Slices/mainSlices';
import {
    selectPurchaseSendItemsModal, RsetPurchaseSendItemsModal, selectSelectedPurchaseItems, handleAcceptPurchaseItem,
    handleUsersBySupportSupervisorRole, selectUsersBySupportSupervisor, RsetUsersBySupportSupervisor, selectUsersBySupportSupervisorOptions, RsetSelectedPurchaseItems
} from '../../Slices/purchaseSlice';
import { selectCurrentReqItem, RsetCurrentReqItem } from './../../Slices/currentReqSlice';
import { errorMessage } from "../../../utils/message";


const PurchaseSendItemsModal = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const purchaseSendItemsModal = useSelector(selectPurchaseSendItemsModal);
    const selectedPurchaseItems = useSelector(selectSelectedPurchaseItems);
    const usersByRoleOptions = useSelector(selectUsersByRoleOptions);
    const usersByRole = useSelector(selectUsersByRole);
    const usersBySupportSupervisor = useSelector(selectUsersBySupportSupervisor);
    const usersBySupportSupervisorOptions = useSelector(selectUsersBySupportSupervisorOptions);
    const currentReqItem = useSelector(selectCurrentReqItem);
    const unitsOption = useSelector(selectUnitsOption);

    useEffect(() => {
        dispatch(handleUnits());
    }, [])

    useEffect(() => {
        if (user.Location !== undefined) {
            if (user.Roles.some(role => role === '37')) {
                dispatch(handleUsersByRoles({ roles: '40', location: user.Location, company: user.CompanyCode, exist: 1, dep: null, task: '0' }));
            } else if (user.Roles.some(role => role === '40')) {
                dispatch(handleUsersByRoles({ roles: '38', location: user.Location, company: user.CompanyCode, exist: 1, dep: null, task: '0' }));
                dispatch(handleUsersBySupportSupervisorRole({ roles: '41', location: user.Location, company: user.CompanyCode, exist: 1, dep: null, task: '0' }));
            } else if (user.Roles.some(role => role === '41')) {
                dispatch(handleUsersByRoles({ roles: '39', location: user.Location, company: user.CompanyCode, exist: 1, dep: null, task: '0' }));
            }
        }
    }, [user])

    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={purchaseSendItemsModal}
            onHide={() => {
                dispatch(RsetPurchaseSendItemsModal(false));
            }}
            dialogClassName="modal-96w overflow-visible-modal"
            scrollable={true}
            id='modalBlur'
        >
            <Modal.Header className='d-block bg-success text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-center">
                    اطلاعات آیتم ها
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-5">
                <div className="tableScroll table-responsive">
                    <Table striped bordered hover size="sm" variant="light">
                        <thead>
                            <tr>
                                <th className="bg-secondary text-white fw-normal font12 w-110">سریال درخواست</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">تاریخ ثبت درخواست</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">درخواست کننده</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">کد کالا</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">نام کالا</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">تعداد/مقدار درخواستی</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">واحد شمارش</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">اولویت درخواستی</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">مشخصات فنی</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">محل مصرف</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">کد نقشه</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">کد پروژه</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">وضعیت آیتم</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">تعداد/مقدار مورد تایید</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">واحد شمارش مورد تایید</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">اولویت مورد تایید</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPurchaseItems.map(item => {
                                return (
                                    <tr>
                                        <td>{xssFilters.inHTMLData(item.serial)}</td>
                                        <td>{moment.utc(item.createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</td>
                                        <td>{xssFilters.inHTMLData(item.fullName)}</td>
                                        <td>{xssFilters.inHTMLData(item.invCode)}</td>
                                        <td>{xssFilters.inHTMLData(item.invName)}</td>
                                        <td>{xssFilters.inHTMLData(item.itemAmount)}</td>
                                        <td>{xssFilters.inHTMLData(item.itemUnitName)}</td>
                                        <td>{xssFilters.inHTMLData(item.itemPriorityName)}</td>
                                        <td>{item.itemTechInfo !== null ? xssFilters.inHTMLData(item.itemTechInfo) : ''}</td>
                                        <td>{item.usePlace !== null ? xssFilters.inHTMLData(item.usePlace) : ''}</td>
                                        <td>{item.planNo !== null ? xssFilters.inHTMLData(item.planNo) : ''}</td>
                                        <td>{item.projectNo !== null ? xssFilters.inHTMLData(item.projectNo) : ''}</td>
                                        <td>{xssFilters.inHTMLData(item.statusName)}</td>
                                        <td>{item.lastActionCode === 46 ?
                                            <input type="text" className="form-control font12" defaultValue={item.itemAmount} onChange={(e) => {
                                                const items = [...selectedPurchaseItems];
                                                const itemIndex = items.findIndex(tr => tr.itemId === item.itemId);
                                                const thisItem = { ...items[itemIndex] };
                                                thisItem.acceptedAmount = e.target.value;
                                                const allItems = [...items];
                                                allItems[itemIndex] = thisItem;
                                                dispatch(RsetSelectedPurchaseItems(allItems));
                                            }}
                                                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                                            : item.acceptedAmount !== null ? xssFilters.inHTMLData(item.acceptedAmount) : ''}
                                        </td>
                                        <td>{item.lastActionCode === 46 ?
                                            <Select className="font12" defaultValue={{ label: item.itemUnitName, value: item.itemUnitCode }} onChange={(e) => {
                                                const items = [...selectedPurchaseItems];
                                                const itemIndex = items.findIndex(tr => tr.itemId === item.itemId);
                                                const thisItem = { ...items[itemIndex] };
                                                thisItem.acceptedUnitCode = e;
                                                const allItems = [...items];
                                                allItems[itemIndex] = thisItem;
                                                dispatch(RsetSelectedPurchaseItems(allItems));
                                            }}
                                                placeholder='انتخاب' options={unitsOption}
                                                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                                            : item.acceptedUnitName !== null ? xssFilters.inHTMLData(item.acceptedUnitName) : ''}
                                        </td>
                                        <td>{item.lastActionCode === 46 ?
                                            <Select className="font12" defaultValue={{ label: item.itemPriorityName, value: item.itemPriorityCode }} onChange={(e) => {
                                                const items = [...selectedPurchaseItems];
                                                const itemIndex = items.findIndex(tr => tr.itemId === item.itemId);
                                                const thisItem = { ...items[itemIndex] };
                                                thisItem.acceptedPriorityCode = e;
                                                const allItems = [...items];
                                                allItems[itemIndex] = thisItem;
                                                dispatch(RsetSelectedPurchaseItems(allItems));
                                            }}
                                                placeholder='انتخاب' options={[{ label: 'عادی', value: 1 }, { label: 'فوری', value: 2 }]}
                                                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                                            : item.acceptedPriorityName !== null ? xssFilters.inHTMLData(item.acceptedPriorityName) : ''}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between flex-wrap">
                <div className="d-flex align-items-center flex-wrap">
                    {user.Roles.some(role => role === '37') || user.Roles.some(role => role === '40') || user.Roles.some(role => role === '41') ?
                        <Select className="me-2 mb-2" value={usersByRole} name="usersByRole" onChange={(e) => { dispatch(RsetUsersByRole(e)) }} placeholder={user.Roles.some(role => role === '37') ? 'ارسال به پشتیبانی' : user.Roles.some(role => role === '40') ? 'ارسال به مدیر پشتیبانی' : 'ارسال به مامور خرید'} options={usersByRoleOptions} />
                        : null}
                    {user.Roles.some(role => role === '40') ?
                        <Select className="me-2 mb-2" value={usersBySupportSupervisor} name="usersBySupportSupervisor" onChange={(e) => { dispatch(RsetUsersBySupportSupervisor(e)) }} placeholder='ارسال به سرپرست خرید' options={usersBySupportSupervisorOptions} />
                        : null}
                    <Button
                        className="mb-2"
                        variant="success"
                        onClick={() => {
                            if (user.Roles.some(role => role === '37' || role === '41') && usersByRole !== '') {
                                dispatch(handleAcceptPurchaseItem());
                            } else if (user.Roles.some(role => role === '40') && usersByRole !== '' && usersBySupportSupervisor !== '') {
                                dispatch(handleAcceptPurchaseItem());
                            } else if (user.Roles.some(role => role === '38')) {
                                dispatch(handleAcceptPurchaseItem());
                            } else {
                                errorMessage('شخصی برای ارسال انتخاب نشده است!');
                            }
                        }}
                    >
                        ارسال آیتم های انتخاب شده
                    </Button>
                </div>
                <Button
                    onClick={() => {
                        dispatch(RsetUsersByRole(''));
                        dispatch(RsetPurchaseSendItemsModal(false));
                    }}
                    variant="secondary"
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PurchaseSendItemsModal;