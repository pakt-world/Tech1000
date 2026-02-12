"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import {
	Command,
	CommandEmpty,
	CommandList,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/common/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/common/popover";
import { ScrollArea, ScrollBar } from "@/components/common/scroll-area";
import { type StateProps } from "@/lib/types/location";
import { cn, lowerCase, titleCase } from "@/lib/utils";
import { useGetStates } from "@/lib/api/misc";

interface StateDropdownProps {
	onChange: (value: string) => void;
	value: string;
	countryValue: string;
	onBlur?: () => void;
}

const StateDropdown = ({
	onChange,
	value,
	countryValue,
	onBlur,
}: StateDropdownProps): JSX.Element => {
	const states = useGetStates();
	// const s = states.data as StateProps[];

	const s = states.data?.filter(
		(state) => state.country_name === titleCase(countryValue)
	) as StateProps[];

	const [openStateDropdown, setOpenStateDropdown] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Filter countries based on search term
	const filteredStates = s
		?.filter((country) => {
			const searchWords = searchTerm.toLowerCase().split(/\s+/);
			const itemWords = country.name.toLowerCase().split(/\s+/);

			// Filter the countries based on the search term
			return searchWords.every((word) =>
				itemWords.some((itemWord) => itemWord.includes(word))
			);
		})
		.sort((a, b) => {
			// Sort the filtered countries to prioritize those that start with the search term
			const aStartsWith = a.name
				.toLowerCase()
				.startsWith(searchTerm.toLowerCase());
			const bStartsWith = b.name
				.toLowerCase()
				.startsWith(searchTerm.toLowerCase());
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			return 0;
		});

	return (
		<Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
			<PopoverTrigger asChild>
				<Button
					data-test-id="state"
					role="combobox"
					aria-expanded={openStateDropdown}
					className="input-style h-[48px] w-full justify-between rounded-lg !bg-opacity-100 text-base text-white hover:!text-white dark:!text-white"
					disabled={!countryValue || filteredStates?.length === 0}
					onBlur={onBlur}
				>
					{value ? (
						<div className="flex items-end gap-2 dark:!text-white">
							<span>
								{
									filteredStates?.find(
										(state) =>
											lowerCase(state.name) ===
											lowerCase(value)
									)?.name
								}
							</span>
						</div>
					) : (
						<span className=" dark:!text-white">
							Select State...
						</span>
					)}
					<ChevronsUpDown
						color="#ffffff"
						className="ml-2 size-4 shrink-0 "
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="PopoverContent container_style rounded-[6px] p-0">
				<Command>
					<CommandInput
						placeholder="Search for your state/region..."
						className="text-white"
						value={searchTerm}
						onValueChange={setSearchTerm}
					/>
					<CommandList className="max-h-[250px] cursor-pointer overflow-y-auto overflow-x-hidden p-2">
						<CommandEmpty className="my-4 w-full text-center ">
							No state found.
						</CommandEmpty>
						<CommandGroup>
							<ScrollArea className="h-[300px] w-full">
								{filteredStates?.map((state) => (
									<CommandItem
										key={state.id}
										value={state.name}
										onSelect={(currentValue: string) => {
											// setStateValue(currentValue === lowerCase(state.name) ? currentValue : "");
											onChange(
												currentValue ===
													lowerCase(state.name)
													? currentValue
													: ""
											);
											setOpenStateDropdown(false);
										}}
										className="hover:!bg-primary-brighter flex cursor-pointer items-center  justify-between text-sm text-white hover:!bg-white hover:!bg-opacity-20"
									>
										<div className="flex items-end gap-2">
											<span className="">
												{state.name}
											</span>
										</div>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === lowerCase(state.name)
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								))}
								<ScrollBar orientation="vertical" />
							</ScrollArea>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default StateDropdown;
