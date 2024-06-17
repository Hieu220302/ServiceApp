import axios from 'axios';
import {urlAPI} from '../apiAddress';

const changeCompletedOrder = async (
  id,
  dateChange,
  codeWork,
  completedDate,
) => {
  try {
    const response = await axios.put(
      urlAPI + 'orderService/changeCompletedOrder',
      {
        id: id,
        dateChange: dateChange,
        codeWork: codeWork,
        completedDate: completedDate,
      },
    );
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default changeCompletedOrder;
