import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Switch,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {toastError, toastSuccess} from '../components/toastCustom';
import postOrderService from '../api/orderService/postOrderService';
import convertToVietnamTime from '../components/convertToVietnamTime';
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import updateUser from '../api/User/updateUser';
import {inforUser} from '../redux/reducers/Users/inforUser';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

const ChangeInfor = props => {
  const {dataLogin} = useSelector(state => state.login);
  const {dataInforUser} = useSelector(state => state.inforUser);
  const navigation = useNavigation();
  const defaultImage =
    'http://res.cloudinary.com/dmgiwjxch/image/upload/v1718724523/f29b36d6dc8d7be709db6ac04cbd57e2.jpg';
  const dispatch = useDispatch();
  const [name, setName] = useState(dataInforUser?.Name);
  const [location, setLocation] = useState(dataInforUser?.Address);
  const [CIC, setCIC] = useState(dataInforUser?.CIC);
  const [email, setEmail] = useState(dataInforUser?.Email);
  const [phoneNumber, setPhoneNumber] = useState(dataInforUser?.Phone_number);
  const [DOB, setDOB] = useState(dataInforUser?.DOB);
  const DOBRef = useRef(null);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageSelected, setImageSelected] = useState(
    dataInforUser?.Image || defaultImage,
  );
  useEffect(() => {
    dispatch(inforUser(dataLogin?.id));
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(DOB);
    setShow(Platform.OS === 'ios');
    setDOB(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleResetInfor = () => {
    setName(dataInforUser?.Name);
    setLocation(dataInforUser?.Address);
    setCIC(dataInforUser?.CIC);
    setEmail(dataInforUser?.Email);
    setPhoneNumber(dataInforUser?.Phone_number);
    setDOB(dataInforUser?.DOB);
    setImageSelected(dataInforUser?.Image);
  };

  const validate = () => {
    const newErrors = {};

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

  const handleUpdateInfor = async () => {
    if (validate()) {
      const Updated_at = formatDateStamp(new Date());
      const response = await updateUser({
        id: dataInforUser?.id,
        Name: name,
        Address: location,
        CIC,
        Email: email,
        Phone_number: phoneNumber,
        DOB: formatDateStamp(new Date(DOB)),
        Image: imageSelected,
        Updated_at,
      });
      if (response?.errno) {
        toastError('Lỗi cập nhật', 'Hệ thống có lỗi xin bạn hãy cập nhật lại');
        navigation.navigate('Home');
      } else {
        dispatch(inforUser(dataLogin?.id));
        toastSuccess('Xác nhận cập nhật', 'Bạn đã cập nhật thành công');
      }
    } else {
      toastError('Lỗi cập nhật', 'Bạn hãy kiểm tra lại thông tin');
    }
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

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        uploadImage({
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        });
      }
    });
  };

  const uploadImage = async photo => {
    const formData = new FormData();
    const CLOUDINARY_URL =
      'https://api.cloudinary.com/v1_1/dmgiwjxch/image/upload';

    formData.append('file', photo);
    formData.append('upload_preset', 'gggimw6m2');
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageSelected(data.secure_url);
      } else {
        console.error('Error uploading image to Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="left" style={styles.iconHeader} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chỉnh sửa thông tin</Text>
      </View>
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.viewImage}>
            <Image
              source={{
                uri: imageSelected,
              }}
              style={{width: 200, height: 200, borderRadius: 100}}
            />
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.textButton}>Thay ảnh </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bodyTitle}>Họ và tên:</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={value => setName(value)}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <Text style={styles.bodyTitle}>Căn cứ công dân:</Text>
          <TextInput
            style={styles.textInput}
            value={CIC}
            keyboardType="phone-pad"
            onChangeText={value => setCIC(value)}
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
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
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
          <TouchableOpacity style={styles.button} onPress={handleResetInfor}>
            <Text style={styles.textButton}>Đặt lại thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUpdateInfor}>
            <Text style={styles.textButton}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginRight: 20,
  },
  headerText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  body: {
    margin: 20,
  },
  bodyTitle: {
    marginVertical: 10,
    fontSize: 22,
    fontWeight: 'bold',
    width: 250,
    color: '#000',
  },
  viewImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    color: '#000',
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
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  textButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default ChangeInfor;
