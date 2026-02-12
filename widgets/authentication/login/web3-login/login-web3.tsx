"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";
import { useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import CardView from "../../../../components/common/card-view";

interface LoginWeb3FormProps {
	onFormSubmit: () => void;
}

const Web3LoginForm = ({
	onFormSubmit,
}: LoginWeb3FormProps): React.JSX.Element => {
	const router = useRouter();
	return (
		<div className=" flex flex-col gap-6">
			<CardView className="!border-1 flex flex-col gap-8 !border-lemon-green sm:max-w-[600px] ">
				<h5 className="text-center text-base font-medium text-white md:text-2xl">
					Connect your wallet with your Tech1000 NFT to unlock access.
				</h5>

				<Image
					src={"/images/connect-wallet-image.svg"}
					alt="Logo"
					width={275}
					height={60}
					priority
				/>

				<Button
					fullWidth
					className="cursor-pointer touch-manipulation"
					onClick={onFormSubmit}
				>
					Connect Wallet
				</Button>
			</CardView>
			<CardView
				className={`relative flex w-full justify-between gap-2 rounded-full  !border  !bg-[#FCFCFD1A]/25 !px-4 !py-2 md:!px-6 md:!py-4`}
			>
				<h2 className="font-circular text-base font-medium  text-white md:text-xl">
					Need a Tech1000 NFT?
				</h2>
				<Button
					type="button"
					variant="outline"
					className="cursor-pointer rounded-full px-6 py-2 text-base font-normal hover:!bg-[#FCFCFD1A]/15 md:px-8 md:text-lg"
					onClick={() => router.push("mint")}
				>
					Buy Here
				</Button>
			</CardView>
		</div>
	);
};

export default Web3LoginForm;
