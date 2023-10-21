import React, { Fragment, useContext, useEffect } from "react";
import xssFilters from "xss-filters";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import momentJalaali from "moment-jalaali";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { iranTolJobCntxt } from "../context/iranTolJobContext/IranTolJobCntxt";
import Loading from "../Common/Loading";
import { useParams } from "react-router-dom";
import { rootContext } from "../context/rootContext";
import { useDispatch, useSelector } from "react-redux";
import { handleCurrentReqInfo } from "../Slices/mainSlices";
import {
  selectCurrentReqInfo,
  handleReqFiles,
  selectCurrentReqFiles,
} from "../Slices/currentReqSlice";
import {
  RsetIrantoolMaterialCode,
  RsetIrantoolMaterialName,
  RsetIrantoolMaterialCount,
  RsetIrantoolMaterialUnit,
  handleIrantoolMaterialUnitOptions,
  selectIrantoolModalSearch,
  selectIrantoolMaterialItem,
  RsetIrantoolMaterialItem,
  RsetIrantoolToolCode,
  RsetIrantoolToolName,
  RsetIrantoolToolCount,
  RsetIrantoolToolUnit,
  selectIrantoolToolItem,
  RsetIrantoolToolItem,
  RsetIrantoolActionDept,
  RsetIrantoolActionOprator,
  RsetIrantoolActionDevice,
  RsetIrantoolActionCount,
  handleIrantoolActionDeptOptions,
  handleIrantoolActionOpratorOptions,
  handleIrantoolActionDeviceOptions,
  selectIrantoolActionItem,
  RsetIrantoolActionItem,
  handleIrantoolActionOprations,
} from "../Slices/irantoolSlices";

import IrantoolMaterialModalSearch from "../Modals/ITJReqModals/IrantoolDevicesModals/IrantoolMaterialModalSearch";
import {
  RsetFormErrors,
  selectFormErrors,
  selectUser,
} from "../Slices/mainSlices";
import { errorMessage, successMessage } from "../../utils/message";
import { useHistory } from "react-router-dom";
import {
  postWarehouseReq,
  postWarehouseReqItems,
} from "../../Services/warehouseReqService";
import { getToPersonByRole, postAction } from "../../Services/rootServices";
import { postWorkAndMaterials } from "../../Services/irantolJobReqServices";
import IranTolJobMaterial from "./IranTolJobMaterial";
import IranTolJobTool from "./IranTolJobTool";
import IranTolJobAction from "./IranTolJobAction";

const IranTolJobMaterialWorkflow = () => {
  const mainContext = useContext(rootContext);

  const {
    // currentReqInfo
    currentReqCo,
    currentReqComments,
  } = mainContext;

  const jobContext = useContext(iranTolJobCntxt);
  const { handleDownloadReqPlans } = jobContext;
  const history = useHistory();
  const dispatch = useDispatch();
  const { reqId, fileId } = useParams();
  console.log(reqId, fileId);

  //useSelector

  const currentReqFiles = useSelector(selectCurrentReqFiles);
  const irantoolModalSearch = useSelector(selectIrantoolModalSearch);
  const irantoolMaterialItem = useSelector(selectIrantoolMaterialItem);

  const irantoolToolItem = useSelector(selectIrantoolToolItem);

  const irantoolActionItem = useSelector(selectIrantoolActionItem);

  const currentReqInfo = useSelector(selectCurrentReqInfo);
  const formErrors = useSelector(selectFormErrors);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (currentReqInfo.requestId !== undefined)
      dispatch(
        handleReqFiles({
          reqId: currentReqInfo.requestId,
          index: 0,
          multi: 0,
          justShow: 1,
          fileName: "",
        })
      );
  }, [currentReqInfo]);

  useEffect(() => {
    dispatch(handleIrantoolMaterialUnitOptions());
    dispatch(handleIrantoolActionDeptOptions());
    dispatch(handleIrantoolActionDeviceOptions());
    dispatch(handleIrantoolActionOprations());
  }, []);

  useEffect(() => {
    if (user._id !== undefined) {
      dispatch(handleIrantoolActionOpratorOptions());
    }
  }, [user]);

  useEffect(() => {
    dispatch(handleCurrentReqInfo({ reqId: reqId, reqType: 1 }));
  }, []);

  //handle file
  const file = currentReqFiles.find((file) => file.id === fileId);

  //should make this not happen when the id of the plan is same
  useEffect(() => {
    dispatch(RsetIrantoolMaterialCode(""));
    dispatch(RsetIrantoolMaterialName(""));
    dispatch(RsetIrantoolMaterialCount(""));
    dispatch(RsetIrantoolMaterialUnit(""));
    dispatch(RsetIrantoolToolCode(""));
    dispatch(RsetIrantoolToolName(""));
    dispatch(RsetIrantoolToolCount(""));
    dispatch(RsetIrantoolToolUnit(""));
    dispatch(RsetIrantoolActionDept(""));
    dispatch(RsetIrantoolActionOprator(""));
    dispatch(RsetIrantoolActionDevice(""));
    dispatch(RsetIrantoolActionCount(""));
    dispatch(RsetIrantoolMaterialItem([]));
    dispatch(RsetIrantoolToolItem([]));
    dispatch(RsetIrantoolActionItem([]));
    dispatch(RsetFormErrors(""));
  }, []);

  //validation of whole Page
  const materialTableIsValid = irantoolMaterialItem.length !== 0;
  const ActionTableIsValid = irantoolActionItem.length !== 0;

  const mtrWrkflwIsValid = materialTableIsValid && ActionTableIsValid;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (mtrWrkflwIsValid) {
      const reqValues = {
        forProject: 2,
        planId: fileId,
      };

      const postWarehouseReqRes = await postWarehouseReq(reqValues);

      if (postWarehouseReqRes.data.code === 415) {
        const sendAction = async () => {
          const toPersons = await getToPersonByRole(
            "3, 36",
            user.Location,
            user.CompanyCode,
            1,
            null,
            "0"
          );
          const actionValuesFirst = {
            actionCode: 0,
            actionId: postWarehouseReqRes.data.id,
            userId: localStorage.getItem("id"),
            typeId: 2,
            toPersons: localStorage.getItem("id"),
            comment: null,
          };
          const actionValuesSecond = {
            actionCode: 6,
            actionId: postWarehouseReqRes.data.id,
            userId: localStorage.getItem("id"),
            typeId: 2,
            // toPersons: toPersons.data.list.map((item) => item.value).join(","),
            toPersons: "6434f84d89828a92a92181c4",
            comment: null,
          };
          const postActionFirstRes = await postAction(actionValuesFirst);
          if (postActionFirstRes.data.code === 415) {
            const postActionSecondRes = await postAction(actionValuesSecond);
            if (postActionSecondRes.data.code === 415) {
              successMessage("درخواست مورد نظر با موفقیت ثبت شد!");
              dispatch(RsetFormErrors(""));
              dispatch(RsetIrantoolToolItem(""));
              dispatch(RsetIrantoolMaterialItem(""));
            } else {
              errorMessage("خطا");
            }
          } else {
            errorMessage("!خطا");
          }
        };
        const items = [...irantoolMaterialItem, ...irantoolToolItem];
        let count = 0;
        items.map(async (item, idx) => {
          const reqItemValues = {
            userId: user._id,
            requestId: postWarehouseReqRes.data.id,
            itemName: item.itemName + "-" + item.itemCode,
            itemAmount: item.itemCount,
            itemUnit: item.itemUnit.value,
            mainPlace: "-",
            subPlace: "-",
            comment: item.itemDescription,
            row: idx,
          };
          const postWarehouseReqItemsRes = await postWarehouseReqItems(
            reqItemValues
          );
          if (postWarehouseReqItemsRes.data.code === 415) {
            count = count + 1;
            if (count === items.length) {
              sendAction();
            }
          }
        });
      }

      const actionItems = [...irantoolActionItem];
      actionItems.map(async (item, idx) => {
        const actionValues = {
          userId: localStorage.getItem("id"),
          operatingDepId: item.actionDept.value,
          operationId: item.actionOpration.value,
          operatorId: item.actionOprator.value,
          machineId: item.actionDevice.value,
          requiredTime: item.actionWorkTime,
          amount: item.actionCount,
          planId: fileId,
          comment: item.actionDescription,
          row: String(idx),
        };
        const postWorkAndMaterialsRes = await postWorkAndMaterials(
          reqId,
          actionValues
        );
        if (postWorkAndMaterialsRes.data.code === 415) {
          dispatch(RsetIrantoolActionItem(""));
        }
      });
    } else {
      errorMessage(
        "اضافه کردن جدول مواد اولیه، ابزارآلات و برنامه عملیاتی اجباری است!"
      );
    }
  };

  console.log(currentReqInfo);

  return (
    <Container fluid className="mt-5">
      <div className="position-relative">
        {currentReqInfo.requestId === undefined ? (
          <div className="vh-100 mb-3">
            {" "}
            <Loading />{" "}
          </div>
        ) : (
          <Fragment>
            <Row>
              <Table bordered responsive className="shadow-sm">
                <thead className="bg-secondary text-white">
                  <tr>
                    <th>نام و نام خانوادگی</th>
                    <th>شرکت</th>
                    <th>نام پروژه</th>
                    <th>نوع فرایند</th>
                    <th>نوع پروژه</th>
                    <th>تعداد</th>
                    <th>تاریخ مدنظر مشتری</th>
                    <th>توضیحات</th>
                    <th>پیوست</th>
                  </tr>
                </thead>
                <tbody className="bg-light">
                  <tr>
                    <td>{xssFilters.inHTMLData(currentReqInfo.fullName)}</td>
                    <td>{xssFilters.inHTMLData(currentReqCo)}</td>
                    <td>{xssFilters.inHTMLData(currentReqInfo.projectName)}</td>
                    <td>
                      {xssFilters.inHTMLData(currentReqInfo.requestTypeName)}
                    </td>
                    <td>
                      {xssFilters.inHTMLData(currentReqInfo.toolTypeName)}
                    </td>
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
                    <td>
                      {currentReqFiles.length !== 0 ? (
                        <Fragment>
                          <ul className="d-flex list-unstyled">
                            <li
                              key={file.path}
                              className="mx-2"
                              onClick={() => {
                                dispatch(
                                  handleReqFiles({
                                    reqId: currentReqInfo.requestId,
                                    index: file.row,
                                    multi: 0,
                                    justShow: 0,
                                    fileName: file.id,
                                  })
                                );
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faFile}
                                className="font24 cursorPointer"
                              />
                            </li>
                          </ul>
                        </Fragment>
                      ) : (
                        <p>فایلی آپلود نشده است!</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <hr className="mt-5 mb-4" />
            <IranTolJobMaterial />

            <hr className="mt-5 mb-4" />
            <IranTolJobTool />
            <hr className="mt-4 mb-4" />

            <IranTolJobAction />

            <hr className="mt-4 mb-5" />
            <Row className="mb-5">
              <Col
                md="5"
                xl="4"
                className="mx-auto d-flex justify-content-between"
              >
                <Button
                  variant="success"
                  className="w-45 mb-3"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  ثبت درخواست
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  className="w-45 mb-3"
                  onClick={() => {
                    dispatch(RsetIrantoolMaterialCode(""));
                    dispatch(RsetIrantoolMaterialName(""));
                    dispatch(RsetIrantoolMaterialCount(""));
                    dispatch(RsetIrantoolMaterialUnit(""));
                    dispatch(RsetIrantoolToolCode(""));
                    dispatch(RsetIrantoolToolName(""));
                    dispatch(RsetIrantoolToolCount(""));
                    dispatch(RsetIrantoolToolUnit(""));
                    dispatch(RsetIrantoolActionDept(""));
                    dispatch(RsetIrantoolActionOprator(""));
                    dispatch(RsetIrantoolActionDevice(""));
                    dispatch(RsetIrantoolActionCount(""));
                    dispatch(RsetIrantoolMaterialItem([]));
                    dispatch(RsetIrantoolToolItem([]));
                    dispatch(RsetIrantoolActionItem([]));
                    dispatch(RsetFormErrors(""));
                    history.push("/IrtReqList");
                  }}
                >
                  انصراف
                </Button>
              </Col>
            </Row>
          </Fragment>
        )}
      </div>
      {irantoolModalSearch && <IrantoolMaterialModalSearch />}
    </Container>
  );
};

export default IranTolJobMaterialWorkflow;
