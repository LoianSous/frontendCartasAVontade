import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './styleCode';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { recoverVerify } from '../../services/auth';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Code">;

export default function Code() {
  const navigation = useNavigation<NavigationProp>();

  const [code, setCode] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const { theme} = useTheme();
  const styles = Styles(theme);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text && index < 4) {
        inputRefs[index + 1].current?.focus();
      }

      if (!text && index > 0) {
        inputRefs[index - 1].current?.focus();
      }

      if (newCode.every((n) => n !== "")) {
        validateForm(newCode.join(""));
      }
    }
  };

  const validateForm = async (finalCode: string) => {
  const savedEmail = await AsyncStorage.getItem("recoverEmail");

  if (!savedEmail) {
    setError("Erro: email não encontrado.");
    return;
  }

  try {
    await recoverVerify(savedEmail, finalCode);
navigation.replace("Alter");


  } catch (err: any) {
    const message = err?.response?.data?.error || "Erro ao validar código";
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
            source={require('../../../assets/carta-coracao.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Recuperar senha.</Text>
          <Text style={styles.title2}>Insira o código{"\n"}de segurança!</Text>
        </View>

        <View style={styles.form}>
          {code.map((value, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.input}
              keyboardType="number-pad"
              placeholder="0"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => validateForm(code.join(""))}
          >
            <Text style={styles.buttonText}>Validar código</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
