import { defineConfig } from 'cypress';
import { prisma } from './src/lib/prisma';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3005',
    specPattern: 'tests/e2e/**/*.spec.ts',
    supportFile: 'tests/support/index.ts',
    fixturesFolder: 'tests/fixtures',
    screenshotsFolder: 'tests/screenshots',
    videosFolder: 'tests/videos',
    video: false,
    setupNodeEvents(on, _config) {
      on('task', {
        'db:teardown': async () => {
          await prisma.$executeRaw`DELETE FROM User;`;
          await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = "User";`;
          return null;
        },
        'db:seed': async () => {
          return await prisma.user.create({
            data: {
              email: 'test@test.com',
              password: '$2a$10$K7VSPDTds8IXX0A3idIOV.Cy43zZYJDNeVc3nRiNLvgx.FQYVgF8m', // password
            },
          });
        },
      });
    },
  },
  env: {
    apiUrl: '/api/v1',
  },
});
