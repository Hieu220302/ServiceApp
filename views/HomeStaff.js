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

import {useNavigation} from '@react-navigation/native';

import {logout} from '../redux/reducers/Login/signinReducer';
import Footer from '../components/footer';

import {inforUser} from '../redux/reducers/Users/inforUser';

import {toastError, toastSuccess} from '../components/toastCustom';
import {servicePackage} from '../redux/reducers/servicePackage/servicePackage';
import {orderServiceByIdStaff} from '../redux/reducers/orderService/orderServiceByIdStaff';
import {inforCustomer} from '../redux/reducers/Users/inforCustomer';
import changeOrderByStaff from '../api/orderService/changeOrderByStaff';
import {inforStaffById} from '../redux/reducers/staff/staffById';
import changeFreeTime from '../api/staff/changeFreeTime';
import cancelStaff from '../api/orderService/cancelStaff';
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
  useEffect(() => {
    dispatch(inforUser(dataLogin.id));
    dispatch(orderServiceByIdStaff(dataLogin.id));
    dispatch(inforStaffById(dataLogin.id));
    dispatch(servicePackage());
  }, [dataLogin]);
  useEffect(() => {
    setFreeTime(
      !dataInforStaffId?.Free_time ? '' : dataInforStaffId?.Free_time,
    );
    setCheckFreeTime(
      convertStrToArr(
        !dataInforStaffId?.Free_time ? '' : dataInforStaffId?.Free_time,
      ),
    );
    return () => {
      setIsShowButton(false);
    };
  }, [dataInforStaffId]);
  const convertStrToArr = freeTime => {
    if (freeTime === '') return [];
    const arr = freeTime?.split(',');
    const result = arr?.map(item => item.split('_')[1]);
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
  const [isShowButton, setIsShowButton] = useState(false);
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
        checkFreeTime.splice(positionDate, 1);
        const time = freeTime.split(',');
        time.splice(positionDate, 1);
        setFreeTime(time.join(','));
        setIsShowButton(true);
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
        return result;
      });
      closeModalShift();
      setIsShowButton(true);
    };
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
      scrollViewRef.current.scrollTo({x: scrollX.current, animated: true});
    }, []);

    const handleScroll = event => {
      const {x} = event.nativeEvent.contentOffset;
      scrollX.current = x;
    };

    const handleUpdate = async () => {
      setIsShowButton(false);
      const res = await changeFreeTime({
        id: dataInforStaffId?.id,
        Free_time: freeTime,
      });
      dispatch(inforStaffById(dataLogin.id));
    };
    return (
      <View>
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
        {isShowButton && (
          <View style={styles.viewUpdate}>
            <TouchableOpacity
              style={styles.buttonUpdate}
              onPress={handleUpdate}>
              <Text style={styles.buttonTextUpdate}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const cancelOrder = async id => {
    try {
      const response = await cancelStaff(id);
      if (response?.errno) {
        toastError('Lỗi huỷ đơn', 'Hệ thống có lỗi xin bạn hãy huỷ đơn lại');
      } else {
        toastSuccess(
          'Xác nhận huỷ đơn',
          'Bạn đã đăng ký huỷ đơn thành công chờ xác nhận',
        );
        dispatch(orderServiceByIdStaff(dataLogin?.id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const parseDate = dateStr => {
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = '20' + dateStr.substring(4, 6);
    return new Date(year, month - 1, day);
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

      const checkTime = (time, completedDate) => {
        if (completedDate?.length > 0) return false;
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
                const isShow =
                  checkTime(inforOrder?.Time, inforOrder?.completedDate) &&
                  !inforOrder?.staffCancel;

                const listPaymentMethods = ['Tiền mặt', 'Thanh toán Momo'];
                const codeWork = convertStrToArr(inforOrder?.code);

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
                                style={[
                                  styles.dateBoxWork,
                                  true && styles.selectedDate,
                                ]}>
                                <Text style={styles.dateTextWork}>
                                  {day
                                    .toLocaleDateString('vi-VN', {
                                      weekday: 'short',
                                    })
                                    .toUpperCase()}
                                </Text>
                                <Text
                                  style={
                                    styles.dateNumberWork
                                  }>{`${day.getDate()}/${
                                  day.getMonth() + 1
                                }`}</Text>
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                      <Text style={styles.inforText}>
                        Ghi chú: {inforOrder?.Notes || 'Chưa có ghi chú'}
                      </Text>
                      <Text style={styles.inforText}>
                        Gói dịch vụ: {namePackage}
                      </Text>
                      <Text style={styles.inforText}>
                        Tổng tiền: {inforOrder?.Total.toLocaleString()} VND
                      </Text>
                      <Text style={styles.inforText}>
                        Phương thức thanh toán:
                        {listPaymentMethods[inforOrder?.paymentMethods]}
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
  const defaultImage =
    'http://res.cloudinary.com/dmgiwjxch/image/upload/v1718724523/f29b36d6dc8d7be709db6ac04cbd57e2.jpg';
  const [imageSelected, setImageSelected] = useState(
    dataInforUser?.Image || defaultImage,
  );
  return (
    <View style={styles.container}>
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
                      {dataInforUser?.Id_role === 1 && (
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => {
                            closeModal();
                            navigation.navigate('Home');
                          }}>
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
  viewUpdate: {
    alignItems: 'center',
    margin: 20,
  },
  headerText: {
    fontSize: 16,
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
  buttonTextUpdate: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
  noticeText: {
    fontSize: 15,
    marginBottom: 20,
    color: '#000',
  },
  dateBox: {
    alignItems: 'center',
    padding: 10,
    width: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateBoxWork: {
    alignItems: 'center',
    padding: 5,
    width: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedDate: {
    backgroundColor: '#ff9800',
  },
  dateText: {
    fontSize: 15,
    color: '#000',
  },
  dateTextWork: {
    fontSize: 13,
    color: '#000',
  },
  dateNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  dateNumberWork: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  body: {
    padding: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  inforWork: {
    paddingVertical: 10,
    borderColor: '#f26522',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inforWorkLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '78%',
  },
  inforWorkRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '20%',
  },
  button: {
    backgroundColor: '#00a800',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUpdate: {
    backgroundColor: '#00a800',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '800',
  },
  inforText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  textDate: {
    fontSize: 15,
    color: '#f26522',
    fontWeight: '700',
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
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
});

export default HomeStaff;
