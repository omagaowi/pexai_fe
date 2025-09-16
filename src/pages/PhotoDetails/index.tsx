import CircularLoader from "@/components/LoaderCircular";
import Photo from "@/components/Photo";
import { ModalContext } from "@/contexts/ModalContext";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import useImageStore from "@/utils/stores/imageStore";
import { IPhoto } from "@/utils/types";
import useViewDimensions from "@/utils/useViewDimensions";
import { useMutation, useMutationState } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowBigDown,
  ArrowDown,
  ArrowDownToLine,
  Bookmark,
  BookmarkCheck,
  ChartAreaIcon,
  ClosedCaption,
  Coins,
  Download,
  ExternalLink,
  Heart,
  Layers,
  LayoutGrid,
  MessageSquare,
  Plus,
  PlusCircle,
  Save,
  Shuffle,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CollectionModal } from "./CollectionModal";
import CentralGrid from "@/components/CentralGrid";
import { downloadImage } from "@/lib/utils";
import { useFileUpload } from "@/utils/useFiles/fileUtils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const PhotoDetailsPage = () => {
  const { activeImage, setActiveImage } = useImageStore();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialWidth, setInitialWidth] = useState<number>(0);
  const { accessToken } = useAuth();
  // const [currentWidth, setCurrentWidth] = useState<number>(0);

  const { userData } = useAuth();

  const detailRef = useRef<HTMLDivElement>(null);

  const { width } = useViewDimensions();

  const [coillected, setCollected] = useState(false);
  const [liked, setLiked] = useState(false);

  const [orientation, setOrientation] = useState<string>("portrait");

  const { addFile, files } = useFileUpload();

  const { openModal, closeModal } = useContext(ModalContext);

  const { id } = useParams();

  const mutationKey = ["images", id];

  const parentRef = useRef<HTMLDivElement | null>(null);

  const page = `${id}_remixes`;
  const remixMutationKey = ["remixes", id];
  const api_url = `${root_uri}/remixes/${id}`;

  const navigate = useNavigate();
  const location = useLocation();

  const useQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  const query = useQueryParams();

  const toggleSaveImageMutataion = useMutation({
    mutationKey: ["collection", "toggle"],
    mutationFn: () => {
      return axios.get(
        `${root_uri}/collections/${userData.user_id}/photos/${id}/toggle?thumbnail=${activeImage.src.large}`,
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
      closeModal();
      setCollected((prev) => !prev);
      // setIsLoading(true)
    },
  });

  const toggleLikeImageMutataion = useMutation({
    mutationKey: ["collection", "like"],
    mutationFn: () => {
      return axios.get(
        `${root_uri}/likes/photos/${id}/toggle?thumbnail=${activeImage.src.large}`,
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
      setLiked((prev) => !prev);
      // setIsLoading(true)
    },
  });

  const getImageMutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: () => {
      return axios.get(`${root_uri}/images/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setCollected(data.data.saved);
      setLiked(data.data.liked);
      setLoading(false);
      setError(false);
      setActiveImage(data.data);
    },
    onError: (error) => {
      setLoading(false);

      // setIsLoading(true)
    },
  });

  const fetchImage = () => {
    setError(false);
    setLoading(true);
    getImageMutation.mutate();
  };

  useEffect(() => {
    if (!activeImage) {
      fetchImage();
    } else {
      if (activeImage.pexai_id == id) {
        setCollected(activeImage.saved);
        setLiked(activeImage.liked);
        setLoading(false);
      } else {
        fetchImage();
      }
    }
  }, [location]);

  useEffect(() => {
    if (activeImage) {
      setCollected(activeImage.saved);
      setOrientation(
        activeImage.width > activeImage.height ? "landscape" : "portrait"
      );
    }
  }, [activeImage, loading]);

  return (
    <div
      className="w-[100vw] flex relative overflow-x-hidden flex-col h-[100vh]"
      ref={detailRef}
    >
      <div className="fixed top-[20px] left-[20px] w-[50px] h-[50px] z-9999">
        <Tooltip>
          <TooltipTrigger className="w-[50px] h-[50px]">
            <button
              className="cursor-pointer w-full h-full transition-all duration-200   rounded-sm flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,.5)",
                backdropFilter: "blur(10px)",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              <LayoutGrid size={26} className="text-[#484848]" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="z-9999">
            <p className="text-[9px]">Home</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {loading ? (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <CircularLoader
            size={100}
            bgColor="#fff"
            strokeWidth={2}
            color="#000"
            duration={2}
          />
        </div>
      ) : (
        <>
          <>
            {activeImage && !error ? (
              <div className="w-full h-fit">
                <div
                  className={`${
                    orientation == "portrait" ? `max-[830px]:justify-start` : `max-[830px]:justify-center`
                  } max-[830px]:mt-[40px] flex w-full ${
                    activeImage && activeImage.remixes > 0
                      ? " min-h-[86vh]"
                      : "min-h-screen"
                  } h-fit flex-row  max-[830px]:flex-col items-center justify-center`}
                >
                  <div
                    className={`${
                      orientation == "portrait"
                        ? `max-[830px]:max-w-[500px] shrink-0 max-[830px]:h-fit   w-fit h-[450px]`
                        : `max-w-[550px] h-fit max-[830px]:ml-[0px] ml-[20px]`
                    } max-[830px]:w-[95vw]`}
                  >
                    <Photo
                      photo={activeImage}
                      width={0}
                      detail={true}
                      orientation={orientation}
                    />
                  </div>
                  <div
                    className={` bg-[] ${
                      orientation == "portrait"
                        ? "min-w-[300px] max-[830px]:w-[95vw] max-w-[400px]"
                        : "min-w-[300px] max-[830px]:w-[95vw] max-w-[400px]"
                    }  max-[830px]:ml-[0px] shrink-0 max-[830px]:items-center ml-[70px] max-[830px]:min-h-[250px] max-[830px]:mb-[60px] min-h-[300px] max-[830px]:pr-[0px] pr-[30px] h-fit justify-center flex flex-col `}
                  >
                    {activeImage.origin == "pexai" ? (
                      <>
                        <div className="w-full flex  max-[830px]: mt-[20px] flex-wrap">
                          {activeImage.original_photos.map((photo) => (
                            <div
                              className="w-[60px] h-[60px] relative mr-[10px] bg-[gray] rounded-lg cursor-pointer"
                              onClick={() => {
                                if (photo.origin != "file") {
                                  setActiveImage(false);
                                  navigate(`/photo/${photo.pexai_id}`);
                                }
                              }}
                            >
                              <img
                                src={
                                  photo?.src?.small ||
                                  photo?.src?.original ||
                                  ""
                                }
                                className="w-full object-cover object-center h-full rounded-lg"
                                alt=""
                              />
                              <div className="top-0 left-0 bottom-0 bg-[rgba(0,0,0,.3)] rounded-lg right-0 absolute"></div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col mt-[10px] max-[830px]:items-center">
                          <MessageSquare size={17} className="text-[gray]" />
                          <h3 className="max-[830px]:text-center">
                            {activeImage.prompt || (
                              <Link
                                to={`/remix/${activeImage.chat_id}?cf=${activeImage?.message_id}`}
                                className="flex items-center hover:underline text-[#323232] mt-[4px]"
                              >
                                view full chat prompt{" "}
                                <ExternalLink size={12} className="ml-[4px]" />
                              </Link>
                            )}
                          </h3>
                        </div>
                        {activeImage?.original_photos.filter(function (el) {
                          return el != null;
                        }).length > 0 ? (
                          <div className="flex flex-wrap items-start max-[830px]:mt-[10px] mt-[10px] text-[14px] text-[gray]">
                            {activeImage.original_photos[0]?.origin ==
                            "pexai" ? (
                              <h3 className="">
                                Remix of remix by{" "}
                                {
                                  activeImage?.original_photos[0]?.user
                                    ?.first_name
                                }{" "}
                                {
                                  activeImage?.original_photos[0]?.user
                                    ?.last_name
                                }
                                {activeImage?.original_photos.length > 1 ? (
                                  <>
                                    {" "}
                                    & {activeImage?.original_photos?.length -
                                      1}{" "}
                                    more{" "}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </h3>
                            ) : (
                              <h3 className="">
                                Remix of photo by{" "}
                                {activeImage?.original_photos[0].origin !=
                                "file"
                                  ? activeImage?.original_photos[0].photographer
                                  : "upload"}
                                {activeImage?.original_photos.length > 1 ? (
                                  <>
                                    & {activeImage?.original_photos?.length - 1}{" "}
                                    more{" "}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </h3>
                            )}

                            {/* <a
                        href={
                          activeImage.origin == "pexels"
                            ? activeImage.photographer_url
                            : `https://unsplash.com/@${activeImage.photographer_username}`
                        }
                        target="_blank"
                        className="flex hover:underline ml-[5px] items-center"
                      >
                        {activeImage.origin == "pexels" ? (
                          <>{`(View on Pexels`}</>
                        ) : (
                          <>{`(View on Unsplash`}</>
                        )}
                        <ExternalLink size={12} className="ml-[4px]" /> {`)`}
                      </a> */}
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col max-[830px]:items-center">
                          <ClosedCaption className="text-[gray]" />
                          <h3 className="max-[830px]:text-center">
                            {activeImage.alt || "Pexels image with no caption"}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-start max-[830px]:mt-[10px] mt-[20px] text-[14px] text-[gray]">
                          <h3 className="">
                            Photo by {activeImage.photographer}
                          </h3>
                          <a
                            href={
                              activeImage.origin == "pexels"
                                ? activeImage.photographer_url
                                : activeImage.origin == "freepik"
                                ? `https://www.freepik.com/author/${activeImage.photographer_username}`
                                : `https://unsplash.com/@${activeImage.photographer_username}`
                            }
                            target="_blank"
                            className="flex hover:underline ml-[5px] items-center"
                          >
                            {activeImage.origin == "pexels" ? (
                              <>{`(View on Pexels`}</>
                            ) : (
                              <>
                                {activeImage.origin == "unsplash" ? (
                                  <>{`(View on Unsplash`}</>
                                ) : (
                                  <>{`(View on Freepik`}</>
                                )}
                              </>
                            )}
                            <ExternalLink size={12} className="ml-[4px]" />{" "}
                            {`)`}
                          </a>
                        </div>
                      </>
                    )}

                    <div className="max-[830px]:mt-[16px] mt-[30px] flex">
                      <button
                        className="w-[110px] cursor-pointer h-[35px] flex items-center justify-center bg-[#1e1e1e] mr-[7px] rounded-2xl text-[#fff] text-[14px]"
                        onClick={() => {
                          if (accessToken) {
                            const newFile = {
                              file: false,
                              status: "uploaded",
                              error: false,
                              url:
                                activeImage.src.large ||
                                activeImage.src.original,
                              upload_id: "",
                              file_id: activeImage.pexai_id,
                              other: false,
                              thumbnail_url:
                                activeImage.src.small ||
                                activeImage.src.original,
                            };
                            if (
                              !files.find(function (el) {
                                return el.file_id == activeImage.pexai_id;
                              })
                            ) {
                              addFile(newFile);
                            }
                          } else {
                            toast.warning("login to access remix");
                          }

                          setTimeout(() => {
                            navigate(`/remix`);
                          }, 300);
                        }}
                      >
                        <Shuffle size={16} className="mr-[7px]" /> Remix
                      </button>
                      <button
                        onClick={() => {
                          if (activeImage.origin == "pexai") {
                            downloadImage(
                              activeImage.src.original,
                              `${
                                activeImage.origin == "pexai"
                                  ? `pexai_remix_${activeImage.id}.png`
                                  : `${activeImage.origin}_image_${
                                      activeImage.alt || "image with no caption"
                                    }.png`
                              }`
                            );
                          } else {
                            window.open(activeImage.url, "_blank");
                          }
                        }}
                        className="w-[50px] cursor-pointer h-[35px] flex items-center justify-center bg-[#e6e6e6] mx-[7px] rounded-2xl text-[#0f0f0f] text-[14px]"
                      >
                        <ArrowDownToLine size={16} />{" "}
                      </button>
                    </div>
                    <div className="flex mt-[20px]">
                      <button
                        className="flex items-center mr-[7px] cursor-pointer text-[#2a2a2a] transition-all duration-300  hover:border-[gray] hover:bg-[#e9e9e9] rounded-lg border-[1px] border-[#e6e6e6] justify-center w-[110px] h-[40px]"
                        onClick={() => {
                          if (accessToken) {
                            toggleSaveImageMutataion.mutate();
                            setCollected((prev) => !prev);
                            openModal(<CollectionModal />, {});
                          } else {
                            toast.warning("Login to collect photos");
                          }
                        }}
                      >
                        {coillected ? (
                          <BookmarkCheck size={20} className="mr-[5px]" />
                        ) : (
                          <Bookmark size={20} className="mr-[5px]" />
                        )}
                        <div className="h-full overflow-hidden">
                          <span
                            className={`text-[14px] h-full shrink-0 flex items-center transition-all duration-200 ${
                              coillected ? "mt-[-38px]" : "mt-[0px]"
                            } `}
                          >
                            Save
                          </span>
                          <span className="text-[14px] h-full shrink-0 flex items-center  transition-all duration-200">
                            Saved
                          </span>
                        </div>
                      </button>
                      <button
                        className="flex items-center mr-[7px] cursor-pointer text-[#2a2a2a] transition-all duration-300  hover:border-[gray] hover:bg-[#e9e9e9] rounded-lg border-[1px] border-[#e6e6e6] justify-center w-[110px] h-[40px]"
                        onClick={() => {
                          if (accessToken) {
                            toggleLikeImageMutataion.mutate();
                            setLiked((prev) => !prev);
                          } else {
                            toast.warning("Login to like photos");
                          }
                        }}
                      >
                        {liked ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-heart-fill mr-[5px] w-[17px] font-bold h-[17px]"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314 "
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-heart mr-[5px] w-[17px] font-bold h-[17px]"
                            viewBox="0 0 16 16"
                          >
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                          </svg>
                        )}
                        <div className="h-full overflow-hidden">
                          <span
                            className={`text-[14px] h-full shrink-0 flex items-center transition-all duration-200 ${
                              liked ? "mt-[-38px]" : "mt-[0px]"
                            } `}
                          >
                            Like
                          </span>
                          <span className="text-[14px] h-full shrink-0 flex items-center  transition-all duration-200">
                            Liked
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                {activeImage && activeImage.remixes > 0 ? (
                  <div className="w-full  h-fit mb-[20px]" ref={parentRef}>
                    <h1 className="text-[27px] max-[830px]:ml-0 ml-[37px] mb-[10px] max-[830px]:text-center text-[#292929]">
                      Remixes of this Photo
                    </h1>
                    <CentralGrid
                      api_url={api_url}
                      mutationKey={remixMutationKey}
                      appPage={page}
                      parent={parentRef}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="absolute top-[50%] left-[50%] flex flex-col items-center justify-center translate-x-[-50%] translate-y-[-50%]">
                An Error Occured
                <Button
                  className="w-[90px] cursor-pointer mt-[10px] text-[14px] h-[40px]"
                  onClick={() => {
                    getImageMutation.mutate();
                  }}
                >
                  Retry
                </Button>
              </div>
            )}
          </>
        </>
      )}
    </div>
  );
};

export default PhotoDetailsPage;
