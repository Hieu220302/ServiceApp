import {createSlice} from '@reduxjs/toolkit';
import getOrderServiceByIdGroupService from '../../../api/orderService/getOrderServiceByIdGroupService';
const initialState = {
  dataOrderServiceByIdGroup: [],
  isLoading: false,
  error: null,
};

const orderServiceSlice = createSlice({
  name: 'orderServiceByIdGroup',
  initialState,
  reducers: {
    orderServiceRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    orderServiceSuccess: (state, action) => {
      state.isLoading = false;
      state.dataOrderServiceByIdGroup = action.payload;
    },
    orderServiceFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const orderServiceByIdGroup = props => async (dispatch, getState) => {
  try {
    dispatch(orderServiceRequest());
    const data = await getOrderServiceByIdGroupService({
      id_group_service: props.id_group_service,
      id_user: props.id_user,
    });
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
