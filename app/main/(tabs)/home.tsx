// app/main/home.tsx
import { AuthContext } from "@/contexts/AuthContext";
import { DataContext } from "@/contexts/DataContext";
import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { vehicles, appointments } = useContext(DataContext);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  // Use vehicles from context or empty array fallback
  const vehiclesList = vehicles.length > 0 ? vehicles : [];

  // Mock upcoming services remain as is (no context data)
  const upcomingServices = [
    { 
      id: 1, 
      title: "Cambio de aceite", 
      dueKm: 50000, 
      currentKm: vehiclesList.length > 0 ? vehiclesList[selectedVehicle]?.km || 0 : 0, 
      priority: "próximo",
      estimatedCost: 150
    },
    { 
      id: 2, 
      title: "Revisión de frenos", 
      dueKm: 48000, 
      currentKm: vehiclesList.length > 0 ? vehiclesList[selectedVehicle]?.km || 0 : 0, 
      priority: "crítico",
      estimatedCost: 250
    },
    { 
      id: 3, 
      title: "Cambio de filtro de aire", 
      dueKm: 55000, 
      currentKm: vehiclesList.length > 0 ? vehiclesList[selectedVehicle]?.km || 0 : 0, 
      priority: "ok",
      estimatedCost: 80
    }
  ];

  // Get the last appointment from context sorted by date (latest first)
  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastAppointment = sortedAppointments.length > 0 ? sortedAppointments[0] : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "crítico": return "#FF5C5C";
      case "próximo": return "#FFB020";
      case "ok": return "#2DD4BF";
      default: return COLORS.neutral;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "crítico": return "Urgente";
      case "próximo": return "Próximo";
      case "ok": return "OK";
      default: return "OK";
    }
  };

  const currentVehicle = vehiclesList.length > 0 ? vehiclesList[selectedVehicle] : null;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.name || "Usuario"}</Text>
          <Text style={styles.subGreeting}>Gestiona tus vehículos</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/main/profile")}>
          <Image
            source={
              user?.avatar_url
                ? { uri: user.avatar_url }
                : require("../../../assets/images/profile.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vehicle Selector */}
        <View style={styles.vehicleSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {vehiclesList.map((vehicle, index) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleCard,
                  selectedVehicle === index && styles.vehicleCardActive
                ]}
                onPress={() => setSelectedVehicle(index)}
              >
                <Ionicons 
                  name="car" 
                  size={24} 
                  color={selectedVehicle === index ? COLORS.bg : COLORS.neutral} 
                />
                <Text style={[
                  styles.vehicleCardText,
                  selectedVehicle === index && styles.vehicleCardTextActive
                ]}>
                  {vehicle.brand} {vehicle.model}
                </Text>
                <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.addVehicleCard}
              onPress={() => router.push("/main/add-vehicle")}
            >
              <Ionicons name="add-circle-outline" size={32} color={COLORS.primary} />
              <Text style={styles.addVehicleText}>Añadir</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Vehicle Stats Card */}
        {currentVehicle && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Kilometraje</Text>
            <Text style={styles.statValue}>{currentVehicle?.km !== undefined && currentVehicle?.km !== null ? currentVehicle.km.toLocaleString() : "N/A"} km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Año</Text>
            <Text style={styles.statValue}>{currentVehicle.year}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Estado</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: "#2DD4BF" }]} />
              <Text style={styles.statusText}>Bueno</Text>
            </View>
          </View>
        </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push("/main/booking")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.bg }]}>
              <Ionicons name="calendar" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickActionText}>Solicitar{"\n"}cita</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push("/main/diagnosis")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickActionText}>Diagnóstico{"\n"}IA</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push("/main/marketplace")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent }]}>
              <Ionicons name="cart" size={24} color={COLORS.bg} />
            </View>
            <Text style={styles.quickActionText}>Market{"\n"}place</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push("/main/expenses")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: "#FFB020" }]}>
              <Ionicons name="receipt" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickActionText}>Control{"\n"}gastos</Text>
          </TouchableOpacity>
        </View>

        {/* Próximos Servicios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos servicios</Text>
            <TouchableOpacity onPress={() => router.push("/main/services")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {upcomingServices.map((service) => {
            const kmLeft = service.dueKm - service.currentKm;
            return (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceInfo}>
                    <Ionicons name="build" size={20} color={COLORS.bg} />
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(service.priority) }]}>
                    <Text style={styles.priorityText}>{getPriorityBadge(service.priority)}</Text>
                  </View>
                </View>

                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceKm}>
                    {kmLeft !== undefined && kmLeft !== null && kmLeft > 0 ? `Faltan ${kmLeft.toLocaleString()} km` : "Vencido"}
                  </Text>
                  <Text style={styles.serviceCost}>~${service.estimatedCost}</Text>
                </View>

                <View style={styles.serviceActions}>
                  <TouchableOpacity style={styles.serviceActionBtn}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.serviceActionText}>Agregar a calendario</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.serviceActionBtn, styles.serviceActionBtnPrimary]}
                    onPress={() => router.push("/main/booking")}
                  >
                    <Text style={styles.serviceActionTextPrimary}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Última Cita */}
        {lastAppointment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Última cita</Text>
            <View style={styles.lastAppointmentCard}>
              <View style={styles.lastAppointmentIcon}>
                <Ionicons name="checkmark-circle" size={32} color="#2DD4BF" />
              </View>
              <View style={styles.lastAppointmentInfo}>
                <Text style={styles.lastAppointmentService}>{lastAppointment.service}</Text>
                <Text style={styles.lastAppointmentWorkshop}>{lastAppointment.workshop}</Text>
                <Text style={styles.lastAppointmentDate}>{lastAppointment?.date ? new Date(lastAppointment.date).toLocaleDateString() : "Fecha no disponible"}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color={COLORS.neutral} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/main/onboarding/dealer")}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingBottom: 16,
    backgroundColor: "#FFFFFF"
  },
  greeting: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: "#000000"
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginTop: 2
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.light
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  vehicleSelector: {
    marginTop: 16,
    marginBottom: 16
  },
  vehicleCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    alignItems: "center"
  },
  vehicleCardActive: {
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.bg
  },
  vehicleCardText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: COLORS.neutral,
    marginTop: 8,
    textAlign: "center"
  },
  vehicleCardTextActive: {
    color: COLORS.bg
  },
  vehiclePlate: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginTop: 4
  },
  addVehicleCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    padding: 16,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  addVehicleText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: COLORS.primary,
    marginTop: 4
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  statItem: {
    flex: 1,
    alignItems: "center"
  },
  statLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginBottom: 4
  },
  statValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000"
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.light,
    marginHorizontal: 8
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45, 212, 191, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: "#2DD4BF"
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },
  quickActionBtn: {
    alignItems: "center",
    flex: 1
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  quickActionText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: "#000000",
    textAlign: "center",
    lineHeight: 14
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000"
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: COLORS.primary
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  serviceTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginLeft: 8
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  priorityText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: "#FFFFFF"
  },
  serviceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  serviceKm: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral
  },
  serviceCost: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: COLORS.bg
  },
  serviceActions: {
    flexDirection: "row",
    gap: 8
  },
  serviceActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.light
  },
  serviceActionBtnPrimary: {
    backgroundColor: COLORS.bg,
    borderColor: COLORS.bg
  },
  serviceActionText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: COLORS.primary,
    marginLeft: 4
  },
  serviceActionTextPrimary: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: "#FFFFFF"
  },
  lastAppointmentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  lastAppointmentIcon: {
    marginRight: 12
  },
  lastAppointmentInfo: {
    flex: 1
  },
  lastAppointmentService: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginBottom: 2
  },
  lastAppointmentWorkshop: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginBottom: 2
  },
  lastAppointmentDate: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: COLORS.neutral
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.bg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  }
});
