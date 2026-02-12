"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { ENVS } from "@/config";
import { Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { determineRole } from "@/lib/utils";
import { useProductVariables } from "@/hooks/use-product-variables";

export const BountyHeader = (): JSX.Element | null => {
	const router = useRouter();
	const user = useUserState();
	const value = user.profileCompleteness ?? 0;
	const profileCompleted = value > 70;
	const isPartner = determineRole(user) === Roles.PARTNER;

	const { variables } = useProductVariables();

	if (!user.firstName) return null;
	if (!profileCompleted) {
		return (
			<div className="flex h-[154px] w-full items-center gap-2 rounded-2xl border bg-white p-6">
				<div className="flex flex-[2] flex-col">
					<h3 className="text-[50px] font-bold leading-[54px]">
						{value}%
					</h3>
					<p className="text-base">of your profile is completed</p>
				</div>
				<div className="flex flex-[7] flex-col gap-4 border-l border-[#e8e8e8] pl-[24px]">
					<p className="text-base leading-6 tracking-[0.75px] text-body">
						Welcome to {variables?.NAME}! Fill out your profile so
						you can begin collaborating.
					</p>

					<Button
						onClick={() => {
							router.push("/settings");
						}}
						className="h-full w-max"
					>
						<span>Complete Profile</span>
					</Button>
				</div>
			</div>
		);
	}

	return !ENVS.isProduction || user.kyc ? (
		<div className="grid grid-cols-1">
			{isPartner ? (
				<div className="relative overflow-hidden rounded-2xl border border-red-300 bg-neutral-500 bg-opacity-40 p-4 backdrop-blur-[59.33px]">
					<Briefcase
						size={122}
						color="#FFE5E5"
						className="absolute left-0 top-2 -scale-x-100 opacity-20"
					/>
					<div className="relative z-10 flex items-center justify-between gap-4">
						<p className="text-xl font-bold text-white">
							Create Bounties for the Ambassador DAO members
						</p>

						<Button
							onClick={() => {
								router.push("/bounties/create");
							}}
							className="flex w-max items-center gap-2 rounded-[10.59px] px-[25.41px] py-[12.71px]"
							variant="white"
						>
							<Plus size={20} />
							<span className="font-bold leading-[27px] tracking-wide">
								Create Bounty
							</span>
						</Button>
					</div>
				</div>
			) : (
				<div className="relative overflow-hidden rounded-2xl border-2 border-zinc-200 bg-[#DDB5B880] p-4">
					<Search
						size={80}
						color="#FFE5E5"
						className="absolute left-0 top-2 -scale-x-100 opacity-20"
					/>
					<div className="relative z-10 flex items-center justify-between gap-4">
						<p className="text-xl font-bold text-white">
							Search {variables?.NAME} to find bounties to earn
							crypto
						</p>
						<Button
							variant="white"
							onClick={() => {
								router.push("/bounties");
							}}
							className="flex w-max items-center gap-2 rounded-[10.59px] px-[25.41px] py-[12.71px] text-black hover:!text-black"
						>
							<Search size={20} />
							<span className="font-bold leading-[27px] tracking-wide">
								Find Bounties
							</span>
						</Button>
					</div>
				</div>
			)}
		</div>
	) : null;
};
