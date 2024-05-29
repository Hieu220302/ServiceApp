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
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import cashRegister from '../components/cashRegister';
const OrderService = props => {
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataLogin} = useSelector(state => state.login);
  const dispatch = useDispatch();
  const [inforService, setInforService] = useState(() => {
    const idInforService = props.route.params.id;
    return dataInforService.find(item => item.id === idInforService);
  });
  const [time, setTime] = useState(1);
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(dataLogin.Address);
  const [date, setDate] = useState(new Date());
  const [dataSelect, setDataSelect] = useState(new Date());
  const [timeSelect, setTimeSelect] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [total, setTotal] = useState(0);
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

  const handleCashRegister = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    setTotal(cashRegister(inforService.Price, quantity, time));
  }, [time, quantity]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icons name="left" style={styles.iconHeader} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đặt đơn công việc</Text>
      </View>
      <ScrollView style={styles.body}>
        <View>
          <Text style={styles.bodyTitle}>Dịch vụ</Text>
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
                        dataSelect.getDate() === day.getDate() &&
                          styles.selectedDate,
                      ]}
                      onPress={() => setDataSelect(day)}>
                      <Text style={styles.dateText}>
                        {day
                          .toLocaleDateString('vi-VN', {weekday: 'short'})
                          .toUpperCase()}
                      </Text>
                      <Text style={styles.dateNumber}>{day.getDate()}</Text>
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
                  display="default"
                  onChange={onChangeTime}
                />
              )}
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.bodyTitle}>Ghi chú cho công việc</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Bạn có yêu cầu gì thêm, hãy nhập ở đây nhé"
            multiline
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
  bodyTitle: {
    marginVertical: 10,
    fontSize: 22,
    fontWeight: 'bold',
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
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  inputLocation: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 15,
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
    width: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedDate: {
    backgroundColor: '#ff9800',
  },
  dateText: {
    fontSize: 12,
  },
  dateNumber: {
    fontSize: 16,
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
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    height: 100,
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

export default OrderService;
