import axios from 'axios';
import {urlAPI} from '../apiAddress';

const postOrderService = async (
  id_user,
  Address,
  Time,
  Duration,
  Quantity,
  id_service,
  State,
  Notes,
  Total,
  code,
  isServicePacks,
  days,
  id_group,
  paymentMethods,
) => {
  try {
    const response = await axios.post(urlAPI + 'orderService/postOrder', {
      id_user: id_user,
      Address: Address,
      Time: Time,
      Duration: Duration,
      Quantity: Quantity,
      id_service: id_service,
      State: State,
      Notes: Notes,
      Total: Total,
      code: code,
      isServicePacks: isServicePacks,
      days: days,
      id_group_service: id_group,
      paymentMethods: paymentMethods,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default postOrderService;
