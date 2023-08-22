export const requestsReducer = (state = [], action) => {
    switch (action.type) {
        case "INIT":
            return [...action.data];
        case "ADD_REQUEST":
            return [...action.data];
        case "ACCEPT_REQUEST":
            return [...action.data];
        case "DELETE_REQUEST":
            return [...action.data];
        case "UPDATE_REQUEST":
            return [...action.data];
        default:
            return state;
    }
};