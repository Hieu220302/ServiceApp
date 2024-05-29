import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
const OrderService = props => {
  const {dataInforService} = useSelector(state => state.inforService);
  const dispatch = useDispatch();
  const [inforService, setInforService] = useState(() => {
    const idInforService = props.route.params.id;
    return dataInforService.find(item => item.id === idInforService);
  });
  const [time, setTime] = useState(1);
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const handleQuantityIncrement = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = value => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 10) {
      setQuantity(numericValue);
    } else if (value === '') {
      setQuantity(1);
    }
  };

  const handleTimeIncrement = () => {
    if (time < 5) {
      setTime(time + 1);
    }
  };

  const handleTimeDecrement = () => {
    if (time > 1) {
      setTime(time - 1);
    }
  };

  const handleTimeChange = value => {
    const numericValue = parseInt(value, 5);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
      setTime(numericValue);
    } else if (value === '') {
      setTime(1);
    }
  };

  const handleLocationChange = value => {
    setLocation(value);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icons name="left" style={styles.iconHeader} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đặt đơn công việc</Text>
      </View>
      <ScrollView style={styles.body}>
        <View>
          <Text>Dịch vụ</Text>
          <Text>{inforService.Type}</Text>
        </View>
        {!!inforService.hasTime && (
          <View>
            <Text>Thời lượng</Text>
            <View style={styles.divTime}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleTimeDecrement}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={time.toString()}
                onChangeText={handleTimeChange}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleTimeIncrement}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!!inforService.hasQuantity && (
          <View>
            <Text>Số lượng</Text>
            <View style={styles.divTime}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleQuantityDecrement}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={handleQuantityChange}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleQuantityIncrement}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View>
          <Text>Địa chỉ</Text>
          <TextInput
            style={styles.inputLocation}
            value={location}
            onChangeText={handleLocationChange}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <FooterItem name="home" title="Trang chủ" page="Home" />
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
    justifyContent: 'space-betwwen',
  },
  iconHeader: {
    fontSize: 20,
    color: '#fff',
    marginRight: 260,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  body: {
    margin: 10,
  },
  divTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '87%',
    padding: 0,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  inputLocation: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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

export default OrderService;
