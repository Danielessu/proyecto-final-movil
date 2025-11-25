// app/main/diagnosis.tsx
import MediaPicker from "@/components/MediaPicker";
import ModalImage from "@/components/ModalImage";
import ModalMediaViewer from "@/components/ModalMediaViewer";
import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { supabase } from "@/utils/supabase"; // Ensure you have the supabase client set up
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function DiagnosisScreen() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<"text" | "photo" | "audio" | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState<any[]>([]);
  const [mediaUri, setMediaUri] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isMediaViewerVisible, setMediaViewerVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const handleTextDiagnosis = async () => {
    if (!textInput.trim()) {
      Alert.alert("Error", "Por favor describe el problema de tu vehículo");
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(async () => {
      const mockResults = [
        {
          id: 1,
          title: "Problemas con el sistema de frenos",
          confidence: 85,
          urgency: "high",
          description: "El ruido al frenar puede indicar desgaste en las pastillas o discos",
          recommendation: "Programar revisión urgente en taller"
        },
        {
          id: 2,
          title: "Desgaste normal de componentes",
          confidence: 60,
          urgency: "medium",
          description: "El ruido podría ser causado por desgaste normal de uso",
          recommendation: "Agendar cita de mantenimiento preventivo"
        }
      ];
      setDiagnosisResults(mockResults);
      await saveDiagnosisToDatabase(textInput, mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const saveDiagnosisToDatabase = async (input: string, results: any[]) => {
    const resp = await supabase.auth.getUser(); // Get the current user response
    const user = resp.data?.user ?? null; // Access user from data safely
    const vehicleId = "your-vehicle-id"; // Replace with actual vehicle ID

    const { error } = await supabase
      .from('diagnostics')
      .insert([
        {
          vehicle_id: vehicleId,
          user_id: user?.id ?? null,
          input: { description: input },
          result: results,
          status: 'done'
        }
      ]);

    if (error) {
      console.error("Error saving diagnosis:", error);
      Alert.alert("Error", "No se pudo guardar el diagnóstico.");
    } else {
      Alert.alert("Éxito", "Diagnóstico guardado correctamente.");
    }
  };

  const handleMediaSelected = (uri: string, type: 'image' | 'video') => {
    setMediaUri(uri);
    setMediaType(type);
    setMediaViewerVisible(true);
  };

  const handlePhotoUpload = () => {
    // Open MediaPicker for photo selection
    setActiveMode("photo");
  };

  const handleAudioRecord = () => {
    Alert.alert("Grabar audio", "Funcionalidad de grabación en desarrollo");
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "#FF5C5C";
      case "medium": return "#FFB020";
      case "low": return "#2DD4BF";
      default: return COLORS.neutral;
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "high": return "Urgente";
      case "medium": return "Moderado";
      case "low": return "Bajo";
      default: return "Desconocido";
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Diagnóstico IA</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.instructionsText}>
            Describe el problema, sube una foto del testigo o graba el ruido extraño para obtener un diagnóstico preliminar
          </Text>
        </View>

        {/* Mode Selector */}
        <Text style={styles.sectionTitle}>Selecciona el método de diagnóstico</Text>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeCard, activeMode === "text" && styles.modeCardActive]}
            onPress={() => {
              setActiveMode("text");
              setDiagnosisResults([]);
            }}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={32}
              color={activeMode === "text" ? COLORS.bg : COLORS.neutral}
            />
            <Text style={[styles.modeTitle, activeMode === "text" && styles.modeTitleActive]}>
              Texto
            </Text>
            <Text style={styles.modeSubtitle}>Describe el problema</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, activeMode === "photo" && styles.modeCardActive]}
            onPress={handlePhotoUpload}
          >
            <Ionicons
              name="camera"
              size={32}
              color={activeMode === "photo" ? COLORS.bg : COLORS.neutral}
            />
            <Text style={[styles.modeTitle, activeMode === "photo" && styles.modeTitleActive]}>
              Foto
            </Text>
            <Text style={styles.modeSubtitle}>Testigo o daño visible</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, activeMode === "audio" && styles.modeCardActive]}
            onPress={() => {
              setActiveMode("audio");
              setDiagnosisResults([]);
            }}
          >
            <Ionicons
              name="mic"
              size={32}
              color={activeMode === "audio" ? COLORS.bg : COLORS.neutral}
            />
            <Text style={[styles.modeTitle, activeMode === "audio" && styles.modeTitleActive]}>
              Audio
            </Text>
            <Text style={styles.modeSubtitle}>Graba el ruido</Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        {activeMode === "text" && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Describe el problema</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Mi auto hace un ruido extraño al frenar..."
                placeholderTextColor={COLORS.neutral}
                value={textInput}
                onChangeText={setTextInput}
                multiline
                numberOfLines={4}
              />
            </View>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleTextDiagnosis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="bulb" size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analizar problema</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeMode === "photo" && (
          <MediaPicker
            chatId="your-chat-id" // Replace with actual chat ID
            onMediaSelected={handleMediaSelected}
          />
        )}

        {activeMode === "audio" && (
          <View style={styles.inputSection}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleAudioRecord}>
              <Ionicons name="mic" size={48} color={COLORS.primary} />
              <Text style={styles.uploadButtonText}>Grabar ruido del vehículo</Text>
              <Text style={styles.uploadButtonSubtext}>Mantén presionado para grabar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color={COLORS.bg} />
            <Text style={styles.analyzingText}>Analizando...</Text>
            <Text style={styles.analyzingSubtext}>Esto puede tomar unos segundos</Text>
          </View>
        )}

        {diagnosisResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Diagnóstico preliminar</Text>
            <View style={styles.disclaimerCard}>
              <Ionicons name="alert-circle" size={20} color="#FFB020" />
              <Text style={styles.disclaimerText}>
                Este es un diagnóstico orientativo. Confirma siempre con un especialista.
              </Text>
            </View>

            {diagnosisResults.map((result, index) => (
              <View key={result.id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitleContainer}>
                    <Text style={styles.resultIndex}>#{index + 1}</Text>
                    <Text style={styles.resultTitle}>{result.title}</Text>
                  </View>
                  <View style={styles.resultBadges}>
                    <View style={styles.confidenceBadge}>
                      <Text style={styles.confidenceText}>{result.confidence}%</Text>
                    </View>
                    <View
                      style={[styles.urgencyBadge, { backgroundColor: `${getUrgencyColor(result.urgency)}20` }]}
                    >
                      <Text style={[styles.urgencyText, { color: getUrgencyColor(result.urgency) }]}>
                        {getUrgencyLabel(result.urgency)}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.resultDescription}>{result.description}</Text>

                <View style={styles.recommendationContainer}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.recommendationText}>{result.recommendation}</Text>
                </View>

                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={styles.resultActionBtn}
                    onPress={() => router.push("/main/booking")}
                  >
                    <Ionicons name="calendar" size={16} color={COLORS.bg} />
                    <Text style={styles.resultActionText}>Agendar cita</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resultActionBtn}>
                    <Ionicons name="videocam" size={16} color={COLORS.bg} />
                    <Text style={styles.resultActionText}>Ver tutorial</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Diagnostics */}
        {diagnosisResults.length === 0 && !isAnalyzing && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Diagnósticos recientes</Text>
            <View style={styles.emptyRecent}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.neutral} />
              <Text style={styles.emptyRecentText}>No tienes diagnósticos previos</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Media Viewer Modal */}
      <ModalMediaViewer
        visible={isMediaViewerVisible}
        onClose={() => setMediaViewerVisible(false)}
        uri={mediaUri}
        type={mediaType || 'image'} // Default to 'image' if type is null
      />

      {/* Image Modal */}
      <ModalImage
        visible={isImageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onImageSelected={(url) => {
          // Handle the image URL as needed
          console.log('Image selected:', url);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 56 : 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000"
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16
  },
  instructionsCard: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.bg,
    marginLeft: 12,
    lineHeight: 18
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000",
    marginBottom: 16
  },
  modeSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent"
  },
  modeCardActive: {
    backgroundColor: `${COLORS.bg}10`,
    borderColor: COLORS.bg
  },
  modeTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: COLORS.neutral,
    marginTop: 8,
    marginBottom: 4
  },
  modeTitleActive: {
    color: COLORS.bg
  },
  modeSubtitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    textAlign: "center"
  },
  inputSection: {
    marginBottom: 24
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginBottom: 12
  },
  textInputContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  textInput: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: "#000000",
    minHeight: 100,
    textAlignVertical: "top"
  },
  analyzeButton: {
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.bg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  analyzeButtonText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#FFFFFF",
    marginLeft: 8
  },
  uploadButton: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed"
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginTop: 16,
    marginBottom: 4
  },
  uploadButtonSubtext: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral
  },
  analyzingContainer: {
    alignItems: "center",
    paddingVertical: 40
  },
  analyzingText: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginTop: 16,
    marginBottom: 4
  },
  analyzingSubtext: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral
  },
  resultsSection: {
    marginTop: 8
  },
  disclaimerCard: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: "#FFB020",
    marginLeft: 8
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
  },
  resultTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8
  },
  resultIndex: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: COLORS.primary,
    marginRight: 8
  },
  resultTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#000000",
    flex: 1
  },
  resultBadges: {
    flexDirection: "row",
    gap: 8
  },
  confidenceBadge: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  confidenceText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: COLORS.bg
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  urgencyText: {
    fontSize: 11,
    fontFamily: fonts.bold
  },
  resultDescription: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    lineHeight: 20,
    marginBottom: 12
  },
  recommendationContainer: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: COLORS.bg,
    marginLeft: 8
  },
  resultActions: {
    flexDirection: "row",
    gap: 8
  },
  resultActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.light,
    paddingVertical: 10,
    borderRadius: 8
  },
  resultActionText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: COLORS.bg,
    marginLeft: 6
  },
  recentSection: {
    marginTop: 24
  },
  emptyRecent: {
    alignItems: "center",
    paddingVertical: 40
  },
  emptyRecentText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginTop: 16
  }
});