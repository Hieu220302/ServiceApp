import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';

const Orders = () => {
  const navigation = useNavigation();
  const listTab = [
    {id: 1, name: 'Chờ làm'},
    {id: 2, name: 'Lặp lại'},
    {id: 3, name: 'Theo gói'},
  ];
  const [tabSelect, setTabSelect] = useState(1);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Đơn công việc</Text>
      </View>
      <View style={styles.tabBar}>
        {listTab.map(tab => {
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, tab.id === tabSelect && styles.activeTab]}
              onPress={() => setTabSelect(tab.id)}>
              <Text
                style={[
                  styles.tabText,
                  tab.id === tabSelect && styles.tabSelect,
                ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Công việc bạn đăng lên sẽ được hiển thị ở đây để bạn dễ dàng thao tác
          và quản lý. Bạn có thể xem lại lịch sử những công việc đã được hoàn
          thành ở mục Lịch sử nằm ở góc trên bên phải
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <FooterItem name="home" title="Trang chủ" page="Home" />
        <FooterItem name="shoppingcart" title="Hoạt động" page="Orders" />
        {/* <FooterItem name="mail" title="Tin nhắn" /> */}
        <FooterItem name="user" title="Tài khoản" page="Login" />
      </View>
    </View>
  );
};

const FooterItem = ({name, title, page}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.footerItem}
      onPress={() => navigation.navigate(page)}>
      <Icons name={name} style={{fontSize: 20}} />
      <Text style={styles.footerItemText}>{title}</Text>
    </TouchableOpacity>
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    color: '#999',
    fontWeight: 'bold',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#ff8500',
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabSelect: {
    color: '#ff8500',
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
    fontSize:18,
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
