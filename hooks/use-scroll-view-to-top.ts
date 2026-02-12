import { useEffect } from "react";

const useScrollToTopOnMount = (type: string) => {
	useEffect(() => {
		if (type === "detail") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [type]);
};

export default useScrollToTopOnMount;
