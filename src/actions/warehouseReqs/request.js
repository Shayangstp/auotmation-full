import { getRequest } from "../services/requestService";

export const getSingleRequest = requestId => {
    return async dispatch => {
        const { data } = await getRequest(requestId);
        await dispatch({ type: "GET_REQUEST", data: data.request });
    };
};