import axios from 'axios';
import {urlAPI} from '../apiAddress';

const payMomo = async amount => {
  try {
    const response = await axios.post(urlAPI + 'payment', {
      amount: amount,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default payMomo;
