const root_uri = import.meta.env.VITE_ROOT_URI;


import { create } from "zustand";
import { UserObject } from "../types";
import Cookie from 'js-cookie'

interface AuthStore {
  accessToken: string | boolean;
  setAccessToken: (token: string | boolean) => void;
  userData: UserObject | any; // you can replace `unknown` with a proper type if you know the shape
  setUserData: (data: UserObject | boolean) => void;
}

const useAuth = create<AuthStore>((set) => ({
    accessToken: Cookie.get('accessToken') || false,
    setAccessToken: ((data: any) => set(() => ({ accessToken: data }))),
    userData: false,
     setUserData: ((data: any) => set(() => ({ userData: data }))),
}))


export default useAuth

export { root_uri }