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

  const compareDateStrings = (str1, str2, id_group_service) => {
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
    const listPaymentMethods = ['Tiền mặt', 'Thanh toán Momo'];
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
                Phương thức thanh toán:
                {listPaymentMethods[inforOrder?.paymentMethods]}
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
                inforOrder?.id_group_service,
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 15,
    color: '#000',
  },
  groupButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  group_button: {
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#00a800',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '800',
  },
  body: {flex: 1},
  dateText: {
    fontSize: 13,
    color: '#000',
  },
  dateNumber: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  inforOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderColor: '#f26522',
    padding: 10,
  },
  inforText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  inforOrderLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '70%',
  },
  inforOrderRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '30%',
  },
  iconExpand: {
    marginTop: 10,
    fontSize: 20,
    color: '#000',
  },
  dateBox: {
    alignItems: 'center',
    padding: 5,
    width: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedDate: {
    backgroundColor: '#ff9800',
  },
});

export default RegisterOrders;
