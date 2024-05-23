import {createSlice} from '@reduxjs/toolkit';
import getInforService from '../../../api/inforService/getInforService';
const initialState = {
  dataInforService: [],
  isLoading: false,
  error: null,
};

const inforServiceSlice = createSlice({
  name: 'inforService',
  initialState,
  reducers: {
    inforServiceRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    inforServiceSuccess: (state, action) => {
      state.isLoading = false;
      state.dataInforService = action.payload;
    },
    inforServiceFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const inforService = () => async (dispatch, getState) => {
  try {
    dispatch(inforServiceRequest());
    const data = await getInforService();
    dispatch(inforServiceSuccess(data));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(
      inforServiceSlice.actions.inforServiceFailure({error: errorMessage}),
    );
    return 404;
  }
};

export const {inforServiceRequest, inforServiceSuccess, inforServiceFailure} =
  inforServiceSlice.actions;
export default inforServiceSlice.reducer;
