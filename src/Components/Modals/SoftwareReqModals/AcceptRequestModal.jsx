import React, { useEffect, Fragment } from "react";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import momentJalaali from "moment-jalaali";
import { RsetAcceptReqModal, selectAcceptReqModal } from "../../Slices/modalsSlice";
import { selectCurrentReqInfo, selectCurrentReqComments, RsetCurrentReqComments, selectCurrentReqItems, RsetCurrentReqItems } from "../../Slices/currentReqSlice";
import { RsetAcceptReqComment, selectAcceptReqComment, RsetSendTo, selectSendTo, RsetSendToOptions, selectSendToOptions, RsetNextAcceptReqModal } from "../../Slices/modalsSlice";
import { handleUserImage, handleUserInformation, selectUser, selectFormErrors } from "../../Slices/mainSlices";
import Select from "react-select";
import { getToPersonByRole } from "../../../Services/rootServices";
import { handleAcceptSoftwareReq } from '../../Slices/softwareSlice';

const AcceptRequestModal = () => {
  const dispatch = useDispatch();
  const acceptReqModal = useSelector(selectAcceptReqModal);
  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const acceptReqComment = useSelector(selectAcceptReqComment);
  const currentReqItems = useSelector(selectCurrentReqItems);
  const sendTo = useSelector(selectSendTo);
  const sendToOptions = useSelector(selectSendToOptions);
  const user = useSelector(selectUser);
  const formErrors = useSelector(selectFormErrors);
  const currentReqComments = useSelector(selectCurrentReqComments);

  const getUserExpert = async () => {
    const getToPersonByRoleRes = await getToPersonByRole(18, user.Location, user.CompanyCode, 1, null, 0);
    if (getToPersonByRoleRes.data.code === 415) {
      dispatch(RsetSendToOptions(getToPersonByRoleRes.data.list));
    }
  };
  useEffect(() => {
    if (currentReqInfo.lastActionCode === 11) {
      getUserExpert();
    }
  }, [currentReqInfo]);
  const sendToIsValid = sendTo !== "";

  useEffect(() => { }, []);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={acceptReqModal}
      onHide={() => {
        dispatch(RsetAcceptReqModal(false));
      }}
      dialogClassName="modal-96w overflow-visible-modal"
    >
      <Fragment>
        <Modal.Header className="d-block bg-success text-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex justify-content-between"
          >
            <div>
              <span className='me-2'>تایید درخواست شماره </span>
              <span className="fw-bold">{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
            </div>
            <div>
              <span className="fw-bold me-2">تاریخ درخواست:</span>
              <span>
                {momentJalaali
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
          <ul className="p-0 list-unstyled">
            <li className="mb-2">
              <span className="fw-bold">نام و نام خانوادگی: </span>
              {xssFilters.inHTMLData(currentReqInfo.fullName)}
            </li>
            {currentReqInfo.sameAccess !== null && (
              <li className="mb-2">
                <span className="fw-bold">کاربر مشابه: </span>
                {xssFilters.inHTMLData(currentReqInfo.sameAccess)}
              </li>
            )}
            <li className="mb-2">
              <span className="fw-bold">توضیحات: </span>
              {xssFilters.inHTMLData(currentReqInfo.description)}
            </li>
          </ul>
          {currentReqItems.length !== 0 && (
            <Table striped bordered hover responsive className="mt-5">
              <thead className="bg-secondary light-text">
                <tr>
                  <th>ردیف</th>
                  <th>نام نرم افزار</th>
                  <th>شرکت عامل</th>
                  <th>موارد مورد نیاز</th>
                </tr>
              </thead>
              <tbody>
                {currentReqItems.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td className="font12">{idx + 1}</td>
                      <td className="font12">{item.softNames}</td>
                      <td className="font12">{item.companyNames}</td>
                      <td className="font12">{item.requiredParts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          {user.Roles.some((role) => role === "17") ? (
            <Form.Group as={Col} md="4">
              <Form.Label>ارسال به: </Form.Label>
              <Select
                value={sendTo}
                name="sendTo"
                onChange={(e) => {
                  dispatch(RsetSendTo(e));
                }}
                placeholder="انتخاب..."
                options={sendToOptions}
              />
              {!sendToIsValid && (
                <p className="font12 text-danger mb-0 mt-1">
                  {formErrors.sendTo}
                </p>
              )}
            </Form.Group>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="d-block">
          {currentReqComments.map((action, index) => {
            if (
              action.comment !== null &&
              action.comment !== undefined &&
              action.comment !== ""
            ) {
              return (
                <div className="d-block" key={index}>
                  <span
                    className="fw-bold me-2 font12 cursorPointer"
                    onClick={() => {
                      dispatch(handleUserInformation(action.userId));
                      dispatch(
                        handleUserImage({
                          userId: action.userId,
                          status: 1,
                        })
                      );
                    }}
                  >
                    {action.fullName}:{" "}
                  </span>
                  <span className="font12">
                    {xssFilters.inHTMLData(action.comment)}
                  </span>
                </div>
              );
            }
          })}
          <div className="d-flex justify-content-between">
            <div className="w-75 d-flex align-items-center">
              <input
                className="form-control me-3 w-75"
                placeholder="توضیحات تایید کننده درخواست"
                defaultValue={acceptReqComment}
                name="acceptReqComment"
                onChange={(e) => dispatch(RsetAcceptReqComment(e.target.value))}
              />
              <Button
                variant="success"
                onClick={(e) => {
                  if (user.Location === 2 && currentReqInfo.lastActionCode === 10) {
                    dispatch(RsetAcceptReqModal(false));
                    dispatch(RsetNextAcceptReqModal(true));
                  } else {
                    e.preventDefault();
                    dispatch(handleAcceptSoftwareReq(false))
                  }
                }}
              >
                تایید درخواست
              </Button>
            </div>
            <Button
              onClick={() => {
                dispatch(RsetAcceptReqModal(false));
                dispatch(RsetCurrentReqItems([]));
                dispatch(RsetAcceptReqComment(""));
              }}
              variant="secondary"
            >
              بستن
            </Button>
          </div>
        </Modal.Footer>
      </Fragment>
    </Modal>
  );
};

export default AcceptRequestModal;
