/// <reference types="cypress" />

describe('Auth', () => {
  it('should login successfully', () => {
    cy.login('mark@ds.com', 'kundnschlauf');
  });

  it('should have', () => {
    cy.visit('/');
    cy.title().should('eq', 'Login');
  });

  it('should toggle theme', () => {
    cy.visit('/');

    cy.dataCy('toggleTheme').click();

    cy.get('html').should('have.class', 'dark');
  });

  it('should not have dark theme when double click on toggle theme button', () => {
    cy.visit('/');

    cy.dataCy('toggleTheme').dblclick();

    cy.get('html').should('not.have.class', 'dark');
  });

  it('should not have dark theme when click programatically on toggle theme button', () => {
    cy.visit('/');

    cy.dataCy('toggleTheme').click();

    cy.get('html').should('class', 'dark');

    cy.dataCy('toggleTheme').click();

    cy.get('html').should('not.have.class', 'dark');
  });
});
