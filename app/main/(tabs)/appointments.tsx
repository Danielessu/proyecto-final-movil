// app/main/appointments.tsx
import { DataContext } from "@/contexts/DataContext";
import { fonts } from "@/themes/fonts";
import { COLORS } from "@/themes/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter by upcoming (future dates) or history (past dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = sortedAppointments.filter(
    (apt) => new Date(apt.date) >= today
  );

  const historyAppointments = sortedAppointments.filter(
    (apt) => new Date(apt.date) < today
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmada", color: "#2DD4BF", icon: "checkmark-circle" };
      case "pending":
        return { label: "Pendiente", color: "#FFB020", icon: "time" };
      case "completed":
        return { label: "Completada", color: COLORS.bg, icon: "checkmark-done" };
      case "cancelled":
        return { label: "Cancelada", color: "#FF5C5C", icon: "close-circle" };
      default:
        return { label: "Desconocido", color: COLORS.neutral, icon: "help-circle" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const renderUpcomingAppointment = ({ item }: { item: any }) => {
    const statusInfo = getStatusInfo(item.status || "pending");

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => router.push(`/main/appointment-detail/${item.id}` as any)}
      >
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{formatDate(item.date).split(" ")[0]}</Text>
          <Text style={styles.dateMonth}>{formatDate(item.date).split(" ")[1]}</Text>
        </View>

        {/* Appointment Info */}
        <View style={styles.appointmentInfo}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.serviceName}>{item.service}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
              <Ionicons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="business" size={14} color={COLORS.neutral} />
              <Text style={styles.detailText}>{item.workshop}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={14} color={COLORS.neutral} />
              <Text style={styles.detailText}>{item.time || "10:00 AM"}</Text>
            </View>
          </View>

          <View style={styles.appointmentFooter}>
            <Text style={styles.costText}>~${item.estimatedCost || 0}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHistoryAppointment = ({ item }: { item: any }) => {
    const statusInfo = getStatusInfo(item.status || "completed");

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => router.push(`/main/appointment-detail/${item.id}` as any)}
      >
        <View style={styles.historyHeader}>
          <View>
            <Text style={styles.historyService}>{item.service}</Text>
            <Text style={styles.historyWorkshop}>{item.workshop}</Text>
          </View>
          <View style={[styles.historyStatusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
            <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
          </View>
        </View>

        <View style={styles.historyDetails}>
          <View style={styles.historyDetailItem}>
            <Ionicons name="calendar" size={14} color={COLORS.neutral} />
            <Text style={styles.historyDetailText}>
              {new Date(item.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
          <View style={styles.historyDetailItem}>
            <Ionicons name="cash" size={14} color={COLORS.neutral} />
            <Text style={styles.historyDetailText}>${item.actualCost || item.estimatedCost || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={COLORS.neutral} />
      <Text style={styles.emptyTitle}>
        {activeTab === "upcoming" ? "No tienes citas próximas" : "No tienes historial de citas"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "upcoming"
          ? "Agenda una cita para mantener tu vehículo en óptimas condiciones"
          : "Tus citas completadas aparecerán aquí"
        }
      </Text>
      {activeTab === "upcoming" && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push("/main/booking")}
        >
          <Text style={styles.emptyButtonText}>Solicitar cita</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Mis Citas</Text>
          <Text style={styles.subtitle}>Gestiona tus servicios</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/main/booking")}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.tabTextActive]}>
            Próximas ({upcomingAppointments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.tabActive]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}>
            Historial ({historyAppointments.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === "upcoming" ? (
        upcomingAppointments.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={upcomingAppointments}
            renderItem={renderUpcomingAppointment}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        historyAppointments.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={historyAppointments}
            renderItem={renderHistoryAppointment}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          />
        )
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
    paddingBottom: 16,
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    alignItems: "center"
  },
  tabActive: {
    backgroundColor: COLORS.bg
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: COLORS.neutral
  },
  tabTextActive: {
    color: "#FFFFFF"
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  appointmentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  dateBadge: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.light,
    borderRadius: 12,
    marginRight: 16,
    paddingVertical: 12
  },
  dateDay: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: COLORS.bg
  },
  dateMonth: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: COLORS.neutral,
    textTransform: "uppercase",
    marginTop: 2
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
  },
  serviceName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: "#000000",
    flex: 1,
    marginRight: 8
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    marginLeft: 4
  },
  appointmentDetails: {
    marginBottom: 12
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  detailText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginLeft: 8
  },
  appointmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.light
  },
  costText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: COLORS.bg
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    justifyContent: "center",
    alignItems: "center"
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
  },
  historyService: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "#000000",
    marginBottom: 4
  },
  historyWorkshop: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: COLORS.neutral
  },
  historyStatusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  historyDetails: {
    flexDirection: "row",
    gap: 16
  },
  historyDetailItem: {
    flexDirection: "row",
    alignItems: "center"
  },
  historyDetailText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    marginLeft: 4
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#000000",
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.neutral,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24
  },
  emptyButton: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: "#FFFFFF"
  }
});