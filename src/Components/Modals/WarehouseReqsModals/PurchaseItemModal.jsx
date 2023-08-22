import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Table, Form } from "react-bootstrap";
import moment from 'moment-jalaali';
import xssFilters from "xss-filters";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { selectUser, selectUsersByRoleOptions, handleUsersByRoles } from '../../Slices/mainSlices';
import { selectCurrentReqItem, RsetCurrentReqItem } from '../../Slices/currentReqSlice';
import { selectPurchaseItemModal, RsetPurchaseItemModal, handlePurchaseReqItemSendToBuy } from '../../Slices/purchaseSlice';

const PurchaseItemModal = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const purchaseItemModal = useSelector(selectPurchaseItemModal);
    const currentReqItem = useSelector(selectCurrentReqItem);
    const usersByRoleOptions = useSelector(selectUsersByRoleOptions);

    const acceptedAmount = (item) => {
        return (
            <input type="text" className="form-control font12" defaultValue={item.itemAmount} onChange={(e) => {
                const item = { ...currentReqItem };
                item.acceptedAmount = e.target.value;
                dispatch(RsetCurrentReqItem(item));
            }}
                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
        )
    }
    const acceptedPriority = (item) => {
        return (
            <Select className="font12" defaultValue={{ label: item.itemPriorityName, value: item.itemPriorityCode }} onChange={(e) => {
                const item = { ...currentReqItem };
                item.acceptedPriorityCode = e;
                dispatch(RsetCurrentReqItem(item));
            }}
                placeholder='انتخاب' options={[{ label: 'عادی', value: 1 }, { label: 'فوری', value: 0 }]}
                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
        )
    }
    useEffect(() => {
        if (user.Location !== undefined) {
            dispatch(handleUsersByRoles({ roles: '39', location: user.Location, company: user.CompanyCode, exist: 1, dep: null, task: '0' }));
        }
    }, [user])
    const buyer = (item) => {
        return (
            <Select defaultValue={item.buyerId} className="font12" onChange={(e) => {
                const item = { ...currentReqItem };
                item.buyerId = e;
                dispatch(RsetCurrentReqItem(item));
            }}
                placeholder='انتخاب' options={usersByRoleOptions}
                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
        )
    }
    const operation = () => {
        if(currentReqItem.lastActionCode === 26){
            return (
                <div className="d-flex align-items-center justify-content-center">
                    <Button size="sm" title='ارسال' className='btn btn-primary' onClick={() => {
                        dispatch(handlePurchaseReqItemSendToBuy(currentReqItem));
                    }}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            )   
        }else{
            return null;
        }
    }
    return (
        <Modal
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            show={purchaseItemModal}
            onHide={() => {
                dispatch(RsetPurchaseItemModal(false));
            }}
            dialogClassName="modal-96w overflow-visible-modal"
            scrollable={true}
            id='modalBlur'
        >
            <Modal.Header className='d-block bg-secondary text-white'>
                <Modal.Title id="contained-modal-title-vcenter" className="d-flex justify-content-center">
                    اطلاعات آیتم
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
                                <th className="bg-secondary text-white fw-normal font12 w-110">اولویت مورد تایید</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">مامور خرید</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{xssFilters.inHTMLData(currentReqItem.serial)}</td>
                                <td>{moment.utc(currentReqItem.createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.fullName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.invCode)}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.invName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.itemAmount)}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.itemUnitName)}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.itemPriorityName)}</td>
                                <td>{currentReqItem.itemTechInfo !== null ? xssFilters.inHTMLData(currentReqItem.itemTechInfo) : ''}</td>
                                <td>{currentReqItem.usePlace !== null ? xssFilters.inHTMLData(currentReqItem.usePlace) : ''}</td>
                                <td>{currentReqItem.planNo !== null ? xssFilters.inHTMLData(currentReqItem.planNo) : ''}</td>
                                <td>{currentReqItem.projectNo !== null ? xssFilters.inHTMLData(currentReqItem.projectNo) : ''}</td>
                                <td>{xssFilters.inHTMLData(currentReqItem.statusName)}</td>
                                <td>{currentReqItem.lastActionCode === 26 ? acceptedAmount(currentReqItem) : xssFilters.inHTMLData(currentReqItem.acceptedAmount)}</td>
                                <td>{currentReqItem.lastActionCode === 26 ? acceptedPriority(currentReqItem) : xssFilters.inHTMLData(currentReqItem.acceptedPriorityName)}</td>
                                <td>{currentReqItem.lastActionCode === 26 ? buyer(currentReqItem) : xssFilters.inHTMLData(currentReqItem.buyerName)}</td>
                                <td>{operation()}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
                <Button
                    onClick={() => {
                        dispatch(RsetCurrentReqItem({}));
                        dispatch(RsetPurchaseItemModal(false));
                    }}
                    variant="secondary"
                >بستن</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PurchaseItemModal;