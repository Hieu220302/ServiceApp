import axios from 'axios';
import {urlAPI} from '../apiAddress';

const cancelStaff = async id => {
  try {
    const response = await axios.put(urlAPI + 'orderService/cancelStaff', {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default cancelStaff;
