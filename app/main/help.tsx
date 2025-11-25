import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Help() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>

                <Text style={styles.title}>Ayuda</Text>

                {/* placeholder para balancear el top bar */}
                <View style={styles.backButton} />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>¿Necesitas ayuda?</Text>
                <Text style={styles.paragraph}>
                    Bienvenido a la sección de ayuda de AutoCare. Aquí encontrarás respuestas a las preguntas más frecuentes sobre el uso de la aplicación y cómo gestionar tus vehículos, citas y gastos.
                </Text>

                <Text style={styles.subheading}>Preguntas frecuentes</Text>

                <View style={styles.faqItem}>
                    <Text style={styles.question}>¿Cómo añado un nuevo vehículo?</Text>
                    <Text style={styles.answer}>
                        Para añadir un vehículo, ve a la sección "Vehículos" y pulsa el botón "Añadir". Completa los datos requeridos y guarda.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.question}>¿Cómo solicito una cita?</Text>
                    <Text style={styles.answer}>
                        En la sección "Solicitar cita" puedes elegir el vehículo, fecha y servicio que necesitas. Luego confirma para reservar.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.question}>¿Puedo controlar los gastos de mantenimiento?</Text>
                    <Text style={styles.answer}>
                        Sí, en la sección "Control gastos" puedes añadir y revisar todos los gastos asociados a tus vehículos.
                    </Text>
                </View>

                <Text style={styles.paragraph}>
                    Si tienes alguna otra pregunta o necesitas asistencia personalizada, por favor contáctanos a través de nuestro correo de soporte o en la comunidad de usuarios en nuestra web.
                </Text>
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
        fontSize: 20,
        fontFamily: fonts.bold,
        color: COLORS.primary,
        marginBottom: 12,
    },
    subheading: {
        fontSize: 18,
        fontFamily: fonts.semiBold,
        color: COLORS.primary,
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: COLORS.neutral,
        lineHeight: 20,
        marginBottom: 12,
    },
    faqItem: {
        marginBottom: 16,
    },
    question: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#000000",
        marginBottom: 6,
    },
    answer: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: COLORS.neutral,
        lineHeight: 20,
    },
});
