import axios from 'axios';
import {urlAPI} from '../apiAddress';

const changeStateOrderService = async (id, State, days) => {
  try {
    const response = await axios.put(urlAPI + 'orderService/changeStateOrder', {
      id: id,
      State: State,
      days: days,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default changeStateOrderService;
