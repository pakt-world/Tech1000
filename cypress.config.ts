import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		setupNodeEvents(on, config) {
			// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
			require("@cypress/code-coverage/task")(on, config);
			return config;
		},
	},
	env: {
		apiUrl: process.env.NEXT_PUBLIC_API_URL,
		defaultPassword: process.env.SEED_DEFAULT_USER_PASSWORD,
		defaultUser: process.env.SEED_DEFAULT_USER,
		defaultPartner: process.env.SEED_DEFAULT_PARTNER,
		partnerCode: process.env.SEED_DEFAULT_PARTNER_CODE,
		ambassadorCode: process.env.SEED_DEFAULT_AMBASSADOR_CODE,
	},
});
