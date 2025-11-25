// app/main/vehicles.tsx
import { DataContext } from "@/contexts/DataContext";
import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Vehicle = {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  km: number;
  status: string;
  color: string;
};

const statusInfoMap = {
  good: { label: "Buen estado", color: "#2DD4BF", icon: "checkmark-circle" },
  warning: { label: "Requiere atención", color: "#FFB020", icon: "warning" },
  critical: { label: "Atención urgente", color: "#FF5C5C", icon: "alert-circle" },
  unknown: { label: "Desconocido", color: COLORS.neutral, icon: "help-circle" }
};

export default function VehiclesScreen() {
  const router = useRouter();
  const { vehicles } = useContext(DataContext);

  // Use vehicles from context or fallback to empty array
  const vehiclesList = vehicles && vehicles.length > 0 ? vehicles : [];

  const getStatusInfo = (status: string) => {
    return statusInfoMap[status as keyof typeof statusInfoMap] || statusInfoMap.unknown;
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={styles.vehicleCard}
        onPress={() => router.push(`/main/vehicle-detail/${item.id}` as any)}
        activeOpacity={0.7}
      >
        {/* Car Icon with Color */}
        <View style={[styles.carIconContainer, { backgroundColor: item.color }]}>
          <Ionicons name="car-sport" size={32} color="#FFFFFF" />
        </View>

        {/* Vehicle Info */}
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{item.brand} {item.model}</Text>
          <Text style={styles.vehicleDetails}>
            {item.year} • {item.plate}
          </Text>
          <View style={styles.vehicleMeta}>
            <Ionicons name="speedometer-outline" size={14} color={COLORS.neutral} />
            <Text style={styles.vehicleKm}>{(item.km ?? 0).toLocaleString()} km</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
            <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.neutral} style={{ marginTop: 6 }} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => (
    <>
      {/* Add Vehicle Card */}
      <TouchableOpacity
        style={styles.addVehicleCard}
        onPress={() => router.push("/main/add-vehicle")}
      >
        <View style={styles.addVehicleIcon}>
          <Ionicons name="add-circle" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.addVehicleTitle}>Añadir nuevo vehículo</Text>
        <Text style={styles.addVehicleSubtitle}>
          Registra otro vehículo para gestionar su mantenimiento
        </Text>
      </TouchableOpacity>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>¿Sabías que...?</Text>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.bg} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoCardTitle}>Mantenimiento preventivo</Text>
            <Text style={styles.infoCardText}>
              Realizar el mantenimiento a tiempo puede ahorrarte hasta un 30% en reparaciones
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="leaf" size={24} color="#2DD4BF" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoCardTitle}>Eficiencia de combustible</Text>
            <Text style={styles.infoCardText}>
              Mantener tus llantas con la presión correcta mejora el rendimiento hasta un 3%
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-sport-outline" size={80} color={COLORS.neutral} />
      <Text style={styles.emptyTitle}>No tienes vehículos registrados</Text>
      <Text style={styles.emptySubtitle}>
        Agrega tu primer vehículo para comenzar a gestionar su mantenimiento
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push("/main/add-vehicle")}
      >
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Añadir vehículo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Mis Vehículos</Text>
          <Text style={styles.subtitle}>
            {vehiclesList.length} vehículo{vehiclesList.length !== 1 ? "s" : ""} registrado{vehiclesList.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/main/add-vehicle")}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {vehiclesList.length === 0 ? (
        renderEmpty()
      ) : (
        // Fixed: explicit generic + cast to ensure the FlatList data matches the Vehicle type
        <FlatList<Vehicle>
          data={vehiclesList as Vehicle[]}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: "#000000"
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginTop: 4
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.bg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  vehicleCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  carIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  vehicleInfo: {
    flex: 1
  },
  vehicleName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000",
    marginBottom: 4
  },
  vehicleDetails: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginBottom: 6
  },
  vehicleMeta: {
    flexDirection: "row",
    alignItems: "center"
  },
  vehicleKm: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: COLORS.neutral,
    marginLeft: 4
  },
  statusContainer: {
    alignItems: "flex-end"
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    marginLeft: 4
  },
  addVehicleCard: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed"
  },
  addVehicleIcon: {
    marginBottom: 16
  },
  addVehicleTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000",
    marginBottom: 8,
    textAlign: "center"
  },
  addVehicleSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    textAlign: "center",
    lineHeight: 20
  },
  infoSection: {
    marginTop: 8
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000",
    marginBottom: 16
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12
  },
  infoCardTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginBottom: 4
  },
  infoCardText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    lineHeight: 18
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#000000",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center"
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.bg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  emptyButtonText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#FFFFFF",
    marginLeft: 8
  }
});