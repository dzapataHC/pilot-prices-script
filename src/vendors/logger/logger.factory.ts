import pino, {type LoggerOptions} from 'pino';

import type {ILogger} from './logger.types';
import {PinoLogger} from './pino.logger';

export function createLogger(): ILogger {
  const isProduction = false;

  const options: LoggerOptions = {
    level: isProduction ? 'info' : 'debug',
  };

  if (!isProduction) {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  return new PinoLogger(pino(options));
}
