import { Loader } from "lucide-react";
import React from "react";

interface FetchingIndicatorProps {
	isFetchingNextPage: boolean;
	observerTarget: React.RefObject<HTMLDivElement>;
}
const FetchingIndicator = ({
	isFetchingNextPage,
	observerTarget,
}: FetchingIndicatorProps) => {
	return (
		<>
			{isFetchingNextPage ? (
				<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
					<Loader
						size={15}
						className="animate-spin text-center text-white"
					/>
				</div>
			) : (
				<div ref={observerTarget} className="!h-1 !w-full" />
			)}
		</>
	);
};

export default FetchingIndicator;
