import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getStaffByCustomer = async () => {
  try {
    const response = await axios.get(urlAPI + 'staff/customer');
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getStaffByCustomer;
