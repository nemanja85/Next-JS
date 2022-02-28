/// <reference types="cypress" />

describe('Dashboard', () => {
  it('should see Dashboard title', () => {
    cy.visit('/dashboard');

    cy.dataCy('row').should('have.length', 20);
  });
});
