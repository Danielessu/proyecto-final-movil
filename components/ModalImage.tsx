import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { decode } from 'base64-arraybuffer';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PreviewProps {
  base64: string,
  uri: string
}

interface ModalImageProps {
  visible: boolean,
  onClose: () => void,
  onImageSelected: (url: string) => void
}

export default function ModalImage({
  visible,
  onClose,
  onImageSelected
}: ModalImageProps) {

  const { user, updateUser } = useContext(AuthContext); // 👈 traemos updateUser también
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [preview, setPreview] = useState<PreviewProps | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  // Tomar foto con la cámara
  const handleTake = async () => {
    try {
      const response = await cameraRef.current?.takePictureAsync({
        quality: 0.5,
        base64: true
      });

      if (response && response.uri && response.base64) {
        setPreview({
          uri: response.uri,
          base64: response.base64
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // Elegir imagen de la galería
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPreview({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64 || "",
      });
    }
  };

  // Subir imagen a Supabase Storage y actualizar perfil
  const handleSaveImageBucket = async () => {
    try {
      if (!user?.id || !preview?.base64) return;
      const folder = user.id;
      const filename = Date.now();
      const filePath = `${folder}/${filename}.jpg`;

      const { error } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, decode(preview.base64), {
          contentType: 'image/jpg',
          upsert: true,
        });

      if (error) {
        console.log("Supabase upload error:", error);
        alert("Error subiendo imagen");
        return;
      }

      // Obtén la URL pública
      const { data: publicUrlData } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData?.publicUrl
        ? `${publicUrlData.publicUrl}?t=${Date.now()}`
        : "";

      // ✅ Actualizar profile con la URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: imageUrl })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error actualizando avatar:", updateError.message);
      } else {
        // ⚡ Actualiza el contexto local (sin recargar)
        await updateUser({ avatar_url: imageUrl });
        onImageSelected(imageUrl || "");
      }

      setPreview(null);
      onClose();

    } catch (error) {
      console.log(error);
      alert("Error subiendo imagen");
    }
  };

  // Cancelar preview y volver a cámara/menú
  const handleCancelPreview = () => {
    setPreview(null);
  };

  return (
    <Modal
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      {
        permission?.granted ?
          <View style={styles.container}>
            {
              preview ?
                <View>
                  <Image
                    source={{ uri: preview.uri }}
                    style={{ width: 300, height: 300, borderRadius: 20, alignSelf: "center", marginTop: 40 }}
                    resizeMode="cover"
                  />
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSaveImageBucket}>
                      <Text style={styles.text}>Guardar imagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleCancelPreview}>
                      <Text style={styles.text}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <>
                  <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                  />
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setFacing(prev => prev == "back" ? "front" : "back")}>
                      <Text style={styles.text}>Voltear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleTake}>
                      <Text style={styles.text}>Tomar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePickImage}>
                      <Text style={styles.text}>Galería</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                      <Text style={styles.text}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </>
            }
          </View>
          :
          <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
            <Button onPress={onClose} title="Cancelar" />
          </View>
      }
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: "#fff"
  },
  camera: {
    flex: 1,
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
