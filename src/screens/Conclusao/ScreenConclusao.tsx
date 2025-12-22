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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Conclusao">;

export default function Conclusao() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const { share_url } = route.params as { share_url: string };

  const fullShareUrl = `http://192.168.1.6:3000/letters/${share_url}`;

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
    <SafeAreaView style={Styles.container}>
      <TouchableOpacity
                          style={Styles.backButton}
                          onPress={() => navigation.navigate("MainTabs", { screen: "Usuario" })}
                      >
                          <View style={Styles.gear}>
      
                              <MaterialCommunityIcons name="arrow-left" size={30} color="#B41513" />
                          </View>
                      </TouchableOpacity>
      <View style={Styles.content}>
        <View style={Styles.header}>
          <Image
            source={require('../../assets/carta-coracao.png')}
            style={Styles.logo}
            resizeMode="contain"
          />
            <Text style={Styles.title}>
              {"Acesse o QRcode!"}
            </Text>
         
        </View>

        <View style={Styles.form}>
  <Text style={Styles.titleinputs}>Carta criada!</Text>

  <View style={{ alignItems: "center", marginTop: 20 }}>
    <QRCode value={fullShareUrl} size={180} />
  </View>

  {/* Caso ainda queira exibir o link também */}
  <Text style={{ color: "#B41513", fontSize: 14, marginTop: 20, textAlign: "center" }}>
    {fullShareUrl}
  </Text>
</View>

        <View style={Styles.buttonContainer}>
          <TouchableOpacity style={Styles.button} onPress={handleOpenLink}>
            <Text style={Styles.buttonText}>Acessar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={Styles.button2} onPress={handleShare}>
            <Text style={Styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
