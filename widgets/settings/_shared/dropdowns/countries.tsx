"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, ChevronsUpDown } from "lucide-react";
import { type UseFormSetValue } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandList,
	CommandInput,
	CommandItem,
} from "@/components/common/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/common/popover";
// import { ScrollArea, ScrollBar } from "@/components/common/scroll-area";
import { type CountryProps } from "@/lib/types/location";
import { cn, lowerCase } from "@/lib/utils";
import { type EditProfileFormValues } from "@/widgets/settings/desktop/profile-settings";
import { useGetCountries } from "@/lib/api/misc";
import { useMediaQuery } from "usehooks-ts";

interface CountryDropdownProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	value: string;
	onBlur?: () => void;
	setValue?: UseFormSetValue<EditProfileFormValues>;
}

interface SelectedCountryProps {
	value: string | null; // The selected country value (name)
	data: CountryProps[]; // The array of country data
}

const SelectedCountry: React.FC<SelectedCountryProps> = ({ value, data }) => {
	if (!value) {
		return <span>Select Country...</span>;
	}

	const selectedCountry = data.find(
		(country) => lowerCase(country.name) === lowerCase(value)
	);

	if (!selectedCountry) {
		return <span>Country not found</span>;
	}

	return (
		<div className="flex items-end gap-2">
			<span>{selectedCountry.emoji}</span>
			<span>{selectedCountry.name}</span>
		</div>
	);
};

const CountryDropdown = ({
	disabled,
	onChange,
	value,
	onBlur,
	setValue,
}: CountryDropdownProps): JSX.Element => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const countries = useGetCountries();
	const c = countries.data ?? ([] as CountryProps[]);

	const [openCountryDropdown, setOpenCountryDropdown] =
		useState<boolean>(false);

	const [searchTerm, setSearchTerm] = useState("");

	const parentRef = useRef<HTMLDivElement>(null);

	// Filter countries based on search term
	const filteredCountries = c
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

	const count = filteredCountries?.length;
	const rowVirtualizer = useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 32, // Estimate the item height (px)
		overscan: isMobile ? 0 : 5, // Load extra items before/after the current scroll --- Disable overscanning for mobile
	});

	const virtualCountries = rowVirtualizer.getVirtualItems();

	// Find index of the selected country in the filtered list
	const selectedIndex = value
		? filteredCountries?.findIndex(
				(country) => lowerCase(country?.name) === value
			)
		: -1;

	// Scroll to the selected item when opening the dropdown
	useEffect(() => {
		if (openCountryDropdown && selectedIndex >= 0 && !searchTerm) {
			setTimeout(() => {
				rowVirtualizer.scrollToIndex(selectedIndex + 7);
			}, 0);
		}
	}, [rowVirtualizer, openCountryDropdown, selectedIndex, searchTerm]);

	useEffect(() => {
		if (openCountryDropdown) {
			rowVirtualizer.measure(); // Force re-render/measure when dropdown opens - Mobile fix
		}
	}, [openCountryDropdown, rowVirtualizer]);
	return (
		<Popover
			open={openCountryDropdown}
			onOpenChange={setOpenCountryDropdown}
			key={openCountryDropdown ? "open" : "closed"} // Mobile fix
		>
			<PopoverTrigger
				data-test-id="country"
				role="combobox"
				aria-expanded={openCountryDropdown}
				className="input-style flex h-[48px] w-full items-center justify-between rounded-lg px-4 text-base text-white hover:!text-white"
				disabled={disabled}
				onBlur={onBlur}
			>
				<SelectedCountry value={value} data={c} />
				<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
			</PopoverTrigger>

			<PopoverContent className="PopoverContent container_style rounded-[6px] p-0">
				<Command>
					<CommandInput
						className="!text-base text-white"
						value={searchTerm}
						onValueChange={setSearchTerm}
						placeholder="Search for your Country..."
					/>

					<CommandList className="cursor-pointer overflow-y-auto overflow-x-hidden p-2">
						<CommandEmpty className="my-4 w-full text-center text-white">
							No country found.
						</CommandEmpty>
						<div
							ref={parentRef}
							style={{
								height: openCountryDropdown ? "250px" : "0px", // Only give height when dropdown is open
								position: "relative",
								touchAction: "auto",
								width: "100%",
								overflowY: openCountryDropdown
									? "auto"
									: "hidden", // Prevent overflow when not open
							}}
						>
							<div
								style={{
									height: rowVirtualizer.getTotalSize(),
									width: "100%",
									position: "relative",
								}}
							>
								<CommandGroup
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										transform: `translateY(${virtualCountries[0]?.start ?? 0}px)`,
									}}
								>
									{filteredCountries?.length > 0 ? (
										virtualCountries.map((virtualRow) => {
											const country = filteredCountries[
												virtualRow.index
											] as CountryProps;
											return (
												<CommandItem
													// key={country.id}
													key={virtualRow.key}
													data-index={
														virtualRow.index
													}
													ref={
														rowVirtualizer.measureElement
													}
													value={country?.name}
													onSelect={(
														currentValue: string
													) => {
														onChange(
															currentValue ===
																lowerCase(
																	country?.name
																)
																? currentValue
																: ""
														);
														setOpenCountryDropdown(
															false
														);
														setValue?.(
															"location",
															""
														);
													}}
													className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm !text-white outline-none hover:!bg-white hover:!bg-opacity-20"
												>
													<div className="flex items-end gap-2">
														<span>
															{country?.emoji}
														</span>
														<span className="">
															{country?.name}
														</span>
													</div>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															value ===
																lowerCase(
																	country?.name
																)
																? "opacity-100"
																: "opacity-0"
														)}
													/>
												</CommandItem>
											);
										})
									) : (
										<div className="p-2 text-center text-gray-500">
											No results found
										</div>
									)}
								</CommandGroup>
							</div>
						</div>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default CountryDropdown;
