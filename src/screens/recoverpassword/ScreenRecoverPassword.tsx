import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { recoverRequest } from "../../services/auth";
import Loading from '../Loading/loading';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Recover">;

export default function Recover() {
  const navigation = useNavigation<NavigationProp>();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await recoverRequest(email);

      if (response.status === 200) {
        await AsyncStorage.setItem("recoverEmail", email);
        await delay(3000);
        navigation.navigate("Code");
      }

    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao enviar código.");
      }
    } finally {
      await delay(3000);
      setLoading(false);
    }
  };

  return (
    <>
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
            <Text style={Styles.title}>{"Recuperar senha."}</Text>
          </View>

          <View style={Styles.form}>
            <Text style={Styles.titleinputs}>email</Text>
            <TextInput
              style={Styles.input}
              placeholder="email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {error !== '' && <Text style={Styles.error}>{error}</Text>}
          </View>

          <View style={Styles.buttonContainer}>
            <TouchableOpacity style={Styles.button} onPress={validateForm}>
              <Text style={Styles.buttonText}>Recuperar senha</Text>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
      {loading && <Loading />}
    </>
  );
}