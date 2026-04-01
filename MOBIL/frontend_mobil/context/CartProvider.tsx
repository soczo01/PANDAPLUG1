import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { useAuth } from "../auth/AuthProvider";
import {
  getCart,
  addToCartApi,
  removeCartItemApi,
  clearCartApi,
} from "../api/cartApi";
import { router } from "expo-router";

export type CartItem = {
  item_id: number;
  mennyiseg: number;
  termek_id: number;
  Név: string;
  "Ár(usd)": number;
  Típus: string;
  Szín: string;
  Méret: string;
  Státusz: string;
  Márka: string;
  kep_id: string;
};

type CartContextType = {
  cartItems: CartItem[];
  loading: boolean;
  loadCart: () => Promise<void>;
  addToCart: (termekId: number, mennyiseg?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  const normalizeCartData = (data: any): CartItem[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.cartItems)) return data.cartItems;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadCart = async () => {
    if (!userId) {
      console.log("loadCart: nincs userId");
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      console.log("loadCart userId:", userId);

      const data = await getCart(userId);
      console.log("loadCart válasz:", data);

      const normalized = normalizeCartData(data);
      console.log("loadCart normalizált:", normalized);

      setCartItems(normalized);
    } catch (error) {
      console.error("Kosár betöltési hiba:", error);
      Alert.alert("Hiba", "Nem sikerült betölteni a kosarat.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (termekId: number, mennyiseg: number = 1) => {
    if (!userId) {
      Alert.alert("Figyelem", "A kosár használatához jelentkezz be.");
      return;
    }

    try {
      console.log("addToCart userId:", userId);
      console.log("addToCart termékId:", termekId);
      console.log("addToCart mennyiség:", mennyiseg);

      const result = await addToCartApi(userId, termekId, mennyiseg);
      console.log("addToCartApi válasz:", result);

      await loadCart();

      Alert.alert(
  "Kosár",
  "A termék bekerült a kosárba.",
  [
    { text: "Tovább vásárolok", style: "cancel" },
    { text: "Kosár megnyitása", onPress: () => router.push("/(tabs)/kosar") },
  ]
);
    } catch (error) {
      console.error("Kosárba helyezési hiba:", error);
      Alert.alert("Hiba", "Nem sikerült kosárba tenni a terméket.");
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await removeCartItemApi(itemId);
      await loadCart();
    } catch (error) {
      console.error("Tétel törlési hiba:", error);
      Alert.alert("Hiba", "Nem sikerült törölni a tételt.");
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    try {
      await clearCartApi(userId);
      setCartItems([]);
    } catch (error) {
      console.error("Kosár ürítési hiba:", error);
      Alert.alert("Hiba", "Nem sikerült üríteni a kosarat.");
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + Number(item["Ár(usd)"]) * Number(item.mennyiseg);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => {
    return sum + Number(item.mennyiseg);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        loadCart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);