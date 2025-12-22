import React, { useState } from 'react';
import { api } from "../../services/api";
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormularioCarta">;

export default function FormularioCarta() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { letterTitle } = route.params as { letterTitle: string };
  const [belovedName, setBelovedName] = useState('');
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

  const handleConfirm = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    setBirthday(iso);
    setShowPicker(false);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão para acessar a galeria é necessária.");
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
      const token = await AsyncStorage.getItem("autToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token) {
        console.error("Token não encontrado. Usuário não está logado.");
        return;
      }

      const shareId = generateShareId(12);
      const publicHost = process.env.EXPO_PUBLIC_WEB_URL || "http://192.168.1.6:3000";
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

      navigation.navigate("Conclusao", { shareLink: fullShareUrl, share_url: shareId });

    } catch (err) {
      console.error("Erro ao salvar carta:", err);
    }
  };

  const templateImages: any = {
    1: require("../../assets/template1.png")
  };


  return (
    <SafeAreaView style={Styles.container}>
      <TouchableOpacity
        style={Styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={32} color="#B41513" />
      </TouchableOpacity>
      <ScrollView>
        <View style={Styles.content}>

          <View style={Styles.header}>
            <Image
              source={require('../../assets/carta-coracao.png')}
              style={Styles.logo}
              resizeMode="contain"
            />
            <Text style={Styles.title}>Escreva sua carta!</Text>
          </View>

          <View style={Styles.form}>
            <Text style={Styles.titleinputs}>Nome da (o) amada (o)</Text>
            <TextInput
              style={Styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={belovedName}
              onChangeText={setBelovedName}
            />
            <Text style={Styles.titleinputs}>Adjetivos para elogiar</Text>
            <TextInput
              style={Styles.input}
              placeholder="Você é... exemplo (bonita)"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={compliment}
              onChangeText={setCompliment}
            />
            <Text style={Styles.titleinputs}>De: </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome de quem vai enviar a carta"
              placeholderTextColor="#999"
              value={fromName}
              onChangeText={setFromName}
            />
            <Text style={Styles.titleinputs}>Para: </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={toName}
              onChangeText={setToName}
            />
            <Text style={Styles.titleinputs}>Mensagens especiais </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={specialMessages}
              onChangeText={setSpecialMessages}
            />
            <Text style={Styles.titleinputs}>Tempo juntos </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={timeTogether}
              onChangeText={setTimeTogether}
            />
            <Text style={Styles.titleinputs}>Adicionar fotos </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
              {/* mapear fotos adicionadas */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {photos.map((p) => (
                  <Image key={p.id} source={{ uri: p.uri }} style={Styles.photoBox} />
                ))}

                <TouchableOpacity style={Styles.photoBox} onPress={pickImage}>
                  <Text style={{ fontSize: 40, color: '#B41513' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={Styles.titleinputs}>Data de aniversário </Text>
            <TouchableOpacity
              style={[Styles.input, { justifyContent: "center" }]}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: birthday ? "#000" : "#999" }}>
                {birthday ? birthday.split("-").reverse().join("/") : "Selecione a data"}
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
            <Text style={Styles.titleinputs}>Cor preferida </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={favoriteColor}
              onChangeText={setFavoriteColor}
            />
            <Text style={Styles.titleinputs}>Filme preferido </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={favoriteMovie}
              onChangeText={setFavoriteMovie}
            />
            <Text style={Styles.titleinputs}>Comida preferida </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={favoriteFood}
              onChangeText={setFavoriteFood}
            />
            <Text style={Styles.titleinputs}>Signo </Text>

            <Picker
              selectedValue={signo}
              onValueChange={(itemValue) => setSigno(itemValue)}
              style={{ backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 }}
            >
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

            <Text style={Styles.titleinputs}>Coisas que ela(o) gosta </Text>
            <TextInput
              style={Styles.input}
              placeholder="Nome da (o) amada (o)"
              placeholderTextColor="#999"
              value={thingsTheyLike}
              onChangeText={setThingsTheyLike}
            />
            <Text style={Styles.titleinputs}>Templates </Text>
            <Picker
              selectedValue={templateId}
              onValueChange={(itemValue) => setTemplateId(itemValue)}
              style={{ backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 }}
            >
              <Picker.Item label="Selecione o template" value="" />
              <Picker.Item label="mores" value={1} />
            </Picker>
            {templateId != "" && (
              <View style={{ alignItems: "center", marginBottom: 20, backgroundColor: "#ffffff", height: 250, }}>
                <Image
                  source={templateImages[templateId]}
                  style={{ width: 250, height: 250, resizeMode: "contain" }}
                />
              </View>
            )}
          </View>

          <View style={Styles.buttonContainer}>
            <TouchableOpacity style={Styles.button} onPress={handleSubmit}>
              <Text style={Styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}