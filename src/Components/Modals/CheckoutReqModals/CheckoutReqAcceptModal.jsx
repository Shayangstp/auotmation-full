import React, { useEffect, Fragment } from "react";
import {
  Modal,
  Button,
  Form,
  Col,
  Row,
  Table,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import xssFilters from "xss-filters";
import momentJalaali from "moment-jalaali";
import {
  RsetAcceptReqModal,
  selectAcceptReqModal,
} from "../../Slices/modalsSlice";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";
import NumberFormat from "react-number-format";
import {
  RsetAcceptReqComment,
  selectAcceptReqComment,
  RsetSendTo,
  selectSendTo,
  RsetSendToOptions,
  selectSendToOptions,
} from "../../Slices/modalsSlice";
import {
  handleUserImage,
  handleUserInformation,
  handleAcceptReq,
} from "../../Slices/mainSlices";
import {
  selectCurrentReqComments,
  RsetCurrentReqComments,
  selectCurrentReqItems,
  RsetCurrentReqItems,
} from "../../Slices/currentReqSlice";
import Select from "react-select";
import { getToPersonByRole } from "../../../Services/rootServices";
import {
  selectUser,
  selectFormErrors,
  RsetFormErrors,
} from "../../Slices/mainSlices";
import {
  handleCheckoutReqAccept,
  selectCheckoutConEdari,
  RsetCheckoutConEdari,
  selectCheckoutConAmozesh,
  RsetCheckoutConAmozesh,
  selectCheckoutConHazineMali,
  RsetCheckoutConHazineMali,
  selectCheckoutConSandoghMali,
  RsetCheckoutConSandoghMali,
  selectCheckoutConHoghoghDastmozdMali,
  RsetCheckoutConHoghoghDastmozdMali,
  selectCheckoutConAmval,
  RsetCheckoutConAmval,
  selectCheckoutConAmvalMobile,
  RsetCheckoutConAmvalMobile,
  selectCheckoutConAmvalMashin,
  RsetCheckoutConAmvalMashin,
  selectCheckoutConAmvalMaskoni,
  RsetCheckoutConAmvalMaskoni,
  selectCheckoutConHardwareEmail,
  RsetCheckoutConHardwareEmail,
  selectCheckoutConSoftwareSystem,
  RsetCheckoutConSoftwareSystem,
  selectCheckoutConWarehouseSystem,
  RsetCheckoutConWarehouseSystem,
  selectCheckoutConDabirNumber,
  RsetCheckoutConDabirNumber,
  selectCheckoutConDabirCellphone,
  RsetCheckoutConDabirCellphone,
  selectCheckoutConDabirOther,
  RsetCheckoutConDabirOther,
  handleCheckoutConfirmReset,
  selectCheckoutFilterData,
} from "../../Slices/checkoutReqSlices";

const CheckoutReqAcceptModal = () => {
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
  const checkoutFilterData = useSelector(selectCheckoutFilterData);

  //confirm
  const checkoutConEdari = useSelector(selectCheckoutConEdari);
  const checkoutConAmozesh = useSelector(selectCheckoutConAmozesh);
  const checkoutConHazineMali = useSelector(selectCheckoutConHazineMali);
  const checkoutConSandoghMali = useSelector(selectCheckoutConSandoghMali);
  const checkoutConHoghoghDastmozdMali = useSelector(
    selectCheckoutConHoghoghDastmozdMali
  );
  const checkoutConAmval = useSelector(selectCheckoutConAmval);
  const checkoutConAmvalMobile = useSelector(selectCheckoutConAmvalMobile);
  const checkoutConAmvalMashin = useSelector(selectCheckoutConAmvalMashin);
  const checkoutConAmvalMaskoni = useSelector(selectCheckoutConAmvalMaskoni);

  const checkoutConHardwareEmail = useSelector(selectCheckoutConHardwareEmail);
  const checkoutConSoftwareSystem = useSelector(
    selectCheckoutConSoftwareSystem
  );
  const checkoutConWarehouseSystem = useSelector(
    selectCheckoutConWarehouseSystem
  );

  const checkoutConDabirNumber = useSelector(selectCheckoutConDabirNumber);
  const checkoutConDabirCellphone = useSelector(
    selectCheckoutConDabirCellphone
  );
  const checkoutConDabirOther = useSelector(selectCheckoutConDabirOther);
  //end of confirm

  //validation
  // const amozeshIsValid = checkoutConAmozesh !== "";
  // const edariIsValid = checkoutConEdari !== "";
  // const hazineMaliIsValid = checkoutConHazineMali !== "";
  // const sandoghMaliIsValid = checkoutConSandoghMali !== "";
  // const hoghoghDastmozdMaliIsValid = checkoutConHoghoghDastmozdMali !== "";
  // const amvalIsValid = checkoutConAmval !== "";
  // const amvalMobileIsValid = checkoutConAmvalMobile !== false;
  // const amvalMashinIsValid = checkoutConAmvalMashin !== false;
  // const amvalMaskoniIsValid = checkoutConAmvalMaskoni !== false;
  // const hardwareEmailIsValid = checkoutConHardwareEmail !== false;
  // const softwareSystemIsValid = checkoutConSoftwareSystem !== false;
  // const warehouseSystemIsValid = checkoutConWarehouseSystem !== false;
  // const dabirNumberIsValid = checkoutConDabirNumber !== false;
  // const dabirCellphoneIsValid = checkoutConDabirCellphone !== false;
  // const dabirOtherIsValid = checkoutConDabirOther !== false;

  // const formIsValid =
  //   amozeshIsValid ||
  //   edariIsValid ||
  //   hazineMaliIsValid ||
  //   sandoghMaliIsValid ||
  //   hoghoghDastmozdMaliIsValid ||
  //   amvalIsValid ||
  //   amvalMobileIsValid ||
  //   amvalMashinIsValid ||
  //   amvalMaskoniIsValid ||
  //   hardwareEmailIsValid ||
  //   softwareSystemIsValid ||
  //   warehouseSystemIsValid ||
  //   dabirNumberIsValid ||
  //   dabirCellphoneIsValid ||
  //   dabirOtherIsValid;

  // const validation = () => {
  //   var errors = {};
  //   if (!amozeshIsValid) {
  //     errors.checkoutConAmozesh =
  //       "واردکردن مانده بدهی تا این تاریخ اجباری است!";
  //   }
  //   if (!edariIsValid) {
  //     errors.checkoutConEdari =
  //       "واردکردن مانده بدهی وام در صندوق شفیع تا این تاریخ اجباری است!";
  //   }
  //   if (!hazineMaliIsValid) {
  //     errors.checkoutConHazineMali =
  //       "واردکردن مانده بدهی تا این تاریخ اجباری است!";
  //   }
  //   if (!sandoghMaliIsValid) {
  //     errors.checkoutConSandoghMali =
  //       "واردکردن مانده بدهی تا این تاریخ اجباری است!";
  //   }
  //   if (!hoghoghDastmozdMaliIsValid) {
  //     errors.checkoutConHoghoghDastmozdMali =
  //       "واردکردن مانده بدهی تا این تاریخ اجباری است!";
  //   }
  //   if (!amvalIsValid) {
  //     errors.checkoutConAmval = "واردکردن مانده بدهی تا این تاریخ اجباری است!";
  //   }
  //   if (!amvalMobileIsValid) {
  //     errors.checkoutConAmvalMobile =
  //       "تحویل موبایل و تسویه آخرین قبض اجباری است!";
  //   }
  //   if (!amvalMashinIsValid) {
  //     errors.checkoutConAmvalMashin = "تحویل ماشین و تسویه  خلافی اجباری است!";
  //   }
  //   if (!amvalMaskoniIsValid) {
  //     errors.checkoutConAmvalMaskoni =
  //       "تحویل واحد مسکونی و مفاصا حساب قبض اجباری است!";
  //   }
  //   if (!hardwareEmailIsValid) {
  //     errors.checkoutConHardwareEmail = "حذف آدرس ایمیل اجباری است!";
  //   }
  //   if (!softwareSystemIsValid) {
  //     errors.checkoutConSoftwareSystem = "حذف دسترسی به سیستم اجباری است!";
  //   }
  //   if (!warehouseSystemIsValid) {
  //     errors.checkoutConWarehouseSystem =
  //       "تحویل سیستم کامپیوتر و متعلقات اجباری است!";
  //   }
  //   if (!dabirNumberIsValid) {
  //     errors.checkoutConDabirNumber = "حذف شماره داخلی اجباری است!";
  //   }
  //   if (!dabirCellphoneIsValid) {
  //     errors.checkoutConDabirCellphone = "تحویل گوشی اجباری است!";
  //   }
  //   if (!dabirOtherIsValid) {
  //     errors.checkoutConDabirOther = "کنترل سایر موارد اجباری است!";
  //   }
  //   return errors;
  // };

  const getUserExpert = async () => {
    const getToPersonByRoleRes = await getToPersonByRole(
      18,
      user.Location,
      user.CompanyCode,
      1,
      null
    );
    if (
      getToPersonByRoleRes.data.length !== undefined &&
      getToPersonByRoleRes.data.length !== 0
    ) {
      if (getToPersonByRoleRes.data.code === 415) {
        dispatch(RsetSendToOptions(getToPersonByRoleRes.data.list));
      }
    }
  };

  useEffect(() => {
    if (currentReqInfo.lastActionCode === 11) {
      getUserExpert();
    }
  }, [currentReqInfo]);
  const sendToIsValid = sendTo !== "";

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
              <span className="fw-bold me-2">شماره سریال:</span>
              <span>{xssFilters.inHTMLData(currentReqInfo.serial)}</span>
            </div>
            <span>تایید درخواست</span>
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
              {xssFilters.inHTMLData(currentReqInfo.leaverFullName)}
            </li>
            {currentReqInfo.sameAccess !== null && (
              <li className="mb-2">
                <span className="fw-bold">دلیل ترک کار: </span>
                {xssFilters.inHTMLData(currentReqInfo.leavingWorkCauseName)}
              </li>
            )}
            <li className="mb-2">
              <span className="fw-bold">توضیحات: </span>
              {xssFilters.inHTMLData(currentReqInfo.description)}
            </li>
          </ul>
          <hr />
          {/*  amozesh /  edari */}
          {currentReqInfo.lastActionCode !== 0 &&
          currentReqInfo.lastToPerson !== localStorage.getItem("id") &&
          user.Roles.some((role) => role === "34" || role === "19") ? (
            <Form.Group as={Col} md="4">
              {user.Roles.some((role) => role === "19") ? (
                <Form.Label>مانده بدهی وام در صندوق شفیع به مبلغ: </Form.Label>
              ) : (
                <Form.Label>مانده بدهی تااین تاریخ مبلغ: </Form.Label>
              )}

              <NumberFormat
                dir="ltr"
                id="materialCode"
                thousandSeparator={true}
                className="form-control"
                value={
                  user.Roles.some((role) => role === "19")
                    ? checkoutConEdari
                    : checkoutConAmozesh
                }
                onChange={(e) => {
                  user.Roles.some((role) => role === "19")
                    ? dispatch(RsetCheckoutConEdari(e.target.value))
                    : dispatch(RsetCheckoutConAmozesh(e.target.value));
                }}
              />
              {/* {user.Roles.some((role) => role === "19")
                ? !edariIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConEdari}
                    </p>
                  )
                : !amozeshIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConAmozesh}
                    </p>
                  )} */}
            </Form.Group>
          ) : null}
          {/* manabeEnsani */}
          {/* {currentReqInfo.lastActionCode !== 0 &&
          currentReqInfo.lastToPerson !== localStorage.getItem("id") &&
          user.Roles.some((role) => role === "32") ? (
            <Form.Group as={Col} md="4">
              {user.Roles.some((role) => role === "19") ? (
                <Form.Label>مانده بدهی وام در صندوق شفیع به مبلغ: </Form.Label>
              ) : (
                <Form.Label>مانده بدهی تااین تاریخ مبلغ: </Form.Label>
              )}

              <NumberFormat
                dir="ltr"
                id="materialCode"
                thousandSeparator={true}
                className="form-control"
                value={
                  user.Roles.some((role) => role === "19")
                    ? checkoutConEdari
                    : checkoutConAmozesh
                }
                onChange={(e) => {
                  user.Roles.some((role) => role === "19")
                    ? dispatch(RsetCheckoutConEdari(e.target.value))
                    : dispatch(RsetCheckoutConAmozesh(e.target.value));
                }}
              />
            </Form.Group>
          ) : null} */}
          {/* mali 3ta  */}
          {currentReqInfo.lastActionCode !== 0 &&
          currentReqInfo.lastToPerson !== localStorage.getItem("id") &&
          user.Roles.some(
            (role) => role === "29" || role === "30" || role === "31"
          ) ? (
            <Form.Group as={Col} md="4">
              {user.Roles.some((role) => role === "29") ||
              user.Roles.some((role) => role === "30") ||
              user.Roles.some((role) => role === "31") ? (
                <Form.Label>مانده بدهی تااین تاریخ مبلغ: </Form.Label>
              ) : null}
              <NumberFormat
                dir="ltr"
                id="materialCode"
                thousandSeparator={true}
                className="form-control"
                value={
                  user.Roles.some((role) => role === "29")
                    ? checkoutConHazineMali
                    : user.Roles.some((role) => role === "30")
                    ? checkoutConSandoghMali
                    : user.Roles.some((role) => role === "31")
                    ? checkoutConHoghoghDastmozdMali
                    : null
                }
                onChange={(e) => {
                  if (user.Roles.some((role) => role === "29")) {
                    dispatch(RsetCheckoutConHazineMali(e.target.value));
                  } else if (user.Roles.some((role) => role === "30")) {
                    dispatch(RsetCheckoutConSandoghMali(e.target.value));
                  } else if (user.Roles.some((role) => role === "31")) {
                    dispatch(
                      RsetCheckoutConHoghoghDastmozdMali(e.target.value)
                    );
                  }
                }}
              />

              {/* {user.Roles.some((role) => role === "29")
                ? !hazineMaliIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConHazineMali}
                    </p>
                  )
                : user.Roles.some((role) => role === "30")
                ? !sandoghMaliIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConSandoghMali}
                    </p>
                  )
                : user.Roles.some((role) => role === "31")
                ? !hoghoghDastmozdMaliIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConHoghoghDastmozdMali}
                    </p>
                  )
                : null} */}
            </Form.Group>
          ) : null}
          {/* amval */}
          {currentReqInfo.lastActionCode !== 0 &&
          currentReqInfo.lastToPerson !== localStorage.getItem("id") &&
          user.Roles.some((role) => role === "27") ? (
            // <Container fluid className="d-flex ">
            <Row className="d-flex flex-row">
              <Form.Group as={Col} md="4">
                {/* <div className="d-flex justify-content-between"> */}
                <Form.Label>مانده بدهی تااین تاریخ مبلغ: </Form.Label>
                <NumberFormat
                  dir="ltr"
                  thousandSeparator={true}
                  className="form-control"
                  value={checkoutConAmval}
                  onChange={(e) =>
                    dispatch(RsetCheckoutConAmval(e.target.value))
                  }
                />
                {/* {!amvalIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.checkoutConAmval}
                  </p>
                )} */}
                {/* </div> */}
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Check>
                  <Form.Check.Input
                    type="checkbox"
                    checked={checkoutConAmvalMobile ? true : false}
                    value={checkoutConAmvalMobile}
                    onChange={() => {
                      dispatch(
                        RsetCheckoutConAmvalMobile(!checkoutConAmvalMobile)
                      );
                    }}
                  />
                  <Form.Check.Label>
                    تحویل موبایل و تسویه آخرین قبض
                  </Form.Check.Label>
                </Form.Check>
                {/* {!amvalMobileIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {" "}
                    {formErrors.checkoutConAmvalMobile}
                  </p>
                )} */}
                <Form.Check>
                  <Form.Check.Input
                    type="checkbox"
                    checked={checkoutConAmvalMashin ? true : false}
                    value={checkoutConAmvalMashin}
                    onChange={() => {
                      dispatch(
                        RsetCheckoutConAmvalMashin(!checkoutConAmvalMashin)
                      );
                    }}
                  />
                  <Form.Check.Label>تحویل ماشین و تسویه خلافی</Form.Check.Label>
                </Form.Check>
                {/* {!amvalMashinIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.checkoutConAmvalMashin}
                  </p>
                )} */}

                <Form.Check>
                  <Form.Check.Input
                    checked={checkoutConAmvalMaskoni ? true : false}
                    type="checkbox"
                    value={checkoutConAmvalMaskoni}
                    onChange={() => {
                      dispatch(
                        RsetCheckoutConAmvalMaskoni(!checkoutConAmvalMaskoni)
                      );
                    }}
                  />
                  <Form.Check.Label>
                    تحویل واحد مسکونی و مفاصا حساب قبوض
                  </Form.Check.Label>
                </Form.Check>
                {/* {!amvalMaskoniIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.checkoutConAmvalMaskoni}
                  </p>
                )} */}
              </Form.Group>
            </Row>
          ) : // </Container>
          null}
          {/* computer & software & wareHouse */}
          {currentReqInfo.lastActionCode !== 0 &&
          currentReqInfo.lastToPerson !== localStorage.getItem("id") &&
          user.Roles.some(
            (role) => role === "28" || role === "17" || role === "3"
          ) ? (
            <Form.Group as={Col} md="4">
              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  checked={
                    user.Roles.some((role) => role === "28")
                      ? checkoutConHardwareEmail
                        ? true
                        : false
                      : user.Roles.some((role) => role === "17")
                      ? checkoutConSoftwareSystem
                        ? true
                        : false
                      : user.Roles.some((role) => role === "3")
                      ? checkoutConWarehouseSystem
                        ? true
                        : false
                      : null
                  }
                  value={
                    user.Roles.some((role) => role === "28")
                      ? checkoutConHardwareEmail
                      : user.Roles.some((role) => role === "17")
                      ? checkoutConSoftwareSystem
                      : user.Roles.some((role) => role === "3")
                      ? checkoutConWarehouseSystem
                      : null
                  }
                  onChange={() => {
                    if (user.Roles.some((role) => role === "28")) {
                      dispatch(
                        RsetCheckoutConHardwareEmail(!checkoutConHardwareEmail)
                      );
                    } else if (user.Roles.some((role) => role === "17")) {
                      dispatch(
                        RsetCheckoutConSoftwareSystem(
                          !checkoutConSoftwareSystem
                        )
                      );
                    } else if (user.Roles.some((role) => role === "3")) {
                      dispatch(
                        RsetCheckoutConWarehouseSystem(
                          !checkoutConWarehouseSystem
                        )
                      );
                    }
                  }}
                />
                {user.Roles.some((role) => role === "28") ? (
                  <Form.Check.Label>حذف آدرس ایمیل انجام شد</Form.Check.Label>
                ) : user.Roles.some((role) => role === "17") ? (
                  <Form.Check.Label>
                    حذف دسترسی به سیستم انجام شد
                  </Form.Check.Label>
                ) : user.Roles.some((role) => role === "3") ? (
                  <Form.Check.Label>
                    سیستم کامپیوتر و متعلقات تحویل گردید
                  </Form.Check.Label>
                ) : null}
              </Form.Check>

              {/* {user.Roles.some((role) => role === "28")
                ? !hardwareEmailIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConHardwareEmail}
                    </p>
                  )
                : user.Roles.some((role) => role === "17")
                ? !softwareSystemIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConSoftwareSystem}
                    </p>
                  )
                : user.Roles.some((role) => role === "3")
                ? !warehouseSystemIsValid && (
                    <p className="font12 text-danger mb-0 mt-1">
                      {formErrors.checkoutConWarehouseSystem}
                    </p>
                  )
                : null} */}
            </Form.Group>
          ) : null}
          {/* dabirkhaneh */}
          {currentReqInfo.lastActionCode !== 0 &&
          currentReqInfo.lastToPerson !== localStorage.getItem("id") &&
          user.Roles.some((role) => role === "33") ? (
            <Form.Group as={Col} md="4">
              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  checked={checkoutConDabirNumber ? true : false}
                  value={checkoutConDabirNumber}
                  onChange={() =>
                    dispatch(
                      RsetCheckoutConDabirNumber(!checkoutConDabirNumber)
                    )
                  }
                />
                <Form.Check.Label>حذف شماره داخلی</Form.Check.Label>
                {/* {!dabirNumberIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.checkoutConDabirNumber}
                  </p>
                )} */}
              </Form.Check>

              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  checked={checkoutConDabirCellphone ? true : false}
                  value={checkoutConDabirCellphone}
                  onChange={() =>
                    dispatch(
                      RsetCheckoutConDabirCellphone(!checkoutConDabirCellphone)
                    )
                  }
                />
                <Form.Check.Label>تحویل گوشی</Form.Check.Label>
                {/* {!dabirCellphoneIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.checkoutConDabirCellphone}
                  </p>
                )} */}
              </Form.Check>

              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  checked={checkoutConDabirOther ? true : false}
                  value={checkoutConDabirOther}
                  onChange={() =>
                    dispatch(RsetCheckoutConDabirOther(!checkoutConDabirOther))
                  }
                />
                <Form.Check.Label>کنترل سایر موارد</Form.Check.Label>
                {/* {!dabirOtherIsValid && (
                  <p className="font12 text-danger mb-0 mt-1">
                    {formErrors.checkoutConDabirOther}
                  </p>
                )} */}
              </Form.Check>
            </Form.Group>
          ) : null}
          {/* {user.Roles.some((role) => role === "17") ? (
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
          ) : null} */}
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
                  dispatch(handleCheckoutReqAccept(e));
                  // if (currentReqInfo.lastActionCode === 0) {
                  // } else {
                  //   if (formErrors) {
                  //     dispatch(handleCheckoutReqAccept(e));
                  //   } else {
                  //     dispatch(
                  //       RsetFormErrors(
                  //         validation(
                  //           checkoutConAmozesh,
                  //           checkoutConEdari,
                  //           checkoutConHazineMali,
                  //           checkoutConSandoghMali,
                  //           checkoutConHoghoghDastmozdMali,
                  //           checkoutConAmval,
                  //           checkoutConAmvalMobile,
                  //           checkoutConAmvalMashin,
                  //           checkoutConAmvalMaskoni,
                  //           checkoutConHardwareEmail,
                  //           checkoutConSoftwareSystem,
                  //           checkoutConWarehouseSystem,
                  //           checkoutConDabirNumber,
                  //           checkoutConDabirCellphone,
                  //           checkoutConDabirOther
                  //         )
                  //       )
                  //     );
                  //   }
                  // }
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
                dispatch(handleCheckoutConfirmReset());
                dispatch(RsetFormErrors(""));
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

export default CheckoutReqAcceptModal;
