import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { selectIrantoolCategory, selectIrantoolCategoryOptions, selectIrantoolDeviceCode, selectIrantoolShift, handleIrantoolCategoryList, handleIrantoolList, handleResetITFilter } from "../../Slices/irantoolSlices";
import { selectMachineCategory, RsetMachineCategory, selectMachineCode, RsetMachineCode, selectMachineNumOfShift, RsetMachineNumOfShift, selectRealFilter, RsetRealFilter } from "../../Slices/filterSlices";
import NumberFormat from "react-number-format";

const IrantoolDevicesFilter = () => {
  const dispatch = useDispatch();
  const categoryOptions = useSelector(selectIrantoolCategoryOptions);
  const realFilter = useSelector(selectRealFilter);
  const machineCategory = useSelector(selectMachineCategory);
  const machineCode = useSelector(selectMachineCode);
  const machineNumOfShift = useSelector(selectMachineNumOfShift);

  useEffect(() => {
    dispatch(handleIrantoolCategoryList());
  }, []);

  const shiftLimit = 3;

  return (
    <Row className='align-items-center mb-5'>
      <Form.Group as={Col} md="4" lg='3' className="mb-4 mb-md-0">
        <Form.Label className='mb-1'>دسته بندی: </Form.Label>
        <Select value={machineCategory} name="category" placeholder="انتخاب..." options={categoryOptions} isSearchable={true}
          onChange={(e) => {
            dispatch(RsetMachineCategory(e));
            if (realFilter === true) {
              dispatch(handleIrantoolList());
            }
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md="3" className="mb-4 mb-md-0">
        <Form.Label className='mb-1'>کد دستگاه: </Form.Label>
        <Form.Control type="text" name="irantoolDeviceCode" value={machineCode}
          onChange={(e) => {
            dispatch(RsetMachineCode(e.target.value));
            if (realFilter === true) {
              dispatch(handleIrantoolList());
            }
          }}
        />
      </Form.Group>
      <Form.Group as={Col} md="2" lg='3' className="mb-4 mb-md-0">
        <Form.Label className='mb-1'>شیفت: </Form.Label>
        <NumberFormat dir="ltr" id="shift" type="text" maxLength={1} className="form-control" value={machineNumOfShift}
          onChange={(e) => {
            dispatch(RsetMachineNumOfShift(e.target.value));
            if (realFilter === true) {
              dispatch(handleIrantoolList());
            }
          }}
          isAllowed={(values) => {
            const { floatValue } = values;
            if (floatValue === undefined) {
              return true;
            }
            return floatValue <= shiftLimit;
          }}
        />
      </Form.Group>
      <Col md='3' className="mt-3 mt-md-0">
        <Form.Group className="d-flex align-items-center mb-3 justify-content-end">
          <Form.Check type="checkbox" id="filter" value={realFilter} checked={realFilter}
            onChange={() => {
              dispatch(RsetRealFilter(!realFilter));
            }}
          />
          <Form.Label className="font12 ms-2 mb-0"> فیلتر لحظه ای </Form.Label>
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="success" className="mb-1 ms-2 font10" size="lg"
            onClick={(e) => {
              e.preventDefault();
              dispatch(handleIrantoolList());
            }}
          >
            اعمال فیلتر
          </Button>
          <Button variant="secondary" type="reset" className="mb-1 ms-2 font10 " size="lg"
            onClick={() => {
              dispatch(handleResetITFilter());
            }}
          >
            لغو فیلتر
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default IrantoolDevicesFilter;
