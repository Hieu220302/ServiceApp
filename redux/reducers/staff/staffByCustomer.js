import {createSlice} from '@reduxjs/toolkit';
import getStaffByCustomer from '../../../api/staff/getStaffByCustomer';
const initialState = {
  dataInforStaff: [],
  isLoading: false,
  error: null,
};

const inforStaffSlice = createSlice({
  name: 'inforStaff',
  initialState,
  reducers: {
    inforStaffRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    inforStaffSuccess: (state, action) => {
      state.isLoading = false;
      state.dataInforStaff = action.payload;
    },
    inforStaffFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const inforStaff = () => async (dispatch, getState) => {
  try {
    dispatch(inforStaffRequest());
    const data = await getStaffByCustomer();
    dispatch(inforStaffSuccess(data));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(inforStaffSlice.actions.inforStaffFailure({error: errorMessage}));
    return 404;
  }
};

export const {inforStaffRequest, inforStaffSuccess, inforStaffFailure} =
  inforStaffSlice.actions;
export default inforStaffSlice.reducer;
