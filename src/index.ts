import {createApp} from './app/app.factory';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const app = createApp();

  await app.run();
})();
