interface SquareCheckMarkProps {
	isChecked: boolean;
	onClick: () => void;
	isClient?: boolean;
	disabled?: boolean;
}

export const CheckButton = ({
	isChecked,
	onClick: setIsChecked,
	isClient,
	disabled,
}: SquareCheckMarkProps): JSX.Element => {
	return (
		<button
			className="scale-[0.8] disabled:cursor-not-allowed"
			onClick={setIsChecked}
			type="button"
			disabled={isClient ?? disabled}
		>
			{isChecked ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						fill="#ffffff"
					/>
					<path
						d="M8 13L10.9167 16L16 8"
						stroke="#D3180C"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						stroke="#FF9898"
						strokeWidth="2"
					/>
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						fill="url(#paint0_linear_988_53583)"
					/>
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						stroke="#FFE5E5"
						strokeWidth="2"
					/>
					<defs>
						<linearGradient
							id="paint0_linear_988_53583"
							x1="12"
							y1="0"
							x2="12"
							y2="24"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#FCFCFC" />
							<stop offset="1" stopColor="#F8F8F8" />
						</linearGradient>
					</defs>
				</svg>
			)}
		</button>
	);
};
