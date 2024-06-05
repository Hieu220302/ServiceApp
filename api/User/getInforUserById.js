import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getInforUserById = async id => {
  try {
    const response = await axios.get(urlAPI + `users/${id}`);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getInforUserById;
