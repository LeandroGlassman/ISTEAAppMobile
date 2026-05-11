import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TasksContext";
import ItemCard from "../components/ItemCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const AUTO_DELETE_MS = 2000;

export default function HomeScreen({ navigation }: Props) {
  const { currentUser, logout } = useAuth();
  const { tasks, loading, toggleTask, deleteTask } = useTasks();
  const insets = useSafeAreaInsets();
  const pendingDeletions = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const scheduleDeletion = (id: string) => {
    const existing = pendingDeletions.current.get(id);
    if (existing) clearTimeout(existing);
    const timeout = setTimeout(() => {
      deleteTask(id);
      pendingDeletions.current.delete(id);
    }, AUTO_DELETE_MS);
    pendingDeletions.current.set(id, timeout);
  };

  const cancelDeletion = (id: string) => {
    const existing = pendingDeletions.current.get(id);
    if (existing) {
      clearTimeout(existing);
      pendingDeletions.current.delete(id);
    }
  };

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    toggleTask(id);
    if (task.completed) {
      cancelDeletion(id);
    } else {
      scheduleDeletion(id);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          cancelDeletion(id);
          deleteTask(id);
        },
      },
    ]);
  };

  useEffect(() => {
    if (loading) return;
    tasks.forEach(t => {
      if (t.completed && !pendingDeletions.current.has(t.id)) {
        scheduleDeletion(t.id);
      }
    });
  }, [loading]);

  useEffect(() => {
    return () => {
      pendingDeletions.current.forEach(clearTimeout);
      pendingDeletions.current.clear();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Hola, {currentUser} 👋</Text>

        {tasks.length === 0 ? (
          <View style={styles.empty}>
            <Image
              source={require("../../assets/empty-state.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemCard
                task={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
                fadeDurationMs={AUTO_DELETE_MS}
              />
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
          />
        )}
      </View>

      <View style={[styles.bottomBar, { paddingBottom: 12 + insets.bottom }]}>
        <View style={styles.bottomSlot} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddItem")}
          accessibilityLabel="Nueva tarea"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomSlot, styles.bottomSlotRight]}
          onPress={logout}
          accessibilityLabel="Cerrar sesión"
        >
          <Text style={styles.bottomSlotText}>Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#333" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImage: { width: "85%", maxWidth: 360, aspectRatio: 1512 / 1106 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  bottomSlot: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSlotRight: { alignItems: "flex-end" },
  bottomSlotText: { color: "#2A9D8F", fontSize: 15, fontWeight: "600" },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2A9D8F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 34,
    marginTop: -2,
  },
});
