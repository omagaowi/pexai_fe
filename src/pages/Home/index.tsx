import CentralGrid from "@/components/CentralGrid";
import ImageItem from "@/components/ImageItem";
import Navbar from "@/components/Navbar";
import { root_uri } from "@/utils/stores/aurhStore";
import React, { useEffect, useRef } from "react";

const HomePage = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const page = 'home'
   const mutationKey = ["images", "home"];
   const api_url = `${ root_uri }/images/all`

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
        {/* <ImageItem /> */}
        <CentralGrid api_url={ api_url } mutationKey={ mutationKey } appPage={ page } parent={parentRef} />
      </div>
    </div>
  );
};

export default HomePage;
