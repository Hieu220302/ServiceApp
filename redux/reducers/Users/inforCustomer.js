import {createSlice} from '@reduxjs/toolkit';

import getInforCustomer from '../../../api/User/getInforCustomer';
const initialState = {
  dataInforCustomer: [],
  isLoading: false,
  error: null,
};

const inforCustomerSlice = createSlice({
  name: 'inforCustomer',
  initialState,
  reducers: {
    inforCustomerRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    inforCustomerSuccess: (state, action) => {
      state.isLoading = false;
      state.dataInforCustomer = action.payload;
    },
    inforCustomerFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const inforCustomer = id => async (dispatch, getState) => {
  try {
    dispatch(inforCustomerRequest());
    const data = await getInforCustomer();
    dispatch(inforCustomerSuccess(data));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(
      inforCustomerSlice.actions.inforCustomerFailure({error: errorMessage}),
    );
    return 404;
  }
};

export const {
  inforCustomerRequest,
  inforCustomerSuccess,
  inforCustomerFailure,
} = inforCustomerSlice.actions;
export default inforCustomerSlice.reducer;
