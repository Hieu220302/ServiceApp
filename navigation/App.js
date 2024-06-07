import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import Home from '../views/HomeScreen';
import OrderService from '../views/OrderService';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../components/toastCustom';
import Orders from '../views/Orders';
import Repurchase from '../views/Repurchase';
import ChangeInfor from '../views/ChangeInfor';
import HomeStaff from '../views/HomeStaff';
import RegisterOrders from '../views/RegisterOrders';
import SignUp from '../views/SignUp';
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Order"
          component={OrderService}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Repurchase"
          component={Repurchase}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangeInfor"
          component={ChangeInfor}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeStaff"
          component={HomeStaff}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterOrders"
          component={RegisterOrders}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default App;
