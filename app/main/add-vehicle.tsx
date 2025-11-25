import { DataContext } from "@/contexts/DataContext";
import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddVehicleScreen() {
    const router = useRouter();
    const { addVehicle } = useContext(DataContext) as any;

    // Form state
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [plate, setPlate] = useState("");
    const [km, setKm] = useState("");
    const [status, setStatus] = useState("good");
    const [color, setColor] = useState("");
    const [saving, setSaving] = useState(false);

    const statusOptions = [
        { label: "Buen estado", value: "good" },
        { label: "Requiere atención", value: "warning" },
        { label: "Atención urgente", value: "critical" },
    ];

    async function handleSave() {
        // Basic validation
        if (!brand.trim() || !model.trim() || !year.trim() || !plate.trim() || !km.trim() || !color.trim()) {
            Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
            return;
        }
        const yearNum = Number(year);
        const kmNum = Number(km);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
            Alert.alert("Año inválido", "Por favor ingresa un año válido.");
            return;
        }
        if (isNaN(kmNum) || kmNum < 0) {
            Alert.alert("Kilometraje inválido", "Por favor ingresa un kilometraje válido.");
            return;
        }

        // simple hex color validation (optional)
        const colorVal = color.trim();
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(colorVal)) {
            Alert.alert("Color inválido", "Usa formato hexadecimal, p.ej. #FF0000");
            return;
        }

        if (typeof addVehicle !== "function") {
            Alert.alert("Configuración", "Función de guardado no disponible. Intenta más tarde.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                make: brand.trim(),
                model: model.trim(),
                year: yearNum,
                plate: plate.trim(),
                odometer: kmNum,
                color: colorVal,
                status, // intenta guardar directamente en la tabla si existe la columna
                meta: { createdFrom: "mobile" }
            };

            const res = await addVehicle(payload);

            if (!res?.ok) {
                console.error("addVehicle error:", res?.error ?? res);
                Alert.alert("Error", "No se pudo guardar el vehículo. Intenta nuevamente.");
                setSaving(false);
                return;
            }

            Alert.alert("Éxito", "Vehículo guardado correctamente.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (err) {
            console.error("handleSave exception:", err);
            Alert.alert("Error", "Ocurrió un error inesperado.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Añadir Vehículo</Text>

            <Text style={styles.label}>Marca</Text>
            <TextInput
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                placeholder="Ej. Toyota"
                placeholderTextColor={COLORS.neutral}
            />

            <Text style={styles.label}>Modelo</Text>
            <TextInput
                style={styles.input}
                value={model}
                onChangeText={setModel}
                placeholder="Ej. Corolla"
                placeholderTextColor={COLORS.neutral}
            />

            <Text style={styles.label}>Año</Text>
            <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder="Ej. 2020"
                placeholderTextColor={COLORS.neutral}
                keyboardType="numeric"
                maxLength={4}
            />

            <Text style={styles.label}>Placa</Text>
            <TextInput
                style={styles.input}
                value={plate}
                onChangeText={setPlate}
                placeholder="Ej. ABC123"
                placeholderTextColor={COLORS.neutral}
            />

            <Text style={styles.label}>Kilometraje (km)</Text>
            <TextInput
                style={styles.input}
                value={km}
                onChangeText={setKm}
                placeholder="Ej. 50000"
                placeholderTextColor={COLORS.neutral}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Estado</Text>
            <View style={styles.statusOptionsContainer}>
                {statusOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.statusOption,
                            status === option.value && {
                                backgroundColor: COLORS.primary,
                            },
                        ]}
                        onPress={() => setStatus(option.value)}
                    >
                        <Text
                            style={[
                                styles.statusOptionText,
                                status === option.value && { color: "#fff" },
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="Ej. #FF0000"
                placeholderTextColor={COLORS.neutral}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Guardar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 40,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontFamily: fonts.bold,
        color: "#000",
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#333",
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderColor: COLORS.neutral,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        fontFamily: fonts.regular,
        color: "#000",
    },
    statusOptionsContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    statusOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginRight: 12,
        alignItems: "center",
    },
    statusOptionText: {
        fontSize: 14,
        fontFamily: fonts.semiBold,
        color: COLORS.primary,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        height: 48,
        borderRadius: 12,
        borderColor: COLORS.primary,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButtonText: {
        color: COLORS.primary,
        fontFamily: fonts.semiBold,
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        marginLeft: 10,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontFamily: fonts.semiBold,
        fontSize: 16,
    },
});
