import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Footer from '../components/footer';

const Orders = () => {
  const navigation = useNavigation();
  const {dataLogin} = useSelector(state => state.login);

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
        <View style={styles.content}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      )}

      <Footer />
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerItemText: {
    fontSize: 14,
  },
});

export default Orders;
