import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from '../services/CryptoService';
import cryptoReducer from './reducers/CryptoSlice';

const rootReducer = combineReducers({
  crypto: cryptoReducer,
  [cryptoApi.reducerPath]: cryptoApi.reducer,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(cryptoApi.middleware),
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
