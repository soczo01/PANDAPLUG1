import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCart } from "../../context/CartProvider";
import { SERVER_URL } from "../../api/config";

const KosarScreen = () => {
  const {
    cartItems,
    loading,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
    loadCart,
  } = useCart();

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  console.log("Kosár oldal cartItems:", cartItems);
  console.log("Kosár oldal totalItems:", totalItems);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f5c542" />
        <Text style={styles.loadingText}>Betöltés...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Kosár</Text>

      {cartItems.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>A kosár üres.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.item_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: `${SERVER_URL}/images/image${item.termek_id}.png`,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.brand}>{item.Márka}</Text>
                <Text style={styles.title}>{item.Név}</Text>

                <Text style={styles.price}>
                  Ár: {item["Ár(usd)"]} USD
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoBadge}>Méret: {item.Méret}</Text>
                  <Text style={styles.infoBadge}>Szín: {item.Szín}</Text>
                </View>

                <Text style={styles.metaText}>Mennyiség: {item.mennyiseg}</Text>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.item_id)}
                >
                  <Text style={styles.removeButtonText}>Törlés</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Összesítés</Text>
              <Text style={styles.summaryText}>Tételek száma: {totalItems}</Text>
              <Text style={styles.summaryText}>Végösszeg: {totalPrice} USD</Text>

              <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
                <Text style={styles.clearButtonText}>Kosár ürítése</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => { router.push('/checkout')
                  // Navigáció a checkout oldalra
              
                  // vagy navigation.navigate('Checkout')
                }}
              >
                <Text style={styles.checkoutButtonText}>Tovább a megrendeléshez</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default KosarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    padding: 24,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: "#f5c542",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  emptyText: {
    color: "white",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#1f2430",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  imageWrapper: {
    backgroundColor: "#ffffff",
    padding: 14,
  },
  image: {
    width: "100%",
    height: 220,
  },
  cardBody: {
    padding: 14,
  },
  brand: {
    color: "#f5c542",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#f5c542",
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  infoBadge: {
    backgroundColor: "#313847",
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 14,
  },
  metaText: {
    color: "#d5d8df",
    fontSize: 15,
    marginBottom: 14,
  },
  removeButton: {
    backgroundColor: "#d9534f",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  summary: {
    backgroundColor: "#1f2430",
    padding: 16,
    borderRadius: 18,
    marginTop: 4,
    marginBottom: 20,
  },
  summaryTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryText: {
    color: "#ffffff",
    fontSize: 17,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: "#f5c542",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  clearButtonText: {
    color: "#1b1f27",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});