import { Platform } from "react-native";

// WEB vs MOBIL felismerése
const isWeb = Platform.OS === "web";

// Weben automatikusan az aktuális hostot használja
const webHost =
  typeof window !== "undefined"
    ? window.location.hostname
    : "localhost";

// SERVER URL
export const SERVER_URL = isWeb
  ? `http://${webHost}:8080`
  : process.env.EXPO_PUBLIC_SERVER_URL;

// API URL
export const API_URL = `${SERVER_URL}/api`;