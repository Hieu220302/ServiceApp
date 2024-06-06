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
  }, [changeState,dispatch]);

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
  }, [dataOrderServiceByIdUser,dispatch]);
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
                Bạn hãy bắt đầu một đơn mới để có thể hiện thị ở đây
              </Text>
            </View>
          )}
        </>
      )}

      <Footer isUser={true} />
    </View>
  );
};

const changeStateOrder = async (
  id,
  State,
  changeState,
  setChangeState,
  days,
) => {
  try {
    if (State === 4) {
      days = days - 1;
      if (days !== 0) State = 3;
    }
    const response = await changeStateOrderService(id, State, days);
    setChangeState(!changeState);
  } catch (error) {
    console.log(error);
  }
};

const ItemButton = ({id, state, changeState, setChangeState, days}) => {
  const navigation = useNavigation();
  if (state === 2) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          changeStateOrder(id, 1, changeState, setChangeState, days)
        }>
        <Text style={styles.buttonText}>Hủy đơn</Text>
      </TouchableOpacity>
    );
  } else if (state === 3) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          changeStateOrder(id, 4, changeState, setChangeState, days)
        }>
        <Text style={styles.buttonText}>
          Xác nhận hoàn thành công việc hôm nay
        </Text>
      </TouchableOpacity>
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
            changeStateOrder(id, 0, changeState, setChangeState, days)
          }>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    );
  }
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
        />
        <TouchableOpacity onPress={() => setIsExpand(!isExpand)}>
          {isExpand && <Icons name="up" style={styles.iconExpand} />}
          {!isExpand && <Icons name="down" style={styles.iconExpand} />}
        </TouchableOpacity>
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
});

export default Orders;
