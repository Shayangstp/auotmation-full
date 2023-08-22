import React from "react";
import { Table } from "react-bootstrap";
import xssFilters from "xss-filters";
import { useDispatch, useSelector } from "react-redux";
import { selectGoodsList, RsetSelectedGood, RsetGoodCode, RsetGoodName } from '../../Slices/goodSearchSlice';
import { selectCurrentReqItem } from './../../Slices/currentReqSlice';
import { handleEditWarehouseReqItemInvCode } from '../../Slices/warehouseSlice';

const GoodSearchList = () => {
    const dispatch = useDispatch();
    const goodsList = useSelector(selectGoodsList);
    const currentReqItem = useSelector(selectCurrentReqItem);

    return (
        <Table striped bordered hover responsive size="sm" variant="light">
            <thead>
                <tr>
                    <th className="bg-secondary text-white fw-normal">#</th>
                    <th className="bg-secondary text-white fw-normal">ردیف</th>
                    <th className="bg-secondary text-white fw-normal">کد کالا</th>
                    <th className="bg-secondary text-white fw-normal">شرح کالا</th>
                </tr>
            </thead>
            <tbody>
                {goodsList.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>
                                <input type='radio' name='selectedPro' value={item.ItemCode} onChange={()=>{
                                    dispatch(RsetSelectedGood({code: item.ItemCode, name: item.ItemName, unitName: item.UnitName, unitCode: item.UnitCode}));
                                    // dispatch(handleEditWarehouseReqItemInvCode({value: item.ItemCode, itemId: currentReqItem.itemId}));
                                    // dispatch(RsetGoodName(item.ItemName));
                                }}/>
                            </td>
                            <td>{index+1}</td>
                            <td>{<span>{xssFilters.inHTMLData(item.ItemCode)}</span>}</td>
                            <td>{<span>{xssFilters.inHTMLData(item.ItemName)}</span>}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default GoodSearchList;