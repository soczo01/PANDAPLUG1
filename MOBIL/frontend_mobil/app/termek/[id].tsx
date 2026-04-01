import { useLocalSearchParams, Stack } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

import { API_URL, SERVER_URL } from "../../api/config";
import { useCart } from "../../context/CartProvider";

type Termek = {
  termek_id: number;
  Név: string;
  "Ár(usd)": number;
  Típus: string;
  Szín: string;
  Méret: string;
  Státusz: string;
  Márka: string;
};

export default function TermekDetails() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();

  const [termek, setTermek] = useState<Termek | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTermek();
  }, []);

  const fetchTermek = async () => {
    try {
      const res = await fetch(`${API_URL}/termekek/${id}`);
      const data = await res.json();
      setTermek(data);
    } catch (err) {
      console.error("Details hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f5c542" />
      </View>
    );
  }

  if (!termek) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>A termék nem található.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Termék részletei",
          headerStyle: { backgroundColor: "#1b1f27" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.imageCard}>
          <Image
            source={{ uri: `${SERVER_URL}/images/image${termek.termek_id}.png` }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.brand}>{termek.Márka}</Text>
          <Text style={styles.title}>{termek.Név}</Text>
          <Text style={styles.price}>${termek["Ár(usd)"]} USD</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Statusz:</Text>
            <Text style={styles.statusValue}>{termek.Státusz}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Tulajdonságok</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Típus</Text>
            <Text style={styles.detailValue}>{termek.Típus}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Méret</Text>
            <Text style={styles.detailValue}>{termek.Méret}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Szín</Text>
            <Text style={styles.detailValue}>{termek.Szín}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Márka</Text>
            <Text style={styles.detailValue}>{termek.Márka}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => addToCart(termek.termek_id, 1)}
        >
          <Text style={styles.cartButtonText}>Kosárba teszem</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  errorText: {
    color: "white",
    fontSize: 18,
  },
  imageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
  },
  infoCard: {
    backgroundColor: "#1f2430",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  brand: {
    color: "#f5c542",
    fontSize: 14,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    color: "#f5c542",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    color: "#b8bcc8",
    fontSize: 15,
    marginRight: 8,
  },
  statusValue: {
    color: "#7CFC8A",
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  detailsCard: {
    backgroundColor: "#1f2430",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#313847",
  },
  detailLabel: {
    color: "#b8bcc8",
    fontSize: 16,
  },
  detailValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cartButton: {
    backgroundColor: "#f5c542",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  cartButtonText: {
    color: "#1b1f27",
    fontSize: 18,
    fontWeight: "bold",
  },
});