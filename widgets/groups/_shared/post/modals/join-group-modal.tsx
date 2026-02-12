"use client";
import React, { ReactElement, useState } from "react";

import { Group } from "@/lib/types/groups";
import { Modal } from "@/components/common/modal";
import CardView from "@/components/common/card-view";
import { Button } from "@/components/common/button";
import { useJoinGroup } from "@/lib/api/group";
import { useQueryClient } from "@tanstack/react-query";

interface JoinGroupModalProps {
	group: Group;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export default function JoinGroupModal({
	group,
	isOpen,
	onOpenChange,
}: JoinGroupModalProps): ReactElement | null {
	const queryClient = useQueryClient();
	const { mutate: joinGroup, isLoading } = useJoinGroup();

	const [isApiLoading, setIsApiLoading] = useState(false);

	const handleJoinGroup = () => {
		setIsApiLoading(true);
		joinGroup(
			{ groupId: group?._id },
			{
				onSuccess: async () => {
					try {
						await new Promise((resolve) =>
							setTimeout(resolve, 10000)
						);

						await queryClient.invalidateQueries([
							"get-group",
							group?._id,
						]);
					} catch (error) {
						setIsApiLoading(false);
					} finally {
						setIsApiLoading(false);
						onOpenChange(false);
					}
				},
				onError: () => {
					setIsApiLoading(false);
				},
			}
		);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={() => onOpenChange(!isOpen)}
				className="max-w-[96%] md:min-w-[570px] md:max-w-[570px]"
			>
				<div className="relative p-0.5">
					<div className="absolute inset-0 rounded-2xl">
						<div
							className="absolute inset-0 overflow-hidden rounded-[30px] border border-transparent 
      before:absolute before:inset-0 before:z-[-1] 
      before:rounded-lg before:border-none before:bg-gradient-to-br 
      before:from-[#D02D3D] before:via-[#F2C650] before:to-[#D02D3D] before:content-['']"
						/>
					</div>
					<CardView className="relative flex w-full flex-col gap-4 !border border-[#E8E8E81A]/10  !bg-ink-darkest !p-6">
						<h3 className="text-2xl font-bold text-white">
							Join Group
						</h3>
						<p className="max-w-[400px] text-center text-[#979C9E]">
							You need to join the group <br /> to like, post, and
							comment.{" "}
						</p>
						<div className="mt-2 flex gap-4">
							<Button
								variant="outline"
								type="button"
								size="md"
								className=" gap-2 rounded-full px-12 py-2 font-mono  text-white"
								onClick={() => onOpenChange(false)}
							>
								<span className=" font-mono font-bold">
									Later
								</span>
							</Button>
							<Button
								variant="default"
								type="button"
								size="md"
								className="w-fit items-center gap-2 rounded-full px-6 py-2  text-ink-darkest"
								onClick={handleJoinGroup}
								disabled={isLoading || isApiLoading}
							>
								{isLoading || isApiLoading ? (
									"Loading..."
								) : (
									<span className=" font-mono font-bold">
										Join Group
									</span>
								)}
							</Button>
						</div>
					</CardView>
				</div>
			</Modal>
		</>
	);
}
