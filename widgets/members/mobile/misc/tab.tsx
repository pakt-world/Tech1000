/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";

interface Props {
	activeRoleTab: "ambassador" | "partner";
	setActiveRoleTab: (value: "ambassador" | "partner") => void;
}

export const MemberTab = ({ activeRoleTab, setActiveRoleTab }: Props) => {
	return (
		<div className="fixed top-[133px] z-40 flex h-[50px] w-full flex-col items-start justify-between border-b border-t border-primary-lighter bg-ink-darkest transition-all duration-300 ease-in-out">
			<div className="flex w-full flex-row items-center gap-2">
				<Button
					className="px-4 py-2 text-lg text-white transition-transform duration-300 ease-in-out hover:scale-[0.97] hover:!bg-transparent"
					variant="ghost"
					onClick={() => {
						setActiveRoleTab("ambassador");
					}}
				>
					Ambassadors
				</Button>
				<Button
					className="px-4 py-2 text-lg text-white transition-transform duration-300 ease-in-out hover:scale-[0.97] hover:!bg-transparent"
					variant="ghost"
					onClick={() => {
						setActiveRoleTab("partner");
					}}
				>
					Partners
				</Button>
			</div>
			<div
				className={`relative border-b-2 border-white transition-all duration-300 ${activeRoleTab === "ambassador" ? "left-4 w-[7rem]" : " left-[10.5rem] w-[4.5rem]"}`}
			/>
		</div>
	);
};
