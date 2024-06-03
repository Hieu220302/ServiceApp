import {createSlice} from '@reduxjs/toolkit';
import getServicePackage from '../../../api/servicePackage/getServicePackage';
const initialState = {
  dataServicePackage: [],
  isLoading: false,
  error: null,
};

const servicePackageSlice = createSlice({
  name: 'servicePackage',
  initialState,
  reducers: {
    servicePackageRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    servicePackageSuccess: (state, action) => {
      state.isLoading = false;
      state.dataServicePackage = action.payload;
    },
    servicePackageFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const servicePackage = () => async (dispatch, getState) => {
  try {
    dispatch(servicePackageRequest());
    const data = await getServicePackage();
    dispatch(servicePackageSuccess(data));
    return data;
  } catch (error) {
    let errorMessage = 'Error fetching data';

    dispatch(
      servicePackageSlice.actions.servicePackageFailure({error: errorMessage}),
    );
    return 404;
  }
};

export const {servicePackageRequest, servicePackageSuccess, servicePackageFailure} =
  servicePackageSlice.actions;
export default servicePackageSlice.reducer;
