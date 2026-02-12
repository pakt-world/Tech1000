/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { axios } from "@/lib/axios";

interface UseSetTokenProps {
	token: string | undefined | null;
	setIsTokenSet: (isTokenSet: boolean) => void;
}

export const useSetToken = ({
	token,
	setIsTokenSet,
}: UseSetTokenProps): void => {
	const router = useRouter();

	useEffect(() => {
		if (token !== undefined && token !== null && token !== "") {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
			setIsTokenSet(true);
		} else {
			router.push("/login");
		}
		return () => {
			axios.defaults.headers.common.Authorization = "";
		};
	}, [router, setIsTokenSet, token]);
};
