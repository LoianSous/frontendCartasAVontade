import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

import { getUserProfile } from '../../services/auth'; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Configuracao">;

export default function Perfil() {
  const navigation = useNavigation<NavigationProp>();
  const { theme} = useTheme();
  const [profile, setProfile] = useState<any | null>(null);

  const styles = Styles(theme);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("autToken");
        if (!token) return;

        const res = await getUserProfile(token);
        setProfile(res.data);

      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Configuracao")}
        >
          <View style={styles.gear}>
            <MaterialCommunityIcons name="cog" size={30} color="#B41513" />
          </View>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.profile}>
            <MaterialCommunityIcons
              name="account-heart-outline"
              size={50}
              color="#B41513"
            />
          </View>

          {profile && (
            <Text style={styles.title}>
              {"Perfil!\n"} {profile.name}
            </Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.titlemid}>{profile?.email}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.titlemid}>
            {`Data de criação: ${
              profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("pt-BR")
                : ""
            }`}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.titlemid}>
            {`Quantidade de cartas: ${profile?.letter_qty}`}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
