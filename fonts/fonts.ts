/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { Kode_Mono } from "next/font/google";
/* istanbul ignore next */
export const kodeMono = Kode_Mono({
	weight: ["400", "500", "600", "700"],
	style: ["normal"],
	subsets: ["latin-ext"],
	fallback: ["sans-serif"],
});
