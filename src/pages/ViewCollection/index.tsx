import CentralGrid from "@/components/CentralGrid";
import ImageItem from "@/components/ImageItem";
import Navbar from "@/components/Navbar";
import { root_uri } from "@/utils/stores/aurhStore";
import { useMutationState } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ViewCollectionPage = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const { id } = useParams()

   const page = 'collection'
   const mutationKey = ["collections", id];
   const api_url = `${ root_uri }/collections/${ id }/photos/all`

     const getCollectionMutationState = useMutationState({
    filters: { mutationKey },
    select: (mutation) => ({
      status: mutation.state.status,
      data: mutation.state.data,
      error: mutation.state.error,
    }),
  });

  const collectionLatest =
    getCollectionMutationState.length > 0
      ? getCollectionMutationState[getCollectionMutationState.length - 1]
      : null;


      // console.log(collectionLatest?.data)
 

//   useEffect(() => {
//     const appContainer = parentRef.current;
//     if (appContainer) {
//       console.log("ao");
//       appContainer.addEventListener("scroll", () =>{
//         console.log('ddefd')
//       });
//     }
//   }, []);
  return (
    <div className="w-[100vw] h-[100vh]">
      <Navbar />
      <div className="w-[100vw] h-[100vh] overflow-y-scroll pt-[100px]"  ref={parentRef}>
        {
            collectionLatest?.data? (
                 <h1 className="text-[27px] ml-[25px] mb-[15px] text-[#292929]">{ collectionLatest?.data?.data.collection.name || '' }</h1>
            ):(
                <></>
            )
        }
        
        {/* <ImageItem /> */}
         <CentralGrid api_url={ api_url } mutationKey={ mutationKey } appPage={ page } parent={parentRef} />
      </div>
    </div>
  );
};

export default ViewCollectionPage;
