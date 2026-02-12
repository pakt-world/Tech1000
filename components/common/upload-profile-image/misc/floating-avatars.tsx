"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

export const FloatingAvatars = (): JSX.Element => {
	return (
		<div className="z-10 w-full">
			<div className="hidden sm:block">
				<div className="absolute left-[6%] top-[5%] size-[85px] rounded-full opacity-90">
					<Image
						src="/images/onboarding-1.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute left-0 top-[50%] size-[85px] -translate-y-1/2 rounded-full opacity-90">
					<Image
						src="/images/onboarding-2.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute bottom-[5%] left-[6%] size-[85px] rounded-full opacity-90">
					<Image
						src="/images/onboarding-3.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute right-[6%] top-[5%] size-[85px] rounded-full opacity-90">
					<Image
						src="/images/onboarding-4.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute right-0 top-[50%] size-[85px] -translate-y-1/2 rounded-full opacity-90">
					<Image
						src="/images/onboarding-5.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute bottom-[5%] right-[6%] size-[85px] rounded-full opacity-90">
					<Image
						src="/images/onboarding-6.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
			</div>
			<div className="block sm:hidden">
				<div className="absolute left-[50%] top-[3%] size-10 -translate-x-1/2 rounded-full opacity-90">
					<Image
						src="/images/onboarding-3.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute left-[10%] top-[18%] size-10 rounded-full opacity-90">
					<Image
						src="/images/onboarding-1.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute left-0 top-[50%] size-10 -translate-y-1/2 rounded-full opacity-90">
					<Image
						src="/images/onboarding-2.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute bottom-[18%] left-[10%] size-10 rounded-full opacity-90">
					<Image
						src="/images/onboarding-3.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute right-[10%] top-[18%] size-10 rounded-full opacity-90">
					<Image
						src="/images/onboarding-4.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute right-0 top-[50%] size-10 -translate-y-1/2 rounded-full opacity-90">
					<Image
						src="/images/onboarding-5.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute bottom-[18%] right-[10%] size-10 rounded-full opacity-90">
					<Image
						src="/images/onboarding-6.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
				<div className="absolute bottom-[3%] left-[50%] size-10 -translate-x-1/2 rounded-full opacity-90">
					<Image
						src="/images/onboarding-3.png"
						alt=""
						height={85}
						width={85}
						className="rounded-full"
					/>
				</div>
			</div>
		</div>
	);
};
