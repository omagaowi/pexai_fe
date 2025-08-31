import { IPhotoProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const Photo: React.FC<IPhotoProps> = ({ photo, width, detail }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(photo.width / photo.height);
  // let src = photo.urls.thumb;
  // if (width > 200 && width <= 400) {
  // 	src = photo.urls.small;
  // }

 console.log(isLoaded)
 

  useEffect(() => {
    if(detail){
      setIsLoaded(true)
    }
  }, [detail])

  return (
    <div
      className={
        !detail ? `w-full flex relative justify-center h-full min-h-[${width / aspectRatio}]` : `h-full  flex justify-center`
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
        key={ photo.pexai_id }
        style={{
          ...(detail
            ? { viewTransitionName: "image-expand" }
            : {  viewTransitionName: "image-expand" }),
        }}
        onLoad={() => {
          setIsLoaded((prev) => true);
        }}
        loading="lazy"
        className={`bg-tourqoise-200  top-0 left-0 rounded-lg center_img transition-all delay-100 duration-300 ${ isLoaded? 'opacity-[1]' : 'opacity-[0]' }  ${ detail? 'h-[100%]' : 'w-[100%] absolute' }`}
      />
    </div>
  );
};

export default Photo;
