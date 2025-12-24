import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ConfirmPassword">;

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
        <Text style={Styles.title}>Conta criada!</Text>
      </View>
      <View style={Styles.buttonContainer}>
        <Text style={Styles.title2}>Cadastrado com Sucesso!</Text>
        <TouchableOpacity style={Styles.button} onPress={() => navigation.replace("MainTabs", { screen: "Usuario" })}>
          <Text style={Styles.buttonText}>Inicio</Text>
        </TouchableOpacity>
      </View>

      </View>
    </SafeAreaView>
  );
}