import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface LoaderGridProps {
  columns: number
}

const GridLoading: React.FC<LoaderGridProps> = ({ columns }) => {
  const columnItems = Array.from({ length: columns }, () => [] as number[])
  const items = [0.8, 1.5, 0.8, 0.75, 0.56, 0.52];
  const [columnWidth, setColumnWidth] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);
 

   items.forEach((item, index) => {
    const columnIndex = index % columns
    columnItems[columnIndex].push(item)
  })

  useEffect(() => {
    if (gridRef && gridRef.current) {
      setColumnWidth(gridRef.current.offsetWidth / 3);
    }
  }, []);

  return (
    <div className="w-[98vw] min-h-[100vh] h-fit">
      <div
        className="grid gap-4 w-[100%]"
        ref={gridRef}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {columnItems.map((item, columnIndex) => (
             <div key={columnIndex} className="flex flex-col gap-4">
                {item.map((item) => (
                    <div className={`w-full rounded-lg`} style={{ height: `${columnWidth / item}px` }} >
                        <Skeleton className="h-full w-full bg-[#dfdfdf] rounded-lg" />
                    </div>
                ))}
             </div>
        ))}
       
      </div>
    </div>
  );
};

export default GridLoading;
