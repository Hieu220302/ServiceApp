import axios from 'axios';
import {urlAPI} from '../apiAddress';

const changeFreeTime = async ({id, Free_time}) => {
  try {
    const response = await axios.put(urlAPI + 'staff/changeFreeTime', {
      id: id,
      Free_time: Free_time,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default changeFreeTime;
