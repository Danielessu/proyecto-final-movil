import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const servicesItems = [
    {
        id: 1,
        name: "Cambio de aceite",
        description: "Servicio profesional de cambio de aceite para su motor.",
        price: 850,
        image: require("../../assets/images/aceite.png") // placeholder image
    },
    {
        id: 2,
        name: "Revisión de frenos",
        description: "Inspección y mantenimiento completo de frenos.",
        price: 400,
        image: require("../../assets/images/frenos.png")
    },
    {
        id: 3,
        name: "Alineación y balanceo",
        description: "Alineación precisa y balanceo para mejorar estabilidad.",
        price: 1200,
        image: require("../../assets/images/alineacion.png")
    }
];

export default function Services() {
    const router = useRouter();

    function handleReserve(serviceId: number) {
        // Navigate to booking page passing selected serviceId as param
        router.push({
            pathname: "/main/booking",
            params: { serviceId: serviceId.toString() },
        });
    }

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.greeting}>Servicios</Text>
                <TouchableOpacity onPress={() => router.push("/main/profile")}>
                    <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {servicesItems.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <Image source={item.image} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                        </View>
                        <TouchableOpacity style={styles.reserveButton} onPress={() => handleReserve(item.id)}>
                            <Text style={styles.reserveButtonText}>Reservar</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "ios" ? 56 : 40,
        paddingHorizontal: 20
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    greeting: {
        fontSize: 24,
        fontFamily: fonts.bold,
        color: "#000000"
    },
    scrollContent: {
        paddingBottom: 40
    },
    itemCard: {
        flexDirection: "row",
        backgroundColor: COLORS.light,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: "center"
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: 8,
        marginRight: 16
    },
    itemInfo: {
        flex: 1
    },
    itemTitle: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#000000",
        marginBottom: 4
    },
    itemDescription: {
        fontSize: 12,
        fontFamily: fonts.regular,
        color: COLORS.neutral,
        marginBottom: 8
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: fonts.bold,
        color: COLORS.primary
    },
    reserveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8
    },
    reserveButtonText: {
        color: "#FFFFFF",
        fontFamily: fonts.semiBold,
        fontSize: 14
    }
});
