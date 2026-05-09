import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../hooks/useItems";
import ItemCard from "../components/ItemCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const AUTO_DELETE_MS = 2000;

export default function HomeScreen({ navigation }: Props) {
  const { currentUser, logout } = useAuth();
  const { tasks, loading, addTask, toggleTask, deleteTask } = useItems();
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hola, {currentUser} 👋</Text>

      <View style={styles.debugBox}>
        <Button
          title="Tarea de prueba"
          onPress={() => addTask({ title: "Test " + Date.now(), notes: "" })}
        />
      </View>

      {tasks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay tareas todavía</Text>
          <Text style={styles.emptySub}>Tocá "+ Nueva" para crear una</Text>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddItem")}
      >
        <Text style={styles.fabText}>+ Nueva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#333" },
  debugBox: { marginBottom: 12 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#666", marginBottom: 4 },
  emptySub: { fontSize: 14, color: "#999" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007aff",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  logoutText: { color: "#007aff", fontSize: 16, marginRight: 12 },
});
