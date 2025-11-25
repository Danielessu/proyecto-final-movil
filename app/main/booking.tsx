import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { fonts } from "../../themes/fonts";
import { COLORS } from "../../themes/palette";
import { supabase } from "../../utils/supabase";

/**
 * Servicios locales (mismo contenido que tengas en services.tsx).
 * Si la consulta a Supabase no devuelve registros, se usarán estos.
 */
const localServices = [
    {
        id: "local-1",
        code: "OIL_CHANGE",
        name: "Cambio de aceite",
        description: "Servicio profesional de cambio de aceite para su motor.",
        price: 850,
        duration: 30, // minutos
    },
    {
        id: "local-2",
        code: "BRAKE_CHECK",
        name: "Revisión de frenos",
        description: "Inspección y mantenimiento completo de frenos.",
        price: 400,
        duration: 45,
    },
    {
        id: "local-3",
        code: "ALIGNMENT",
        name: "Alineación y balanceo",
        description: "Alineación precisa y balanceo para mejorar estabilidad.",
        price: 1200,
        duration: 60,
    },
];

export default function BookingScreen() {
    const router = useRouter();
    const { user } = useContext(AuthContext);

    // Form state
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [saving, setSaving] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

    // Optional preselect service via param (id or code)
    const params = useLocalSearchParams();
    const serviceParam = params?.serviceId ? String((params as any).serviceId) : undefined;
    const [selectedService, setSelectedService] = useState<string | null>(serviceParam || null);

    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        async function fetchVehicles() {
            setLoadingVehicles(true);
            try {
                let query: any = supabase
                    .from("vehicles")
                    .select("id,make,model,plate,owner_id")
                    .order("created_at", { ascending: false });

                if (user?.id) query = query.eq("owner_id", user.id);

                const { data, error } = await query;
                if (error) {
                    console.error("Error fetching vehicles:", error);
                    setVehicles([]);
                } else {
                    const list = (data || []) as any[];
                    setVehicles(list);
                    if (list.length > 0 && !selectedVehicle) {
                        setSelectedVehicle(String(list[0].id));
                    }
                }
            } catch (err) {
                console.error("fetchVehicles exception:", err);
            } finally {
                setLoadingVehicles(false);
            }
        }

        async function fetchServices() {
            setLoadingServices(true);
            try {
                const { data, error } = await supabase
                    .from("services")
                    .select("id,code,title,est_price,est_duration_minutes,description")
                    .order("title", { ascending: true });

                if (error) {
                    console.error("Error fetching services:", error);
                    setServices(localServices);
                } else {
                    const servicesData = (data || []).map((s: any) => ({
                        id: s.id,
                        code: s.code,
                        name: s.title,
                        price: s.est_price,
                        duration: s.est_duration_minutes,
                        description: s.description,
                    }));

                    // fallback a servicios locales si la tabla está vacía
                    if (!servicesData || servicesData.length === 0) {
                        setServices(localServices);
                        if (!selectedService && localServices.length > 0) setSelectedService(String(localServices[0].id));
                    } else {
                        setServices(servicesData);
                        // preselect by param (acepta id o code) o primer servicio
                        if (serviceParam) {
                            const foundById = servicesData.find((s: any) => String(s.id) === serviceParam);
                            const foundByCode = servicesData.find((s: any) => String(s.code) === serviceParam);
                            const chosen = foundById ?? foundByCode ?? null;
                            if (chosen) setSelectedService(String(chosen.id));
                        } else if (servicesData.length > 0 && !selectedService) {
                            setSelectedService(String(servicesData[0].id));
                        }
                    }
                }
            } catch (err) {
                console.error("fetchServices exception:", err);
                setServices(localServices);
                if (!selectedService && localServices.length > 0) setSelectedService(String(localServices[0].id));
            } finally {
                setLoadingServices(false);
            }
        }

        fetchVehicles();
        fetchServices();
    }, [user, serviceParam]);

    function onChangeDate(event: any, selectedDate?: Date) {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        if (currentDate) setDate(currentDate);
    }

    async function handleSave() {
        if (!selectedService) {
            Alert.alert("Servicio no seleccionado", "Por favor selecciona un servicio.");
            return;
        }
        if (!date || date.getTime() < Date.now()) {
            Alert.alert("Fecha inválida", "Por favor selecciona una fecha y hora futura.");
            return;
        }
        if (!user) {
            Alert.alert("Usuario no autenticado", "Por favor inicia sesión para solicitar una cita.");
            return;
        }

        setSaving(true);
        try {
            const svc = services.find((s) => String(s.id) === String(selectedService));
            let scheduled_to: string | null = null;
            if (svc && svc.duration && !isNaN(Number(svc.duration))) {
                const ms = Number(svc.duration) * 60 * 1000;
                scheduled_to = new Date(date.getTime() + ms).toISOString();
            }

            const newBooking = {
                vehicle_id: selectedVehicle ?? null,
                service_id: selectedService,
                user_id: user.id,
                scheduled_from: date.toISOString(),
                scheduled_to,
                notes,
                status: "pending",
            };

            const { data, error } = await supabase
                .from("appointments")
                .insert([newBooking])
                .select()
                .single();

            if (error) {
                Alert.alert("Error", "No se pudo guardar la cita. Intenta nuevamente.");
                console.error("insert appointment error:", error);
                return;
            }

            Alert.alert("Éxito", "Cita creada correctamente.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (err) {
            console.error("handleSave exception:", err);
            Alert.alert("Error", "Ocurrió un error al crear la cita.");
        } finally {
            setSaving(false);
        }
    }

    const renderVehicleItem = ({ item }: { item: any }) => {
        const isSelected = String(item.id) === selectedVehicle;
        return (
            <TouchableOpacity
                style={[styles.selectOption, isSelected && styles.selectOptionSelected]}
                onPress={() => setSelectedVehicle(String(item.id))}
            >
                <Text style={[styles.selectOptionText, isSelected && styles.selectOptionTextSelected]}>
                    {item.make ?? item.brand} {item.model ?? ""} {item.plate ? `· ${item.plate}` : ""}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderServiceItem = ({ item }: { item: any }) => {
        const isSelected = String(item.id) === selectedService;
        return (
            <TouchableOpacity
                style={[
                    styles.selectOption,
                    isSelected && styles.selectOptionSelected,
                    { minWidth: 160 },
                ]}
                onPress={() => setSelectedService(String(item.id))}
            >
                <Text
                    style={[
                        styles.selectOptionText,
                        isSelected && styles.selectOptionTextSelected,
                        { fontSize: 15 },
                    ]}
                >
                    {item.name}
                </Text>

                {item.description ? (
                    <Text style={isSelected ? styles.serviceDescSelected : styles.serviceDesc}>
                        {item.description}
                    </Text>
                ) : null}

                {item.price !== undefined && item.price !== null ? (
                    <Text style={isSelected ? styles.priceSelected : styles.price}>
                        Precio: {item.price}
                    </Text>
                ) : null}

                {item.duration ? (
                    <Text style={isSelected ? styles.durationSelected : styles.duration}>
                        Duración: {item.duration} min
                    </Text>
                ) : null}
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Solicitar Cita</Text>

            <Text style={styles.label}>Selecciona tu vehículo</Text>
            <View style={styles.selectContainer}>
                {loadingVehicles ? <ActivityIndicator /> : null}
                {vehicles.length === 0 && !loadingVehicles && <Text style={styles.placeholder}>No tienes vehículos registrados</Text>}
                <FlatList
                    horizontal
                    data={vehicles}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderVehicleItem}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <Text style={styles.label}>Selecciona el servicio</Text>
            <View style={styles.selectContainer}>
                {loadingServices ? <ActivityIndicator /> : null}
                {services.length === 0 && !loadingServices && <Text style={styles.placeholder}>No hay servicios disponibles</Text>}
                <FlatList
                    horizontal
                    data={services}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderServiceItem}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <Text style={styles.label}>Selecciona la fecha y hora</Text>
            <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.datePickerText}>{date ? date.toLocaleString() : ""}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    minimumDate={new Date()}
                    onChange={onChangeDate}
                />
            )}

            <Text style={styles.label}>Notas adicionales (opcional)</Text>
            <TextInput
                style={styles.textArea}
                value={notes}
                onChangeText={setNotes}
                placeholder="Ej. Información extra para el taller"
                placeholderTextColor={COLORS.neutral}
                multiline
                numberOfLines={4}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={saving}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Solicitar</Text>}
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
    selectContainer: {
        marginBottom: 16,
    },
    selectOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginRight: 12,
        backgroundColor: "#fff",
    },
    selectOptionSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    selectOptionText: {
        fontSize: 14,
        fontFamily: fonts.semiBold,
        color: COLORS.primary,
    },
    selectOptionTextSelected: {
        color: "#fff",
    },
    serviceDesc: {
        color: COLORS.neutral,
        marginTop: 6,
        fontFamily: fonts.regular,
        fontSize: 13,
    },
    serviceDescSelected: {
        color: "#fff",
        marginTop: 6,
        fontFamily: fonts.regular,
        fontSize: 13,
        opacity: 0.95,
    },
    price: {
        color: COLORS.primary,
        marginTop: 8,
        fontFamily: fonts.semiBold,
    },
    priceSelected: {
        color: "#fff",
        marginTop: 8,
        fontFamily: fonts.semiBold,
    },
    duration: {
        color: COLORS.neutral,
        fontFamily: fonts.regular,
    },
    durationSelected: {
        color: "#fff",
        fontFamily: fonts.regular,
    },
    placeholder: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: COLORS.neutral,
        marginBottom: 12,
    },
    datePickerButton: {
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.neutral,
        marginBottom: 16,
    },
    datePickerText: {
        fontSize: 16,
        fontFamily: fonts.regular,
        color: "#000",
    },
    textArea: {
        height: 100,
        borderColor: COLORS.neutral,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        fontSize: 16,
        fontFamily: fonts.regular,
        color: "#000",
        marginBottom: 24,
        textAlignVertical: "top",
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
