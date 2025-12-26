import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const styles = Styles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/carta-coracao.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Faça sua cartinha especial!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={styles.titlemid}>{"Ou"}</Text>
        <TouchableOpacity style={styles.buttoncadastro} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.buttonText}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>

      </View>
    </SafeAreaView>
  );
}