import axios from 'axios';
import {urlAPI} from '../apiAddress';

const getOrderServiceByIdGroupService = async props => {
  try {
    const {id_group_service, id_user} = props;
    const response = await axios.post(urlAPI + `orderService/idGroupService`, {
      id_group_service: id_group_service,
      id_user: id_user,
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default getOrderServiceByIdGroupService;
