import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function DealerOnboardingScreen() {
    const [vin, setVin] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [plate, setPlate] = useState("");
    const [mileage, setMileage] = useState("");
    const [includeTrial, setIncludeTrial] = useState(true);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const router = useRouter();

    const handleScanVIN = () => {
        // Aquí iría la lógica para abrir la cámara y escanear VIN
        Alert.alert("Escanear VIN", "Función de cámara para escanear VIN");
    };

    const handleSendInvitation = async () => {
        // Validaciones
        if (!vin || !brand || !model || !year || !plate || !mileage) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        // Aquí iría la lógica para enviar la invitación
        try {
            // Simular envío
            setShowSuccessBanner(true);

            // Ocultar banner después de 3 segundos
            setTimeout(() => {
                setShowSuccessBanner(false);
                // Limpiar formulario
                setVin("");
                setBrand("");
                setModel("");
                setYear("");
                setPlate("");
                setMileage("");
                setIncludeTrial(true);

                // Redirigir al home después de limpiar el formulario
                router.replace("/main/home");
            }, 3000);
        } catch (error) {
            Alert.alert("Error", "No se pudo enviar la invitación");
        }
    };

    return (
        <View style={styles.container}>
            {/* TopBar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Onboarding // Punto de venta</Text>
                <TouchableOpacity onPress={() => router.replace("/main/home")} style={styles.skipButton}>
                    <Text style={styles.skipText}>Saltar</Text>
                </TouchableOpacity>
            </View>

            {/* Success Banner */}
            {showSuccessBanner && (
                <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text style={styles.successText}>Invitación enviada: 1 código enviado</Text>
                </View>
            )}

            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.select({ ios: "padding", android: undefined })}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formCard}>
                        {/* VIN con botón de escanear */}
                        <Text style={styles.label}>VIN (scan)</Text>
                        <View style={styles.vinContainer}>
                            <TextInput
                                style={styles.vinInput}
                                placeholder="Ingresa el VIN"
                                placeholderTextColor={COLORS.neutral}
                                value={vin}
                                onChangeText={setVin}
                                autoCapitalize="characters"
                                maxLength={17}
                            />
                            <TouchableOpacity style={styles.scanButton} onPress={handleScanVIN}>
                                <Ionicons name="camera" size={20} color={COLORS.bg} />
                            </TouchableOpacity>
                        </View>

                        {/* Marca */}
                        <Text style={styles.label}>Marca</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Toyota"
                                placeholderTextColor={COLORS.neutral}
                                value={brand}
                                onChangeText={setBrand}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Modelo */}
                        <Text style={styles.label}>Modelo</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Corolla"
                                placeholderTextColor={COLORS.neutral}
                                value={model}
                                onChangeText={setModel}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Año */}
                        <Text style={styles.label}>Año</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 2024"
                                placeholderTextColor={COLORS.neutral}
                                value={year}
                                onChangeText={setYear}
                                keyboardType="number-pad"
                                maxLength={4}
                            />
                        </View>

                        {/* Matrícula */}
                        <Text style={styles.label}>Matrícula</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: ABC-123"
                                placeholderTextColor={COLORS.neutral}
                                value={plate}
                                onChangeText={setPlate}
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* Kilometraje */}
                        <Text style={styles.label}>Kilometraje actual</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 15000"
                                placeholderTextColor={COLORS.neutral}
                                value={mileage}
                                onChangeText={setMileage}
                                keyboardType="number-pad"
                            />
                        </View>

                        {/* Checkbox Trial */}
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setIncludeTrial(!includeTrial)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, includeTrial && styles.checkboxChecked]}>
                                {includeTrial && <Ionicons name="checkmark" size={16} color="#ffffff" />}
                            </View>
                            <Text style={styles.checkboxLabel}>Incluir plan trial (30 días)</Text>
                        </TouchableOpacity>

                        {/* Botón Enviar */}
                        <TouchableOpacity style={styles.button} onPress={handleSendInvitation}>
                            <Text style={styles.buttonText}>Enviar invitación</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        alignItems: "center",
        justifyContent: "space-between",
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
    skipButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center"
    },
    topBarTitle: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#000000",
        textAlign: "center"
    },
    skipText: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: COLORS.neutral
    },
    successBanner: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
    },
    successText: {
        color: "#ffffff",
        fontSize: 14,
        fontFamily: fonts.semiBold
    },
    content: {
        flex: 1
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        width: "92%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3
    },
    label: {
        fontSize: 14,
        fontFamily: fonts.semiBold,
        color: "#000000",
        marginBottom: 8,
        marginTop: 12
    },
    vinContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    vinInput: {
        flex: 1,
        backgroundColor: COLORS.light,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 15,
        color: "#000000",
        fontFamily: fonts.regular,
        minHeight: 54
    },
    scanButton: {
        backgroundColor: COLORS.light,
        width: 54,
        height: 54,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        backgroundColor: COLORS.light,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        minHeight: 54
    },
    input: {
        fontSize: 15,
        color: "#000000",
        fontFamily: fonts.regular
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 24
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.neutral,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    checkboxChecked: {
        backgroundColor: COLORS.bg,
        borderColor: COLORS.bg
    },
    checkboxLabel: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: "#000000"
    },
    button: {
        backgroundColor: COLORS.bg,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 54,
        shadowColor: COLORS.bg,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: fonts.semiBold,
        letterSpacing: 0.3
    }
});