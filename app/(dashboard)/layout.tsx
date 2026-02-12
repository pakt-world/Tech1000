"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useIdleTimer } from "react-idle-timer";
import { useMediaQuery, useIsClient } from "usehooks-ts";
import { useDisconnect } from "wagmi";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AccountWrapper } from "@/components/common/account-wrapper";
import { LogoutConfirmation } from "@/components/common/logout-confirmation";
import { PageLoading } from "@/components/common/page-loading";
import { SessionTimeoutAlert } from "@/components/common/session-timeout-alert";
import { KycModal } from "@/components/kyc/modal";
import { Sidebar } from "@/components/navigations/desktop-sidebar";
import { BottomNav } from "@/components/navigations/mobile-footer";
import { MobileHeader } from "@/components/navigations/mobile-header";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useSetToken } from "@/hooks/use-set-token";
import { useViewportHeight } from "@/hooks/use-viewport-height";
import { useLogoutConfirmationStore } from "@/lib/store/misc";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { resetAllStates } from "@/lib/store";
import { useGetSetting } from "@/lib/api/setting";
import { MobileProvider } from "@/providers/mobile-context-provider";
import { MessagingProvider } from "@/providers/socket-provider";
import { CardVisibilityProvider } from "@/providers/card-visibility-provider";

const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
const FTN_DAYS_IN_MS = 20 * 24 * 60 * 60 * 1000;

export default function DashboardLayout({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const queryClient = useQueryClient();
	const { disconnect } = useDisconnect();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const isClient = useIsClient();

	const token = getCookie(AUTH_TOKEN_KEY);
	const [isTokenSet, setIsTokenSet] = useState(false);

	const [remainingTime, setRemainingTime] = useState(0);
	const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

	const { showLogoutConfirmation, setShowLogoutConfirmation } =
		useLogoutConfirmationStore();

	const notLoggingOut = (): void => {
		setShowLogoutConfirmation(false);
	};

	const onIdle = (): void => {
		setIsTimeoutModalOpen(false);
		queryClient.clear();
		router.push("/login");
		deleteCookie(AUTH_TOKEN_KEY);
	};

	const onActive = (): void => {
		setIsTimeoutModalOpen(false);
	};

	const onPrompt = (): void => {
		setIsTimeoutModalOpen(true);
	};

	const { getRemainingTime, activate } = useIdleTimer({
		onIdle,
		onActive,
		onPrompt,
		timeout: FTN_DAYS_IN_MS,
		promptBeforeIdle: THIRTY_MINUTES_IN_MS / 2,
	});

	const stayActive = (): void => {
		setIsTimeoutModalOpen(false);
		setTimeout(() => {
			activate();
		}, 1000);
	};

	useEffect(() => {
		const updateRemainingTime = () => {
			setRemainingTime(getRemainingTime());
		};
		const intervalId = setInterval(updateRemainingTime, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [getRemainingTime]);

	useEffect(() => {
		if (pathname === "/login") {
			setShowLogoutConfirmation(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const Logout = async () => {
		deleteCookie(AUTH_TOKEN_KEY);
		setShowLogoutConfirmation(false);
		resetAllStates();
		queryClient.clear();
		await disconnect();
		router.push("/login");
	};

	/// === Get System Settings === //
	const { isFetched: settingsFetched, isFetching: settingsFetching } =
		useGetSetting({
			enable: true,
		});

	useSetToken({ token, setIsTokenSet });
	useScrollToTop();
	useViewportHeight();

	useEffect(() => {
		if (token) {
			const loginTime = Date.now();
			setCookie(AUTH_TOKEN_KEY, token, {
				expires: new Date(loginTime + FTN_DAYS_IN_MS),
			});
		}
	}, [token]);

	const [height, setHeight] = useState(window.innerHeight);
	const fixedHeightViews =
		pathname.startsWith("/messages/") ||
		pathname.startsWith("/groups/create");

	useEffect(() => {
		const handleResize = () => setHeight(window.innerHeight);

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if ((!isClient && !isTokenSet) || (!settingsFetched && settingsFetching)) {
		return <PageLoading color="#FF99A2" />;
	}

	return (
		<AccountWrapper tokenSet={isTokenSet}>
			<MessagingProvider>
				<MobileProvider>
					<CardVisibilityProvider>
						<div
							className={`flex h-full w-full !overflow-hidden md:h-screen max-sm:h-[${height}px]`}
							style={
								!isDesktop && fixedHeightViews
									? { height: `${height}px` }
									: undefined
							}
						>
							{isDesktop && (
								<div className="absolute inset-0 !z-[1] hidden size-full bg-default bg-cover  bg-center bg-repeat object-cover md:flex md:h-full" />
							)}
							{isDesktop && <Sidebar />}
							<div className="relative z-[2] h-full min-h-[100vh] w-full !overflow-hidden max-sm:flex max-sm:flex-col md:h-fit md:overflow-hidden">
								{/* ---- Modals ----*/}
								{!isDesktop && (
									<div className="absolute inset-0 !z-[1] flex size-full bg-default bg-cover  bg-center bg-repeat object-cover md:hidden md:h-full" />
								)}
								<SessionTimeoutAlert
									isTimeoutModalOpen={isTimeoutModalOpen}
									remainingTime={remainingTime}
									stayActive={stayActive}
									Logout={Logout}
								/>
								<LogoutConfirmation
									showLogoutConfirmation={
										showLogoutConfirmation
									}
									stayActive={notLoggingOut}
									Logout={Logout}
								/>
								<KycModal />
								{/* ---- Modals ---- */}
								{!isDesktop && <MobileHeader />}
								<main
									className={`relative !z-20 w-full flex-1 overflow-hidden sm:mb-10 sm:py-6 sm:pr-4 md:h-screen md:overflow-scroll  md:px-4 md:pl-0 2xl:pr-8 ${!pathname.startsWith("/messages/") && " max-sm:!mt-[70px]"}`}
								>
									{children}
								</main>
								<BottomNav />
							</div>
						</div>
					</CardVisibilityProvider>
				</MobileProvider>
			</MessagingProvider>
		</AccountWrapper>
	);
}
