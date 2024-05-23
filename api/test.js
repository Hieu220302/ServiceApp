import axios from 'axios';
import {urlAPI} from './apiAddress';

const getTest = async () => {
  try {
    const response = await axios.get(urlAPI + 'users');
    return response.data;
  } catch (error) {
    console.error('Error getting bill by  id user: ', error);
    throw error;
  }
};

export default getTest;
