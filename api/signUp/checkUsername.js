import axios from 'axios';
import {urlAPI} from '../apiAddress';

const checkUsername = async props => {
  try {
    // console.log(id);
    const response = await axios.post(urlAPI + `users/checkUsername`, {
      Username: props.Username,
    });
    //console.log(response);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default checkUsername;
