import { config } from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Storage } from '../domain/ports/out/storage';
import creds from './creds.json';

const SECRET_KEY = config().parsed?.GOOGLE_SPREADSHEETS_API_KEY;

export class SpreadSheetsAdapter implements Storage {
  private readonly _doc: GoogleSpreadsheet;

  constructor(private readonly _spreadSheetId: string) {
    this._doc = new GoogleSpreadsheet(this._spreadSheetId);
    this._doc.useApiKey(SECRET_KEY || '');
  }

  async init() {
    await this._doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
  }

  async saveByWalletId(
    id: string,
    payload: {
      amount: number;
      type: 1 | 0;
      datetime: Date;
    }
  ) {
    await this._doc.loadInfo();
    console.log(this._doc.sheetCount);
    const sheet = await this._doc.addSheet({
      title: `Title: ${new Date().toISOString()}`,
    });
    console.log('sheet', sheet);
    console.log(
      `${payload.datetime.toISOString()}: ${payload.type ? '+' : '-'}${
        payload.amount
      }`
    );
    return true;
  }
}
