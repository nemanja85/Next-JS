/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    login(email: string, password: string): void;
    loginAs(role: 'admin' | 'user'): void;
    dataCy(selector: string): Chainable<JQuery<Element>>;
    api(url: string): string;
  }
}

// export type ValidationError = { field: string; message: string };

// export type ValidationErrors = ValidationError[];
