import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { register, login } = useAuth();

  const handleForceLogin = async () => {
    const exists = await login("debug", "debug123");
    if (!exists.ok) {
      await register("debug", "debug123");
      await login("debug", "debug123");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.spacer} />
      <Button title="Ir a Register" onPress={() => navigation.navigate("Register")} />
      <View style={styles.spacer} />
      <Button title="Forzar login" onPress={handleForceLogin} />
    </View>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  spacer: {
    height: 12,
  },
});
