import { IPhotoProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Check, CheckCircle, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import axios from "axios";
import useImageStore from "@/utils/stores/imageStore";
import { toast } from "sonner";

const Photo: React.FC<IPhotoProps> = ({ photo, width, detail }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(photo.width / photo.height);

  const [liked, setLiked] = useState<boolean>(photo.liked);

  const { photos, setPhotos } = useImageStore();

  const { accessToken } = useAuth();

  const toggleLikeImageMutataion = useMutation({
    mutationKey: ["collection", "like"],
    mutationFn: () => {
      return axios.get(
        `${root_uri}/likes/photos/${photo.pexai_id}/toggle?thumbnail=${
          photo.src.large || photo.src.original
        }`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onMutate: () => {
      // setIsLoading(true)
    },
    onSuccess: (data) => {},
    onError: (error) => {
      const dummy = [...photos];
      const thisImage = dummy.find(function (el) {
        return el.pexai_id == photo.pexai_id;
      });
      dummy[dummy.indexOf(thisImage)].liked = !thisImage.liked;
      setPhotos(dummy);
      setLiked((prev) => !prev);
      // setIsLoading(true)
    },
  });

  const { files, addFile, removeFile } = useFileUpload();
  const isSelected =
    files.find(function (el) {
      return el.file_id == photo.pexai_id;
    })?.status == "uploaded"
      ? true
      : false;

  const [imageHeight, setImageHeight] = useState(
    () => width * (photo.height / photo.width)
  );

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
          setImageHeight(e.target.offsetHeight);
        }}
        loading="lazy"
        className={`bg-tourqoise-200  top-0 left-0 rounded-lg center_img transition-all delay-100 duration-300 ${
          isLoaded ? "opacity-[1]" : "opacity-[0]"
        }  ${detail ? "h-[100%]" : "w-[100%] absolute"}`}
      />
      {/* {imageHeight > 0 ? ( */}

      <div
        className={`absolute top-0 left-0 w-full bg-transparent transition-all duration-300 h-[${imageHeight}px]  group-hover:bg-[rgb(0,0,0,.4)] rounded-lg right-0`}
        style={{
          height: `${imageHeight}px`,
        }}
      >
        <div className="absolute top-[20px] left-[20px] w-[50px] flex items-center justify-center rounded-md h-[50px] bg-[rgb(0,0,0,.4)]">
          <img
            src={`/assets/images/${
              photo.origin == "pexels"
                ? "pxls"
                : photo.origin == "unsplash"
                ? "unph"
                : photo.origin == "frepk"
                ? "frepk"
                : ""
            }.png`}
            className="w-[60%]"
            alt=""
          />
        </div>
        <div
          style={{
            background: isSelected ? `#fff` : `rgba(255, 255, 255, .5)`,
            backdropFilter: `blur(7px)`,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newFile = {
              file: false,
              status: "uploaded",
              error: false,
              url: photo.src.large,
              upload_id: "",
              file_id: photo.pexai_id,
              other: false,
              thumbnail_url: photo.src.small || photo.src.original,
            };
            if (isSelected) {
              removeFile(photo.pexai_id);
            } else {
              addFile(newFile);
            }
          }}
          className={` ${
            isSelected ? "w-[110px]" : " w-[90px]"
          } h-[40px] overflow-hidden flex flex-col cursor-pointer ${
            isSelected
              ? "translate-y-0 opacity-100"
              : "opacity-0 translate-y-[-30px] transition-all duration-300 group-hover:translate-y-[0] group-hover:opacity-100"
          }  rounded-full absolute top-[20px] right-[20px]`}
        >
          {/* <p className="text-[16px] text-[#080808]">Select</p> */}
          <div
            className={` ${
              isSelected ? "mt-[-40px]" : "mt-[0px]"
            }  transition-all flex  shrink-0 items-center justify-center duration-300 w-full h-full`}
          >
            <p className="text-[16px] text-[#080808]">Select</p>
          </div>
          <div className="w-full h-full flex shrink-0 items-center justify-center ">
            <p className="text-[16px] text-[#080808]">Selected</p>
          </div>
        </div>
        {!detail && isLoaded ? (
          <>
            <div
              className={`absolute bottom-[20px] transition-all flex-col duration-200 translate-y-[30px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 right-[20px] w-[50px]  flex overflow-hidden rounded-md h-[50px] bg-[rgb(0,0,0,.4)]`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (accessToken) {
                  toggleLikeImageMutataion.mutate();
                  const dummy = [...photos];
                  const thisImage = dummy.find(function (el) {
                    return el.pexai_id == photo.pexai_id;
                  });
                  dummy[dummy.indexOf(thisImage)].liked = !thisImage.liked;
                  setPhotos(dummy);
                  setLiked((prev) => !prev);
                }else{
                  toast.warning('Login to like photos')
                }
              }}
            >
              <div
                className={`w-full h-[50px] shrink-0 flex items-center justify-center transition-all duration-200 ${
                  liked ? "mt-[-50px]" : "mt-[0px]"
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-heart text-[#fff] w-[20px] font-bold h-[20px]"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              </div>
              <div className="w-full h-full shrink-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-heart-fill text-[#fff] w-[20px] font-bold h-[20px]"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                  />
                </svg>
              </div>
            </div>
            {/* <div className="absolute bottom-[20px] delay-100 transition-all duration-200 translate-y-[30px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 right-[90px] w-[50px] flex items-center justify-center rounded-md h-[50px] bg-[rgb(0,0,0,.4)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-bookmark text-[#fff] w-[20px] font-bold h-[20px]"
                viewBox="0 0 16 16"
              >
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
              </svg>
            </div> */}
          </>
        ) : (
          <></>
        )}
      </div>
      {/* ) : (
        <></>
      )} */}
    </div>
  );
};

export default Photo;
