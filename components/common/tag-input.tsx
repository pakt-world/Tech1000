/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, X } from "lucide-react";
import { type FC, useEffect, useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { useDebounce, useOnClickOutside } from "usehooks-ts";

import { useGetCategory } from "@/lib/api/category";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import {
	cn,
	disallowedChars,
	filterSkillsByName,
	rejectSpecialCharacters,
	sentenceCase,
} from "@/lib/utils";

import { type EditProfileFormValues } from "../../widgets/settings/desktop/profile-settings";
import { Spinner } from "./loader";

interface TagInputProps {
	tags: string[];
	setTags: (tags: string[]) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
	form?: UseFormReturn<EditProfileFormValues> | undefined;
	onBlur: () => void;
}

export const TagInput: FC<TagInputProps> = ({
	tags,
	setTags,
	className,
	placeholder,
	disabled,
	form,
	onBlur,
}) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");

	const debouncedInputValue = useDebounce(inputValue, 500);

	const ref = useRef<HTMLDivElement | null>(null);

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>
	): void => {
		if (
			(event.key === "Enter" || event.key === ",") &&
			inputValue.trim() !== ""
		) {
			// Validate the input when it changes
			event.preventDefault();
			if (rejectSpecialCharacters(inputValue)) {
				setTags([...tags, inputValue.trim()]);
				setInputValue("");
			}
		}
		if (event.key === "Backspace" && inputValue === "") {
			setTags(tags.slice(0, -1));
		}
		// Open the dropdown when the user types
		if (event.key.length === 1) {
			setIsOpened(true);
		} else {
			setIsOpened(false);
		}
	};

	const { data, isFetching, isLoading } = useGetCategory(debouncedInputValue);
	const categories = data?.data ?? [];
	const ct = filterSkillsByName(categories, disallowedChars);

	const CATEGORY_LIST: Array<{ label: string; value: string }> = (
		ct || []
	).map((c) => ({
		label: sentenceCase(c.name),
		value: sentenceCase(c.name),
	}));

	// Filter with skillValue/inputValue
	const filteredCategoryList = CATEGORY_LIST.filter((category) => {
		return category.label.toLowerCase().includes(inputValue.toLowerCase());
	});

	const handleClickOutside = (): void => {
		setIsOpened(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	useEffect(() => {
		if (filteredCategoryList.length === 0 && !isLoading && !isFetching) {
			setIsOpened(false);
		}
	}, [filteredCategoryList.length, isFetching, isLoading]);

	useEffect(() => {
		// Throw form error if isNot valid
		if (form) {
			if (!rejectSpecialCharacters(inputValue) && inputValue !== "") {
				form.setError("tags", {
					type: "manual",
					message: "Special characters are not allowed",
				});
			} else {
				form.clearErrors("tags");
			}
		}
	}, [form, inputValue]);
	return (
		<div
			className={`${cn(
				"flex flex-wrap items-center gap-2 rounded-lg border border-line px-2 py-2 duration-200 hover:border-secondary group-focus-within:border-secondary peer-focus-within:border-secondary",
				className
			)}`}
		>
			{tags.map((tag) => (
				<div
					key={tag}
					className="inline-flex items-center gap-2 rounded-full border border-primary border-opacity-30 !bg-rose-300 px-3 py-1 text-sm text-primary"
				>
					<span className="max-w-[200px] truncate">{tag}</span>
					<button
						type="button"
						className="text-primary"
						onClick={() => {
							setTags(tags.filter((t) => t !== tag));
						}}
						aria-label="Close"
					>
						<X size={16} strokeWidth={1} />
					</button>
				</div>
			))}
			<div className="relative !w-[330px] !text-sm">
				<input
					data-test-id="tag-input"
					// type="text"
					className="peer w-full grow !bg-transparent outline-none disabled:!bg-transparent"
					placeholder={placeholder ?? "Add skills"}
					value={inputValue}
					onChange={(event) => {
						setInputValue(event.target.value);
					}}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					onBlur={() => {
						onBlur();
					}}
				/>
				{isOpened && (
					<div
						className="container_style absolute z-50 max-h-[230px] min-w-[271px] translate-x-1 translate-y-2 gap-4 overflow-hidden overflow-y-auto rounded-lg p-4 text-white shadow"
						ref={ref}
					>
						{isFetching || isLoading ? (
							<Spinner />
						) : (
							<>
								{filteredCategoryList.map(
									({ label, value: v }) => (
										<div
											key={v}
											className="relative flex w-full cursor-pointer select-none items-center rounded p-2 text-base outline-none hover:bg-white hover:bg-opacity-20"
											onClick={() => {
												setIsOpened(false);
												setTags([...tags, label]);
												setInputValue("");
											}}
											onKeyDown={handleKeyDown}
											role="button"
											tabIndex={0}
										>
											{label}
											{label === inputValue && (
												<span className="absolute right-3 flex size-3.5 items-center justify-center">
													<Check className="size-4 text-white" />
												</span>
											)}
										</div>
									)
								)}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

interface TagInputProps2 {
	tags: string[];
	setTags: (tags: string[]) => void;
	className?: string;
	placeholder?: string;
}

export const TagInput2: FC<TagInputProps2> = ({
	tags,
	setTags,
	className,
	placeholder,
}) => {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>
	): void => {
		if (event.key === "Enter" && inputValue.trim() !== "") {
			event.preventDefault();
			setTags([...tags, inputValue.trim()]);
			setInputValue("");
		}
		if (event.key === "Backspace" && inputValue === "") {
			setTags(tags.slice(0, -1));
		}
	};

	return (
		<div
			className={`${cn(
				"flex flex-wrap items-center gap-2 rounded-lg border border-line px-2 py-2 duration-200 hover:border-secondary group-focus-within:border-secondary peer-focus-within:border-secondary",
				className
			)}`}
		>
			{tags.map((tag) => (
				<div
					key={tag}
					className="inline-flex items-center gap-2 rounded-full !bg-dark-badge px-3 py-1 text-sm text-white"
				>
					<span>{tag}</span>
					<button
						type="button"
						className="text-white"
						onClick={() => {
							setTags(tags.filter((t) => t !== tag));
						}}
						aria-label="Close"
					>
						<X size={16} strokeWidth={1} />
					</button>
				</div>
			))}
			<input
				type="text"
				className="peer grow bg-transparent !text-white outline-none"
				placeholder={placeholder ?? "Add skills"}
				value={inputValue}
				onChange={(event) => {
					setInputValue(event.target.value);
				}}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
};
