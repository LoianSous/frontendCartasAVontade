import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Usuario() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, toggleTheme, isDark } = useTheme();
  const [nomeCarta, setnomeCarta] = useState('');
  const [error, setError] = useState('');
  const [nomeSalvo, setNomeSalvo] = useState<string | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const styles = Styles(theme);

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      setNomeSalvo(storedName);
    };

    loadUserName();
  }, []);

  const validateForm = () => {
  if (!nomeCarta.trim()) {
    setError("O nome da carta é obrigatório.");
    return;
  }

  setError(""); 
  navigation.navigate("FormularioCarta", { letterTitle: nomeCarta });
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
         {/* BOTÃO DO PINCEL */}
        <TouchableOpacity
  onPress={() => setShowThemeModal(true)}
  style={{ position: 'absolute', top: 20, right: 20 }}
>
  <Feather name="edit-3" size={24} color={theme.text} />
</TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={require('../../assets/carta-coracao.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {nomeSalvo && (
            <Text style={styles.title}>
              {"Seja bem-vindo! \n"} {nomeSalvo}
            </Text>
          )}

        </View>

        <View style={styles.form}>
          <Text style={styles.titleinputs}>Nome da carta</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da carta"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={nomeCarta}
            onChangeText={setnomeCarta}
          />

          {error !== '' && <Text style={styles.error}>{error}</Text>}

        </View>

        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.button} onPress={validateForm}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        </View>

      </View>
      <Modal transparent animationType="fade" visible={showThemeModal}>
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <View style={{
      width: '80%',
      borderRadius: 12,
      padding: 20,
      backgroundColor: theme.container
    }}>

      <Text style={{ color: theme.text, fontSize: 18, marginBottom: 20 }}>
        Escolha o tema
      </Text>

      <TouchableOpacity
        onPress={() => {
          if (isDark) toggleTheme();
          setShowThemeModal(false);
        }}
      >
        <Text style={{ color: theme.text, fontSize: 16 }}>
          🌞 Tema Claro
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 15 }}
        onPress={() => {
          if (!isDark) toggleTheme();
          setShowThemeModal(false);
        }}
      >
        <Text style={{ color: theme.text, fontSize: 16 }}>
          🌙 Tema Escuro
        </Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>


    </SafeAreaView>
  );
}
