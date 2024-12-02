import axios from "axios";
import { MessageSchema } from "@/utils/messageSchema";
import CryptoJS from "crypto-js";
const api = axios.create({
  baseURL:
    process.env.NOTIFY_API_URL || "https://localhost:44320/api" + "/Messages",
});

// Add a request interceptor to include the authorization header
api.interceptors.request.use(
  (config) => {
    const encryptedSessionData = sessionStorage.getItem("sessionData");
    if (encryptedSessionData) {
      const bytes = CryptoJS.AES.decrypt(
        encryptedSessionData,
        process.env.NEXT_PUBLIC_SESSION_SECRET!
      );
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      config.headers.Authorization = `Bearer ${decryptedData.Token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export const getMessages = async (): Promise<MessageSchema[]> => {
  const response = await api.get("/Get");
  return response.data;
};

export const getMessage = async (id: string): Promise<MessageSchema> => {
  const response = await api.get(`/Get/${id}`);
  return response.data;
};

export const putMessage = async (message: MessageSchema): Promise<void> => {
  await api.put("/Put", message);
};

export const postMessage = async (
  message: Omit<MessageSchema, "Id" | "CreatedAt">
): Promise<MessageSchema> => {
  const response = await api.post("/Post", message);
  return response.data;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/Delete/${id}`);
};
