import { resolve } from 'path';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { drive, auth, drive_v3 } from '@googleapis/drive';
import { getISODay } from 'date-fns';
import { Storage } from '../domain/ports/out/storage';
import creds from './creds.json';

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

enum OutcomeColumn {
  Row = 0,
  Col = 8,
}

enum IncomePLanCell {
  Row = 2,
  Col = 1,
}

export class SpreadSheetsAdapter implements Storage {
  private readonly _doc: GoogleSpreadsheet;
  private _drive: drive_v3.Drive;

  constructor(private readonly _spreadSheetId: string) {
    this._doc = new GoogleSpreadsheet(this._spreadSheetId);
    this._drive = drive({ version: 'v3' });
  }

  async init() {
    await this._doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });
    const googleAuth = new auth.GoogleAuth({
      keyFilename: resolve(__dirname, 'creds.json'),
      scopes: 'https://www.googleapis.com/auth/drive',
    });
    const authClient = await googleAuth.getClient();
    this._drive = drive({
      version: 'v3',
      auth: authClient,
    });
  }

  /**
   * Saves incoming outcome transaction by wallet into
   * cell with date eq to now.
   *
   * @param wallet    Wallet name (for searching in sheets list).
   * @param payload   Object with data about transaction, e.g. amont.
   */
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
    const today = getISODay(new Date());
    const targetCell = sheet.getCell(today, OutcomeZone.ACol + 2);
    targetCell.value = payload.amount;
    await sheet.saveUpdatedCells();
    return true;
  }

  /**
   * Gets outcomes of the day.
   *
   * @param wallet    Wallet name.
   * @param date      Date.
   */
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
    const today = getISODay(new Date());
    const targetCell = sheet.getCell(today, OutcomeZone.ACol + 2);
    return targetCell.value !== null ? Number(targetCell.value) : 0;
  }

  /**
   * Saves copy of current worksheet.
   */
  async makeArchive() {
    const currentFile = await this._drive.files.get({
      fileId: this._spreadSheetId,
    });
    await this._drive.files.copy({
      fileId: this._spreadSheetId,
      requestBody: {
        name: `ARCHIVE: ${currentFile.data.name} - ${new Date().toISOString()}`,
      },
    });
    return true;
  }

  /**
   * Clears all user's data from the current worksheet for all wallets.
   */
  async clearWalletsData() {
    await this._doc.loadInfo();
    const sheets = this._doc.sheetsByTitle;
    for (const walletName of Object.keys(sheets)) {
      const walletSheet = sheets[walletName];
      await walletSheet.loadCells();
      for (let cell = 1; cell < 8; cell += 1) {
        const outcomeCell = walletSheet.getCell(cell, OutcomeColumn.Col);
        outcomeCell.value = 0;
      }
      const planCell = walletSheet.getCell(
        IncomePLanCell.Row,
        IncomePLanCell.Col
      );
      planCell.value = 0;
      await walletSheet.saveUpdatedCells();
    }
    return false;
  }
}
