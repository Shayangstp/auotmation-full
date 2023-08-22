import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import xssFilters from "xss-filters";
import {
  selectCeramicAddMaterialList,
  RsetCeramicAddMaterialCode,
  selectCeramicAddMaterialCode,
  selectCeramicAddMaterialName,
  RsetCeramicAddMaterialName,
  RsetCeramicSelectedMatrial,
  selectCeramicSelectedMatrial,
} from "../../../Slices/ceramicPriceSlices";

const CeramicMaterialModalList = () => {
  const dispatch = useDispatch();
  const ceramicAddMaterialList = useSelector(selectCeramicAddMaterialList);

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
        {ceramicAddMaterialList.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="radio"
                    name="ceramicSelectedMatrial"
                    value={item.ItemCode}
                    onChange={() => {
                      dispatch(
                        RsetCeramicSelectedMatrial({
                          code: item.itemCode,
                          name: item.itemName,
                          price: item.itemCost
                        })
                      );
                    }}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{<span>{xssFilters.inHTMLData(item.itemCode)}</span>}</td>
                <td>{<span>{xssFilters.inHTMLData(item.itemName)}</span>}</td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

export default CeramicMaterialModalList;
