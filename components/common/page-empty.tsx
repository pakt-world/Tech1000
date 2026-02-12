/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";
import empty from "@/lottiefiles/empty.json";
import CardView from "./card-view";
import Lottie from "@/components/common/lottie";

interface Props {
	label?: string;
	className?: string;
	children?: React.ReactNode;
	ref?: React.RefObject<HTMLDivElement>;
}

export const PageEmpty: FC<Props> = ({ className, label, children, ref }) => {
	return (
		<CardView
			aria-live="polite"
			aria-busy="true"
			className={cn(
				"flex h-screen w-full items-center justify-center md:!border-[#9BDCFD]",
				className
			)}
			ref={ref}
		>
			<div className="flex flex-col items-center">
				<div className="flex w-full max-w-[250px] items-center justify-center">
					<Lottie animationData={empty} loop={false} />
				</div>
				<span className="max-w-md text-center text-lg text-white">
					{label ?? "Nothing to show yet."}
				</span>
				{children}
			</div>
		</CardView>
	);
};
