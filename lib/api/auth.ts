/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { type ApiError, axios } from "@/lib/axios";

import { useWalletState } from "../store/wallet";
import { AccountProps } from "../types/account";
// import { useUserState } from "../store/account";
// import { type Roles } from "../enums";

// Signup

interface SignupResponse {
	email: string;
	tempToken: {
		token: string;
		expiresIn: number;
	};
}

interface SignupParams {
	email: string;
	password: string;
	confirmPassword: string;
	lastName?: string;
	firstName: string;
	referral?: string;
}

async function postSignUp({
	email,
	password,
	confirmPassword,
	firstName,
	lastName,
	referral,
}: SignupParams): Promise<SignupResponse> {
	const res = await axios.post("/auth/create-account", {
		email,
		password,
		confirmPassword,
		firstName,
		referral,
		...(lastName ? { lastName } : ""),
	});
	return res.data.data as SignupResponse;
}

export function useSignUp(): UseMutationResult<
	SignupResponse,
	ApiError,
	SignupParams
> {
	return useMutation({
		mutationFn: postSignUp,
		mutationKey: ["signup"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Verify Email

interface VerifyEmailParams {
	otp: string;
	token: string;
}

async function postVerifyEmail({
	otp,
	token,
}: VerifyEmailParams): Promise<AccountProps> {
	const res = await axios.post("/auth/account/verify", {
		token: otp,
		tempToken: token,
	});
	return res.data.data as AccountProps;
}

export function useVerifyEmail(): UseMutationResult<
	AccountProps,
	ApiError,
	VerifyEmailParams
> {
	return useMutation({
		mutationFn: postVerifyEmail,
		mutationKey: ["verify-email"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Resend OTP

interface ResendOTPResponse {
	// token: string;
	// expiresIn: number;
	tempToken: {
		expiresIn: number;
		token: string;
		token_type: "jwt";
	};
	message: string;
	status: string;
}

interface ResendOTPParams {
	email: string;
}

async function postResendOTP({
	email,
}: ResendOTPParams): Promise<ResendOTPResponse> {
	const res = await axios.post("/auth/verify/resend", { email });
	return res.data.data as ResendOTPResponse;
}

export function useResendOTP(): UseMutationResult<
	ResendOTPResponse,
	ApiError,
	ResendOTPParams
> {
	return useMutation({
		mutationFn: postResendOTP,
		mutationKey: ["resend-otp"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success("OTP sent successfully");
		},
	});
}

async function postResendLoginOTP({
	email,
}: ResendOTPParams): Promise<ResendOTPResponse> {
	const res = await axios.post("/auth/2fa/email/code", { email });
	return res.data.data as ResendOTPResponse;
}

export function useResendLoginOTP(): UseMutationResult<
	ResendOTPResponse,
	ApiError,
	ResendOTPParams
> {
	return useMutation({
		mutationFn: postResendLoginOTP,
		mutationKey: ["resend-login-otp"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success("OTP sent successfully");
		},
	});
}

// Login
interface LoginResponse {
	email: string;
	token?: string;
	tempToken?: {
		token: string;
	};
	isVerified?: boolean;
	twoFa?: { status: boolean; type: string };
	timeZone?: string;
}

interface LoginParams {
	email: string;
	password: string;
}

interface Login2FAParams {
	code: string;
	tempToken: string;
}

async function postLogin({
	email,
	password,
}: LoginParams): Promise<LoginResponse> {
	const res = await axios.post("/auth/login", { email, password });
	return res.data.data as LoginResponse;
}

async function postLogin2FA({
	code,
	tempToken,
}: Login2FAParams): Promise<LoginResponse> {
	const res = await axios.post("/auth/login/2fa", { code, tempToken });
	return res.data.data as LoginResponse;
}

export function useLogin(): UseMutationResult<
	LoginResponse,
	ApiError,
	LoginParams
> {
	// const { setUser } = useUserState();
	const { setWallet } = useWalletState();
	return useMutation({
		mutationFn: postLogin,
		mutationKey: ["login"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			// setUser(data);
			setWallet({
				totalBalance: "0.00",
				value: "0.00",
				wallets: [],
			});
		},
	});
}

export function useLoginOTP(): UseMutationResult<
	LoginResponse,
	ApiError,
	Login2FAParams
> {
	// const { setUser } = useUserState();
	return useMutation({
		mutationFn: postLogin2FA,
		mutationKey: ["login_2fa"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			// setUser(data);
		},
	});
}

// reset Password

interface ResetPasswordParams {
	email: string;
}

interface ResetPasswordResponse {
	message: string;
	tempToken: {
		token: string;
		expiresIn: number;
	};
}

async function postRequestPasswordReset({
	email,
}: ResetPasswordParams): Promise<ResetPasswordResponse> {
	const res = await axios.post("/auth/password/reset", { email });
	return res.data.data as ResetPasswordResponse;
}

export function useRequestPasswordReset(): UseMutationResult<
	ResetPasswordResponse,
	ApiError,
	ResetPasswordParams
> {
	return useMutation({
		mutationFn: postRequestPasswordReset,
		mutationKey: ["request-reset-password"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

interface VerifyResetPasswordParams {
	token: string;
	tempToken: string;
}

interface VerifyResetPasswordResponse {
	message: string;
	tempToken: {
		token: string;
		expiresIn: number;
	};
}

async function postVerifyPasswordReset({
	tempToken,
	token,
}: VerifyResetPasswordParams): Promise<VerifyResetPasswordResponse> {
	const res = await axios.post("/auth/password/validate", {
		tempToken,
		token,
	});
	return res.data.data as VerifyResetPasswordResponse;
}

export function useVerifyResetPassword(): UseMutationResult<
	VerifyResetPasswordResponse,
	ApiError,
	VerifyResetPasswordParams
> {
	return useMutation({
		mutationFn: postVerifyPasswordReset,
		mutationKey: ["verify-reset-password"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

interface ResetAccountPasswordParams {
	token: string;
	tempToken: string;
	password: string;
}

interface ResetAccountPasswordResponse {
	message: string;
}

async function postAccountPasswordReset({
	tempToken,
	token,
	password,
}: ResetAccountPasswordParams): Promise<ResetAccountPasswordResponse> {
	const res = await axios.post("/auth/password/change", {
		tempToken,
		token,
		password,
	});
	return res.data.data as ResetAccountPasswordResponse;
}

export function useResetPassword(): UseMutationResult<
	ResetAccountPasswordResponse,
	ApiError,
	ResetAccountPasswordParams
> {
	return useMutation({
		mutationFn: postAccountPasswordReset,
		mutationKey: ["account-reset-password"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// web3 request
interface Web3RequestParams {
	account: string;
}

interface Web3RequestResponse {
	message: string;
	tempToken: {
		token: string;
		token_type: string;
		expiresIn: number;
	};
}

async function postWeb3Request({
	account,
}: Web3RequestParams): Promise<Web3RequestResponse> {
	const res = await axios.post("/auth/web3/request", {
		account,
	});
	return res.data.data as Web3RequestResponse;
}

export function useWeb3Request(): UseMutationResult<
	Web3RequestResponse,
	ApiError,
	Web3RequestParams
> {
	return useMutation({
		mutationFn: postWeb3Request,
		mutationKey: ["web3Request", Date.now()],
		onError: (error: ApiError) => {
			if (
				error?.response?.data.message !== "Token required access denied"
			) {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			}
		},
	});
}

// web3 onboard
interface Web3OnboardParams {
	email: string;
	firstName: string;
	lastName?: string;
	tempToken: string;
	signedMessage?: string;
}
interface Web3OnboardResponse {
	token?: string;
	token_type?: string;
	expiresIn?: number;
	isVerified?: boolean;
	tempToken?: {
		token: string;
		token_type: string;
		expiresIn: number;
	};
}

async function postWeb3Onboard({
	email,
	firstName,
	lastName,
	tempToken,
	signedMessage,
}: Web3OnboardParams): Promise<Web3OnboardResponse> {
	const res = await axios.post("/auth/web3/onboard", {
		email,
		firstName,
		lastName,
		tempToken,
		signedMessage,
	});
	return res.data.data as Web3OnboardResponse;
}

export function useWeb3Onboard(): UseMutationResult<
	Web3OnboardResponse,
	ApiError,
	Web3OnboardParams
> {
	return useMutation({
		mutationFn: postWeb3Onboard,
		mutationKey: ["web3Validate"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// web3 validation
interface Web3ValidateParams {
	signedMessage: string;
	tempToken: string;
	tokenId?: string;
}

interface Web3ValidateResponse {
	account: string;
	tempToken: {
		token: string;
		token_type: string;
		expiresIn: number;
	};
	email?: string;
	token?: string;
	isVerified?: boolean;
	twoFa?: { status: boolean; type: string };
	timeZone?: string;
}

async function postWeb3Validate({
	signedMessage,
	tempToken,
	tokenId,
}: Web3ValidateParams): Promise<Web3ValidateResponse> {
	const res = await axios.post("/auth/web3/validate", {
		signedMessage,
		tempToken,
		...(tokenId ? { tokenId } : {}),
	});
	return res.data.data as Web3ValidateResponse;
}

export function useWeb3Validate(): UseMutationResult<
	Web3ValidateResponse,
	ApiError,
	Web3ValidateParams
> {
	return useMutation({
		mutationFn: postWeb3Validate,
		mutationKey: ["web3Validate", Date.now()],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ??
					"An error occurred during validation"
			);
		},
	});
}
