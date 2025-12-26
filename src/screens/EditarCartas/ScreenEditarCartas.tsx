import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Share, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLetterById, deleteLetter } from '../../services/auth';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EditarCartas">;

export default function EditarCartas() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { letterId } = route.params as { letterId: number };
    const [letter, setLetter] = useState<any>(null);
    const { theme } = useTheme();

    const styles = Styles(theme);

    const loadLetter = async () => {
    try {
        const token = await AsyncStorage.getItem("autToken");
        if (!token) return;

        const data = await getLetterById(letterId, token);

        // Ajusta estrutura
        setLetter({
            ...data.letter,
            id: data.id,
            photos: data.photos
        });

    } catch (e) {
        console.log("Erro ao carregar a carta:", e);
    }
};


    useEffect(() => {
        loadLetter();
    }, []);

    const handleOpenLink = () => {
        Linking.openURL(`http://192.168.1.7:3000/letters/${letter.share_url}`);
      };

    // 🔗 Compartilhar URL
    const handleShare = async () => {
        if (!letter?.share_url) return;

        const url = `http://192.168.1.7:3000/letters/${letter.share_url}`;

        await Share.share({
            message: `Veja minha carta: ${url}`,
        });
    };

    // 🗑️ Deletar Carta
    const handleDelete = () => {
        Alert.alert(
            "Apagar Carta",
            "Tem certeza que deseja apagar esta carta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    async onPress() {
                        try {
                            const token = await AsyncStorage.getItem("autToken");
                            if (!token) return;

                            await deleteLetter(letterId, token);

                            Alert.alert("Sucesso!", "Carta apagada.");
                            navigation.goBack();
                        } catch (err) {
                            console.log(err);
                            Alert.alert("Erro", "Não foi possível apagar a carta.");
                        }
                    }
                }
            ]
        );
    };

    // 🖼️ Pega template
    const getTemplateImage = () => {
        if (!letter?.template_id) return null;

        switch (letter.template_id) {
            case 1:
                return require("../../../assets/template1.png");
            default:
                return null;
        }
    };

    if (!letter) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ textAlign: "center", marginTop: 40 }}>Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.arrow}>
                        <MaterialCommunityIcons name="arrow-left" size={30} style= {{color: theme.text}} />
                    </View>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/carta-coracao.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Visualizar Carta</Text>
                </View>

                <View style={styles.buttonContainer}>
                    
                    {/* BOTÃO COMPARTILHAR */}
                    <TouchableOpacity style={styles.compartilhar} onPress={handleShare}>
                        <View style={styles.share}>
                            <MaterialCommunityIcons name="share-variant-outline" size={30} color="#B41513" />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.titlemid}>{letter.letter_title}</Text>
                </View>

                {/* IMAGEM DO TEMPLATE */}
                {getTemplateImage() && (
                    <View style={{ alignItems: "center", marginTop: 20, backgroundColor: "#ffffff", height: 200, width: 320, flex: 1, justifyContent: 'center', marginLeft: 20 }}>
                        <Image
                            source={getTemplateImage()}
                            style={{ width: 200, height: 200, resizeMode: "contain" }}
                        />
                    </View>
                )}

                {/* LINK */}
                <View style={styles.boxlink}>
                    <Text style={{ color: theme.text }}>Link da carta:</Text>
                    <Text style={{ color: theme.text }}>
                        {letter.share_url}
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
                                <Text style={styles.buttonText}>Acessar</Text>
                              </TouchableOpacity>

                    {/* Botão Apagar */}
                    <TouchableOpacity style={styles.apagar} onPress={handleDelete}>
                        <View style={styles.trash}>
                            <MaterialCommunityIcons name="trash-can-outline" size={30} color="#B41513" />
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
