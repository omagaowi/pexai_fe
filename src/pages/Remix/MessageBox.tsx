import CircularLoader from "@/components/LoaderCircular";
import CircularProgressBar from "@/components/ui/CircularLoader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/utils/stores/aurhStore";
import useRemixStore from "@/utils/stores/remixStore";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Paperclip, Plus, Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";

const Selected = ({ image }) => {
  const { removeFile, getProgress } = useFileUpload();

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-[40px] h-[40px] bg-[#f0f0f0] relative shrink-0 flex mx-[5px] items-center justify-center rounded-md">
      <img
        src={
          image.status == "pending" ||
          image.status == "uploading" ||
          image.status == "error"
            ? URL.createObjectURL(image.file)
            : image.thumbnail_url
        }
        className={`w-[85%] rounded-md h-[85%] object-cover transition-all duration-200 ${
          isLoaded ? "" : "opacity-0"
        }`}
        alt=""
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
      {image.status == "uploading" ? (
        <div className="absolute top-[50%] w-[100%] h-[100%] bg-[rgb(0,0,0,.5)] rounded-md  left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center justify-center">
          {getProgress(image.file_id) &&
          (getProgress(image.file_id).progress == 100 ||
            getProgress(image.file_id).progress == 0) ? (
            <CircularLoader
              size={21}
              strokeWidth={1}
              color="#fff"
              bgColor="transparent"
              duration={2}
            />
          ) : (
            <CircularProgressBar
              percentage={
                getProgress(image.file_id)
                  ? getProgress(image.file_id).progress
                  : 0
              }
              size={24}
              strokeWidth={1.3}
              backgroundColor="transparent"
              color="#fff"
            />
          )}
        </div>
      ) : (
        <></>
      )}
      {image.status == "uploaded" ? (
        <div
          className="w-[15px] h-[15px] flex items-center cursor-pointer justify-center bg-red-500 absolute top-[-5px] right-[-5px] rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            removeFile(image.file_id);
          }}
        >
          <X size={11} className="text-white" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const MessageBox = ({ active }) => {
 
  const { files, setFiles } = useFileUpload();

  const { id } = useParams();

 

  const findOrigin = (file_id: string) => {
    if (file_id.split("@").length == 2) {
      if (file_id.split("@")[0] == "pxls") {
        return "pexels";
      } else if (file_id.split("@")[0] == "upsh") {
        return "unsplash";
      } else if (file_id.split("@")[0] == "pxai") {
        return "pexai";
      } else if (file_id.split("@")[0] == "freepik") {
        return "freepik";
      }
    } else {
      return "file";
    }
  };

  const navigate = useNavigate();

  const { isConnected, clientSocket } = useAuth();

  const { setMessages, messages, isGenerating, setIsGenerating } =
    useRemixStore();

  const [messageText, setMessageText] = useState("");

  const sendMessage = () => {
 
    const chat_id = id || uuidv4();
 
    if (messageText && chat_id) {
      if (active) {
        const newMessage = {
          role: "user",
          chat_id: chat_id,
          key: localStorage.getItem("key")
            ? JSON.parse(localStorage.getItem("key")).key
            : false,
          text: messageText,
          images: files.map((file) => ({
            pexai_id: file.file_id,
            origin: findOrigin(file.file_id),
            url: file.url,
            thumbnail: file.thumbnail_url,
          })),
        };
        setMessages([...messages, newMessage]);

        clientSocket.emit("message", newMessage);
        setFiles([]);
        setIsGenerating(true);
        navigate(`/remix/${chat_id}`);
        setMessageText('')
      }else{
        toast.error('You do not have full access to this chat')
      }
    }
  };

  return (
    <div
      className={`absolute bottom-[20px] ${
        !active
          ? "pointer-events-none"
          : "opacity-100 pointer-events-all"
      } flex flex-col rounded-md border-[1px] bg-[#fff] border-[#f0f0f0] w-full transition-all duration-200 ${
        files.length > 0 ? "h-[150px]" : "h-[115px] pt-[7px]"
      }  shadow-sm`}
    >
      <div
        className={`max-w-[200px] transition-all duration-150 w-[95%] ${
          files.length > 0 ? "h-[50px]  ml-[10px]" : "h-[0px]  ml-[0px]"
        } overflow-y-hidden no-scrollbar  items-end flex`}
      >
        {files.map((file) => (
          <Selected image={file} />
        ))}
      </div>
      <textarea
        name=""
        id=""
        value={messageText}
        onChange={(e) => {
          setMessageText(e.target.value);
        }}
        placeholder="Ask remix to edit your image"
        className={`w-full placeholder:text-[13px] no-scrollbar text-[13px] flex-1 resize-none p-[15px] pt-[10px]     border-none outline-none`}
      ></textarea>
      <div className="w-full h-[40px] flex justify-end">
        <Tooltip>
          <TooltipTrigger className="w-[30px] mr-[10px]  h-[30px]">
            <button className="cursor-pointer w-full h-full transition-all duration-200  hover:bg-[#dedede]  rounded-sm flex items-center justify-center">
              <label htmlFor="files_input">
                <Paperclip size={16} className="text-[#484848]" />
              </label>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[9px]">Add image from files</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="w-[30px] mr-[10px]  h-[30px]">
            <button
              className="cursor-pointer w-full h-full transition-all duration-200  hover:bg-[#dedede]  rounded-sm flex items-center justify-center"
              onClick={() => {
                navigate("/");
              }}
            >
              <Plus size={20} className="text-[#484848]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[9px]">Add image from pexai</p>
          </TooltipContent>
        </Tooltip>
        <button
          className={`w-[30px] mr-[10px]   rounded-sm bg-[#1b1b1b] flex items-center justify-center h-[30px] ${
            isConnected
              ? "pointer-events-all cursor-pointer"
              : "cursor-not-allowed opacity-[.6] pointer-events-none"
          } `}
          onClick={() => {
            if (!isGenerating) {
              sendMessage();
            }
          }}
        >
          {isGenerating ? (
            <CircularLoader
              size={15}
              bgColor={"transparent"}
              color={"#fff"}
              duration={2}
              strokeWidth={1}
            />
          ) : (
            <Send size={13} className="text-[#e4e4e4]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
