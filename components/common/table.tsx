"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type PaginationState,
	useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import type React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Pagination } from "./pagination";
import { Skeleton } from "./skeletons/skeleton";

interface TableProps<T extends Record<string, any>> {
	data?: T[];
	columns: Array<ColumnDef<T>>;
	pagination?: PaginationState;
	setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
	pageCount: number;
	emptyStateMessage?: string;
	loading?: boolean;
}

export const Table = <T extends object>({
	data = [],
	columns,
	pagination,
	pageCount,
	setPagination,
	emptyStateMessage,
	loading,
}: TableProps<T>): React.JSX.Element => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			pagination,
		},
		manualPagination: true,
		pageCount,

		onPaginationChange: setPagination,
	});

	const setCurrentPage = (page: number): void => {
		setPagination((prev) => {
			return { ...prev, pageIndex: page };
		});
	};

	if (loading) {
		return (
			<div className="flex size-full min-h-[450px] flex-col items-center justify-center gap-2">
				{[...Array(10)].map((_, index) => (
					<Skeleton
						className="flex h-[40px] w-full items-center justify-between gap-2 px-3 py-4"
						key={index}
					>
						<Skeleton className="h-full w-[64px]" />
						<Skeleton className="h-full w-[111px]" />
						<Skeleton className="h-full w-[227px]" />
						<Skeleton className="h-full w-[239px]" />
						<Skeleton className="h-full w-[76px]" />
						<Skeleton className="h-full w-[87px]" />
						<Skeleton className="h-full w-[124px]" />
					</Skeleton>
				))}
			</div>
		);
	}

	if (!loading && data.length === 0) {
		return (
			<div className="flex min-h-[450px] items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="max-w-[100px]">
						<Image
							src="/images/empty-table.svg"
							width={200}
							height={200}
							alt=""
						/>
					</div>
					{/* eslint-disable-next-line react/jsx-pascal-case */}
					<p className="text-center font-normal leading-[27px] tracking-wide text-body">
						{emptyStateMessage ??
							"Future transactions will appear here"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-8">
			<div className="mt-4 flow-root h-full">
				<div className="-m-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
						<div className="h-full max-h-[450px] min-w-full overflow-y-auto overflow-x-hidden border-none sm:rounded-lg">
							<table className="min-w-full table-fixed">
								<thead className="sticky top-0 z-10 bg-hover-gradient">
									{table
										.getHeaderGroups()
										.map((headerGroup) => (
											<tr
												className="bg-app"
												key={headerGroup.id}
											>
												{headerGroup.headers.map(
													(header) => (
														<th
															scope="col"
															className="px-3 py-4 text-left text-sm font-medium text-[#E3E5E5]"
															key={header.id}
															colSpan={
																header.colSpan
															}
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header
																			.column
																			.columnDef
																			.header,
																		header.getContext()
																	)}
														</th>
													)
												)}
											</tr>
										))}
								</thead>

								<tbody className="divide-y divide-primary-lighter border-t border-primary-lighter bg-[#1E1A1A45]">
									{table.getRowModel().rows.map((row) => {
										return (
											<tr
												key={row.id}
												className="hover:bg-app relative duration-200"
											>
												{row
													.getVisibleCells()
													.map((cell) => {
														return (
															<td
																key={cell.id}
																className="w-fit text-base text-[#E3E5E5]"
															>
																<div className="truncate px-3 py-4">
																	{flexRender(
																		cell
																			.column
																			.columnDef
																			.cell,
																		cell.getContext()
																	)}
																</div>
															</td>
														);
													})}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className="">
				{pagination && (
					<Pagination
						totalPages={pageCount}
						currentPage={pagination.pageIndex}
						setCurrentPage={setCurrentPage}
					/>
				)}
			</div>
		</div>
	);
};
