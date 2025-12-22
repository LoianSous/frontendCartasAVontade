import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView style={Styles.container}>
      <View style={Styles.content}>
      <View style={Styles.header}>
        <Image
          source={require('../../assets/carta-coracao.png')}
          style={Styles.logo}
          resizeMode="contain"
        />
        <Text style={Styles.title}>Faça sua cartinha especial!</Text>
      </View>
      <View style={Styles.buttonContainer}>
        <TouchableOpacity style={Styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={Styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={Styles.titlemid}>{"Ou"}</Text>
        <TouchableOpacity style={Styles.buttoncadastro} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={Styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>

      </View>
    </SafeAreaView>
  );
}