import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';

import loginSlice from './reducers/Login/signinReducer';
import groupService from './reducers/groupService/groupServiceReducer';
import inforService from './reducers/inforService/inforServiceReducer';
const rootReducer = combineReducers({
  login: loginSlice,
  groupService: groupService,
  inforService: inforService,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
    }),
});
export const persistor = persistStore(store);
