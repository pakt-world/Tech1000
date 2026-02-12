describe("Login", () => {
	it("should log into the app", () => {
		cy.intercept("POST", `${Cypress.env("apiUrl")}/auth/login`).as("login");
		cy.visit("/login");

		// The page should contain an h3 with "Login"
		cy.get("h3").contains("Login to your account");

		cy.get("input[name=email]").type(Cypress.env("defaultUser"));
		cy.get("input[name=password]").type(Cypress.env("defaultPassword"));

		cy.get("form").submit();

		cy.wait("@login");

		cy.url().should("include", "/overview");
	});
});
