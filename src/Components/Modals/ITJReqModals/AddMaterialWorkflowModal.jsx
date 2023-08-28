import React, { Fragment, useContext, useEffect } from "react";
import xssFilters from "xss-filters";
import { Modal, Button, Table } from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFileWord,
  faFilePdf,
  faFileImage,
  faFileExcel,
  faFilePowerpoint,
  faFileZipper,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { iranTolJobCntxt } from "../../context/iranTolJobContext/IranTolJobCntxt";
import { rootContext } from "../../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { selectViewReqModal, RsetViewReqModal } from "../../Slices/modalsSlice";
import {
  handleUserInformation,
  handleUserImage,
} from "../../Slices/mainSlices";
import { useHistory } from "react-router-dom";
import {
  RsetIrantoolAddMaterialWorkFlowModal,
  selectIrantoolMaterialWorkFlowModal,
} from "../../Slices/irantoolSlices";
import { selectCurrentReqInfo } from "../../Slices/currentReqSlice";

const ViewRequestModal = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const viewReqModal = useSelector(selectViewReqModal);
  const irantoolAddMaterialWorkFlowModal = useSelector(
    selectIrantoolMaterialWorkFlowModal
  );
  const currentReqInfo = useSelector(selectCurrentReqInfo);

  const mainContext = useContext(rootContext);
  const {
    // currentReqInfo
    currentReqCo,
    currentReqComments,
  } = mainContext;

  const jobContext = useContext(iranTolJobCntxt);
  const { handleDownloadReqPlans, handleReqFiles, currentReqFiles } =
    jobContext;

  useEffect(() => {
    if (currentReqInfo.requestId !== undefined) {
      handleReqFiles(currentReqInfo.requestId, 0, 0, 1, "");
    }
  }, [currentReqInfo]);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      show={irantoolAddMaterialWorkFlowModal}
      onHide={() => {
        dispatch(RsetIrantoolAddMaterialWorkFlowModal(false));
      }}
      dialogClassName="modal-96w"
      scrollable={true}
    >
      <Modal.Header className="d-block bg-primary text-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex justify-content-between"
        >
          <div>
            <span className="me-2">جزئیات درخواست شماره </span>
            <span className="fw-bold">
              {xssFilters.inHTMLData(currentReqInfo.serial)}
            </span>
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
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>نام و نام خانوادگی</th>
              <th>شرکت</th>
              <th>نام پروژه</th>
              <th>نوع فرایند</th>
              <th>نوع پروژه</th>
              <th>تعداد</th>
              <th>تاریخ مدنظر مشتری</th>
              <th>توضیحات</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{xssFilters.inHTMLData(currentReqInfo.fullName)}</td>
              <td>{xssFilters.inHTMLData(currentReqCo)}</td>
              <td>{xssFilters.inHTMLData(currentReqInfo.projectName)}</td>
              <td>{xssFilters.inHTMLData(currentReqInfo.requestTypeName)}</td>
              <td>{xssFilters.inHTMLData(currentReqInfo.toolTypeName)}</td>
              <td>{xssFilters.inHTMLData(currentReqInfo.amount)}</td>
              <td>
                {currentReqInfo.deadline !== null
                  ? momentJalaali
                      .utc(
                        xssFilters.inHTMLData(currentReqInfo.deadline),
                        "YYYY/MM/DD"
                      )
                      .locale("fa")
                      .format("jYYYY/jMM/jDD")
                  : ""}
              </td>
              <td>{xssFilters.inHTMLData(currentReqInfo.description)}</td>
            </tr>
          </tbody>
        </Table>
        <hr className="mt-2 mb-4" />
        <h3 className="fw-bold font16 mb-4  bg-lightBlue p-4 rounded text-dark mb-2">
          پیوست ها
        </h3>
        {currentReqFiles.length !== 0 ? (
          <Fragment>
            {/* <ul className="d-flex mt-2 list-unstyled"> */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>سریال</th>
                  <th>نام فایل</th>
                  <th>نوع فایل</th>
                  <th>فایل</th>
                  <th>ثبت متریال / مراحل عملیات</th>
                </tr>
              </thead>
              <tbody>
                {currentReqFiles.map((file, index) => {
                  return (
                    <tr key={file.path}>
                      <td className="font12">{index + 1}</td>
                      <td className="border p-2 mx-2">{file.id}</td>
                      <td className="border p-2 mx-2">{file.name}</td>
                      <td className="border p-2 mx-2">{file.mimetype}</td>
                      <td
                        className="border p-2 mx-2 cursorPointer text-center"
                        onClick={() => {
                          handleReqFiles(
                            currentReqInfo.requestId,
                            file.row,
                            0,
                            0,
                            file.name
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faFile} className="font24" />
                      </td>
                      <td className="cursorPointer text-center">
                        <Button
                          className="mx-2 font12"
                          onClick={() => {
                            history.push(
                              `/MtrWrkflw/${currentReqInfo.requestId}/${file.id}`
                            );
                            dispatch(
                              RsetIrantoolAddMaterialWorkFlowModal(false)
                            );
                          }}
                        >
                          ثبت
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* </ul> */}
            </Table>
            <div
              className="my-4 cursorPointer"
              onClick={() => {
                handleReqFiles(currentReqInfo.requestId, 0, 1, 0, "allFiles");
              }}
            >
              <span>دانلود همه فایل های درخواست</span>
            </div>
          </Fragment>
        ) : (
          <p>فایلی آپلود نشده است!</p>
        )}
        {/* {currentReqInfo.plans !== undefined && currentReqInfo.plans.length !== 0 && (user.Roles.some(role=> role === '56' || role === '57')
                    ? <Fragment>
                        <ul className="d-flex mt-5 list-unstyled">
                            {currentReqInfo.plans.map((file, index) => {
                                switch (file.filename.split('.').pop()) {
                                    case "docx":
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFileWord} className='font24 cursorPointer' />
                                            </li>
                                        )
                                    case "xlsx":
                                    case "xltx":
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFileExcel} className='font24 cursorPointer' />
                                            </li>
                                        )
                                    case "pptx":
                                    case "ppt":
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFilePowerpoint} className='font24 cursorPointer' />
                                            </li>
                                        )
                                    case "pdf":
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFilePdf} className='font24 cursorPointer' />
                                            </li>
                                        )
                                    case "jpeg":
                                    case "jpg":
                                    case "png":
                                    case "gif":
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFileImage} className='font24 cursorPointer' />
                                            </li>
                                        )
                                    case "zip":
                                    case "rar":
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFileZipper} className='font24 cursorPointer' />
                                            </li>
                                        )
                                    default:
                                        return (
                                            <li key={file.path} className="mx-2" onClick={() => {
                                                handleDownloadReqPlans(file.filename, currentReqInfo._id, index, false)
                                            }}>
                                                <FontAwesomeIcon icon={faFile} className='font24 cursorPointer' />
                                            </li>
                                        )
                                }
                            })}
                        </ul>
                        <div className="my-4 cursorPointer" onClick={() => {
                            handleDownloadReqPlans(currentReqInfo.reqInfo.serial_number + '_files', currentReqInfo._id, '*', true)
                        }}>
                            <span>دانلود همه فایل های نقشه</span>
                        </div>
                    </Fragment>
                    : null
                } */}
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
                      handleUserImage({ userId: action.userId, status: 1 })
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
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => {
              dispatch(RsetIrantoolAddMaterialWorkFlowModal(false));
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

export default ViewRequestModal;
