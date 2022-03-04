/// <reference types="cypress" />

import { User } from '@prisma/client';

describe('Users - API', () => {
  beforeEach(() => cy.task('db:seed'));
  afterEach(() => cy.task('db:teardown', 'User'));

  context('GET', () => {
    it('should return list of users', () => {
      const url = '/api/users';

      cy.request<{ data: User[] }>(url).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.property('data');
        expect(body.data).to.be.a('array');
      });
    });

    it('should return specified columns', () => {
      const fields = 'id,email';
      const url = `/api/users?fields=${fields}`;

      cy.request<{ data: User[] }>(url).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.property('data');

        expect(body.data[0].id).to.be.a('number');
        expect(body.data[0].email).to.be.a('string');
        expect(body.data[0].password).to.be.undefined;
        expect(body.data[0].role).not.exist;
      });
    });

    it('should return user successfully', () => {
      const id = 1;
      const url = `/api/users/${id}`;

      cy.request<User>(url).then(({ status, body }) => {
        expect(status).to.eq(200);

        expect(body.id).to.be.a('number');
        expect(body.id).to.be.eq(id);
        expect(body.email).to.be.a('string');
      });
    });

    it('should return 404, when user does not exist', () => {
      const id = 555;
      const url = `/api/users/${id}`;

      cy.request<{ message: string }>({
        url,
        method: 'GET',
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(404);

        expect(body.message).to.be.a('string');
        expect(body.message).to.eq('User not found.');
      });
    });
  });

  context('POST', () => {
    it('should insert user successfully', () => {
      const url = `/api/users`;
      const payload = {
        email: `test${Date.now()}@test.com`,
        password: 'test1234',
      };

      cy.request<{ id: number }>('POST', url, payload).then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body.id).to.be.a('number');
        expect(body.id).to.gt(0);
      });
    });

    it('should not create user, when email exists', () => {
      const url = `/api/users`;
      const payload = {
        email: `test${Date.now()}@test.com`,
        password: 'test1234',
      };

      cy.request<{ id: number }>('POST', url, payload).then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body.id).to.be.a('number');
        expect(body.id).to.gt(0);
      });
    });
  });

  context('PUT', () => {
    it('should update user successfully', () => {
      const id = 1;
      const url = `/api/users/${id}`;
      const payload = {
        email: `update@test.com`,
        password: 'update-test1234',
      };

      cy.request(url).then(({ body }) => {
        expect(body.email).to.eq('test@test.com');
      });

      cy.request({
        url,
        method: 'PUT',
        body: payload,
      }).then(({ status }) => {
        expect(status).to.eq(204);
      });

      cy.request(url).then(({ body }) => {
        expect(body.email).to.eq(payload.email);
      });
    });

    it('should not update user, when email is emp', () => {
      const url = `/api/users/1`;
      const payload = {
        email: '',
        password: 'update-test1234',
      };

      cy.request<{ errors: [{ field: string; message: string }] }>({
        url,
        method: 'PUT',
        body: payload,
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(422);
        expect(body.errors[0].field).to.eq('email');
        expect(body.errors[0].message).to.eq('E Mail is required.');
      });
    });

    it('should not update user, when user does not exist', () => {
      const url = `/api/users/6645`;
      const payload = {
        email: `update@test.com`,
        password: 'update-test1234',
      };

      cy.request<{ message: string }>({
        url,
        method: 'PUT',
        body: payload,
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.message).to.eq('User not found.');
      });
    });
  });

  context('DELETE', () => {
    it('should delete user when user exists', () => {
      const id = 1;
      const url = `/api/users/${id}`;

      cy.request({
        method: 'DELETE',
        url,
      }).then(({ status }) => {
        expect(status).to.eq(204);
      });
    });

    it('should not delete user when user does not exist', () => {
      const id = 6645;
      const url = `/api/users/${id}`;

      cy.request<{ message: string }>({
        method: 'DELETE',
        url,
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(404);
        expect(body.message).to.eq('User not found.');
      });
    });
  });
});
