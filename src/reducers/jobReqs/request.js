export const requestReducer = (state = {}, action) => {
    switch (action.type) {
        case "GET_REQUEST":
            return { ...action.data };
        default:
            return state;
    }
};
