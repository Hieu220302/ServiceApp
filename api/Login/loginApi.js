import axios from 'axios';
import {urlAPI} from '../apiAddress';

const loginPage = async (userName, password) => {
  console.log('login API: username: ', userName, '\t pass: ', password);
  try {
    const response = await axios.post(urlAPI + 'users/signin', {
      userName: userName,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.log('error sign in' + error.message);
  }
};

export default loginPage;
