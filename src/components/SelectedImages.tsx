import useSelectedStore from "@/utils/stores/selectedStore";
import { Shuffle, X } from "lucide-react";
import React from "react";

const SelectedImages = () => {

    const { isOpen, isExpand, setIsExpand } = useSelectedStore()

  return (
    <div className={`fixed top-[70px] rounded-md flex items-center z-9999 w-[210px] h-[50px]  ${ isOpen? 'translate-x' : '' } border-[1px] border-[#f2f2f2] right-[30px] bg-[#ffffff] shadow-lg`}>
      <div className="w-fit h-full flex items-center ml-[4px]">
        <div className="w-[35px] mx-[4px] h-[35px] relative">
          <img
            src="/assets/images/img2.jpg"
            className="w-full rounded-md h-full object-fit"
            alt=""
          />
          <div className="w-[15px] h-[15px] flex items-center cursor-pointer justify-center bg-[red] absolute top-[-5px] right-[-5px] rounded-full">
                <X size={11} className="text-[#fff]" />
          </div>
        </div>
        <div className="w-[35px] h-[35px] mx-[4px]">
          <img
            src="/assets/images/img2.jpg"
            className="w-full rounded-md h-full object-fit"
            alt=""
          />
        </div>
        <div className="w-[25px] h-[35px] flex items-center text-[gray] cursor-pointer hover:text-[black]" title="expand">
          +3
        </div>
      </div>
      <div className="w-[90px] ml-[5px] h-full flex items-center justify-center">
        <button className="w-[37px] h-[37px] flex border-none outline-none cursor-pointer items-center rounded-md justify-center hover:bg-[#e1e1e1] ">
          <Shuffle size={17} className="" />
        </button>
        <button className="w-[37px] h-[37px] mx-[4px] flex border-none outline-none cursor-pointer items-center rounded-md justify-center hover:bg-[#e1e1e1] ">
          <X size={19} className="text-[red]" />
        </button>
      </div>
    </div>
  );
};

export default SelectedImages;
