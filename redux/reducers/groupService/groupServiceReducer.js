import {createSlice} from '@reduxjs/toolkit';
import getGroupService from '../../../api/groupService/getGroupService';
const initialState = {
  dataGroupService: [],
  isLoading: false,
  error: null,
};

const groupServiceSlice = createSlice({
  name: 'groupService',
  initialState,
  reducers: {
    groupServiceRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    groupServiceSuccess: (state, action) => {
      state.isLoading = false;
      state.dataGroupService = action.payload;
    },
    groupServiceFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const groupService = () => async (dispatch, getState) => {
  try {
    dispatch(groupServiceRequest());
    const data = await getGroupService();
    dispatch(groupServiceSuccess(data));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(
      groupServiceSlice.actions.groupServiceFailure({error: errorMessage}),
    );
    return 404;
  }
};

export const {groupServiceRequest, groupServiceSuccess, groupServiceFailure} =
  groupServiceSlice.actions;
export default groupServiceSlice.reducer;
