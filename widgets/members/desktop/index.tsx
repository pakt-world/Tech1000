"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "usehooks-ts";

import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { mapTalentData } from "@/lib/actions";
import { useGetTalentInfinitely } from "@/lib/api/talent";
import { type MemberProps } from "@/lib/types/member";
import { createQueryStrings2 } from "@/lib/utils";

import { MemberHeader } from "./misc/member-header";
import { MemberList } from "./misc/member-list";
import { useProductVariables } from "@/hooks/use-product-variables";

export default function MemberDesktopView(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { variables } = useProductVariables();
	const isTech1000 = variables?.NAME === "Tech1000";

	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") ?? ""
	);
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [skillsQuery, setSkillsQuery] = useState(
		searchParams.get("skills") ?? ""
	);
	const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	const [minimumPriceQuery, setMinimumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[0] ?? ""
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[1] ?? ""
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);

	useEffect(() => {
		const queries = createQueryStrings2({
			//role: activeRoleTab,
			...(debouncedSkillsQuery && {
				skills: debouncedSkillsQuery,
			}),
			...(debouncedSearchQuery && {
				search: debouncedSearchQuery,
			}),
			...(debouncedMinimumPriceQuery &&
				debouncedMaximumPriceQuery && {
					range: `${debouncedMinimumPriceQuery},${debouncedMaximumPriceQuery}`,
				}),
		});

		router.push(`${pathname}?${queries}`);
	}, [
		router,
		pathname,
		debouncedSearchQuery,
		debouncedSkillsQuery,
		debouncedMinimumPriceQuery,
		debouncedMaximumPriceQuery,
		//activeRoleTab,
	]);

	const queryParams = new URLSearchParams(searchParams);
	const searchQ = queryParams.get("search") ?? "";
	const skillQ = queryParams.get("skills") ?? "";
	const rangeQ = queryParams.get("range") ?? "";
	const roleQ = queryParams.get("role") ?? "";

	const {
		data: talentPagesData,
		refetch: talentRefetch,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTalentInfinitely({
		limit: 9,
		filter: {
			...(searchQ && { search: searchQ }),
			...(skillQ && { tags: skillQ }),
			...(rangeQ && { range: rangeQ }),
			// profileCompletenessMin: 70,
			// profileCompletenessMax: 100,
			...(!isTech1000 && { owner: true }),
			...(!isTech1000 && { role: roleQ }),
			// sortBy: "score",
			// orderBy: "desc",
			// isPrivate: false,
		},
	});

	const talentData = useMemo(
		() => ({
			...talentPagesData,
			pages: talentPagesData?.pages?.map((page) => page.data) ?? [],
		}),
		[talentPagesData]
	);

	const { observerTarget, currentData } = useInfiniteScroll<MemberProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage: currentPageRef.current,
		prevPage: prevPageRef.current,
		data: talentData,
		refetch: talentRefetch,
		error: error?.response?.data.message ?? "",
	});
	const newData = currentData.map(mapTalentData);

	return (
		<div className="relative flex h-full w-full flex-col gap-6 overflow-auto">
			<MemberHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				skillsQuery={skillsQuery}
				setSkillsQuery={setSkillsQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
			/>
			<MemberList
				isLoading={isLoading}
				members={newData}
				isFetchingNextPage={isFetchingNextPage}
				ref={observerTarget}
			/>
		</div>
	);
}
