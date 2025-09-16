import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fileStore from "./filesStore";
import { tryCatch } from "../tryCatch";

const pinata_token = import.meta.env.VITE_PINATA_AUTH_TOKEN;
const pinata_gateway_url = import.meta.env.VITE_PINATA_GATEWAY_URL;

export type FileStatus =
  | "pending"
  | "uploading"
  | "uploaded"
  | "error"
  | "cancelled";

export interface FileType {
  file: File | boolean;
  file_id: string;
  status: string;
  url?: string | false;
  error?: any;
  upload_id: string;
  thumbnail_url: string | false;
}

export interface ProgressType {
  file_id: string;
  progress: number;
}

export interface ControllerType {
  file_id: string;
  controller: AbortController;
}

export interface UseFileUploadReturn {
  files: Array<FileType>;
  progress: Array<ProgressType>;
  setFiles: (files: Array<FileType>) => void;
  uploadFile: (file: FileType) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteFile: (upload_id: string, file_id: string) => Promise<string>;
  removeFile: (file_id: string) => void;
  getProgress: (file_id: string) => ProgressType | any;
  addFile: (file: FileType) => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const {
    files,
    setFiles,
    progress,
    setProgress,
    setControllers,
    controllers,
  } = fileStore();

  const getURI = async (data) => {
    try {
      const body = {
        url: `${pinata_gateway_url}/files/${data.cid}`,
        date: Date.now(),
        expires: 86400,
        method: "GET",
      };
      const response = await axios.post(
        "https://api.pinata.cloud/v3/files/sign",
        body,
        {
          headers: {
            Authorization: `Bearer ${pinata_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const uploadData = async (
    allProgress: Array<ProgressType>,
    formData: FormData,
    controller: AbortController,
    file_id: string
  ) => {
    try {
      const response = await axios.post(
        "https://uploads.pinata.cloud/v3/files",
        formData,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${pinata_token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            const thisProgress = allProgress.find(function (el: ProgressType) {
              return el.file_id == file_id;
            });
            const index = allProgress.indexOf(thisProgress);

            allProgress[index].progress = percentCompleted;

            setProgress(allProgress);
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const uploadFile = (file: FileType) => {
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("name", file.file.name);
    const dummyProgress = [...progress];
    const dummyFiles = [...files];
    const thisFile = dummyFiles.find(function (el: FileType) {
      return el.file_id == file.file_id;
    });
    dummyFiles[dummyFiles.indexOf(thisFile)].status = "uploading";
    setFiles(dummyFiles);
    const dummyControllers = [...controllers];
    const thisController = dummyControllers.find(function (el: ControllerType) {
      return el.file_id == file.file_id;
    });
    uploadData(dummyProgress, formData, thisController.controller, file.file_id)
      .then((data: any) => {
        getURI(data.data.data)
          .then((result) => {
            const dummyFiles = [...files];
            const thisFile = dummyFiles.find(function (el: FileType) {
              return el.file_id == file.file_id;
            });
            dummyFiles[dummyFiles.indexOf(thisFile)].status = "uploaded";
            dummyFiles[dummyFiles.indexOf(thisFile)].url = result.data;
            dummyFiles[dummyFiles.indexOf(thisFile)].thumbnail_url =
              result.data;
            dummyFiles[dummyFiles.indexOf(thisFile)].upload_id =
              data.data.data.cid;
            sessionStorage.setItem(
              "files",
              JSON.stringify(
                dummyFiles.filter(function (el) {
                  return el.status == "uploaded";
                })
              )
            );
            setFiles(dummyFiles);
          })
          .catch((error) => {
            const dummyFiles = [...files];
            const thisFile = dummyFiles.find(function (el: FileType) {
              return el.file_id == file.file_id;
            });
            if (axios.isCancel(error)) {
              dummyFiles[dummyFiles.indexOf(thisFile)].status = "cancelled";
              setFiles(dummyFiles);
            } else {
              dummyFiles[dummyFiles.indexOf(thisFile)].status = "error";
              dummyFiles[dummyFiles.indexOf(thisFile)].error = error;
              setFiles(dummyFiles);
            }
          });
      })
      .catch((error) => {
        const dummyFiles = [...files];
        const thisFile = dummyFiles.find(function (el: FileType) {
          return el.file_id == file.file_id;
        });
        if (axios.isCancel(error)) {
          dummyFiles[dummyFiles.indexOf(thisFile)].status = "cancelled";
          setFiles(dummyFiles);
        } else {
          dummyFiles[dummyFiles.indexOf(thisFile)].status = "error";
          dummyFiles[dummyFiles.indexOf(thisFile)].error = error;
          setFiles(dummyFiles);
        }
      });
  };

  const getProgress = (file_id: string) => {
    const thisProgress = progress.find(function (el) {
      return el.file_id == file_id;
    });
    return thisProgress || false;
  };


  const removeFile = (file_id: string) => {
    const newFiles = [...files].filter(function (el) {
      return el.file_id != file_id;
    });
    sessionStorage.setItem(
      "files",
      JSON.stringify(
        newFiles.filter(function (el) {
          return el.status == "uploaded";
        })
      )
    );
    setFiles(newFiles);
  };

  const addFile = (file: FileType) => {
//    console.log(file)
    const dummyFiles = [...files, file];
    sessionStorage.setItem(
      "files",
      JSON.stringify(
        dummyFiles.filter(function (el) {
          return el.status == "uploaded";
        })
      )
    );
    setFiles(dummyFiles);
  };

//  console.log(files)

  const deleteFile = async (
    upload_id: string,
    file_id: string
  ): Promise<string> => {
    const url = `https://api.pinata.cloud/v3/files/${upload_id}`;
    const { data: deleteData, error: deleteError } = await tryCatch(
      axios.delete(url, {
        headers: {
          Authorization: `Bearer ${pinata_token}`,
        },
      })
    );

    if (deleteError) {
      throw deleteError;
    }

    removeFile(file_id);

    return "success";
  };
  useEffect(() => {
    files.forEach((file) => {
      if (file.status == "pending") {
        uploadFile(file);
        //uploadFile
      } else {
      }
    });
    if(files.length ==  0){
      sessionStorage.setItem('files', JSON.stringify([]))
    }
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles = e.target.files as FileList;
    let newFiles = [];
    let newProgress = [];
    let newControllers = [];
    for (let index = 0; index < allFiles.length; index++) {
      const file_id = uuidv4();
      const element = allFiles[index];
      newFiles.push({
        file: element,
        status: "pending",
        error: false,
        url: false,
        upload_id: "",
        file_id: file_id,
        other: false,
        thumbnail_url: false,
      });
      newProgress.push({
        file_id: file_id,
        progress: 0,
      });
      const controller = new AbortController();
      newControllers.push({
        file_id: file_id,
        controller: controller,
      });
    }
    sessionStorage.setItem(
      "files",
      JSON.stringify(
        [...files, ...newFiles].filter(function (el) {
          return el.status == "uploaded";
        })
      )
    );
    setFiles([...files, ...newFiles]);
    setProgress([...progress, ...newProgress]);
    setControllers([...controllers, ...newControllers]);
  };
  return {
    files,
    progress,
    setFiles,
    uploadFile,
    handleFileChange,
    deleteFile,
    removeFile,
    getProgress,
    addFile,
  };
};
