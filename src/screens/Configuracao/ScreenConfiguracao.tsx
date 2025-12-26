import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Configuracao">;

export default function Configuracao() {
  const [nomeSalvo, setNomeSalvo] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const { theme, setTheme } = useTheme();
  const styles = Styles(theme);
  
  type ThemeOptionProps = {
  label: string;
  onPress: () => void;
  theme: any;
};

const ThemeOption = ({ label, onPress, theme }: ThemeOptionProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.inputBackground,
    }}
  >
    <Text
      style={{
        color: theme.text,
        fontSize: 16,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      setNomeSalvo(storedName);
    };

    loadUserName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.gear}>

            <MaterialCommunityIcons name="arrow-left" size={30} color="#B41513" />
          </View>
        </TouchableOpacity>
        <Text style={styles.textconf}>Configurações</Text>
        <View style={styles.header}>
          <View style={styles.profile}>
            <MaterialCommunityIcons
              name="account-heart-outline"
              size={50}
              color="#B41513"
            />


          </View>
          <View style={styles.header2}>
            <Text style={styles.textheader2}>{nomeSalvo}</Text>
          </View>

        </View>
        <View style={styles.boxconfs}>
          <TouchableOpacity style={styles.info}>
            <Text>Permissões</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowThemeModal(true)} style={styles.info}>
            <Text>Temas</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      <Modal transparent animationType="fade" visible={showThemeModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '85%',
              borderRadius: 16,
              padding: 20,
              backgroundColor: theme.container,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 20,
              }}
            >
              🎨 Escolha o tema
            </Text>
      
            {/* LISTA DE TEMAS */}
            <ThemeOption
              label="🌞 Tema Claro"
              onPress={() => {
                setTheme('light');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
      
            <ThemeOption
              label="🌙 Tema Escuro"
              onPress={() => {
                setTheme('dark');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
      
            <ThemeOption
              label="🎩 Elegante"
              onPress={() => {
                setTheme('elegant');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
      
            <ThemeOption
              label="😄 Jovem"
              onPress={() => {
                setTheme('young');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
      
            <ThemeOption
              label="🚀 Futurista"
              onPress={() => {
                setTheme('futuristic');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
      
            <ThemeOption
              label="🧸 Minimalista"
              onPress={() => {
                setTheme('minimal');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
      
            <ThemeOption
              label="🧓 Clássico"
              onPress={() => {
                setTheme('classic');
                setShowThemeModal(false);
              }}
              theme={theme}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}