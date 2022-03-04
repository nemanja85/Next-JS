/// <reference types="cypress" />

module.exports = (on: Cypress.PluginEvents, _config: Cypress.PluginConfigOptions) => {
  on('task', {
    'db:teardown': async () => {
      const { prisma } = require('@lib/prisma');
      await prisma.$executeRaw`DELETE FROM User;`;
      await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'User';`;

      return null;
    },
    'db:seed': async () => {
      const { prisma } = require('@lib/prisma');
      return await prisma.user.create({
        data: {
          email: 'test@test.com',
          password: '$2a$10$K7VSPDTds8IXX0A3idIOV.Cy43zZYJDNeVc3nRiNLvgx.FQYVgF8m', // password
        },
      });
    },
  });
};
