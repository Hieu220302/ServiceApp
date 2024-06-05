import {createSlice} from '@reduxjs/toolkit';
import getInforUserById from '../../../api/User/getInforUserById';
const initialState = {
  dataInforUser: [],
  isLoading: false,
  error: null,
};

const inforUserSlice = createSlice({
  name: 'inforUser',
  initialState,
  reducers: {
    inforUserRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    inforUserSuccess: (state, action) => {
      state.isLoading = false;
      state.dataInforUser = action.payload;
    },
    inforUserFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const inforUser = id => async (dispatch, getState) => {
  try {
    dispatch(inforUserRequest());
    const data = await getInforUserById(id);
    dispatch(inforUserSuccess(data[0]));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(inforUserSlice.actions.inforUserFailure({error: errorMessage}));
    return 404;
  }
};

export const {inforUserRequest, inforUserSuccess, inforUserFailure} =
  inforUserSlice.actions;
export default inforUserSlice.reducer;
