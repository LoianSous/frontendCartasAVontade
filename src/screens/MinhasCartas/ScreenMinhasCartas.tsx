import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserLetters } from '../../services/auth'; 
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EditarCartas">;

export default function MinhasCartas() {
    const navigation = useNavigation<NavigationProp>();
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme} = useTheme();

    const styles = Styles(theme);

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
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>

                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/carta-coracao.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Minhas Cartas!</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : letters.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
                        Você ainda não criou nenhuma carta.
                    </Text>
                ) : (
                    letters.map((item) => (
                        <View key={item.id} style={styles.buttonContainer}>
                            <Text style={styles.titlemid}>{item.letter_title || "Sem título"}</Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    navigation.navigate("EditarCartas", { letterId: item.id, shareLink: item.shareLink, share_url: item.share_url,  })
                                }
                            >
                                <Text style={styles.buttonText}>Acessar</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
