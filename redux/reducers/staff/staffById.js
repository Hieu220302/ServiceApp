import {createSlice} from '@reduxjs/toolkit';
import getInforStaff from '../../../api/staff/getInforStaff';
const initialState = {
  dataInforStaffId: [],
  isLoading: false,
  error: null,
};

const inforStaffByIdSlice = createSlice({
  name: 'inforStaffById',
  initialState,
  reducers: {
    inforStaffByIdRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    inforStaffByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.dataInforStaffId = action.payload;
    },
    inforStaffByIdFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const inforStaffById = id => async (dispatch, getState) => {
  try {
    dispatch(inforStaffByIdRequest());
    const data = await getInforStaff(id);
    dispatch(inforStaffByIdSuccess(data[0]));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(
      inforStaffByIdSlice.actions.inforStaffByIdFailure({error: errorMessage}),
    );
    return 404;
  }
};

export const {
  inforStaffByIdRequest,
  inforStaffByIdSuccess,
  inforStaffByIdFailure,
} = inforStaffByIdSlice.actions;
export default inforStaffByIdSlice.reducer;
