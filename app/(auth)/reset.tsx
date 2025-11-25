import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    try {
      // Aquí iría tu lógica de reset password
      // await resetPassword(email);
      Alert.alert(
        "Correo enviado",
        "Te hemos enviado un correo con instrucciones para restablecer tu contraseña",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo enviar el correo");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Botón de volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Volver"
      >
        <Ionicons name="chevron-back" size={24} color="#000000" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Restablecer contraseña
        </Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico{"\n"}para recuperar tu contraseña
        </Text>

        {/* INPUT de email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={COLORS.neutral}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email input"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="send"
            onSubmitEditing={handleResetPassword}
            autoFocus={true}
          />
        </View>

        {/* BOTÓN DE ENVIAR */}
        <TouchableOpacity
          style={[styles.button, isPressed && styles.buttonPressed]}
          onPress={handleResetPassword}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          accessibilityRole="button"
          accessibilityLabel="Enviar"
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000000",
    textAlign: "center",
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.neutral,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000000"
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.bg,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.bg,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3
  }
});