import React, { useEffect, Fragment } from "react";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import momentJalaali from "moment-jalaali";
import {
  selectIrantoolMaterialModalSearch,
  RsetIrantoolMaterialModalSearch,
  selectIrantoolSelectMaterial,
  RsetIrantoolMaterialCode,
  RsetIrantoolMaterialName,
  RsetIrantoolSelectMaterial,
} from "../../../Slices/irantoolSlices";
import IrantoolMaterialModalAdd from "./IrantoolMaterialModalAdd";
// import { RsetFormErrors } from "../../Slices/mainSlices";

const IrantoolMaterialModalSearch = () => {
  const dispatch = useDispatch();

  const irantoolMaterialModalSearch = useSelector(
    selectIrantoolMaterialModalSearch
  );
  const irantoolSelectMaterial = useSelector(selectIrantoolSelectMaterial);

  // useEffect(() => {
  //   dispatch(RsetCeramicAddMaterialList([]));
  //   dispatch(RsetCeramicSelectedMaterial(""));
  //   dispatch(RsetCeramicMaterialCode(""));
  // }, []);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={irantoolMaterialModalSearch}
      onHide={() => {
        dispatch(RsetIrantoolMaterialModalSearch(false));
      }}
      dialogClassName="modal-96w overflow-visible-modal"
    >
      <Fragment>
        <Modal.Header className="d-block bg-primary text-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex justify-content-between"
          >
            <h2>جست و جوی کالا</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <IrantoolMaterialModalAdd />
          </div>
        </Modal.Body>
        <Modal.Footer className="d-block">
          <Button
            disabled={irantoolSelectMaterial.code !== undefined ? false : true}
            onClick={() => {
              dispatch(RsetIrantoolMaterialCode(irantoolSelectMaterial.code));
              dispatch(RsetIrantoolMaterialName(irantoolSelectMaterial.name));

              dispatch(RsetIrantoolMaterialModalSearch(false));
              dispatch(RsetIrantoolSelectMaterial(""));
            }}
          >
            انتخاب قطعه / متریال
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(RsetIrantoolMaterialCode(""));
              dispatch(RsetIrantoolMaterialName(""));
              dispatch(RsetIrantoolMaterialModalSearch(false));
              // dispatch(RsetFormErrors(""));
            }}
          >
            بستن
          </Button>
        </Modal.Footer>
      </Fragment>
    </Modal>
  );
};

export default IrantoolMaterialModalSearch;
