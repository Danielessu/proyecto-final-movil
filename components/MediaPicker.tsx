import { AuthContext } from "@/contexts/AuthContext";
import { DataContext } from "@/contexts/DataContext";
import { AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface MediaPickerProps {
  chatId: string; // obligatorio
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  onMediaSelected?: (uri: string, type: "image" | "video") => void; // New prop for handling selected media
}

interface Preview {
  uri: string;
  type: "image" | "video";
}

export default function MediaPicker({ chatId, onUploadStart, onUploadEnd, onMediaSelected }: MediaPickerProps) {
  const { user } = useContext(AuthContext);
  const { sendMessage } = useContext(DataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Pedir permisos al montar
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") console.log("Permisos de galería no concedidos");
      }
    })();
  }, []);

  // Tomar foto con la cámara
  const handleTake = async () => {
    try {
      const response = await cameraRef.current?.takePictureAsync({
        quality: 0.5,
      });

      if (response && response.uri) {
        setPreview({
          uri: response.uri,
          type: "image",
        });
        onMediaSelected?.(response.uri, "image"); // Notify parent component
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
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      // Limitar tamaño máximo: 50MB
      if (asset.fileSize && asset.fileSize > 50 * 1024 * 1024) {
        Alert.alert("Archivo demasiado grande", "Selecciona uno más pequeño.");
        return;
      }
      setPreview({
        uri: asset.uri,
        type: "image",
      });
      onMediaSelected?.(asset.uri, "image"); // Notify parent component
    }
  };

  // Elegir video de la galería
  const handlePickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      // Limitar tamaño máximo: 200MB para videos
      if (asset.fileSize && asset.fileSize > 200 * 1024 * 1024) {
        Alert.alert("Video demasiado grande", "Selecciona un video de menos de 200MB.");
        return;
      }
      setPreview({
        uri: asset.uri,
        type: "video",
      });
      onMediaSelected?.(asset.uri, "video"); // Notify parent component
    }
  };

  // Enviar media
  const handleSend = async () => {
    if (!preview || !user || !chatId) return;

    try {
      setLoading(true);
      onUploadStart?.();

      await sendMessage(chatId, user.id, "", preview.uri, preview.type);

      setPreview(null);
      setModalVisible(false);
    } catch (error) {
      console.log("Error sending media:", error);
      Alert.alert("Error", "Error al enviar archivo");
    } finally {
      setLoading(false);
      onUploadEnd?.();
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setPreview(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="paper-clip" size={28} color="#4a90e2" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        {permission?.granted ? (
          <View style={styles.modalContainer}>
            {preview ? (
              <View style={styles.previewContainer}>
                {preview.type === "image" ? (
                  <Image source={{ uri: preview.uri }} style={styles.previewImage} />
                ) : (
                  <VideoPreview uri={preview.uri} />
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handleCancelPreview}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => setFacing(prev => prev === "back" ? "front" : "back")}>
                    <Text style={styles.buttonText}>Voltear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handleTake}>
                    <Text style={styles.buttonText}>Tomar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handlePickImage}>
                    <Text style={styles.buttonText}>Galería imagen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handlePickVideo}>
                    <Text style={styles.buttonText}>Galería video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.modalContainer}>
            <Text style={styles.message}>Necesitamos permisos para la cámara</Text>
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Conceder permiso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

// Preview ligero de video
function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });
  return <VideoView style={styles.previewVideo} player={player} allowsFullscreen />;
}

const styles = StyleSheet.create({
  container: { marginRight: 10, alignItems: "center" },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#e6f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 40,
  },
  previewContainer: {
    alignItems: "center",
  },
  previewImage: { width: 300, height: 300, borderRadius: 20, marginTop: 40 },
  previewVideo: { width: 300, height: 250, borderRadius: 20, marginTop: 40 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "#fff",
    fontSize: 16,
  },
});
