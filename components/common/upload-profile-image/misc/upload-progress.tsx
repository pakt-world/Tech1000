export function UploadProgress({
	progress,
}: {
	progress: number;
}): React.JSX.Element {
	return (
		<div className="z-[10000] flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-gray-200 border-opacity-20 bg-primary p-4">
			<span className="text-sm text-neutral-300">Uploading</span>
			<div className="h-[8px] w-full overflow-hidden rounded-full bg-[#EBEFF2]">
				<div
					className="h-full rounded-full bg-green-500"
					style={{
						width: `${progress}%`,
					}}
				/>
			</div>
		</div>
	);
}
