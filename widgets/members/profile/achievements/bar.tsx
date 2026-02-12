/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ACHIEVEMENT_STYLES, type AchievementSettingProps } from "./types";

interface AchievementBarProps {
	achievement: AchievementSettingProps;
	isPartner?: boolean;
}

export const AchievementBar = ({
	achievement,
	isPartner,
}: AchievementBarProps): JSX.Element => {
	const styles = ACHIEVEMENT_STYLES[achievement.type];
	// const percentage = (achievement.value / achievement.maxValue) * 100;

	const lockedBadge =
		styles.title === "Referrals" || styles.title === "Squad";

	return (
		<div className="flex flex-col items-center gap-2 max-sm:scale-[0.9]">
			<div
				className="w-full rounded-3xl bg-stone-800 p-2 sm:w-[100px]"
				style={{
					border: `2px solid ${styles.borderColor}`,
					// backgroundColor: styles.outerBackgroundColor,
				}}
			>
				{isPartner ? (
					<div
						className="flex flex-col items-center justify-between gap-2 rounded-xl bg-stone-700 p-3"
						style={{
							color: styles.textColor,
							// backgroundColor: styles.innerBackgroundColor,
						}}
					>
						<Image
							src="/icons/lock.png"
							height={100}
							width={100}
							alt="locked"
						/>
					</div>
				) : lockedBadge ? (
					<div
						className="flex flex-col items-center justify-between gap-2 rounded-xl bg-stone-700 p-3"
						style={{
							color: styles.textColor,
							// backgroundColor: styles.innerBackgroundColor,
						}}
					>
						<Image
							src="/icons/lock.png"
							height={100}
							width={100}
							alt="locked"
						/>
					</div>
				) : (
					<div
						className="flex flex-col items-center justify-between gap-2 rounded-xl bg-stone-700 p-3"
						style={{
							color: styles.textColor,
							// backgroundColor: styles.innerBackgroundColor,
						}}
					>
						<span className="text-base text-white sm:text-2xl">
							{achievement.value}
						</span>
					</div>
				)}
			</div>
			<span className="text-base text-white max-sm:text-center sm:text-lg">
				{!lockedBadge && !isPartner && styles.title}
			</span>
		</div>
	);
};
