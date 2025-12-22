import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Configuracao">;

export default function Configuracao() {
    const [nomeSalvo, setNomeSalvo] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const loadUserName = async () => {
            const storedName = await AsyncStorage.getItem("userName");
            setNomeSalvo(storedName);
        };

        loadUserName();
    }, []);

    return (
        <SafeAreaView style={Styles.container}>
            <ScrollView style={Styles.content}>
                <TouchableOpacity
                    style={Styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={Styles.gear}>

                        <MaterialCommunityIcons name="arrow-left" size={30} color="#B41513" />
                    </View>
                </TouchableOpacity>
                <Text style={Styles.textconf}>Configurações</Text>
                <View style={Styles.header}>
                    <View style={Styles.profile}>
                        <MaterialCommunityIcons
                            name="account-heart-outline"
                            size={50}
                            color="#B41513"
                        />


                    </View>
                    <View style={Styles.header2}>
                        <Text style={Styles.textheader2}>{nomeSalvo}</Text>
                    </View>

                </View>
                <View style={Styles.boxconfs}>
                    <TouchableOpacity style={Styles.info}>
                        <Text>Permissões</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.info}>
                        <Text>Temas</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}