import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLetter } from '../../services/auth';
import { createLetterPhoto } from '../../services/auth';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../../services/supabase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { generateShareId } from '../../services/generateShareId';
import Toast from 'react-native-toast-message';
import { Animated, Easing } from 'react-native';
import Loading from '../Loading/loading';
import { useTheme } from '../../theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormularioCarta">;

export default function FormularioCarta() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { letterTitle } = route.params as { letterTitle: string };
  const [belovedName, setBelovedName] = useState('');
  const [step, setStep] = useState(1);
  const [compliment, setCompliment] = useState('');
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [specialMessages, setSpecialMessages] = useState('');
  const [timeTogether, setTimeTogether] = useState('');
  const [birthday, setBirthday] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [thingsTheyLike, setThingsTheyLike] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [signo, setSigno] = useState('');
  const [photos, setPhotos] = useState<{ id: number; uri: string; mime?: string; name?: string }[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const styles = Styles(theme);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const totalSteps = 3;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  const BAR_WIDTH = 200; // largura da linha animada em pixels
  const CIRCLE_SIZE = 24;
  const HORIZONTAL_PADDING = 20;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step - 1, // 0, 1, 2
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [step]);



  const showToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Campos obrigatórios',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Tudo certo ✅',
      text2: message,
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (
        !belovedName ||
        !fromName ||
        !toName ||
        !birthday ||
        !timeTogether
      ) {
        showToast("Preencha todos os campos da Etapa 1.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (
        !compliment ||
        !specialMessages ||
        !thingsTheyLike ||
        !favoriteColor ||
        !signo
      ) {
        showToast("Preencha todos os campos da Etapa 2.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (
        photos.length === 0 ||
        !favoriteMovie ||
        !favoriteFood ||
        !templateId
      ) {
        showToast("Preencha todos os campos da Etapa 3.");
        return false;
      }
    }

    return true;
  };

  const handleConfirm = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    setBirthday(iso);
    setShowPicker(false);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("Permissão para acessar a galeria é necessária.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      // asset.mimeType e asset.fileName podem estar undefined em alguns devices
      const mime = asset.mimeType || (asset.uri?.includes(".") ? `image/${asset.uri.split(".").pop()}` : "image/jpeg");
      const name = asset.fileName || `photo_${Date.now()}.${(asset.uri?.split(".").pop() || "jpg")}`;

      console.log("PICKED -> URI:", asset.uri, "MIME:", mime, "NAME:", name);

      const tempId = Date.now();

      setPhotos(prev => [...prev, { id: tempId, uri: asset.uri, mime, name }]);
    } catch (err) {
      console.log("Erro em pickImage:", err);
    }
  };

  const base64ToUint8Array = (base64: string) => {
    const binaryString = globalThis.atob
      ? globalThis.atob(base64)
      : atobPolyfill(base64);

    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  const atobPolyfill = (input: string): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let str = input.replace(/=+$/, "");
    let output = "";
    let bc = 0,
      bs = 0,
      buffer;
    for (let i = 0; (buffer = str.charAt(i++));) {
      buffer = chars.indexOf(buffer);
      if (~buffer) {
        bs = (bs << 6) | buffer;
        if (++bc === 4) {
          output += String.fromCharCode((bs >> 16) & 255);
          output += String.fromCharCode((bs >> 8) & 255);
          output += String.fromCharCode(bs & 255);
          bc = 0;
          bs = 0;
        }
      }
    }
    return output;
  };

  const getFileExtension = (uriOrName: string) => {
    const last = uriOrName.split(".").pop()?.split("?")[0]?.toLowerCase();
    return last || "jpg";
  };

  const normalizeMimeType = (mime?: string, ext?: string) => {
    if (mime) return mime;
    if (!ext) ext = "jpg";
    if (ext === "jpg") ext = "jpeg";
    return `image/${ext}`;
  };

  const uploadImage = async (uri: string, mime?: string, name?: string) => {
    try {
      const ext = getFileExtension(name || uri);
      const mimeType = normalizeMimeType(mime, ext);

      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uint8 = base64ToUint8Array(base64);

      console.log("Bytes gerados:", uint8.length, "mime:", mimeType);

      const { data, error } = await supabase.storage
        .from("letter-photos")
        .upload(uniqueName, uint8, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.log("Supabase upload error:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("letter-photos")
        .getPublicUrl(uniqueName);

      return urlData.publicUrl;

    } catch (err) {
      console.log("Erro uploadImage:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await delay(3000);
      const token = await AsyncStorage.getItem("autToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token) {
        console.error("Token não encontrado. Usuário não está logado.");
        return;
      }

      const shareId = generateShareId(12);
      const publicHost = process.env.EXPO_PUBLIC_WEB_URL || "http://192.168.1.7:3000";
      const fullShareUrl = `${publicHost}/letters/${shareId}`;

      // 1️⃣ Salvar carta
      const response = await createLetter(
        {
          letter_title: letterTitle,
          beloved_name: belovedName,
          birthday,
          favorite_color: favoriteColor,
          compliment,
          from_name: fromName,
          to_name: toName,
          special_messages: specialMessages,
          time_together: timeTogether,
          favorite_movie: favoriteMovie,
          favorite_food: favoriteFood,
          zodiac_sign: signo,
          things_they_like: thingsTheyLike,
          template_id: Number(templateId),
          user_id: userId,
          share_url: shareId,
        },
        token
      );

      const letterId = response.data.id;
      console.log("Carta salva! ID:", letterId);

      // 2️⃣ Salvar fotos
      for (const photo of photos) {
        const uploadedUrl = await uploadImage(photo.uri, photo.mime, photo.name);

        if (!uploadedUrl) {
          console.log("Erro ao enviar foto:", photo.uri);
          continue;
        }

        await createLetterPhoto(
          {
            letter_id: letterId,
            photo_url: uploadedUrl,
          },
          token
        );
      }

      console.log("Fotos enviadas e vinculadas com sucesso!");

      navigation.replace("Conclusao", { shareLink: fullShareUrl, share_url: shareId });

    } catch (err) {
      setLoading(false);
      console.error("Erro ao salvar carta:", err);
    }
  };

  const templateImages: any = {
    1: require("../../assets/template1.png")
  };

  const removePhoto = (id: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };


  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={32} style={{ color: theme.text }} />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.content}>

            <View style={styles.header}>
              <Image
                source={require('../../assets/carta-coracao.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Escreva sua carta!</Text>
            </View>

            <View style={styles.form}>

              {/* INDICADOR */}
              <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                {/* Linha de fundo */}
                <View
                  style={{
                    width: BAR_WIDTH,
                    height: 4,
                    backgroundColor: '#E0E0E0',
                    marginHorizontal: HORIZONTAL_PADDING + CIRCLE_SIZE / 2,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                />

                {/* Linha animada */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: HORIZONTAL_PADDING + CIRCLE_SIZE / 2,
                    height: 4,
                    backgroundColor: '#4CAF50',
                    borderRadius: 2,
                    width: progressAnim.interpolate({
                      inputRange: [0, totalSteps - 1],
                      outputRange: [0, 200],
                    }),
                  }}
                />

                {/* Bolinhas */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: HORIZONTAL_PADDING,
                    marginTop: -15,
                  }}
                >
                  {[1, 2, 3].map((item) => {
                    const isCompleted = step > item;
                    const isCurrent = step === item;

                    return (
                      <View
                        key={item}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: isCompleted
                            ? '#4CAF50'
                            : isCurrent
                              ? '#B41513'
                              : '#FFFFFF',
                          borderWidth: 2,
                          borderColor: isCompleted || isCurrent ? '#FFE7E7' : '#CCCCCC',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: isCompleted || isCurrent ? '#FFFFFF' : '#999',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* ===================== ETAPA 1 ===================== */}
              {step === 1 && (
                <>
                  <Text style={styles.titleinputs}>Nome da (o) amada (o)</Text>
                  <TextInput style={styles.input} value={belovedName} placeholder='Nome da sua amada (o)' onChangeText={setBelovedName} />

                  <Text style={styles.titleinputs}>De:</Text>
                  <TextInput style={styles.input} value={fromName} placeholder='Quem envia a carta?' onChangeText={setFromName} />

                  <Text style={styles.titleinputs}>Para:</Text>
                  <TextInput style={styles.input} value={toName} placeholder='Quem recebera a carta?' onChangeText={setToName} />

                  <Text style={styles.titleinputs}>Data de aniversário</Text>
                  <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center' }]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={{ color: birthday ? '#000' : '#999' }}>
                      {birthday ? birthday.split('-').reverse().join('/') : 'Qual o aniversario dela(e)?'}
                    </Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={showPicker}
                    mode="date"
                    display='spinner'
                    onConfirm={handleConfirm}
                    onCancel={() => setShowPicker(false)}
                    maximumDate={new Date()} // impede datas futuras
                  />

                  <Text style={styles.titleinputs}>Tempo juntos</Text>
                  <TextInput style={styles.input} value={timeTogether} placeholder='Quanto tempo juntos?' onChangeText={setTimeTogether} />
                </>
              )}

              {/* ===================== ETAPA 2 ===================== */}
              {step === 2 && (
                <>
                  <Text style={styles.titleinputs}>Adjetivos para elogiar</Text>
                  <TextInput style={styles.input} value={compliment} placeholder='Escreva elogios' onChangeText={setCompliment} />

                  <Text style={styles.titleinputs}>Mensagens especiais</Text>
                  <TextInput style={styles.input} value={specialMessages} placeholder='Escreva uma mensagem' onChangeText={setSpecialMessages} />

                  <Text style={styles.titleinputs}>Coisas que ela(o) gosta</Text>
                  <TextInput style={styles.input} value={thingsTheyLike} placeholder='Do que ela(e) gosta?' onChangeText={setThingsTheyLike} />

                  <Text style={styles.titleinputs}>Cor preferida</Text>
                  <TextInput style={styles.input} value={favoriteColor} placeholder='Qual a cor preferida dela(e)?' onChangeText={setFavoriteColor} />

                  <Text style={styles.titleinputs}>Signo</Text>
                  <Picker style={[{ backgroundColor: '#ffffff', }]} selectedValue={signo} onValueChange={setSigno}>
                    <Picker.Item label="Selecione o signo" value="" />
                    <Picker.Item label="Áries" value="aries" />
                    <Picker.Item label="Touro" value="touro" />
                    <Picker.Item label="Gêmeos" value="gemeos" />
                    <Picker.Item label="Câncer" value="cancer" />
                    <Picker.Item label="Leão" value="leao" />
                    <Picker.Item label="Virgem" value="virgem" />
                    <Picker.Item label="Libra" value="libra" />
                    <Picker.Item label="Escorpião" value="escorpiao" />
                    <Picker.Item label="Sagitário" value="sagitario" />
                    <Picker.Item label="Capricórnio" value="capricornio" />
                    <Picker.Item label="Aquário" value="aquario" />
                    <Picker.Item label="Peixes" value="peixes" />
                  </Picker>
                </>
              )}

              {/* ===================== ETAPA 3 ===================== */}
              {step === 3 && (
                <>
                  <Text style={styles.titleinputs}>Adicionar fotos</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {photos.map(p => (
                      <View key={p.id} style={styles.photoWrapper}>
                        <Image source={{ uri: p.uri }} style={styles.photoBox} />

                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => removePhoto(p.id)}
                          activeOpacity={0.8}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            size={18}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
                      <Text style={{ fontSize: 40, color: '#B41513' }}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.titleinputs}>Filme preferido</Text>
                  <TextInput style={styles.input} value={favoriteMovie} placeholder='Qual o filme preferido dela(e)?' onChangeText={setFavoriteMovie} />

                  <Text style={styles.titleinputs}>Comida preferida</Text>
                  <TextInput style={styles.input} value={favoriteFood} placeholder='Qual a comida preferida dela(e)?' onChangeText={setFavoriteFood} />

                  <Text style={styles.titleinputs}>Template</Text>
                  <Picker style={[{ backgroundColor: '#ffffff' }]} selectedValue={templateId} onValueChange={setTemplateId}>
                    <Picker.Item label="Selecione o template" value="" />
                    <Picker.Item label="mores" value={1} />
                  </Picker>

                  {templateId !== '' && (
                    <Image source={templateImages[templateId]} style={{ width: 250, height: 250 }} />
                  )}
                </>
              )}

            </View>


            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity style={styles.button} onPress={() => setStep(step - 1)}>
                  <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
              )}

              {step < 3 ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (validateStep(step)) {
                      showSuccessToast(`Etapa ${step} preenchida corretamente`);
                      setStep(step + 1);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (validateStep(3)) {
                      handleSubmit();
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
      {loading && <Loading />}
    </>
  );
}