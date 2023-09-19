import http from "./httpService";
import config from "./config.json";

export const getITJProjectTools = () => {
  return http.get(`${config.localapi}/work/irantool/toolTypes`, {
    timeout: 30000,
  });
};
export const getITJProjectTypes = () => {
  return http.get(`${config.localapi}/work/irantool/reqTypes`, {
    timeout: 30000,
  });
};

// post new job req
export const postITJReq = (iTJReqValues, reqFiles) => {
  return http.post(
    `${config.localapi}/work/irantool`,
    reqFiles,
    { params: iTJReqValues },
    { timeout: 30000 }
  );
};

// download req file
// 0 false
export const getITJReqFileList = (reqId, index, multi, justShow) => {
  if (justShow === 1) {
    return http.get(
      `${config.localapi}/work/irantool/download/` + reqId,
      { params: { index: index, multiple: multi, justShow: justShow } },
      { timeout: 30000 }
    );
  } else {
    return http.get(
      `${config.localapi}/work/irantool/download/` + reqId,
      {
        responseType: "blob",
        params: { index: index, multiple: multi, justShow: justShow },
      },
      { timeout: 30000 }
    );
  }
};

// download req file
export const downloadITJReqFile = (reqId, index, multi) => {
  return http.get(
    `${config.localapi}/work/irantool/download/` +
      reqId +
      "/" +
      index +
      "/" +
      multi,
    { responseType: "blob" },
    { timeout: 30000 }
  );
};

// download req file
export const addITJReqFile = (reqSerial, reqId, files) => {
  return http.patch(
    `${config.localapi}/work/irantool/insertPlans/` + reqSerial + "/" + reqId,
    files,
    { timeout: 30000 }
  );
};

// download req file
export const downloadITJReqPlans = (reqId, index, multi) => {
  return http.get(
    `${config.localapi}/work/irantool/download/plans/` +
      reqId +
      "/" +
      index +
      "/" +
      multi,
    { responseType: "blob" },
    { timeout: 30000 }
  );
};

export const getWorkDeps = () => {
  return http.get(`${config.localapi}/work/irantool/processDep`, {
    timeout: 30000,
  });
};
export const getWorkTypes = () => {
  return http.get(`${config.localapi}/work/irantool/processType`, {
    timeout: 30000,
  });
};
export const getWorkDevices = () => {
  return http.get(`${config.localapi}/work/irantool/machine`, {
    timeout: 30000,
  });
};

//opration step
export const postWorkAndMaterials = (reqId, reqValues) => {
  return http.post(
    `${config.localapi}/work/irantool/programming/` + reqId,
    reqValues,
    // userId: localStorage.getItem("id"),
    { timeout: 30000 }
  );
};

export const patchWorkAndMaterials = (
  reqId,
  processList,
  materialList,
  anbartoPersonsRes
) => {
  return http.patch(
    `${config.localapi}/work/irantool/programming/` + reqId,
    {
      applicant: localStorage.getItem("id"),
      program: processList,
      materials: materialList,
      toPersons: anbartoPersonsRes,
    },
    { timeout: 30000 }
  );
};

// devices
export const irantoolCategoryList = () => {
  return http.get(`${config.localapi}/work/irantool/machine/category`, {
    timeout: 30000,
  });
};
export const submitIrantoolReq = (softwareReqValues) => {
  return http.post(
    `${config.localapi}/work/irantool/machine`,
    softwareReqValues,
    { timeout: 30000 }
  );
};
export const getIrantoolList = (filterValues) => {
  return http.get(
    `${config.localapi}/work/irantool/machine`,
    {
      params: filterValues,
    },
    { timeout: 30000 }
  );
};
export const editIrantoolMachine = (machineId, editedObject) => {
  return http.patch(
    `${config.localapi}/work/irantool/machine/${machineId}`,
    editedObject,
    { timeout: 30000 }
  );
};
export const irantoolPostAction = (actionValue) => {
  return http.post(
    `${config.localapi}/work/irantool/machine/log`,
    actionValue,
    { timeout: 30000 }
  );
};

// base info
export const irantoolChangeOperationUnit = (changedValues) => {
  return http.patch(
    `${config.localapi}/work/irantool/operatingDep`,
    changedValues,
    { timeout: 30000 }
  );
};
export const irantoolOperationUnitList = (changedValues) => {
  return http.patch(`${config.localapi}/work/irantool/operatingDep`, {
    timeout: 30000,
  });
};
export const irantoolActionMachine = () => {
  return http.get(`${config.localapi}/work/irantool/machine`, {
    timeout: 30000,
  });
};
export const irantoolActionDep = () => {
  return http.get(`${config.localapi}/work/irantool/operatingDep`, {
    timeout: 30000,
  });
};
export const irantoolOperationList = () => {
  return http.get(`${config.localapi}/work/irantool/operations`, {
    timeout: 30000,
  });
};
export const irantoolChangeOperations = (changedValues) => {
  return http.patch(
    `${config.localapi}/work/irantool/operations`,
    changedValues,
    { timeout: 30000 }
  );
};
export const irantoolReasonOfDelayList = () => {
  return http.get(`${config.localapi}/work/irantool/reasonOfDelay`, {
    timeout: 30000,
  });
};
export const irantoolChangeReasonOfDelay = (changedValues) => {
  return http.patch(
    `${config.localapi}/work/irantool/reasonOfDelay`,
    changedValues,
    { timeout: 30000 }
  );
};

//get material
export const getgoodInfo = (values) => {
  return http.get(
    `${config.localapi}/work/ceramic/goods/costOfItem`,
    {
      params: values,
    },
    { timeout: 30000 }
  );
};

//list
export const getIrantoolMaterialList = (filterValues) => {
  return http.get(`${config.localapi}/work/ceramic/goods/getList`, {
    params: filterValues,
  });
};
