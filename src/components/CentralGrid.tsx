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

interface CentralGridProps {
  url: string;
  parent: any
}

const CentralGrid: React.FC<CentralGridProps> = ({ url, parent }) => {
  const { width } = useViewDimensions();
  const appContainerRef = parent;
  const { containerSize } = useContainerSize(appContainerRef);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [page, setPage] = useState(1)

  const location = useLocation();

  const { accessToken } = useAuth()

  const [searchQuery, setSearchQuery] = useState<string>("old garden");

  const queryClient = useQueryClient();

  const mutationKey = ["images", "home"];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [nextLoading, setNextLoading] = useState(false)

  console.log(photos)

  const getAllImagesMutation = useMutation({
    mutationKey: mutationKey,
    mutationFn: (page_no: number) => {
      return axios.get(`${ root_uri }/images/all?page=${ 1 }`, {
        headers: {
          'Authorization': `Bearer ${ accessToken }`
        }
      });
    },
    onSuccess: (data) => {
      setPhotos([...photos, ...data.data]);
      setIsLoading(false);
      setNextLoading(false)
      setPage(prev => prev + 1)
    },
    onError: (error) => {
 
      // setIsLoading(true)
    },
  });

 

  const fetchMorePhotos = (page_no : number) => {
    // console.log('next')
    if(photos.length > 0){
    setNextLoading(true)
    }
    console.log('fetch')
    getAllImagesMutation.mutate(page);
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

  const handleScroll = useCallback(() => {
 
    if (appContainerRef.current) {
 
      const { scrollTop, scrollHeight, clientHeight } = appContainerRef.current;
      setScrollPosition(scrollTop);
      if (
        scrollHeight - scrollTop - clientHeight < clientHeight * 0.5 &&
        !nextLoading
      ) {
        console.log('load')
        fetchMorePhotos(page);
      }
    }
  }, [isLoading, fetchMorePhotos, location.pathname]);

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

 

  return (
    <div className="w-full h-fit min-h-[100vh]">
      {
      photos.length == 0? (
         <div className="w-full h-fit flex justify-center px-[30px] min-h-[100vh]">
          <GridLoading  columns={ width > 830 ? 3 : width > 570? 2 : 1 }/>
       </div>
      ):(
        <></>
      )
      }
      <MasonryGrid
        photos={photos}
        columns={ width > 830 ? 3 : width > 570? 2 : 1 }
        minColumnWidth={180}
        cellGap={0}
        overscanCount={2}
        containerSize={containerSize}
        scrollTop={scrollPosition}
        onNeedMore={() => {
          if(!nextLoading){
            fetchMorePhotos(1)
          }
          // console.log('next')
          //  setIsLoading(true)
        }}
        isLoading={isLoading}
      />
      {
       nextLoading?(
          <div className="w-full h-[70px] flex items-center justify-center">
              <CircularLoader size={50} bgColor="#fff" strokeWidth={2} color="#000" duration={2} />
          </div>
        ):(
          <></>
        )
      }
    </div>
  );
};

export default CentralGrid;
