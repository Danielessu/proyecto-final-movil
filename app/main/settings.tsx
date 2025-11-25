import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Settings() {
  const row = (icon: any, title: string, subtitle?: string) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.rowTitle}>{title}</Text>
          {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.backButton} />
        <Text style={styles.title}>Ajustes</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Cuenta</Text>
        {row("person", "Perfil", "Edita tu información de usuario")}
        {row("lock-closed", "Seguridad", "Cambiar contraseña, 2FA")}

        <Text style={styles.heading}>Preferencias</Text>
        {row("notifications", "Notificaciones", "Administrar alertas")}
        {row("color-palette", "Apariencia", "Tema y fuentes")}

        <Text style={styles.heading}>Soporte</Text>
        {row("help-circle", "Centro de ayuda", "Preguntas frecuentes y contacto")}
        {row("document-text", "Términos y privacidad", "Ver políticas")}

        <View style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    marginBottom: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#000",
  },
  rowSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginTop: 4,
  },
  signOutBtn: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  signOutText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: COLORS.primary,
  },
});
