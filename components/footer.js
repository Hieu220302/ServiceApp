import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
const Footer = ({isUser}) => {
  return (
    <>
      {isUser && (
        <View style={styles.footer}>
          <FooterItem name="home" title="Trang chủ" page="Home" />
          <FooterItem name="shoppingcart" title="Đơn công việc" page="Orders" />
          {/* <FooterItem name="mail" title="Tin nhắn" /> */}
        </View>
      )}
      {!isUser && (
        <View style={styles.footer}>
          <FooterItem name="calendar" title="Lịch làm" page="HomeStaff" />
          <FooterItem name="profile" title="Đơn công việc" page="Orders" />
          {/* <FooterItem name="mail" title="Tin nhắn" /> */}
        </View>
      )}
    </>
  );
};
const FooterItem = ({name, title, page}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.footerItem}
      onPress={() => navigation.navigate(page)}>
      <Icons name={name} style={{fontSize: 30}} />
      <Text style={styles.footerItemText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Footer;
