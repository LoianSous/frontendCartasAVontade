import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { resetPassword } from '../../services/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Alter">;

export default function Alter() {
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("recoverEmail");
      if (storedEmail) setEmail(storedEmail);
    };
    loadEmail();
  }, []);

  const handleReset = async () => {
    setError('');

    if (password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmpassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      const response = await resetPassword(email, password);

      Alert.alert("Sucesso!", "Senha alterada com sucesso!");
      navigation.navigate("Login");

    } catch (err: any) {
      console.log(err);

      const message =
        err?.response?.data?.error ||
        "Erro inesperado ao alterar a senha";

      setError(message);
    }
  };

  return (
    <SafeAreaView style={Styles.container}>
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
          <Text style={Styles.title}>Alterar senha!</Text>
        </View>

        <View style={Styles.form}>
          <Text style={Styles.titleinputs}>Nova Senha</Text>
          <TextInput
            style={Styles.input}
            placeholder="****************"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={Styles.titleinputs}>Confirmar nova senha</Text>
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
          <TouchableOpacity style={Styles.button} onPress={handleReset}>
            <Text style={Styles.buttonText}>Alterar senha</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
