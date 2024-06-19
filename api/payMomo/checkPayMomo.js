import axios from 'axios';
import {urlAPI} from '../apiAddress';

const checkPayMomo = async orderId => {
  try {
    const response = await axios.post(urlAPI + 'check-status-transaction', {
      orderId: orderId,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default checkPayMomo;
