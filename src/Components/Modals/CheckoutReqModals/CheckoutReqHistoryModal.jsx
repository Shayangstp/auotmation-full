import React, { useContext } from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Row, Col, Alert } from "react-bootstrap";
import moment from "moment-jalaali";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleUser,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import {
  selectReqHistoryModal,
  RsetReqHistoryModal,
} from "../../Slices/modalsSlice";
import {
  selectLoading,
  handleGetUserImage,
  handleGetUserInfo,
} from "../../Slices/mainSlices";
import {
  selectCurrentReqComments,
  selectCurrentReqInfo,
} from "../../Slices/currentReqSlice";

const CheckoutReqHistoryModal = () => {
  const dispatch = useDispatch();

  const reqHistoryModal = useSelector(selectReqHistoryModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const loading = useSelector(selectLoading);
  const currentReqComments = useSelector(selectCurrentReqComments);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={reqHistoryModal}
      onHide={() => {
        dispatch(RsetReqHistoryModal(false));
      }}
      dialogClassName="modal-96w overflow-visible-modal"
    >
      <Modal.Header className="d-block bg-info text-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex justify-content-between"
        >
          <div>
            <span className="fw-bold me-2">شماره سریال:</span>
            <span>{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
          </div>
          <span>تاریخچه درخواست</span>
          <div>
            <span className="fw-bold me-2">تاریخ درخواست:</span>
            <span>
              {moment
                .utc(
                  xssFilters.inHTMLData(currentReqInfo.createdDate),
                  "YYYY/MM/DD"
                )
                .locale("fa")
                .format("jYYYY/jMM/jDD")}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section>
          {loading ? (
            <div className="d-flex justify-content-center">
              <FontAwesomeIcon icon={faSpinner} className="spinner font60" />
            </div>
          ) : currentReqComments.length === 0 ? (
            <Alert variant="warning">
              <Alert.Heading>
                <FontAwesomeIcon icon={faWarning} className="me-2 font24" />
                <span className="font24">نظری برای نمایش یافت نشد!</span>
              </Alert.Heading>
            </Alert>
          ) : (
            <div>
              {currentReqComments.map((comment) => {
                return (
                  <Row className="mb-5">
                    <Col>
                      {comment.photo === "" || comment.photo_type === "" ? (
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="font95 text-secondary mb-1 mb-md-0"
                        />
                      ) : (
                        <img
                          width="95px"
                          height="95px"
                          className="rounded-circle mb-1 mb-md-0"
                          alt="userAvatar"
                          src={
                            "data:" +
                            xssFilters.inHTMLData(comment.photo_type) +
                            ";base64," +
                            xssFilters.inHTMLData(comment.photo)
                          }
                        />
                      )}
                    </Col>
                    <Col md="10" lg="9" xl="10" xxl="11">
                      <div className="border p-4 rounded bg-white w-100 position-relative">
                        <div className="triangleBorder position-absolute w-0 h-0">
                          <div className="triangle position-absolute w-0 h-0"></div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between flex-wrap fw-bold mb-4">
                          <div>{xssFilters.inHTMLData(comment.fullName)}</div>
                          <div>
                            ({" "}
                            {moment
                              .utc(
                                xssFilters.inHTMLData(comment.date),
                                "YYYY/MM/DD"
                              )
                              .locale("fa")
                              .format("jYYYY/jMM/jDD")}{" "}
                            )
                          </div>
                        </div>
                        <div>{xssFilters.inHTMLData(comment.comment)}</div>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </div>
          )}
        </section>
      </Modal.Body>
      <Modal.Footer className="d-block">
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => {
              dispatch(RsetReqHistoryModal(false));
            }}
            variant="secondary"
          >
            بستن
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutReqHistoryModal;
