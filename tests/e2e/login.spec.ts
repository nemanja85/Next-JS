/// <reference types="cypress" />

describe('Auth', () => {
  it('should have proper title', () => {
    cy.visit('/');
    cy.title().should('eq', 'Home | Site');
  });

  it('should login successfully', () => {
    cy.login('mark@ds.com', 'kundenschlauf');
  });

  it('should toggle theme', () => {
    cy.visit('/');

    cy.dataCy('toggleTheme').click();

    cy.get('html').should('not.have.class', 'dark');
  });

  it('should not have dark theme when double click on toggle theme button', () => {
    cy.visit('/');

    cy.dataCy('toggleTheme').dblclick();

    cy.get('html').should('have.class', 'dark');
  });

  it('should not have dark theme when click programmatically on toggle theme button', () => {
    cy.visit('/');

    cy.dataCy('toggleTheme').click();

    cy.get('html').should('not.have.class', 'dark');

    cy.dataCy('toggleTheme').click();

    cy.get('html').should('have.class', 'dark');
  });
});
