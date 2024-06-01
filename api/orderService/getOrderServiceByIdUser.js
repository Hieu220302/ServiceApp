import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getOrderServiceByIdUser = async id => {
  try {
    const response = await axios.get(urlAPI + `orderService/idUser/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getOrderServiceByIdUser;
