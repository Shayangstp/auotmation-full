import { createContext } from "react";

export const allNewReqsContext = createContext({
    handleGetCurrentRequest : () => {},
    acceptReqComment : '',
    setAcceptReqComment: () => {}
});
