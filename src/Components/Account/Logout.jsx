import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RsetUser, RsetLoggedIn } from "../Slices/mainSlices";
const Logout = ({ history }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.clear();
        dispatch(RsetUser({}));
        dispatch(RsetLoggedIn(false));
        history.push("/");
    }, []);

    return null;
};

export default withRouter(Logout);
