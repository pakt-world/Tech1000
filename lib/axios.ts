/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { deleteCookie } from "cookies-next";
import { redirect } from "next/navigation";

import { queue } from "./request-queue";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AUTH_TOKEN_KEY, getRequestSignature } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axios: AxiosInstance = Axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds timeout
});

const EXCLUDED_ROUTES = [
	"/forgot-password",
	"/forgot-password/reset",
	"/login",
	"/login/verify",
	"/signup",
	"/signup/verify",
	"/overview",
	"/",
];

export const axiosDefault = Axios.create({
	headers: { "Access-Control-Allow-Origin": "*" },
	responseType: "blob",
});

axios.interceptors.request.use(async (request) => {
	const uri = request.url;
	const mainUrl = String(`/v1${uri?.split("?")[0]}`);
	const { timeStamp, signature } = getRequestSignature(mainUrl);
	request.headers["x-signature"] = signature;
	request.headers["x-timestamp"] = timeStamp;
	return request;
});

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response.status === 401) {
			deleteCookie(AUTH_TOKEN_KEY);
			if (window) {
				window.location.replace(
					`/login${!EXCLUDED_ROUTES.includes(window.location.pathname) ? "" : ""}` //`?redirect=${window.location.pathname}` : ""}`
				);
			} else {
				redirect("/login");
			}
			return;
		}
		return Promise.reject(error);
	}
);

export type ApiResponse<T = unknown> = AxiosResponse<{
	message: string;
	data: T;
}>;

export type ApiError<T = unknown> = AxiosError<{
	message: string;
	data?: T;
}>;

export const requestQueue = async <T>(
	config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
	return new Promise((resolve, reject) => {
		queue.addTask(async () => {
			try {
				const response = await axios.request<T>(config);
				resolve(response);
			} catch (error) {
				reject(error);
			}
		});
	});
};
