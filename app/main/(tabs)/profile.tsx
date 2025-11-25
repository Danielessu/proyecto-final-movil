// app/main/profile.tsx
import { AuthContext } from "@/contexts/AuthContext";
import { DataContext } from "@/contexts/DataContext";
import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function Profile() {
    const { vehicles, appointments, expenses } = useContext(DataContext);
    const router = useRouter();
    const { user, updateUser, logout } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: user?.name || "",
        username: user?.username || "",
        bio: user?.bio || "",
        phone: user?.phone || "",
        gender: user?.gender || ""
    });

    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [genderPickerOpen, setGenderPickerOpen] = useState(false);

    useEffect(() => {
        setForm({
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
            phone: user?.phone || "",
            gender: user?.gender || ""
        });
    }, [user]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const success = await updateUser(form);
            if (success) {
                Alert.alert("Éxito", "Perfil actualizado correctamente");
                setEditMode(false);
            } else {
                Alert.alert("Error", "No se pudo actualizar el perfil");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/(auth)/login");
                    }
                }
            ]
        );
    };

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.bg} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Mi Perfil</Text>
                <TouchableOpacity
                    onPress={() => setEditMode(!editMode)}
                    style={styles.editButton}
                >
                    <Ionicons
                        name={editMode ? "close" : "create-outline"}
                        size={24}
                        color={COLORS.bg}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                user?.avatar_url
                                    ? { uri: user.avatar_url }
                                    : require("../../../assets/images/profile.png")
                            }
                            style={styles.avatar}
                        />
                        {editMode && (
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
                    <Text style={styles.userEmail}>{user?.email || ""}</Text>
                </View>

                {/* Edit Form */}
                {editMode ? (
                    <View style={styles.formSection}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nombre completo</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.neutral} />
                                <TextInput
                                    style={styles.input}
                                    value={form.name}
                                    onChangeText={(text) => handleChange("name", text)}
                                    placeholder="Tu nombre"
                                    placeholderTextColor={COLORS.neutral}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nombre de usuario</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="at-outline" size={20} color={COLORS.neutral} />
                                <TextInput
                                    style={styles.input}
                                    value={form.username}
                                    onChangeText={(text) => handleChange("username", text)}
                                    placeholder="Nombre de usuario"
                                    placeholderTextColor={COLORS.neutral}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Bio</Text>
                            <View style={[styles.inputContainer, { minHeight: 80 }]}>
                                <Ionicons name="document-text-outline" size={20} color={COLORS.neutral} style={{ alignSelf: "flex-start", marginTop: 12 }} />
                                <TextInput
                                    style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
                                    value={form.bio}
                                    onChangeText={(text) => handleChange("bio", text)}
                                    placeholder="Cuéntanos sobre ti"
                                    placeholderTextColor={COLORS.neutral}
                                    multiline
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Teléfono</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color={COLORS.neutral} />
                                <TextInput
                                    style={styles.input}
                                    value={form.phone}
                                    onChangeText={(text) => handleChange("phone", text)}
                                    placeholder="Número de teléfono"
                                    placeholderTextColor={COLORS.neutral}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Género</Text>
                            <TouchableOpacity
                                style={styles.inputContainer}
                                onPress={() => setGenderPickerOpen(!genderPickerOpen)}
                            >
                                <Ionicons name="male-female-outline" size={20} color={COLORS.neutral} />
                                <Text style={[styles.input, { color: form.gender ? "#000000" : COLORS.neutral }]}>
                                    {form.gender || "Seleccionar género"}
                                </Text>
                                <Ionicons
                                    name={genderPickerOpen ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={COLORS.neutral}
                                />
                            </TouchableOpacity>

                            {genderPickerOpen && (
                                <View style={styles.picker}>
                                    {["Masculino", "Femenino", "Otro"].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.pickerOption}
                                            onPress={() => {
                                                handleChange("gender", option);
                                                setGenderPickerOpen(false);
                                            }}
                                        >
                                            <Text style={styles.pickerOptionText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                    <Text style={styles.saveButtonText}>Guardar cambios</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.infoSection}>
                        {/* Stats Cards */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                            <Ionicons name="car" size={28} color={COLORS.bg} />
                            <Text style={styles.statValue}>{vehicles.length}</Text>
                            <Text style={styles.statLabel}>Vehículos</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="calendar" size={28} color={COLORS.primary} />
                            <Text style={styles.statValue}>{appointments.length}</Text>
                            <Text style={styles.statLabel}>Citas</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="receipt" size={28} color="#FFB020" />
                            <Text style={styles.statValue}>${expenses.reduce((acc, expense) => acc + expense.amount, 0)}</Text>
                            <Text style={styles.statLabel}>Gastos</Text>
                        </View>
                    </View>

                        {/* Menu Options */}
                        <View style={styles.menuSection}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/main/vehicles")}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIcon, { backgroundColor: "rgba(39, 76, 119, 0.1)" }]}>
                                        <Ionicons name="car-sport" size={22} color={COLORS.bg} />
                                    </View>
                                    <Text style={styles.menuItemText}>Mis vehículos</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/main/appointments")}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIcon, { backgroundColor: "rgba(96, 150, 186, 0.1)" }]}>
                                        <Ionicons name="calendar" size={22} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.menuItemText}>Mis citas</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/main/expenses")}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIcon, { backgroundColor: "rgba(255, 176, 32, 0.1)" }]}>
                                        <Ionicons name="wallet" size={22} color="#FFB020" />
                                    </View>
                                    <Text style={styles.menuItemText}>Control de gastos</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/main/settings")}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIcon, { backgroundColor: "rgba(139, 140, 137, 0.1)" }]}>
                                        <Ionicons name="settings" size={22} color={COLORS.neutral} />
                                    </View>
                                    <Text style={styles.menuItemText}>Configuración</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => router.push("/main/help")}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIcon, { backgroundColor: "rgba(163, 206, 241, 0.1)" }]}>
                                        <Ionicons name="help-circle" size={22} color={COLORS.accent} />
                                    </View>
                                    <Text style={styles.menuItemText}>Ayuda y soporte</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} />
                            </TouchableOpacity>
                        </View>

                        {/* Logout Button */}
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#FF5C5C" />
                            <Text style={styles.logoutText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    topBarTitle: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: "#000000"
    },
    editButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center"
    },
    scrollContent: {
        paddingBottom: 40
    },
    avatarSection: {
        alignItems: "center",
        paddingVertical: 32,
        backgroundColor: "#FFFFFF"
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.light
    },
    cameraButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.bg,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFFFFF"
    },
    userName: {
        fontSize: 22,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 4
    },
    userEmail: {
        fontSize: 14,
        fontFamily: fonts.regular,
        color: COLORS.neutral
    },
    formSection: {
        paddingHorizontal: 20,
        paddingTop: 8
    },
    formGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontFamily: fonts.semiBold,
        color: "#000000",
        marginBottom: 8
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.light,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 54
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: fonts.regular,
        color: "#000000",
        marginLeft: 12
    },
    picker: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden"
    },
    pickerOption: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light
    },
    pickerOptionText: {
        fontSize: 15,
        fontFamily: fonts.regular,
        color: "#000000"
    },
    saveButton: {
        flexDirection: "row",
        backgroundColor: COLORS.bg,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        shadowColor: COLORS.bg,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#FFFFFF",
        marginLeft: 8
    },
    infoSection: {
        paddingHorizontal: 20,
        paddingTop: 8
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2
    },
    statValue: {
        fontSize: 20,
        fontFamily: fonts.bold,
        color: "#000000",
        marginTop: 8,
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        fontFamily: fonts.regular,
        color: COLORS.neutral
    },
    menuSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    menuItemText: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#000000"
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        backgroundColor: "rgba(255, 92, 92, 0.1)",
        borderRadius: 12
    },
    logoutText: {
        fontSize: 15,
        fontFamily: fonts.semiBold,
        color: "#FF5C5C",
        marginLeft: 8
    }
});