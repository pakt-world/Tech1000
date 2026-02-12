import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface GroupQueryType {
	defaultTab: string;
	tabOptions: string[];
}

export const useGroupsMemberQuery = ({
	defaultTab = "invited",
	tabOptions = ["invited", "joined", "applicants"],
}: GroupQueryType) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const groupMemberStatus = searchParams.get("groupMembers");

	const [activeTab, setActiveTab] = useState(groupMemberStatus || defaultTab);

	useEffect(() => {
		if (groupMemberStatus && tabOptions.includes(groupMemberStatus)) {
			setActiveTab(groupMemberStatus);
		} else {
			router.replace(`?groupMembers=${defaultTab}`);
		}
	}, [groupMemberStatus, defaultTab, tabOptions, router]);

	const handleTabChange = (value: string) => {
		if (tabOptions.includes(value)) {
			setActiveTab(value);
			router.push(`?groupMembers=${value}`);
		}
	};

	return {
		activeTab,
		handleTabChange,
	};
};
