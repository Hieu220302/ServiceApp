import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getInforService = async () => {
  try {
    const response = await axios.get(urlAPI + 'inforService');
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getInforService;
