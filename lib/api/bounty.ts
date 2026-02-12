/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type QueryKey,
	useInfiniteQuery,
	type UseInfiniteQueryResult,
	useMutation,
	type UseMutationResult,
	useQuery,
	useQueryClient,
	type UseQueryResult,
} from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import {
	type ApiError,
	type ApiResponse,
	axios,
	requestQueue,
} from "@/lib/axios";

import {
	CollectionCategory,
	type CollectionStatus,
	CollectionTypes,
} from "../enums";
import { FeedType } from "../enums";
import { type CollectionProps } from "../types/collection";
import { useCreateFeed } from "./feed";

// Attach Deliverables to Bounty

interface AttachDeliverablesToBountyParams {
	bountyId: string;
	replace?: boolean;
	deliverables: string[];
}

async function postAttachDeliverablesToBounty(
	params: AttachDeliverablesToBountyParams
): Promise<unknown> {
	const deliverables = params.deliverables.map((deliverable) => ({
		name: deliverable,
		description: deliverable,
	}));

	const res = await axios.post(`/collection/many`, {
		parent: params.bountyId,
		type: "deliverable",
		replace: params.replace,
		collections: deliverables,
	});
	return res.data.data;
}

export function useAttachDeliverablesToBounty(): UseMutationResult<
	unknown,
	ApiError,
	AttachDeliverablesToBountyParams,
	unknown
> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postAttachDeliverablesToBounty,
		mutationKey: ["assign-bounty-deliverables"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Assigning deliverables failed"
			);
		},
		onSuccess: (_, { bountyId }) => {
			queryClient.refetchQueries({
				queryKey: ["get-bounty-by-id", { bountyId }],
			});
		},
	});
}

// Create Bounty
interface CreateBountyParams {
	name: string;
	category: string;
	paymentFee: number;
	description: string;
	isPrivate: boolean;
	deliveryDate: string;
	tags?: string[];
	attachments?: string[];
	deliverables?: string[];
	meta: Record<string, any>;
}

async function postCreateBounty(
	params: CreateBountyParams
): Promise<CollectionProps> {
	const res = await axios.post("/collection", {
		...params,
		type: "bounty",
		deliverables: undefined,
	});
	return res.data.data;
}

export function useCreateBounty(): UseMutationResult<
	CollectionProps,
	ApiError,
	CreateBountyParams,
	unknown
> {
	const assignBountyDeliverables = useAttachDeliverablesToBounty();
	// const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postCreateBounty,
		mutationKey: ["create-bounty"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		// onSuccess: async ({ _id, name }, { deliverables = [] }) => {
		onSuccess: async ({ _id }, { deliverables = [] }) => {
			assignBountyDeliverables.mutate({
				bountyId: _id,
				deliverables,
			});
			// create feed is isPrivate is false
			// if (!isPrivate) {
			//     createFeed.mutate({
			//         owners: [creator?._id],
			//         title: name,
			//         description,
			//         data: _id,
			//         isPublic: true,
			//         type: FeedType.PUBLIC_BOUNTY_CREATED,
			//     });
			// }
			// toast.success(`Bounty ${name} published successfully`);
		},
	});
}

// Create Spot for Bounty
interface CreateSlotForBountyParams extends CreateBountyParams {
	parent: string;
}

async function postCreateSlotForBounty(
	params: CreateSlotForBountyParams
): Promise<CollectionProps> {
	const res = await axios.post(`/collection`, {
		name: params.name,
		category: params.category,
		paymentFee: params.paymentFee,
		isPrivate: params.isPrivate,
		description: params.description,
		deliveryDate: params.deliveryDate,
		tags: params.tags,
		meta: params.meta,
		parent: params.parent,
		type: "slot",
	});
	return res.data.data;
}

export function useCreateSlotForBounty({
	deliverables,
}: {
	deliverables: string[];
}): UseMutationResult<
	CollectionProps,
	ApiError,
	CreateSlotForBountyParams,
	unknown
> {
	const assignBountyDeliverables = useAttachDeliverablesToBounty();

	return useMutation({
		mutationFn: postCreateSlotForBounty,
		mutationKey: ["create-slot-for-bounty"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: async ({ _id }) => {
			assignBountyDeliverables.mutate({
				bountyId: _id,
				deliverables,
			});
			// toast.success(`Spot created successfully`);
		},
	});
}

// Get Bounties
interface GetBountyParams {
	page?: number;
	limit?: number;
	category?: CollectionCategory;
	status?: CollectionStatus | CollectionStatus[];
	filter?: Record<string, any>;
	type?: CollectionTypes;
	parent?: string;
}

export interface GetBountyResponse {
	limit: number;
	page: number;
	pages: number;
	total: number;
	data: CollectionProps[];
}

async function getBounties(
	params: GetBountyParams
): Promise<GetBountyResponse> {
	const res = await axios.get("/collection", {
		params: {
			type: params.type ?? CollectionTypes.BOUNTY,
			creator:
				params.category === CollectionCategory.CREATED
					? true
					: undefined,
			isPrivate:
				params.category === CollectionCategory.OPEN ? false : undefined,
			receiver:
				params.category === CollectionCategory.ASSIGNED
					? true
					: undefined,
			status: params.status,
			page: params.page,
			limit: params.limit,
			parent: params.parent,
			...params.filter,
		},
	});
	return res.data.data;
}

export function useGetBounties(
	params: GetBountyParams
): UseQueryResult<GetBountyResponse, ApiError> {
	return useQuery({
		queryFn: () => getBounties(params),
		queryKey: ["get-bounties", params],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchInterval: 10000,
		refetchOnWindowFocus: false,
	});
}
export function useGetBountiesInfinitely(
	params: GetBountyParams
): UseInfiniteQueryResult<GetBountyResponse, ApiError> {
	const { filter } = params;

	const getQueryKey: QueryKey = [
		"bounties",
		`${JSON.stringify(filter ?? params)}`,
	];

	return useInfiniteQuery(
		getQueryKey,
		async ({ pageParam = 1 }) =>
			getBounties({ ...params, page: pageParam }),
		{
			getNextPageParam: (lastPage) => {
				const { page: p, pages } = lastPage;

				const nextPage = p < pages;

				return nextPage ? p + 1 : undefined;
			},
			enabled: true,
		}
	);
}

// Get Bounty By Id
interface GetBountyByIdParams {
	bountyId: string;
	extras?: string;
}

interface GetBountyByIdResponse extends CollectionProps {}

async function getBountyById(
	params: GetBountyByIdParams
): Promise<GetBountyByIdResponse> {
	const res = await axios.get(`/collection/${params.bountyId}`);
	return res.data.data;
}

export function useGetBountyById(
	params: GetBountyByIdParams
): UseQueryResult<GetBountyByIdResponse, ApiError> {
	const uQ = useQuery({
		queryFn: async () => {
			if (
				params.bountyId &&
				params.bountyId !== "" &&
				params.bountyId !== undefined &&
				params.bountyId !== null
			) {
				return getBountyById(params);
			}
			throw new Error("Invalid parameters");
		},
		queryKey: ["get-bounty-by-id", params],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"An error occurred getting Bounty Details"
			);
		},
	});

	return uQ;
}

// Update Bounty
interface UpdateBountyParams {
	id?: string;
	name?: string;
	category?: string;
	paymentFee?: number;
	description?: string;
	tags?: string[];
	isPrivate?: boolean;
	deliveryDate?: string;
	deliverables?: string[];
	attachments?: string[];
	meta?: Record<string, any>;
	type?: CollectionTypes;
	status?: CollectionStatus;
}

async function postUpdateBounty(
	params: UpdateBountyParams
): Promise<CollectionProps> {
	const res = await axios.patch(`/collection/${params.id}`, {
		...params,
		type: params.type ?? CollectionTypes.BOUNTY,
		id: undefined,
		deliverables: undefined,
	});
	return res.data.data;
}

export function useUpdateBounty(): UseMutationResult<
	CollectionProps,
	ApiError,
	UpdateBountyParams,
	unknown
> {
	const updateBountyDeliverables = useAttachDeliverablesToBounty();

	return useMutation({
		mutationFn: postUpdateBounty,
		mutationKey: ["update-bounty"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: async (_, { deliverables = [], id }) => {
			// onSuccess: async (_, { deliverables = [], id, name }) => {
			if (id) {
				updateBountyDeliverables.mutate(
					{
						bountyId: id,
						deliverables,
						replace: true,
					},
					{
						onError: (error: ApiError) => {
							toast.error(
								error?.response?.data.message ??
									"An error occurred updating deliverables"
							);
						},
					}
				);
				// toast.success(`Bounty ${name} updated successfully`);
			}
		},
	});
}

// Mark Deliverable as Complete
interface MarkDeliverableAsCompleteParams {
	bountyId: string;
	bountyCreator: string;
	isComplete: boolean;
	deliverableId: string;
	totalDeliverables: number;
	completedDeliverables: number;
	meta: Record<string, any>;
}

async function postToggleDeliverableCompletion(
	params: MarkDeliverableAsCompleteParams
): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.deliverableId}`, {
		progress: params.isComplete ? 100 : 0,
		meta: params.meta,
	});
	return res.data;
}

export function useToggleDeliverableCompletion({
	description,
}: {
	description: string;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	MarkDeliverableAsCompleteParams,
	unknown
> {
	const createFeed = useCreateFeed();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postToggleDeliverableCompletion,
		mutationKey: ["mark-deliverable-as-complete"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"Marking deliverable as complete failed"
			);
		},
		onSuccess: async (
			_,
			{
				completedDeliverables,
				bountyId,
				bountyCreator,
				totalDeliverables,
				isComplete,
			}
		) => {
			await Promise.all([
				queryClient.refetchQueries({
					queryKey: [
						"get-bounties",
						{ category: CollectionCategory.ASSIGNED },
					],
				}),
				queryClient.refetchQueries({
					queryKey: ["get-bounty-by-id", { bountyId }],
				}),
			]);
			// if (isComplete) {
			const completedD = isComplete
				? completedDeliverables + 1
				: completedDeliverables - 1;
			createFeed.mutate({
				type: FeedType.BOUNTY_DELIVERABLE_UPDATE,
				owners: [bountyCreator],
				title: "New Bounty Deliverable Update",
				description,
				data: bountyId,
				isPublic: false,
				meta: {
					value: (100 * completedD) / totalDeliverables,
					isMarked: isComplete,
				},
			});
			// }
			// toast.success(
			// 	`Deliverable marked as ${isComplete ? "complete" : "incomplete"} successfully`
			// );
		},
	});
}

// Update Bounty Progress
interface UpdateBountyProgressParams {
	bountyId: string;
	progress: number;
}

async function postUpdateBountyProgress(
	params: UpdateBountyProgressParams
): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.bountyId}`, {
		progress: params.progress,
	});
	return res.data.data;
}

export function useUpdateBountyProgress({
	creatorId,
}: {
	creatorId: string;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	UpdateBountyProgressParams,
	unknown
> {
	const queryClient = useQueryClient();
	const bountiesQuery = useGetBounties({
		category: CollectionCategory.ASSIGNED,
	});
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postUpdateBountyProgress,
		mutationKey: ["update-bounty-progress"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"Updating bounty progress failed"
			);
		},
		onSuccess: async (_, { bountyId, progress }) => {
			await Promise.all([
				bountiesQuery.refetch(),
				queryClient.refetchQueries(["get-bounty-by-id", { bountyId }]),
			]);
			if (creatorId && progress === 100) {
				createFeed.mutate({
					owners: [creatorId],
					title: "Talent Completed Bounty",
					description: "Talent Completed Bounty",
					isPublic: false,
					type: FeedType.BOUNTY_COMPLETION,
					data: bountyId,
					meta: {
						progress,
					},
				});
			}
		},
	});
}

// Mark Bounty as Complete
interface MarkBountyAsCompleteParams {
	bountyId: string;
	talentId?: string;
}

async function postMarkBountyAsComplete(
	params: MarkBountyAsCompleteParams
): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.bountyId}`, {
		status: "completed",
	});
	return res.data.data;
}

export function useMarkBountyAsComplete(): UseMutationResult<
	ApiResponse,
	ApiError,
	MarkBountyAsCompleteParams,
	unknown
> {
	const queryClient = useQueryClient();
	const bountiesQuery = useGetBounties({
		category: CollectionCategory.ASSIGNED,
	});
	// const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postMarkBountyAsComplete,
		mutationKey: ["mark-bounty-as-complete"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"Marking bounty as complete failed"
			);
		},
		onSuccess: async (_, { bountyId }) => {
			await bountiesQuery.refetch();
			await queryClient.refetchQueries([
				"get-bounty-by-id",
				{ bountyId },
			]);
			// toast.success("Bounty marked as completed");
		},
	});
}

// Create Bounty Review
interface CreateBountyReviewParams {
	bountyId: string;
	rating: number;
	review: string;
	recipientId: string;
}

async function postCreateBountyReview(
	params: CreateBountyReviewParams
): Promise<ApiResponse> {
	const res = await axios.post(`/reviews`, {
		review: params.review,
		rating: params.rating,
		collectionId: params.bountyId,
		receiver: params.recipientId,
	});
	return res.data.data;
}

export function useCreateBountyReview(): UseMutationResult<
	ApiResponse,
	ApiError,
	CreateBountyReviewParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: postCreateBountyReview,
		mutationKey: ["create-bounty-review"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (_, { bountyId, recipientId, review, rating }) => {
			queryClient.refetchQueries(["get-bounty-by-id", { bountyId }]);
			createFeed.mutate({
				title: "Bounty Review",
				description: review,
				isPublic: false,
				data: bountyId,
				owners: [recipientId],
				type: FeedType.BOUNTY_REVIEW,
				meta: {
					rating,
				},
			});
			// toast.success("Your review has been submitted successfully");
		},
	});
}

// Release Bounty Payment
interface ReleaseBountyPaymentParams {
	bountyId: string;
	amount?: number;
	owner?: string;
}

async function postReleaseBountyPayment(
	params: ReleaseBountyPaymentParams
): Promise<ApiResponse> {
	const res = await axios.post(`/payment/release`, {
		collection: params.bountyId,
		isParentFunded: true,
	});
	return res.data.data;
}

export function useReleaseBountyPayment(): UseMutationResult<
	ApiResponse,
	ApiError,
	ReleaseBountyPaymentParams,
	unknown
> {
	const queryClient = useQueryClient();
	const bountiesQuery = useGetBounties({
		category: CollectionCategory.ASSIGNED,
	});
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postReleaseBountyPayment,
		mutationKey: ["release-bounty-payment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (_, { bountyId, owner }) => {
			bountiesQuery.refetch();
			queryClient.refetchQueries(["get-bounty-by-id", { bountyId }]);
			if (owner) {
				createFeed.mutate({
					title: "Bounty Payment",
					description: "Bounty Payment Released",
					isPublic: false,
					data: bountyId,
					owners: [owner],
					type: FeedType.BOUNTY_PAYMENT_RELEASED,
				});
			}
			// toast.success("Payment released successfully");
		},
	});
}

// Invite talent to a bounty
interface InviteTalentToBountyParams {
	applicationId: string;
	talentId: string;
}

async function postInviteTalentToBounty(
	params: InviteTalentToBountyParams
): Promise<ApiResponse> {
	const res = await axios.post(`/invite`, {
		collection: params.applicationId,
		recipient: params.talentId,
	});
	return res.data.data;
}

export function useInviteTalentToBounty({
	talentId,
	bounty,
}: {
	talentId: string;
	bounty: CollectionProps;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	InviteTalentToBountyParams,
	unknown
> {
	const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: postInviteTalentToBounty,
		mutationKey: ["invite-talent-to-private-bounty"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"An error occurred inviting talent"
			);
		},
		onSuccess: () => {
			if (!bounty.isPrivate) {
				// create bounty filled notification for public bounty applicants
				const applicants = bounty.collections
					.filter((a) => a.type === CollectionTypes.APPLICATION)
					.map((a) => a.creator._id)
					.filter((a) => a !== talentId);
				if (applicants.length > 0) {
					createFeed.mutate({
						owners: [...applicants],
						title: "Bounty Filled",
						type: FeedType.PUBLIC_BOUNTY_FILLED,
						data: bounty._id,
						description: "Bounty Filled",
						isPublic: false,
					});
				}
			}
			// toast.success("Talent invited successfully");
		},
	});
}

// Cancel a bounty invite

interface CancelBountyInviteParams {
	inviteId: string;
}

async function postCancelBountyInvite(
	params: CancelBountyInviteParams
): Promise<ApiResponse> {
	const res = await axios.post(`/invite/${params.inviteId}/cancel`);
	return res.data.data;
}

export function useCancelBountyInvite(): UseMutationResult<
	ApiResponse,
	ApiError,
	CancelBountyInviteParams,
	unknown
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCancelBountyInvite,
		mutationKey: ["cancel-bounty-invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			queryClient.refetchQueries(["get-bounty-by-id"]);
			// toast.success("Invite cancelled successfully");
		},
	});
}

// Decline a private bounty invite
interface DeclinePrivateBountyInviteParams {
	inviteId: string;
}

async function postDeclinePrivateBountyInvite(
	params: DeclinePrivateBountyInviteParams
): Promise<ApiResponse> {
	const res = await axios.post(`/invite/${params.inviteId}/decline`);
	return res.data.data;
}

export function useDeclinePrivateBountyInvite(): UseMutationResult<
	ApiResponse,
	ApiError,
	DeclinePrivateBountyInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postDeclinePrivateBountyInvite,
		mutationKey: ["decline-private-bounty-invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		// onSuccess: () => {
		// 	toast.success("Invite declined successfully");
		// },
	});
}

// OPEN BOUNTIES

// Apply to an open bounty

interface ApplyToOpenBountyParams {
	bountyId: string;
	message: string;
}

async function postApplyToOpenBounty(
	params: ApplyToOpenBountyParams
): Promise<CollectionProps> {
	const res: AxiosResponse<{ data: CollectionProps }> = await requestQueue({
		url: `/collection`,
		method: "POST",
		data: {
			type: "application",
			name: "Application",
			description: params.message,
			parent: params.bountyId,
		},
	});
	return res.data.data;
}

export function useApplyToOpenBounty({
	bountyCreator,
}: {
	bountyCreator: string;
}): UseMutationResult<
	CollectionProps,
	ApiError,
	ApplyToOpenBountyParams,
	unknown
> {
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postApplyToOpenBounty,
		mutationKey: ["apply-to-open-bounty"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data) => {
			// create new bounty application feed for bounty owner
			createFeed.mutate({
				owners: [bountyCreator],
				title: "New Bounty application",
				description: "New Bounty application",
				data: data._id,
				isPublic: false,
				type: FeedType.BOUNTY_APPLICATION_SUBMITTED,
			});
			// toast.success("Applied to bounty successfully");
		},
	});
}

// Post Bounty Payment Details

interface PostBountyPaymentDetailsParams {
	bountyId: string;
	coin: string;
}

export interface PostBountyPaymentDetailsResponse {
	rate: number;
	usdFee: number;
	address: string;
	usdAmount: number;
	amountToPay: number;
	expectedFee: number;
	feePercentage: number;
	collectionAmount: number;
	chainId: number;
}

async function postBountyPaymentDetails(
	params: PostBountyPaymentDetailsParams
): Promise<PostBountyPaymentDetailsResponse> {
	const res = await axios.post(`/payment`, {
		coin: params.coin,
		collection: params.bountyId,
	});
	return res.data.data;
}

export function usePostBountyPaymentDetails(): UseMutationResult<
	PostBountyPaymentDetailsResponse,
	ApiError,
	PostBountyPaymentDetailsParams,
	unknown
> {
	return useMutation({
		mutationFn: postBountyPaymentDetails,
		mutationKey: ["get-bounty-payment-details"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Confirm Bounty Payment

interface ConfirmBountyPaymentParams {
	bountyId: string;
	delay?: number;
}

async function postConfirmBountyPayment(
	params: ConfirmBountyPaymentParams
): Promise<CollectionProps> {
	await new Promise((resolve): void => {
		setTimeout(resolve, params.delay ?? 0);
	});
	const res = await axios.post(`/payment/validate`, {
		collection: params.bountyId,
	});
	return res.data.data;
}

export function useConfirmBountyPayment(): UseMutationResult<
	CollectionProps,
	ApiError,
	ConfirmBountyPaymentParams,
	unknown
> {
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postConfirmBountyPayment,
		mutationKey: ["confirm-bounty-payment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: async ({ _id, name, isPrivate, description, creator }) => {
			// create feed is isPrivate is false
			if (!isPrivate) {
				createFeed.mutate({
					// @ts-expect-error --- Creator is meant to return object data but returned string
					owners: [creator as string],
					title: name,
					description,
					data: _id,
					isPublic: true,
					type: FeedType.PUBLIC_BOUNTY_CREATED,
				});
			}
			// toast.success("Payment confirmed successfully");
		},
	});
}

interface DeleteBountyParams {
	id: string;
}

async function postDeleteBounty(
	params: DeleteBountyParams
): Promise<CollectionProps> {
	const res = await axios.delete(`/collection/${params.id}`);
	return res.data.data;
}

export function useDeleteBounty(): UseMutationResult<
	CollectionProps,
	ApiError,
	DeleteBountyParams,
	unknown
> {
	return useMutation({
		mutationFn: postDeleteBounty,
		mutationKey: ["delete-bounty"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		// onSuccess: () => {
		// 	toast.success(`Bounty deleted successfully`);
		// },
	});
}

// Request Bounty Cancellation

interface RequestBountyCancellationParams {
	type: string;
	bountyId: string;
	reason: string;
	explanation?: string;
}

async function requestBountyCancellation(
	params: RequestBountyCancellationParams
): Promise<ApiResponse> {
	const res = await axios.post(`/collection`, {
		type: params.type,
		name: params.reason,
		parent: params.bountyId,
		description: params.explanation,
	});

	return res.data.data;
}

export function useRequestBountyCancellation({
	ambassadorId,
}: {
	ambassadorId: string;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	RequestBountyCancellationParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: requestBountyCancellation,
		mutationKey: ["request-bounty-cancellation"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"Error requesting bounty cancellation"
			);
		},
		onSuccess: (_, { bountyId }) => {
			queryClient.refetchQueries({
				queryKey: ["get-bounty-by-id", { bountyId }],
			});
			createFeed.mutate({
				title: "Bounty Cancel Request",
				description: "Bounty Cancel Request",
				owners: [ambassadorId],
				data: bountyId,
				type: FeedType.BOUNTY_CANCELLED_REQUEST,
				isPublic: false,
			});
			// toast.success(`Bounty cancellation requested successfully`);
		},
	});
}

// Accept Bounty Cancellation

interface AcceptBountyCancellationParams {
	bountyId: string;
	amount: number;
	rating: number;
	review: string;
	recipientId: string;
}

async function acceptBountyCancellation(
	params: AcceptBountyCancellationParams
): Promise<ApiResponse> {
	let res;

	res = await axios.post(`/reviews`, {
		review: params.review,
		rating: params.rating,
		collectionId: params.bountyId,
		receiver: params.recipientId,
	});

	res = await axios.post(`/payment/release`, {
		collection: params.bountyId,
		amount: params.amount.toString(),
	});

	res = await axios.patch(`/collection/${params.bountyId}`, {
		status: "cancelled",
	});

	return res.data.data;
}

export function useAcceptBountyCancellation(): UseMutationResult<
	ApiResponse,
	ApiError,
	AcceptBountyCancellationParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: acceptBountyCancellation,
		mutationKey: ["accept-bounty-cancellation"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"Error accepting bounty cancellation"
			);
		},
		onSuccess: async (_, { bountyId, recipientId, rating, review }) => {
			const bountyRefetch = queryClient.refetchQueries({
				queryKey: ["get-bounty-by-id", { bountyId }],
			});

			const feedCreation = new Promise((resolve, reject) => {
				createFeed.mutate(
					{
						title: "Bounty Cancellation Accepted",
						description: "Bounty Cancellation Accepted",
						owners: [recipientId],
						data: bountyId,
						type: FeedType.BOUNTY_CANCELLED_ACCEPTED,
						isPublic: false,
						meta: {
							value: rating,
							review,
						},
					},
					{
						onSuccess: resolve,
						onError: reject,
					}
				);
			});
			await Promise.all([bountyRefetch, feedCreation]);
			// toast.success(`Bounty cancellation accepted successfully`);
		},
	});
}

// Request Review Change

interface RequestReviewChangeParams {
	bountyId: string;
	reason: string;
}

async function requestReviewChange(
	params: RequestReviewChangeParams
): Promise<ApiResponse> {
	const res = await axios.post(`/collection`, {
		status: "pending",
		parent: params.bountyId,
		description: params.reason,
		type: "review_change_request",
		name: "Review Change Request",
	});

	return res.data.data;
}

export function useRequestReviewChange({
	recipientId,
}: {
	recipientId: string;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	RequestReviewChangeParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: requestReviewChange,
		mutationKey: ["request-review-change"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"Error requesting review change"
			);
		},
		onSuccess: async (_, { bountyId }) => {
			await queryClient.refetchQueries({
				queryKey: ["get-bounty-by-id", { bountyId }],
			});
			// create feeds
			createFeed.mutate({
				title: "Request Review Change",
				description: "New Review Change Request",
				owners: [recipientId],
				data: bountyId,
				type: FeedType.BOUNTY_REVIEW_CHANGE,
				isPublic: false,
			});
			// toast.success(`Review change requested successfully`);
		},
	});
}

// Accept Review Change: client review is deleted, all deliverables status as 0;
interface AcceptReviewChangeParams {
	bountyId: string;
	reviewId: string;
	requestId: string;
	deliverableIds: string[];
}

// this basically deletes the review, sets all deliverables to 0
async function acceptReviewChange(
	params: AcceptReviewChangeParams
): Promise<ApiResponse> {
	let res;

	res = await axios.delete(`/reviews/${params.reviewId}`);

	res = await axios.patch(`/collection/many/update`, {
		collections: params.deliverableIds.map((id) => ({
			id,
			progress: 0,
		})),
	});

	res = await axios.patch(`/collection/${params.requestId}`, {
		status: "completed",
	});

	res = await axios.patch(`/collection/${params.bountyId}`, {
		status: "ongoing",
	});

	return res.data.data;
}

export function useAcceptReviewChange({
	bountyId,
	recipientId,
}: {
	bountyId: string;
	recipientId: string;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	AcceptReviewChangeParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: acceptReviewChange,
		mutationKey: ["accept-review-change"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Error accepting review change"
			);
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: ["get-bounty-by-id", { bountyId }],
			});
			// create feeds
			createFeed.mutate({
				title: "Review Change Accepted",
				description: "New Review Change Request Accepted",
				owners: [recipientId],
				data: bountyId,
				type: FeedType.BOUNTY_REVIEW_CHANGE_ACCEPTED,
				isPublic: false,
			});
			// toast.success(`Review change accepted successfully`);
		},
	});
}

// Decline Review Change: review_request status is set to cancelled,

interface DeclineReviewChangeParams {
	reviewChangeRequestId: string;
}

async function declineReviewChange(
	params: DeclineReviewChangeParams
): Promise<ApiResponse> {
	const res = await axios.patch(
		`/collection/${params.reviewChangeRequestId}`,
		{
			status: "completed",
		}
	);

	return res.data.data;
}

export function useDeclineReviewChange({
	bountyId,
	recipientId,
}: {
	bountyId: string;
	recipientId: string;
}): UseMutationResult<
	ApiResponse,
	ApiError,
	DeclineReviewChangeParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: declineReviewChange,
		mutationKey: ["decline-review-change"],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Error declining review change"
			);
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: ["get-bounty-by-id", { bountyId }],
			});
			// create feeds
			createFeed.mutate({
				title: "Review Change Accepted",
				description: "New Review Change Request Accepted",
				owners: [recipientId],
				data: bountyId,
				type: FeedType.BOUNTY_REVIEW_CHANGE_ACCEPTED,
				isPublic: false,
			});
			// toast.success(`Review change declined successfully`);
		},
	});
}
