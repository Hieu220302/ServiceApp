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
import orderServiceByIdUser from './reducers/orderService/orderServiceByIdUser';
import inforStaff from './reducers/staff/staffByCustomer';
import servicePackage from './reducers/servicePackage/servicePackage';
import inforUser from './reducers/Users/inforUser';
import orderServiceByIdStaff from './reducers/orderService/orderServiceByIdStaff';
import inforCustomer from './reducers/Users/inforCustomer';
const rootReducer = combineReducers({
  login: loginSlice,
  groupService: groupService,
  inforService: inforService,
  orderServiceByIdUser: orderServiceByIdUser,
  inforStaff: inforStaff,
  inforCustomer: inforCustomer,
  servicePackage: servicePackage,
  inforUser: inforUser,
  orderServiceByIdStaff: orderServiceByIdStaff,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 10000, // Thời gian timeout tính bằng milliseconds (ở đây là 10 giây)
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
