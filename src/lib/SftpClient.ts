import SFTP from 'ssh2-sftp-client';

import {envs} from '../config/envs';

export class SftpClient {
  constructor(
    private port = envs.SFTP_PORT,
    private host = envs.SFTP_HOST,
    private pass = envs.SFTP_PASS,
    private user = envs.SFTP_USER,
    private sftp = new SFTP(),
  ) {}

  async connect(): Promise<void> {
    await this.sftp
      .connect({
        host: this.host,
        port: this.port,
        username: this.user,
        password: this.pass,
      })
      .then(() => console.log('\n[+] Connected to SFTP'));
  }

  async read(path: string) {
    return this.sftp.list(path);
  }

  async saveFile(origin: string, targetLocation: string): Promise<void> {
    try {
      await this.sftp.fastGet(origin, targetLocation);
      console.log('\n[+] File downloaded succesfully');
    } catch (error) {
      console.error(
        `\n[X] There was an error downlaoding the file ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async disconnect() {
    await this.sftp.end();
  }
}
