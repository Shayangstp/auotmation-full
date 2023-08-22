import { createContext } from "react";

export const reqContext = createContext({
    warehouse : '',
    setWarehouse : () => {},
    requestDescription : '',
    setRequestDescription : () => {},
    handleGetCurrentRequest : () => {},
    handleGetCurrentRequestLinks : () => {}
});
