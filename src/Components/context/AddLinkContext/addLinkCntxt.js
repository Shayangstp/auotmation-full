import { createContext } from "react";

export const addLinkCntxt = createContext({
    reqItemLink : '',
    setReqItemLink : () => {},
    reqItemLinks : [],
    setReqItemLinks : () => {},
    reqNewItemLinksModal : false,
    setReqNewItemLinksModal : () => {}
});