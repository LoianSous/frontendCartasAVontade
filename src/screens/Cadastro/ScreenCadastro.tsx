import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { registerUser } from '../../services/auth';
import Loading from '../Loading/loading';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;

export default function Cadastro() {
  const navigation = useNavigation<NavigationProp>();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = async () => {
    setError("");
    setLoading(true);

    try {

      if (!usuario.trim()) {
        setError("O nome é obrigatório");
        return;
      }

      if (!email.trim()) {
        setError("O email é obrigatório");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Formato de email inválido");
        return;
      }

      if (!password) {
        setError("A senha é obrigatória");
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres");
        return;
      }

      if (!confirmpassword) {
        setError("É necessário confirmar a senha");
        return;
      }

      if (password !== confirmpassword) {
        setError("As senhas não coincidem");
        return;
      }

      await registerUser(usuario, usuario, email, password);

      alert("Usuário registrado com sucesso!");

      await delay(3000);
      navigation.navigate("ConfirmPassword");

    } catch (e) {
      setError("Erro ao registrar usuário");

    } finally {
      await delay(1000);
      setLoading(false);
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
                <Text style={Styles.title}>Crie sua conta!</Text>
              </View>

              <View style={Styles.form}>
                <Text style={Styles.titleinputs}>Nome</Text>
                <TextInput
                  style={Styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={usuario}
                  onChangeText={setUsuario}
                />
                <Text style={Styles.titleinputs}>Email</Text>
                <TextInput
                  style={Styles.input}
                  placeholder="seuemail@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={Styles.titleinputs}>Senha</Text>
                <TextInput
                  style={Styles.input}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <Text style={Styles.titleinputs}>Confirmar senha</Text>
                <TextInput
                  style={Styles.input}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmpassword}
                  onChangeText={setconfirmPassword}
                />

                {error !== '' && <Text style={Styles.error}>{error}</Text>}
              </View>

              <View style={Styles.buttonContainer}>
                <TouchableOpacity style={Styles.button} onPress={validateForm}>
                  <Text style={Styles.buttonText}>Cadastrar-se</Text>
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