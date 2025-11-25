import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const mockExpenses = [
    {
        id: 1,
        title: "Cambio de aceite",
        category: "Mantenimiento",
        date: "2024-06-10",
        amount: 120.0,
    },
    {
        id: 2,
        title: "Neumáticos nuevos",
        category: "Reparación",
        date: "2024-05-15",
        amount: 450.0,
    },
    {
        id: 3,
        title: "Lavado y detallado",
        category: "Servicio",
        date: "2024-06-01",
        amount: 60.0,
    },
];

export default function Expenses() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.title}>Control de Gastos</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {mockExpenses.map((expense) => (
                    <View style={styles.expenseCard} key={expense.id}>
                        <View style={styles.expenseInfo}>
                            <Ionicons
                                name="card-outline"
                                size={24}
                                color={COLORS.primary}
                                style={styles.expenseIcon}
                            />
                            <View>
                                <Text style={styles.expenseTitle}>{expense.title}</Text>
                                <Text style={styles.expenseCategory}>{expense.category}</Text>
                            </View>
                        </View>
                        <View style={styles.expenseDetails}>
                            <Text style={styles.expenseDate}>
                                {new Date(expense.date).toLocaleDateString()}
                            </Text>
                            <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                        </View>
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
        paddingHorizontal: 20,
    },
    topBar: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: fonts.bold,
        color: COLORS.primary,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    expenseCard: {
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    expenseInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    expenseIcon: {
        marginRight: 12,
    },
    expenseTitle: {
        fontSize: 16,
        fontFamily: fonts.semiBold,
        color: "#000000",
    },
    expenseCategory: {
        fontSize: 12,
        fontFamily: fonts.regular,
        color: COLORS.neutral,
    },
    expenseDetails: {
        alignItems: "flex-end",
    },
    expenseDate: {
        fontSize: 12,
        fontFamily: fonts.regular,
        color: COLORS.neutral,
        marginBottom: 4,
    },
    expenseAmount: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: COLORS.primary,
    },
});
