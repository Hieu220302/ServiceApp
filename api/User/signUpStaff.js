import axios from 'axios';
import {urlAPI} from '../apiAddress';

const signUpStaff = async props => {
  try {

    const response = await axios.put(urlAPI + `users/signUpStaff`, {
      id: props.id,
      id_service: props.id_service,
    });

    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default signUpStaff;
