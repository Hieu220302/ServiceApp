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
  TouchableWithoutFeedback,
} from 'react-native';
import Icons from 'react-native-vector-icons/EvilIcons';
import {useDispatch, useSelector} from 'react-redux';
import convertToVietnamTime from '../components/convertToVietnamTime';
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
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import {orderServiceByIdStaff} from '../redux/reducers/orderService/orderServiceByIdStaff';
import {inforCustomer} from '../redux/reducers/Users/inforCustomer';
import changeOrderByStaff from '../api/orderService/changeOrderByStaff';
import {inforStaffById} from '../redux/reducers/staff/staffById';
import changeFreeTime from '../api/staff/changeFreeTime';
const HomeStaff = () => {
  const {dataLogin} = useSelector(state => state.login);
  const {dataInforUser} = useSelector(state => state.inforUser);
  const {dataInforService} = useSelector(state => state.inforService);
  const {dataInforStaffId} = useSelector(state => state.inforStaffById);
  const {dataOrderServiceByIdStaff} = useSelector(
    state => state.orderServiceByIdStaff,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listTab = [
    {id: 1, name: 'Chờ làm'},
    {id: 2, name: 'Lặp lại'},
    {id: 3, name: 'Theo gói'},
  ];
  const [tabSelect, setTabSelect] = useState(1);
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

  const convertStrToArr = freeTime => {
    if (freeTime === '') return [];
    const arr = freeTime.split(',');
    const result = arr.map(item => item.split('_')[1]);
    return result;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [freeTime, setFreeTime] = useState(dataInforStaffId?.Free_time || '');

  const [checkFreeTime, setCheckFreeTime] = useState(() =>
    convertStrToArr(dataInforStaffId?.Free_time),
  );

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogOut = () => {
    dispatch(logout());
    closeModal();
    navigation.navigate('Home');
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
  };
  const scrollViewRef = useRef(null);
  const scrollX = useRef(null);
  const RegistrationSchedule = () => {
    const [date, setDate] = useState(() => {
      const day = new Date();
      day.setDate(day.getDate() + 1);
      return day;
    });
    const [dateSelect, setDateSelect] = useState();
    const closeModalShift = () => {
      setIsOpenModal(false);
    };

    const handleSelectDay = (day, isSelect) => {
      if (isSelect) {
        const checkDay = formatDateStamp(day);
        const positionDate = checkFreeTime.indexOf(checkDay);
        console.log(checkFreeTime);
        checkFreeTime.splice(positionDate, 1);
        console.log(checkFreeTime);
        const time = freeTime.split(',');
        time.splice(positionDate, 1);
        setFreeTime(time.join(','));
        changeFreeTime({
          id: dataInforStaffId?.id,
          Free_time: time.join(','),
        });
        dispatch(inforStaffById(dataLogin.id));
      } else {
        setIsOpenModal(true);
        setDateSelect(day);
      }
    };

    const formatDateStamp = dateSelect => {
      const date = new Date(dateSelect);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = String(date.getUTCFullYear()).slice(-2);

      return `${day}${month}${year}`;
    };

    const handleSelectShift = id => {
      let code = `${formatDateStamp(dateSelect)}`;
      setCheckFreeTime(prev => {
        if (prev != []) prev.push(code);
        else return code;
        return prev;
      });
      if (id === 0) {
        code = `D_` + code;
      } else if (id === 1) {
        code = `CS_` + code;
      } else {
        code = `CT_` + code;
      }
      setFreeTime(prev => {
        let result = '';
        if (prev !== '') result = `${prev},${code}`;
        else result = code;
        changeFreeTime({
          id: dataInforStaffId?.id,
          Free_time: result,
        });
        dispatch(inforStaffById(dataLogin.id));
        return result;
      });
      closeModalShift();
    };
    const [isOpenModal, setIsOpenModal] = useState(false);

    // Effect to update scroll position when ScrollView changes
    useEffect(() => {
      scrollViewRef.current.scrollTo({x: scrollX.current, animated: true});
    }, []);

    // Function to handle scroll event
    const handleScroll = event => {
      const {x} = event.nativeEvent.contentOffset;
      scrollX.current = x;
    };
    return (
      <View style={styles.dateContainer}>
        {isOpenModal && (
          <Modal
            transparent={true}
            animationType="none"
            visible={isOpenModal}
            onRequestClose={closeModalShift}>
            <TouchableWithoutFeedback onPress={closeModalShift}>
              <View style={styles.overlayDate}>
                <View style={styles.modalViewDate}>
                  <Text style={styles.textDate}>Chọn ca làm việc</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => handleSelectShift(0)}>
                    <Text style={styles.textStyle}>Cả ngày</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => handleSelectShift(1)}>
                    <Text style={styles.textStyle}>Ca Sáng</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => handleSelectShift(2)}>
                    <Text style={styles.textStyle}>Ca Tối</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateContainer}
          ref={scrollViewRef}
          onMomentumScrollEnd={handleScroll}>
          {[...Array(30).keys()].map(i => {
            const day = new Date();
            day.setDate(date.getDate() + i);
            const checkDay = formatDateStamp(day);
            const isSelect = checkFreeTime?.includes(checkDay);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dateBox, isSelect && styles.selectedDate]}
                onPress={() => handleSelectDay(day, isSelect)}>
                <Text style={styles.dateText}>
                  {day
                    .toLocaleDateString('vi-VN', {weekday: 'short'})
                    .toUpperCase()}
                </Text>
                <Text style={styles.dateNumber}>{`${day.getDate()}/${
                  day.getMonth() + 1
                }`}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const cancelOrder = async id => {
    try {
      const response = await changeOrderByStaff(id, 2, null);
      if (response?.errno) {
        toastError('Lỗi huỷ đơn', 'Hệ thống có lỗi xin bạn hãy huỷ đơn lại');
      } else {
        toastSuccess('Xác nhận huỷ đơn', 'Bạn đã huỷ đơn thành công');
        dispatch(orderServiceByIdStaff(dataLogin?.id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CalendarWork = () => {
    if (dataOrderServiceByIdStaff?.length > 0) {
      let listWork = [];
      const {dataServicePackage} = useSelector(state => state.servicePackage);
      const {dataInforCustomer} = useSelector(state => state.inforCustomer);
      const searchWork = dataOrderServiceByIdStaff?.reduce((count, order) => {
        const orderDay = formatTimestamp(new Date(order.Time));
        const countDay = formatTimestamp(
          new Date(count[count?.length - 1]?.Time),
        );
        if (orderDay === countDay || count.length === 0) {
          count.push(order);
          return count;
        } else {
          listWork.push(count);
          count = [];
          count.push(order);
          return count;
        }
      }, []);
      listWork.push(searchWork);
      const [selectedDate, setSelectedDate] = useState(
        new Date(listWork[0][0]?.Time),
      );
      const [position, setPosition] = useState(0);

      const handleSelectDate = (date, index) => {
        setSelectedDate(date);
        setPosition(index);
      };
      useEffect(() => {
        dispatch(inforCustomer());
      }, [dispatch]);

      const checkTime = time => {
        const specificTime = new Date(time);

        const currentTime = new Date();

        const timeDifference = Math.abs(currentTime - specificTime);

        const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

        if (dayDifference >= 4) {
          return true;
        } else {
          return false;
        }
      };

      return (
        <View>
          <View style={styles.dateContainerView}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateContainer}>
              {listWork.map((list, index) => {
                const date = new Date(list[0]?.Time);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateBox,
                      formatTimestamp(selectedDate) === formatTimestamp(date) &&
                        styles.selectedDate,
                    ]}
                    onPress={() => handleSelectDate(date, index)}>
                    <Text style={styles.dateText}>
                      {date
                        .toLocaleDateString('vi-VN', {weekday: 'short'})
                        .toUpperCase()}
                    </Text>
                    <Text style={styles.dateNumber}>{`${date.getDate()}/${
                      date.getMonth() + 1
                    }`}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={[styles.dateContainerView, styles.scrollViewWork]}>
            <ScrollView
              style={
                listWork[position].length > 2 && styles.dateContainerScroll
              }>
              {listWork[position].map((inforOrder, index) => {
                const job = dataInforService.find(
                  infor => infor.id === inforOrder?.id_service,
                );
                const customer = dataInforCustomer.find(
                  dataCustomer => dataCustomer.id === inforOrder?.id,
                );
                const namePackage =
                  dataServicePackage.find(
                    pack => pack.id === inforOrder?.isServicePacks,
                  )?.Name || 'Không đăng ký gói dịch vụ';
                const time = convertToVietnamTime(inforOrder?.Time);
                const isShow = checkTime(inforOrder?.Time);
                return (
                  <View key={index} style={styles.inforWork}>
                    <View style={styles.inforWorkLeft}>
                      <Text style={styles.inforText}>
                        Công việc: {job?.Type}
                      </Text>
                      <Text style={styles.inforText}>
                        Địa chỉ: {inforOrder?.Address}
                      </Text>
                      <Text style={styles.inforText}>Thời điểm: {time}</Text>
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
                        Người đăng đơn: {customer?.Name}
                      </Text>
                      <Text style={styles.inforText}>
                        Số liên hệ: {customer?.Phone_number}
                      </Text>
                      <Text style={styles.inforText}>
                        Số ngày làm còn lại: {inforOrder?.days} ngày
                      </Text>
                      <Text style={styles.inforText}>
                        Ghi chú: {inforOrder?.Notes || 'Chưa có ghi chú'}
                      </Text>
                      <Text style={styles.inforText}>
                        Gói dịch vụ: {namePackage}
                      </Text>
                      <Text style={styles.inforText}>
                        Tổng tiền: {inforOrder?.Total.toLocaleString()} VND
                      </Text>
                    </View>
                    {isShow && (
                      <View style={styles.inforWorkRight}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => cancelOrder(inforOrder?.id)}>
                          <Text style={styles.buttonText}>Hủy đơn</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    } else
      return (
        <View>
          <Text style={styles.noticeText}>
            Bạn hiện tại chưa có lịch làm việc.
          </Text>
        </View>
      );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Xin chào bạn ngày mới tốt lành</Text>

        <TouchableOpacity style={styles.headerRight} onPress={openModal}>
          <Icons name="user" style={{fontSize: 60}} />

          {dataLogin?.id && (
            <Text style={styles.headerText}>{dataInforUser?.Name}</Text>
          )}
        </TouchableOpacity>

        {modalVisible && (
          <Modal
            transparent={true}
            animationType="none"
            visible={modalVisible}
            onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.overlay}>
                <View
                  style={[styles.modalView, {top: dataLogin?.id ? 90 : 50}]}>
                  {dataLogin?.id && (
                    <>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => navigation.navigate('ChangeInfor')}>
                        <Text style={styles.textStyle}>
                          Chỉnh sửa thông tin
                        </Text>
                      </TouchableOpacity>
                      {dataInforUser?.Id_role === 1 && (
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => navigation.navigate('Home')}>
                          <Text style={styles.textStyle}>
                            Chuyển qua giao diện khách hàng
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
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
      <ScrollView>
        <View style={styles.body}>
          <View>
            <Text style={styles.titleText}>Lịch làm việc</Text>
            <CalendarWork />
          </View>
          <View>
            <Text style={styles.titleText}>Đăng kí thời gian làm</Text>
            <RegistrationSchedule />
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateContainerView: {
    marginLeft: 10,
  },
  dateContainerScroll: {
    height: 500,
  },
  scrollViewWork: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#f26522',
    padding: 10,
  },
  noticeText: {
    fontSize: 20,
    marginBottom: 20,
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
  dateText: {
    fontSize: 20,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    padding: 20,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inforWork: {
    paddingVertical: 10,
    borderColor: '#f26522',
    borderBottomWidth: 1,
    flexDirection: 'row',
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
  inforText: {
    fontSize: 18,
    fontWeight: '700',
    width: 500,
  },
  textDate: {
    fontSize: 24,
    color: '#f26522',

    fontWeight: '700',
  },
  menuItem: {
    flex: 1,
    width: 50,
    backgroundColor: '#fff',
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
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayDate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewDate: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
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
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default HomeStaff;

/* <View style={styles.tabBar}>
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
      </View> */
