/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { AUTH_TOKEN_KEY, getRequestSignature } from "@/lib/utils";
import Logger from "@/lib/utils/logger";

const useSocket = (url: string) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const authToken = getCookie(AUTH_TOKEN_KEY);

	useEffect(() => {
		Logger.info(`connecting-to-websocket---${url}`);
		const signatureData = getRequestSignature("web-socket");
		try {
			const socketIo = io(url as string, {
				secure: true,
				extraHeaders: {
					authorization: `Bearer ${authToken}`,
					"x-signature": signatureData.signature,
					"x-timestamp": signatureData.timeStamp,
				},
				auth: {
					authorization: `Bearer ${authToken}`,
					"x-signature": signatureData.signature,
					"x-timestamp": signatureData.timeStamp,
				},
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				transports: ["websocket"],
			});

			setSocket(socketIo);

			function cleanup() {
				socketIo.disconnect();
			}

			return cleanup;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Socket Connection Error";
			Logger.error(`socket-connection-error-->${errorMessage}`);
			toast.error(errorMessage);
			return;
		}
	}, []);

	return socket;
};

export default useSocket;
