import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getServicePackage = async () => {
  try {
    const response = await axios.get(urlAPI + 'servicePackage');
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getServicePackage;
