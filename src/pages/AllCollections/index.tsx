import CentralGrid from "@/components/CentralGrid";
import ImageItem from "@/components/ImageItem";
import Navbar from "@/components/Navbar";
import React, { useEffect, useRef } from "react";
import CollectionCard from "./CollectionCard";
import CollectionsGridLoading from "./CollectionsGridLoading";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const AllCollectionsPage = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { accessToken } = useAuth();

  const mutationKey = ["collections", "all"];

  const length = 1;

  const getCollectionsMutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: () => {
      return axios.get(`${root_uri}/collections/all/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onMutate: () => {
      // setIsLoading(true)
    },
    onSuccess: (data) => {},
    onError: (error) => {},
  });

  useEffect(() => {
    getCollectionsMutation.mutate();
  }, []);

  return (
    <div className="w-[100vw] h-[100vh]">
      <Navbar />
      <div
        className="w-[100vw] h-[100vh] overflow-y-scroll pt-[100px]"
        ref={parentRef}
      >
        <h1 className="text-[27px] ml-[20px] text-[#292929]">My Collections</h1>
        {getCollectionsMutation.status == "pending" ? (
          <>
            <CollectionsGridLoading />
          </>
        ) : (
          <>
            {!getCollectionsMutation.data? (
              <></>
            ) : (
              <div
                className={`w-full h-fit px-[20px] mt-[20px] mb-[20px] ${
                  length > 2
                    ? "collections-grid collections-mini-responsive3"
                    : "collections-grid12 collections-mini-responsive"
                }`}
              >
                {getCollectionsMutation.data.data.map((collection) => (
                  <CollectionCard collection = { collection }/>
                ))}
              </div>
            )}
          </>
        )}

        {/* <ImageItem /> */}
        {/* <CentralGrid url="" parent={parentRef} /> */}
      </div>
    </div>
  );
};

export default AllCollectionsPage;
