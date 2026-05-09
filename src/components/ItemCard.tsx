import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Task } from "../hooks/useItems";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  fadeDurationMs: number;
}

const REVERSE_FADE_MS = 250;

export default function ItemCard({ task, onToggle, onDelete, fadeDurationMs }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: task.completed ? 0 : 1,
      duration: task.completed ? fadeDurationMs : REVERSE_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [task.completed, fadeDurationMs, opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <TouchableOpacity
        style={styles.contentArea}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed && <Text style={styles.check}>✓</Text>}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, task.completed && styles.titleDone]}>
            {task.title}
          </Text>
          {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
          {task.reminderAt ? (
            <Text style={styles.reminder}>
              🔔 {new Date(task.reminderAt).toLocaleString()}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {!task.completed && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(task.id)}
          accessibilityLabel="Eliminar tarea"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  contentArea: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007aff",
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDone: { backgroundColor: "#007aff" },
  check: { color: "#fff", fontWeight: "bold" },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: "#222" },
  titleDone: { textDecorationLine: "line-through", color: "#999" },
  notes: { fontSize: 13, color: "#666", marginTop: 2 },
  reminder: { fontSize: 12, color: "#007aff", marginTop: 4 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteText: { color: "#ff3b30", fontSize: 20, fontWeight: "600", lineHeight: 22 },
});
