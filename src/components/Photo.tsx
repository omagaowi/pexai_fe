import { IPhotoProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Check, CheckCircle } from "lucide-react";

const Photo: React.FC<IPhotoProps> = ({ photo, width, detail }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(photo.width / photo.height);

  const { files, addFile, removeFile } = useFileUpload();
  const isSelected = files.find(function(el){ return el.file_id == photo.pexai_id })?.status == 'uploaded'? true : false

  

  const [imageHeight, setimageHeight] = useState(0);
  // let src = photo.urls.thumb;
  // if (width > 200 && width <= 400) {
  // 	src = photo.urls.small;
  // }

 

  useEffect(() => {
    if (detail) {
      setIsLoaded(true);
    }
  }, [detail]);

 

  return (
    <div
      className={
        !detail
          ? `w-full flex relative group justify-center h-full min-h-[${
              width / aspectRatio
            }]`
          : `h-full relative flex justify-center`
      }
    >
      {!isLoaded ? (
        <Skeleton className="h-full w-full absolute top-0 left-0 bg-[#dfdfdf] rounded-lg" />
      ) : (
        <></>
      )}
      <img
        src={photo.src ? photo.src.large : ""}
        alt={photo.alt || "Photo"}
        key={photo.pexai_id}
        style={{
          ...(detail
            ? { viewTransitionName: "image-expand" }
            : { viewTransitionName: "image-expand" }),
        }}
        onLoad={(e) => {
          setIsLoaded((prev) => true);
          setimageHeight(e.target.offsetHeight);
        }}
        loading="lazy"
        className={`bg-tourqoise-200  top-0 left-0 rounded-lg center_img transition-all delay-100 duration-300 ${
          isLoaded ? "opacity-[1]" : "opacity-[0]"
        }  ${detail ? "h-[100%]" : "w-[100%] absolute"}`}
      />
      {imageHeight > 0 ? (
        <div
          className={`absolute top-0 left-0 w-full bg-transparent transition-all duration-300   group-hover:bg-[rgb(0,0,0,.4)] rounded-lg right-0`}
          style={{
            height: `${imageHeight}px`,
          }}
        >
          <div
            style={{
              background: isSelected? `#fff` : `rgba(255, 255, 255, .5)`,
              backdropFilter: `blur(7px)`,
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const newFile = {
                file: false,
                status: "uploaded",
                error: false,
                url: photo.src.large,
                upload_id: "",
                file_id: photo.pexai_id,
                other: false,
                thumbnail_url: photo.src.small
              };
              if(isSelected){
                removeFile(photo.pexai_id)
              }else{
                 addFile(newFile)
              }
            }}
            className={` ${ isSelected? 'w-[110px]' : ' w-[90px]' } h-[40px] overflow-hidden flex flex-col cursor-pointer ${ isSelected? 'translate-y-0 opacity-100' : 'opacity-0 translate-y-[-30px] transition-all duration-300 group-hover:translate-y-[0] group-hover:opacity-100' }  rounded-full absolute top-[20px] right-[20px]`}
          >
            {/* <p className="text-[16px] text-[#080808]">Select</p> */}
            <div className={` ${  isSelected? 'mt-[-40px]' : 'mt-[0px]'  }  transition-all flex  shrink-0 items-center justify-center duration-300 w-full h-full`}>
              <p className="text-[16px] text-[#080808]">Select</p>
            </div>
            <div className="w-full h-full flex shrink-0 items-center justify-center ">
              <p className="text-[16px] text-[#080808]">Selected</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Photo;
