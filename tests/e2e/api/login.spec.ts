/// <reference types="cypress" />

type ValidationError = { field: string; message: string };

type ValidationErrors = ValidationError[];

describe('Login - API', () => {
  beforeEach(() => cy.task('db:seed'));
  afterEach(() => cy.task('db:teardown', 'User'));

  it('Should return validation errors', () => {
    const payload = {
      email: '',
      password: '',
    };

    cy.request<{ errors: ValidationErrors }>({
      method: 'POST',
      url: '/api/auth/login',
      body: payload,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(422);
      expect(body.errors[0].message).to.eq('E Mail is required.');
      expect(body.errors[1].message).to.eq('Password is required.');
    });
  });

  it('should not return user when email does not exist', () => {
    const payload = {
      email: 'andjus@blic.rs',
      password: 'testpassword123',
    };

    cy.request<{ message: string }>({
      method: 'POST',
      url: '/api/auth/login',
      body: payload,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.message).to.eq('No User in database');
    });
  });

  it('should not return user when password is invalid', () => {
    const payload = {
      email: 'test@test.com',
      password: 'rgxed5bedr6556edryhcrftyhcrftyhrhdtrhd',
    };

    cy.request<{ message: string }>({
      method: 'POST',
      url: '/api/auth/login',
      body: payload,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.message).to.eq('Password kaput');
    });
  });

  it('should return token when login is successfully', () => {
    const payload = {
      email: 'test@test.com',
      password: 'password',
    };

    cy.request<{ token: string }>({
      method: 'POST',
      url: '/api/auth/login',
      body: payload,
    }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.token).to.be.a('string');
    });
  });
});
