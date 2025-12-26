import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ConfirmPassword">;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const { theme} = useTheme();
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
        <Text style={styles.title}>Conta criada!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.title2}>Cadastrado com Sucesso!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("MainTabs", { screen: "Usuario" })}>
          <Text style={styles.buttonText}>Inicio</Text>
        </TouchableOpacity>
      </View>

      </View>
    </SafeAreaView>
  );
}