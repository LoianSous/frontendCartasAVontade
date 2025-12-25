import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { registerUser } from '../../services/auth';
import Loading from '../Loading/loading';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme/ThemeContext';
import { confirmEmailCode } from '../../services/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;

export default function Cadastro() {
  const navigation = useNavigation<NavigationProp>();
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');


  const styles = Styles(theme);

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Tudo certo ✅',
      text2: message,
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const validateForm = async () => {
    setError("");
    setLoading(true);

    try {

      if (!usuario.trim()) {
        setError("O nome é obrigatório");
        return;
      }

      if (!email.trim()) {
        setError("O email é obrigatório");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Formato de email inválido");
        return;
      }

      if (!password) {
        setError("A senha é obrigatória");
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres");
        return;
      }

      if (!confirmpassword) {
        setError("É necessário confirmar a senha");
        return;
      }

      if (password !== confirmpassword) {
        setError("As senhas não coincidem");
        return;
      }

      await registerUser(usuario, usuario, email, password);
      setLoading(false);
      // se deu certo → abre o modal
      setShowCodeModal(true);

      showSuccessToast("Enviamos um código para seu email 📧");

    } catch (e) {
      setError("Erro ao registrar usuário");

    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
  if (!verificationCode.trim()) {
    setError("Digite o código enviado ao email");
    return;
  }

  setLoading(true);
  setError("");

  try {
    await confirmEmailCode(email, verificationCode);

    Toast.show({
      type: 'success',
      text1: 'Email verificado ✅',
      text2: 'Conta criada com sucesso!',
    });

    setShowCodeModal(false);
    navigation.replace("ConfirmPassword");

  } catch (err) {
    setError("Código inválido ou expirado");
  } finally {
    setLoading(false);
  }
};

  return (
    
    <>
    {showCodeModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Verifique seu email</Text>

      <Text style={styles.modalText}>
        Digite o código que enviamos para {email}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de verificação"
        keyboardType="numeric"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={confirmCode}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowCodeModal(false)}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>


          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={32} color="#B41513" />
            </TouchableOpacity>
            <View style={styles.content}>

              <View style={styles.header}>
                <Image
                  source={require('../../assets/carta-coracao.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Crie sua conta!</Text>
              </View>

              <View style={styles.form}>
                <Text style={styles.titleinputs}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={usuario}
                  onChangeText={setUsuario}
                />
                <Text style={styles.titleinputs}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={styles.titleinputs}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <Text style={styles.titleinputs}>Confirmar senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmpassword}
                  onChangeText={setconfirmPassword}
                />

                {error !== '' && <Text style={styles.error}>{error}</Text>}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={validateForm}>
                  <Text style={styles.buttonText}>Cadastrar-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {loading && <Loading />}
    </>
  );
}