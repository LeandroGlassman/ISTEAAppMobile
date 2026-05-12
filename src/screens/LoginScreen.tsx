import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert("Error", "Completá usuario y contraseña");
      return;
    }
    setSubmitting(true);
    const result = await login(username, password);
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert("Error", result.error ?? "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <PasswordInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
      />

      <Button title={submitting ? "Ingresando..." : "Ingresar"} onPress={handleLogin} disabled={submitting} color="#2A9D8F" />

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.linkContainer}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </TouchableOpacity>
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
    color: "#222",
  },
  linkContainer: { marginTop: 16, alignItems: "center" },
  link: { color: "#2A9D8F", fontSize: 14 },
});
