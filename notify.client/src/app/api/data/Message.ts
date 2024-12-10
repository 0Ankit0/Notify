import axios from "axios";
import { MessageSaveSchema, MessageSchema,MessageReportSchema } from "@/utils/messageSchema";
import CryptoJS from "crypto-js";
import { DateRange } from "react-day-picker";
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


// Add a response interceptor to log the response
api.interceptors.response.use(
   (response) => {
       console.log("Response:", response);
       return response;
   },
   (error) => {
       console.error("Response Error:", error);
       return Promise.reject(error);
   }
);
export const getMessages = async (): Promise<MessageSchema[]> => {
  const response = await api.get("/");
  return response.data;
};
export const getRecentMessages = async (): Promise<MessageSchema[]> => {
  const response = await api.get("/GetRecent");
  return response.data;
};

export const getStatusReport = async (dateRange:DateRange|undefined): Promise<MessageReportSchema[]> => {
  const response = await api.get("/GetStatusReport",{
    params:{
      startDate:dateRange?.from,
      endDate:dateRange?.to
    }
  });
  return response.data;
};

export const getMessage = async (id: string): Promise<MessageSchema> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const putMessage = async (message: MessageSchema): Promise<void> => {
  await api.put("/", message);
};

export const postMessage = async (
  message: Omit<MessageSaveSchema, "Id" | "CreatedAt">
): Promise<MessageSchema> => {
  const response = await api.post("/", message,{
    headers:{
      ApiToken:message.Provider
    }
  });
  return response.data;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};
