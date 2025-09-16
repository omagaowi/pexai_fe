import { create } from "zustand";
import { IPhoto } from "../types";

interface ImageStore {
    photos: Array<IPhoto>,
    setPhotos: (data: Array<IPhoto> | Array<any>) => void;
    activeImage: IPhoto | any
    setActiveImage: (data: IPhoto | any) => void;
}

const useImageStore = create<ImageStore>((set) => ({
    photos: [],
    setPhotos: ((data: any) => set(() => ({ photos: data }))),
    activeImage: false,
    setActiveImage: ((data: any) => set(() => ({ activeImage: data })))
}))


export default useImageStore