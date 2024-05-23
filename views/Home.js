import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.textWelcome}>Xin chào bạn một ngày tốt lành</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 90,
  },
  textWelcome: {
    fontFamily: 'Serif',
    fontSize: 16,
  },
});

export default Home;
