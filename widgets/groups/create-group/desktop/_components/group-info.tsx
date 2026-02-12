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

const GroupInfo: React.FC<GroupInfoProps> = ({
	control,
	errors,
	onUploadComplete,
}) => {
	return (
		<CardView className="w-full !border-2 !border-[#F2C650] !px-6 !py-4">
			<div className="flex w-full items-center gap-6">
				<div className="flex flex-col items-center gap-1">
					<Controller
						name="image"
						control={control}
						render={({ field: { onChange, value = "" } }) => (
							<UploadAvatar
								image={value}
								type="uploader"
								size={128}
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
									className="w-full !border-none !bg-inherit !p-0 !text-3xl !font-bold placeholder:!text-3xl placeholder:!font-bold"
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

					<div className="flex flex-col gap-1">
						<Controller
							name="description"
							control={control}
							defaultValue=""
							render={({
								field: { value, onChange, ...rest },
							}) => (
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
				</div>
			</div>
		</CardView>
	);
};

export default GroupInfo;
