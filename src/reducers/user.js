export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_USER":
            return { ...action.data }; //spread Operator
        case "CLEAR_USER":
            return { ...action.data };
        default:
            return state;
    }
};