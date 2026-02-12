/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { Controller } from "react-hook-form";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { CustomInput } from "@/components/common/custom-input";

interface GroupTagsProps {
	control: any;
	errors: any;
}

const GroupTags4Mobile: React.FC<GroupTagsProps> = ({ control, errors }) => (
	<div className="flex w-full flex-col gap-3 border-t border-white/40 pt-4">
		<span className="flex flex-col gap-1 text-lg font-bold text-white">
			<p>Group Interests </p>

			<span className="text-sm font-normal text-white/80">
				Must add 3
			</span>
		</span>
		<div className="flex flex-col">
			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<div>
						<div className="grid grid-cols-1 gap-2">
							{[...Array(3)].map((_, index) => (
								<CustomInput
									key={index}
									placeholder="Enter Tag"
									wrapper="rounded-full"
									className="!rounded-3xl !text-[16px]"
									{...field}
									value={field.value[index]}
									onChange={(e) => {
										const newTags = [
											...(field.value || []),
										];
										newTags[index] = e.target.value;
										field.onChange(newTags);
									}}
								/>
							))}
						</div>

						{field.value.length === 0 && errors.tags && (
							<span className="text-xs text-red-500">
								{errors.tags.message}
							</span>
						)}
					</div>
				)}
			/>
		</div>
	</div>
);

export default GroupTags4Mobile;
