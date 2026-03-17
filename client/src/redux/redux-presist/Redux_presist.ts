import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { baseAPI } from "../rest-api/baseApi"
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist"
import { setupListeners } from "@reduxjs/toolkit/query"
import userReducer from  "@/redux/slices/userSlice"
import sessionStorage from "redux-persist/lib/storage/session"
import { useDispatch, useSelector } from "react-redux";


// SSR-safe storage
const createNoopStorage = () => ({
    getItem() { return Promise.resolve(null)},
    setItem(_key:string,value:unknown) { return Promise.resolve(value)},
    removeItem(){return Promise.resolve()}
})


const persistStorage = typeof window !== "undefined" ? sessionStorage : createNoopStorage()

const persistConfig = {
     key :"root",
     storage : persistStorage,
    whitelist: ["user"],
}

const rootReducer  = combineReducers({
     auth: userReducer,
    [baseAPI.reducerPath] : baseAPI.reducer,

})

const persistedReducer  = persistReducer(persistConfig,rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
          ],
        },
      }).concat(baseAPI.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  // --- 5. Persistor and Setup ---
export const persistor = persistStore(store);

// Enable auto-refetch for RTK Query
setupListeners(store.dispatch);

// ✅ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Typed Hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// ✅ Enable auto refetch
setupListeners(store.dispatch);

// ❌ DO NOT auto-call here
// initializeStoreApp();

export default store;