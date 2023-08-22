import React, { useEffect, Fragment } from "react";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import momentJalaali from "moment-jalaali";
import {
  selectCeramicMaterialModalSearch,
  RsetCeramicMaterialModalSearch,
  RsetCeramicAddMaterialCode,
  RsetCeramicAddMaterialName,
  RsetCeramicMaterialName,
  selectCeramicSelectedMatrial,
  RsetCeramicMaterialCode,
  RsetCeramicProjectMaterialPrice
} from "../../../Slices/ceramicPriceSlices";
import CeramicMaterialModalAdd from "./CeramicMaterialModalAdd";
import { RsetFormErrors } from "../../../Slices/mainSlices";

const CeramicMaterialModalSearch = () => {
  const dispatch = useDispatch();

  const ceramicMaterialModalSearch = useSelector(
    selectCeramicMaterialModalSearch
  );
  const ceramicSelectedMaterial = useSelector(selectCeramicSelectedMatrial);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={ceramicMaterialModalSearch}
      onHide={() => {
        dispatch(RsetCeramicMaterialModalSearch(false));
      }}
      dialogClassName="modal-96w overflow-visible-modal"
    >
      <Fragment>
        <Modal.Header className="d-block bg-primary text-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex justify-content-between"
          >
            <h2>جست و جوی قطعه / متریال</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <CeramicMaterialModalAdd />
          </div>
        </Modal.Body>
        <Modal.Footer className="d-block">
          <Button
            disabled={ceramicSelectedMaterial.code !== undefined ? false : true}
            onClick={() => {
              dispatch(RsetCeramicMaterialCode(ceramicSelectedMaterial.code));
              dispatch(RsetCeramicMaterialName(ceramicSelectedMaterial.name));
              dispatch(RsetCeramicProjectMaterialPrice(ceramicSelectedMaterial.price));
              dispatch(RsetCeramicMaterialModalSearch(false));
              dispatch(RsetCeramicAddMaterialCode(""));
              dispatch(RsetCeramicAddMaterialName(""));
            }}
          >
            انتخاب قطعه / متریال
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(RsetCeramicAddMaterialCode(""));
              dispatch(RsetCeramicAddMaterialName(""));
              dispatch(RsetCeramicMaterialModalSearch(false));
              dispatch(RsetFormErrors(""));
            }}
          >
            بستن
          </Button>
        </Modal.Footer>
      </Fragment>
    </Modal>
  );
};

export default CeramicMaterialModalSearch;

// import React, { useContext } from "react";
// import { Modal, Button } from "react-bootstrap";
// import { warehouseAddProCntxt } from '../../context/WarehouseContext/warehouse-addProCntxt';
// import WarehouseAddPro from "../../Common/Warehouse/Warehouse-AddPro";
// import { reqContext } from '../../context/warehouseReqsContext/reqContext';

// const WarehouseAddProModal = (itemId) => {
//     const WarehouseAddProContext = useContext(warehouseAddProCntxt);
//     const {
//         addProCodeRef,
//         addProModal,
//         setAddProModal,
//         selectedPro,
//         handleResetAddPro,
//         setAddProCode,
//         setAddProName,
//     } = WarehouseAddProContext;

//     const requestContext = useContext(reqContext);
//     const {
//         purchaseProTechSpecificationsRef,
//     } = requestContext;

//     return (
//         <Modal
//             size="s"
//             centered
//             backdrop="static"
//             show={addProModal}
//             onHide={() => {
//                 setAddProModal(false);
//             }}
//             dialogClassName="modal-96w"
//             scrollable={true}
//         >
//             <Modal.Body>
//                 <div>
//                     <WarehouseAddPro />
//                 </div>
//             </Modal.Body>
//             <Modal.Footer className="justify-content-around border-0 pb-5">
//                 <Button
//                     disabled={selectedPro.code !== undefined ? false : true}
//                     onClick={() => {
//                         setAddProCode(selectedPro.code);
//                         setAddProName(selectedPro.name);
//                         if(purchaseProTechSpecificationsRef !== undefined){
//                             purchaseProTechSpecificationsRef.current.focus();
//                         }
//                         handleResetAddPro();
//                         setAddProModal(false);
//                     }}
//                 >انتخاب کالا</Button>
//                 <Button variant="secondary" onClick={() => { handleResetAddPro(); setAddProModal(false); }}>بستن</Button>
//             </Modal.Footer>
//         </Modal>
//     )

// }

// export default WarehouseAddProModal;
