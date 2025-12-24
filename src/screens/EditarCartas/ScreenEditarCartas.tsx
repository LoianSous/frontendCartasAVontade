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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EditarCartas">;

export default function EditarCartas() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { letterId } = route.params as { letterId: number };
    const [letter, setLetter] = useState<any>(null);

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
        Linking.openURL(`http://192.168.1.4:3000/letters/${letter.share_url}`);
      };

    // 🔗 Compartilhar URL
    const handleShare = async () => {
        if (!letter?.share_url) return;

        const url = `http://192.168.1.4:3000/letters/${letter.share_url}`;

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
                return require("../../assets/template1.png");
            default:
                return null;
        }
    };

    if (!letter) {
        return (
            <SafeAreaView style={Styles.container}>
                <Text style={{ textAlign: "center", marginTop: 40 }}>Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={Styles.container}>
            <ScrollView style={Styles.content}>

                <TouchableOpacity
                    style={Styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={Styles.arrow}>
                        <MaterialCommunityIcons name="arrow-left" size={30} color="#B41513" />
                    </View>
                </TouchableOpacity>

                <View style={Styles.header}>
                    <Image
                        source={require('../../assets/carta-coracao.png')}
                        style={Styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={Styles.title}>Editar Carta</Text>
                </View>

                <View style={Styles.buttonContainer}>
                    
                    {/* BOTÃO COMPARTILHAR */}
                    <TouchableOpacity style={Styles.compartilhar} onPress={handleShare}>
                        <View style={Styles.share}>
                            <MaterialCommunityIcons name="share-variant-outline" size={30} color="#B41513" />
                        </View>
                    </TouchableOpacity>

                    <Text style={Styles.titlemid}>{letter.letter_title}</Text>
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
                <View style={Styles.boxlink}>
                    <Text>Link da carta:</Text>
                    <Text style={{ color: "#B41513" }}>
                        {letter.share_url}
                    </Text>

                    <TouchableOpacity style={Styles.button} onPress={handleOpenLink}>
                                <Text style={Styles.buttonText}>Acessar</Text>
                              </TouchableOpacity>

                    {/* Botão Apagar */}
                    <TouchableOpacity style={Styles.apagar} onPress={handleDelete}>
                        <View style={Styles.trash}>
                            <MaterialCommunityIcons name="trash-can-outline" size={30} color="#B41513" />
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
