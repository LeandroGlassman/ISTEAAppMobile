import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import PasswordInput from "../components/PasswordInput";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const { requestPermissions } = useNotifications();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordHidden = () => setPasswordHidden((h) => !h);

  const handleRegister = async () => {
    if (password !== password2) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    const result = await register(username, password);
    if (!result.ok) {
      Alert.alert("Error", result.error ?? "No se pudo registrar");
      return;
    }
    await requestPermissions();
    Alert.alert("Listo", "Usuario registrado. Ahora podés iniciar sesión.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <PasswordInput
        placeholder="Contraseña (mínimo 6)"
        value={password}
        onChangeText={setPassword}
        hidden={passwordHidden}
        onToggleHidden={togglePasswordHidden}
      />

      <PasswordInput
        placeholder="Repetir contraseña"
        value={password2}
        onChangeText={setPassword2}
        hidden={passwordHidden}
        onToggleHidden={togglePasswordHidden}
      />

      <Button title="Registrarme" onPress={handleRegister} color="#2A9D8F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
});
