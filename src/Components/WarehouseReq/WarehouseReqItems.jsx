import React, { useContext, useEffect, Fragment } from "react";
import { reqContext } from '../context/warehouseReqsContext/reqContext';
import { Table, Row, Button } from "react-bootstrap";
import DeleteRequestItemModal from "../Modals/WarehouseReqsModals/DeleteRequestItemModal";
import NumberFormat from "react-number-format";
import Select from 'react-select';
import DatePicker from "react-datepicker2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faLongArrowLeft } from '@fortawesome/free-solid-svg-icons';
import xssFilters from "xss-filters";
import { rootContext } from "../context/rootContext";
import AddPro from "./AddPro";
import AddProModal from "../Modals/WarehouseReqsModals/AddProModal";
import { useDispatch, useSelector } from "react-redux";

import { selectAcceptReqModal, selectDeleteReqItemModal, RsetDeleteReqItemModal } from '../Slices/modalsSlice';
import { selectUnitsOption, handleUnits, selectLoading } from "../Slices/mainSlices";
import {
    RsetWarehouseReqItemId, selectWarehouseReqItemId, handleEditWarehouseReqItemName,
    handleEditWarehouseReqItemAmount, handleEditWarehouseReqItemUnit, handleEditWarehouseReqItemMainPlace,
    handleEditWarehouseReqItemSubPlace, handleEditWarehouseReqItemDescription, handleEditWarehouseReqItemRattletrap,
    handleEditWarehouseReqItemConsumable, handleEditWarehouseReqItemBorrowed, handleEditWarehouseReqItemManagerComment
} from "../Slices/warehouseSlice";
import { selectCurrentReqItems, RsetCurrentReqItem, selectCurrentReqInfo, selectCurrentReqItem } from "../Slices/currentReqSlice";
import ReqItemDeliveryM from './../Modals/WarehouseReqsModals/ReqItemDeliveryModal';
import GoodSearchInputs from './../Common/GoodSearch/GoodSearchInputs';
import GoodSearchModal from "../Modals/Warehouse/GoodSearchModal";
import { selectGoodsModal, RsetPrevList } from "../Slices/goodSearchSlice";
import Loading from "../Common/Loading";

const ReqItems = ({ reqItemsOperation, edit }) => {
    const dispatch = useDispatch();
    const acceptReqModal = useSelector(selectAcceptReqModal);
    const unitsOption = useSelector(selectUnitsOption);
    const deleteReqItemModal = useSelector(selectDeleteReqItemModal);
    const warehouseReqItemId = useSelector(selectWarehouseReqItemId);
    const currentReqInfo = useSelector(selectCurrentReqInfo);
    const currentReqItems = useSelector(selectCurrentReqItems);
    const currentReqItem = useSelector(selectCurrentReqItem);
    const goodsModal = useSelector(selectGoodsModal);
    const loading = useSelector(selectLoading);

    const mainContext = useContext(rootContext)
    const {
        setReqItemDeliveryModal,
        setReqItemDetailsModal,
        handleGetProInfo,
        reqItemDeliveryModal
    } = mainContext;

    useEffect(() => {
        dispatch(handleUnits());
    }, [])

    useEffect(()=>{
        dispatch(RsetPrevList(currentReqItems))
    },[]);

    useEffect(()=>{
        if(currentReqInfo.typeId === 2 && acceptReqModal){
            console.log(currentItem)
            
        }
    },[currentReqInfo])


    const context = useContext(reqContext);
    const {
        handleAddWrhComment,
        handleAddManagerComment,
        numberOfDeliveries,
        setNumberOfDeliveries,
        deliveryTypeSelect,
        addProModal,
        currentItem,
        handleItemReceivedDetails
    } = context;

    const warehouseAcceptColumnsValue = (item) => {
        if (currentReqInfo.lastActionCode === 6) {
            if (acceptReqModal === true) {
                return (
                    <Fragment>
                        <td>
                            <Row className='mb-3 position-relative'>
                                {loading ? <Loading/> : <GoodSearchInputs showList={false} item={item}/>}
                                {goodsModal ? <GoodSearchModal item={currentReqItem}/> : null}
                            </Row>
                        </td>
                        <td>
                            <Select className="font12" defaultValue={{ label: 'ندارد', value: 0 }} onChange={(e) => {
                                dispatch(handleEditWarehouseReqItemRattletrap({ event: e, reqItemId: item.itemId }));
                            }}
                                placeholder='انتخاب' options={[{ label: 'دارد', value: 1 }, { label: 'ندارد', value: 0 }]}
                                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                        </td>
                        <td>
                            <Select className="font12" defaultValue={{ label: 'نیست', value: 0 }} onChange={(e) => {
                                dispatch(handleEditWarehouseReqItemConsumable({ event: e, reqItemId: item.itemId }));
                            }}
                                placeholder='انتخاب' options={[{ label: 'هست', value: 1 }, { label: 'نیست', value: 0 }]}
                                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                        </td>
                        <td>
                            <Select defaultValue={{ label: 'هست', value: 1 }} className="font12" onChange={(e) => {
                                dispatch(handleEditWarehouseReqItemBorrowed({ event: e, reqItemId: item.itemId }));
                            }}
                                placeholder='انتخاب' options={[{ label: 'هست', value: 1 }, { label: 'نیست', value: 0 }]}
                                menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} />
                        </td>
                        <td>
                            <textarea className="form-control font12" value={item.invKeeperComment !== null ? item.invKeeperComment : ''} onChange={(e) => { handleAddWrhComment(e.target.value, item.itemId) }} />
                        </td>
                    </Fragment>
                )
            } else {
                return null
            }
        } else if (currentReqItems.length !== 0 && currentReqItems[0].invCode !== undefined && currentReqItems[0].invCode !== null) {
            return (
                <Fragment>
                    <td className="font12 cursorPointer" onClick={() => {
                        handleGetProInfo(item.invCode)
                    }}>{xssFilters.inHTMLData(item.invCode)}</td>
                    <td className='font12'>{item.rattletrap === true ? 'دارد' : 'ندارد'}</td>
                    <td className='font12'>{item.consumable === true ? 'هست' : 'نیست'}</td>
                    <td className='font12'>{item.borrowed === true ? 'هست' : 'نیست'}</td>
                    <td className='font12'>{item.invKeeperComment !== null ? xssFilters.inHTMLData(item.invKeeperComment) : ''}</td>
                </Fragment>
            )
        }
    }
    const managerAcceptColumnsValue = (item) => {
        if (currentReqInfo.lastActionCode === 31) {
            if (acceptReqModal === true) {
                return (
                    <Fragment>
                        <td>
                            <textarea className="form-control font12" value={item.managerComment} onChange={(e) => { dispatch(handleEditWarehouseReqItemManagerComment({ event: e.target.value, reqItemId: item.itemId })) }} />
                        </td>
                    </Fragment>
                )
            } else {
                return null
            }
        } else if (currentReqItems.length !== 0 && currentReqItems[0].invCode !== undefined && currentReqItems[0].managerComment !== null) {
            return (
                <Fragment>
                    <td className='font12'>{item.managerComment !== (null || 'null') ? xssFilters.inHTMLData(item.managerComment) : ''}</td>
                </Fragment>
            )
        }
    }
    const warehouseDeliveryColumnsValue = (item) => {
        if (currentReqInfo.lastActionCode === 29) {
            if (acceptReqModal === true) {
                return (
                    <Fragment>
                        <td className="font12 cursorPointer" onClick={() => {
                            // dispatch(RsetCurrentReqItems(item))
                            handleItemReceivedDetails(item.itemId)
                        }}>{item.receivedAmount}</td>
                        <td className='font12'>{xssFilters.inHTMLData(item.itemAmount) - xssFilters.inHTMLData(item.receivedAmount)}</td>
                        <td className='font12'>
                            <div className="d-flex justify-content-between align-items-center">
                                {item.receivedAmount < item.itemAmount ? <Button variant='primary' size='sm' className="me-3 d-flex justify-content-between align-items-center" title='تحویل'
                                    onClick={() => {
                                        dispatch(RsetCurrentReqItem(item));
                                        setReqItemDeliveryModal(true);
                                    }}>
                                    <FontAwesomeIcon icon={faLongArrowLeft} />
                                </Button> : null}
                                <Button variant='warning' size='sm' className="d-flex justify-content-between align-items-center" title='اطلاعات آیتم'
                                    onClick={() => {
                                        dispatch(RsetCurrentReqItem(item));
                                        setReqItemDetailsModal(true);
                                    }}>
                                    <FontAwesomeIcon icon={faEye} />
                                </Button>
                            </div>
                        </td>
                    </Fragment>
                )
            } else {
                return null;
            }
        } else if (currentReqItems.length !== 0 && currentReqItems[0].invCode !== undefined && currentReqItems[0].deliveryHistoryId !== null) {
            return (
                <Fragment>
                    <td className='font12'>{xssFilters.inHTMLData(item.receivedAmount)}</td>
                    <td className='font12'>{xssFilters.inHTMLData(item.itemAmount) - xssFilters.inHTMLData(item.receivedAmount)}</td>
                </Fragment>
            )
        }
    }

    return (
        <div className="tableScroll table-responsive">
            <Table striped bordered hover size="sm" variant="light" className="font10">
                <thead>
                    <tr>
                        <th className="bg-secondary text-white fw-normal font12">ردیف</th>
                        {/* {currentReqInfo !== '' && currentReqInfo.process[currentReqInfo.process.length - 1].action_code === 29 && acceptReqModal === true ?
                            <th className="bg-secondary text-white fw-normal">خرید</th>
                            : null} */}
                        <th className="bg-secondary text-white fw-normal font12">نام کالا/آیتم درخواستی</th>
                        <th className="bg-secondary text-white fw-normal font12">تعداد/مقدار درخواستی</th>
                        <th className="bg-secondary text-white fw-normal font12">واحد شمارش</th>
                        <th className="bg-secondary text-white fw-normal font12">محل مصرف اصلی</th>
                        <th className="bg-secondary text-white fw-normal font12">محل مصرف فرعی</th>
                        <th className="bg-secondary text-white fw-normal font12">اطلاعات تکمیلی آیتم</th>
                        {reqItemsOperation === false ? null
                            : <th className="bg-secondary text-white fw-normal font12">عملیات</th>}
                        {(acceptReqModal && currentReqInfo.lastActionCode === 6) || (currentReqItems.length !== 0 && currentReqItems[0].invCode !== undefined && currentReqItems[0].invCode !== null)
                            ? <Fragment>
                                <th className="bg-secondary text-white fw-normal font12 w-510">کد معادل انبار</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">داغی</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">امانی</th>
                                <th className="bg-secondary text-white fw-normal font12 w-110">مصرفی</th>
                                <th className="bg-secondary text-white fw-normal font12">توضیحات انباردار</th>
                            </Fragment>
                            : null}
                        {(acceptReqModal && currentReqInfo.lastActionCode === 31) || (currentReqItems.length !== 0 && currentReqItems[0].managerComment !== undefined && currentReqItems[0].managerComment !== null)
                            ? <Fragment>
                                <th className="bg-secondary text-white fw-normal font12">توضیحات مدیر کارخانه</th>
                            </Fragment>
                            : null}
                        {(acceptReqModal && currentReqInfo.lastActionCode === 29)
                            ? <Fragment>
                                <th className="bg-secondary text-white fw-normal font12">تعداد/مقدار تحویلی</th>
                                <th className="bg-secondary text-white fw-normal font12">مانده</th>
                                <th className="bg-secondary text-white fw-normal font12">عملیات</th>
                            </Fragment>
                            : null}
                        {(currentReqItems.length !== 0 && currentReqItems[0].deliveryHistoryId !== undefined && currentReqItems[0].deliveryHistoryId !== null)
                            ? <Fragment>
                                <th className="bg-secondary text-white fw-normal font12">تعداد/مقدار تحویلی</th>
                                <th className="bg-secondary text-white fw-normal font12">مانده</th>
                            </Fragment>
                            : null}
                    </tr>
                </thead>
                <tbody>
                    {currentReqItems.length !== 0 ? currentReqItems.map((item, index) => {
                        return (
                            <tr key={item.itemId}>
                                <td className='font12'>{index + 1}</td>
                                {/* {currentReqInfo !== '' && currentReqInfo.process[currentReqInfo.process.length - 1].action_code === 29 && acceptReqModal === true ?
                                    <td>
                                        <input type='checkBox' onClick={(e) => {
                                            const items = [...purchaseItemsByWarehouseReq];
                                            items.push(item._id);
                                            setPurchaseItemsByWarehouseReq(items);
                                        }} />
                                    </td>
                                    : null} */}
                                <td>{edit === false ?
                                    <span className='font12'>{xssFilters.inHTMLData(item.itemName)}</span>
                                    :
                                    <input type='text' defaultValue={xssFilters.inHTMLData(item.itemName)} className='form-control font12' onChange={e => dispatch(handleEditWarehouseReqItemName({ event: e, reqItemId: item.itemId }))} />}
                                </td>
                                <td>{edit === false ?
                                    <span className='font12'>{xssFilters.inHTMLData(item.itemAmount)}</span>
                                    :
                                    <NumberFormat type="text" defaultValue={xssFilters.inHTMLData(item.itemAmount)} name="reqItemAmount" dir='ltr' className='form-control font12' onChange={e => dispatch(handleEditWarehouseReqItemAmount({ event: e, reqItemId: item.itemId }))} />}
                                </td>
                                <td>{edit === false ? <span className='font12'>{xssFilters.inHTMLData(item.itemUnit.label !== undefined ? item.itemUnit.label : item.itemUnit !== null ? item.itemUnit : '')}</span> :
                                    <Select
                                        placeholder='انتخاب...'
                                        isSearchable
                                        name='reqItemUnit'
                                        defaultValue={item.itemUnit.label !== undefined ? item.itemUnit : item.itemUnit !== '' ? { label: item.itemUnit, value: item.itemUnitCode } : ''}
                                        options={unitsOption}
                                        onChange={(option) => {
                                            dispatch(handleEditWarehouseReqItemUnit({ event: option, reqItemId: item.itemId }));
                                        }}
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        className="font12"
                                    />
                                }</td>
                                <td>{edit === false ?
                                    <span className='font12'>{xssFilters.inHTMLData(item.itemMainPlace)}</span>
                                    :
                                    <input type='text' defaultValue={xssFilters.inHTMLData(item.itemMainPlace !== undefined ? item.itemMainPlace : item.itemMainPlace)}
                                        className='form-control font12' onChange={e => dispatch(handleEditWarehouseReqItemMainPlace({ event: e, reqItemId: item.itemId }))}
                                    />}
                                </td>
                                <td>{edit === false ?
                                    <span className='font12'>{xssFilters.inHTMLData(item.itemSubPlace)}</span>
                                    :
                                    <input type='text' defaultValue={xssFilters.inHTMLData(item.itemSubPlace !== undefined ? item.itemSubPlace : item.itemSubPlace)}
                                        className='form-control font12' onChange={e => dispatch(handleEditWarehouseReqItemSubPlace({ event: e, reqItemId: item.itemId }))}
                                    />}
                                </td>
                                <td>{edit === false ?
                                    <span className='font12'>{item.itemDescription !== null ? xssFilters.inHTMLData(item.itemDescription) : ''}</span>
                                    :
                                    <input type='text' defaultValue={item.itemDescription !== null ? xssFilters.inHTMLData(item.itemDescription) : ''} className='form-control font12' onChange={(e) => {
                                        dispatch(handleEditWarehouseReqItemDescription({ event: e, reqItemId: item.itemId }))
                                    }} />}
                                </td>
                                {reqItemsOperation === false ? null
                                    : <td className="text-center">
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-danger cursorPointer" onClick={(e) => {
                                            dispatch(RsetDeleteReqItemModal(true));
                                            dispatch(RsetWarehouseReqItemId(item.itemId))
                                        }} />
                                        {deleteReqItemModal ? <DeleteRequestItemModal reqItemId={warehouseReqItemId} type={'warehouse'}/> : null}
                                    </td>
                                }
                                {currentReqInfo.length !== 0
                                    ? warehouseAcceptColumnsValue(item)
                                    : null
                                }
                                {currentReqInfo.length !== 0
                                    ? managerAcceptColumnsValue(item)
                                    : null
                                }
                                {currentReqInfo.length !== 0
                                    ? warehouseDeliveryColumnsValue(item)
                                    : null
                                }
                            </tr>
                        )
                    }) : null}
                </tbody>
            </Table>
        </div>
    )
}

export default ReqItems;