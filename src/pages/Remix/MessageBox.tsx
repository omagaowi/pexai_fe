import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Paperclip, Plus, Send } from "lucide-react";
import React from "react";

const MessageBox = () => {

  const { files } = useFileUpload()

  console.log(files)

  return (
    <div className="absolute bottom-[20px] flex flex-col rounded-md border-[1px] bg-[#fff] border-[#f0f0f0] w-full h-[150px] shadow-sm">
      <div className="max-w-[200px] ml-[10px] w-[95%] overflow-y-hidden no-scrollbar h-[50px] items-end flex">
        <div className="w-[40px] h-[40px] bg-[#f0f0f0] shrink-0 flex mx-[5px] items-center justify-center rounded-md">
          <img
            src="/assets/images/img1.jpg"
            className="w-[85%] rounded-md h-[85%] object-cover"
            alt=""
          />
        </div>
      </div>
      <textarea
        name=""
        id=""
        placeholder="Ask remix to edit your image"
        className="w-full placeholder:text-[13px] no-scrollbar text-[13px] flex-1 resize-none p-[15px] pt-[10px]    border-none outline-none"
      ></textarea>
      <div className="w-full h-[40px] flex justify-end">
        <Tooltip>
          <TooltipTrigger className="w-[30px] mr-[10px]  h-[30px]">
            <button className="cursor-pointer w-full h-full transition-all duration-200  hover:bg-[#dedede]  rounded-sm flex items-center justify-center">
              <Paperclip size={16} className="text-[#484848]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[9px]">Add image from files</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="w-[30px] mr-[10px]  h-[30px]">
            <button className="cursor-pointer w-full h-full transition-all duration-200  hover:bg-[#dedede]  rounded-sm flex items-center justify-center">
              <Plus size={20} className="text-[#484848]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[9px]">Add image from pexai</p>
          </TooltipContent>
        </Tooltip>
        <button className="w-[30px] mr-[10px] cursor-pointer  rounded-sm bg-[#1b1b1b] flex items-center justify-center h-[30px]">
          <Send size={13} className="text-[#e4e4e4]" />
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
