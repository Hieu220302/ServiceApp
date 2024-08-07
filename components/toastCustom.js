import React from 'react';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'pink',
        top: 10,
        right: 10,
        position: 'absolute',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        color: 'green',
        fontSize: 17,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
        flexWrap: 'wrap',
        flexShrink: 1,
      }}
      text2NumberOfLines={null}
      text2EllipsizeMode="clip"
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{top: 10, right: 10, position: 'absolute'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        color: 'red',
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
        flexWrap: 'wrap',
        flexShrink: 1,
      }}
      text2NumberOfLines={null}
      text2EllipsizeMode="clip"
    />
  ),
};

export function toastError(text1, text2, time = 5000) {
  Toast.show({
    type: 'error',
    text1: text1,
    text2: text2,
    position: 'top',
    onPress: () => Toast.hide(),
    visibilityTime: time,
  });
}

export function toastSuccess(text1, text2, time = 3000) {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
    position: 'top',
    onPress: () => Toast.hide(),
    visibilityTime: time,
  });
}
