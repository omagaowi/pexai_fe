import { IPhotoProps } from "@/utils/types";
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";

const Photo: React.FC<IPhotoProps> = ({ photo, width, detail }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(photo.width / photo.height);
  // let src = photo.urls.thumb;
  // if (width > 200 && width <= 400) {
  // 	src = photo.urls.small;
  // }

  // console.log(photo)

  return (
    <div
      className={
        !detail ? `w-full flex justify-center h-fit min-h-[${width / aspectRatio}]` : `h-full flex justify-center`
      }
    >
      {!isLoaded ? (
        <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
      ) : (
        <></>
      )}
      <img
        src={photo.src ? photo.src.large : ""}
        alt={photo.alt || "Photo"}
        style={{
          ...(detail
            ? { viewTransitionName: "image-expand" }
            : {  viewTransitionName: "image-expand" }),
        }}
        onLoad={() => {
          setIsLoaded((prev) => true);
        }}
        loading="lazy"
        className={`bg-tourqoise-200 rounded-lg center_img ${ detail? 'h-[100%]' : 'w-[100%]' }`}
      />
    </div>
  );
};

export default Photo;
