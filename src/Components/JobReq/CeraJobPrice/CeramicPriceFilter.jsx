import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Table,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import DatePicker from "react-datepicker2";
import Select from "react-select";
import NumberFormat from "react-number-format";
import {
  selectFilterMaterialCode,
  RsetFilterMaterialCode,
  selectFilterMaterialName,
  RsetFilterMaterialName,
  selectRealFilter,
  RsetRealFilter,
} from "../Slices/filterSlices";

const CeramicPriceFilter = () => {
  const dispatch = useDispatch();
  const filterMaterialCode = useSelector(selectFilterMaterialCode);
  const filterMaterialName = useSelector(selectFilterMaterialName);
  const realFilter = useSelector(selectRealFilter);

  return (
    <Container fluid className="pb-4">
      <Row className="mb-2 mt-4">
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-0 mb-md-4">
          <Form.Label htmlFor="materialCode">کد قطعه / متریال:</Form.Label>
          <NumberFormat
            dir="ltr"
            id="filterMaterialCode"
            type="text"
            maxLength={10}
            className="form-control"
            value={filterMaterialCode}
            onKeyDown={(e) => {
              if (realFilter === true) {
                
              }
            }}
            onChange={(e) => {
              dispatch(RsetFilterMaterialCode(e.target.value));
              if (realFilter === true) {
                
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="5" xl="4" className="mb-4 mb-xl-0 mb-md-4">
          <Form.Label htmlFor="materialName">نام / شرح قطعه:</Form.Label>
          <Form.Control
            id="materialName"
            name="materialName"
            type="text"
            value={filterMaterialName}
            onChange={(e) => {
              dispatch(RsetFilterMaterialName(e.target.value));
              if (realFilter === true) {
                
              }
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" xl="2" className="mb-4 mb-xl-0 mb-lg-2">
          <Form.Label htmlFor="materialCode"> قیمت:</Form.Label>
          <NumberFormat
            dir="ltr"
            id="materialCode"
            type="text"
            thousandSeparator=","
            className="form-control"
            // value={serialFilter}
            onChange={(e) => {
              // dispatch(RsetSerialFilter(e.target.value));
            }}
          />
        </Form.Group>
        <Form.Group as={Col} md="2" className="mb-4 mb-xl-0 mb-lg-2">
          <Form.Label>از تاریخ:</Form.Label>
          <DatePicker
            timePicker={false}
            showTodayButton={false}
            isGregorian={false}
            // value={fromDateFilter}
            // onChange={(value) => {
            //   dispatch(RsetFromDateFilter(value));
            // }}
            className="form-control"
            inputReadOnly
          />
        </Form.Group>
        <Form.Group as={Col} md="3" xl="2" className="mb-4 mb-xl-4 mb-lg-2">
          <Form.Label>تا تاریخ:</Form.Label>
          <DatePicker
            timePicker={false}
            showTodayButton={false}
            isGregorian={false}
            // value={toDateFilter}
            // onChange={(value) => {
            //   dispatch(RsetToDateFilter(value));
            // }}
            className="form-control overflow-auto"
            inputReadOnly
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="3"
          xl="2"
          className="d-flex flex-column justify-xl-end"
        >
          <div className="d-flex">
            <Form.Check
              type="checkbox"
              id="filter"
              value={realFilter}
              checked={realFilter}
              onChange={() => {
                dispatch(RsetRealFilter(!realFilter));
              }}
            />
            <Form.Label className="font12 ms-2">فیلترلحظه ای</Form.Label>
          </div>
          <div className="align-items-end">
            <Button
              variant="success"
              className="mb-1 ms-2 font10"
              size="lg"
              onClick={() => 
                {}
              }
            >
              اعمال فیلتر
            </Button>
            <Button
              variant="secondary"
              type="reset"
              className="mb-1 ms-2 font10 "
              size="lg"
              onClick={() => {
                dispatch(RsetFilterMaterialCode(""));
                dispatch(RsetFilterMaterialName(""));
              }}
            >
              لغو فیلتر
            </Button>
          </div>
        </Form.Group>
      </Row>
    </Container>
  );
};

export default CeramicPriceFilter;
