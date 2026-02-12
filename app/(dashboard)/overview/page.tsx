"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Overview4Desktop from "@/widgets/overview/desktop";

export default function Overview(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	return tab ? <Overview4Desktop /> : <Overview4Desktop />;
}
