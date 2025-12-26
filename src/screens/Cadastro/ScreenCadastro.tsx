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

  type FieldError = 'usuario' | 'email' | 'password' | 'confirmpassword' | null;

  const [fieldError, setFieldError] = useState<FieldError>(null);

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

  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Ops 😕',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };


  const validateForm = async () => {
    setError("");
    setFieldError(null);
    setLoading(true);

    try {
      // 🔹 Validações locais
      if (!usuario.trim()) {
        setFieldError("usuario");
        throw new Error("O nome é obrigatório");
      }

      if (!email.trim()) {
        setFieldError("email");
        throw new Error("O email é obrigatório");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError("email");
        throw new Error("Formato de email inválido");
      }

      if (!password) {
        setFieldError("password");
        throw new Error("A senha é obrigatória");
      }

      if (password.length < 6) {
        setFieldError("password");
        throw new Error("A senha deve ter no mínimo 6 caracteres");
      }

      if (!confirmpassword) {
        setFieldError("confirmpassword");
        throw new Error("É necessário confirmar a senha");
      }

      if (password !== confirmpassword) {
        setFieldError("confirmpassword");
        throw new Error("As senhas não coincidem");
      }

      // 🔹 Chamada da API
      await registerUser(usuario, usuario, email, password);

      // 🔹 Sucesso
      setShowCodeModal(true);
      showSuccessToast("Enviamos um código para seu email 📧");

    } catch (e: any) {
      const message =
        e.response?.data?.error || e.message || "Erro de conexão com o servidor";

      setError(message);

      // 🔥 Detecta erro vindo do backend
      const lower = message.toLowerCase();
      if (lower.includes("email")) setFieldError("email");
      else if (lower.includes("usuário")) setFieldError("usuario");

      showErrorToast(message);

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
        position: 'top',
      });

      setShowCodeModal(false);
      navigation.replace("ConfirmPassword");

    } catch (e: any) {
      const message =
        e.response?.data?.error || "Código inválido ou expirado";

      setError(message);

      Toast.show({
        type: 'error',
        text1: 'Erro na verificação ❌',
        text2: message,
        position: 'top',
      });

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
                  style={[
                    styles.input,
                    fieldError === "usuario" && styles.inputError
                  ]}
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  value={usuario}
                  onChangeText={(text) => {
                    setUsuario(text);
                    setError("");
                    setFieldError(null);
                  }}
                />

                <Text style={styles.titleinputs}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "email" && styles.inputError
                  ]}
                  placeholder="seuemail@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError("");
                    setFieldError(null);
                  }}
                />

                <Text style={styles.titleinputs}>Senha</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "password" && styles.inputError
                  ]}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                    setFieldError(null);
                  }}
                />

                <Text style={styles.titleinputs}>Confirmar senha</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "confirmpassword" && styles.inputError
                  ]}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmpassword}
                  onChangeText={(text) => {
                    setconfirmPassword(text);
                    setError("");
                    setFieldError(null);
                  }}
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