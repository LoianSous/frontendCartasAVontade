import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { loginUser } from '../../services/auth';
import Loading from '../Loading/loading';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login() {
  const navigation = useNavigation<NavigationProp>();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const { theme} = useTheme();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const styles = Styles(theme);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await delay(3000);
      setError("");
      setInputError(false);

      const response = await loginUser(usuario, password);

      const { token, name, id } = response.data;

      await AsyncStorage.setItem("autToken", token);
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("userId", String(id));

      navigation.replace("MainTabs", { screen: "Usuario" });

    } catch (err: any) {
      setInputError(true);
      setLoading(false);

      const message =
        err.response?.data?.error ?? "Erro ao conectar ao servidor";

      setError(message);

      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: message,
        position: "top",
      });

    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={32} color="#B41513" />
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.header}>
                <Image
                  source={require('../../assets/carta-coracao.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>{"Entre na sua"}</Text>
                <Text style={styles.title2}>{"conta."}</Text>
              </View>

              <View style={styles.form}>
                <Text style={styles.titleinputs}>Nome</Text>
                <TextInput
                  style={[
                    styles.input,
                    inputError && { borderColor: "red", borderWidth: 2 }
                  ]}
                  placeholder="Nome de usuario ou email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={usuario}
                  onChangeText={(text) => {
                    setUsuario(text);
                    setInputError(false);
                    setError("");
                  }}
                />
                <Text style={styles.titleinputs}>Senha</Text>
                <TextInput
                  style={[
                    styles.input,
                    inputError && { borderColor: "red", borderWidth: 2 }
                  ]}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setInputError(false);
                    setError("");
                  }}
                />


                {error !== '' && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity
                  style={styles.linkpassword}
                  onPress={() => navigation.navigate('Recover')}
                >
                  <Text style={{ color: "#909090ff", textDecorationLine: 'underline' }}>Esqueci minha senha!</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {loading && <Loading />}
    </>
  );
}