import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import CeramicMaterialModalList from "./CeramicMaterialModalList";
import {
  RsetCeramicMaterialModalHistory,
  selectCeramicMaterialModalHistory,
  selectCeramicMaterialHistoryList,
  RsetCeramicMaterialHistoryList,
  selectCeramicMaterialCode,
  handleCeramicCostList,
} from "../../../Slices/ceramicPriceSlices";
import xssFilters from "xss-filters";
import moment from "moment-jalaali";

const CeramicMaterialModalHistory = () => {
  const dispatch = useDispatch();
  const ceramicMaterialModalHistory = useSelector(
    selectCeramicMaterialModalHistory
  );
  const ceramicMaterialHistoryList = useSelector(
    selectCeramicMaterialHistoryList
  );
  const ceramicMaterialCode = useSelector(selectCeramicMaterialCode);

  useEffect(() => {
    dispatch(handleCeramicCostList(ceramicMaterialCode));
  }, [ceramicMaterialCode]);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={ceramicMaterialModalHistory}
      onHide={() => {
        dispatch(RsetCeramicMaterialModalHistory(false));
      }}
      dialogClassName="modal-96w overflow-visible-modal"
    >
      <Fragment>
        <Modal.Header className="d-block bg-primary text-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex justify-content-between"
          >
            <h2>سوابق قبلی</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ceramicMaterialHistoryList.length !== 0 &&
          ceramicMaterialHistoryList[0].cost !== null ? (
            <Table striped bordered hover responsive size="sm" variant="light">
              <thead>
                <tr>
                  <th className="bg-secondary text-white fw-normal">ردیف</th>
                  <th className="bg-secondary text-white fw-normal">قیمت</th>
                  <th className="bg-secondary text-white fw-normal">
                    از تاریخ
                  </th>
                  <th className="bg-secondary text-white fw-normal">
                    تا تاریخ
                  </th>
                  <th className="bg-secondary text-white fw-normal">
                    تاریخ ثبت
                  </th>
                </tr>
              </thead>
              <tbody>
                {ceramicMaterialHistoryList.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {
                        <span>
                          {xssFilters.inHTMLData(item.cost.toLocaleString())}
                        </span>
                      }
                    </td>
                    <td>
                      {
                        <span>
                          {xssFilters.inHTMLData(
                            moment.utc(item.fromDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')
                          )}
                        </span>
                      }
                    </td>
                    <td>
                      {
                        <span>
                          {xssFilters.inHTMLData(
                            moment.utc(item.toDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')
                          )}
                        </span>
                      }
                    </td>
                    <td>
                      {
                        <span>
                          {xssFilters.inHTMLData(
                            moment.utc(item.createdDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD')
                          )}
                        </span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>برای مورد فوق قیمتی ثبت نشده است.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="d-block">
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(RsetCeramicMaterialModalHistory(false));
            }}
          >
            بستن
          </Button>
        </Modal.Footer>
      </Fragment>
    </Modal>
  );
};

export default CeramicMaterialModalHistory;
