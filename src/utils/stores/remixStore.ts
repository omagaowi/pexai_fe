import { create } from "zustand";

export interface MessageImage {
  origin: string | any;
  url: string | any;
  thumbnail: string | any;
  pexai_id: string | any;
}

export interface MessageType {
  text: string;
  role: string;
  chat_id: string;
  images: Array<MessageImage>;
}

export interface AlertType {
  image_id: string;
  chat_id: string;
  status: "completed" | "pending";
  user_id: string;
  thumbnail: string;
}

interface RemixStore {
  messages: Array<MessageType> | Array<any>;
  setMessages: (messages: Array<MessageType> | Array<any>) => void;
  alerts: Array<AlertType>;
  setAlerts: (messages: Array<AlertType> | Array<any>) => void;
  isGenerating: boolean | string;
  setIsGenerating: (isGenerating: boolean | string) => void;
}

const useRemixStore = create<RemixStore>((set) => ({
  messages: [],
  setMessages: (data: Array<MessageType>) => set(() => ({ messages: data })),
  alerts: [],
  setAlerts: (data: Array<AlertType>) => set(() => ({ alerts: data })),
  isGenerating: false,
  setIsGenerating: (data: boolean | string) => set(() => ({ isGenerating: data })),
}));

export default useRemixStore;
