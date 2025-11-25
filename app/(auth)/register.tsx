import { AuthContext } from "@/contexts/AuthContext";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const context = useContext(AuthContext);

  // Validar longitud de contraseña
  const isPasswordValid = password.length >= 8 || password.length === 0;

  if (context.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.bg} />
      </View>
    );
  }

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener mínimo 8 caracteres");
      return;
    }
    try {
      const success = await context.register(name, email, password);
      if (success) {
        router.replace("/main/onboarding/dealer");
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al registrarse");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            Regístrate ahora
          </Text>
          <Text style={styles.subtitle}>
            Llena los campos y crea una cuenta
          </Text>

          {/* INPUT de nombre */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={COLORS.neutral}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              accessibilityLabel="Nombre input"
              returnKeyType="next"
              autoFocus={true}
            />
          </View>

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
              returnKeyType="next"
            />
          </View>

          {/* INPUT de contraseña */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="**********"
              placeholderTextColor={COLORS.neutral}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessibilityLabel="Password input"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              accessibilityRole="button"
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.neutral}
              />
            </TouchableOpacity>
          </View>

          {/* Mensaje de validación de contraseña */}
          <Text style={[
            styles.passwordHint,
            !isPasswordValid && styles.passwordHintError
          ]}>
            La contraseña debe tener mínimo 8 caracteres.
          </Text>

          {/* BOTÓN DE REGISTRO */}
          <TouchableOpacity
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPress={handleRegister}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            accessibilityRole="button"
            accessibilityLabel="Registrarse"
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Inicia sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40
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
    marginBottom: 32
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
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
  eyeIcon: {
    padding: 8,
    marginRight: -4
  },
  passwordHint: {
    fontSize: 11,
    color: COLORS.neutral,
    marginBottom: 20,
    marginTop: -6
  },
  passwordHintError: {
    color: "#e63946"
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.bg,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
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
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  loginText: {
    fontSize: 13,
    color: COLORS.neutral
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13
  }
});