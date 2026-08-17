import {PayloadFormat} from '../utils/payloadFormatter.util';

export interface Application {
  connect(): Promise<void>;
  saveFile(): Promise<void>;
  transformFile(): Promise<PayloadFormat | undefined>;
  uploadFile(): Promise<void>;
  run(): Promise<void>;
}
