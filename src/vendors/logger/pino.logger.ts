import type pino from 'pino';

import type {ILogger} from './logger.types';

export class PinoLogger implements ILogger {
  constructor(private readonly instance: pino.Logger) {}

  info(message: string, metadata?: Record<string, unknown>): void {
    if (metadata) this.instance.info(metadata, message);
    else this.instance.info(message);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (metadata) this.instance.warn(metadata, message);
    else this.instance.warn(message);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    if (metadata) this.instance.error(metadata, message);
    else this.instance.error(message);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (metadata) this.instance.debug(metadata, message);
    else this.instance.debug(message);
  }

  child(context: Record<string, unknown>): ILogger {
    return new PinoLogger(this.instance.child(context));
  }
}
