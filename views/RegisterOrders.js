import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../components/footer';
import {orderServiceByIdUser} from '../redux/reducers/orderService/orderServiceByIdUser';
import convertToVietnamTime from '../components/convertToVietnamTime';
import {inforStaff} from '../redux/reducers/staff/staffByCustomer';
import changeStateOrderService from '../api/orderService/changeStateOrderService';
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import Icons from 'react-native-vector-icons/AntDesign';

import {logout} from '../redux/reducers/Login/signinReducer';

import {inforUser} from '../redux/reducers/Users/inforUser';

import {toastError, toastSuccess} from '../components/toastCustom';
import {orderServiceByIdStaff} from '../redux/reducers/orderService/orderServiceByIdStaff';
import {inforCustomer} from '../redux/reducers/Users/inforCustomer';
import changeOrderByStaff from '../api/orderService/changeOrderByStaff';
import {inforStaffById} from '../redux/reducers/staff/staffById';
import changeFreeTime from '../api/staff/changeFreeTime';
import {orderServiceByIdGroup} from '../redux/reducers/orderService/orderServiceByIdGroup';
import changeRegistrationTime from '../api/staff/changeRegistrationTime';
const RegisterOrders = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {dataLogin} = useSelector(state => state.login);
  const {dataInforStaffId} = useSelector(state => state.inforStaffById);
  const {dataOrderServiceByIdGroup} = useSelector(
    state => state.orderServiceByIdGroup,
  );
  const [workTime, setWorkTime] = useState('');
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const fetchData = () => {
      try {
        if (dataLogin?.id) {
          dispatch(inforUser(dataLogin.id));
          dispatch(orderServiceByIdStaff(dataLogin.id));
          dispatch(inforStaffById(dataLogin.id));
          dispatch(servicePackage());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dataLogin, dispatch]);
  useEffect(() => {
    setWorkTime(
      !dataInforStaffId?.Registration_Time
        ? ''
        : dataInforStaffId?.Registration_Time,
    );
  }, [dataInforStaffId]);
  useEffect(() => {
    const sum = dataOrderServiceByIdGroup?.reduce((count, inforOrder) => {
      const positionDate = compareDateStrings(workTime, inforOrder?.code);
      if (positionDate) {
        return ++count;
      } else return count;
    }, 0);
    setIsShow(sum === 0 ? true : false);
  }, [dataOrderServiceByIdGroup]);

  useEffect(() => {
    dispatch(
      orderServiceByIdGroup({
        id_group_service: dataInforStaffId?.id_service,
        id_user: dataLogin?.id,
      }),
    );
  }, []);

  const convertStrToArr = string => {
    if (string === '') return [];
    const arr = string.split(',');
    const result = arr.map(item => item.split('_')[1]);
    return result;
  };

  const parseDate = dateStr => {
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = '20' + dateStr.substring(4, 6);
    return new Date(year, month - 1, day);
  };

  const RegisterOrder = async (code, id, id_staff) => {
    try {
      let result = '';
      setWorkTime(prev => {
        if (prev !== '') result = `${prev},${code}`;
        else result = code;
        return result;
      });
      let freeTime = dataInforStaffId?.Free_time || '';
      if (freeTime !== '') {
        let checkFreeTime = convertStrToArr(freeTime);
        let checkDay = convertStrToArr(code);
        let time = freeTime.split(',');
        let arrCode = code.split(',');
        let position = -1;
        let i = 0;
        for (let i = 0; i < checkDay.length; i++) {
          position = checkFreeTime.indexOf(checkDay[i]);
          if (position !== -1) {
            if (time[position] === arrCode[i]) {
              time.splice(position, 1);
              freeTime = time?.join(',');
              checkFreeTime = convertStrToArr(freeTime);
            } else {
              if (time[position][0] === 'D') {
                if (arrCode[i].substring(0, 2) === 'CT') {
                  newCode = 'CS' + arrCode[i].slice(2);
                } else {
                  newCode = 'CT' + arrCode[i].slice(2);
                }
                time[position] = newCode;
                freeTime = time?.join(',');
              }
            }
          }
        }
      }
      console.log(freeTime, result);
      let response = await changeRegistrationTime(id_staff, freeTime, result);
      response = await changeOrderByStaff(id, 3, id_staff);
      if (response?.errno) {
        toastError('Lỗi đăng ký', 'Hệ thống có lỗi xin bạn hãy đăng ký lại');
      } else {
        dispatch(orderServiceByIdStaff(dataLogin?.id));
        dispatch(
          orderServiceByIdGroup({
            id_group_service: dataInforStaffId?.id_service,
            id_user: dataLogin?.id,
          }),
        );
        dispatch(inforStaffById(dataLogin.id));
        toastSuccess('Xác nhận đăng ký', 'Bạn đã đăng ký thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ItemButton = ({code, id, id_staff}) => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => RegisterOrder(code, id, id_staff)}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    );
  };

  const compareDateStrings = (str1, str2) => {
    const array1 = str1.split(',');
    const array2 = str2.split(',');
    for (const item1 of array1) {
      if (array2.includes(item1)) {
        return false;
      }
    }
    return true;
  };

  const InforOrder = ({inforOrder}) => {
    const {dataInforService} = useSelector(state => state.inforService);
    const {dataServicePackage} = useSelector(state => state.servicePackage);
    const {dataInforCustomer} = useSelector(state => state.inforCustomer);
    const dispatch = useDispatch();
    const job = dataInforService.find(
      infor => infor.id === inforOrder.id_service,
    );

    const time = convertToVietnamTime(inforOrder.Time);
    useEffect(() => {
      dispatch(servicePackage());
      dispatch(inforCustomer());
    }, [dispatch]);
    const namePackage =
      dataServicePackage.find(pack => pack.id === inforOrder.isServicePacks)
        ?.Name || 'Không đăng ký gói dịch vụ';
    const codeWork = convertStrToArr(inforOrder?.code);
    const [isExpand, setIsExpand] = useState(false);
    const customer = dataInforCustomer.find(
      dataCustomer => dataCustomer.id === inforOrder?.id,
    );
    return (
      <View style={styles.inforOrder}>
        <View style={styles.inforOrderLeft}>
          <Text style={styles.inforText}>Công việc: {job?.Type}</Text>
          <Text style={styles.inforText}>Địa chỉ: {inforOrder?.Address}</Text>
          <Text style={styles.inforText}>Thời điểm: {time}</Text>
          <Text style={styles.inforText}>
            Người đặt công việc:{customer?.Name}
          </Text>
          {isExpand && (
            <>
              {!!inforOrder?.Duration && (
                <Text style={styles.inforText}>
                  Thời lượng: {inforOrder?.Duration} giờ
                </Text>
              )}
              {!!inforOrder?.Quantity && (
                <Text style={styles.inforText}>
                  Số Lượng: {inforOrder?.Quantity} máy
                </Text>
              )}

              <Text style={styles.inforText}>
                Số liên hệ:{customer?.Phone_number}
              </Text>
              <View>
                <Text style={styles.inforText}>
                  Số ngày làm còn lại: {inforOrder?.days} ngày
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dateContainer}>
                  {codeWork?.map((code, index) => {
                    const day = parseDate(code);
                    return (
                      <View
                        key={index}
                        style={[styles.dateBox, true && styles.selectedDate]}>
                        <Text style={styles.dateText}>
                          {day
                            .toLocaleDateString('vi-VN', {weekday: 'short'})
                            .toUpperCase()}
                        </Text>
                        <Text style={styles.dateNumber}>{`${day.getDate()}/${
                          day.getMonth() + 1
                        }`}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
              <Text style={styles.inforText}>
                Tổng tiền: {inforOrder?.Total.toLocaleString()} VND
              </Text>
              <Text style={styles.inforText}>
                Ghi chú: {inforOrder?.Notes || 'Chưa có ghi chú'}
              </Text>
              <Text style={styles.inforText}>Gói dịch vụ: {namePackage}</Text>
            </>
          )}
        </View>
        <View style={styles.inforOrderRight}>
          <ItemButton
            code={inforOrder?.code}
            id={inforOrder?.id}
            id_staff={dataInforStaffId.id}
          />
          <View style={styles.group_button}>
            <TouchableOpacity onPress={() => setIsExpand(!isExpand)}>
              {isExpand && <Icons name="up" style={styles.iconExpand} />}
              {!isExpand && <Icons name="down" style={styles.iconExpand} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Đăng ký việc</Text>
      </View>
      {isShow && (
        <View style={styles.content}>
          <Text style={styles.description}>
            Hiện chưa có đơn công việc bạn hãy quay lại sau
          </Text>
        </View>
      )}
      {dataOrderServiceByIdGroup?.length > 0 && !isShow && (
        <View style={styles.body}>
          <ScrollView>
            {dataOrderServiceByIdGroup?.map((inforOrder, index) => {
              const positionDate = compareDateStrings(
                workTime,
                inforOrder?.code,
              );
              if (positionDate) {
                return <InforOrder inforOrder={inforOrder} key={index} />;
              } else return <View key={index}></View>;
            })}
          </ScrollView>
        </View>
      )}
      <Footer isUser={false} />
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
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  body: {flex: 1},
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  inforOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderColor: '#f26522',
    padding: 10,
  },
  inforText: {
    fontSize: 18,
    fontWeight: '700',
    width: 500,
  },
  inforOrderLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: 500,
  },
  inforOrderRight: {
    width: 125,
    justifyContent: 'space-between',
  },
  group_button: {
    alignItems: 'flex-end',
  },
  iconExpand: {
    fontSize: 30,
  },
  button: {
    backgroundColor: '#00a800',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 125,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
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
});

export default RegisterOrders;
