import axios from 'axios';
import {urlAPI} from '../apiAddress';

const changeOrderByStaff = async (id, State, id_staff) => {
  try {
    const response = await axios.put(
      urlAPI + 'orderService/changeOrderByStaff',
      {
        id: id,
        State: State,
        id_staff: id_staff,
      },
    );
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default changeOrderByStaff;
