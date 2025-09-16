import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import useImageStore from "@/utils/stores/imageStore";
import { useMutation, useMutationState } from "@tanstack/react-query";
import { BookCheck, Bookmark, BookmarkCheck, Layers, Plus } from "lucide-react";
import { FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";

import React from "react";
import CircularLoader from "@/components/LoaderCircular";
import { ModalContext } from "@/contexts/ModalContext";
import axios from "axios";
import { toast } from "sonner";

export const NewCollectionModal = ({ allCollections }) => {
  const { accessToken } = useAuth();

  const { closeModal } = useContext(ModalContext);
  const [collections, setCollections] = useState(allCollections);

  const { activeImage, setActiveImage } = useImageStore();

  const createNewCollectionMutation = useMutation({
    mutationKey: ["new_collection"],
    mutationFn: (e: FormEvent) => {
      return axios.post(
        `${root_uri}/collections/new?newPhoto=${activeImage.pexai_id}&thumbnail=${ activeImage.src.large }`,
        {
          name: (e.target as HTMLFormElement).collection_name.value,
        },
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
    onSuccess: (data) => {
      setActiveImage({
        ...activeImage,
        saved: true,
      });

      closeModal();
      toast.success("New Collection Created");
    },
    onError: (error) => {
 
      toast.error("An Error Occured", {
        description: createNewCollectionMutation.error.message,
      });
    },
  });

  return (
    <form
      className="w-[370px] relative flex flex-col items-center h-[230px] pt-[20px]  rounded-md bg-[#fff]"
      onSubmit={(e) => {
        e.preventDefault();
        if ((e.target as HTMLFormElement).collection_name.value) {
          createNewCollectionMutation.mutate(e);
        }
      }}
    >
      <h1 className="text-[#000] text-[20px] font-semibold">New Collection</h1>
      <input
        type="text"
        name="collection_name"
        placeholder="Enter collection name..."
        className="w-[90%] pl-[10px] mt-[35px] placeholder:text-[14px] h-[47px] border-[1px] rounded-md text-[gray] text-[14px] border-[#e6e6e6]"
      />
      <button className="w-[160px]  cursor-pointer mt-[35px] h-[40px] flex items-center justify-center bg-[#1e1e1e] rounded-md text-[#fff] text-[14px]">
        {createNewCollectionMutation.status == "pending" ? (
          <CircularLoader
            size={21}
            strokeWidth={2}
            color="#000"
            bgColor="#fff"
            duration={2}
          />
        ) : (
          <> Create</>
        )}
      </button>
    </form>
  );
};

export const Collection = ({ collection, allCollections }) => {
  const { id } = useParams();

  const [isSaved, setIsSaved] = useState(collection.hasPhoto);

  const { accessToken, userData } = useAuth();
  const { activeImage, setActiveImage } = useImageStore();
  const [collections, setCollections] = useState(allCollections);

  const { closeModal } = useContext(ModalContext);

  const toggleSaveImageMutataion = useMutation({
    mutationKey: ["collection", collection.collection_id],
    mutationFn: () => {
      return axios.get(
        `${root_uri}/collections/${collection.collection_id}/photos/${activeImage.pexai_id}/toggle`,
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
    onSuccess: (data) => {
 
    },
    onError: (error) => {
 
      toast.error("An Error Occured", {
        description: toggleSaveImageMutataion.error.message,
      });
 
      // setIsLoading(true)
      setIsSaved((prev) => !prev);
    },
  });

  return (
    <div className="w-[92%] h-[60px] rounded-md border-b-[#f1f1f1] border-b-[1px] hover:bg-[#f1f1f1] flex">
      <div className="w-[50px] h-full flex items-center justify-center">
        <Layers />
      </div>
      <div className="flex-1 h-full flex items-center">
        <h4 className="text-[15px]">{collection.name}</h4>
      </div>
      <button
        className="w-[45px] h-full flex items-center justify-center cursor-pointer"
        onClick={() => {
          setIsSaved((prev) => !prev);
          const dummmy = [...collections];
 
          dummmy[dummmy.indexOf(collection)].hasPhoto = !isSaved;
 
          setCollections((prev) => dummmy);
          const hasAnyPhoto = dummmy.some((el) => el.hasPhoto === true);
 
          setActiveImage({
            ...activeImage,
            saved: hasAnyPhoto,
          });

          closeModal();
          toggleSaveImageMutataion.mutate();
        }}
      >
        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    </div>
  );
};

export const CollectionModal = () => {
  const mutationKey = ["collection", "toggle"];

  const { openModal, closeModal } = useContext(ModalContext);

  const toggleMutationState = useMutationState({
    filters: { mutationKey },
    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data,
      error: mutation.state.error,
    }),
  });

  const toggleLatest =
    toggleMutationState.length > 0
      ? toggleMutationState[toggleMutationState.length - 1]
      : null;

 

  return (
    <div className="w-[250px] relative flex flex-col h-[300px] pt-[20px]  rounded-md bg-[#fff]">
      <h1 className="text-[#000] text-[20px] ml-[20px]">Collections</h1>
      {toggleLatest.status == "pending" ? (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <CircularLoader
            size={40}
            bgColor="#000"
            strokeWidth={2}
            color="#fff"
            duration={2}
          />
        </div>
      ) : (
        <>
          <div className="w-full h-[190px] overflow-x-hidden no-scrollbar">
            <div className="w-full h-fit flex  items-center mt-[17px] flex-col">
              <>
                {toggleLatest.data ? (
                  <>
                    {toggleLatest.data?.data.map((collection) => (
                      <Collection
                        collection={collection}
                        allCollections={toggleLatest.data?.data}
                      />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            </div>
          </div>
          <div className="absolute bottom-0 rounded-md flex items-center justify-center w-full h-[60px] bg-[#fff]">
            <button
              className="w-[160px]  cursor-pointer h-[40px] flex items-center justify-center bg-[#1e1e1e] mr-[7px] rounded-2xl text-[#fff] text-[14px]"
              onClick={() => {
                closeModal();
                setTimeout(() => {
                  openModal(
                    <NewCollectionModal
                      allCollections={toggleLatest.data?.data}
                    />,
                    {}
                  );
                }, 100);
              }}
            >
              <Plus size={16} className="mr-[7px]" /> New Collection
            </button>
          </div>
        </>
      )}
    </div>
  );
};
