import {createSlice} from '@reduxjs/toolkit';
import getUserByUserName from '../../../API/User/getUser';
import {store} from '../../store';
import {startMapper} from 'react-native-reanimated';
import {logout} from '../Login/signinReducer';

const initialState = {
  data: [],
  loading: false,
  error: null,
};
const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    getUserStart: state => {
      state.loading = true;
      state.error = null;
    },
    getUsersuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },

    getUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetStateUser: state => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    resetUser: state => {
      return initialState;
    },
  },
});

export const fetchUserByUserName = userName => async dispatch => {
  try {
    dispatch(getUserStart());
    const data = await getUserByUserName(userName);
    //console.log('data User  in fetchUser reducer', data);

    dispatch(getUsersuccess(data));

    return data;
  } catch (error) {
    // dispatch(logout())

    dispatch(getUserFailure(error.message));
  }
  // return data
};

export const {
  getUserStart,
  getUsersuccess,
  getUserFailure,
  resetUser,
  resetStateUser,
} = userSlice.actions;

export default userSlice.reducer;
