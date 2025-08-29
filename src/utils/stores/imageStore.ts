import { create } from "zustand";

const useImageStore = create((set) => ({
    activeImage: false,
    setActiveImage: ((data: any) => set(() => ({ activeImage: data })))
}))


export default useImageStore