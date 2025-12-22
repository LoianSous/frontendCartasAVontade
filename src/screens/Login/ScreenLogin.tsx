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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function Login() {
  const navigation = useNavigation<NavigationProp>();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const handleLogin = async () => {
  try {
    setError("");
    setInputError(false);

    const response = await loginUser(usuario, password);

    setLoading(true);

    const { token, name, id } = response.data;

    await AsyncStorage.setItem("autToken", token);
    await AsyncStorage.setItem("userName", name);
    await AsyncStorage.setItem("userId", String(id));

    await delay(3000);

    navigation.navigate("MainTabs", { screen: "Usuario" });

  } catch (err: any) {
    setInputError(true);

    const message =
      err.response?.data?.error ?? "Erro ao conectar ao servidor";

    setError(message);

    Toast.show({
      type: "error",
      text1: "Erro no login",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });

  } finally {
    if (loading) {
      await delay(3000);
      setLoading(false);
    }
  }
};


  return (
    <>
      <SafeAreaView style={Styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">

            <TouchableOpacity
              style={Styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={32} color="#B41513" />
            </TouchableOpacity>

            <View style={Styles.content}>
              <View style={Styles.header}>
                <Image
                  source={require('../../assets/carta-coracao.png')}
                  style={Styles.logo}
                  resizeMode="contain"
                />
                <Text style={Styles.title}>{"Entre na sua"}</Text>
                <Text style={Styles.title2}>{"conta."}</Text>
              </View>

              <View style={Styles.form}>
                <Text style={Styles.titleinputs}>Nome</Text>
                <TextInput
                  style={[
    Styles.input,
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
                <Text style={Styles.titleinputs}>Senha</Text>
                <TextInput
  style={[
    Styles.input,
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


                {error !== '' && <Text style={Styles.error}>{error}</Text>}

                <TouchableOpacity
                  style={Styles.linkpassword}
                  onPress={() => navigation.navigate('Recover')}
                >
                  <Text style={{ color: "#909090ff", textDecorationLine: 'underline' }}>Esqueci minha senha!</Text>
                </TouchableOpacity>
              </View>

              <View style={Styles.buttonContainer}>
                <TouchableOpacity style={Styles.button} onPress={handleLogin}>
                  <Text style={Styles.buttonText}>Acessar</Text>
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