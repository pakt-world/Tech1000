describe("Sign Up / Onboarding", () => {
	it("should onboard an ambassador", () => {
		cy.intercept("POST", `${Cypress.env("apiUrl")}/auth/create-account`).as(
			"createAccount"
		);
		cy.intercept("POST", `${Cypress.env("apiUrl")}/upload`).as("upload");
		cy.intercept("PATCH", `${Cypress.env("apiUrl")}/account/update`).as(
			"accountUpdate"
		);

		cy.visit(`/signup/${Cypress.env("ambassadorCode")}`);

		// The page should contain an h3 with "Create Your Account"
		cy.get("h3").contains("Create Your Account");

		cy.generateRandomEmail().then((randomEmail) => {
			cy.get("input[name=firstName]").type("Cypress");
			cy.get("input[name=lastName]").type("Test");
			cy.get("input[name=email]").type(randomEmail);
			cy.get("input[name=password]").type(Cypress.env("defaultPassword"));
			cy.get("input[name=confirmPassword]").type(
				Cypress.env("defaultPassword")
			);

			// Submit Sign Up Form
			cy.get("form").submit();

			cy.wait("@createAccount");

			// Verify email
			cy.url().should("include", "/signup/verify");

			const otp = "111111";

			for (let i = 0; i < otp.length; i++) {
				cy.get(
					`input[aria-label="Please enter OTP character ${i + 1}"]`
				).type(otp[i] ?? "");
			}

			cy.get("form").submit();

			// Onboarding
			cy.url().should("include", "/onboarding");

			// Step 1 - select interested
			cy.get("button").contains("Engineering").click();

			cy.get("button").contains("Continue").click();

			// Step 2 - create avatar
			cy.uploadFile("avatar.png", "image/png", 'input[type="file"]');

			cy.get("button").contains("Upload Image").click();

			cy.wait("@upload");
			cy.wait("@accountUpdate");

			// Dashboard
			cy.url().should("include", "/overview");
		});
	});

	it("should onboard a partner", () => {
		cy.intercept("POST", `${Cypress.env("apiUrl")}/auth/create-account`).as(
			"createAccount"
		);
		cy.intercept(
			"POST",
			`${Cypress.env("apiUrl")}/account/verify
`
		).as("accountVerify");
		cy.intercept("PATCH", `${Cypress.env("apiUrl")}/account/update`).as(
			"accountUpdate"
		);

		cy.visit(`/signup/${Cypress.env("partnerCode")}`);

		// The page should contain an h3 with "Create Your Account"
		cy.get("h3").contains("Create Your Account");

		cy.generateRandomEmail("cypuser-partner").then((randomEmail) => {
			cy.get("input[name=firstName]").type("Cypress Partner");
			cy.get("input[name=email]").type(randomEmail);
			cy.get("input[name=password]").type(Cypress.env("defaultPassword"));
			cy.get("input[name=confirmPassword]").type(
				Cypress.env("defaultPassword")
			);

			// Submit Sign Up Form
			cy.get("form").submit();

			cy.wait("@createAccount");

			// Verify email
			cy.url().should("include", "/signup/verify");

			const otp = "111111";

			for (let i = 0; i < otp.length; i++) {
				cy.get(
					`input[aria-label="Please enter OTP character ${i + 1}"]`
				).type(otp[i] ?? "");
			}

			cy.get("form").submit();

			// Dashboard
			cy.url().should("include", "/overview");

			// Profile Update
			cy.get("button").contains("Complete Profile").click();
			cy.get("[data-test-id='country']", { timeout: 10000 }).click();
			cy.get("input[cmdk-input]").type("Nigeria");
			cy.get("[data-value='nigeria']").click();

			cy.get("[data-test-id='state']").click();
			cy.get("input[cmdk-input]").type("Lagos");
			cy.get("[data-value='lagos']").click();

			const skills = [
				"React",
				"NodeJS",
				"Typescript",
				"Project Management",
			];

			for (let i = 0; i < skills.length; i++) {
				cy.get("[data-test-id='tag-input'").type(`${skills[i]}{enter}`);
			}

			cy.get("textarea[name='bio']").type("My bio");

			cy.get("button").contains("Save Changes").click();

			cy.wait("@accountUpdate", { timeout: 10000 });
			cy.url().should("include", "/profile");
		});
	});
});
