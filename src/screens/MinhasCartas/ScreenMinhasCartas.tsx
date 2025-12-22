import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserLetters } from '../../services/auth'; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EditarCartas">;

export default function MinhasCartas() {
    const navigation = useNavigation<NavigationProp>();
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLetters = async () => {
        try {
            const token = await AsyncStorage.getItem("autToken");

            if (!token) {
                console.log("Nenhum token encontrado.");
                setLoading(false);
                return;
            }

            const data = await getUserLetters(token);
            setLetters(data);
        } catch (e) {
            console.log("Erro ao carregar cartas:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLetters();
    }, []);

    // ✅ Atualiza sempre que a tela voltar ao foco
    useFocusEffect(
        useCallback(() => {
            loadLetters();
        }, [])
    );

    return (
        <SafeAreaView style={Styles.container}>
            <ScrollView style={Styles.content}>

                <View style={Styles.header}>
                    <Image
                        source={require('../../assets/carta-coracao.png')}
                        style={Styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={Styles.title}>Minhas Cartas!</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : letters.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
                        Você ainda não criou nenhuma carta.
                    </Text>
                ) : (
                    letters.map((item) => (
                        <View key={item.id} style={Styles.buttonContainer}>
                            <Text style={Styles.titlemid}>{item.letter_title || "Sem título"}</Text>

                            <TouchableOpacity
                                style={Styles.button}
                                onPress={() =>
                                    navigation.navigate("EditarCartas", { letterId: item.id })
                                }
                            >
                                <Text style={Styles.buttonText}>Acessar</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
