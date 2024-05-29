import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
  const {dataLogin} = useSelector(state => state.login);
  const handleLogin = () => {
    dispatch(loginUser(userName, password));
  };
  useEffect(() => {
    if (!!dataLogin?.id) {
      toastSuccess(
        'Đăng nhập thành công',
        `Xin chào mừng bạn ${dataLogin.Name}`,
      );
      navigation.navigate('Home');
    } else
      toastError('Lỗi đăng nhập', 'Bạn hãy kiểm tra lại tài khoản và mật khẩu');
  }, [dataLogin]);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setEmail(text)}
        autoFocus={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      {/* <Text style={styles.forgotPassword}>Forgot your password?</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  forgotPassword: {
    marginTop: 10,
    color: 'blue',
  },
});

export default Login;
