import {createSlice} from '@reduxjs/toolkit';
import getOrderServiceByIdUser from '../../../api/orderService/getOrderServiceByIdUser';
const initialState = {
  dataOrderServiceByIdUser: [],
  isLoading: false,
  error: null,
};

const orderServiceSlice = createSlice({
  name: 'orderServiceByIdUser',
  initialState,
  reducers: {
    orderServiceRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    orderServiceSuccess: (state, action) => {
      state.isLoading = false;
      state.dataOrderServiceByIdUser = action.payload;
    },
    orderServiceFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const orderServiceByIdUser = (id) => async (dispatch, getState) => {
  try {
    dispatch(orderServiceRequest());
    const data = await getOrderServiceByIdUser(id);
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
