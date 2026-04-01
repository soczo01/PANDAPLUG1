import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../auth/AuthProvider";

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [jelszo, setJelszo] = useState("");

  const handleLogin = async () => {
    if (!username || !jelszo) {
      Alert.alert("Hiba", "Tölts ki minden mezőt");
      return;
    }

    const success = await login(username, jelszo);

    if (success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Hiba", "Hibás felhasználónév vagy jelszó");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bejelentkezés</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Felhasználónév</Text>
        <TextInput
          style={styles.input}
          placeholder="Írd be a felhasználóneved"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Jelszó</Text>
        <TextInput
          style={styles.input}
          placeholder="Írd be a jelszavad"
          placeholderTextColor="#999"
          value={jelszo}
          secureTextEntry
          onChangeText={setJelszo}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Bejelentkezés</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/register" as any)}
        >
          <Text style={styles.registerText}>
            Még nincs fiókod? Regisztráció
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f5c542",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#1f2430",
    borderRadius: 18,
    padding: 20,
  },

  label: {
    color: "#d5d8df",
    marginBottom: 6,
    marginTop: 10,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#313847",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  loginButton: {
    backgroundColor: "#f5c542",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonText: {
    color: "#1b1f27",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },

  registerText: {
    color: "#f5c542",
    fontSize: 14,
  },
});