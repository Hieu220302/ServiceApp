import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/reducers/Login/signinReducer';
import Toast from 'react-native-toast-message';
import {toastSuccess, toastError, toastConfig} from '../components/toastCustom';
const Login = () => {
  const [userName, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const handleLogin = async () => {
    try {
      if (userName && password) {
        const response = await dispatch(loginUser(userName, password));
        const dataLogin = response[0];
        if (!!dataLogin?.id) {
          toastSuccess(
            'Đăng nhập thành công',
            `Xin chào mừng bạn ${dataLogin.Name}`,
          );
          navigation.navigate('Home');
        } else
          toastError(
            'Lỗi đăng nhập',
            'Bạn hãy kiểm tra lại đăng nhập và mật khẩu',
          );
      } else {
        toastError(
          'Lỗi đăng nhập',
          'Bạn hãy nhập đầy đủ tên đăng nhập và mật khẩu',
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icons name="left" style={styles.iconHeader} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đăng nhập</Text>
      </View>
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          onChangeText={text => setEmail(text)}
          autoFocus={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.forgotPassword}>Forgot your password?</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f26522',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-betwwen',
  },
  iconHeader: {
    fontSize: 20,
    color: '#fff',
    marginRight: 240,
  },
  headerText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: 10,
    color: 'blue',
  },
});

export default Login;
