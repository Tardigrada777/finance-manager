import { config } from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Storage } from '../domain/ports/out/storage';
import creds from './creds.json';

const SECRET_KEY = config().parsed?.GOOGLE_SPREADSHEETS_API_KEY;

/**
 * A-------------
 * |            |
 * |   cells    |
 * |            |
 * -------------B
 */
enum OutcomeZone {
  ARow = 0,
  ACol = 6,
  BRow = 8,
  BCol = 10,
}

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

  async saveOutcomeByWallet(
    wallet: string,
    payload: {
      amount: number;
    }
  ) {
    await this._doc.loadInfo();
    const sheet = this._doc.sheetsByTitle[wallet];
    if (!sheet) {
      return false;
    }
    await sheet.loadCells({
      startRowIndex: OutcomeZone.ARow,
      startColumnIndex: OutcomeZone.ACol,
      endRowIndex: OutcomeZone.BRow,
      endColumnIndex: OutcomeZone.BCol,
    });
    const today = new Date().getDay();
    const targetCell = sheet.getCell(today, OutcomeZone.ACol + 2);
    targetCell.value = payload.amount;
    await sheet.saveUpdatedCells();
    return true;
  }

  async getOutcomeOfDay(wallet: string, date: Date) {
    await this._doc.loadInfo();
    const sheet = this._doc.sheetsByTitle[wallet];
    if (!sheet) {
      return null;
    }
    await sheet.loadCells({
      startRowIndex: OutcomeZone.ARow,
      startColumnIndex: OutcomeZone.ACol,
      endRowIndex: OutcomeZone.BRow,
      endColumnIndex: OutcomeZone.BCol,
    });
    const today = new Date(date).getDay();
    const targetCell = sheet.getCell(today, OutcomeZone.ACol + 2);
    return targetCell.value !== null ? Number(targetCell.value) : 0;
  }

  async findWalletByName(name: string) {
    return { id: '1', name };
  }
}
