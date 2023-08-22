import { createContext } from "react";

export const officeReqContext = createContext({
    handleGetCurrentRequest : () => {},
    currentRequest : [],
});
