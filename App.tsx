import React from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

function DebugScreen() {
  const { isAuthenticated, currentUser, loading, register, login, logout } = useAuth();

  const handleRegister = async () => {
    const result = await register("test", "test123");
    Alert.alert("Register", result.ok ? "Registrado" : result.error ?? "Error");
  };

  const handleLogin = async () => {
    const result = await login("test", "test123");
    Alert.alert("Login", result.ok ? "Logueado" : result.error ?? "Error");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parcial 1 - Debug Auth</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusLine}>loading: {String(loading)}</Text>
        <Text style={styles.statusLine}>isAuthenticated: {String(isAuthenticated)}</Text>
        <Text style={styles.statusLine}>currentUser: {currentUser ?? "null"}</Text>
      </View>

      <View style={styles.buttons}>
        <Button title="Registrar test/test123" onPress={handleRegister} />
        <View style={styles.spacer} />
        <Button title="Login test/test123" onPress={handleLogin} />
        <View style={styles.spacer} />
        <Button title="Logout" onPress={logout} color="#ff3b30" />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DebugScreen />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  statusBox: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    marginBottom: 24,
  },
  statusLine: {
    fontSize: 14,
    fontFamily: "Courier",
    marginBottom: 4,
  },
  buttons: {
    width: "100%",
  },
  spacer: {
    height: 12,
  },
});
