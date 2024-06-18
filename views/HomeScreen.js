import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Icons from 'react-native-vector-icons/EvilIcons';
import {useDispatch, useSelector} from 'react-redux';
import {groupService} from '../redux/reducers/groupService/groupServiceReducer';
import {inforService} from '../redux/reducers/inforService/inforServiceReducer';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import {logout} from '../redux/reducers/Login/signinReducer';
import Footer from '../components/footer';
import {orderServiceByIdUser} from '../redux/reducers/orderService/orderServiceByIdUser';
import {inforUser} from '../redux/reducers/Users/inforUser';
import signUpStaff from '../api/User/signUpStaff';
import {toastError, toastSuccess} from '../components/toastCustom';
import {orderServiceByIdStaff} from '../redux/reducers/orderService/orderServiceByIdStaff';
const HomeScreen = () => {
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataGroupService} = useSelector(state => state.groupService);
  const {dataLogin} = useSelector(state => state.login);
  const {dataInforUser} = useSelector(state => state.inforUser);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      dispatch(groupService());
      dispatch(inforService());
      dispatch(inforUser(dataLogin?.id));
    } catch (error) {
      console.log(error);
    }
  }, [dataLogin, dispatch]);
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

  const handleLogOut = () => {
    closeModal();
    dispatch(logout());
  };
  const [pagingEnabled, setPagingEnabled] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const textInputRef = useRef(null);
  const [dataSearch, setDataSearch] = useState(dataInforService);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const closeModalRegister = () => {
    setIsShow(false);
  };
  const openModalRegister = () => {
    setIsShow(true);
  };
  const handleSignUpStaff = async () => {
    try {
      openModalRegister();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const closeModalSearch = () => {
    setIsSearch(false);
  };
  const SignUpStaff = async id_service => {
    try {
      const response = await signUpStaff({id: dataLogin?.id, id_service});
      if (response?.errno) {
        toastError('Lỗi đăng kí', 'Hệ thống có lỗi xin bạn hãy đăng kí lại');
      } else {
        toastSuccess('Xác nhận đăng kí', 'Bạn đã đăng kí thành công');
      }
      dispatch(inforUser(dataLogin?.id));
      closeModalRegister();
    } catch (error) {
      console.log(error);
    }
  };
  const EmptyListComponent = () => {
    return <Text style={styles.textStyle}>Không có dịch vụ bạn muốn tìm</Text>;
  };
  const searchService = value => {
    setTextSearch(value);
    const filtered = dataInforService?.filter(item =>
      item?.Type?.toLowerCase()?.includes(value.toLowerCase()),
    );
    setDataSearch(filtered);
    setIsSearch(true);
    if (value === '') setIsSearch(false);
  };
  const defaultImage =
    'http://res.cloudinary.com/dmgiwjxch/image/upload/v1718724523/f29b36d6dc8d7be709db6ac04cbd57e2.jpg';
  const [imageSelected, setImageSelected] = useState(
    dataInforUser?.Image || defaultImage,
  );
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={closeModalSearch}>
        <View style={styles.pageHome}>
          {isSearch && (
            <View style={styles.modalViewSearch}>
              <FlatList
                data={dataSearch}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() =>
                      navigation.navigate('Order', {id: item?.id})
                    }>
                    <Text style={styles.textStyle}>{item.Type}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<EmptyListComponent />}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Xin chào bạn ngày mới tốt lành</Text>

          <TouchableOpacity style={styles.headerRight} onPress={openModal}>
            <Image
              source={{
                uri: imageSelected,
              }}
              style={{width: 40, height: 40, borderRadius: 100}}
            />

            {dataLogin?.id && (
              <Text style={styles.headerText}>{dataInforUser?.Name}</Text>
            )}
          </TouchableOpacity>
        </View>
        {isShow && (
          <Modal
            transparent={true}
            animationType="none"
            visible={isShow}
            onRequestClose={closeModalRegister}>
            <TouchableWithoutFeedback onPress={closeModalRegister}>
              <View style={styles.overlayView}>
                <View style={styles.modalViewRegister}>
                  <Text style={styles.textDate}>Chọn công việc</Text>
                  {dataGroupService?.map(groupService => {
                    return (
                      <TouchableOpacity
                        key={groupService?.id}
                        style={styles.closeButton}
                        onPress={() => SignUpStaff(groupService?.id)}>
                        <Text style={styles.textStyle}>
                          {groupService?.Name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        {modalVisible && (
          <Modal
            transparent={true}
            animationType="none"
            visible={modalVisible}
            onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.overlay}>
                <View
                  style={[styles.modalView, {top: dataLogin?.id ? 70 : 40}]}>
                  {dataLogin?.id && (
                    <>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          closeModal();
                          navigation.navigate('ChangeInfor');
                        }}>
                        <Text style={styles.textStyle}>
                          Chỉnh sửa thông tin
                        </Text>
                      </TouchableOpacity>
                      {dataInforUser?.Id_role === 1 && (
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => {
                            closeModal();
                            navigation.navigate('HomeStaff');
                          }}>
                          <Text style={styles.textStyle}>
                            Chuyển qua giao diện nhân viên
                          </Text>
                        </TouchableOpacity>
                      )}
                      {dataInforUser?.Id_role === 2 &&
                        dataInforUser?.isSignUpStaff === 0 && (
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleSignUpStaff}>
                            <Text style={styles.textStyle}>
                              Đăng kí làm nhân viên
                            </Text>
                          </TouchableOpacity>
                        )}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleLogOut}>
                        <Text style={styles.textStyle}>Đăng xuất</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {!dataLogin?.id && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => navigation.navigate('Login')}>
                      <Text style={styles.textStyle}>Đăng nhập</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        <View style={styles.groupSearch}>
          <View style={styles.viewSearch}>
            <Text style={styles.headerText}>Tìm kiếm:</Text>
            <TextInput
              style={styles.textInput}
              value={textSearch}
              placeholder="Dịch vụ bạn muốn tìm kiếm"
              onChangeText={searchService}
              ref={textInputRef}
            />
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.bannerContainer}>
          <Carousel
            width={width}
            height={200}
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
          {dataGroupService?.map((groupService, index) => {
            return (
              <View key={index}>
                <Text style={styles.servicesTitle}>{groupService.Name}</Text>
                <View style={styles.servicesList}>
                  {dataInforService?.map((inforService, index) => {
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

        <View style={styles.licenseApp}>
          <Text style={styles.typeLicense}>Giới thiệu về app All In Home:</Text>
          <Text style={styles.textLicense}>Người thực hiện: Nguyễn Hiếu </Text>
          <Text style={styles.textLicense}>
            Người hướng dẫn: THS. Nguyễn Thị Minh Hỷ
          </Text>
          <Text style={styles.textLicense}>
            Đơn vị: Trường Đại Học Bách Khoa Đà Nẵng
          </Text>
        </View>
      </ScrollView>
      <Footer isUser={true} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageHome: {
    zIndex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f26522',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 20,
  },
  itemContainer: {
    marginBottom: 10,
  },
  headerContainer: {
    alignItems: 'center',
  },
  groupSearch: {
    backgroundColor: '#f26522',
    width: '100%',
  },
  viewSearch: {
    backgroundColor: '#f26522',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  typeLicense: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  textLicense: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 20,
    color: '#000',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
  },
  menuItem: {
    flex: 1,
    width: 50,
    backgroundColor: '#fff',
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
    padding: 16,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 15,
    width: '48%',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  newBadge: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseApp: {
    backgroundColor: '#f26522',
    padding: 20,
    justifyContent: 'center',
  },
  modalViewRegister: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewSearch: {
    left: 100,
    top: 160,
    width: '68%',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  modalView: {
    right: 0,
    position: 'absolute',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'left',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: 'white',
  },
  textDate: {
    fontSize: 24,
    color: '#f26522',
    fontWeight: '700',
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
});

export default HomeScreen;
