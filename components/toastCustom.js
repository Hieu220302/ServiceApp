import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

export const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        color: 'green',
        fontSize: 17,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        color: 'red',
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
      }}
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
export function toastsuccess(text1, text2, time = 3000) {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
    position: 'top',
    onPress: () => Toast.hide(),
    visibilityTime: time,
  });
}
