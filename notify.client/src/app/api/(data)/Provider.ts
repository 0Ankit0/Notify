import axios from "axios";
import { ProviderSchema } from "@/utils/providerSchema";
import dotenv from "dotenv";
dotenv.config();

const api = axios.create({
  baseURL:
    process.env.NOTIFY_API_URL || "https://localhost:44320/api" + "/Providers",
});

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
