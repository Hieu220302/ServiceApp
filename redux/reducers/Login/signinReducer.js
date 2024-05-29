import {createSlice} from '@reduxjs/toolkit';
import loginPage from '../../../api/Login/loginApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const loginUser = (username, password) => async (dispatch, getState) => {
  try {
    await AsyncStorage.removeItem('persist:root');

    dispatch(loginRequest());

    const data = await loginPage(username, password);
    dispatch(loginSuccess(data[0]));
    return data;
  } catch (error) {
    await AsyncStorage.removeItem('persist:root');

    let errorMessage = 'Error fetching data';

    dispatch(loginSlice.actions.loginFailure({error: errorMessage}));
    return 404;
  }
};

export const {loginRequest, loginSuccess, loginFailure, logout} =
  loginSlice.actions;
export default loginSlice.reducer;
