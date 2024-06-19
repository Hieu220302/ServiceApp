import axios from 'axios';
import {urlAPI} from '../apiAddress';

const checkUsername = async props => {
  try {
    const response = await axios.post(urlAPI + `users/checkUsername`, {
      Username: props.Username,
    });

    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default checkUsername;
