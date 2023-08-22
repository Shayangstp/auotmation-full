import { createContext } from "react";

export const warehouseAddProCntxt = createContext({
    addProCode : '',
    setAddProCode : () => {},
    addProName : '',
    setAddProName : () => {},
    handleAddProCode : () => {},
    handleAddProName : () => {},
    addProList : [],
    setAddProList : () => {},
    addProModal : false,
    setAddProModal : () => {},
    selectedPro : {},
    setSelectedPro : () => {}
});
