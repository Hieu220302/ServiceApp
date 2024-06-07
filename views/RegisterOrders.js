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
      const checkDay = workTime.split(',');
      const positionDate = checkDay.indexOf(inforOrder?.code);
      console.log(positionDate);
      if (positionDate === -1) {
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

  const RegisterOrder = async (code, id, id_staff) => {
    try {
      let result = '';
      setWorkTime(prev => {
        if (prev !== '') result = `${prev},${code}`;
        else result = code;
        return result;
      });
      let freeTime = dataInforStaffId?.Free_time || '';
      let checkFreeTime = convertStrToArr(freeTime);
      let checkDay = convertStrToArr(code);
      let positionDate = checkFreeTime.indexOf(checkDay[0]);
      let time = freeTime.split(',');
      if (positionDate !== -1) {
        if (time[positionDate] === code) {
          time.splice(positionDate, 1);
          freeTime = time.join(',');
        } else {
          if (time[positionDate][0] === 'D') {
            if (code.substring(0, 2) === 'CT') {
              code = 'CS' + code.slice(2);
            } else {
              code = 'CT' + code.slice(2);
            }
            time[positionDate] = code;
            freeTime = time.join(',');
          }
        }
      }
      let response = await changeRegistrationTime(id_staff, freeTime, result);
      response = await changeOrderByStaff(id, 3, id_staff);
      if (response?.errno) {
        toastError('Lỗi đăng ký', 'Hệ thống có lỗi xin bạn hãy đăng ký lại');
      } else {
        toastSuccess('Xác nhận đăng ký', 'Bạn đã đăng ký thành công');
        dispatch(orderServiceByIdStaff(dataLogin?.id));
        dispatch(
          orderServiceByIdGroup({
            id_group_service: dataInforStaffId?.id_service,
            id_user: dataLogin?.id,
          }),
        );
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
                Người đặt công việc:{customer?.Name}
              </Text>
              <Text style={styles.inforText}>
                Số liên hệ:{customer?.Phone_number}
              </Text>

              <Text style={styles.inforText}>
                Số ngày làm còn lại: {inforOrder?.days} ngày
              </Text>
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
          <TouchableOpacity onPress={() => setIsExpand(!isExpand)}>
            {isExpand && <Icons name="up" style={styles.iconExpand} />}
            {!isExpand && <Icons name="down" style={styles.iconExpand} />}
          </TouchableOpacity>
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
              const checkDay = workTime.split(',');
              const positionDate = checkDay.indexOf(inforOrder?.code);
              if (positionDate === -1) {
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
    justifyContent: 'center',
  },
  inforOrderRight: {
    justifyContent: 'space-between',
  },
  iconExpand: {
    position: 'absolute',
    fontSize: 30,
    bottom: 0,
    right: 0,
  },
  button: {
    backgroundColor: '#00a800',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 125,
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
});

export default RegisterOrders;
