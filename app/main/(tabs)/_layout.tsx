import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0d1b2a',
                    borderTopWidth: 0,
                    borderTopColor: '#1b263b',
                },
                tabBarActiveTintColor: '#4a90e2',
                tabBarInactiveTintColor: '#e0e1dd',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="vehicles"
                options={{
                    title: 'Vehículos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="car-sport" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="diagnosis"
                options={{
                    title: 'Asistente',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbox-ellipses" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="appointments"
                options={{
                    title: 'Citas',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
