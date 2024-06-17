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
import Icons from 'react-native-vector-icons/AntDesign';
import {inforStaff} from '../redux/reducers/staff/staffByCustomer';
import changeStateOrderService from '../api/orderService/changeStateOrderService';
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import changeCompletedOrder from '../api/orderService/changeCompletedOrder';
import changeRegistrationTime from '../api/staff/changeRegistrationTime';
import changeOrderByStaff from '../api/orderService/changeOrderByStaff';

const Orders = () => {
  const navigation = useNavigation();
  const {dataLogin} = useSelector(state => state.login);
  const dispatch = useDispatch();
  const {dataOrderServiceByIdUser} = useSelector(
    state => state.orderServiceByIdUser,
  );
  const [changeState, setChangeState] = useState(false);
  useEffect(() => {
    if (dataLogin?.id) {
      dispatch(orderServiceByIdUser(dataLogin?.id));
      dispatch(inforStaff());
      if (changeState === true) setChangeState(false);
    }
  }, [changeState, dispatch]);

  useEffect(() => {
    if (dataLogin?.id) {
      setCount(
        dataOrderServiceByIdUser?.reduce((count, order) => {
          if (order.State > 0) {
            return count + 1;
          } else {
            return count;
          }
        }, 0),
      );
    }
  }, [dataOrderServiceByIdUser, dispatch]);
  const [count, setCount] = useState(() =>
    dataOrderServiceByIdUser?.reduce((count, order) => {
      if (order.State > 0) {
        return count + 1;
      } else {
        return count;
      }
    }, 0),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Đơn công việc</Text>
      </View>

      {!dataLogin?.id && (
        <View style={styles.content}>
          <Text style={styles.description}>
            Công việc bạn đăng lên sẽ được hiển thị ở đây để bạn dễ dàng thao
            tác và quản lý.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      )}
      {dataLogin?.id && (
        <>
          {count !== 0 && (
            <View style={styles.body}>
              <ScrollView>
                {dataOrderServiceByIdUser?.map((inforOrder, index) => {
                  if (!!inforOrder?.State)
                    return (
                      <InforOrder
                        inforOrder={inforOrder}
                        key={index}
                        changeState={changeState}
                        setChangeState={setChangeState}
                      />
                    );
                  else return <View key={index}></View>;
                })}
              </ScrollView>
            </View>
          )}

          {count === 0 && (
            <View style={styles.content}>
              <Text style={styles.description}>
                Bạn hãy bắt đầu một đơn mới để có thể hiển thị ở đây
              </Text>
            </View>
          )}
        </>
      )}

      <Footer isUser={true} />
    </View>
  );
};

const formatDate = (dateSelect, timeSelect) => {
  const year = dateSelect.getFullYear();
  const month = String(dateSelect.getMonth() + 1).padStart(2, '0');
  const day = String(dateSelect.getDate()).padStart(2, '0');
  const hours = String(timeSelect.getHours()).padStart(2, '0');
  const minutes = String(timeSelect.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const changeStateOrder = async (
  id,
  State,
  changeState,
  setChangeState,
  days,
  codeWork,
  time,
  completedDate,
  timeWork,
  freeTime,
  id_staff,
) => {
  try {
    let code = convertStrToArr(codeWork);
    let dateChange = formatDate(parseDate(code[0]), new Date(time));
    if (code.length > 1)
      dateChange = formatDate(parseDate(code[1]), new Date(time));
    if (State === 4) {
      days = days - 1;
      code = codeWork.split(',');
      if (completedDate?.length > 0)
        completedDate = `${completedDate},${code[0]}`;
      else completedDate = `${code[0]}`;
      if (days !== 0) {
        State = 3;
        code.splice(0, 1);
        codeWork = code.join(',');
      } else {
        codeWork = '';
      }
    }
    let response;
    if (State === 1) {
      let checkTimeWork = timeWork?.split(',') || [];
      let checkDay = codeWork?.split(',') || [];
      for (let i = 0; i < checkDay.length; i++) {
        position = checkTimeWork.indexOf(checkDay[i]);
        if (position !== -1) checkTimeWork.splice(position, 1);
      }
      timeWork = checkTimeWork.join(',');

      response = await changeRegistrationTime(id_staff, freeTime, timeWork);
      response = await changeOrderByStaff(id, 2, null);
    }
    response = await changeStateOrderService(id, State, days);
    if (State >= 3)
      response = await changeCompletedOrder(
        id,
        dateChange,
        codeWork,
        completedDate,
      );
    setChangeState(!changeState);
  } catch (error) {
    console.log(error);
  }
};

const checkTime = (time, x) => {
  const timeObj = new Date(time);
  timeObj.setHours(timeObj.getHours() + x);
  const currentTime = new Date();
  if (x > 0) return timeObj <= currentTime;
  else return timeObj >= currentTime;
};

const ItemButton = ({
  id,
  state,
  changeState,
  setChangeState,
  days,
  codeWork,
  time,
  completedDate,
  Duration,
  timeWork,
  freeTime,
  id_staff,
}) => {
  const navigation = useNavigation();

  if (
    state === 2 ||
    (state === 3 && checkTime(time, -24) && !completedDate?.length)
  ) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          changeStateOrder(
            id,
            1,
            changeState,
            setChangeState,
            days,
            codeWork,
            time,
            completedDate,
            timeWork,
            freeTime,
            id_staff,
          )
        }>
        <Text style={styles.buttonText}>Hủy đơn</Text>
      </TouchableOpacity>
    );
  } else if (state === 3) {
    return (
      <View>
        {checkTime(time, Duration) && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              changeStateOrder(
                id,
                4,
                changeState,
                setChangeState,
                days,
                codeWork,
                time,
                completedDate,
              )
            }>
            <Text style={styles.buttonText}>Xác nhận hoàn thành</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.groupButton}>
        <TouchableOpacity
          style={[styles.button, {marginBottom: 10}]}
          onPress={() => navigation.navigate('Repurchase', {id: id})}>
          <Text style={styles.buttonText}>Đặt lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            changeStateOrder(
              id,
              0,
              changeState,
              setChangeState,
              days,
              codeWork,
              time,
            )
          }>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

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

const InforOrder = ({inforOrder, changeState, setChangeState}) => {
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataServicePackage} = useSelector(state => state.servicePackage);
  const dispatch = useDispatch();
  const job = dataInforService.find(
    infor => infor.id === inforOrder.id_service,
  );
  const {dataInforStaff} = useSelector(state => state.inforStaff);
  const time = convertToVietnamTime(inforOrder.Time);
  const listState = [
    'Đơn đã hủy',
    'Chờ xác nhận',
    'Chờ xác nhận hoàn thành',
    'Đã hoàn thành',
  ];
  useEffect(() => {
    dispatch(servicePackage());
  }, [dispatch]);
  const namePackage =
    dataServicePackage.find(pack => pack.id === inforOrder.isServicePacks)
      ?.Name || 'Không đăng ký gói dịch vụ';
  const [isExpand, setIsExpand] = useState(false);
  const codeWork = convertStrToArr(inforOrder?.code);
  const staff = dataInforStaff?.find(staff => staff.id === inforOrder.id_staff);

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
            {!!staff && (
              <>
                <Text style={styles.inforText}>
                  Người nhận công việc: {staff?.Name}
                </Text>
                <Text style={styles.inforText}>
                  Số liên hệ: {staff?.Phone_number}
                </Text>
              </>
            )}
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
        <Text style={styles.inforText}>
          Trạng thái: {listState[inforOrder?.State - 1]}
        </Text>
      </View>
      <View style={styles.inforOrderRight}>
        <ItemButton
          id={inforOrder?.id}
          state={inforOrder?.State}
          changeState={changeState}
          setChangeState={setChangeState}
          days={inforOrder?.days}
          codeWork={inforOrder?.code}
          time={inforOrder?.Time}
          completedDate={inforOrder?.completedDate}
          Duration={inforOrder?.Duration}
          timeWork={staff?.Registration_Time}
          freeTime={staff?.Free_time}
          id_staff={staff?.id}
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
    fontSize: 18,
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
    width: 125,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
  body: {flex: 1},
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
  dateContainer: {
    flexDirection: 'row',
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
  iconExpand: {
    fontSize: 30,
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

export default Orders;
