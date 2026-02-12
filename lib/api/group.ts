"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ApiError, axios } from "@/lib/axios";
import {
	useQuery,
	useInfiniteQuery,
	UseQueryResult,
	UseInfiniteQueryResult,
	useMutation,
	UseMutationResult,
} from "@tanstack/react-query";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import {
	Application,
	AttachmentsType,
	Comment,
	CommentTrailType,
	Group,
	GroupAdmin,
	GroupPost,
	Invite,
	Member,
	MemberMeta,
	MemberProfile,
	Tag,
} from "../types/groups";

const groupsBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export enum CollectionCategory {
	CREATED = "created",
	OPEN = "open",
	ASSIGNED = "assigned",
}

export interface CollectionProps {
	_id: string;
}

//get groups
interface GetGroupsParams {
	page?: number;
	limit?: number;
	search?: string;
	tags?: string;
	type?: string;
	userId?: string;
}

interface GetGroupResponse {
	limit: number;
	page: number;
	pages: number;
	total: number;
	data: Group[];
}

async function getGroups(params: GetGroupsParams): Promise<GetGroupResponse> {
	const res = await axios.get(`${groupsBaseUrl}/group`, {
		params: {
			page: params.page,
			limit: params.limit,
			search: params?.search,
			tags: params?.tags,
			type: params?.type,
		},
	});

	return res.data.data;
}

export function useGetGroupsInfinitely(
	params: GetGroupsParams
): UseInfiniteQueryResult<GetGroupResponse, ApiError> {
	return useInfiniteQuery(
		["groups", params],
		async ({ pageParam = 1 }) => getGroups({ ...params, page: pageParam }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			enabled: true,
			refetchInterval: 400000,
		}
	);
}

// create groups
interface CreateGroupParams {
	name: string;
	description: string;
	tags: string[];
	image?: string;
	inviteType: "open" | "close" | "private";
	memberInvites: string[];
	adminInvites?: string[];
	minScore?: string;
}

async function postCreateGroup(params: CreateGroupParams): Promise<Group> {
	const res = await axios.post(`${groupsBaseUrl}/group`, params);
	return res.data.data;
}

export function useCreateGroup(): UseMutationResult<
	Group,
	ApiError,
	CreateGroupParams,
	unknown
> {
	return useMutation({
		mutationFn: postCreateGroup,
		mutationKey: ["create-group"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {},
	});
}
// -------------------
interface GetGroupParams {
	id?: string;
	page?: number;
	limit?: number;
}

interface GetGroupResponse {
	data: Group[];
}

async function getGroup(params: GetGroupParams): Promise<GetGroupResponse> {
	const res = await axios.get(`${groupsBaseUrl}/group/${params?.id}`);

	return res?.data?.data;
}

export function useGetGroup(
	param: GetGroupParams
): UseQueryResult<Group, ApiError> {
	return useQuery({
		queryFn: () => getGroup({ id: param.id }),
		queryKey: ["get-group", param.id],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchOnWindowFocus: false,
	});
}

interface GroupAdminResponse {
	data: GroupAdmin[];
}

async function getGroupAdmins(
	params: GetGroupParams
): Promise<GetGroupResponse> {
	const res = await axios.get(
		`${groupsBaseUrl}/group/admins?groupId=${params?.id}`
	);

	return res?.data?.data;
}

export function useGetGroupAdmins(
	groupId: GetGroupParams
): UseQueryResult<GroupAdminResponse, ApiError> {
	return useQuery({
		queryFn: () => getGroupAdmins(groupId),
		queryKey: ["get-group-admins", groupId],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
}

export function useGetGroupAdminsInfinitely(
	groupId: GetGroupParams
): UseInfiniteQueryResult<GroupAdminResponse, ApiError> {
	return useInfiniteQuery(
		["group-admins", groupId],
		async ({ pageParam = 1 }) =>
			getGroupAdmins({ id: groupId.id, page: pageParam }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: ApiError) => {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			},
			enabled: !!groupId.id,
		}
	);
}

export interface GroupMember {
	id: string;
	name: string;
	role: string;
	skills: string[];
}

export interface MemberWithUserId extends Member {
	userId: string;
}
export interface GetGroupMembersResponse {
	data: MemberWithUserId[];
	page: number;
	pages: number;
	limit: number;
	total: number;
}

async function getGroupMembers(params: {
	id: string;
	page?: number;
	limit?: number;
}): Promise<GetGroupMembersResponse> {
	const res = await axios.get(
		`${groupsBaseUrl}/group/members?groupId=${params.id}`,
		{
			params: {
				page: params.page,
				limit: params.limit,
			}, //&page=${params.page}`
		}
	);
	return res.data.data;
}

export function useGetGroupMembersInfinitely(
	groupId: string,
	shouldFetch: boolean
): UseInfiniteQueryResult<GetGroupMembersResponse, ApiError> {
	return useInfiniteQuery(
		["group-members", groupId],
		async ({ pageParam = 1 }) =>
			getGroupMembers({ id: groupId, page: pageParam }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			},
			enabled: !!groupId && shouldFetch,
		}
	);
}

// Join group
interface JoinGroupParams {
	groupId: string;
}

interface JoinGroupResponse {
	groupId: string;
	groupName: string;
	applicationId: string;
	status: string;
	type: string;
	groupType: string;
}

async function postJoinGroup(
	params: JoinGroupParams
): Promise<JoinGroupResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/application/apply`, {
		groupId: params.groupId,
	});
	return res.data.data;
}

export function useJoinGroup(): UseMutationResult<
	JoinGroupResponse,
	ApiError,
	JoinGroupParams,
	unknown
> {
	return useMutation({
		mutationFn: postJoinGroup,
		mutationKey: ["join-group"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Joining group failed"
			);
		},
		onSuccess: async () => {},
	});
}

// invited members

export interface GetInvitesResponse {
	page: number;
	pages: number;
	limit: number;
	total: number;
	data: Invite[];
}

async function getGroupInvites(params: {
	groupId: string;
	page: number;
	limit: number;
}): Promise<GetInvitesResponse> {
	const res = await axios.get(
		`${groupsBaseUrl}/invite/?groupId=${params.groupId}&page=${params.page}&limit=${params.limit}`
	);
	return res.data.data;
}

export function useGetGroupInvitesInfinitely(
	groupId: string
): UseInfiniteQueryResult<GetInvitesResponse, ApiError> {
	return useInfiniteQuery(
		["group-member-invite-list", groupId],
		async ({ pageParam = 1 }) =>
			getGroupInvites({ groupId, page: pageParam, limit: 10 }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			},
			enabled: !!groupId,
		}
	);
}

// group applications

export interface GetApplicationsResponse {
	data: Application[];
	page: number;
	pages: number;
	total: number;
}

async function getGroupApplications(params: {
	groupId: string;
	page: number;
	limit: number;
}): Promise<GetApplicationsResponse> {
	const res = await axios.get(
		`${groupsBaseUrl}/invite/applications?groupId=${params.groupId}&page=${params.page}&limit=${params.limit}`
	);
	return res.data.data;
}

export function useGetGroupApplicationsInfinitely(
	groupId: string
): UseInfiniteQueryResult<GetApplicationsResponse, ApiError> {
	return useInfiniteQuery(
		["group-applications", groupId],
		async ({ pageParam = 1 }) =>
			getGroupApplications({ groupId, page: pageParam, limit: 10 }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			},
			enabled: !!groupId,
		}
	);
}

// approve application
interface ApplicationParams {
	applicationId: string;
	groupId: string;
	feedId?: string;
}

interface ApproveApplicationResponse {
	_id: string;
	groupId: string;
	status: string;
	memberProfile: MemberProfile;
	memberScore: number;
	memberId: string;
	user: string;
	meta: MemberMeta;
	type: string;
	applicantName: string;
	groupName: string;
}

async function postApproveApplication(
	params: ApplicationParams
): Promise<ApproveApplicationResponse> {
	const res = await axios.post(
		`${groupsBaseUrl}/invite/application/approve`,
		{
			applicationId: params.applicationId,
			groupId: params.groupId,
			...(params?.feedId ? { feedId: params?.feedId } : {}),
		}
	);
	return res.data.data;
}

export function useApproveApplication(): UseMutationResult<
	ApproveApplicationResponse,
	ApiError,
	ApplicationParams,
	unknown
> {
	return useMutation({
		mutationFn: postApproveApplication,
		mutationKey: ["approve-group-application"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Approving application failed"
			);
		},
		onSuccess: (data) => {
			toast.success(
				data?.applicantName && data?.groupName
					? `${data?.applicantName} successfully joined ${data?.groupName} group`
					: "Application approved successfully"
			);
		},
	});
}

// reject application

interface RejectApplicationResponse {
	_id: string;
	groupId: string;
	feedId?: string;
}

async function postRejectApplication(
	params: ApplicationParams
): Promise<RejectApplicationResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/application/reject`, {
		applicationId: params.applicationId,
		groupId: params.groupId,
		...(params?.feedId ? { feedId: params?.feedId } : {}),
	});
	return res.data.data;
}

export function useRejectApplication(): UseMutationResult<
	RejectApplicationResponse,
	ApiError,
	ApplicationParams,
	unknown
> {
	return useMutation({
		mutationFn: postRejectApplication,
		mutationKey: ["reject-group-application"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Rejecting application failed"
			);
		},
		onSuccess: () => {
			toast.success(`Application rejected successfully`);
		},
	});
}

// remove group member
interface RemoveUserParams {
	groupId: string;
	userId: string;
}

interface RemoveUserResponse {
	status: string;
	message: string;
	data: any;
}

async function postRemoveUser(
	params: RemoveUserParams
): Promise<RemoveUserResponse> {
	const res = await axios.post(`${groupsBaseUrl}/group/remove/user`, {
		groupId: params.groupId,
		userId: params.userId,
	});
	return res.data.data;
}

export function useRemoveUser(): UseMutationResult<
	RemoveUserResponse,
	ApiError,
	RemoveUserParams,
	unknown
> {
	return useMutation({
		mutationFn: postRemoveUser,
		mutationKey: ["remove-user"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Removing user failed"
			);
		},
		onSuccess: async () => {
			toast.success("User has been removed successfully from this group");
		},
	});
}

// leave group
interface LeaveGroupParams {
	groupId: string;
}

interface LeaveGroupResponse {
	// check back once the schema is updated
	status: string;
	message: string;
	data: any;
}

async function postLeaveGroup(
	params: LeaveGroupParams
): Promise<LeaveGroupResponse> {
	const res = await axios.post(`${groupsBaseUrl}/group/leave/user`, {
		groupId: params.groupId,
	});
	return res.data.data;
}

export function useLeaveGroup(): UseMutationResult<
	LeaveGroupResponse,
	ApiError,
	LeaveGroupParams,
	unknown
> {
	return useMutation({
		mutationFn: postLeaveGroup,
		mutationKey: ["leave-group"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Leaving group failed"
			);
		},
		onSuccess: async () => {},
	});
}

// invite user

interface InviteParams {
	memberInvites?: string[];
	adminInvites?: string[];
	groupId: string;
}

interface InviteResponse {
	status: string;
	message: string;
	data: any;
}

async function postSendInvite(params: InviteParams): Promise<InviteResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/send`, {
		memberInvites: params.memberInvites,
		adminInvites: params.adminInvites,
		groupId: params.groupId,
	});
	return res.data;
}

export function useSendInvite(): UseMutationResult<
	InviteResponse,
	ApiError,
	InviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postSendInvite,
		mutationKey: ["send-invite"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Sending invite failed"
			);
		},
		onSuccess: async () => {
			toast.success("Invites sent successfully");
		},
	});
}
// revoke invite
interface RevokeInviteParams {
	inviteId: string;
}

interface RevokeInviteResponse {
	status: string;
	message: string;
	data: any;
}

async function postRevokeInvite(
	params: RevokeInviteParams
): Promise<RevokeInviteResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/revoke`, {
		inviteId: params.inviteId,
	});
	return res.data;
}

export function useRevokeInvite() {
	return useMutation({
		mutationFn: postRevokeInvite,
		mutationKey: ["revoke-invite"],
		onError: (error: any) => {
			toast.error(
				error?.response?.data.message ?? "Revoking invite failed"
			);
		},
		onSuccess: () => {
			toast.success("Invite revoked successfully");
		},
	});
}

// resend invite

interface ResendInviteParams {
	inviteId: string;
	memberId: string;
	groupId: string;
}

// Define the response type
interface ResendInviteResponse {
	status: string;
	message: string;
	data: any;
}

async function postResendInvite(
	params: ResendInviteParams
): Promise<ResendInviteResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/resend`, {
		inviteId: params.inviteId,
		memberId: params.memberId,
		groupId: params.groupId,
	});
	return res.data;
}

export function useResendInvite(): UseMutationResult<
	ResendInviteResponse,
	ApiError,
	ResendInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postResendInvite,
		mutationKey: ["resend-invite"],
		onError: (error: any) => {
			toast.error(
				error?.response?.data.message ?? "Revoking invite failed"
			);
		},
		onSuccess: () => {
			toast.success("Invite resent successfully");
		},
	});
}
// get group for user

async function getUserGroups(
	params: GetGroupsParams
): Promise<GetGroupResponse> {
	const res = await axios.get(`${groupsBaseUrl}/group/user`, {
		params: {
			page: params.page,
			limit: params.limit,
			search: params?.search,
			tags: params?.tags,
			type: params?.type,
			userId: params?.userId,
		},
	});

	return res.data.data;
}

export function useGetUserGroupsInfinitely(
	params: GetGroupsParams
): UseInfiniteQueryResult<GetGroupResponse, ApiError> {
	return useInfiniteQuery(
		["user-groups", params],
		async ({ pageParam = 1 }) =>
			getUserGroups({ ...params, page: pageParam }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			enabled: true,
			refetchInterval: 100000,
		}
	);
}

// get group posts
interface GetPostsParams {
	groupId?: string;
	page?: number;
	limit?: number;
}
export interface GetPostsResponse {
	data: GroupPost[];
	total: number;
	pages: number;
	page: number;
	limit: number;
}

async function getTopPosts(params: GetPostsParams): Promise<GetPostsResponse> {
	const res = await axios.get(`${groupsBaseUrl}/post/top`, {
		params: {
			...(params.groupId ? { groupId: params.groupId } : []),
			page: params.page || 1,
			limit: params.limit || 5,
		},
	});

	return res.data.data;
}

export function useGetTopPostsInfinitely(
	params: GetPostsParams
): UseInfiniteQueryResult<GetPostsResponse, Error> {
	return useInfiniteQuery(
		["get-top-posts", params.groupId || "", params.limit],
		async ({ pageParam = 1 }) => {
			return await getTopPosts({
				...params,
				page: pageParam,
			});
		},
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: Error) => {
				toast.error(
					error?.message ?? "An error occurred while fetching posts"
				);
			},
			refetchOnWindowFocus: true,
			enabled: true,
		}
	);
}

async function getTrendingPosts(
	params: GetPostsParams
): Promise<GetPostsResponse> {
	const res = await axios.get(`${groupsBaseUrl}/post/trending`, {
		params: {
			...(params.groupId ? { groupId: params.groupId } : []),
			page: params.page || 1,
			limit: params.limit || 10,
		},
	});

	return res.data.data;
}

export function useGetTrendingPostsInfinitely(
	params: GetPostsParams
): UseInfiniteQueryResult<GetPostsResponse, Error> {
	return useInfiniteQuery(
		["get-trending-posts", params.groupId || "", params.limit],
		async ({ pageParam = 1 }) => {
			return await getTrendingPosts({
				...params,
				page: pageParam,
			});
		},
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: Error) => {
				toast.error(
					error?.message ?? "An error occurred while fetching posts"
				);
			},
			refetchOnWindowFocus: true,
			enabled: true,
		}
	);
}

async function getRecentPosts(
	params: GetPostsParams
): Promise<GetPostsResponse> {
	const res = await axios.get(`${groupsBaseUrl}/post/recent`, {
		params: {
			...(params.groupId ? { groupId: params.groupId } : []),
			page: params.page || 1,
			limit: params.limit || 5,
		},
	});

	return res.data.data;
}

export function useGetRecentPostsInfinitely(
	params: GetPostsParams
): UseInfiniteQueryResult<GetPostsResponse, Error> {
	return useInfiniteQuery(
		["get-recent-posts", params.groupId || "", params.limit],
		async ({ pageParam = 1 }) => {
			return await getRecentPosts({
				...params,
				page: pageParam,
			});
		},
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: Error) => {
				toast.error(
					error?.message ?? "An error occurred while fetching posts"
				);
			},
			refetchOnWindowFocus: true,
			enabled: true,
		}
	);
}

// create post
interface CreatePostParams {
	title: string;
	content: string;
	attachments?: string[];
	groupId: string;
}

interface CreatePostResponse {
	postId: string;
	title: string;
	content: string;
	attachments: AttachmentsType[];
	upvotes: number;
	comments: number;
	createdAt: string;
}

async function createPostForGroup(
	params: CreatePostParams
): Promise<CreatePostResponse> {
	const res = await axios.post(`${groupsBaseUrl}/post`, params);
	return res.data.data;
}

export function useCreatePostForGroup(): UseMutationResult<
	CreatePostResponse,
	ApiError,
	CreatePostParams,
	unknown
> {
	return useMutation({
		mutationFn: createPostForGroup,
		mutationKey: ["create-post"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success(`Post created successfully!`);
		},
	});
}

// create comment
interface CreateCommentParams {
	parentId: string;
	comment: string;
	attachments?: string[];
}

interface CreateCommentResponse {
	commentId: string;
	parentId: string;
	comment: string;
	attachments: AttachmentsType[];
	type: string;
	createdAt: string;
	groupId: string;
}

async function createCommentForPost(
	params: CreateCommentParams
): Promise<CreateCommentResponse> {
	const res = await axios.post(`${groupsBaseUrl}/comment`, params);
	return res.data.data;
}

export function useCreateCommentForPost(): UseMutationResult<
	CreateCommentResponse,
	ApiError,
	CreateCommentParams,
	unknown
> {
	return useMutation({
		mutationFn: createCommentForPost,
		mutationKey: ["create-comment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {},
	});
}

// get a post
interface GetPostParams {
	id: string;
}

async function getPost(params: GetPostParams): Promise<GroupPost> {
	const res = await axios.get(`${groupsBaseUrl}/post/${params.id}`);
	return res.data.data;
}

export function useGetPost(param: {
	id: string;
}): UseQueryResult<GroupPost, ApiError> {
	return useQuery({
		queryFn: () => getPost({ id: param.id }),
		queryKey: ["get-post", param.id],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchOnWindowFocus: false,
	});
}

// get post comment

interface GetCommentsParams {
	parentId: string;
	page?: number;
	limit?: number;
}

export interface GetCommentsResponse {
	data: Comment[];
	total: number;
	pages: number;
	page: number;
	limit: number;
}

async function getComments(
	params: GetCommentsParams
): Promise<GetCommentsResponse> {
	const res = await axios.get(`${groupsBaseUrl}/comment/${params.parentId}`, {
		params: {
			page: params.page || 1,
			limit: params.limit || 10,
		},
	});

	return res.data.data;
}

export function useGetCommentsInfinitely(
	params: GetCommentsParams,
	shouldFetch: boolean
): UseInfiniteQueryResult<GetCommentsResponse, Error> {
	return useInfiniteQuery(
		["get-comments", params.parentId, params.limit],
		async ({ pageParam = 1 }) => {
			return await getComments({
				...params,
				page: pageParam,
			});
		},
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: Error) => {
				toast.error(
					error?.message ??
						"An error occurred while fetching comments"
				);
			},
			refetchOnWindowFocus: false,
			enabled: shouldFetch,
		}
	);
}

// Upvote Comment
interface UpvoteCommentParams {
	parentId: string;
}

interface UpvoteCommentResponse {
	upvoteId: string;
	type: string;
	parentId: string;
	groupId: string;
	createdAt: string;
}

async function upvoteComment(
	params: UpvoteCommentParams
): Promise<UpvoteCommentResponse> {
	const res = await axios.post(`${groupsBaseUrl}/upvote`, params);
	return res.data.data;
}

export function useUpvoteComment(): UseMutationResult<
	UpvoteCommentResponse,
	ApiError,
	UpvoteCommentParams,
	unknown
> {
	return useMutation({
		mutationFn: upvoteComment,
		mutationKey: ["upvote-comment"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"An error occurred while upvoting"
			);
		},
		onSuccess: () => {},
	});
}

//undo upvote
async function undoUpvoteComment(
	params: UpvoteCommentParams
): Promise<UpvoteCommentResponse> {
	const res = await axios.post(
		`${groupsBaseUrl}/upvote/undo/${params.parentId}`,
		params
	);
	return res.data.data;
}

export function useUndoUpvoteComment(): UseMutationResult<
	UpvoteCommentResponse,
	ApiError,
	UpvoteCommentParams,
	unknown
> {
	return useMutation({
		mutationFn: undoUpvoteComment,
		mutationKey: ["undo-upvote-comment"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"An error occurred while upvoting"
			);
		},
		onSuccess: () => {},
	});
}

// update group details
export interface UpdateGroupDetailsParams {
	name?: string;
	description?: string;
	image?: string;
}
export interface GroupDetailsProps {
	_id: string;
	tags: Tag[];
	name: string;
	description: string;
	image: string;
	createdAt: string;
}

async function postUpdateGroup(
	groupId: string,
	values: UpdateGroupDetailsParams
): Promise<GroupDetailsProps> {
	const res = await axios.patch(`${groupsBaseUrl}/group/${groupId}`, values);
	return res.data.data;
}

export function useUpdateGroup(): UseMutationResult<
	GroupDetailsProps,
	ApiError,
	{ groupId: string; values: UpdateGroupDetailsParams },
	unknown
> {
	return useMutation({
		mutationFn: ({ groupId, values }) => postUpdateGroup(groupId, values),
		mutationKey: ["update_group"],
		onSuccess: () => {
			toast.success("Group updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Create Library Payload
interface CreateLibraryParams {
	groupId: string;
	fileIds: string[];
}

// Create Library Response
interface CreateLibraryResponse {
	_id: string;
	tags: Tag[];
	name: string;
	description: string;
	image: string;
	createdAt: string;
	groupType: string;
	library: AttachmentsType[];
}

async function createLibraryForGroup(
	params: CreateLibraryParams
): Promise<CreateLibraryResponse> {
	const res = await axios.post(`${groupsBaseUrl}/group/library`, params);
	return res.data.data;
}

export function useCreateLibraryForGroup(): UseMutationResult<
	CreateLibraryResponse,
	ApiError,
	CreateLibraryParams,
	unknown
> {
	return useMutation({
		mutationFn: createLibraryForGroup,
		mutationKey: ["create-library"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success(`Library created successfully!`);
		},
	});
}

// Get Library
export interface GetLibraryResponse {
	limit: number;
	page: number;
	pages: number;
	total: number;
	data: AttachmentsType[];
}

async function getGroupLibrary(params: {
	groupId: string;
	page: number;
	limit: number;
	mimeTypes?: string;
}): Promise<GetLibraryResponse> {
	const res = await axios.get(`${groupsBaseUrl}/group/library`, {
		params: {
			groupId: params.groupId,
			page: params.page,
			limit: params.limit,
			...(params.mimeTypes ? { mimeTypes: params.mimeTypes } : {}),
		},
	});
	return res.data.data;
}

export function useGetGroupLibraryInfinitely(
	groupId: string,
	mimeTypes?: string
): UseInfiniteQueryResult<GetLibraryResponse, ApiError> {
	return useInfiniteQuery(
		["group-library", groupId, mimeTypes],
		async ({ pageParam = 1 }) =>
			getGroupLibrary({ groupId, mimeTypes, page: pageParam, limit: 10 }),
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			},
			enabled: !!groupId,
		}
	);
}

//get comment details
interface GetCommentDetailsParams {
	page?: number;
	limit?: number;
	commentId: string;
}
interface GetCommentDetailsResponse {
	data: CommentTrailType;
}

async function getCommentDetails(
	params: GetCommentDetailsParams
): Promise<GetCommentDetailsResponse> {
	const res = await axios.get(`${groupsBaseUrl}/comment/single/`, {
		params: {
			page: params.page,
			limit: params.limit,
			commentId: params.commentId,
		},
	});

	return res.data.data;
}

export function useGetCommentDetails(
	param: GetCommentDetailsParams
): UseQueryResult<CommentTrailType, ApiError> {
	return useQuery({
		queryFn: () => getCommentDetails(param),
		queryKey: ["comment-detail", param.commentId],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchOnWindowFocus: false,
	});
}

// Accept invite
interface AcceptInviteParams {
	groupId: string;
}

interface AcceptInviteResponse {
	status: string;
	message: string;
	data: any;
}

async function postAcceptInvite(
	params: AcceptInviteParams
): Promise<AcceptInviteResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/accept/`, {
		groupId: params.groupId,
	});
	return res.data.data;
}

export function useAcceptInvite(): UseMutationResult<
	AcceptInviteResponse,
	ApiError,
	AcceptInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postAcceptInvite,
		mutationKey: ["accept-invite"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Accepting invite failed"
			);
		},
		onSuccess: async () => {},
	});
}

// Decline invite
interface DeclineInviteParams {
	groupId: string;
}

interface DeclineInviteResponse {
	status: string;
	message: string;
	data: any;
}

async function postDeclineInvite(
	params: DeclineInviteParams
): Promise<DeclineInviteResponse> {
	const res = await axios.post(`${groupsBaseUrl}/invite/decline/`, {
		groupId: params.groupId,
	});
	return res.data.data;
}

export function useDeclineInvite(): UseMutationResult<
	DeclineInviteResponse,
	ApiError,
	DeclineInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postDeclineInvite,
		mutationKey: ["decline-invite"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Declining invite failed"
			);
		},
		onSuccess: async () => {},
	});
}

interface MakeAdminParams {
	groupId: string;
	userId: string;
}
interface MakeAdminResponse {
	status: string;
	message: string;
	data: Group;
}

async function postMakeAdmin(
	params: MakeAdminParams
): Promise<MakeAdminResponse> {
	const res = await axios.post(`${groupsBaseUrl}/group/admin/user`, {
		groupId: params.groupId,
		userId: params.userId,
	});
	return res.data;
}

export function useMakeAdmin(): UseMutationResult<
	MakeAdminResponse,
	ApiError,
	MakeAdminParams,
	unknown
> {
	return useMutation({
		mutationFn: postMakeAdmin,
		mutationKey: ["make-member-admin"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Making user admin failed"
			);
		},
		onSuccess: async () => {
			toast.success(
				"User has been successfully made an admin for this group"
			);
		},
	});
}

// Delete Post API
interface DeletePostParams {
	postId: string;
}

interface DeletePostResponse {
	success: boolean;
	message: string;
}

async function deletePost(
	params: DeletePostParams
): Promise<DeletePostResponse> {
	const res = await axios.post(`${groupsBaseUrl}/post/remove`, {
		postId: params.postId,
	});
	return res.data;
}

export function useDeletePost(): UseMutationResult<
	DeletePostResponse,
	ApiError,
	DeletePostParams,
	unknown
> {
	return useMutation({
		mutationFn: deletePost,
		mutationKey: ["delete-post"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Deleting post failed"
			);
		},
		onSuccess: () => {
			toast.success("Post deleted successfully!");
		},
	});
}
