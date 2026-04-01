import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../api/config";
import { router } from "expo-router";

export default function CheckoutScreen() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [nev, setNev] = useState(user?.username || "");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [cim, setCim] = useState("");

  const handleOrder = async () => {
    if (!nev || !email || !telefon || !cim) {
      Alert.alert("Hiba", "Tölts ki minden mezőt");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Hiba", "A kosár üres");
      return;
    }

    try {
      const orderData = {
        felhasznalo: {
          nev,
          email,
          telefon,
          cim,
        },
        osszeg: totalPrice,
        datum: new Date(),
        termekek: cartItems.map((item) => ({
          termek_id: item.termek_id,
          Név: item.Név,
          Méret: item.Méret,
          "Ár(usd)": item["Ár(usd)"],
        })),
      };

      console.log("RENDELÉS:", JSON.stringify(orderData, null, 2));

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Sikertelen rendelés");
      }

      const data = await res.json();
      console.log("ORDER RESPONSE:", data);

      Alert.alert("Siker", "Rendelés leadva!");

      await clearCart();

      router.replace("/(tabs)");
    } catch (err) {
      console.error("ORDER HIBA:", err);
      Alert.alert("Hiba", "Nem sikerült leadni a rendelést");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pénztár</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Szállítási adatok</Text>

        <TextInput
          style={styles.input}
          placeholder="Név"
          value={nev}
          onChangeText={setNev}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefonszám"
          value={telefon}
          onChangeText={setTelefon}
        />

        <TextInput
          style={styles.input}
          placeholder="Cím"
          value={cim}
          onChangeText={setCim}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Összegzés</Text>

        {cartItems.map((item) => (
          <Text key={item.item_id} style={styles.item}>
            {item.Név} ({item.Méret}) x {item.mennyiseg}
          </Text>
        ))}

        <Text style={styles.total}>
          Összesen: {totalPrice} USD
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleOrder}>
        <Text style={styles.buttonText}>Rendelés leadása</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#25292e",
    padding: 16,
  },

  title: {
    fontSize: 28,
    color: "#f5c542",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#1f2430",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#313847",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  item: {
    color: "#d5d8df",
    marginBottom: 4,
  },

  total: {
    color: "#f5c542",
    fontSize: 18,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#f5c542",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});