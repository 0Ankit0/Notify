import axios from "axios";
import { ProviderSchema } from "@/utils/providerSchema";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
dotenv.config();

const api = axios.create({
    baseURL:
        process.env.NOTIFY_API_URL || "https://localhost:44320/api" + "/Providers",
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
// api.interceptors.response.use(
//    (response) => {
//        console.log("Response:", response);
//        return response;
//    },
//    (error) => {
//        console.error("Response Error:", error);
//        return Promise.reject(error);
//    }
// );

export const getProviders = async (): Promise<ProviderSchema[]> => {
    const response = await api.get("/Get");
    return response.data;
};

export const getProvider = async (id: string): Promise<ProviderSchema> => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const putProvider = async (provider: ProviderSchema): Promise<void> => {
    await api.put("/", provider);
};

export const postProvider = async (
    provider: ProviderSchema
): Promise<ProviderSchema> => {
    const response = await api.post("/", provider);
    return response.data;
};

export const deleteProvider = async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
};
