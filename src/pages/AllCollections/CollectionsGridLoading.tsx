import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CollectionsGridLoading = () => {
  return (<div className="w-full h-fit collections-grid px-[20px] mt-[20px] mb-[20px]">
     <div className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative">
         <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
     </div>
       <div className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative">
         <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
     </div>
      <div className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative">
         <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
     </div>
      <div className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative">
         <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
     </div>
      <div className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative">
         <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
     </div>
      <div className="w-full overflow-hidden cursor-pointer h-[270px] rounded-lg relative">
         <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
     </div>
  </div>);
};


export default CollectionsGridLoading