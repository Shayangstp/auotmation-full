import { createContext } from "react";

export const context = createContext({
    userName: "",
    setUserName: () => {},
    password: "",
    setPassword: () => {},
    gender:"",
    setGender: () => {},
    fName: "",
    setFName: () => {},
    lName: "",
    setLName: () => {},
    confirmPassword: "",
    setConfirmPassword: () => {},
    birthday: "",
    setBirthday: () => {},
    email: "",
    setEmail: () => {},
    phoneNumber: "",
    setPhoneNumber: () => {},
    localPhoneNumber: "",
    setLocalPhoneNumber: () => {},
    department: "",
    setDepartment: () => {},
    supervisor: "",
    setSupervisor: () => {},
    avatar: "",
    setAvatar: () => {},
    handleRegister: () => {},
    departments: [],
    setDepartment: () => {},
    handleResetRegister: () => {},
});