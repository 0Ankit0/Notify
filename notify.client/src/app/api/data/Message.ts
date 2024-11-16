import axios from "axios";
import { Message as MessageSchema } from "@/utils/messageSchema";

const api = axios.create({
  baseURL:
    process.env.NOTIFY_API_URL || "https://localhost:44320/api" + "/Messages",
});

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
  message: MessageSchema
): Promise<MessageSchema> => {
  const response = await api.post("/Post", message);
  return response.data;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/Delete/${id}`);
};
