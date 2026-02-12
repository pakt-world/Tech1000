/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Skeleton } from "./skeleton";

export const FeedSkeleton = () => {
	return (
		<div className="flex h-auto w-full flex-col gap-1 overflow-y-auto sm:gap-4">
			{[...Array(5)].map((_, i) => (
				<Skeleton
					className="flex h-auto w-full items-center justify-start gap-2 bg-primary p-4 sm:rounded-2xl"
					key={i}
				>
					<Skeleton className="!h-[60px] !w-[60px] !rounded-full bg-white/10 sm:!h-[142px] sm:!w-[142px]" />
					<div className="flex w-full flex-1 flex-col items-start gap-3">
						<div className="hidden items-center gap-1 sm:flex">
							<Skeleton className="!h-[26px] !w-[217px] !rounded-lg bg-white/10" />
							<Skeleton className="!h-[31px] !w-[97px] !rounded-2xl bg-white/10" />
							<Skeleton className="!h-[26px] !w-[32px] !rounded-lg bg-white/10" />
						</div>
						<Skeleton className="!rounded-lg bg-white/10 sm:!h-[30px] sm:!w-[645px]" />
						<div className="flex w-full flex-col items-start gap-1">
							<Skeleton className="!h-[10px] !w-full !rounded-lg bg-white/10" />
							<Skeleton className="!h-[10px] !w-[80%] !rounded-lg bg-white/10" />
							<Skeleton className="!h-[10px] !w-[50%] !rounded-lg bg-white/10" />
						</div>
						<div className="flex w-full items-end justify-between gap-8">
							<div className="flex w-full items-start gap-1 sm:w-[50%]">
								<Skeleton className="!h-[12px] !w-full !rounded-lg bg-white/10" />
								<Skeleton className="!h-[12px] !w-full !rounded-lg bg-white/10" />
								<Skeleton className="!h-[12px] !w-full !rounded-lg bg-white/10" />
								<Skeleton className="!h-[12px] !w-full !rounded-lg bg-white/10" />
								<Skeleton className="!h-[12px] !w-full !rounded-lg bg-white/10" />
							</div>
							<div className="hidden w-max items-center gap-4 sm:flex">
								<Skeleton className="!h-[37px] !w-[120px] !rounded-lg bg-white/10" />
								<Skeleton className="!h-[37px] !w-[120px] !rounded-lg bg-white/10" />
							</div>
						</div>
					</div>
				</Skeleton>
			))}
		</div>
	);
};
