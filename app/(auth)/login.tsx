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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const context = useContext(AuthContext);

  // Loader durante login
  if (context.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.bg} />
      </View>
    );
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales");
      return;
    }
    try {
      const success = await context.login(email, password);
      if (success) {
        router.push("/main/home");
      } else {
        Alert.alert("Error", "Credenciales inválidas");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Credenciales inválidas");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >

      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Inicia Sesión
        </Text>
        <Text style={styles.subtitle}>
          Ingresa tus datos para iniciar sesión
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
            returnKeyType="next"
            autoFocus={true}
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
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
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

        {/* Botón Olvidaste tu contraseña */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/reset")}
          accessibilityRole="button"
          accessibilityLabel="Olvidaste tu contraseña"
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* BOTÓN DE LOGIN */}
        <TouchableOpacity
          style={[styles.button, isPressed && styles.buttonPressed]}
          onPress={handleLogin}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          accessibilityRole="button"
          accessibilityLabel="Iniciar Sesión"
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.register}>¿No tienes cuenta aún? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
    marginBottom: 32
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: COLORS.light,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    // Sombra sutil para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 2
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000000"
  },
  eyeIcon: {
    padding: 8,
    marginRight: -4
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
    paddingVertical: 4
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: 13
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.bg,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    // Sombra para iOS
    shadowColor: COLORS.bg,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Sombra para Android
    elevation: 4
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24
  },
  register: {
    fontSize: 14,
    color: COLORS.neutral
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14
  }
});