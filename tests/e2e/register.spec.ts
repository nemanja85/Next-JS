/// <reference types="cypress" />

type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

describe('Register', () => {
  beforeEach(() => {
    cy.task('db:seed');
    cy.visit('/register');
  });

  afterEach(() => cy.task('db:teardown', 'User'));

  it('should register new account', () => {
    const payload = {
      email: `test-${Date.now()}@test.com`,
      password: '123',
      confirmPassword: '123',
    } as RegisterRequest;

    cy.intercept({ method: 'POST', url: '/api/users' }).as('register');

    cy.dataCy('email').type(payload.email);
    cy.dataCy('password').type(payload.password);
    cy.dataCy('confirm_password').type(payload.confirmPassword);

    cy.dataCy('submit').click();

    cy.wait('@register').then(({ response }) => {
      expect(response?.body.id).to.be.a('number');
      expect(response?.statusCode).to.be.eq(201);
    });
  });

  it('should display error when email exists', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    } as RegisterRequest;

    cy.intercept({ method: 'POST', url: '/api/users' }).as('register');

    cy.dataCy('email').type(payload.email);
    cy.dataCy('password').type(payload.password);
    cy.dataCy('confirm_password').type(payload.confirmPassword);

    cy.dataCy('submit').click();

    cy.wait('@register').then(({ response }) => {
      expect(response?.statusCode).to.be.eq(409);
      expect(response?.body.message).to.be.eq('Email address already exists.');
    });
  });
});
