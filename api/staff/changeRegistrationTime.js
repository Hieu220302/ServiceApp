import axios from 'axios';
import {urlAPI} from '../apiAddress';

const changeRegistrationTime = async ({id, Free_time, Registration_Time}) => {
  try {
    const response = await axios.put(urlAPI + 'staff/changeRegistrationTime', {
      id: id,
      Free_time: Free_time,
      Registration_Time: Registration_Time,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default changeRegistrationTime;
