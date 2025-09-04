import useSelectedStore from "@/utils/stores/selectedStore";
import { Shuffle, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Skeleton } from "./ui/skeleton";

const SeletectedImage = ({ image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { removeFile, setFiles } = useFileUpload();

  return (
    <div className="w-full relative flex items-center justify-center h-full">
      {!isLoaded ? (
        <div className="absolute top-0 left-0 w-full h-full">
          <Skeleton
            className={`h-full w-full absolute top-0 left-0 transition-all duration-200 bg-[#dfdfdf] rounded-lg`}
          />
        </div>
      ) : (
        <></>
      )}

      <img
        src={image.thumbnail_url}
        className={`w-[90%] rounded-md aspect-square object-cover absolute top-[50%] left-[50%] transition-all duration-200 ${
          isLoaded ? "" : "opacity-0"
        } translate-x-[-50%] translate-y-[-50%]`}
        onLoad={() => {
          setIsLoaded(true);
        }}
        alt=""
      />
      <div
        className="w-[15px] h-[15px] flex items-center cursor-pointer justify-center bg-red-500 absolute top-[-5px] right-[-5px] rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          removeFile(image.file_id);
        }}
      >
        <X size={11} className="text-white" />
      </div>
    </div>
  );
};

const SelectedImages = () => {
  const { isExpand, setIsExpand, isOpen, setIsOpen } = useSelectedStore();
  const { files, setFiles } = useFileUpload();
  const [items, setItems] = useState(
    files.length > 2 ? files.reverse().slice(0, 2) : files
  );

  const clickOutRef = useRef<HTMLDivElement>(null);

  const handleClickOut = (event) => {
    if (clickOutRef.current && !clickOutRef.current.contains(event.target)) {
      setIsExpand(false);
    }
  };

  useEffect(() => {
    if (files.length == 0) {
      if (isExpand) {
        setIsOpen(false);
        setIsExpand(false);
      } else {
        setTimeout(() => {
          setIsOpen(false);
        }, 500);
      }
    } else {
      setIsOpen(true);
    }
    if (isExpand) {
      setItems(files);
    } else {
      setItems(files.length > 2 ? files.reverse().slice(0, 2) : files);
    }
  }, [isExpand, files]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOut);

    return () => document.removeEventListener("mousedown", handleClickOut);
  }, []);

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ duration: 0.3 }}
        ref={clickOutRef}
        onClick={() => {
          if (!isExpand) {
            setIsExpand(true);
          }
        }}
        className={`fixed rounded-md flex z-[9999] no-scrollbar  border border-[#f2f2f2] bg-white shadow-lg cursor-pointer
          ${`${
            isOpen
              ? `pointer-events-all ${
                  isExpand
                    ? "top-1/2 left-1/2 pb-[20px] overflow-x-hidden -translate-x-1/2 flex-col -translate-y-1/2 w-[400px] h-[250px] items-center"
                    : `top-[70px] right-[20px] ${
                        files.length > 2
                          ? "w-[210px]"
                          : files.length == 2
                          ? "w-[180px]"
                          : files.length == 1
                          ? "w-[130px]"
                          : "w-[90px]"
                      }  h-[50px] items-center pl-[3px]`
                }`
              : " top-[70px] pointer-events-none right-[20px] opacity-0 translate-y-[-50px]"
          }`}`}
      >
        {/* Image grid */}
        <div
          className={`  transition-all duration-150 ${
            isExpand ? "w-[95%] h-fit " : "opacity-0 w-0 h-0 overflow-hidden"
          } `}
        >
          <h3 className="text-[23px] mt-[10px] text-[#373737]">
            {files.length} Selected
          </h3>
        </div>
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className={`grid  ${
            isExpand
              ? "grid-cols-3 w-[95%] mt-[10px] gap-[10px]"
              : `grid-cols-${items.length} w-[95px] gap-[5px]`
          }`}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              layout
              transition={{ duration: 0.2 }}
              className="aspect-square relative flex items-center justify-center relative"
            >
              <SeletectedImage image={item} />
            </motion.div>
          ))}
        </motion.div>

        {/* +count indicator */}
        {!isExpand && (
          <>
            {files.length > 2 ? (
              <motion.div
                layout
                transition={{ duration: 0.3 }}
                className="w-[25px] h-[35px] ml-2 flex items-center text-gray-500 cursor-pointer hover:text-black"
                title="expand"
              >
                +{files.length - 2}
              </motion.div>
            ) : (
              <></>
            )}

            <motion.div
              layout
              transition={{ duration: 0.3 }}
              className="w-[90px] ml-[5px] h-full flex items-center justify-center"
            >
              <button className="w-[37px] h-[37px] flex border-none outline-none cursor-pointer items-center rounded-md justify-center hover:bg-[#e1e1e1] ">
                <Shuffle size={17} className="" />
              </button>
              <button className="w-[37px] h-[37px] mx-[4px] flex border-none outline-none cursor-pointer items-center rounded-md justify-center hover:bg-[#e1e1e1] " onClick={ () => {
                setFiles([])
              } }>
                <X size={19} className="text-[red]" />
              </button>
            </motion.div>
          </>
        )}
        <div
          className={` w-full h-fit ${
            isExpand ? "flex" : "hidden"
          } items-center mt-[15px] justify-center`}
        >
          <button className="w-[110px] cursor-pointer h-[40px] flex items-center justify-center bg-[#1e1e1e] mx-[7px] rounded-2xl text-[#fff] text-[14px]">
            <Shuffle size={16} className="mr-[7px]" /> Remix
          </button>
          <button className="w-[40px] cursor-pointer  h-[40px] flex items-center justify-center bg-[red] mx-[7px] rounded-full text-[#fff] text-[14px]" onClick={  () => {
              setFiles([])
          } }>
            <X size={16} className="" />
          </button>
        </div>
      </motion.div>
    </LayoutGroup>
  );
};

export default SelectedImages;
