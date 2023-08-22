import { createContext } from "react";

export const cookiesContext = createContext({
    setCookie : () => {},
    getCookie : () => {},
});