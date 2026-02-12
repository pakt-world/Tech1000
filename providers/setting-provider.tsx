/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { createContext, type ReactNode, useContext } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageLoading } from "@/components/common/page-loading";
import { SystemSettings, useGetSetting } from "@/lib/api/setting";
import { useIsClient } from "usehooks-ts";

interface SettingsContextType {
	settings: SystemSettings | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined
);

export function SettingsProvider({
	children,
}: {
	children: ReactNode;
}): JSX.Element {
	const isClient = useIsClient();
	/// === Get System Settings === //
	const {
		data: settings,
		isFetched: settingsFetched,
		isFetching: settingsFetching,
	} = useGetSetting({
		enable: true,
	});

	if (!isClient || (!settingsFetched && settingsFetching)) {
		return <PageLoading color="#FF99A2" />;
	}

	const value = {
		settings,
	};

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings(): SettingsContextType {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error(
			"useSettingContext must be used within a SettingsProvider"
		);
	}
	return context;
}
