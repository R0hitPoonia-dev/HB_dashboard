import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
// import { persistReducer } from "redux-persist";
import { authReducer } from "@/redux/slice/authSlice";
// import sessionStorage from "redux-persist/es/storage/session";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import cartSlice from "./slice/cartSlice";
import { authApi } from "./api/authApi";
// import { userApi } from "./api/userApi";
// import { productApi } from "./api/prductsApi";
// import { cartApi } from "./api/cartApi";
// import { adminApi } from "./api/adminApi";
// import orderSlice from "./slice/orderSlice";

// const authPersistConfig = {
//   key: "root",
//   storage: AsyncStorage,
// };

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  // [userApi.reducerPath]: userApi.reducer,
  // [productApi.reducerPath]: productApi.reducer,
  // [cartApi.reducerPath]: cartApi.reducer,
  // [adminApi.reducerPath]: adminApi.reducer,
  // Connect the PostApi reducer to the store
  // order: orderSlice,
  auth: authReducer,
  // cart: cartSlice,
});

// const persistedReducer = persistReducer(authPersistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      // userApi.middleware,
      // productApi.middleware,
      // cartApi.middleware,
      // adminApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
