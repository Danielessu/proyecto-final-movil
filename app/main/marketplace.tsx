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

const marketplaceItems = [
    {
        id: 1,
        title: "Aceite para motor",
        description: "Aceite sintético de alta calidad para motor.",
        price: 550,
        image: require("../../assets/images/aceitemotor.jpg")
    },
    {
        id: 2,
        title: "Filtro de aire",
        description: "Filtro de aire para mejorar rendimiento del motor.",
        price: 120,
        image: require("../../assets/images/filtro.png")
    },
    {
        id: 3,
        title: "Batería 12V",
        description: "Batería duradera para vehículos estándar.",
        price: 1800,
        image: require("../../assets/images/bateria.jpg")
    }
];

export default function Marketplace() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.greeting}>Marketplace</Text>
                <TouchableOpacity onPress={() => router.push("/main/profile")}>
                    <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {marketplaceItems.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <Image source={item.image} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                        </View>
                        <TouchableOpacity style={styles.buyButton} onPress={() => alert(`Comprar: ${item.title}`)}>
                            <Text style={styles.buyButtonText}>Comprar</Text>
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
    buyButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8
    },
    buyButtonText: {
        color: "#FFFFFF",
        fontFamily: fonts.semiBold,
        fontSize: 14
    }
});
