import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getInforStaff = async id => {
  try {
    const response = await axios.get(urlAPI + `staff/${id}`);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getInforStaff;
