import { baseAPI } from "@/redux/rest-api/baseApi";
import { combineReducers } from "@reduxjs/toolkit";



const reducers = combineReducers({
    [baseAPI.reducerPath]: baseAPI.reducer
})


export default reducers;