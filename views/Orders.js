import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../components/footer';
import {orderServiceByIdUser} from '../redux/reducers/orderService/orderServiceByIdUser';

const Orders = () => {
  const navigation = useNavigation();
  const {dataLogin} = useSelector(state => state.login);
  const dispatch = useDispatch();
  const {dataOrderServiceByIdUser} = useSelector(
    state => state.orderServiceByIdUser,
  );
  useEffect(() => {
    if (dataLogin?.id) dispatch(orderServiceByIdUser(dataLogin?.id));
    console.log(dataOrderServiceByIdUser);
  }, []);
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
            <InforOrder inforOrder={inforOrder} index={index} />
          ))}
        </View>
      )}

      <Footer />
    </View>
  );
};

const InforOrder = ({inforOrder, index}) => {
  return (
    <View key={index} style={styles.inforOrder}>
      <View>
        <Text>Công việc:</Text>
        <Text>Địa chỉ: {inforOrder?.Address}</Text>
        <Text>Thời điểm: </Text>
        <Text>Trạng thái:</Text>
      </View>
      <View>
        <TouchableOpacity>
          <Text>Chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Hủy đơn</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Xác nhận hoàn thành</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Đặt lại</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  body: {flex: 1},
  inforOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#f26522',
    padding: 10,
  },
});

export default Orders;
