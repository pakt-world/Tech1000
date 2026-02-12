/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as z from "zod";

import { rejectSpecialCharacters } from "../utils";

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters.")
	.regex(/[0-9]/, "Password must contain at least one number.")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character."
	);

export const otpSchema = z.object({
	otp: z.string().min(6, { message: "OTP is required" }),
});

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});

export const signupSchema4Partner = z
	.object({
		firstName: z.string().min(1, { message: "Name is required" }),
		email: z
			.string()
			.min(1, { message: "Email is required" })
			.email("Please enter a valid email address."),
		password: passwordSchema,
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});

export const signupSchema4Ambassador = z
	.object({
		lastName: z.string().optional(), //lastname is made optional
		firstName: z.string().min(1, { message: "Name is required" }),
		email: z
			.string()
			.min(1, { message: "Email is required" })
			.email("Please enter a valid email address."),
		password: passwordSchema,
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});

export const loginSchema = z.object({
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password is too short"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const web3LoginSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const referralSchema = z.object({
	emails: z.array(z.string()).nonempty({ message: "emails are required" }),
});

export const editProfileFormSchema = z.object({
	firstName: z.string().min(1, "First Name is required"),
	lastName: z.string().optional(),
	title: z.string().min(1, "Title is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	bio: z.string().optional(),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	tags: z
		.array(
			z.string().refine((tag) => rejectSpecialCharacters(tag), {
				message: "Special characters are not allowed",
			})
		)
		.min(3, "Minimum of 3 interests are required"),
	isPrivate: z.boolean().default(false).optional(),
	website: z.string().optional(),
	x: z.string().optional(),
	tiktok: z.string().optional(),
	instagram: z.string().optional(),
	github: z.string().optional(),
	role: z.string().optional(),
});

// Mobile

export const editProfileFormSchema4Mobile = z.object({
	firstName: z.string().min(1, "First Name is required"),
	lastName: z.string().optional(),
	title: z.string().min(1, "Title is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	role: z.string().optional(),
	// tags: z
	// 	.array(
	// 		z.string().refine((tag) => rejectSpecialCharacters(tag), {
	// 			message: "Special characters are not allowed",
	// 		})
	// 	)
	// 	.min(3, "Minimum of 3 interests are required"),
});

export const editProfileFormSchema4Mobile2 = z.object({
	firstName: z.string().min(1, "First Name is required"),
	lastName: z.string().optional(),
	title: z.string().min(1, "Bounty Title is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	isPrivate: z.boolean().default(false).optional(),
	bio: z.string().optional(),
	tags: z
		.array(z.string())
		.min(3, "Minimum of 3 interests")
		.max(10, "Maximum of 10 skills are required")
		.optional(),
	role: z.string().optional(),
});

export const editProfileFormSchema4Mobile3 = z.object({
	firstName: z.string().min(1, "First Name is required"),
	lastName: z.string().optional(),
	title: z.string().min(1, "Bounty Title is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	isPrivate: z.boolean().default(false).optional(),
	bio: z.string().optional(),
	tags: z
		.array(z.string())
		.min(3, "Minimum of 3 interests")
		.max(10, "Maximum of 10 skills are required")
		.optional(),
	website: z.string().optional(),
	x: z.string().optional(),
	tiktok: z.string().optional(),
	instagram: z.string().optional(),
	github: z.string().optional(),
});

export const changePasswordFormSchema = z
	.object({
		currentPassword: z.string().min(1, "Current Password is required"),
		newPassword: z
			.string()
			.min(1, "New Password is required")
			.regex(
				// eslint-disable-next-line no-useless-escape
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
			),
		confirmNewPassword: z
			.string()
			.min(1, "Confirm New Password is required"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		path: ["confirmNewPassword"],
	});

export const withdrawFormSchema = z.object({
	coin: z.string().min(1, "Password is required"),
	address: z.string().min(1, "Address is required"),
	amount: z.string(),
	password: z.string().min(1, "password is required"),
	confirm: z.boolean().refine((val) => val, {
		message: "You must accept Terms and Conditions",
	}),
});

export const createBountySchema = z.object({
	due: z.date({
		required_error: "Due date is required",
	}),
	thirdSkill: z
		.string()
		.min(1, "At least three skills are required.")
		.refine((data) => data === "" || rejectSpecialCharacters(data), {
			message: "Special characters are not allowed",
		}),
	secondSkill: z
		.string()
		.min(1, "At least three skills are required.")
		.refine((data) => data === "" || rejectSpecialCharacters(data), {
			message: "Special characters are not allowed",
		}),
	firstSkill: z
		.string()
		.min(1, "At least three skills are required.")
		.refine((data) => data === "" || rejectSpecialCharacters(data), {
			message: "Special characters are not allowed",
		}),
	budget: z.coerce
		.number()
		.min(100, { message: "Budget must be at least $100" }),
	title: z
		.string()
		.nonempty({ message: "Bounty title is required" })
		.refine(
			(data) => rejectSpecialCharacters(data, { allowApostrophes: true }),
			{
				message: "Special characters are not allowed",
			}
		),
	description: z
		.string()
		.nonempty({ message: "Bounty description is required" }),
	category: z.string().nonempty({ message: "Required" }),
	deliverables: z
		.array(z.string().nonempty("Deliverable cannot be an empty string"), {
			required_error: "At least one deliverable is required",
		})
		.max(5, {
			message: "You can add up to 5 deliverables",
		}),
	slotCount: z.coerce
		.number()
		.min(1, { message: "At least one slot is required" })
		.max(10, { message: "You can add up to 10 spots" }),
	coin: z.object({
		active: z.boolean(),
		createdAt: z.string(),
		decimal: z.string(),
		icon: z.string(),
		isToken: z.boolean(),
		name: z.string(),
		reference: z.string(),
		rpcChainId: z.string(),
		symbol: z.string(),
		updatedAt: z.string(),
		__v: z.number(),
		_id: z.string(),
		// priceTag?: z.string(),
	}),
});

export const deleteAccountSchema = z.object({
	confirm: z.boolean().refine((val) => val, {
		message: "You must accept Terms and Conditions",
	}),
	password: z.string().min(1, { message: "Password is required" }),
	irreversible: z.boolean().refine((val) => val, {
		message:
			"You must confirm that you understand that this action is irreversible",
	}),
});

//Groups
const noSpecialCharsRegex = /^[a-zA-Z0-9\s.,?!'":;()-]+$/;
export const groupCreationSchema = z.object({
	name: z
		.string()
		.min(1, "Group name is required")
		.regex(
			noSpecialCharsRegex,
			"Group name cannot contain special characters"
		),
	description: z
		.string()
		.min(1, "Group description is required")
		.regex(
			noSpecialCharsRegex,
			"Group description cannot contain special characters"
		),
	tags: z.array(z.string()).min(3, "Add three tags"),
	image: z.string().url("Must be a valid URL"),
	inviteType: z.enum(["open", "close", "private"]),
	invites: z
		.array(
			z.object({
				_id: z.string(),
				name: z.string(),
				role: z.string().optional(),
			})
		)
		.min(1, "At least one invitee is required"),
	admins: z
		.array(
			z.object({
				_id: z.string(),
				name: z.string(),
				role: z.string().optional(),
			})
		)
		.optional(),
	minScore: z
		.string()
		.optional()
		.refine(
			(value) => {
				return !value || value.trim().length > 0;
			},
			{
				message: "minScore must not be empty",
			}
		),
});

export const postCreationSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	// attachments: z.array(z.string()).optional(),
});

export const groupEditSchema = z.object({
	name: z
		.string()
		.min(1, "Group name is required")
		.regex(
			noSpecialCharsRegex,
			"Group name cannot contain special characters"
		),
	description: z
		.string()
		.min(1, "Group description is required")
		.regex(
			noSpecialCharsRegex,
			"Group description cannot contain special characters"
		),
	image: z.string().url("Must be a valid URL"),
});

export const signupSchema4Web3 = z.object({
	firstName: z.string().min(1, { message: "Name is required" }),
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email("Please enter a valid email address."),
});
