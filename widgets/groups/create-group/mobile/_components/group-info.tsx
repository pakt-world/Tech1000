/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { Controller } from "react-hook-form";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { CustomInput } from "@/components/common/custom-input";
import { UploadAvatar } from "@/components/common/upload-avatar";
import CardView from "@/components/common/card-view";

interface GroupInfoProps {
	control: any;
	errors: any;
	onUploadComplete: (data: any) => void;
}

const GroupInfo4Mobile: React.FC<GroupInfoProps> = ({
	control,
	errors,
	onUploadComplete,
}) => {
	return (
		<CardView className="flex w-full flex-col gap-3 !border-none !bg-ink-darkest/0 !p-0 !backdrop-blur-none">
			<div className="flex w-full flex-col items-center gap-2">
				<div className="items-left flex w-full flex-col gap-1">
					<Controller
						name="image"
						control={control}
						render={({ field: { onChange, value = "" } }) => (
							<UploadAvatar
								image={value}
								type="uploader"
								size={50}
								onUploadComplete={(data) => {
									onUploadComplete(data);
									onChange(data?.url);
								}}
							/>
						)}
					/>
					{errors.image && (
						<span className="text-xs text-red-500">
							{errors.image.message}
						</span>
					)}
				</div>

				<div className="flex w-full flex-col gap-1">
					<div className="flex flex-col gap-1">
						<Controller
							name="name"
							control={control}
							defaultValue=""
							render={({
								field: { value, onChange, ...rest },
							}) => (
								<CustomInput
									{...rest}
									value={value || ""}
									onChange={(e) => onChange(e.target.value)}
									type="text"
									className="w-full !border-none !bg-inherit !p-0 !text-xl !font-bold placeholder:!text-xl placeholder:!font-bold"
									placeholder="Enter Group Name"
								/>
							)}
						/>
						{errors.name && (
							<span className="mb-2 text-xs text-red-500">
								{errors.name.message}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col gap-1">
				<Controller
					name="description"
					control={control}
					defaultValue=""
					render={({ field: { value, onChange, ...rest } }) => (
						<textarea
							{...rest}
							value={value || ""}
							onChange={(e) => onChange(e.target.value)}
							className="w-full rounded-lg border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] p-2 !text-white placeholder:!text-[#72777A] focus:border-white focus:outline-none"
							placeholder="Enter group description"
							rows={3}
						/>
					)}
				/>
				{errors.description && (
					<span className="text-xs text-red-500">
						{errors.description.message}
					</span>
				)}
			</div>
		</CardView>
	);
};

export default GroupInfo4Mobile;
