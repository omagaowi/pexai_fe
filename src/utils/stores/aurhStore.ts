const root_uri = import.meta.env.VITE_ROOT_URI;
const socket_uri = import.meta.env.VITE_SOCKET_URI;

import { create } from "zustand";
import { UserObject } from "../types";
import Cookie from "js-cookie";
import { io, Socket } from "socket.io-client";

interface AuthStore {
  accessToken: string | boolean;
  setAccessToken: (token: string | boolean) => void;
  userData: UserObject | any; // you can replace `unknown` with a proper type if you know the shape
  setUserData: (data: UserObject | boolean) => void;
  clientSocket: Socket;
  setClientSocket: (clientSocket: any) => void;
  isConnected: boolean,
  setIsConnected: (isConnected: any) => void;
}

const useAuth = create<AuthStore>((set) => ({
  accessToken: Cookie.get("accessToken") || false,
  setAccessToken: (data: any) => set(() => ({ accessToken: data })),
  userData: false,
  setUserData: (data: any) => set(() => ({ userData: data })),
  clientSocket: null,
  setClientSocket: (data) =>
    set((state) => ({
      clientSocket: data,
    })),
  isConnected: false,
  setIsConnected: (data: any) => set(() => ({ isConnected: data })),
}));

export default useAuth;

export { root_uri, socket_uri };
