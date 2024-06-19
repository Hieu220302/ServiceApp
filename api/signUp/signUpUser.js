import axios from 'axios';
import {urlAPI} from '../apiAddress';

const signUpUser = async props => {
  try {
    const response = await axios.post(urlAPI + `users/signUpUser`, {
      Name: props.Name,
      DOB: props.DOB,
      CIC: props.CIC,
      Address: props.Address,
      Phone_number: props.Phone_number,
      Email: props.Email,
      Username: props.Username,
      Password: props.Password,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default signUpUser;
