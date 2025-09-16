import useViewDimensions from "@/utils/useViewDimensions";
import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ImageItem from "./ImageItem";
import { useContainerSize } from "@/utils/masonryUtils/useContainerSize";
import { useLocation } from "react-router-dom";
import MasonryGrid from "@/utils/masonryUtils/MasonryGrid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import GridLoading from "./GridLoading";
import CircularLoader from "./LoaderCircular";
import useAuth, { root_uri } from "@/utils/stores/aurhStore";
import useImageStore from "@/utils/stores/imageStore";
import { Button } from "./ui/button";

interface CentralGridProps {
  appPage: string;
  mutationKey: Array<string>;
  api_url: string;
  parent: any;
}

function filterDuplicates<T>(array: T[], field: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[field];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

const CentralGrid: React.FC<CentralGridProps> = ({
  api_url,
  appPage,
  mutationKey,
  parent,
}) => {
  const { width } = useViewDimensions();
  const appContainerRef = parent;
  const { containerSize } = useContainerSize(appContainerRef);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(10);

  const location = useLocation();

  const { accessToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>("old garden");

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { photos, setPhotos } = useImageStore();
  const [nextLoading, setNextLoading] = useState(false);

  const useQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };
  const query = useQueryParams();

  const getAllImagesMutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: (page_no: number) => {
      const uri = appPage.includes("search")
        ? `${api_url}&page=${page_no}`
        : `${api_url}?page=${page_no}`;
      console.log(uri)
      return axios.get(uri, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: (data) => {
      const fetchedPhotos =
        appPage == "collection" ||
        appPage == "likes" ||
        appPage.includes("remixes")
          ? data.data.allPhotos
          : data.data;
      if (
        appPage == "remixes" ||
        appPage == "collection" ||
        appPage == "likes"
      ) {
        setTotalItems(data.data.total || 10);
      } else {
        setTotalItems(8000);
      }
      setPhotos(filterDuplicates([...photos, ...fetchedPhotos], "pexai_id"));
      setIsLoading(false);
      setNextLoading(false);
      setPage((prev) => prev + 1);
    },
    onError: (error) => {
      setIsLoading(false);
      if (photos.length > 0) {
        setPage((prev) => prev + 1);
      }

      setNextLoading(false);
      // setIsLoading(true)
    },
  });

  const fetchMorePhotos = (page_no: number) => {
    if (photos.length > 0) {
      setNextLoading(true);
    }

    getAllImagesMutation.mutate(page_no);
  };

  // const { photos, isLoading, error, fetchMorePhotos } = usePhotoFetching(
  // 	searchQuery,
  // 	10
  // );

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const query = formData.get("search") as string;
      if (query !== searchQuery) {
        setSearchQuery(query);
        setScrollPosition(0);
      }
    },
    [searchQuery, setScrollPosition]
  );

  useEffect(() => {
    setIsLoading(true);
    setPhotos([]);
    setPage((prev) => 1);
    console.log('log', page)
    fetchMorePhotos(1);
  }, [location]);

  const handleScroll = useCallback(() => {
    if (appContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = appContainerRef.current;
      setScrollPosition(scrollTop);
      if (
        scrollHeight - scrollTop - clientHeight < clientHeight * 0.5 &&
        !nextLoading
      ) {
        if (photos.length < totalItems) {
          if ((photos.length == 0 && getAllImagesMutation.status == "error") || (photos.length == 0 && getAllImagesMutation.status == "success")) {
          } else {
            fetchMorePhotos(page);
          }
        }
      }
    }
  }, [isLoading, fetchMorePhotos, location]);

  useEffect(() => {
    const appContainer = appContainerRef.current;
    if (appContainer) {
      appContainer.addEventListener("scroll", handleScroll);
      return () => appContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (appContainerRef.current) {
      // if (location.pathname === "/")
      appContainerRef.current.scrollTop = scrollPosition;
    }
  }, [location]);

  useEffect(() => {
    setPhotos([]);
  }, []);


 

  return (
    <div className="w-full h-fit min-h-[100vh]">
      {photos.length == 0 ? (
        <>
          {getAllImagesMutation.status == "pending" ? (
            <div className="w-full h-fit flex justify-center px-[30px] min-h-[100vh]">
              <GridLoading columns={width > 830 ? 3 : width > 570 ? 2 : 1} />
            </div>
          ) : (
            <>
              {getAllImagesMutation.status == "error" ? (
                <div className="w-full h-fit flex items-center flex-col justify-center px-[30px] min-h-[100vh]">
                  An Error Occured
                  <Button
                    className="w-[90px] cursor-pointer mt-[10px] text-[14px] h-[40px]"
                    onClick={() => {
                      getAllImagesMutation.mutate();
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="w-full h-fit flex items-center flex-col justify-center px-[30px] min-h-[100vh]">
                  Nothing to see here
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <MasonryGrid
        photos={photos}
        columns={width > 830 ? 3 : width > 570 ? 2 : 1}
        minColumnWidth={180}
        cellGap={0}
        overscanCount={2}
        containerSize={containerSize}
        scrollTop={scrollPosition}
        onNeedMore={() => {
          if (!nextLoading) {
            fetchMorePhotos(1);
          }

          //  setIsLoading(true)
        }}
        isLoading={isLoading}
      />
      {nextLoading ? (
        <div className="w-full h-[70px] flex items-center justify-center">
          <CircularLoader
            size={50}
            bgColor="#fff"
            strokeWidth={2}
            color="#000"
            duration={2}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CentralGrid;
