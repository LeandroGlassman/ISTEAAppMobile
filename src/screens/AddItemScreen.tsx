import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTasks } from "../context/TasksContext";
import { useNotifications } from "../hooks/useNotifications";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AddItem">;

const DEFAULT_HOUR = 9;

function startOfTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(DEFAULT_HOUR, 0, 0, 0);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AddItemScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const { scheduleNotification, requestPermissions } = useNotifications();

  useEffect(() => {
    requestPermissions();
  }, []);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [withReminder, setWithReminder] = useState(false);
  const [date, setDate] = useState<Date>(startOfTomorrow());
  const [withTime, setWithTime] = useState(false);
  const [time, setTime] = useState<Date>(startOfTomorrow());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "set" && selected) setDate(selected);
  };

  const onTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (event.type === "set" && selected) setTime(selected);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Falta el título", "Escribí algo para guardar la tarea");
      return;
    }

    let reminderAt: number | undefined;
    let notificationId: string | undefined;

    if (withReminder) {
      const reminderDate = new Date(date);
      if (withTime) {
        reminderDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
      } else {
        reminderDate.setHours(DEFAULT_HOUR, 0, 0, 0);
      }

      if (reminderDate.getTime() <= Date.now()) {
        Alert.alert(
          "Fecha pasada",
          "El recordatorio tiene que ser en el futuro"
        );
        return;
      }

      const id = await scheduleNotification(
        "Recordatorio: " + title.trim(),
        notes.trim() || "Tenés algo pendiente",
        reminderDate
      );
      reminderAt = reminderDate.getTime();
      notificationId = id ?? undefined;
    }

    await addTask({
      title: title.trim(),
      notes: notes.trim(),
      reminderAt,
      notificationId,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ej: Comprar leche"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Detalle..."
        placeholderTextColor="#999"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Programar recordatorio</Text>
        <Switch value={withReminder} onValueChange={setWithReminder} />
      </View>

      {withReminder && (
        <View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Fecha</Text>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={date}
                mode="date"
                display="compact"
                minimumDate={new Date()}
                onChange={onDateChange}
              />
            ) : (
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.pickerText}>📅 {formatDate(date)}</Text>
              </TouchableOpacity>
            )}
          </View>

          {Platform.OS === "android" && showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          <View style={styles.switchRow}>
            <Text style={styles.label}>Elegir hora</Text>
            <Switch value={withTime} onValueChange={setWithTime} />
          </View>

          {withTime ? (
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Hora</Text>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="compact"
                  onChange={onTimeChange}
                />
              ) : (
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.pickerText}>🕘 {formatTime(time)}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.hint}>
              Sin hora elegida, te aviso a las {DEFAULT_HOUR}:00
            </Text>
          )}

          {Platform.OS === "android" && showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              onChange={onTimeChange}
            />
          )}
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <Button title="Guardar" onPress={handleSave} color="#2A9D8F" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#222",
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  pickerBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
  },
  pickerText: { fontSize: 14, color: "#222" },
  hint: { fontSize: 12, color: "#888", marginTop: 6, fontStyle: "italic" },
});
