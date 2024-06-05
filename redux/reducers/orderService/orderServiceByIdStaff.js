import {createSlice} from '@reduxjs/toolkit';
import getOrderServiceByIdStaff from '../../../api/orderService/getOrderServiceByIdStaff';
const initialState = {
  dataOrderServiceByIdStaff: [],
  isLoading: false,
  error: null,
};

const orderServiceSlice = createSlice({
  name: 'orderServiceByIdStaff',
  initialState,
  reducers: {
    orderServiceRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    orderServiceSuccess: (state, action) => {
      state.isLoading = false;
      state.dataOrderServiceByIdStaff = action.payload;
    },
    orderServiceFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const orderServiceByIdStaff = id => async (dispatch, getState) => {
  try {
    dispatch(orderServiceRequest());
    const data = await getOrderServiceByIdStaff(id);
    dispatch(orderServiceSuccess(data));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(
      orderServiceSlice.actions.orderServiceFailure({error: errorMessage}),
    );
    return 404;
  }
};

export const {orderServiceRequest, orderServiceSuccess, orderServiceFailure} =
  orderServiceSlice.actions;
export default orderServiceSlice.reducer;
