import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './styleAlter';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { resetPassword } from '../../services/auth';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Alter">;

export default function Alter() {
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { theme} = useTheme();
  const styles = Styles(theme);

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
      navigation.replace("Login");

    } catch (err: any) {
      console.log(err);

      const message =
        err?.response?.data?.error ||
        "Erro inesperado ao alterar a senha";

      setError(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.title}>Alterar senha!</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.titleinputs}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="****************"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.titleinputs}>Confirmar nova senha</Text>
          <TextInput
            style={styles.input}
            placeholder="****************"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmpassword}
            onChangeText={setconfirmPassword}
          />

          {error !== '' && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Alterar senha</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
