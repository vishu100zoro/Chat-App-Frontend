import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

//persist our store
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {persistReducer} from "redux-persist";
// import thunk from "redux-thunk";
import { setupListeners } from "@reduxjs/toolkit/query/react";

const reducer=combineReducers({
    user:userSlice,
    [appApi.reducerPath]:appApi.reducer,
});

const persistConfig={
    key:"root",
    storage,
    blackList:[appApi.reducerPath],
}

const persistedReducer=persistReducer(persistConfig,reducer);

const store= configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: appApi,
      },
      serializableCheck: false, // Disable serializableCheck for RTK-Query middleware
    }).concat(appApi.middleware),
    // middleware: [thunk, appApi.middleware],
})

setupListeners(store.dispatch);

export default store;
