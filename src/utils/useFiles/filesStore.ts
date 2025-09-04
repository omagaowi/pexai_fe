import { create } from "zustand";

export interface FileType {
  file: File;
  status: string;
  error: any;
  url: string;
  file_id: string;
  other: any;
}

export interface ProgressType {
  file_id: string;
  progress: number;
}

export interface ControllerType {
  file_id: string;
  controller: AbortController;
}

export interface FileStore {
  files: Array<FileType>;
  setFiles: (files: Array<FileType> | Array<any>) => void;
  progress: Array<ProgressType>;
  setProgress: (files: Array<ProgressType> | Array<any>) => void;
  controllers: Array<ControllerType>
  setControllers: (files: Array<ControllerType> | Array<any>) => void;
}

const fileStore = create<FileStore>((set) => ({
  files: [],
  setFiles: (data: any) => set(() => ({ files: data })),
  progress: [],
  setProgress: (data: any) => set(() => ({ progress: data })),
  controllers: [],
  setControllers: (data: any) => set(() => ({ controllers: data })),
}));

export default fileStore;
