import { createContext } from "react";

export const iranTolJobCntxt = createContext({
    iTJProjectName : '',
    setITJProjectName : () => {},
    iTJProjectType : '',
    setITJProjectType : () => {},
    iTJProjectTypeSelect : [],
    iTJProjectTool : '',
    setITJProjectTool : () => {},
    iTJProjectToolSelect : [],
    iTJProjectAmount : '',
    setITJProjectAmount : () => {},
    iTJProjectDeadline : null,
    setITJProjectDeadline : () => {},
    iTJProjectDesc : '',
    setITJProjectDesc : () => {},
    handleConfirmITJReq : () => {},
    handleResetITJReq : () => {},
});