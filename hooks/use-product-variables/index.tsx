"use client";

import { useEffect, useMemo, useState } from "react";
import { tech1000Variables } from "./tech1000";

import { Variables } from "./type";
import { Spinner } from "@/components/common/loader";

// Utility function to fetch configuration variables
export const useProductVariables = (
	extras?: Partial<Variables>
): Partial<JSX.Element> & Partial<{ variables: Variables | null }> => {
	const [variables, setVariables] = useState<Variables | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, _setError] = useState<string | null>(null);

	// Memoize extras to avoid unnecessary re-renders
	const memoizedExtras = useMemo(() => extras, [JSON.stringify(extras)]);

	useEffect(() => {
		const fetchVariables = async () => {
			const mergedTech1000Variables: Variables = {
				...memoizedExtras,
				...tech1000Variables,
			};
			setVariables(mergedTech1000Variables);
			setLoading(false);
		};
		fetchVariables();
	}, [memoizedExtras]);

	if (loading) {
		return (
			<div>
				<Spinner size={16} />
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return { variables };
};
