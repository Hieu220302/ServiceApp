import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/reducers/Login/signinReducer';
import {toastSuccess, toastError, toastConfig} from '../components/toastCustom';
import DateTimePicker from '@react-native-community/datetimepicker';
import checkUsername from '../api/signUp/checkUsername';
import signUpUser from '../api/signUp/signUpUser';
const SignUp = () => {
  const {dataLogin} = useSelector(state => state.login);
  const {dataGroupService} = useSelector(state => state.groupService);
  const {dataInforUser} = useSelector(state => state.inforUser);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [CIC, setCIC] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [DOB, setDOB] = useState(new Date());
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const DOBRef = useRef(null);
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(DOB);
    setShow(Platform.OS === 'ios');
    setDOB(currentDate);
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
  };

  const formatDateStamp = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleFocus = event => {
    DOBRef.current.blur();
    showDatepicker();
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const validate = () => {
    const newErrors = {};

    if (!userName) newErrors.userName = 'Tên đăng nhập không được để trống';
    if (!password) newErrors.password = 'Mật khẩu không được để trống';
    if (!name) newErrors.name = 'Họ và tên không được để trống';
    if (!location) newErrors.location = 'Địa chỉ không được để trống';
    if (!CIC) {
      newErrors.CIC = 'Căn cước công dân không được để trống';
    } else if (!/^\d{10}$/.test(CIC)) {
      newErrors.CIC = 'Căn cước công dân phải là 10 số';
    }
    if (!email) newErrors.email = 'Email không được để trống';
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải là 10 số';
    }
    if (!DOB) newErrors.DOB = 'Ngày sinh không được để trống';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      const check = await checkUsername({Username: userName});
      if (check.length > 0)
        toastError('Lỗi đăng ký', 'Tên đăng nhập đã trùng hãy thay đổi');
      else {
        const response = await signUpUser({
          Name: name,
          DOB: formatDateStamp(new Date(DOB)),
          CIC: CIC,
          Address: location,
          Phone_number: phoneNumber,
          Email: email,
          Username: userName,
          Password: password,
        });
        if (response?.errno) {
          toastError('Lỗi đăng kí', 'Hệ thống có lỗi xin bạn hãy đăng kí lại');
          navigation.navigate('Login');
        } else {
          const res = await dispatch(loginUser(userName, password));
          const dataLogin = res[0];
          if (!!dataLogin?.id) {
            toastSuccess('Xác nhận đăng kí', 'Bạn đã đăng kí thành công');
            navigation.navigate('Home');
          }
        }
      }
    } else {
      toastError('Lỗi đăng ký', 'Bạn hãy kiểm tra lại thông tin đăng ký');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Icons name="left" style={styles.iconHeader} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Đăng Ký</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyTitle}>Họ và tên:</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={value => setName(value)}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <Text style={styles.bodyTitle}>Căn cước công dân:</Text>
          <TextInput
            style={styles.textInput}
            value={CIC}
            onChangeText={value => setCIC(value)}
            keyboardType="phone-pad"
          />
          {errors.CIC && <Text style={styles.error}>{errors.CIC}</Text>}

          <Text style={styles.bodyTitle}>Ngày sinh:</Text>
          <TextInput
            ref={DOBRef}
            style={styles.textInput}
            value={formatTimestamp(DOB)}
            onFocus={handleFocus}
          />
          {errors.DOB && <Text style={styles.error}>{errors.DOB}</Text>}

          <Text style={styles.bodyTitle}>Địa chỉ:</Text>
          <TextInput
            style={styles.textInput}
            value={location}
            onChangeText={value => setLocation(value)}
          />
          {errors.location && (
            <Text style={styles.error}>{errors.location}</Text>
          )}

          <Text style={styles.bodyTitle}>Số điện thoại:</Text>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={value => setPhoneNumber(value)}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && (
            <Text style={styles.error}>{errors.phoneNumber}</Text>
          )}

          <Text style={styles.bodyTitle}>Email:</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={value => setEmail(value)}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={styles.bodyTitle}>Tên tài khoản:</Text>
          <TextInput
            style={styles.textInput}
            value={userName}
            onChangeText={value => setUserName(value)}
          />
          {errors.userName && (
            <Text style={styles.error}>{errors.userName}</Text>
          )}

          <Text style={styles.bodyTitle}>Mật khẩu:</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={value => setPassword(value)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(DOB)}
              mode="date"
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            />
          )}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.textButton}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    marginRight: 20,
  },
  headerText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  body: {
    flex: 1,
    margin: 20,
  },
  bodyTitle: {
    marginVertical: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    width: 250,
  },
  textInput: {
    width: '100%',
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
  },
  viewRegister: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderColor: '#ccc',
    margin: 20,
  },
  button: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  textDate: {
    fontSize: 24,
    color: '#f26522',
    fontWeight: '700',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  textButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlayView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewRegister: {
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SignUp;
