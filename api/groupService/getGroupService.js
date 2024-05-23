import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getGroupService = async () => {
  try {
    const response = await axios.get(urlAPI + 'groupService');
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getGroupService;
