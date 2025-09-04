import { create } from "zustand";

interface SelectedStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isExpand: boolean;
  setIsExpand: (isOpen: boolean) => void;
}

const useSelectedStore = create<SelectedStore>((set) => ({
  isOpen: true,
  setIsOpen: (data: boolean) => set(() => ({ isOpen: data })),
  isExpand: false,
  setIsExpand: (data: boolean) => set(() => ({ isExpand: data })),
}));

export default useSelectedStore;
