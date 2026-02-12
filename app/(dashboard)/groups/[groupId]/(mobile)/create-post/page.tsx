"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CreatePostView4Mobile from "@/widgets/groups/view-group/mobile/_components/details/forum/post/misc/create-post-view-4-mobile";
export default function CreatePostView(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	if (tab) {
	}
	return <CreatePostView4Mobile />;
}
