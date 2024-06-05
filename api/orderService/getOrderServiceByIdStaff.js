import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getOrderServiceByIdStaff = async id => {
  try {
    const response = await axios.get(urlAPI + `orderService/idStaff/${id}`);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getOrderServiceByIdStaff;
