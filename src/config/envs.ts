import 'dotenv/config';

interface IEnvs {
  SFTP_HOST: string;
  SFTP_PORT: number;
  SFTP_USER: string;
  SFTP_PASS: string;
  DITAT_BASE: string;
  DITAT_ACCOUNT: string;
  DITAT_USERNAME: string;
  DITAT_PASSWORD: string;
}

const variables = process.env;

export const envs: IEnvs = {
  SFTP_HOST: variables.SFTP_HOST as string,
  SFTP_PORT: variables.SFTP_PORT as unknown as number,
  SFTP_USER: variables.SFTP_USER as string,
  SFTP_PASS: variables.SFTP_PASS as string,
  DITAT_BASE: variables.DITAT_BASE as string,
  DITAT_ACCOUNT: variables.DITAT_ACCOUNT as string,
  DITAT_USERNAME: variables.DITAT_USERNAME as string,
  DITAT_PASSWORD: variables.DITAT_PASSWORD as string,
};
