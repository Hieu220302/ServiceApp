import React, {useEffect, useState, useRef} from 'react';
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
  Modal,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import cashRegister, {cashRegisterCustom} from '../components/cashRegister';
import {toastError, toastSuccess} from '../components/toastCustom';
import postOrderService from '../api/orderService/postOrderService';
import convertToVietnamTime from '../components/convertToVietnamTime';
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import {inforUser} from '../redux/reducers/Users/inforUser';
const OrderService = props => {
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataServicePackage} = useSelector(state => state.servicePackage);
  const {dataLogin} = useSelector(state => state.login);
  const {dataInforUser} = useSelector(state => state.inforUser);
  const dispatch = useDispatch();
  const [inforService, setInforService] = useState(() => {
    const idInforService = props.route.params.id;
    return dataInforService?.find(item => item.id === idInforService);
  });
  const [time, setTime] = useState(1);
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(dataInforUser?.Address || '');
  const [dateSelect, setDateSelect] = useState(new Date());
  const [timeSelect, setTimeSelect] = useState(new Date());
  const [days, setDays] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState('');
  const [isServicePacks, setIsServicePacks] = useState(0);
  const [codeWork, setCodeWork] = useState([]);
  const scrollViewRef = useRef(null);
  const [checkOrder, setCheckOrder] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

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

  const parseDate = dateStr => {
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = '20' + dateStr.substring(4, 6);
    return new Date(year, month - 1, day);
  };

  const handleCashRegister = async () => {
    if (!dataLogin?.id)
      toastError('Lỗi đặt đơn', 'Bạn cần đăng nhập trước khi đặt');
    else if (!location)
      toastError('Lỗi đặt đơn', 'Bạn hãy kiểm tra lại địa chỉ');
    else {
      if (new Date() < new Date(formatDate(dateSelect, timeSelect))) {
        setIsOpenModal(true);
      } else {
        toastError('Lỗi đặt đơn', 'Bạn hãy kiểm tra lại thời gian đặt đơn');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (checkOrder) {
        let duration = 0;
        let dataQuantity = 0;
        if (inforService.hasTime) duration = time;
        if (inforService.hasQuantity) dataQuantity = quantity;
        let code = '';
        if (isServicePacks === 0) {
          code = `${compareTime(
            convertToVietnamTime(timeSelect),
          )}_${formatTimestamp(dateSelect)}`;
        } else {
          code = codeWork
            .map(
              date =>
                `${compareTime(convertToVietnamTime(timeSelect))}_${date}`,
            )
            .join(',');
        }
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
        if (response?.errno) {
          toastError('Lỗi đặt đơn', 'Hệ thống có lỗi xin bạn hãy đặt đơn lại');
          navigation.navigate('Home');
        } else {
          toastSuccess('Xác nhận đặt đơn', 'Bạn đã đặt đơn thành công');
          navigation.navigate('Orders');
        }
      }
    };
    fetchData();
  }, [checkOrder]);

  const handleChooseDay = day => {
    const dateSelected = formatTimestamp(day);
    setCodeWork(prev => {
      const positionDate = prev.indexOf(dateSelected);
      let sortedDates = [];
      if (positionDate === -1) {
        let sortedDates = [...prev, dateSelected];
        sortedDates = sortedDates.sort((a, b) => {
          const dateA = parseDate(a);
          const dateB = parseDate(b);
          return dateA - dateB;
        });
        setDays(sortedDates?.length);
        setDateSelect(parseDate(sortedDates[0]));
        return sortedDates;
      } else {
        sortedDates = prev.filter(date => date !== dateSelected);
        setDays(sortedDates?.length);
        if (sortedDates.length !== 0) setDateSelect(parseDate(sortedDates[0]));
        else setDateSelect(new Date());
        return sortedDates;
      }
    });
  };
  const scrollX = useRef(null);
  const handleScroll = event => {
    const {x} = event.nativeEvent.contentOffset;
    scrollX.current = x;
  };

  const handleSelectPackage = id => {
    if (isServicePacks === id) setDays(1);
    else setCodeWork([]);
    setIsServicePacks(prevId => (prevId === id ? 0 : id));
  };

  const ServicePackage = ({id}) => {
    useEffect(() => {
      scrollViewRef?.current?.scrollTo({x: scrollX.current, animated: true});
    }, []);
    const name = dataServicePackage?.find(pack => pack.id === id)?.Name;
    return (
      <View>
        <View style={styles.bodyPack}>
          <Text style={styles.bodyTitle}>{name}</Text>
          <Switch
            trackColor={{false: '#767577', true: '#f26522'}}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => handleSelectPackage(id)}
            value={isServicePacks === id}
          />
        </View>
        {isServicePacks === 5 && id === 5 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateContainer}
            ref={scrollViewRef}
            onMomentumScrollEnd={handleScroll}>
            {[...Array(30).keys()].map(i => {
              const day = new Date();
              day.setDate(day.getDate() + i);
              const positionDate =
                codeWork.indexOf(formatTimestamp(day)) !== -1 ? true : false;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateBox, positionDate && styles.selectedDate]}
                  onPress={() => handleChooseDay(day)}>
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
        )}
      </View>
    );
  };

  useEffect(() => {
    if (isServicePacks !== 5) {
      const {days, totalFunds, code} = cashRegister(
        inforService.Price,
        quantity,
        time,
        isServicePacks,
        dateSelect,
      );
      setTotal(totalFunds);
      setDays(days);
      setCodeWork(code);
    } else {
      const totalFunds = cashRegisterCustom(
        inforService.Price,
        quantity,
        time,
        codeWork.length,
      );
      setTotal(totalFunds);
    }
  }, [time, quantity, isServicePacks, dateSelect]);

  const servicePacks =
    inforService?.isServicePacks?.split(',')?.map(Number) || [];

  useEffect(() => {
    dispatch(servicePackage());
    dispatch(inforUser(dataLogin?.id));
  }, [dispatch]);
  let dateBefore = new Date();
  dateBefore = new Date(dateBefore.setDate(dateSelect.getDate() - 1));

  return (
    <View style={styles.container}>
      {isOpenModal && (
        <Modal
          transparent={true}
          animationType="none"
          visible={isOpenModal}
          onRequestClose={() => setIsOpenModal(false)}>
          <View style={styles.overlayDate}>
            <View style={styles.modalViewDate}>
              <Text style={styles.textNote}>
                Lưu ý: Khi đặt đơn hoàn thành thì trường hợp khi có nhân viên đã
                nhận đơn khi muốn hủy đơn phải cách thời điểm làm việc của đơn
                24 giờ (thời điểm làm việc là:
                {` ${convertToVietnamTime(
                  formatDate(dateSelect, timeSelect),
                )} `}
                thì phải hủy trước
                {` ${convertToVietnamTime(formatDate(dateBefore, timeSelect))}`}
                ).
              </Text>
              <View style={styles.group_button}>
                <TouchableOpacity
                  style={styles.buttonConfirm}
                  onPress={() => {
                    setIsOpenModal(false);
                    setCheckOrder(true);
                  }}>
                  <Text style={styles.buttonConfirmText}>Đặt đơn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonConfirm}
                  onPress={() => setIsOpenModal(false)}>
                  <Text style={styles.buttonConfirmText}>Quay lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
            {isServicePacks !== 5 && (
              <View>
                <Text style={styles.bodyLabel}>Chọn ngày làm</Text>
                <View style={styles.dateContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateContainer}>
                    {[...Array(30).keys()].map(i => {
                      const day = new Date();
                      day.setDate(day.getDate() + i);
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
              </View>
            )}

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
  buttonConfirm: {
    backgroundColor: '#00a800',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 125,
    marginRight: 20,
  },
  buttonConfirmText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '800',
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
  overlayDate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewDate: {
    width: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  group_button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textNote: {
    fontSize: 24,
    color: '#f26522',
    marginBottom: 30,
    fontWeight: 'bold',
  },
});

export default OrderService;
