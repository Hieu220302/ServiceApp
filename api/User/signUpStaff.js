import axios from 'axios';
import {urlAPI} from '../apiAddress';

const signUpStaff = async id => {
  try {
   // console.log(id);
    const response = await axios.put(urlAPI + `users/signUpStaff/${id}`);
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default signUpStaff;
