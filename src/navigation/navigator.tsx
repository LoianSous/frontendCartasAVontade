import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from '../screens/Home/ScreenHome';
import Login from '../screens/Login/ScreenLogin';
import Cadastro from '../screens/Cadastro/ScreenCadastro';
import FormularioCarta from '../screens/FormularioCarta/ScreenFormularioCarta';
import ConfirmPassword from '../screens/ConfirmPassword/ScreenConfirmPassword';
import Recover from '../screens/recoverpassword/ScreenRecoverPassword';
import Code from '../screens/recoverpassword/ScreenCode';
import Alter from '../screens/recoverpassword/ScreenAlter';
import Configuracao from '../screens/Configuracao/ScreenConfiguracao';
import TabNavigator from './TabNavigator';
import Conclusao from '../screens/Conclusao/ScreenConclusao';
import EditarCartas from '../screens/EditarCartas/ScreenEditarCartas';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false }} />
          <Stack.Screen name="FormularioCarta" component={FormularioCarta} options={{ headerShown: false }} />
          <Stack.Screen name="EditarCartas" component={EditarCartas} options={{ headerShown: false }} />
          <Stack.Screen name="Conclusao" component={Conclusao} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Recover" component={Recover} options={{ headerShown: false }} />
          <Stack.Screen name="Code" component={Code} options={{ headerShown: false }} />
          <Stack.Screen name="Alter" component={Alter} options={{ headerShown: false }} />
          <Stack.Screen name="Configuracao" component={Configuracao} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
