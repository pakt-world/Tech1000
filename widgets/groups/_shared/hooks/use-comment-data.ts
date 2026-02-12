import { Comment, CommentTrailType } from "@/lib/types/groups";
import { useState, useEffect, useCallback } from "react";

interface GeneratedData {
	postData: Comment | null;
	parentTrail: Comment[];
	childTrail: Comment[];
	commentInView: CommentTrailType | null;
	updateCommentData: (newData: CommentTrailType) => void;
}

const useCommentData = (initialData: CommentTrailType): GeneratedData => {
	const [commentData, setCommentData] =
		useState<CommentTrailType>(initialData);

	const updateCommentData = useCallback((newData: CommentTrailType) => {
		setCommentData(newData);
	}, []);

	useEffect(() => {
		if (initialData) {
			setCommentData(initialData);
		}
	}, [initialData]);

	const postData =
		commentData?.trails.find((trail) => trail?.type === "post") || null;
	const parentTrail = commentData?.trails.filter(
		(trail) => trail?.type !== "post"
	);
	const childTrail = (commentData?.comments || []).sort((a, b) => {
		const dateA = new Date(a.createdAt || 0).getTime();
		const dateB = new Date(b.createdAt || 0).getTime();
		return dateB - dateA;
	});

	const commentInView = commentData;

	const generatedData = {
		postData,
		parentTrail,
		childTrail,
		commentInView,
		updateCommentData,
	};

	return generatedData;
};

export default useCommentData;
