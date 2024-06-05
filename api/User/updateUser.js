import axios from 'axios';
import {urlAPI} from '../apiAddress';

const updateUser = async props => {
  try {
    const response = await axios.put(urlAPI + 'users/updateUser', {
      id: props.id,
      Name: props.Name,
      DOB: props.DOB,
      CIC: props.CIC,
      Address: props.Address,
      Phone_number: props.Phone_number,
      Email: props.Email,
      Updated_at: props.Updated_at,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default updateUser;
