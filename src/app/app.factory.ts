import {App} from './app';
import {Application} from './app.types';

export function createApp(): Application {
  return new App();
}
