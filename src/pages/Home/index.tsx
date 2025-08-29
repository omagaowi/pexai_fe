import CentralGrid from "@/components/CentralGrid";
import ImageItem from "@/components/ImageItem";
import Navbar from "@/components/Navbar";
import React, { useEffect, useRef } from "react";

const HomePage = () => {
  const parentRef = useRef<HTMLDivElement | null>(null);

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
        <CentralGrid url="" parent={parentRef} />
      </div>
    </div>
  );
};

export default HomePage;
