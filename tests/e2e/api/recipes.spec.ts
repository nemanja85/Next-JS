/// <reference types="cypress" />

describe('Recipes - API', () => {
  it('should return bad request when token  not provided', () => {
    cy.request<{ message: string }>({
      method: 'GET',
      url: '/api/recipes',
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.be.eq(401);
      expect(body.message).to.eq('You are unauthorized.');
    });
  });

  it('should accept only Bearer tokens', () => {
    cy.request<{ message: string }>({
      method: 'GET',
      url: '/api/recipes',
      failOnStatusCode: false,
      headers: {
        authorization: 'Bearer <token>',
      },
    }).then(({ status, body }) => {
      console.log('res', body);

      expect(status).to.be.eq(400);
      expect(body.message).to.eq('Only bearer (JWT) tokens allowed.');
    });
  });
});
