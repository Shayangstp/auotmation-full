import React, { useEffect } from "react";
import { Modal, Button, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment-jalaali";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { selectHistories, selectUserImage } from "../../../Slices/mainSlices";
import { selectReqHistoryModal, RsetReqHistoryModal } from "../../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../../Slices/currentReqSlice";

const HistoryOverTime = () => {
  const dispatch = useDispatch();
  const details = useSelector(selectCurrentReqInfo);
  const reqHistoryModal = useSelector(selectReqHistoryModal);

  const histories = useSelector(selectHistories);
  const userImage = useSelector(selectUserImage);
  // const userName = histories.map((history) => {
  //   return history.comments.map((item) => {
  //     return item;
  //   });
  // });

  const handleUserImage = () => {
    if (userImage.photo_type !== "") {
      return (
        <img width="95px" height="95px" className="rounded-circle mb-1 mb-md-0 cursorPointer"
          alt="userAvatar" src={`data:${userImage.photo_type} ;base64,${userImage.profile_photo}`}
        />
      );
    } else {
      return (
        <FontAwesomeIcon icon={faCircleUser} className="rounded-circle font95 mb-1 mb-md-0 text-secondary" />
      );
    }
  };

  return (
    <section>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={reqHistoryModal}
        centered
        onHide={() => dispatch(RsetReqHistoryModal(false))}
        backdrop="static"
        dialogClassName="modal-96w overflow-visible-modal"
        scrollable={true}
      >
        <Modal.Header className="d-block bg-info text-white">
          <Modal.Title className="d-flex justify-content-between">
            <div>
              <span className="fw-bold me-2">شماره سریال: </span>
              <span>
                {details.reqInfo !== undefined
                  ? details.reqInfo.serial_number
                  : ""}
              </span>
            </div>
            <div>
              <span> نظرات </span>
            </div>
            <div>
              <span className="fw-bold me-2">تاریخ درخواست:</span>
              <span>
                {details.process !== undefined
                  ? moment(details.process[0].date, "YYYY/MM/DD")
                      .locale("fa")
                      .format("jYYYY/jMM/jDD")
                  : ""}
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <section>
            {histories.map((history) => {
              return (
                <div className="mb-5 row" key={history.date}>
                  <Col className="d-flex" xxl="1" xl="2" lg="3" md="2">
                    {handleUserImage()}
                  </Col>
                  <Col xxl="11" xl="10" lg="9" md="10">
                    <div className="border p-4 position-relative w-100 bg-white rounded ">
                      <div className="triangleBorder position-absolute w-0 h-0">
                        <div className="triangle position-absolute w-0 h-0"></div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap fw-bold mb-4">
                        {history.first_name} {history.last_name}
                        <div>
                          {moment(history.date, "YYYY/MM/DD")
                            .locale("fa")
                            .format("jYYYY/jMM/jDD")}
                        </div>
                      </div>
                      <div>{history.comment}</div>
                    </div>
                  </Col>
                </div>
              );
            })}
          </section>
        </Modal.Body>
        <Modal.Footer className="justify-content-end">
          <Button variant="secondary" onClick={() => dispatch(RsetReqHistoryModal(false))} >
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default HistoryOverTime;
