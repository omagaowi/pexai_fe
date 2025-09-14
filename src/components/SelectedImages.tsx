import useSelectedStore from "@/utils/stores/selectedStore";
import { Shuffle, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Skeleton } from "./ui/skeleton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CircularProgressBar from "./ui/CircularLoader";
import CircularLoader from "./LoaderCircular";
import { toast } from "sonner";
import useRemixStore from "@/utils/stores/remixStore";

const SeletectedImage = ({ image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { removeFile, setFiles, getProgress } = useFileUpload();

  const { id } = useParams()

  useEffect(() => {
    if (image.status == "error") {
      toast.error("Error Uploading File", {
        description: image.error.message || "Something went wrong",
      });
      removeFile(image.file_id);
    }
  }, [image.status]);

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
        src={
          image.status == "pending" ||
          image.status == "uploading" ||
          image.status == "error"
            ? URL.createObjectURL(image.file)
            : image.thumbnail_url
        }
        className={`w-[90%] rounded-md aspect-square object-cover absolute top-[50%] left-[50%] transition-all duration-200 ${
          isLoaded ? "" : "opacity-0"
        } translate-x-[-50%] translate-y-[-50%]`}
        onLoad={() => {
          setIsLoaded(true);
        }}
        alt=""
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

const SelectedImages = () => {
  const { isExpand, setIsExpand, isOpen, setIsOpen } = useSelectedStore();
  const { files, setFiles } = useFileUpload();
  const [items, setItems] = useState(
    files.length > 2 ? files.slice(0, 2) : files
  );

  const clickOutRef = useRef<HTMLDivElement>(null);

  const { alerts } = useRemixStore()

  const navigate = useNavigate()

  const handleClickOut = (event) => {
    if (clickOutRef.current && !clickOutRef.current.contains(event.target)) {
      setIsExpand(false);
    }
  };

  const location = useLocation();

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
      if(location.pathname.includes('auth')){
          setIsOpen(false)
      }
      if (location.pathname.includes("remix")) {
        if(location.pathname.includes("remixes")){
          setIsOpen(true)
        }else{
          setIsOpen(false)
        }
      }
      
    }
    if (isExpand) {
      setItems(files);
    } else {
      setItems(
        files.length > 2 ? files.slice(0, 2) : files
      );
    }
  }, [isExpand, files, location]);
  

  useEffect(() => {
//    // console.log(location.pathname.includes('remix') && location.pathname.includes())
     alerts.forEach((alert) => {
      if((location.pathname.includes('remix') && location.pathname.includes(alert.chat_id)) || location.pathname.includes('auth')){
        toast.dismiss(alert.chat_id)
      }else{
        toast.loading("Image generation in progress", {
        description: "click for more details",
        id: alert.chat_id,
        position: 'bottom-left',
        duration: Infinity
      });
      }
    });
  }, [location, alerts])

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
            isExpand ? "w-[95%] mt-[10px] gap-[10px]" : `w-[95px] gap-[5px]`
          }`}
          style={{
            display: "grid",
            gridTemplateColumns: isExpand
              ? "repeat(3, 1fr)"
              : `repeat(${items.length}, 1fr)`,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              layout
              transition={{ duration: 0.2 }}
              className="aspect-square flex items-center justify-center relative"
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
              <button className="w-[37px] h-[37px] flex border-none outline-none cursor-pointer items-center rounded-md justify-center hover:bg-[#e1e1e1] " onClick={ (e) => {
                navigate('/remix')
                e.stopPropagation()
              } }>
                <Shuffle size={17} className="" />
              </button>
              <button
                className="w-[37px] h-[37px] mx-[4px] flex border-none outline-none cursor-pointer items-center rounded-md justify-center hover:bg-[#e1e1e1] "
                onClick={(e) => {
                  e.stopPropagation()
                  setFiles([]);
                }}
              >
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
          <button className="w-[110px] cursor-pointer h-[40px] flex items-center justify-center bg-[#1e1e1e] mx-[7px] rounded-2xl text-[#fff] text-[14px]" onClick={ (e) => {
            e.stopPropagation()
            setIsExpand(false)
            navigate('/remix')
          } }>
            <Shuffle size={16} className="mr-[7px]" /> Remix
          </button>
          <button
            className="w-[40px] cursor-pointer  h-[40px] flex items-center justify-center bg-[red] mx-[7px] rounded-full text-[#fff] text-[14px]"
            onClick={() => {
              setFiles([]);
            }}
          >
            <X size={16} className="" />
          </button>
        </div>
      </motion.div>
    </LayoutGroup>
  );
};

export default SelectedImages;
