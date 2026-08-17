export abstract class MigrationError extends Error {
  abstract readonly code: string;
  readonly context?: Record<string, unknown> | undefined;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
  }
}
