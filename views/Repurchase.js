import React, {useEffect, useState} from 'react';
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
import cashRegister from '../components/cashRegister';
import {toastError, toastSuccess} from '../components/toastCustom';
import postOrderService from '../api/orderService/postOrderService';
import convertToVietnamTime from '../components/convertToVietnamTime';
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import {orderServiceByIdUser} from '../redux/reducers/orderService/orderServiceByIdUser';

const Repurchase = props => {
  //console.log(props);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataServicePackage} = useSelector(state => state.servicePackage);
  const {dataLogin} = useSelector(state => state.login);
  const {dataOrderServiceByIdUser} = useSelector(
    state => state.orderServiceByIdUser,
  );
  const [inforOrder, setInforOrder] = useState(() => {
    const idOrder = props.route.params.id;
    return dataOrderServiceByIdUser?.find(item => item.id === idOrder);
  });
  const [inforService, setInforService] = useState(() => {
    const idInforService = inforOrder.id_service;
    return dataInforService?.find(item => item.id === idInforService);
  });
  //console.log(inforOrder, 'HHH:', inforService);
  const [time, setTime] = useState(inforOrder?.Duration);
  const [quantity, setQuantity] = useState(inforOrder?.Quantity);
  const [location, setLocation] = useState(inforOrder?.Address || '');
  const [date, setDate] = useState(new Date());
  const [dateSelect, setDateSelect] = useState(new Date());
  const [timeSelect, setTimeSelect] = useState(new Date());
  const [days, setDays] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState(inforOrder?.Notes);
  const [isServicePacks, setIsServicePacks] = useState(
    inforOrder?.isServicePacks,
  );

  const handleQuantityIncrement = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = value => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 10) {
      setQuantity(numericValue);
    } else if (value === '') {
      setQuantity(1);
    }
  };

  const handleTimeIncrement = () => {
    if (time < 5) {
      setTime(time + 1);
    }
  };

  const handleTimeDecrement = () => {
    if (time > 1) {
      setTime(time - 1);
    }
  };

  const handleTimeChange = value => {
    const numericValue = parseInt(value, 5);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
      setTime(numericValue);
    } else if (value === '') {
      setTime(1);
    }
  };

  const handleLocationChange = value => {
    setLocation(value);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTimeSelect(selectedTime);
    }
  };

  const formatTime = time => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateSelect, timeSelect) => {
    const year = dateSelect.getFullYear();
    const month = String(dateSelect.getMonth() + 1).padStart(2, '0');
    const day = String(dateSelect.getDate()).padStart(2, '0');
    const hours = String(timeSelect.getHours()).padStart(2, '0');
    const minutes = String(timeSelect.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);

    return `${day}${month}${year}`;
  };

  const compareTime = dateTimeString => {
    const [datePart, timePart] = dateTimeString.split(' ');

    const [hours, minutes] = timePart.split(':').map(Number);

    const isAfterNoon = hours > 12 || (hours === 12 && minutes > 0);

    return isAfterNoon ? 'CT' : 'CS';
  };

  const handleCashRegister = async () => {
    if (!dataLogin?.id)
      toastError('Lỗi đặt đơn', 'Bạn cần đăng nhập trước khi đặt');
    else if (!location)
      toastError('Lỗi đặt đơn', 'Bạn hãy kiểm tra lại địa chỉ');
    else {
      let duration = 0;
      let dataQuantity = 0;
      if (inforService.hasTime) duration = time;
      if (inforService.hasQuantity) dataQuantity = quantity;
      const code = `${compareTime(
        convertToVietnamTime(timeSelect),
      )}_${formatTimestamp(dateSelect)}`;
      if (new Date() < new Date(formatDate(dateSelect, timeSelect))) {
        const response = await postOrderService(
          dataLogin?.id,
          location,
          formatDate(dateSelect, timeSelect),
          duration,
          dataQuantity,
          inforService.id,
          2,
          note,
          parseInt(total.replace(/,/g, ''), 10),
          code,
          isServicePacks,
          days,
          inforService.id_group,
        );
        dispatch(orderServiceByIdUser(dataLogin?.id));
        if (response?.errno) {
          toastError('Lỗi đặt đơn', 'Hệ thống có lỗi xin bạn hãy đặt đơn lại');
          navigation.navigate('Home');
        } else {
          toastSuccess('Xác nhận đặt đơn', 'Bạn đã đặt đơn thành công');
          navigation.navigate('Orders');
        }
      } else {
        toastError('Lỗi đặt đơn', 'Bạn hãy kiểm tra lại thời gian đặt đơn');
      }
    }
  };

  const ServicePackage = ({id}) => {
    const name = dataServicePackage?.find(pack => pack.id === id)?.Name;
    return (
      <View style={styles.bodyPack}>
        <Text style={styles.bodyTitle}>{name}</Text>
        <Switch
          trackColor={{false: '#767577', true: '#f26522'}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() =>
            setIsServicePacks(prevId => (prevId === id ? 0 : id))
          }
          value={isServicePacks === id}
        />
      </View>
    );
  };

  useEffect(() => {
    const {days, totalFunds} = cashRegister(
      inforService.Price,
      quantity,
      time,
      isServicePacks,
      dateSelect,
    );
    setTotal(totalFunds);
    setDays(days);
  }, [time, quantity, isServicePacks, dateSelect, dispatch]);
  const servicePacks = inforService?.isServicePacks.split(',')?.map(Number);
  useEffect(() => {
    dispatch(servicePackage());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
          <Icons name="left" style={styles.iconHeader} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đặt đơn công việc</Text>
      </View>
      <ScrollView style={styles.body}>
        <View>
          <Text style={styles.bodyTitle}>Công việc</Text>
          <Text style={styles.bodyLabel}>{inforService.Type}</Text>
        </View>
        {!!inforService.hasTime && (
          <View>
            <Text style={styles.bodyTitle}>Thời lượng</Text>
            <View style={styles.divTime}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleTimeDecrement}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={time.toString()}
                onChangeText={handleTimeChange}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleTimeIncrement}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!!inforService.hasQuantity && (
          <View>
            <Text style={styles.bodyTitle}>Số lượng</Text>
            <View style={styles.divTime}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleQuantityDecrement}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={handleQuantityChange}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleQuantityIncrement}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View>
          <Text style={styles.bodyTitle}>Địa chỉ làm việc</Text>
          <TextInput
            style={styles.inputLocation}
            value={location}
            onChangeText={handleLocationChange}
          />
        </View>
        <View>
          <Text style={styles.bodyTitle}>Thời gian làm việc</Text>
          <View style={{marginLeft: 10}}>
            <Text style={styles.bodyLabel}>Chọn ngày làm</Text>
            <View style={styles.dateContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateContainer}>
                {[...Array(30).keys()].map(i => {
                  const day = new Date();
                  day.setDate(date.getDate() + i);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.dateBox,
                        dateSelect.getDate() === day.getDate() &&
                          styles.selectedDate,
                      ]}
                      onPress={() => setDateSelect(day)}>
                      <Text style={styles.dateText}>
                        {day
                          .toLocaleDateString('vi-VN', {weekday: 'short'})
                          .toUpperCase()}
                      </Text>
                      <Text style={styles.dateNumber}>{`${day.getDate()}/${
                        day.getMonth() + 1
                      }`}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <View style={styles.section}>
              <Text style={styles.bodyLabel}>Chọn giờ làm</Text>
              <TouchableOpacity
                style={styles.timeBox}
                onPress={() => setShowTimePicker(true)}>
                <Text style={styles.timeText}>{formatTime(timeSelect)}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={timeSelect}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeTime}
                />
              )}
            </View>
          </View>
        </View>
        {servicePacks[0] !== 0 &&
          servicePacks?.map((id, index) => (
            <ServicePackage id={id} key={index} />
          ))}
        <View>
          <Text style={styles.bodyTitle}>Ghi chú cho công việc</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Bạn có yêu cầu gì thêm, hãy nhập ở đây nhé"
            multiline
            value={note}
            onChangeText={value => setNote(value)}
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.footer} onPress={handleCashRegister}>
        <Text style={styles.priceText}>{total} VND</Text>
        <Text style={styles.nextButtonText}>Đặt Đơn</Text>
      </TouchableOpacity>
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
    margin: 20,
  },
  bodyPack: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  bodyTitle: {
    marginVertical: 10,
    fontSize: 22,
    fontWeight: 'bold',
    width: 250,
  },
  bodyLabel: {
    marginVertical: 10,
    fontSize: 20,
    marginRight: 10,
  },
  divTime: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
  },
  button: {
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    padding: 0,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  inputLocation: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateBox: {
    alignItems: 'center',
    padding: 10,
    width: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedDate: {
    backgroundColor: '#ff9800',
  },
  dateText: {
    fontSize: 20,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 20,
    backgroundColor: '#4CAF50',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Repurchase;
