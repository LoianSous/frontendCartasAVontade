import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Usuario() {
  const navigation = useNavigation<NavigationProp>();

  const [nomeCarta, setnomeCarta] = useState('');
  const [error, setError] = useState('');
  const [nomeSalvo, setNomeSalvo] = useState<string | null>(null);

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
    <SafeAreaView style={Styles.container}>
      <View style={Styles.content}>
        <View style={Styles.header}>
          <Image
            source={require('../../assets/carta-coracao.png')}
            style={Styles.logo}
            resizeMode="contain"
          />
          {nomeSalvo && (
            <Text style={Styles.title}>
              {"Seja bem-vindo! \n"} {nomeSalvo}
            </Text>
          )}

        </View>

        <View style={Styles.form}>
          <Text style={Styles.titleinputs}>Nome da carta</Text>
          <TextInput
            style={Styles.input}
            placeholder="Nome da carta"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={nomeCarta}
            onChangeText={setnomeCarta}
          />

          {error !== '' && <Text style={Styles.error}>{error}</Text>}

        </View>

        <View style={Styles.buttonContainer}>

          <TouchableOpacity style={Styles.button} onPress={validateForm}>
            <Text style={Styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        </View>

      </View>

    </SafeAreaView>
  );
}
