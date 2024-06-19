import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getInforCustomer = async () => {
  try {
    const response = await axios.get(urlAPI + `users/getAllByStaff`);

    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getInforCustomer;
