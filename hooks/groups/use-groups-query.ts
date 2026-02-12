import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface GroupQueryType {
	defaultTab: string;
	tabOptions: string[];
}

export const useGroupsQuery = ({
	defaultTab = "created",
	tabOptions = [],
}: GroupQueryType) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const status = searchParams.get("type");
	const searchQuery = searchParams.get("search");
	const minimumScoreQuery = searchParams.get("minimumScore");
	const maximumScoreQuery = searchParams.get("maximumScore");

	const [activeTab, setActiveTab] = useState(status || defaultTab);
	const [search, setSearch] = useState(searchQuery || "");
	const [minimumScore, setMinimumScore] = useState(minimumScoreQuery || "");
	const [maximumScore, setMaximumScore] = useState(maximumScoreQuery || "");

	useEffect(() => {
		if (status && tabOptions.includes(status)) {
			setActiveTab(status);
		} else {
			router.replace(`?type=${defaultTab}`);
		}
	}, [status]);

	useEffect(() => {
		setSearch(searchQuery || "");
	}, [searchQuery]);

	useEffect(() => {
		setMinimumScore(minimumScoreQuery || "");
	}, [minimumScoreQuery]);

	useEffect(() => {
		setMaximumScore(maximumScoreQuery || "");
	}, [maximumScoreQuery]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		router.push(
			`?type=${value}&search=${search}&minimumScore=${minimumScore}&maximumScore=${maximumScore}`
		);
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
		router.push(
			`?type=${activeTab}&search=${value}&minimumScore=${minimumScore}&maximumScore=${maximumScore}`
		);
	};

	const handleMinimumScoreChange = (value: string) => {
		setMinimumScore(value);
		router.push(
			`?type=${activeTab}&search=${search}&minimumScore=${value}&maximumScore=${maximumScore}`
		);
	};

	const handleMaximumScoreChange = (value: string) => {
		setMaximumScore(value);
		router.push(
			`?type=${activeTab}&search=${search}&minimumScore=${minimumScore}&maximumScore=${value}`
		);
	};

	return {
		activeTab,
		handleTabChange,
		search,
		handleSearchChange,
		minimumScore,
		handleMinimumScoreChange,
		maximumScore,
		handleMaximumScoreChange,
	};
};
