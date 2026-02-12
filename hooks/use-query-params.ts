import { useSearchParams } from "next/navigation";

function useQueryParams(keys: string[], defaults: Record<string, any> = {}) {
	const searchParams = useSearchParams();

	const params = keys.reduce(
		(acc, key) => {
			const value = searchParams.get(key);
			if (value !== null && value.trim() !== "") {
				acc[key] = value;
			} else if (defaults[key] !== undefined) {
				acc[key] = defaults[key];
			}
			return acc;
		},
		{} as Record<string, any>
	);

	return params;
}

export default useQueryParams;
