import React, { useEffect, Fragment } from "react";
import { Table, Form, Row, Button } from "react-bootstrap";
import DeleteRequestItemModal from "../../Modals/WarehouseReqsModals/DeleteRequestItemModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";
import NumberFormat from "react-number-format";
import Select from 'react-select';

import { useDispatch, useSelector } from "react-redux";
import {
    handleEditPurchaseReqItemAmount, handleEditPurchaseReqItemUnit, handleEditPurchaseReqItemPriority,
    handleEditPurchaseReqItemTechInfo, handleEditPurchaseReqItemPlaceOfUse, handleEditPurchaseReqItemMapCode,
    handleEditPurchaseReqItemProjectCode, selectPurchaseReqItemId, RsetPurchaseReqItemId,
    handleEditPurchaseReqItemAcceptedAmount, handleEditPurchaseReqItemAcceptedPriority, handleEditPurchaseReqItemBuyer,
    handlePurchaseReqItemSendToBuy
} from './../../Slices/purchaseSlice';
import { selectUnitsOption, handleUnits, handleUsersByRoles, selectUsersByRoleOptions, selectUser } from "../../Slices/mainSlices";
import { selectDeleteReqItemModal, RsetDeleteReqItemModal, selectAcceptReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqItems, selectCurrentReqInfo, selectCurrentReqItem, RsetCurrentReqItem } from "../../Slices/currentReqSlice";
import GoodSearchInputs from "../../Common/GoodSearch/GoodSearchInputs";
import GoodSearchModal from "../../Modals/Warehouse/GoodSearchModal";
import { selectGoodsModal } from "../../Slices/goodSearchSlice";
import { errorMessage } from "../../../utils/message";
import { RsetPrevList } from '../../Slices/goodSearchSlice';

const PurchaseReqItems = ({ reqItemsOperation, edit }) => {

    const dispatch = useDispatch();
    const unitsOption = useSelector(selectUnitsOption);
    const purchaseReqItemId = useSelector(selectPurchaseReqItemId);
    const deleteReqItemModal = useSelector(selectDeleteReqItemModal);
    const currentReqItems = useSelector(selectCurrentReqItems);
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const currentReqItem = useSelector(selectCurrentReqItem);
    const goodsModal = useSelector(selectGoodsModal);
    const usersByRoleOptions = useSelector(selectUsersByRoleOptions);
    const user = useSelector(selectUser);

    useEffect(() => {
        dispatch(handleUnits());
    }, [])

    useEffect(() => {
        if (currentReqInfo.lastActionCode === 26 && acceptReqModal === true) {
            dispatch(handleUsersByRoles({ roles: '39', location: user.Location, company: user.CompanyCode, exist: 1, dep: null, task: '0' }));
        }
    }, [currentReqInfo])

    useEffect(()=>{
        dispatch(RsetPrevList(currentReqItems))
    },[]);


    const supportAcceptColumnsValue = (item) => {
        if (currentReqInfo.lastActionCode === 26 && acceptReqModal === true && item.lastActionCode === 26) {
            return (
                <Fragment>
                    <td>
                        <input type="text" className="form-control font12" defaultValue={item.itemAmount} onChange={(e) => {
                            dispatch(handleEditPurchaseReqItemAcceptedAmount({ event: e, reqItemId: item.itemId }));
                        }}
                            menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                    </td>
                    <td>
                        <Select className="font12" defaultValue={{ label: item.itemPriorityName, value: item.itemPriorityCode }} onChange={(e) => {
                            dispatch(handleEditPurchaseReqItemAcceptedPriority({ event: e, reqItemId: item.itemId }));
                        }}
                            placeholder='انتخاب' options={[{ label: 'عادی', value: 1 }, { label: 'فوری', value: 2 }]}
                            menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                    </td>
                    <td>
                        <Select defaultValue={item.buyerId} className="font12" onChange={(e) => {
                            dispatch(handleEditPurchaseReqItemBuyer({ event: e, reqItemId: item.itemId }));
                        }}
                            placeholder='انتخاب' options={usersByRoleOptions}
                            menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                    </td>
                    <td>
                        <div className="d-flex align-items-center justify-content-center">
                            <Button size="sm" title='ارسال' className='btn btn-primary' onClick={() => {
                                dispatch(handlePurchaseReqItemSendToBuy(item));
                            }}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </div>
                    </td>
                </Fragment>
            )
        } else if (currentReqInfo.lastActionCode === 26 && acceptReqModal === true && item.lastActionCode !== 26) {
            return (
                <Fragment>
                    <td className='font12'>{item.acceptedAmount}</td>
                    <td className='font12'>{item.acceptedPriorityName}</td>
                    <td className='font12'>{item.buyerName}</td>
                    <td></td>
                </Fragment>
            )
        }
    }

    return (
        <div className="tableScroll table-responsive">
            <Table striped bordered hover size="sm" variant="light">
                <thead>
                    <tr>
                        <th className="bg-secondary text-white fw-normal">ردیف</th>
                        {edit === false ?
                            <Fragment>
                                <th className="bg-secondary text-white fw-normal">کد کالا</th>
                                <th className="bg-secondary text-white fw-normal w-510">شرح کالا</th>
                            </Fragment>
                            :
                            <th className="bg-secondary text-white fw-normal w-510">اطلاعات کالا</th>
                        }
                        <th className="bg-secondary text-white fw-normal w-110">تعداد/مقدار درخواستی</th>
                        <th className="bg-secondary text-white fw-normal w-110">واحد شمارش</th>
                        <th className="bg-secondary text-white fw-normal w-110">اولویت درخواستی</th>
                        <th className="bg-secondary text-white fw-normal w-110">مشخصات فنی</th>
                        <th className="bg-secondary text-white fw-normal w-110">محل مصرف</th>
                        <th className="bg-secondary text-white fw-normal w-110">کد نقشه</th>
                        <th className="bg-secondary text-white fw-normal w-110">کد پروژه</th>
                        {reqItemsOperation === false ? null
                            : <th className="bg-secondary text-white fw-normal">عملیات</th>}
                        {(acceptReqModal && currentReqInfo.lastActionCode === 26) || (currentReqItems.length !== 0 && currentReqItems[0].buyerId !== undefined && currentReqItems[0].buyerId !== null)
                            ? <Fragment>
                                <th className="bg-secondary text-white fw-normal font12 w-110">تعداد/مقدار مورد تایید</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">اولویت مورد تایید</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">واحد شمارش مورد تایید</th>
                            </Fragment>
                            : null}
                        {(acceptReqModal && currentReqInfo.lastActionCode === 26)
                            ? <Fragment>
                                <th className="bg-secondary text-white fw-normal font12 w-110">عملیات</th>
                            </Fragment>
                            : null}
                    </tr>
                </thead>
                <tbody>
                    {currentReqItems.map((item, index) => {
                        return (
                            <tr key={item.itemId}>
                                <td>{index + 1}</td>
                                {edit === false ?
                                    <Fragment>
                                        <td><span>{xssFilters.inHTMLData(item.invCode)}</span></td>
                                        <td><span>{xssFilters.inHTMLData(item.invName)}</span></td>
                                    </Fragment>
                                    :
                                    <td>
                                        <Row className='mb-3'>
                                            <GoodSearchInputs showList={false} item={item} />
                                            {goodsModal ? <GoodSearchModal item={currentReqItem} /> : null}
                                        </Row>
                                    </td>
                                }
                                <td>{edit === false ?
                                    <span>{xssFilters.inHTMLData(item.itemAmount)}</span>
                                    :
                                    <NumberFormat type="text" defaultValue={xssFilters.inHTMLData(item.itemAmount)} name="reqItemAmount" dir='ltr' className='form-control font12' onChange={e => dispatch(handleEditPurchaseReqItemAmount({ event: e, reqItemId: item.itemId }))} />
                                }</td>
                                <td>{edit === false ?
                                    <span>{item.itemUnit !== undefined && item.itemUnit.label !== undefined ? xssFilters.inHTMLData(item.itemUnit.label) : item.itemUnitName}</span>
                                    :
                                    <Select
                                        placeholder='انتخاب...'
                                        isSearchable
                                        name='reqItemUnit'
                                        defaultValue={item.itemUnit !== undefined && item.itemUnit.label !== undefined ? item.itemUnit : item.itemUnitName !== '' ? { label: item.itemUnitName, value: item.itemUnitCode } : ''}
                                        options={unitsOption}
                                        onChange={(option) => {
                                            dispatch(handleEditPurchaseReqItemUnit({ event: option, reqItemId: item.itemId }));
                                        }}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        className="font12"
                                    />
                                }</td>
                                <td>{edit === false ?
                                    <span>{item.itemPriority !== undefined && item.itemPriority.label !== undefined ? xssFilters.inHTMLData(item.itemPriority.label) : item.itemPriorityName}</span>
                                    :
                                    <Select
                                        placeholder='انتخاب...'
                                        isSearchable
                                        name='reqItemUnit'
                                        defaultValue={item.itemPriority !== undefined && item.itemPriority.label !== undefined ? item.itemPriority : item.itemPriorityName !== '' ? { label: item.itemPriorityName, value: item.itemUnitCode } : ''}
                                        options={[{ label: 'عادی', value: 1 }, { label: 'فوری', value: 2 }]}
                                        onChange={(option) => {
                                            dispatch(handleEditPurchaseReqItemPriority({ event: option, reqItemId: item.itemId }));
                                        }}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        className="font12"
                                    />
                                }</td>
                                <td>{edit === false ?
                                    <span>{item.itemTechInfo !== null ? xssFilters.inHTMLData(item.itemTechInfo) : ''}</span>
                                    :
                                    <Form.Control type="text" value={item.itemTechInfo !== null ? item.itemTechInfo : ''} name="reqItemTechInfo" onChange={(e) => {
                                        dispatch(handleEditPurchaseReqItemTechInfo({ event: e.target.value, reqItemId: item.itemId }))
                                    }} />
                                }</td>
                                <td>{edit === false ?
                                    <span>{item.usePlace !== null ? xssFilters.inHTMLData(item.usePlace) : ''}</span>
                                    :
                                    <Form.Control type="text" value={item.usePlace !== null ? item.usePlace : ''} name="reqItemPlaceOfUse" onChange={(e) => {
                                        dispatch(handleEditPurchaseReqItemPlaceOfUse({ event: e.target.value, reqItemId: item.itemId }))
                                    }} />
                                }</td>
                                <td>{edit === false ?
                                    <span>{item.planNo !== null ? xssFilters.inHTMLData(item.planNo) : ''}</span>
                                    :
                                    <Form.Control type="text" value={item.planNo !== null ? item.planNo : ''} name="reqItemMapCode" onChange={(e) => {
                                        dispatch(handleEditPurchaseReqItemMapCode({ event: e.target.value, reqItemId: item.itemId }))
                                    }} />
                                }</td>
                                <td>{edit === false ?
                                    <span>{item.projectNo !== null ? xssFilters.inHTMLData(item.projectNo) : ''}</span>
                                    :
                                    <Form.Control type="text" value={item.projectNo !== null ? item.projectNo : ''} name="reqItemProjectCode" onChange={(e) => {
                                        dispatch(handleEditPurchaseReqItemProjectCode({ event: e.target.value, reqItemId: item.itemId }))
                                    }} />
                                }</td>
                                {reqItemsOperation === false ? null
                                    : <td className="text-center">
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-danger cursorPointer" onClick={() => {
                                            dispatch(RsetDeleteReqItemModal(true));
                                            dispatch(RsetPurchaseReqItemId(item.itemId))
                                        }} />
                                        {deleteReqItemModal ? <DeleteRequestItemModal reqItemId={purchaseReqItemId} type={'purchase'} /> : null}
                                    </td>
                                }
                                {supportAcceptColumnsValue(item)}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default PurchaseReqItems;