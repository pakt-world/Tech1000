/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Skeleton } from "@/components/common/skeletons/skeleton";
import { useUnreadChats } from "@/hooks/use-unread-chats";
import { useUserState } from "@/lib/store/account";
import { useMessaging } from "@/providers/socket-provider";

import { Brand } from "./misc/brand";
import { LogOut } from "./misc/logout";
import { LINKS, NavLink } from "./misc/nav-link";
import { UserProfile } from "./misc/user-profile";
import CardView from "@/components/common/card-view";
import { useWindowSize } from "usehooks-ts";

export const Sidebar = (): JSX.Element => {
	const { allConversations } = useMessaging();

	const account = useUserState();
	const accountIsLoading = account._id === "";
	const { _id: loggedInUser } = account;

	const unreadCount = useUnreadChats(allConversations, loggedInUser);
	const size = useWindowSize();
	return (
		<div className="z-[10] flex h-screen items-center p-6">
			{/* <div className="absolute inset-0 !z-[1] bg-[url(/images/cardboard.webp)] bg-cover bg-center bg-no-repeat object-cover mix-blend-soft-light" /> */}

			<CardView
				className={`${size?.height < 800 ? "!p-4" : "!p-6"} flex h-full w-full max-w-[287px] flex-col !border !border-lemon-green `}
			>
				<div className=" flex h-full w-full flex-col">
					<Brand />
					<div
						className={`${size?.height < 800 ? "my-2" : "my-4"} z-[2]  border-b border-line opacity-20`}
					/>

					<div
						className={`${size?.height < 800 ? "mb-2" : "mb-4"} z-[2] flex w-full flex-col items-center`}
					>
						<UserProfile account={account} />
					</div>

					<div className="z-[2] border-b border-line opacity-20 " />

					<div className="flex flex-col overflow-scroll">
						<div
							className={`${size?.height < 800 ? "gap-1 pt-2" : "gap-2 pt-6 "} z-[2] mx-auto flex w-fit flex-col gap-1 pb-2 min-[1440px]:gap-4 min-[1440px]:pb-4`}
						>
							{LINKS.map(({ href, icon, label }, i) =>
								accountIsLoading ? (
									<Skeleton
										className="h-[40px] w-[160px]"
										key={i}
									/>
								) : (
									<NavLink key={href} href={href}>
										{icon}
										<span
											className={`${size?.height < 800 ? "text-sm" : ""}`}
										>
											{label}
										</span>
										{label === "Messages" &&
											unreadCount > 0 && (
												<p className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-center text-xs text-white text-opacity-80">
													{unreadCount >= 100
														? "99+"
														: unreadCount}
												</p>
											)}
									</NavLink>
								)
							)}
						</div>
					</div>

					<div className="z-[2] mx-auto mt-auto flex justify-center py-4 min-[1440px]:py-6 ">
						<LogOut />
					</div>
				</div>
			</CardView>
		</div>
	);
};
