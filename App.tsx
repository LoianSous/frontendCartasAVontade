import Navigator from './src/navigation/navigator';
import Toast, { BaseToast } from 'react-native-toast-message';

const toastConfig = {
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#B41513',
        backgroundColor: '#FFE7E7',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#B41513',
      }}
      text2Style={{
        fontSize: 14,
        color: '#7A1C1C',
      }}
    />
  ),

  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
      }}
      text1Style={{
        color: '#2E7D32',
        fontWeight: '600',
      }}
      text2Style={{
        color: '#388E3C',
      }}
    />
  ),
};

export default function App(){
  return ( 
    <>
      <Navigator/>
      <Toast config={toastConfig}/>
    </>
  );
}