"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Plus, Search, Users } from "lucide-react";
import { CTAWrapper4Desktop } from "../../_components/cta-wrapper";

export const GroupsCTA4Desktop = (): JSX.Element | null => {
	const router = useRouter();
	const goToCreateGroup = () => router.push("/groups/create");
	const goToFindGroups = () =>
		router.push("/groups?type=public&search=&minimumScore=&maximumScore=");
	return (
		<div className="!z-30 flex w-full flex-col items-center gap-6 md:flex-row">
			<CTAWrapper4Desktop
				className="h-full min-h-[162px] w-1/2 !border-[#F2C650] !p-4"
				icon={Search}
			>
				<div className="flex h-full w-2/3 flex-col justify-between">
					<h2 className="text-lg font-bold  text-white">
						Search the community <br />
						for Groups you can join
					</h2>
					<Button
						type="button"
						variant="default"
						onClick={goToFindGroups}
						className="w-fit gap-2 rounded-full text-lg"
					>
						<Search />
						Find Groups
					</Button>
				</div>
			</CTAWrapper4Desktop>
			<CTAWrapper4Desktop
				className="h-full min-h-[162px] w-1/2 !border-[#FAA0A9] !p-4"
				icon={Users}
			>
				<div className="flex h-full w-2/3 flex-col justify-between">
					<h2 className="text-lg font-bold text-white">
						Create groups <br /> for the community
					</h2>
					<Button
						type="button"
						variant="outline"
						onClick={goToCreateGroup}
						className="w-fit gap-2 rounded-full text-lg hover:!bg-[#FCFCFD1A]/15"
					>
						<Plus /> Create Group
					</Button>
				</div>
			</CTAWrapper4Desktop>
		</div>
	);
};
