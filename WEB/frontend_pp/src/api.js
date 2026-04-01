const API_URL = "http://localhost:8080/api";

// Token kezelés
export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

// Általános fetch wrapper, ami automatikusan hozzáadja a tokent
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // Ha 401, automatikus kijelentkeztetés
    if (res.status === 401) removeToken();
    throw new Error(await res.text());
  }
  // Ha nincs tartalom (pl. törlés), ne próbáljon json-t olvasni
  if (res.status === 204) return null;
  return res.json();
}

// Bejelentkezés
export async function login(username, password) {
  const res = await fetch(`http://localhost:8080/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  setToken(data.accessToken);
  return data;
}


// Regisztráció
export async function register(username, password, email) {
  const res = await fetch(`http://localhost:8080/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Regisztráció sikertelen");
  }

  return res.json();
}

// Profil lekérdezése (védett végpont)
export function getProfile() {
  return apiFetch("/auth/profile");
}

// Kijelentkezés (csak frontend)
export function logout() {
  removeToken();
}

// Bármilyen védett GET/POST/PUT/DELETE hívás
export function getProducts() {
  return apiFetch("/termekek");
}
export function addToCart(termek_id, mennyiseg = 1) {
  return apiFetch("/cart/add", {
    method: "POST",
    body: JSON.stringify({ termek_id, mennyiseg }),
  });
}
export function getCart() {
  return apiFetch("/cart/1");
}
export function removeFromCart(item_id) {
  return apiFetch(`/cart/remove/${item_id}`, { method: "DELETE" });
}
export function clearCart() {
  return apiFetch("/cart/clear/1", { method: "DELETE" });
}
