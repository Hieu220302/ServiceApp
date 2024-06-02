import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../components/footer';
import {orderServiceByIdUser} from '../redux/reducers/orderService/orderServiceByIdUser';
import convertToVietnamTime from '../components/convertToVietnamTime';
import Icons from 'react-native-vector-icons/AntDesign';
import {inforStaff} from '../redux/reducers/staff/staffByCustomer';
import changeStateOrderService from '../api/orderService/changeStateOrderService';

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
    }
  }, [changeState]);

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
        <View style={styles.body}>
          {dataOrderServiceByIdUser?.map((inforOrder, index) => (
            <InforOrder
              inforOrder={inforOrder}
              key={index}
              changeState={changeState}
              setChangeState={setChangeState}
            />
          ))}
          {dataOrderServiceByIdUser.length === 0 && (
            <View style={styles.content}>
              <Text style={styles.description}>
                Bạn hãy bắt đầu một đơn mới để có thể hiện thị ở đây
              </Text>
            </View>
          )}
        </View>
      )}

      <Footer />
    </View>
  );
};

const changeStateOrder = async (id, State, changeState, setChangeState) => {
  try {
    const response = await changeStateOrderService(id, State);
    setChangeState(!changeState);
  } catch (error) {
    console.log(error);
  }
};

const ItemButton = ({id, state, changeState, setChangeState}) => {
  if (state === 1) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeStateOrder(id, 0, changeState, setChangeState)}>
        <Text style={styles.buttonText}>Hủy đơn</Text>
      </TouchableOpacity>
    );
  } else if (state === 2) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => changeStateOrder(id, 3, changeState, setChangeState)}>
        <Text style={styles.buttonText}>Xác nhận hoàn thành</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đặt lại</Text>
      </TouchableOpacity>
    );
  }
};

const InforOrder = ({inforOrder, changeState, setChangeState}) => {
  const {dataInforService} = useSelector(state => state.inforService);
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
  const [isExpand, setIsExpand] = useState(false);
  const staff = dataInforStaff?.find(staff => staff.id === inforOrder.id_staff);
  return (
    <View style={styles.inforOrder}>
      <View>
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
              Tổng tiền: {inforOrder?.Total.toLocaleString()} VND
            </Text>
          </>
        )}
        <Text style={styles.inforText}>
          Trạng thái: {listState[inforOrder?.State]}
        </Text>
      </View>
      <View style={styles.inforOrderRight}>
        <ItemButton
          id={inforOrder?.id}
          state={inforOrder?.State}
          changeState={changeState}
          setChangeState={setChangeState}
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
