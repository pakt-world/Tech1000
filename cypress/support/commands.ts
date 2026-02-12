/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */

/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("login", (email: string, password: string) => {
	cy.visit("/auth/login");

	cy.get("input[name=email]").type(email);
	cy.get("input[name=password]").type(password);

	cy.get("form").submit();
});

// Cypress.Commands.add("generateTOTP", () => {
//     const OTP = require("totp.js");
//     const totp = new OTP(Cypress.env("otpSecret"));
//     const token = totp.genOTP();
//     return token;
// });

const b64toBlob = (
	b64Data: string,
	contentType: string = "",
	sliceSize: number = 512
): Blob => {
	const byteCharacters = atob(b64Data);
	const byteArrays: Uint8Array[] = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
};

Cypress.Commands.add(
	"generateRandomEmail",
	// @ts-expect-error
	(prefix: string = "cypuser"): string => {
		const randomEmail = `${prefix}+${Date.now()}@yopmail.com`;
		return randomEmail;
	}
);

Cypress.Commands.add("uploadFile", (fileName, fileType, selector) => {
	cy.fixture(fileName, "base64").then((content) => {
		cy.get<HTMLInputElement>(selector).attachFile({
			fileContent: b64toBlob(content, fileType),
			fileName,
			mimeType: fileType,
		});
	});
});

declare namespace Cypress {
	interface Chainable {
		login(email: string, password: string): Chainable<void>;
		generateTOTP(): Chainable<string>;
		generateRandomEmail(prefix?: string): Chainable<string>;
		uploadFile(
			fileName: string,
			fileType: string,
			selector: string
		): Chainable<void>;
	}
}
