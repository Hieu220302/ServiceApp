import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {groupService} from '../redux/reducers/groupService/groupServiceReducer';
import {inforService} from '../redux/reducers/inforService/inforServiceReducer';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
const HomeScreen = () => {
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataGroupService} = useSelector(state => state.groupService);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      dispatch(groupService());
      dispatch(inforService());
    } catch (error) {
      console.log(error);
    }
  }, []);
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const list = [
    {
      id: 1,
      title: 'First Item',
      image: require('./image/1.jpg'),
    },
    {
      id: 2,
      title: 'Second Item',
      image: require('./image/2.jpg'),
    },
    {
      id: 3,
      title: 'Third Item',
      image: require('./image/3.jpg'),
    },
  ];
  const [pagingEnabled, setPagingEnabled] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Xin chào bạn ngày mới tốt lành</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Đăng nhập / Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.bannerContainer}>
          <Carousel
            width={width}
            height={260}
            data={list}
            autoPlay={true}
            pagingEnabled={pagingEnabled}
            scrollAnimationDuration={3000}
            renderItem={({item}) => (
              <View>
                <Image style={styles.bannerImage} source={item.image} />
              </View>
            )}
          />
        </View>
        <View style={styles.servicesContainer}>
          {dataGroupService.map((groupService, index) => {
            return (
              <View key={index}>
                <Text style={styles.servicesTitle}>{groupService.Name}</Text>
                <View style={styles.servicesList}>
                  {dataInforService.map((inforService, index) => {
                    if (inforService.id_group === groupService.id)
                      return (
                        <ServiceItem
                          key={index}
                          title={inforService.Type}
                          id={inforService.id}
                        />
                      );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <FooterItem name="home" title="Trang chủ" page="Home" />
        <FooterItem name="tags" title="Hoạt động" page="Login" />
        {/* <FooterItem name="mail" title="Tin nhắn" /> */}
        <FooterItem name="user" title="Tài khoản" page="Login" />
      </View>
    </View>
  );
};

const ServiceItem = ({title, id}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('Order', {id: id})}>
      <Text style={styles.serviceTitle}>{title}</Text>
    </TouchableOpacity>
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#f26522',
    fontSize: 16,
  },
  bannerContainer: {
    marginTop: 10,
  },
  bannerImage: {
    width: '100%',
    height: 260,
    borderRadius: 10,
  },
  servicesContainer: {
    margin: 16,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 16,
  },
  newBadge: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
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

export default HomeScreen;
