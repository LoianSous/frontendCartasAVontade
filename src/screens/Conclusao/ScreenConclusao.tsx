import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Conclusao">;

export default function Conclusao() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const { theme } = useTheme();
  const styles = Styles(theme);

  const { share_url } = route.params as { share_url: string };

  const fullShareUrl = `http://192.168.1.7:3000/letters/${share_url}`;

  const [nomeSalvo, setNomeSalvo] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      setNomeSalvo(storedName);
    };
    loadUserName();
  }, []);

  const handleOpenLink = () => {
    Linking.openURL(fullShareUrl);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Veja minha carta: ${fullShareUrl}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("MainTabs", { screen: "Usuario" })}
                      >
                          <View style={styles.gear}>
      
                              <MaterialCommunityIcons name="arrow-left" size={30} color="#B41513" />
                          </View>
                      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/carta-coracao.png')}
            style={styles.logo}
            resizeMode="contain"
          />
            <Text style={styles.title}>
              {"Acesse o QRcode!"}
            </Text>
         
        </View>

        <View style={styles.form}>
  <Text style={styles.titleinputs}>Carta criada!</Text>

  <View style={{ alignItems: "center", marginTop: 20 }}>
    <QRCode value={fullShareUrl} size={180} />
  </View>

  {/* Caso ainda queira exibir o link também */}
  <Text style={{ color: theme.text, fontSize: 14, marginTop: 20, textAlign: "center" }}>
    {fullShareUrl}
  </Text>
</View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
            <Text style={styles.buttonText}>Acessar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2} onPress={handleShare}>
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
