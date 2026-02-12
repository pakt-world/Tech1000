interface ErrorMessageProps {
	message?: string;
}

export const InputErrorMessage = ({
	message,
}: ErrorMessageProps): React.JSX.Element => {
	return (
		<span className="absolute bottom-[-20px] text-xs text-danger">
			{message}
		</span>
	);
};
