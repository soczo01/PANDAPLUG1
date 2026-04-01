import { api } from "./api";

export const getCart = async (userId: number) => {
  const response = await api.get(`/cart/${userId}`);
  return response.data;
};

export const addToCartApi = async (
  userId: number,
  termekId: number,
  mennyiseg: number = 1
) => {
  const payload = {
    user_id: userId,
    termek_id: termekId,
    mennyiseg,
  };

  console.log("POST /cart/add payload:", payload);

  const response = await api.post("/cart/add", payload);

  console.log("POST /cart/add response:", response.data);

  return response.data;
};

export const removeCartItemApi = async (itemId: number) => {
  const response = await api.delete(`/cart/remove/${itemId}`);
  return response.data;
};

export const clearCartApi = async (userId: number) => {
  const response = await api.delete(`/cart/clear/${userId}`);
  return response.data;
};