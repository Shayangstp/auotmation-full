import { combineReducers } from "redux";
import { userReducer } from "./user";
import { requestReducer } from "./jobReqs/request";
import { requestsReducer } from "./jobReqs/requests";

const reducers = combineReducers({
    user: userReducer,
    request: requestReducer,
    requests: requestsReducer,

})

export default reducers;