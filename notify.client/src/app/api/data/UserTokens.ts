import axios from "axios";
import CryptoJS from "crypto-js";
const api = axios.create({
    baseURL:
      process.env.NOTIFY_API_URL || "https://localhost:44320/api"+ "/UserTokens",
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

  export const generateNewToken = async (): Promise<string> => {
    const response = await api.put("/Put");
    return response.data;
  }