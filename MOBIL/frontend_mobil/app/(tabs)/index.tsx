import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../auth/AuthProvider";
import { useCart } from "../../context/CartProvider";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Üdv újra{user?.username ? `, ${user.username}` : ""}!
        </Text>

        <Text style={styles.subtitle}>
          Válassz, merre szeretnél továbbmenni.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Termékek</Text>
          <Text style={styles.cardText}>
            Nézd meg a kínálatot, szűrj termékekre, és válaszd ki, ami tetszik.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Listazo" as any)}
          >
            <Text style={styles.buttonText}>Termékek megnyitása</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kosár</Text>
          <Text style={styles.cardText}>
            Jelenleg {totalItems} db termék van a kosaradban.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/kosar" as any)}
          >
            <Text style={styles.buttonText}>Kosár megnyitása</Text>
          </TouchableOpacity>
        </View>

<View style={styles.card}>
  <Text style={styles.cardTitle}>Új felhasználó?</Text>
  <Text style={styles.cardText}>
    Hozz létre egy új fiókot és kezdj el vásárolni.
  </Text>

  <TouchableOpacity
    style={styles.button}
    onPress={() => router.push("/register")}
  >
    <Text style={styles.buttonText}>Regisztráció</Text>
  </TouchableOpacity>
</View>
    
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fiók</Text>
          <Text style={styles.cardText}>
            Bejelentkezve.
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            <Text style={styles.logoutButtonText}>Kijelentkezés</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 16,
  },
  welcome: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#f5c542",
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#d5d8df",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1f2430",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    color: "#d5d8df",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#f5c542",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#1b1f27",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});