import { getCurrentReqInfo } from "../../Services/rootServices";

export const getSingleRequest = (requestId, type) => {
    return async dispatch => {
        const { data } = await getCurrentReqInfo(requestId, type);
        await dispatch({ type: "GET_REQUEST", data: data[0] });
    };
};