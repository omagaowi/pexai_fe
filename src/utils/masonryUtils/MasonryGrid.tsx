import React, { useEffect, useMemo, useRef } from "react";
import { IMasonryGridProps, IPhoto } from "../types";
// import Photo from "@/assets/components/Photo/Photo";
import { Link } from "react-router-dom";
// import { useColumnCalculations } from "@/hooks/useColumnCalculation";
// import { useItemDimensions } from "@/hooks/useItemDimensions";
// import { useItemPositioning } from "@/hooks/useItemPositioning";
// import { useVisibleRange } from "@/hooks/useVisibleRange";

import { useColumnCalculations } from "./useColumnCalculation";
import { useItemDimensions } from "./useItemDimensions";
import { useItemPositioning } from "./useItemPositioning";
import { useVisibleRange } from "./useVisibleRange";
import Photo from "@/components/Photo";
import useImageStore from "../stores/imageStore";

const MasonryGrid: React.FC<IMasonryGridProps> = ({
	photos,
	minColumnWidth,
	cellGap,
	overscanCount,
	columns,
	containerSize,
	scrollTop,
	isLoading,
	onNeedMore,
}) => {
	const gridRef = useRef<HTMLDivElement>(null);

	const { setActiveImage } = useImageStore()

	// const { columnCount, columnWidth } = useColumnCalculations(
	// 	containerSize.width,
	// 	minColumnWidth,
	// 	cellGap
	// );

	const columnWidth =  Math.floor(containerSize.width / (columns + .1))

 

	const { getItemHeight, getTotalHeight } = useItemDimensions(
		photos,
		columnWidth,
		cellGap
	);

	const getItemPosition = useItemPositioning(
		columns,
		columnWidth,
		getItemHeight,
		cellGap
	);

	const getVisibleRange = useVisibleRange(
		photos,
		getItemPosition,
		getItemHeight,
		scrollTop,
		containerSize.height,
		overscanCount
	);

	const visibleRange = useMemo(() => getVisibleRange(), [getVisibleRange]);
	const totalHeight = useMemo(
		() => getTotalHeight(columns),
		[getTotalHeight, columns, containerSize]
	);

 

	useEffect(() => {
		if (gridRef.current && totalHeight + 70 < containerSize.height && !isLoading) {
			onNeedMore();
		}
	}, [totalHeight, containerSize.height, isLoading]);

	return (
		<div ref={gridRef} className="flex justify-center">
			{photos && photos.length > 0 && (
				<div
					className="relative "
					style={{ height: totalHeight, width: columns * columnWidth }}
				>
					{renderVisiblePhotos(
						photos,
						visibleRange,
						getItemPosition,
						getItemHeight,
						columnWidth,
						containerSize,
						setActiveImage
					)}
				</div>
			)}
		</div>
	);
};

const renderVisiblePhotos = (
	photos: IPhoto[],
	visibleRange: { start: number; end: number },
	getItemPosition: (index: number) => { top: number; left: number },
	getItemHeight: (index: number) => number,
	columnWidth: number,
	containerSize: { width: number; height: number },
	setActiveImage: any
) => {
	return photos
		.slice(visibleRange.start, visibleRange.end)
		.map((photo, index) => {
			const actualIndex = visibleRange.start + index;
			const { top, left } = getItemPosition(actualIndex);
			const height = getItemHeight(actualIndex);
			return (
				<Link
					to={`/photo/${photo.pexai_id}`}
					onClick={() => {
						setActiveImage(photo)
					} }
					viewTransition
					state={{ containerSize }}
					// key={photo.id}
					className="mb-4 p-[12px]"
					style={{
						position: "absolute",
						cursor: "pointer",
						top,
						left,
						width: columnWidth,
						height,
					}}
				>
					<Photo
						photo={photo}
						width={columnWidth}
						detail={ false }
						orientation= { photo.width > photo.height? 'portrait' : 'landscape' }
					/>
					<div className="absolute  text-[red] text-[20px] top-0 left-0">
						{/* { index } */}
					</div>
				</Link>
			);
		});
};

export default MasonryGrid;

