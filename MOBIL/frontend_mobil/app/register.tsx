import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { api } from "../api/api";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !jelszo) {
      Alert.alert("Hiba", "Minden mezőt ki kell tölteni.");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password: jelszo,
      });

      console.log("Register válasz:", res.data);

      Alert.alert("Siker", "Sikeres regisztráció!");

      router.replace("/login");
    } catch (err: any) {
      console.error("Register hiba:", err?.response?.data || err.message);
      Alert.alert(
        "Hiba",
        err?.response?.data?.error || "Nem sikerült regisztrálni."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regisztráció</Text>

      <TextInput
        style={styles.input}
        placeholder="Felhasználónév"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Jelszó"
        value={jelszo}
        secureTextEntry
        onChangeText={setJelszo}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Regisztráció</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.link}>Van már fiókod? Bejelentkezés</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 28,
    color: "#f5c542",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
  backgroundColor: "#1f2430",
  color: "white",
  marginBottom: 14,
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#3a4150",
  fontSize: 16,
},
  button: {
    backgroundColor: "#f5c542",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#1b1f27",
    fontSize: 16,
  },
  link: {
    color: "#f5c542",
    textAlign: "center",
    marginTop: 16,
  },
});