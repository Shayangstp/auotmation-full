import { toast } from "react-toastify";

export const successMessage = message => {
    toast.success(message, {
        theme: 'colored',
        position: "bottom-right",
        closeButton: true,
        closeOnClick: true
    });
};

export const warningMessage = message => {
    toast.warning(message, {
        theme: 'colored',
        position: "bottom-right",
        closeButton: true,
        closeOnClick: true
    });
};

export const errorMessage = message => {
    toast.error(message, {
        theme: 'colored',
        position: "bottom-right",
        closeButton: true,
        closeOnClick: true
    });
};